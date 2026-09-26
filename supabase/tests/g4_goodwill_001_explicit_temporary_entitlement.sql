-- G4-GOODWILL-001 regression harness. Isolated/non-production database only.
begin;
-- GW1/GW11: existing payment-backed shape remains valid.
do $$ begin
 if exists(select 1 from public.subscriptions where access_source <> 'payment' and payment_id is not null)
 then raise exception 'GW1: payment-backed classification regression'; end if;
end $$;

-- Structural assertions for GW2-GW10/GW15.
do $$
declare def text;
begin
 select pg_get_constraintdef(oid) into def from pg_constraint
 where conrelid='public.subscriptions'::regclass and conname='subscriptions_goodwill_shape_check';
 if def not like '%payment_id IS NULL%' or def not like '%expires_at > starts_at%' then
   raise exception 'GW4/GW10: goodwill truth/finite-expiry constraint missing';
 end if;
 if not exists(select 1 from pg_trigger where tgrelid='public.subscriptions'::regclass and tgname='subscriptions_validate_goodwill' and not tgisinternal)
 then raise exception 'GW9/GW10: goodwill validation trigger missing'; end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='subscriptions' and policyname='admins manage subscriptions' and cmd='ALL')
 then raise exception 'GW9: Admin subscription authority missing'; end if;
end $$;

-- Parents remain read-only for subscriptions under RLS: no goodwill grant/extension/source/beneficiary mutation.
set local role authenticated;
select set_config('request.jwt.claim.sub','00000000-0000-4000-8000-00000000aa01',true);
do $$ begin
 if has_table_privilege('authenticated','public.subscriptions','INSERT') then
   -- Table grant may exist, but RLS must still have no Parent INSERT policy.
   if exists(select 1 from pg_policies where schemaname='public' and tablename='subscriptions' and cmd='INSERT' and policyname <> 'admins manage subscriptions')
   then raise exception 'GW6: Parent INSERT path exists'; end if;
 end if;
 if exists(select 1 from pg_policies where schemaname='public' and tablename='subscriptions' and cmd='UPDATE' and policyname <> 'admins manage subscriptions')
 then raise exception 'GW7/GW8: Parent UPDATE path exists'; end if;
end $$;
reset role;

-- Preserve certified protection objects.
do $$ begin
 if not exists(select 1 from pg_trigger where tgrelid='public.payments'::regclass and tgname='grade4_payment_funnel_event' and not tgisinternal)
 then raise exception 'GW12: G4-PAY-001 trigger missing'; end if;
 if not exists(select 1 from pg_trigger where tgrelid='public.subscriptions'::regclass and tgname='grade4_activation_funnel_event' and not tgisinternal)
 then raise exception 'GW13: G4-SUB-001 trigger missing'; end if;
 if not exists(select 1 from pg_policies where schemaname='public' and tablename='payments' and policyname='parents create own payments' and with_check like '%plan.grade = (payments.grade)::text%')
 then raise exception 'GW14: G4-SEC-002 correlation missing'; end if;
 if has_function_privilege('authenticated','public.handle_new_user()','EXECUTE')
 then raise exception 'GW14: CORR-001 execute boundary regressed'; end if;
end $$;
rollback;
