-- G4-PAY-001: allow the payment trigger to write its narrowly-scoped analytics event
-- without granting authenticated parents direct INSERT access to funnel_events.

create or replace function public.track_grade4_payment_funnel()
returns trigger
language plpgsql
security definer
set search_path = ''
as $function$
begin
  if new.grade::text = 'grade4' then
    insert into public.funnel_events (
      event_name,
      user_id,
      grade,
      plan_code,
      page_path,
      metadata
    )
    values (
      'payment_submitted',
      new.parent_id,
      'grade4',
      new.plan_code::text,
      '/checkout',
      jsonb_build_object('payment_id', new.id, 'method', new.method)
    );
  end if;

  return new;
end;
$function$;

-- The function is trigger-only. Do not expose the definer capability as an RPC.
revoke execute on function public.track_grade4_payment_funnel() from public;
revoke execute on function public.track_grade4_payment_funnel() from anon;
revoke execute on function public.track_grade4_payment_funnel() from authenticated;

comment on function public.track_grade4_payment_funnel() is
  'G4-PAY-001 trigger-only definer: records payment_submitted after a valid payments INSERT; direct execution is revoked from API roles.';
