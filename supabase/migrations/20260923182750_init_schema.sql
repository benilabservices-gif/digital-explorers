-- =====================================================================
-- Digital Explorers — schéma initial
-- Contenu pédagogique + données utilisateur + monétisation
-- =====================================================================

-- ---------- Profils parents (liés à auth.users) ----------
create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  full_name text not null default '',
  phone text,
  role text not null default 'parent' check (role in ('parent', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------- Enfants ----------
create table public.children (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  age int not null check (age between 3 and 25),
  grade_level text not null default '',
  avatar text not null default '👦🏾',
  interests text[] not null default '{}',
  xp int not null default 0 check (xp >= 0),
  level int not null default 1 check (level >= 1),
  phase text not null default 'explorer' check (phase in ('explorer', 'creator', 'builder')),
  created_at timestamptz not null default now()
);
create index children_parent_idx on public.children (parent_id);

-- ---------- Contenu pédagogique ----------
create table public.worlds (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  icon text not null default '🌐',
  description text not null default '',
  color text not null default '#3B82F6',
  gradient text not null default 'from-blue-500 to-cyan-400',
  phase text not null default 'explorer' check (phase in ('explorer', 'creator', 'builder')),
  sort_order int not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table public.adventures (
  id uuid primary key default gen_random_uuid(),
  world_id uuid not null references public.worlds (id) on delete cascade,
  slug text not null unique,
  title text not null,
  description text not null default '',
  story text not null default '',
  xp_reward int not null default 100 check (xp_reward >= 0),
  sort_order int not null default 0,
  is_published boolean not null default true,
  created_at timestamptz not null default now()
);
create index adventures_world_idx on public.adventures (world_id);

create table public.lessons (
  id uuid primary key default gen_random_uuid(),
  adventure_id uuid not null references public.adventures (id) on delete cascade,
  section_type text not null check (section_type in ('story', 'discover', 'play', 'experiment', 'build', 'mission', 'reflect', 'project')),
  sort_order int not null default 0,
  title text not null default '',
  content text not null default ''
);
create index lessons_adventure_idx on public.lessons (adventure_id);

create table public.quiz_questions (
  id uuid primary key default gen_random_uuid(),
  adventure_id uuid not null references public.adventures (id) on delete cascade,
  question text not null,
  options jsonb not null check (jsonb_typeof (options) = 'array' and jsonb_array_length (options) >= 2),
  correct_index int not null check (correct_index >= 0),
  explanation text,
  sort_order int not null default 0
);
create index quiz_questions_adventure_idx on public.quiz_questions (adventure_id);

create table public.badges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  icon text not null default '🏆',
  rarity text not null default 'common' check (rarity in ('common', 'rare', 'epic', 'legendary')),
  xp_required int not null default 0 check (xp_required >= 0),
  world_id uuid references public.worlds (id) on delete set null,
  required_completions int not null default 0 check (required_completions >= 0),
  sort_order int not null default 0
);

create table public.digital_bridges (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  description text not null default '',
  target_url text not null,
  icon text not null default '🚀',
  color text not null default 'from-emerald-500 to-teal-400',
  world_id uuid references public.worlds (id) on delete set null,
  sort_order int not null default 0,
  is_active boolean not null default true
);

-- ---------- Activité / progression ----------
create table public.adventure_completions (
  id uuid primary key default gen_random_uuid(),
  child_id uuid not null references public.children (id) on delete cascade,
  adventure_id uuid not null references public.adventures (id) on delete cascade,
  quiz_score int not null default 0 check (quiz_score >= 0),
  quiz_max int not null default 0 check (quiz_max >= 0),
  completed_at timestamptz not null default now(),
  unique (child_id, adventure_id)
);
create index completions_child_idx on public.adventure_completions (child_id);
create index completions_child_date_idx on public.adventure_completions (child_id, completed_at desc);

create table public.children_badges (
  child_id uuid not null references public.children (id) on delete cascade,
  badge_id uuid not null references public.badges (id) on delete cascade,
  awarded_at timestamptz not null default now(),
  primary key (child_id, badge_id)
);

-- ---------- Monétisation ----------
create table public.plans (
  code text primary key check (code in ('starter', 'explorer', 'pro')),
  name text not null,
  tagline text not null default '',
  price_fcfa int not null default 0 check (price_fcfa >= 0),
  period text not null default 'mois',
  max_children int not null default 1 check (max_children >= 1),
  max_worlds int not null default 1 check (max_worlds >= 0),
  features jsonb not null default '[]',
  sort_order int not null default 0
);

create table public.subscriptions (
  id uuid primary key default gen_random_uuid(),
  parent_id uuid not null references public.profiles (id) on delete cascade,
  plan_code text not null references public.plans (code),
  status text not null default 'trial' check (status in ('trial', 'active', 'expired', 'cancelled')),
  started_at timestamptz not null default now(),
  expires_at timestamptz
);
create index subscriptions_parent_idx on public.subscriptions (parent_id);

-- ---------- Défis ----------
create table public.challenges (
  id uuid primary key default gen_random_uuid(),
  type text not null check (type in ('daily', 'weekly')),
  slug text not null unique,
  title text not null,
  description text not null default '',
  world_slug text,
  xp_reward int not null default 50 check (xp_reward >= 0),
  badge_slug text,
  is_active boolean not null default true
);

create table public.challenge_completions (
  child_id uuid not null references public.children (id) on delete cascade,
  challenge_id uuid not null references public.challenges (id) on delete cascade,
  completed_at timestamptz not null default now(),
  primary key (child_id, challenge_id)
);

-- =====================================================================
-- Fonctions utilitaires
-- =====================================================================

-- Vérifie si l'utilisateur courant est admin.
-- SECURITY DEFINER : lit profiles sans RLS → évite la récursivité des
-- policies sur profiles elle-même. Search path épinglé pour sécurité.
create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    where p.id = (select auth.uid()) and p.role = 'admin'
  );
$$;

-- Crée le profil parent à l'inscription (trigger sur auth.users).
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, phone)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'full_name', split_part(new.email, '@', 1)),
    nullif(new.raw_user_meta_data ->> 'phone', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
after insert on auth.users
for each row execute function public.handle_new_user();

-- Empêche un parent de s'auto-promouvoir admin via UPDATE de son profil.
create or replace function public.protect_profile_role()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if not public.is_admin() and new.role is distinct from old.role then
    new.role := old.role;
  end if;
  new.updated_at := now();
  return new;
end;
$$;

create trigger protect_profiles_role
before update on public.profiles
for each row execute function public.protect_profile_role();

-- updated_at pour profiles
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;
-- (protect_profile_role gère déjà updated_at pour profiles)

-- =====================================================================
-- RLS — activation sur toutes les tables exposées
-- =====================================================================
alter table public.profiles enable row level security;
alter table public.children enable row level security;
alter table public.worlds enable row level security;
alter table public.adventures enable row level security;
alter table public.lessons enable row level security;
alter table public.quiz_questions enable row level security;
alter table public.badges enable row level security;
alter table public.digital_bridges enable row level security;
alter table public.adventure_completions enable row level security;
alter table public.children_badges enable row level security;
alter table public.plans enable row level security;
alter table public.subscriptions enable row level security;
alter table public.challenges enable row level security;
alter table public.challenge_completions enable row level security;

-- ---------- profiles : chacun voit et modifie SON profil ; admin : tout ----------
create policy "profiles_select_own" on public.profiles
  for select to authenticated
  using (id = (select auth.uid()));

create policy "profiles_update_own" on public.profiles
  for update to authenticated
  using (id = (select auth.uid()))
  with check (id = (select auth.uid()));

create policy "profiles_admin_all" on public.profiles
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- children : le parent propriétaire a tous les droits ----------
create policy "children_own_all" on public.children
  for all to authenticated
  using (parent_id = (select auth.uid()))
  with check (parent_id = (select auth.uid()));

create policy "children_admin_all" on public.children
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- contenu : lecture publique (anon), écriture admin ----------
create policy "worlds_public_read" on public.worlds
  for select to anon, authenticated using (true);
create policy "worlds_admin_write" on public.worlds
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "adventures_public_read" on public.adventures
  for select to anon, authenticated using (true);
create policy "adventures_admin_write" on public.adventures
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "lessons_public_read" on public.lessons
  for select to anon, authenticated using (true);
create policy "lessons_admin_write" on public.lessons
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "quiz_questions_public_read" on public.quiz_questions
  for select to anon, authenticated using (true);
create policy "quiz_questions_admin_write" on public.quiz_questions
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "badges_public_read" on public.badges
  for select to anon, authenticated using (true);
create policy "badges_admin_write" on public.badges
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "bridges_public_read" on public.digital_bridges
  for select to anon, authenticated using (true);
create policy "bridges_admin_write" on public.digital_bridges
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "plans_public_read" on public.plans
  for select to anon, authenticated using (true);
create policy "plans_admin_write" on public.plans
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

create policy "challenges_public_read" on public.challenges
  for select to anon, authenticated using (true);
create policy "challenges_admin_write" on public.challenges
  for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- ---------- activité : le parent voit/crée pour SES enfants ----------
create policy "completions_own_all" on public.adventure_completions
  for all to authenticated
  using (
    exists (
      select 1 from public.children c
      where c.id = child_id and c.parent_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.children c
      where c.id = child_id and c.parent_id = (select auth.uid())
    )
  );

create policy "completions_admin_all" on public.adventure_completions
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "children_badges_own_all" on public.children_badges
  for all to authenticated
  using (
    exists (
      select 1 from public.children c
      where c.id = child_id and c.parent_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.children c
      where c.id = child_id and c.parent_id = (select auth.uid())
    )
  );

create policy "children_badges_admin_all" on public.children_badges
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "challenge_completions_own_all" on public.challenge_completions
  for all to authenticated
  using (
    exists (
      select 1 from public.children c
      where c.id = child_id and c.parent_id = (select auth.uid())
    )
  )
  with check (
    exists (
      select 1 from public.children c
      where c.id = child_id and c.parent_id = (select auth.uid())
    )
  );

create policy "challenge_completions_admin_all" on public.challenge_completions
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());

-- ---------- abonnements : le parent lit/crée le sien ; l'admin gère tout ----------
create policy "subscriptions_select_own" on public.subscriptions
  for select to authenticated
  using (parent_id = (select auth.uid()));

create policy "subscriptions_insert_own" on public.subscriptions
  for insert to authenticated
  with check (parent_id = (select auth.uid()));

create policy "subscriptions_admin_all" on public.subscriptions
  for all to authenticated
  using (public.is_admin())
  with check (public.is_admin());
