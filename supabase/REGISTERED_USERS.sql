-- Supabase SQL: registered users list (admin-only)
-- Run this in the Supabase SQL Editor.

create table if not exists public.registered_users (
  user_id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  first_name text,
  last_name text,
  created_at timestamptz not null default now()
);

create index if not exists registered_users_created_at_idx
  on public.registered_users (created_at desc);

alter table public.registered_users enable row level security;

-- Admin-only read. If you want multiple admins, extend this check.
drop policy if exists "admin_can_read_registered_users" on public.registered_users;
create policy "admin_can_read_registered_users"
on public.registered_users
for select
to authenticated
using ((auth.jwt() ->> 'email') = 'admin@advanciapayledger.com');

-- Allow a user to read their own row (optional).
drop policy if exists "user_can_read_own_registered_user" on public.registered_users;
create policy "user_can_read_own_registered_user"
on public.registered_users
for select
to authenticated
using (auth.uid() = user_id);

-- Insert via trigger when a user signs up (no service role key in the browser).
create or replace function public.handle_new_user_registered()
returns trigger
language plpgsql
security definer
as $$
begin
  insert into public.registered_users (user_id, email, first_name, last_name, created_at)
  values (
    new.id,
    new.email,
    nullif(new.raw_user_meta_data ->> 'firstName', ''),
    nullif(new.raw_user_meta_data ->> 'lastName', ''),
    now()
  )
  on conflict (user_id)
  do update set
    email = excluded.email,
    first_name = excluded.first_name,
    last_name = excluded.last_name;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user_registered();
