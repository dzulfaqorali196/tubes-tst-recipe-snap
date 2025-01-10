create table if not exists public.image_analysis (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade not null,
    image_path text,
    image_url text,
    ingredients jsonb not null,
    created_at timestamptz default now() not null
);

-- Enable RLS
alter table public.image_analysis enable row level security;

-- Create policies
create policy "Users can view their own image analysis"
    on public.image_analysis
    for select
    using (auth.uid() = user_id);

create policy "Users can insert their own image analysis"
    on public.image_analysis
    for insert
    with check (auth.uid() = user_id);

-- Create index
create index if not exists image_analysis_user_id_idx on public.image_analysis(user_id);
create index if not exists image_analysis_created_at_idx on public.image_analysis(created_at desc); 