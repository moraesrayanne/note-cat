-- Run this in the Supabase SQL Editor to create the tables

-- Medications table
create table medications (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  name text not null,
  dose text not null,
  time time not null,
  active boolean default true not null,
  created_at timestamptz default now() not null
);

-- Medication logs (records when a med was taken)
create table medication_logs (
  id uuid default gen_random_uuid() primary key,
  medication_id uuid references medications(id) on delete cascade not null,
  user_id uuid references auth.users(id) on delete cascade not null,
  date date not null,
  taken_at timestamptz not null,
  created_at timestamptz default now() not null,
  unique(medication_id, date)
);

-- Enable RLS
alter table medications enable row level security;
alter table medication_logs enable row level security;

-- Policies: users can only see/modify their own data
create policy "Users can view own medications"
  on medications for select using (auth.uid() = user_id);

create policy "Users can insert own medications"
  on medications for insert with check (auth.uid() = user_id);

create policy "Users can update own medications"
  on medications for update using (auth.uid() = user_id);

create policy "Users can delete own medications"
  on medications for delete using (auth.uid() = user_id);

create policy "Users can view own logs"
  on medication_logs for select using (auth.uid() = user_id);

create policy "Users can insert own logs"
  on medication_logs for insert with check (auth.uid() = user_id);

create policy "Users can delete own logs"
  on medication_logs for delete using (auth.uid() = user_id);

-- Indexes
create index medications_user_id_idx on medications(user_id);
create index medication_logs_user_date_idx on medication_logs(user_id, date);
