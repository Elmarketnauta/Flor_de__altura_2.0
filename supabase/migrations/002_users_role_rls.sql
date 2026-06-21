-- Defense-in-depth RLS for the `users` table to prevent privilege escalation.
--
-- Threat: a client holding a valid user JWT (the public anon key flow) must
-- never be able to read or write the `role` column to make themselves an admin.
-- The backend uses the service_role key, which BYPASSES RLS, so these policies
-- do not affect server-side admin operations — they only constrain the
-- client-facing (anon/authenticated) path.
--
-- Run this in the Supabase SQL editor once.

alter table public.users enable row level security;

-- Clean slate (id-empotent re-runs).
drop policy if exists "Users can view own profile"   on public.users;
drop policy if exists "Users can update own profile"  on public.users;
drop policy if exists "No client inserts"             on public.users;

-- A user may read ONLY their own row.
create policy "Users can view own profile"
  on public.users
  for select
  using (auth.uid() = id);

-- A user may update ONLY their own row, AND may not change their role.
-- The WITH CHECK clause re-asserts that the role after the update equals the
-- role before it, so `role` is effectively immutable from the client.
create policy "Users can update own profile"
  on public.users
  for update
  using (auth.uid() = id)
  with check (
    auth.uid() = id
    and role = (select u.role from public.users u where u.id = auth.uid())
  );

-- Profiles are created server-side (signup route uses the service role).
-- Block client-side inserts entirely so nobody can insert a row with
-- role = 'admin'. (No INSERT policy + RLS enabled = denied for anon/auth.)
-- Explicit restrictive policy for clarity:
create policy "No client inserts"
  on public.users
  for insert
  with check (false);

-- Note: there is intentionally no DELETE policy, so clients cannot delete
-- profile rows either.
