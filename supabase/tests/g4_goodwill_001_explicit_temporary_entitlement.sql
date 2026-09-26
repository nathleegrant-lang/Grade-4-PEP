-- G4-GOODWILL-001 focused regression harness.
-- Execute only on an isolated/non-production database after the migration.
-- All synthetic rows roll back.
begin;

insert into auth.users (
 id,instance_id,aud,role,email,encrypted_password,email_confirmed_at,
 raw_app_meta_data,raw_user_meta_data,created_at,updated_at
) values
('00000000-0000-4000-8000-00000000a101','00000000-0000-0000-0000-000000000000','authenticated','authenticated','gw-parent@example.invalid','',now(),'{"provider":"email","providers":["email"]}','{"full_name":"GW Parent"}',now(),now()),
('00000000-0000-4000-8000-00000000a102','00000000-0000-0000-0000-000000000000','authenticated','authenticated','gw-admin@example.invalid','',now(),'{"provider":"email","providers":["email"]}','{"full_name":"GW Admin"}',now(),now());
update public.profiles set role='admin' where id='00000000-0000-4000-8000-00000000a102';

insert into public.students(id,parent_id,full_name,grade_level)
values('00000000-0000-4000-8000-00000000b101','00000000-0000-4000-8000-00000000a101','GW Student',4);

-- GW1: a normal payment-backed subscription remains valid and classified payment.
insert into public.payments(id,parent_id,grade,plan_code,amount_jmd,status,verified_at,verified_by)
values('00000000-0000-4000-8000-00000000c101','00000000-0000-4000-8000-00000000a101','grade4','standard_monthly',3000,'verified',now(),'00000000-0000-4000-8000-00000000a102');
insert into public.subscriptions(id,parent_id,grade,plan_code,status,starts_at,expires_at,max_students,payment_id)
values('00000000-0000-4000-8000-00000000d101','00000000-0000-4000-8000-00000000a101','grade4','standard_monthly','active',now(),now()+interval '30 days',1,'00000000-0000-4000-8000-00000000c101');
do $$ begin
 if not exists(select 1 from public.subscriptions where id='00000000-0000-4000-8000-00000000d101' and access_source='payment' and payment_id is not null)
 then raise exception 'GW1: existing paid subscription compatibility failed'; end if;
end $$;

-- End the synthetic paid entitlement so a goodwill entitlement can be exercised separately.
update public.subscriptions set status='expired' where id='00000000-0000-4000-8000-00000000d101';

-- GW6: Parent cannot create goodwill.
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-00000000a101',true);
select set_config('request.jwt.claim.role','authenticated',true);
do $$ begin
 begin
  insert into public.subscriptions(parent_id,grade,plan_code,status,starts_at,expires_at,max_students,payment_id,access_source,goodwill_reason,goodwill_authorized_by,beneficiary_student_id)
  values(auth.uid(),'grade4','standard_monthly','active',now(),now()+interval '7 days',1,null,'goodwill','unauthorized','00000000-0000-4000-8000-00000000a102','00000000-0000-4000-8000-00000000b101');
  raise exception 'GW6: Parent created goodwill';
 exception when insufficient_privilege then null; end;
end $$;
reset role;

-- Capture the payment count before goodwill creation so GW5 proves no financial row is created.
select set_config('g4gw.payments_before', (select count(*)::text from public.payments where parent_id='00000000-0000-4000-8000-00000000a101'), true);

-- GW9/GW10: legitimate Admin grants finite, attributed goodwill.
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-00000000a102',true);
select set_config('request.jwt.claim.role','authenticated',true);
insert into public.subscriptions(id,parent_id,grade,plan_code,status,starts_at,expires_at,max_students,payment_id,access_source,goodwill_reason,goodwill_authorized_by,beneficiary_student_id)
values('00000000-0000-4000-8000-00000000d102','00000000-0000-4000-8000-00000000a101','grade4','standard_monthly','active',now()-interval '1 hour',now()+interval '7 days',1,null,'goodwill','Temporary customer recovery','00000000-0000-4000-8000-00000000a102','00000000-0000-4000-8000-00000000b101');
reset role;

-- GW2/GW4/GW5/GW10: active goodwill is premium-equivalent data, requires no payment,
-- creates/verifies no payment, and retains source/reason/Admin/beneficiary/finite dates.
do $$ declare before_payments int; after_payments int; begin
 before_payments := current_setting('g4gw.payments_before')::int;
 select count(*) into after_payments from public.payments where parent_id='00000000-0000-4000-8000-00000000a101';
 if before_payments <> after_payments then raise exception 'GW5: goodwill changed payment count'; end if;
 if not exists(select 1 from public.subscriptions where id='00000000-0000-4000-8000-00000000d102'
   and access_source='goodwill' and status='active' and plan_code='standard_monthly'
   and starts_at <= now() and expires_at > now() and payment_id is null
   and goodwill_reason='Temporary customer recovery'
   and goodwill_authorized_by='00000000-0000-4000-8000-00000000a102'
   and beneficiary_student_id='00000000-0000-4000-8000-00000000b101')
 then raise exception 'GW2/GW4/GW10: goodwill shape invalid'; end if;
end $$;

-- GW7/GW8: Parent cannot extend goodwill or change its source/beneficiary.
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-00000000a101',true);
select set_config('request.jwt.claim.role','authenticated',true);
update public.subscriptions set expires_at=expires_at+interval '30 days',access_source='payment'
where id='00000000-0000-4000-8000-00000000d102';
reset role;
do $$ begin
 if not exists(select 1 from public.subscriptions where id='00000000-0000-4000-8000-00000000d102' and access_source='goodwill' and expires_at < now()+interval '8 days')
 then raise exception 'GW7/GW8: Parent mutated protected goodwill fields'; end if;
end $$;

-- GW3: expired goodwill does not satisfy the application's active temporal predicate.
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-00000000a102',true);
update public.subscriptions set starts_at=now()-interval '8 days',expires_at=now()-interval '1 day'
where id='00000000-0000-4000-8000-00000000d102';
reset role;
do $$ begin
 if exists(select 1 from public.subscriptions where id='00000000-0000-4000-8000-00000000d102' and status='active' and expires_at > now())
 then raise exception 'GW3: expired goodwill still satisfies active temporal predicate'; end if;
end $$;

-- GW11: payment-backed entitlement can be established separately; goodwill history remains.
insert into public.payments(id,parent_id,grade,plan_code,amount_jmd,status,verified_at,verified_by)
values('00000000-0000-4000-8000-00000000c102','00000000-0000-4000-8000-00000000a101','grade4','standard_monthly',3000,'verified',now(),'00000000-0000-4000-8000-00000000a102');
insert into public.subscriptions(id,parent_id,grade,plan_code,status,starts_at,expires_at,max_students,payment_id,access_source)
values('00000000-0000-4000-8000-00000000d103','00000000-0000-4000-8000-00000000a101','grade4','standard_monthly','active',now(),now()+interval '30 days',1,'00000000-0000-4000-8000-00000000c102','payment');
do $$ begin
 if not exists(select 1 from public.subscriptions where id='00000000-0000-4000-8000-00000000d102' and access_source='goodwill' and payment_id is null)
 or not exists(select 1 from public.subscriptions where id='00000000-0000-4000-8000-00000000d103' and access_source='payment' and payment_id='00000000-0000-4000-8000-00000000c102')
 then raise exception 'GW11: settlement coexistence/history preservation failed'; end if;
end $$;

-- GW12/GW13/GW14: certified triggers/security remain installed.
do $$ begin
 if not exists(select 1 from pg_trigger where tgrelid='public.payments'::regclass and tgname='grade4_payment_funnel_event' and not tgisinternal)
 then raise exception 'GW12: G4-PAY-001 trigger missing'; end if;
 if not exists(select 1 from pg_trigger where tgrelid='public.subscriptions'::regclass and tgname='grade4_activation_funnel_event' and not tgisinternal)
 then raise exception 'GW13: G4-SUB-001 trigger missing'; end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='payments' and policyname='parents create own payments'
   and with_check like '%plan.grade = (payments.grade)::text%')
 then raise exception 'GW14: G4-SEC-002 correlation missing'; end if;
 if has_function_privilege('authenticated','public.handle_new_user()','EXECUTE')
 then raise exception 'GW14: G4-SEC-001/CORR-001 execute boundary regressed'; end if;
end $$;

-- GW15 is paired with application/build verification: account surfaces must render
-- access_source=goodwill as "Temporary goodwill access", never as payment verification.

rollback;