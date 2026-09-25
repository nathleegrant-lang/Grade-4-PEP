-- Run on an isolated Grade 4 database after G4-SEC-001. All fixtures roll back.
begin;

insert into auth.users (
  id, instance_id, aud, role, email, encrypted_password, email_confirmed_at,
  raw_app_meta_data, raw_user_meta_data, created_at, updated_at
) values
('00000000-0000-4000-8000-0000000001a1', '00000000-0000-0000-0000-000000000000',
 'authenticated', 'authenticated', 'g4-sec-ordinary@example.invalid', '', now(),
 '{"provider":"email","providers":["email"]}', '{"full_name":"Ordinary Parent"}', now(), now()),
('00000000-0000-4000-8000-0000000001b2', '00000000-0000-0000-0000-000000000000',
 'authenticated', 'authenticated', 'g4-sec-metadata@example.invalid', '', now(),
 '{"provider":"email","providers":["email"]}', '{"full_name":"Metadata Parent","role":"admin"}', now(), now()),
('00000000-0000-4000-8000-0000000001c3', '00000000-0000-0000-0000-000000000000',
 'authenticated', 'authenticated', 'g4-sec-admin@example.invalid', '', now(),
 '{"provider":"email","providers":["email"]}', '{"full_name":"Trusted Admin"}', now(), now());

do $$ begin
  if (select role::text from public.profiles where id='00000000-0000-4000-8000-0000000001a1') <> 'parent'
     or (select role::text from public.profiles where id='00000000-0000-4000-8000-0000000001b2') <> 'parent' then
    raise exception 'R1/R2: public signup selected an authority other than parent';
  end if;
end $$;

-- This trusted fixture setup mirrors an existing administrator assignment.
update public.profiles set role='admin'
where id='00000000-0000-4000-8000-0000000001c3';

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-0000000001a1',true);
select set_config('request.jwt.claim.role','authenticated',true);

update public.profiles set full_name='Updated Parent' where id=auth.uid();
do $$ begin
  if (select full_name from public.profiles where id=auth.uid()) <> 'Updated Parent' then
    raise exception 'R3: parent self-service field update failed';
  end if;
end $$;

do $$ begin
  begin
    update public.profiles set role='admin' where id=auth.uid();
    raise exception 'R4: self-role update unexpectedly succeeded';
  exception when insufficient_privilege then null;
  end;
  if public.is_admin() then
    raise exception 'R5: parent acquired Admin authority';
  end if;
end $$;

do $$ begin
  begin
    update public.pricing_plans set price_jmd=price_jmd+1
    where grade='grade4' and code='standard_monthly';
    if found then raise exception 'R8: parent changed Admin-only pricing'; end if;
  exception when insufficient_privilege then null;
  end;
end $$;

-- A normal Parent payment must match the live active plan's trusted price.
insert into public.payments (parent_id,grade,plan_code,amount_jmd,method,reference_code)
select auth.uid(),'grade4','standard_monthly',price_jmd::integer,'bank_transfer','SYNTHETIC-G4-SEC-001'
from public.pricing_plans where grade='grade4' and code='standard_monthly' and is_active=true;

do $$ begin
  if not exists (select 1 from public.payments where parent_id=auth.uid()
                 and reference_code='SYNTHETIC-G4-SEC-001' and status='pending'
                 and verified_by is null and verified_at is null and rejection_reason is null) then
    raise exception 'R9/R10: legitimate pending submission missing';
  end if;
end $$;

-- A second parent may not forge state, reviewer attribution, or plan amount.
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-0000000001b2',true);
do $$
declare amount integer;
begin
  select price_jmd::integer into strict amount from public.pricing_plans
  where grade='grade4' and code='standard_monthly' and is_active=true;
  begin
    insert into public.payments(parent_id,grade,plan_code,amount_jmd,status)
    values(auth.uid(),'grade4','standard_monthly',amount,'verified');
    raise exception 'R10: forged initial status accepted';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.payments(parent_id,grade,plan_code,amount_jmd,verified_by,verified_at)
    values(auth.uid(),'grade4','standard_monthly',amount,
           '00000000-0000-4000-8000-0000000001c3',now());
    raise exception 'R11: forged verification accepted';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.payments(parent_id,grade,plan_code,amount_jmd,rejection_reason)
    values(auth.uid(),'grade4','standard_monthly',amount,'forged rejection');
    raise exception 'R11: forged rejection accepted';
  exception when insufficient_privilege then null; end;
  begin
    insert into public.payments(parent_id,grade,plan_code,amount_jmd)
    values(auth.uid(),'grade4','standard_monthly',amount+1);
    raise exception 'R10: arbitrary amount accepted';
  exception when insufficient_privilege then null; end;
end $$;

reset role;
do $$ begin
  if not exists (select 1 from public.funnel_events where event_name='payment_submitted'
                 and user_id='00000000-0000-4000-8000-0000000001a1'
                 and metadata->>'method'='bank_transfer') then
    raise exception 'R12: G4-PAY-001 funnel trigger failed';
  end if;
  if has_table_privilege('authenticated','public.funnel_events','INSERT') then
    raise exception 'R13: parent has direct funnel write privilege';
  end if;
  if not exists(select 1 from pg_policies where schemaname='public' and tablename='payments'
                and policyname='admins manage payments' and cmd='ALL')
     or not exists(select 1 from pg_policies where schemaname='public' and tablename='subscriptions'
                   and policyname='admins manage subscriptions' and cmd='ALL') then
    raise exception 'R14: Admin policy missing';
  end if;
end $$;

set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-0000000001c3',true);
select set_config('request.jwt.claim.role','authenticated',true);
do $$ begin
  if not public.is_admin() then raise exception 'R6/R7: trusted Admin lost authority'; end if;
  if not exists(select 1 from public.payments
                where reference_code='SYNTHETIC-G4-SEC-001') then
    raise exception 'R7/R14: Admin cannot read customer payments';
  end if;
end $$;

rollback;
