-- 1. PROFILES TABLE
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. GOALS TABLE
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references public.profiles(id) on delete cascade,
  title text not null,
  description text,
  deadline timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. MILESTONES TABLE
create table if not exists public.milestones (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid references public.goals(id) on delete cascade,
  title text not null,
  description text,
  deadline timestamp with time zone,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. FUNCTION: handle_new_user
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, created_at)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data ->> 'full_name',
    now()
  );
  return new;
end;
$$ language plpgsql security definer;

-- 5. TRIGGER: on new user creation
drop trigger if exists on_auth_user_created on auth.users;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();
