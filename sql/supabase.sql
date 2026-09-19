-- DARU-SHIFA RUQYADA ONLINE
-- Supabase SQL Editor: Copy kaliya waxa ku jira file-kan, kadib Run.
create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text not null default '',
  phone text not null default '',
  created_at timestamptz not null default now()
);
create table if not exists public.ruqyah_enrollments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  plan_days integer not null check (plan_days in (7,15,30)),
  start_date date not null default current_date,
  preferred_time time not null default '18:00',
  status text not null default 'active' check(status in ('active','completed','cancelled')),
  created_at timestamptz not null default now()
);
create table if not exists public.attendance (
  id uuid primary key default gen_random_uuid(),
  enrollment_id uuid not null references public.ruqyah_enrollments(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  attendance_date date not null,
  status text not null check(status in ('present','missed')),
  created_at timestamptz not null default now(),
  unique(enrollment_id,attendance_date)
);

alter table public.profiles enable row level security;
alter table public.ruqyah_enrollments enable row level security;
alter table public.attendance enable row level security;

drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own" on public.profiles for select using(auth.uid()=id);
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own" on public.profiles for update using(auth.uid()=id);

drop policy if exists "enrollments_select_own" on public.ruqyah_enrollments;
create policy "enrollments_select_own" on public.ruqyah_enrollments for select using(auth.uid()=user_id);
drop policy if exists "enrollments_insert_own" on public.ruqyah_enrollments;
create policy "enrollments_insert_own" on public.ruqyah_enrollments for insert with check(auth.uid()=user_id);

drop policy if exists "attendance_select_own" on public.attendance;
create policy "attendance_select_own" on public.attendance for select using(auth.uid()=user_id);
drop policy if exists "attendance_insert_own" on public.attendance;
create policy "attendance_insert_own" on public.attendance for insert with check(auth.uid()=user_id);
drop policy if exists "attendance_update_own" on public.attendance;
create policy "attendance_update_own" on public.attendance for update using(auth.uid()=user_id);

-- Isdiiwaangelinta cusub waxay si automatic ah u abuurtaa profile + qorshe.
create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path=public as $$
declare pd integer; sd date; pt time;
begin
  pd:=coalesce((new.raw_user_meta_data->>'plan_days')::integer,7);
  if pd not in (7,15,30) then pd:=7; end if;
  sd:=coalesce((new.raw_user_meta_data->>'start_date')::date,current_date);
  pt:=coalesce((new.raw_user_meta_data->>'preferred_time')::time,'18:00');
  insert into public.profiles(id,full_name,phone) values(new.id,coalesce(new.raw_user_meta_data->>'full_name',''),coalesce(new.raw_user_meta_data->>'phone','')) on conflict(id) do nothing;
  insert into public.ruqyah_enrollments(user_id,plan_days,start_date,preferred_time) values(new.id,pd,sd,pt);
  return new;
end; $$;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute procedure public.handle_new_user();

-- Haddii hore trigger-ku u sameeyay profiles laakiin aysan jirin enrollment, isticmaal query-kan hal mar kadib signup-kii hore:
-- insert into public.ruqyah_enrollments(user_id,plan_days,start_date,preferred_time) values('USER_UUID_HERE',7,current_date,'18:00');
