-- G4-GOODWILL-001: truthful temporary premium-equivalent access without payment verification.
alter table public.subscriptions
  add column access_source text not null default 'payment',
  add column goodwill_reason text,
  add column goodwill_authorized_by uuid references public.profiles(id) on delete restrict,
  add column beneficiary_student_id uuid references public.students(id) on delete restrict;

alter table public.subscriptions
  add constraint subscriptions_access_source_check
    check (access_source in ('payment','goodwill')),
  add constraint subscriptions_goodwill_shape_check
    check (
      (access_source = 'payment' and goodwill_reason is null and goodwill_authorized_by is null and beneficiary_student_id is null)
      or
      (access_source = 'goodwill'
       and payment_id is null
       and status = 'active'::public.subscription_status
       and starts_at is not null
       and expires_at is not null
       and expires_at > starts_at
       and nullif(btrim(goodwill_reason),'') is not null
       and goodwill_authorized_by is not null
       and beneficiary_student_id is not null
       and plan_code <> 'free'::public.plan_code
       and max_students = 1)
    );

create or replace function public.validate_goodwill_subscription()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.access_source = 'goodwill' then
    if not exists (
      select 1 from public.profiles p
      where p.id = new.goodwill_authorized_by and p.role = 'admin'::public.app_role
    ) then
      raise exception 'Goodwill authorization requires an Admin profile';
    end if;
    if not exists (
      select 1 from public.students s
      where s.id = new.beneficiary_student_id
        and s.parent_id = new.parent_id
        and s.grade_level = 4
    ) then
      raise exception 'Goodwill beneficiary must be a Grade 4 student owned by the entitlement parent';
    end if;
  end if;
  return new;
end
$$;

revoke all on function public.validate_goodwill_subscription() from public, anon, authenticated;

drop trigger if exists subscriptions_validate_goodwill on public.subscriptions;
create trigger subscriptions_validate_goodwill
before insert or update on public.subscriptions
for each row execute function public.validate_goodwill_subscription();

comment on column public.subscriptions.access_source is
  'Entitlement source: payment-backed or temporary goodwill. Goodwill is never payment verification.';
