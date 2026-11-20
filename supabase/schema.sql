-- Supabase Schema for Video Timeline Manager

-- Projects
create table projects (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  character_ref text,
  description text,
  created_at timestamptz default now()
);

-- Scenes within a project
create table scenes (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references projects(id) on delete cascade,
  scene_number int not null,
  name text,
  description text,
  created_at timestamptz default now()
);

-- Clips within a scene (original or continuation)
create table clips (
  id uuid primary key default gen_random_uuid(),
  scene_id uuid references scenes(id) on delete cascade,
  clip_code text not null, -- e.g. "S1-C1", "S1-C2"
  clip_type text check (clip_type in ('original', 'continuation')),
  order_in_scene int not null,
  video_url text,
  image_url text,
  prompt text,
  duration_seconds numeric,
  created_at timestamptz default now()
);

-- Enable RLS (optional, for public read)
alter table projects enable row level security;
alter table scenes enable row level security;
alter table clips enable row level security;

-- Simple policy for authenticated/service role access
create policy "Enable all for service role" on projects for all using (true);
create policy "Enable all for service role" on scenes for all using (true);
create policy "Enable all for service role" on clips for all using (true);

-- Storage bucket (create via dashboard or API)
-- Bucket name: video-assets
