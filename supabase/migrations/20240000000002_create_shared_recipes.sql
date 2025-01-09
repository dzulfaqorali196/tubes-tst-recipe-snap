create table if not exists public.shared_recipes (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users(id) on delete cascade not null,
  recipe_data jsonb not null,
  shared_at timestamptz default now() not null
);

-- Enable RLS
alter table public.shared_recipes enable row level security;

-- Create policies
create policy "Users can view their own shared recipes"
  on public.shared_recipes
  for select
  using (auth.uid() = user_id);

create policy "Users can insert their own shared recipes"
  on public.shared_recipes
  for insert
  with check (auth.uid() = user_id); 