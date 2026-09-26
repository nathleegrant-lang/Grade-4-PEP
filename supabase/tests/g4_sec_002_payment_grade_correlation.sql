-- G4-SEC-002 focused regression harness.
-- Execute only on an isolated/non-production database containing the current
-- Grade 4 migrations through G4-SEC-002. All fixtures and business rows roll back.

begin;

-- Structural guard: this exact regression must never collapse back to
-- plan.grade = plan.grade.
do $$
declare policy_check text;
begin
  select with_check into strict policy_check
  from pg_policies
  where schemaname='public' and tablename='payments'
    and policyname='parents create own payments';

  if policy_check not like '%plan.grade = (payments.grade)::text%'
     and policy_check not like '%plan.grade = ((payments.grade)::text)%' then
    raise exception 'G4-SEC-002: payment/plan grade correlation is absent: %', policy_check;
  end if;
  if policy_check like '%plan.grade = plan.grade%' then
    raise exception 'G4-SEC-002: tautological plan.grade self-comparison returned';
  end if;
end $$;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
('00000000-0000-4000-8000-0000000005a1','00000000-0000-0000-0000-000000000000',
 'authenticated','authenticated','g4-sec-002-a@example.invalid','',now(),
 '{"provider":"email","providers":["email"]}','{"full_name":"G4 SEC 002 Parent A"}',now(),now()),
('00000000-0000-4000-8000-0000000005b2','00000000-0000-0000-0000-000000000000',
 'authenticated','authenticated','g4-sec-002-b@example.invalid','',now(),
 '{"provider":"email","providers":["email"]}','{"full_name":"G4 SEC 002 Parent B"}',now(),now()),
('00000000-0000-4000-8000-0000000005c3','00000000-0000-0000-0000-000000000000',
 'authenticated','authenticated','g4-sec-002-admin@example.invalid','',now(),
 '{"provider":"email","providers":["email"]}','{"full_name":"G4 SEC 002 Admin"}',now(),now());

-- Trusted fixture assignment. This is setup under the privileged test runner.
update public.profiles set role='admin'
where id='00000000-0000-4000-8000-0000000005c3';

-- T14: G4-SEC-001/CORR-001 signup and role protections remain intact.
do $$
begin
  if exists (
    select 1 from public.profiles
    where id in ('00000000-0000-4000-8000-0000000005a1','00000000-0000-4000-8000-0000000005b2')
      and role <> 'parent'::public.app_role
  ) then raise exception 'T14: signup authority is not parent'; end if;

  if has_function_privilege('anon','public.handle_new_user()','EXECUTE')
     or has_function_privilege('authenticated','public.handle_new_user()','EXECUTE')
     or not has_function_privilege('service_role','public.handle_new_user()','EXECUTE') then
    raise exception 'T14: signup trigger execute boundary changed';
  end if;

  if not exists (
    select 1 from pg_trigger
    where tgrelid='public.profiles'::regclass
      and tgname='profiles_protect_role' and not tgisinternal
  ) then raise exception 'T14: profile role protection trigger missing'; end if;
end $$;

-- T2 fixture: deliberately make a paid plan non-Grade-4. This is the key
-- regression case that the former plan.grade = plan.grade tautology accepted.
update public.pricing_plans
set grade='grade5'
where code='standard_weekly' and grade='grade4';

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-0000000005a1',true);
select set_config('request.jwt.claim.role','authenticated',true);

-- T2: Grade 4 payment correlated to a deliberately non-Grade-4 plan -> DENIED.
do $$
declare amount integer;
begin
  select price_jmd::integer into strict amount
  from public.pricing_plans where code='standard_weekly' and grade='grade5' and is_active;
  begin
    insert into public.payments(parent_id,grade,plan_code,amount_jmd,method,reference_code)
    values(auth.uid(),'grade4','standard_weekly',amount,'bank_transfer','SYNTHETIC-G4-SEC-002-T2');
    raise exception 'T2: cross-grade plan/payment correlation unexpectedly succeeded';
  exception when insufficient_privilege then null; end;
end $$;

reset role;
update public.pricing_plans set grade='grade4' where code='standard_weekly' and grade='grade5';

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-0000000005a1',true);
select set_config('request.jwt.claim.role','authenticated',true);

-- T1: valid Grade 4 Parent + active paid Grade 4 plan + authoritative price -> PASS.
insert into public.payments(parent_id,grade,plan_code,amount_jmd,method,reference_code)
select auth.uid(),'grade4','standard_monthly',price_jmd::integer,
       'bank_transfer','SYNTHETIC-G4-SEC-002-T1'
from public.pricing_plans
where code='standard_monthly' and grade='grade4' and is_active=true;

-- T3/T4/T5/T6/T7/T8/T9: existing payment protections remain enforced.
do $$
declare amount integer;
begin
  select price_jmd::integer into strict amount
  from public.pricing_plans where code='standard_weekly' and grade='grade4' and is_active=true;

  begin
    insert into public.payments(parent_id,grade,plan_code,amount_jmd,reference_code)
    values(auth.uid(),'grade4','standard_weekly',amount+1,'SYNTHETIC-G4-SEC-002-T3');
    raise exception 'T3: wrong amount accepted';
  exception when insufficient_privilege then null; end;

  begin
    insert into public.payments(parent_id,grade,plan_code,amount_jmd,reference_code)
    values('00000000-0000-4000-8000-0000000005b2','grade4','standard_weekly',amount,'SYNTHETIC-G4-SEC-002-T6');
    raise exception 'T6: cross-parent payment accepted';
  exception when insufficient_privilege then null; end;

  begin
    insert into public.payments(parent_id,grade,plan_code,amount_jmd,status,reference_code)
    values(auth.uid(),'grade4','standard_weekly',amount,'verified','SYNTHETIC-G4-SEC-002-T7');
    raise exception 'T7: forged verified status accepted';
  exception when insufficient_privilege then null; end;

  begin
    insert into public.payments(parent_id,grade,plan_code,amount_jmd,verified_by,verified_at,reference_code)
    values(auth.uid(),'grade4','standard_weekly',amount,
      '00000000-0000-4000-8000-0000000005c3',now(),'SYNTHETIC-G4-SEC-002-T8');
    raise exception 'T8: forged verification attribution accepted';
  exception when insufficient_privilege then null; end;

  begin
    insert into public.payments(parent_id,grade,plan_code,amount_jmd,status,rejection_reason,reference_code)
    values(auth.uid(),'grade4','standard_weekly',amount,'rejected','forged','SYNTHETIC-G4-SEC-002-T9');
    raise exception 'T9: forged rejection state accepted';
  exception when insufficient_privilege then null; end;
end $$;

-- T5: free plan is never a valid Parent payment.
do $$
declare amount integer;
begin
  select price_jmd::integer into strict amount
  from public.pricing_plans where code='free' and grade='grade4' and is_active=true;
  begin
    insert into public.payments(parent_id,grade,plan_code,amount_jmd,reference_code)
    values(auth.uid(),'grade4','free',amount,'SYNTHETIC-G4-SEC-002-T5');
    raise exception 'T5: free plan payment accepted';
  exception when insufficient_privilege then null; end;
end $$;

-- T4 requires an inactive authoritative plan. Capture its authoritative
-- amount while still in privileged fixture/setup context because the existing
-- pricing_plans_public_read RLS policy correctly hides inactive plans.
reset role;
select set_config('g4_sec_002.t4_amount', price_jmd::integer::text, true)
from public.pricing_plans
where code='standard_weekly' and grade='grade4' and is_active=true;
update public.pricing_plans set is_active=false where code='standard_weekly' and grade='grade4';
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-0000000005a1',true);
select set_config('request.jwt.claim.role','authenticated',true);
do $t4$
declare amount integer := current_setting('g4_sec_002.t4_amount')::integer;
begin
  begin
    insert into public.payments(parent_id,grade,plan_code,amount_jmd,reference_code)
    values(auth.uid(),'grade4','standard_weekly',amount,'SYNTHETIC-G4-SEC-002-T4');
    raise exception 'T4: inactive plan payment accepted';
  exception when insufficient_privilege then null; end;
end $t4$;

reset role;
update public.pricing_plans set is_active=true where code='standard_weekly' and grade='grade4';

-- T11/T12: G4-PAY-001 remains compatible and direct analytics writes stay denied.
do $$
begin
  if not exists (
    select 1 from public.funnel_events
    where event_name='payment_submitted'
      and user_id='00000000-0000-4000-8000-0000000005a1'
      and metadata->>'method'='bank_transfer'
  ) then raise exception 'T11: protected payment funnel event missing'; end if;

  if has_table_privilege('authenticated','public.funnel_events','INSERT') then
    raise exception 'T12: authenticated gained direct funnel_events INSERT';
  end if;
end $$;

-- T10: legitimate Admin payment authority remains intact.
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-0000000005c3',true);
select set_config('request.jwt.claim.role','authenticated',true);
insert into public.payments(parent_id,grade,plan_code,amount_jmd,method,reference_code)
select '00000000-0000-4000-8000-0000000005b2','grade4','standard_weekly',
       price_jmd::integer,'bank_transfer','SYNTHETIC-G4-SEC-002-T10'
from public.pricing_plans
where code='standard_weekly' and grade='grade4' and is_active=true;

do $$
begin
  if not public.is_admin() then raise exception 'T10: trusted Admin authority lost'; end if;
  if not exists(select 1 from public.payments where reference_code='SYNTHETIC-G4-SEC-002-T10') then
    raise exception 'T10: Admin payment authority failed';
  end if;
end $$;

-- T13: G4-SUB-001 remains compatible: Admin can activate the Parent's
-- subscription and the protected activation funnel event is emitted.
do $$
declare payment_uuid uuid; sub_uuid uuid;
begin
  select id into strict payment_uuid from public.payments
  where reference_code='SYNTHETIC-G4-SEC-002-T1';

  insert into public.subscriptions(parent_id,grade,plan_code,status,payment_id)
  values('00000000-0000-4000-8000-0000000005a1','grade4','standard_monthly','pending',payment_uuid)
  returning id into strict sub_uuid;

  update public.subscriptions
  set status='active',starts_at=now(),expires_at=now()+interval '30 days'
  where id=sub_uuid;

  if not exists(select 1 from public.subscriptions where id=sub_uuid and status='active') then
    raise exception 'T13: Admin activation failed';
  end if;
end $$;

reset role;
do $$
begin
  if not exists (
    select 1 from public.funnel_events
    where event_name='access_activated'
      and user_id='00000000-0000-4000-8000-0000000005a1'
  ) then raise exception 'T13: protected activation funnel event missing'; end if;

  if not exists (
    select 1 from pg_policies
    where schemaname='public' and tablename='subscriptions'
      and policyname='admins manage subscriptions' and cmd='ALL'
  ) then raise exception 'T13: Admin subscription policy missing'; end if;
end $$;

rollback;
