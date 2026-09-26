-- Recovered from production migration history version 20260818025858.
-- PORTABILITY DEVIATION: historical UPDATE containing production/admin/test email identities omitted.
alter table public.profiles add column if not exists is_internal_test boolean not null default false;
create schema if not exists private;
revoke all on schema private from public, anon, authenticated;
create or replace function private.record_grade4_registration_completed() returns trigger language plpgsql security definer
set search_path = public, auth, pg_temp as $$
begin
 insert into public.funnel_events (event_name,user_id,grade,metadata)
 values ('registration_completed',new.id,'grade4',jsonb_build_object('source','auth_user_created'));
 return new;
end; $$;
revoke all on function private.record_grade4_registration_completed() from public, anon, authenticated;
drop trigger if exists grade4_registration_completed on auth.users;
create trigger grade4_registration_completed after insert on auth.users for each row execute function private.record_grade4_registration_completed();
