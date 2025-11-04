-- Create apps table
create table public.apps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  icon text not null,
  primary_link text not null,
  fallback_link text,
  category text not null,
  tags text[] default '{}',
  description text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.apps enable row level security;

-- Public read access (anyone can view apps)
create policy "Apps are viewable by everyone"
  on public.apps for select
  using (true);

-- Anyone can insert (for now, can add auth later)
create policy "Anyone can insert apps"
  on public.apps for insert
  with check (true);

-- Anyone can update (for now, can add auth later)
create policy "Anyone can update apps"
  on public.apps for update
  using (true);

-- Anyone can delete (for now, can add auth later)
create policy "Anyone can delete apps"
  on public.apps for delete
  using (true);