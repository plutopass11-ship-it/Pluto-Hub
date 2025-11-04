-- Create company_settings table
create table public.company_settings (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  logo text,
  updated_at timestamptz default now()
);

-- Insert default row
insert into public.company_settings (name) values ('Pluto Hub');

-- Enable RLS
alter table public.company_settings enable row level security;

-- Everyone can read company settings
create policy "Company settings are viewable by everyone"
  on public.company_settings for select
  using (true);

-- Anyone can update (for now, can add auth later)
create policy "Anyone can update company settings"
  on public.company_settings for update
  using (true);