-- Run on an isolated database with the Grade 4 foundation, G4-PAY-001,
-- G4-SEC-001 (when testing the combined security candidate), and G4-SUB-001.
-- Every synthetic identity and business row is rolled back.
begin;

do $$ begin
  if not (select prosecdef from pg_proc where oid = 'public.track_grade4_activation_funnel()'::regprocedure)
     or not exists (
       select 1 from pg_proc p, pg_options_to_table(p.proconfig) o
       where p.oid = 'public.track_grade4_activation_funnel()'::regprocedure
         and o.option_name = 'search_path' and o.option_value = quote_ident(''))
     or has_function_privilege('authenticated','public.track_grade4_activation_funnel()','EXECUTE')
     or has_function_privilege('anon','public.track_grade4_activation_funnel()','EXECUTE') then
    raise exception 'S1/S4: activation trigger function privilege configuration is unsafe';
  end if;
  if has_table_privilege('authenticated','public.funnel_events','INSERT') then
    raise exception 'S5: authenticated users can directly write funnel events';
  end if;
end $$;

insert into auth.users (id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,
  raw_app_meta_data,raw_user_meta_data,created_at,updated_at)
values
('00000000-0000-4000-8000-0000000003a1','00000000-0000-0000-0000-000000000000',
 'authenticated','authenticated','g4-sub-parent@example.invalid','',now(),
 '{"provider":"email","providers":["email"]}','{"full_name":"Synthetic Parent"}',now(),now()),
('00000000-0000-4000-8000-0000000003b2','00000000-0000-0000-0000-000000000000',
 'authenticated','authenticated','g4-sub-admin@example.invalid','',now(),
 '{"provider":"email","providers":["email"]}','{"full_name":"Synthetic Admin"}',now(),now());

-- Trusted fixture assignment; ordinary customer privileges never run this statement.
update public.profiles set role='admin' where id='00000000-0000-4000-8000-0000000003b2';

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-0000000003a1',true);
select set_config('request.jwt.claim.role','authenticated',true);

do $$ begin
  begin
    insert into public.funnel_events(event_name,user_id) values('access_activated',auth.uid());
    raise exception 'S4: Parent directly forged activation event';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.subscriptions(parent_id,grade,plan_code,status)
    values(auth.uid(),'grade4','standard_monthly','active');
    raise exception 'S6: Parent directly created an active subscription';
  exception when insufficient_privilege then null; end;
end $$;

-- Existing G4-PAY-001 path must still work for a valid Parent payment.
insert into public.payments(parent_id,grade,plan_code,amount_jmd,method,reference_code)
select auth.uid(),'grade4','standard_monthly',price_jmd::integer,
  'bank_transfer','SYNTHETIC-G4-SUB-001'
from public.pricing_plans where grade='grade4' and code='standard_monthly' and is_active;

select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-0000000003b2',true);
do $$
declare sub_id uuid; event_count integer;
begin
  if not public.is_admin() then raise exception 'S7: trusted Admin not recognized'; end if;
  insert into public.subscriptions(parent_id,grade,plan_code,status,payment_id)
  select '00000000-0000-4000-8000-0000000003a1','grade4','standard_monthly',
    'pending',p.id from public.payments p where p.reference_code='SYNTHETIC-G4-SUB-001'
  returning id into strict sub_id;

  update public.subscriptions set status='active',starts_at=now(),expires_at=now()+interval '30 days'
    where id=sub_id;
  if not found then raise exception 'S1/S3: Admin activation did not persist'; end if;
  if not exists (select 1 from public.subscriptions where id=sub_id and status='active') then
    raise exception 'S1/S7: Admin cannot read activated subscription';
  end if;

  -- The test runner inspects protected analytics under its privileged context below.
  update public.subscriptions set status='active' where id=sub_id;
end $$;

reset role;
do $$
declare sub_id uuid; event_count integer;
begin
  select s.id into strict sub_id from public.subscriptions s
    where s.parent_id='00000000-0000-4000-8000-0000000003a1' and s.status='active';
  select count(*) into event_count from public.funnel_events
    where event_name='access_activated' and metadata->>'subscription_id'=sub_id::text;
  if event_count <> 1 then raise exception 'S2/S10: expected exactly one activation event, got %',event_count; end if;
  if not exists (select 1 from public.funnel_events where event_name='payment_submitted'
    and user_id='00000000-0000-4000-8000-0000000003a1'
    and metadata->>'method'='bank_transfer') then
    raise exception 'S8: payment submission funnel event missing';
  end if;
  if not exists (select 1 from pg_policies where schemaname='public' and tablename='subscriptions'
    and policyname='admins manage subscriptions' and cmd='ALL') then
    raise exception 'S7: Admin subscription policy missing';
  end if;
end $$;

-- Existing active subscription cannot be changed by its Parent.
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-0000000003a1',true);
do $$ begin
  begin
    update public.subscriptions set status='cancelled' where parent_id=auth.uid();
    if found then raise exception 'S6: Parent changed subscription status'; end if;
  exception when insufficient_privilege then null; end;
end $$;

rollback;
