-- Migration 003: Extended user profile fields + email verification table
-- Run in Supabase SQL editor.

-- ─── 1. Add new columns to public.users ───────────────────────────────────────
alter table public.users
  add column if not exists first_name   text,
  add column if not exists last_name    text,
  add column if not exists dni          text,
  add column if not exists address      text,
  add column if not exists email_verified boolean not null default false;

-- ─── 2. email_verifications — stores 6-digit OTP codes ────────────────────────
create table if not exists public.email_verifications (
  id          uuid primary key default gen_random_uuid(),
  email       text not null,
  code        text not null,
  expires_at  timestamptz not null,
  used        boolean not null default false,
  created_at  timestamptz not null default now()
);

-- Index for fast lookup by email
create index if not exists email_verifications_email_idx
  on public.email_verifications (email);

-- Auto-delete expired/used codes after 1 day (optional cleanup)
create index if not exists email_verifications_expires_idx
  on public.email_verifications (expires_at);

-- RLS: this table is only accessed server-side via service_role (bypasses RLS),
-- so we enable RLS and add no client policies — effectively blocks all client access.
alter table public.email_verifications enable row level security;
