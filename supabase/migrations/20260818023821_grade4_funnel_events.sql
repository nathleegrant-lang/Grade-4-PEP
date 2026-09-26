-- Recovered from production migration history version 20260818023821.
create table if not exists public.funnel_events (
 id uuid primary key default gen_random_uuid(), event_name text not null, session_id text,
 user_id uuid references auth.users(id) on delete set null, grade text not null default 'grade4',
 plan_code text, page_path text, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create index if not exists funnel_events_event_created_idx on public.funnel_events (event_name, created_at desc);
create index if not exists funnel_events_session_created_idx on public.funnel_events (session_id, created_at desc);
create index if not exists funnel_events_user_created_idx on public.funnel_events (user_id, created_at desc);
alter table public.funnel_events enable row level security;
revoke all on table public.funnel_events from anon, authenticated;
