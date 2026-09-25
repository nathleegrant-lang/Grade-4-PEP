-- G4-SEC-001: keep customer-supplied data outside the authority boundary.
-- This migration intentionally leaves the G4-PAY-001 funnel trigger untouched.

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, email, phone, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(coalesce(new.email, ''), '@', 1)),
    new.email,
    new.raw_user_meta_data ->> 'phone',
    'parent'::public.app_role
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

-- A direct customer update can only touch self-service fields. Service-role
-- administration retains its existing table privileges.
revoke update on public.profiles from public, anon, authenticated;
grant update (full_name, email, phone) on public.profiles to authenticated;

-- Defense in depth if a future grant accidentally becomes broader. This is
-- an invoker trigger: current_user reflects the actual database role.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.role is distinct from old.role
     and current_user not in ('postgres', 'service_role') then
    raise insufficient_privilege using message = 'Profile role changes require a trusted administrator';
  end if;
  return new;
end;
$$;

revoke all on function public.protect_profile_role() from public, anon, authenticated;

create trigger profiles_protect_role
before update on public.profiles
for each row execute function public.protect_profile_role();

-- Parent submissions must reflect an active Grade 4 plan at its authoritative
-- price and start in the review state. Admin's existing ALL policy is retained.
drop policy if exists "parents create own payments" on public.payments;
create policy "parents create own payments"
on public.payments for insert to authenticated
with check (
  parent_id = (select auth.uid())
  and grade::text = 'grade4'
  and status::text = 'pending'
  and verified_by is null
  and verified_at is null
  and rejection_reason is null
  and exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'parent'::public.app_role
  )
  and exists (
    select 1 from public.pricing_plans plan
    where plan.code = plan_code::text
      and plan.grade = grade::text
      and plan.is_active = true
      and plan.code <> 'free'
      and plan.price_jmd = amount_jmd
  )
);
