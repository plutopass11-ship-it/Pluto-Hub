-- Create storage bucket for app icons and company logos
insert into storage.buckets (id, name, public)
values ('pluto-hub-assets', 'pluto-hub-assets', true);

-- Allow public access to read files
create policy "Public can view assets"
  on storage.objects for select
  using (bucket_id = 'pluto-hub-assets');

-- Allow anyone to upload (for now, can add auth later)
create policy "Anyone can upload assets"
  on storage.objects for insert
  with check (bucket_id = 'pluto-hub-assets');

-- Allow anyone to update their uploads
create policy "Anyone can update assets"
  on storage.objects for update
  using (bucket_id = 'pluto-hub-assets');

-- Allow anyone to delete
create policy "Anyone can delete assets"
  on storage.objects for delete
  using (bucket_id = 'pluto-hub-assets');