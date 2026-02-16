-- Optional: Supabase persistence for admin-only registered users list
-- Table name must be: registered_users

create table if not exists public.registered_users (
  id text primary key,
  email text not null,
  first_name text,
  last_name text,
  created_at timestamptz not null default now()
);

create index if not exists registered_users_created_at_idx
  on public.registered_users (created_at desc);
