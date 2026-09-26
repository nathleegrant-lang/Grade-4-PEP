-- G4-DB-001-R1: canonical Grade 4 foundation
-- Reconstructs the verified application schema that predates the first tracked production migration.
-- No customer, auth-user, payment, subscription, audit, funnel, or secret data.

create type public.app_role as enum ('admin','parent');
create type public.grade_product as enum ('grade4','grade5');
create type public.payment_status as enum ('pending','verified','rejected','expired');
create type public.plan_code as enum ('free','standard_weekly','standard_monthly','premium_family_monthly');
create type public.subscription_status as enum ('pending','active','expired','cancelled','suspended');

create table public.profiles (
 id uuid primary key references auth.users(id) on delete cascade, full_name text not null, email text, phone text,
 role public.app_role not null default 'parent', created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.payments (
 id uuid primary key default gen_random_uuid(), parent_id uuid references public.profiles(id) on delete cascade,
 grade public.grade_product not null, plan_code public.plan_code not null, amount_jmd integer not null check (amount_jmd >= 0),
 method text not null default 'bank_transfer', reference_code text, proof_url text, note text,
 status public.payment_status not null default 'pending', submitted_at timestamptz not null default now(),
 verified_at timestamptz, verified_by uuid references public.profiles(id), rejection_reason text
);
create table public.subscriptions (
 id uuid primary key default gen_random_uuid(), parent_id uuid not null references public.profiles(id) on delete cascade,
 grade public.grade_product not null, plan_code public.plan_code not null, status public.subscription_status not null default 'pending',
 starts_at timestamptz, expires_at timestamptz, max_students integer not null default 1,
 payment_id uuid references public.payments(id) on delete set null, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.students (
 id uuid primary key default gen_random_uuid(), parent_id uuid not null references public.profiles(id) on delete cascade,
 subscription_id uuid references public.subscriptions(id) on delete set null, full_name text not null,
 grade_level integer not null check (grade_level >= 1 and grade_level <= 6), created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.pricing_plans (
 id uuid primary key default gen_random_uuid(), code text not null unique,
 grade text not null check (grade = any(array['grade4'::text,'grade5'::text])), name text not null,
 price_jmd numeric(10,2) not null default 0, period text not null, description text, features jsonb not null default '[]'::jsonb,
 max_students integer not null default 1 check (max_students > 0), badge_text text, popular boolean not null default false,
 is_active boolean not null default true, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);
create table public.site_visits (
 id uuid primary key default gen_random_uuid(), page_path text not null, session_id text not null, user_agent text, created_at timestamptz default now()
);
create table public.admin_audit_log (
 id uuid primary key default gen_random_uuid(), actor_id uuid references public.profiles(id), action text not null,
 target_table text, target_id text, details jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create unique index payments_one_pending_per_parent_grade on public.payments(parent_id,grade) where status='pending'::public.payment_status;
create unique index subscriptions_one_active_plan_per_grade on public.subscriptions(parent_id,grade)
 where status = any(array['pending'::public.subscription_status,'active'::public.subscription_status]);

create or replace function public.set_updated_at() returns trigger language plpgsql as $function$
begin new.updated_at = now(); return new; end; $function$;

-- Historical pre-G4-SEC-001 behavior; the later certified migration removes user-controlled role authority.
create or replace function public.handle_new_user() returns trigger language plpgsql security definer set search_path to 'public' as $function$
begin
 insert into public.profiles (id,full_name,email,phone,role)
 values (new.id,coalesce(new.raw_user_meta_data ->> 'full_name',split_part(coalesce(new.email,''),'@',1)),
 new.email,new.raw_user_meta_data ->> 'phone',coalesce((new.raw_user_meta_data ->> 'role')::public.app_role,'parent'))
 on conflict (id) do nothing; return new;
end; $function$;

create or replace function public.is_admin() returns boolean language sql security definer set search_path to 'public' as $function$
 select exists (select 1 from public.profiles where id=auth.uid() and role='admin'); $function$;

create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();
create trigger students_set_updated_at before update on public.students for each row execute function public.set_updated_at();
create trigger subscriptions_set_updated_at before update on public.subscriptions for each row execute function public.set_updated_at();
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.payments enable row level security;
alter table public.subscriptions enable row level security;
alter table public.students enable row level security;
alter table public.pricing_plans enable row level security;
alter table public.site_visits enable row level security;
alter table public.admin_audit_log enable row level security;

create policy "parents read own profile" on public.profiles for select using (auth.uid()=id);
create policy "parents update own profile" on public.profiles for update using (auth.uid()=id) with check (auth.uid()=id);
create policy "admins manage profiles" on public.profiles for all using (public.is_admin()) with check (public.is_admin());
create policy "parents create own payments" on public.payments for insert with check (auth.uid()=parent_id);
create policy "parents read own payments" on public.payments for select using (auth.uid()=parent_id);
create policy "admins manage payments" on public.payments for all
 using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'))
 with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "parents read own subscriptions" on public.subscriptions for select using (auth.uid()=parent_id);
create policy "admins manage subscriptions" on public.subscriptions for all
 using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'))
 with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "parents insert own students" on public.students for insert with check (auth.uid()=parent_id);
create policy "parents read own students" on public.students for select using (auth.uid()=parent_id);
create policy "parents update own students" on public.students for update using (auth.uid()=parent_id) with check (auth.uid()=parent_id);
create policy "admins manage students" on public.students for all
 using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'))
 with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "pricing_plans_public_read" on public.pricing_plans for select using (is_active=true);
create policy "pricing_plans_admin_manage" on public.pricing_plans for all
 using (exists(select 1 from public.profiles where profiles.id=auth.uid() and profiles.role='admin'))
 with check (exists(select 1 from public.profiles where profiles.id=auth.uid() and profiles.role='admin'));
create policy "admin_audit_log_admin_insert" on public.admin_audit_log for insert
 with check (exists(select 1 from public.profiles where profiles.id=auth.uid() and profiles.role='admin'));
create policy "admin_audit_log_admin_read" on public.admin_audit_log for select
 using (exists(select 1 from public.profiles where profiles.id=auth.uid() and profiles.role='admin'));
create policy "admins insert audit log" on public.admin_audit_log for insert
 with check (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));
create policy "admins read audit log" on public.admin_audit_log for select
 using (exists(select 1 from public.profiles p where p.id=auth.uid() and p.role='admin'));

grant all on public.profiles,public.payments,public.subscriptions,public.students,public.pricing_plans,public.admin_audit_log to anon,authenticated,service_role;
grant all on public.site_visits to service_role;
revoke all on public.site_visits from anon,authenticated;
grant execute on function public.handle_new_user() to public,anon,authenticated,service_role;
grant execute on function public.is_admin() to anon,authenticated,service_role;
grant execute on function public.set_updated_at() to public,anon,authenticated,service_role;
