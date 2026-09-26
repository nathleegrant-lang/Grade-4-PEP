-- Recovered from production migration history version 20260818025913.
create table if not exists public.internal_test_sessions (
 session_id text primary key, user_id uuid references auth.users(id) on delete cascade, identified_at timestamptz not null default now()
);
alter table public.internal_test_sessions enable row level security;
revoke all on table public.internal_test_sessions from anon, authenticated;
