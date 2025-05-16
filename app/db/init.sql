
-- Create profiles table
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  email text,
  avatar_url text,
  total_goals int default 0,
  completed_goals int default 0,
  inserted_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Create goals table
create table if not exists goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  status text check (status in ('pending', 'in_progress', 'completed')) default 'pending',
  is_archived boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  updated_at timestamp with time zone default timezone('utc'::text, now()),
  completed_at timestamp with time zone
);

-- Create milestones table
create table if not exists milestones (
  id uuid primary key default gen_random_uuid(),
  goal_id uuid references goals(id) on delete cascade,
  title text not null,
  is_completed boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  completed_at timestamp with time zone
);

-- Create achievements table
create table if not exists achievements (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade,
  title text not null,
  description text,
  achieved_at timestamp with time zone default timezone('utc'::text, now())
);

-- Indexes for performance
create index if not exists idx_goals_user_id on goals(user_id);
create index if not exists idx_goals_status on goals(status);

-- ========================================
-- Function to auto-update profiles.total_goals
-- ========================================
create or replace function update_total_goals()
returns trigger as $$
begin
  if (TG_OP = 'INSERT') then
    update profiles
    set total_goals = total_goals + 1
    where id = NEW.user_id;
  elsif (TG_OP = 'DELETE') then
    update profiles
    set total_goals = total_goals - 1
    where id = OLD.user_id;
  end if;
  return null;
end;
$$ language plpgsql;

-- Trigger on goals table to keep total_goals in sync
drop trigger if exists trg_update_total_goals on goals;
create trigger trg_update_total_goals
after insert or delete on goals
for each row
execute procedure update_total_goals();

-- ========================================
-- Function to update completed_goals + completed_at
-- ========================================
create or replace function update_completed_goals()
returns trigger as $$
begin
  if (NEW.status = 'completed' and OLD.status is distinct from 'completed') then
    NEW.completed_at := timezone('utc'::text, now());
    update profiles
    set completed_goals = completed_goals + 1
    where id = NEW.user_id;
  elsif (OLD.status = 'completed' and NEW.status is distinct from 'completed') then
    update profiles
    set completed_goals = completed_goals - 1
    where id = OLD.user_id;
    NEW.completed_at := null;
  end if;
  return NEW;
end;
$$ language plpgsql;

-- Trigger on goals table for completed_goals + completed_at
drop trigger if exists trg_update_completed_goals on goals;
create trigger trg_update_completed_goals
before update on goals
for each row
execute procedure update_completed_goals();

-- ========================================
-- Backfill total_goals and completed_goals (Optional)
-- ========================================
update profiles
set total_goals = (
  select count(*) from goals where goals.user_id = profiles.id
);
update profiles
set completed_goals = (
  select count(*) from goals where goals.user_id = profiles.id and goals.status = 'completed'
);
