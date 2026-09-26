-- Recovered from production migration history version 20260818042649.
create table if not exists public.checkout_intents (
 id uuid primary key default gen_random_uuid(), parent_id uuid not null references auth.users(id) on delete cascade,
 grade text not null default 'grade4' check (grade = 'grade4'), plan_code text not null,
 created_at timestamptz not null default now(), expires_at timestamptz not null
);
create index if not exists checkout_intents_parent_created_idx on public.checkout_intents (parent_id, created_at desc);
alter table public.checkout_intents enable row level security;
revoke all on table public.checkout_intents from anon, authenticated;
