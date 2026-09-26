-- Recovered from production migration history version 20260818023858.
create or replace function public.track_grade4_payment_funnel() returns trigger language plpgsql set search_path = public as $$
begin
 if new.grade::text = 'grade4' then
  insert into public.funnel_events (event_name,user_id,grade,plan_code,page_path,metadata)
  values ('payment_submitted',new.parent_id,'grade4',new.plan_code::text,'/checkout',jsonb_build_object('payment_id',new.id,'method',new.method));
 end if; return new;
end; $$;
create or replace function public.track_grade4_activation_funnel() returns trigger language plpgsql set search_path = public as $$
begin
 if new.grade::text = 'grade4' and new.status::text = 'active'
    and (tg_op = 'INSERT' or old.status::text is distinct from 'active') then
  insert into public.funnel_events (event_name,user_id,grade,plan_code,page_path,metadata)
  values ('access_activated',new.parent_id,'grade4',new.plan_code::text,'/dashboard',
   jsonb_build_object('subscription_id',new.id,'payment_id',new.payment_id,'starts_at',new.starts_at,'expires_at',new.expires_at));
 end if; return new;
end; $$;
drop trigger if exists grade4_payment_funnel_event on public.payments;
create trigger grade4_payment_funnel_event after insert on public.payments for each row execute function public.track_grade4_payment_funnel();
drop trigger if exists grade4_activation_funnel_event on public.subscriptions;
create trigger grade4_activation_funnel_event after insert or update of status on public.subscriptions for each row execute function public.track_grade4_activation_funnel();
revoke execute on function public.track_grade4_payment_funnel() from public, anon, authenticated;
revoke execute on function public.track_grade4_activation_funnel() from public, anon, authenticated;
