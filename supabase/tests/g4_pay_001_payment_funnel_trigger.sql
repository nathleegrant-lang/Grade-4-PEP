-- G4-PAY-001 focused executable regression harness.
-- Run only on an isolated/non-production Supabase database after applying the migration.
-- The transaction is rolled back so all synthetic identities and financial rows are removed.

begin;

do $$
begin
  if not exists (
    select 1 from pg_proc p
    join pg_namespace n on n.oid = p.pronamespace
    where n.nspname = 'public'
      and p.proname = 'track_grade4_payment_funnel'
      and p.prosecdef
      and exists (
        select 1
        from pg_options_to_table(p.proconfig) o
        where o.option_name = 'search_path'
          and o.option_value = quote_ident('')
      )
  ) then
    raise exception 'G4-PAY-001: trigger function is not SECURITY DEFINER with empty search_path';
  end if;

  if has_function_privilege('authenticated', 'public.track_grade4_payment_funnel()', 'EXECUTE')
     or has_function_privilege('anon', 'public.track_grade4_payment_funnel()', 'EXECUTE') then
    raise exception 'G4-PAY-001: trigger function is directly executable by an API role';
  end if;

  if has_table_privilege('authenticated', 'public.funnel_events', 'INSERT') then
    raise exception 'G4-PAY-001: authenticated received direct funnel_events INSERT privilege';
  end if;
end
$$;

-- Synthetic identities only.
insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
(
  '00000000-0000-4000-8000-0000000000a1',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'g4-pay-001-a@example.invalid', '',
  now(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Synthetic Parent A"}'::jsonb, now(), now()
),
(
  '00000000-0000-4000-8000-0000000000b2',
  '00000000-0000-0000-0000-000000000000',
  'authenticated', 'authenticated', 'g4-pay-001-b@example.invalid', '',
  now(), '{"provider":"email","providers":["email"]}'::jsonb,
  '{"full_name":"Synthetic Parent B"}'::jsonb, now(), now()
);

-- Ensure the synthetic parent profiles exist regardless of whether the environment's
-- auth-user trigger creates them automatically.
insert into public.profiles (id, full_name, email, role)
values
  ('00000000-0000-4000-8000-0000000000a1', 'Synthetic Parent A', 'g4-pay-001-a@example.invalid', 'parent'),
  ('00000000-0000-4000-8000-0000000000b2', 'Synthetic Parent B', 'g4-pay-001-b@example.invalid', 'parent')
on conflict (id) do update
set full_name = excluded.full_name, email = excluded.email, role = excluded.role;

-- Parent A session.
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000a1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

-- 1. Authorized own-payment submission must succeed.
insert into public.payments (
  parent_id, grade, plan_code, amount_jmd, method, reference_code, status
) values (
  '00000000-0000-4000-8000-0000000000a1',
  'grade4', 'standard_monthly', 1, 'bank_transfer', 'SYNTHETIC-G4-PAY-001-A', 'pending'
);

-- 2. The trigger must atomically create the intended funnel event.
-- Verify under the privileged test context; parents intentionally cannot read funnel_events.
reset role;

do $$
begin
  if not exists (
    select 1 from public.funnel_events
    where event_name = 'payment_submitted'
      and user_id = '00000000-0000-4000-8000-0000000000a1'
      and grade = 'grade4'
      and plan_code = 'standard_monthly'
      and metadata->>'method' = 'bank_transfer'
  ) then
    raise exception 'G4-PAY-001: payment_submitted funnel event missing';
  end if;
end
$$;

-- Restore Parent A before the remaining parent-context security tests.
set local role authenticated;
select set_config('request.jwt.claim.sub', '00000000-0000-4000-8000-0000000000a1', true);
select set_config('request.jwt.claim.role', 'authenticated', true);

-- 3. Cross-parent ownership must remain denied by payments RLS.
do $$
begin
  begin
    insert into public.payments (
      parent_id, grade, plan_code, amount_jmd, method, reference_code, status
    ) values (
      '00000000-0000-4000-8000-0000000000b2',
      'grade4', 'standard_monthly', 1, 'bank_transfer', 'SYNTHETIC-CROSS-PARENT', 'pending'
    );
    raise exception 'G4-PAY-001: cross-parent payment unexpectedly succeeded';
  exception
    when insufficient_privilege then null;
  end;
end
$$;

-- 4. Existing one-pending-payment duplicate safeguard must remain active.
do $$
begin
  begin
    insert into public.payments (
      parent_id, grade, plan_code, amount_jmd, method, reference_code, status
    ) values (
      '00000000-0000-4000-8000-0000000000a1',
      'grade4', 'standard_monthly', 1, 'bank_transfer', 'SYNTHETIC-DUPLICATE', 'pending'
    );
    raise exception 'G4-PAY-001: duplicate pending payment unexpectedly succeeded';
  exception
    when unique_violation then null;
  end;
end
$$;

reset role;

-- 5. Structural regression: admin payment policy and trigger remain present.
do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'payments'
      and policyname = 'admins manage payments' and cmd = 'ALL'
  ) then
    raise exception 'G4-PAY-001: admin payment policy missing';
  end if;

  if not exists (
    select 1
    from pg_trigger t
    join pg_class c on c.oid = t.tgrelid
    join pg_namespace n on n.oid = c.relnamespace
    where n.nspname = 'public' and c.relname = 'payments'
      and t.tgname = 'grade4_payment_funnel_event' and not t.tgisinternal
  ) then
    raise exception 'G4-PAY-001: payment funnel trigger missing';
  end if;
end
$$;

rollback;
