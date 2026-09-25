-- G4-SUB-001: let the authorized subscription trigger record its protected
-- activation event without granting API roles direct funnel-event writes.
create or replace function public.track_grade4_activation_funnel()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if new.grade::text = 'grade4' and new.status::text = 'active'
     and (tg_op = 'INSERT' or old.status::text is distinct from 'active') then
    insert into public.funnel_events (event_name, user_id, grade, plan_code, page_path, metadata)
    values ('access_activated', new.parent_id, 'grade4', new.plan_code::text, '/dashboard',
      jsonb_build_object('subscription_id', new.id, 'payment_id', new.payment_id,
        'starts_at', new.starts_at, 'expires_at', new.expires_at));
  end if;
  return new;
end;
$function$;

-- Only the subscriptions trigger should call this definer function.
revoke execute on function public.track_grade4_activation_funnel() from public, anon, authenticated;

comment on function public.track_grade4_activation_funnel() is
  'G4-SUB-001 trigger-only definer: records access_activated after an authorized subscription activation; direct API execution is revoked.';
