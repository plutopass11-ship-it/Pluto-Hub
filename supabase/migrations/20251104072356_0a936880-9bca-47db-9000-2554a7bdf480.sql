-- Create quick_links table
create table public.quick_links (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  url text not null,
  category text not null,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Enable RLS
alter table public.quick_links enable row level security;

-- Public read access
create policy "Quick links are viewable by everyone"
  on public.quick_links for select
  using (true);

-- Anyone can manage (for now, can add auth later)
create policy "Anyone can insert quick links"
  on public.quick_links for insert
  with check (true);

create policy "Anyone can update quick links"
  on public.quick_links for update
  using (true);

create policy "Anyone can delete quick links"
  on public.quick_links for delete
  using (true);