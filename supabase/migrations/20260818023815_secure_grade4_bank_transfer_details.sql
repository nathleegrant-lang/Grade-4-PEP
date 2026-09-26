-- Recovered from production migration history version 20260818023815.
-- Historical schema/security behavior preserved.
-- PORTABILITY DEVIATION: original live bank-transfer configuration row omitted.
create table if not exists public.bank_transfer_details (
 id text primary key, grade text not null unique, bank_name text not null, branch_name text,
 account_name text not null, account_number text not null, account_type text, is_active boolean not null default true,
 updated_at timestamptz not null default now()
);
alter table public.bank_transfer_details enable row level security;
revoke all on table public.bank_transfer_details from anon, authenticated;
