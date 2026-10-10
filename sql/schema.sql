create extension if not exists "pgcrypto";

do $$
begin
  if not exists (select 1 from pg_type where typname = 'user_role') then
    create type public.user_role as enum ('family', 'worker', 'admin');
  end if;

  if not exists (select 1 from pg_type where typname = 'verification_status') then
    create type public.verification_status as enum ('incomplete', 'pending', 'verified', 'rejected');
  end if;

  if not exists (select 1 from pg_type where typname = 'job_status') then
    create type public.job_status as enum ('active', 'paused', 'closed');
  end if;

  if not exists (select 1 from pg_type where typname = 'application_status') then
    create type public.application_status as enum ('sent', 'seen', 'accepted', 'rejected');
  end if;

  if not exists (select 1 from pg_type where typname = 'document_status') then
    create type public.document_status as enum ('pending', 'approved', 'rejected');
  end if;
end $$;

create table if not exists public.users_profiles (
  id uuid primary key default gen_random_uuid(),
  auth_user_id uuid not null unique references auth.users(id) on delete cascade,
  role public.user_role not null default 'family',
  first_name text not null default '',
  last_name text not null default '',
  phone text,
  email text not null,
  city text,
  terms_accepted_at timestamptz,
  privacy_accepted_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.users_profiles add column if not exists terms_accepted_at timestamptz;
alter table public.users_profiles add column if not exists privacy_accepted_at timestamptz;

create table if not exists public.worker_profiles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null unique references public.users_profiles(id) on delete cascade,
  profile_photo_url text,
  age integer check (age between 18 and 100),
  service_type text not null,
  experience_years integer not null default 0 check (experience_years >= 0),
  availability text not null,
  available_days text[] not null default '{}',
  work_mode text[] not null default '{}',
  description text not null,
  expected_salary text,
  verification_status public.verification_status not null default 'incomplete',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.worker_references (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  reference_name text not null,
  reference_phone text,
  relationship text,
  comment text,
  created_at timestamptz not null default now()
);

create table if not exists public.worker_documents (
  id uuid primary key default gen_random_uuid(),
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  document_type text not null,
  file_url text not null,
  status public.document_status not null default 'pending',
  created_at timestamptz not null default now()
);

create table if not exists public.job_posts (
  id uuid primary key default gen_random_uuid(),
  employer_id uuid not null references public.users_profiles(id) on delete cascade,
  service_type text not null,
  description text not null,
  city text not null,
  required_days text not null,
  required_hours text not null,
  modality text not null default 'Por hora',
  start_date date,
  requires_experience boolean not null default false,
  requires_references boolean not null default false,
  estimated_budget text,
  observations text,
  status public.job_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.worker_profiles add column if not exists age integer;
alter table public.worker_profiles add column if not exists available_days text[] not null default '{}';
alter table public.job_posts add column if not exists modality text not null default 'Por hora';

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  job_post_id uuid not null references public.job_posts(id) on delete cascade,
  worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  status public.application_status not null default 'sent',
  message text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique (job_post_id, worker_id)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  reviewer_id uuid not null references public.users_profiles(id) on delete cascade,
  reviewed_worker_id uuid not null references public.worker_profiles(id) on delete cascade,
  rating integer not null check (rating between 1 and 5),
  comment text,
  created_at timestamptz not null default now()
);

create index if not exists users_profiles_auth_user_id_idx on public.users_profiles(auth_user_id);
create index if not exists users_profiles_role_idx on public.users_profiles(role);
create index if not exists worker_profiles_user_id_idx on public.worker_profiles(user_id);
create index if not exists worker_profiles_verification_status_idx on public.worker_profiles(verification_status);
create index if not exists job_posts_employer_id_idx on public.job_posts(employer_id);
create index if not exists job_posts_status_idx on public.job_posts(status);
create index if not exists job_posts_city_idx on public.job_posts(city);
create index if not exists applications_job_post_id_idx on public.applications(job_post_id);
create index if not exists applications_worker_id_idx on public.applications(worker_id);

do $$
begin
  if not exists (select 1 from pg_constraint where conname = 'users_profiles_safe_lengths') then
    alter table public.users_profiles add constraint users_profiles_safe_lengths check (
      char_length(first_name) <= 80 and char_length(last_name) <= 80
      and char_length(email) <= 320 and char_length(coalesce(phone, '')) <= 30
      and char_length(coalesce(city, '')) <= 100
    ) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'worker_profiles_safe_values') then
    alter table public.worker_profiles add constraint worker_profiles_safe_values check (
      age is null or age between 18 and 100
    ) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'worker_profiles_safe_lengths') then
    alter table public.worker_profiles add constraint worker_profiles_safe_lengths check (
      char_length(service_type) <= 100 and char_length(availability) <= 100
      and char_length(description) between 1 and 2000
      and char_length(coalesce(expected_salary, '')) <= 100
      and cardinality(work_mode) <= 4 and cardinality(available_days) <= 7
    ) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'job_posts_safe_lengths') then
    alter table public.job_posts add constraint job_posts_safe_lengths check (
      char_length(service_type) <= 100 and char_length(city) <= 100
      and char_length(required_days) <= 200 and char_length(required_hours) <= 100
      and char_length(modality) <= 100 and char_length(description) <= 2000
      and char_length(coalesce(estimated_budget, '')) <= 100
      and char_length(coalesce(observations, '')) <= 1000
    ) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'applications_message_length') then
    alter table public.applications add constraint applications_message_length check (char_length(coalesce(message, '')) <= 1000) not valid;
  end if;
  if not exists (select 1 from pg_constraint where conname = 'references_safe_lengths') then
    alter table public.worker_references add constraint references_safe_lengths check (
      char_length(reference_name) <= 120 and char_length(coalesce(reference_phone, '')) <= 30
      and char_length(coalesce(relationship, '')) <= 120 and char_length(coalesce(comment, '')) <= 1000
    ) not valid;
  end if;
end $$;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists set_users_profiles_updated_at on public.users_profiles;
create trigger set_users_profiles_updated_at
before update on public.users_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_worker_profiles_updated_at on public.worker_profiles;
create trigger set_worker_profiles_updated_at
before update on public.worker_profiles
for each row execute function public.set_updated_at();

drop trigger if exists set_job_posts_updated_at on public.job_posts;
create trigger set_job_posts_updated_at
before update on public.job_posts
for each row execute function public.set_updated_at();

drop trigger if exists set_applications_updated_at on public.applications;
create trigger set_applications_updated_at
before update on public.applications
for each row execute function public.set_updated_at();

create or replace function public.current_profile_id()
returns uuid
language sql
stable
security definer
set search_path = public
as $$
  select id
  from public.users_profiles
  where auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select role
  from public.users_profiles
  where auth_user_id = auth.uid()
  limit 1;
$$;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.users_profiles
    where auth_user_id = auth.uid()
      and role = 'admin'
  );
$$;

create or replace function public.can_family_view_worker(target_worker_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.applications a
    join public.job_posts jp on jp.id = a.job_post_id
    where a.worker_id = target_worker_id
      and jp.employer_id = public.current_profile_id()
  );
$$;

create or replace function public.can_family_view_profile(target_profile_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.worker_profiles wp
    where wp.user_id = target_profile_id
      and public.can_family_view_worker(wp.id)
  );
$$;

create or replace function public.can_worker_view_job(target_job_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.applications a
    join public.worker_profiles wp on wp.id = a.worker_id
    where a.job_post_id = target_job_id
      and wp.user_id = public.current_profile_id()
  );
$$;

create or replace function public.handle_new_auth_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if coalesce(new.raw_user_meta_data ->> 'accepted_terms', 'false') <> 'true' then
    raise exception 'Terms acceptance is required';
  end if;

  insert into public.users_profiles (
    auth_user_id,
    role,
    first_name,
    last_name,
    phone,
    email,
    terms_accepted_at,
    privacy_accepted_at
  )
  values (
    new.id,
    case
      when new.raw_user_meta_data ->> 'role' = 'worker' then 'worker'::public.user_role
      else 'family'::public.user_role
    end,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    new.raw_user_meta_data ->> 'phone',
    coalesce(new.email, ''),
    now(),
    now()
  )
  on conflict (auth_user_id) do nothing;

  return new;
end;
$$;

create or replace function public.enforce_worker_verification()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  if not public.is_admin() then
    new.verification_status = 'pending';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_worker_verification_status on public.worker_profiles;
create trigger enforce_worker_verification_status
before insert or update on public.worker_profiles
for each row execute function public.enforce_worker_verification();

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_auth_user();

alter table public.users_profiles enable row level security;
alter table public.worker_profiles enable row level security;
alter table public.worker_references enable row level security;
alter table public.worker_documents enable row level security;
alter table public.job_posts enable row level security;
alter table public.applications enable row level security;
alter table public.reviews enable row level security;

drop policy if exists "Users can read own profile" on public.users_profiles;
create policy "Users can read own profile"
on public.users_profiles
for select
to authenticated
using (auth_user_id = auth.uid() or public.is_admin());

drop policy if exists "Users can update own profile" on public.users_profiles;
create policy "Users can update own profile"
on public.users_profiles
for update
to authenticated
using (auth_user_id = auth.uid() or public.is_admin())
with check (auth_user_id = auth.uid() or public.is_admin());

revoke update on public.users_profiles from authenticated;
grant update (first_name, last_name, phone, city) on public.users_profiles to authenticated;

drop policy if exists "Admins can delete users profiles" on public.users_profiles;
create policy "Admins can delete users profiles"
on public.users_profiles
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Workers can insert profile" on public.worker_profiles;
create policy "Workers can insert profile"
on public.worker_profiles
for insert
to authenticated
with check (
  user_id = public.current_profile_id()
  and (public.current_user_role() = 'worker' or public.is_admin())
);

drop policy if exists "Workers and admins can update worker profile" on public.worker_profiles;
create policy "Workers and admins can update worker profile"
on public.worker_profiles
for update
to authenticated
using (user_id = public.current_profile_id() or public.is_admin())
with check (user_id = public.current_profile_id() or public.is_admin());

drop policy if exists "Verified worker profiles are readable" on public.worker_profiles;
create policy "Verified worker profiles are readable"
on public.worker_profiles
for select
to authenticated, anon
using (
  verification_status = 'verified'
  or user_id = public.current_profile_id()
  or public.can_family_view_worker(worker_profiles.id)
  or public.is_admin()
);

drop policy if exists "Families can read applicant account profiles" on public.users_profiles;
create policy "Families can read applicant account profiles"
on public.users_profiles
for select
to authenticated
using (
  public.can_family_view_profile(users_profiles.id)
);

drop policy if exists "Admins can delete worker profiles" on public.worker_profiles;
create policy "Admins can delete worker profiles"
on public.worker_profiles
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Worker references are readable by owner admin or verified public" on public.worker_references;
create policy "Worker references are readable by owner admin or verified public"
on public.worker_references
for select
to authenticated, anon
using (
  exists (
    select 1
    from public.worker_profiles wp
    where wp.id = worker_id
      and (
        wp.verification_status = 'verified'
        or wp.user_id = public.current_profile_id()
        or public.is_admin()
      )
  )
);

drop policy if exists "Workers can manage own references" on public.worker_references;
create policy "Workers can manage own references"
on public.worker_references
for all
to authenticated
using (
  exists (
    select 1 from public.worker_profiles wp
    where wp.id = worker_id
      and (wp.user_id = public.current_profile_id() or public.is_admin())
  )
)
with check (
  exists (
    select 1 from public.worker_profiles wp
    where wp.id = worker_id
      and (wp.user_id = public.current_profile_id() or public.is_admin())
  )
);

drop policy if exists "Workers and admins can read documents" on public.worker_documents;
create policy "Workers and admins can read documents"
on public.worker_documents
for select
to authenticated
using (
  exists (
    select 1 from public.worker_profiles wp
    where wp.id = worker_id
      and (wp.user_id = public.current_profile_id() or public.is_admin())
  )
);

drop policy if exists "Workers can manage own documents" on public.worker_documents;
drop policy if exists "Workers can insert own documents" on public.worker_documents;
create policy "Workers can insert own documents"
on public.worker_documents
for insert
to authenticated
with check (
  exists (
    select 1 from public.worker_profiles wp
    where wp.id = worker_id
      and wp.user_id = public.current_profile_id()
  )
  and status = 'pending'
);

drop policy if exists "Workers can delete own pending documents" on public.worker_documents;
create policy "Workers can delete own pending documents"
on public.worker_documents
for delete
to authenticated
using (
  exists (
    select 1 from public.worker_profiles wp
    where wp.id = worker_id
      and wp.user_id = public.current_profile_id()
  )
  and status = 'pending'
);

drop policy if exists "Admins can update documents" on public.worker_documents;
create policy "Admins can update documents"
on public.worker_documents
for update
to authenticated
using (public.is_admin())
with check (public.is_admin());

drop policy if exists "Active jobs are readable" on public.job_posts;
create policy "Active jobs are readable"
on public.job_posts
for select
to authenticated, anon
using (
  status = 'active'
  or employer_id = public.current_profile_id()
  or public.can_worker_view_job(job_posts.id)
  or public.is_admin()
);

drop policy if exists "Families can create job posts" on public.job_posts;
create policy "Families can create job posts"
on public.job_posts
for insert
to authenticated
with check (
  employer_id = public.current_profile_id()
  and (public.current_user_role() = 'family' or public.is_admin())
);

drop policy if exists "Families can manage own job posts" on public.job_posts;
create policy "Families can manage own job posts"
on public.job_posts
for update
to authenticated
using (employer_id = public.current_profile_id() or public.is_admin())
with check (employer_id = public.current_profile_id() or public.is_admin());

drop policy if exists "Admins can delete job posts" on public.job_posts;
create policy "Admins can delete job posts"
on public.job_posts
for delete
to authenticated
using (public.is_admin());

drop policy if exists "Applications are readable by involved users" on public.applications;
create policy "Applications are readable by involved users"
on public.applications
for select
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.worker_profiles wp
    where wp.id = worker_id
      and wp.user_id = public.current_profile_id()
  )
  or exists (
    select 1
    from public.job_posts jp
    where jp.id = job_post_id
      and jp.employer_id = public.current_profile_id()
  )
);

drop policy if exists "Workers can apply to active jobs" on public.applications;
create policy "Workers can apply to active jobs"
on public.applications
for insert
to authenticated
with check (
  exists (
    select 1
    from public.worker_profiles wp
    where wp.id = worker_id
      and wp.user_id = public.current_profile_id()
  )
  and exists (
    select 1
    from public.job_posts jp
    where jp.id = job_post_id
      and jp.status = 'active'
  )
);

drop policy if exists "Involved users can update applications" on public.applications;
drop policy if exists "Employers and admins can update applications" on public.applications;
create policy "Employers and admins can update applications"
on public.applications
for update
to authenticated
using (
  public.is_admin()
  or exists (
    select 1
    from public.job_posts jp
    where jp.id = job_post_id
      and jp.employer_id = public.current_profile_id()
  )
)
with check (
  public.is_admin()
  or exists (
    select 1
    from public.job_posts jp
    where jp.id = job_post_id
      and jp.employer_id = public.current_profile_id()
  )
);

drop policy if exists "Reviews are public readable" on public.reviews;
create policy "Reviews are public readable"
on public.reviews
for select
to authenticated, anon
using (true);

drop policy if exists "Families can create own reviews" on public.reviews;
create policy "Families can create own reviews"
on public.reviews
for insert
to authenticated
with check (
  reviewer_id = public.current_profile_id()
  and public.current_user_role() = 'family'
  and exists (
    select 1
    from public.applications a
    join public.job_posts jp on jp.id = a.job_post_id
    where a.worker_id = reviewed_worker_id
      and a.status = 'accepted'
      and jp.employer_id = public.current_profile_id()
  )
);

drop policy if exists "Reviewers can update own reviews" on public.reviews;
create policy "Reviewers can update own reviews"
on public.reviews
for update
to authenticated
using (reviewer_id = public.current_profile_id() or public.is_admin())
with check (reviewer_id = public.current_profile_id() or public.is_admin());

insert into storage.buckets (id, name, public)
values ('worker-documents', 'worker-documents', false)
on conflict (id) do nothing;

update storage.buckets
set file_size_limit = 10485760,
    allowed_mime_types = array['application/pdf', 'image/jpeg', 'image/png']
where id = 'worker-documents';

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('profile-photos', 'profile-photos', true, 5242880, array['image/jpeg', 'image/png', 'image/webp'])
on conflict (id) do update
set public = excluded.public,
    file_size_limit = excluded.file_size_limit,
    allowed_mime_types = excluded.allowed_mime_types;

drop policy if exists "Workers can upload own documents" on storage.objects;
create policy "Workers can upload own documents"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'worker-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.current_user_role() = 'worker'
);

drop policy if exists "Workers can delete own stored documents" on storage.objects;
create policy "Workers can delete own stored documents"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'worker-documents'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Workers can read own stored documents" on storage.objects;
create policy "Workers can read own stored documents"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'worker-documents'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
);

drop policy if exists "Workers can update own stored documents" on storage.objects;
create policy "Workers can update own stored documents"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'worker-documents'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
)
with check (
  bucket_id = 'worker-documents'
  and ((storage.foldername(name))[1] = auth.uid()::text or public.is_admin())
);

drop policy if exists "Profile photos are publicly readable" on storage.objects;
create policy "Profile photos are publicly readable"
on storage.objects
for select
to anon, authenticated
using (bucket_id = 'profile-photos');

drop policy if exists "Users can upload own profile photo" on storage.objects;
create policy "Users can upload own profile photo"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
  and public.current_user_role() = 'worker'
);

drop policy if exists "Users can update own profile photo" on storage.objects;
create policy "Users can update own profile photo"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
)
with check (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

drop policy if exists "Users can delete own profile photo" on storage.objects;
create policy "Users can delete own profile photo"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'profile-photos'
  and (storage.foldername(name))[1] = auth.uid()::text
);

create or replace view public.public_worker_profiles
with (security_barrier = true)
as
select
  wp.id,
  up.first_name,
  up.last_name,
  up.city,
  wp.profile_photo_url,
  wp.age,
  wp.service_type,
  wp.experience_years,
  wp.availability,
  wp.available_days,
  wp.work_mode,
  wp.description,
  wp.expected_salary,
  wp.verification_status,
  wp.created_at,
  coalesce(avg(r.rating), 0)::numeric(3,2) as rating,
  count(distinct r.id)::integer as reviews_count,
  count(distinct wr.id)::integer as references_count
from public.worker_profiles wp
join public.users_profiles up on up.id = wp.user_id
left join public.reviews r on r.reviewed_worker_id = wp.id
left join public.worker_references wr on wr.worker_id = wp.id
where wp.verification_status = 'verified'
group by wp.id, up.first_name, up.last_name, up.city;

revoke all on public.public_worker_profiles from public;
grant select on public.public_worker_profiles to anon, authenticated;

create or replace view public.public_job_posts
with (security_barrier = true)
as
select
  jp.id,
  jp.service_type,
  jp.description,
  jp.city,
  jp.required_days,
  jp.required_hours,
  jp.modality,
  jp.start_date,
  jp.requires_experience,
  jp.requires_references,
  jp.estimated_budget,
  jp.observations,
  jp.status,
  jp.created_at,
  count(a.id)::integer as applicants_count
from public.job_posts jp
left join public.applications a on a.job_post_id = jp.id
where jp.status = 'active'
group by jp.id;

revoke all on public.public_job_posts from public;
grant select on public.public_job_posts to anon, authenticated;

create or replace function public.get_worker_contact(target_worker_id uuid)
returns table(phone text, email text)
language sql
stable
security definer
set search_path = public
as $$
  select up.phone, up.email
  from public.worker_profiles wp
  join public.users_profiles up on up.id = wp.user_id
  where wp.id = target_worker_id
    and wp.verification_status = 'verified'
    and public.current_user_role() in ('family', 'admin')
  limit 1;
$$;

revoke all on function public.get_worker_contact(uuid) from public;
grant execute on function public.get_worker_contact(uuid) to authenticated;
