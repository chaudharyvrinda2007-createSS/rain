create extension if not exists pgcrypto;

create table if not exists public.enquiries (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  mobile text not null,
  email text not null,
  country text not null,
  product text,
  quantity text,
  message text not null,
  date_time text not null,
  dedupe_key text not null unique,
  source_url text,
  ip_address text,
  user_agent text,
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.enquiries enable row level security;

create index if not exists enquiries_created_at_idx on public.enquiries (created_at desc);
create index if not exists enquiries_email_idx on public.enquiries (email);
create index if not exists enquiries_dedupe_key_idx on public.enquiries (dedupe_key);
create index if not exists enquiries_ip_address_idx on public.enquiries (ip_address);

-- Keep the table private. The Netlify function uses the Supabase service-role key.
-- Do not expose the service-role key in frontend code.

-- ---------------------------------------------------------------------
-- MIGRATION: run this block if the "enquiries" table already exists
-- from an earlier version of this project (safe to re-run).
-- ---------------------------------------------------------------------
alter table public.enquiries add column if not exists quantity text;
alter table public.enquiries alter column company drop not null;
alter table public.enquiries alter column product drop not null;
