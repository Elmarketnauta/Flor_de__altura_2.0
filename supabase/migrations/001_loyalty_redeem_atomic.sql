-- Atomic loyalty point redemption.
--
-- Why: the previous application code read the balance, checked it, then wrote
-- the new balance in separate steps. Two concurrent requests could both pass
-- the check and redeem the same points twice (TOCTOU race / double-spend).
--
-- This function performs the read-check-write inside a single transaction with
-- a row lock (SELECT ... FOR UPDATE), so concurrent redemptions are serialized
-- and the balance can never go negative.
--
-- Run this in the Supabase SQL editor (or via the Supabase CLI) once.

create or replace function public.redeem_loyalty_points(
  p_user_id uuid,
  p_points integer
)
returns table (
  new_points integer,
  new_lifetime_points integer,
  new_tier text,
  discount numeric
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_account public.loyalty_accounts%rowtype;
  v_new_points integer;
  v_new_lifetime integer;
  v_new_tier text;
  v_discount numeric;
begin
  -- Validate input.
  if p_points is null or p_points <= 0 or p_points % 100 <> 0 then
    raise exception 'INVALID_POINTS' using errcode = 'P0001';
  end if;

  -- Lock the account row for the duration of the transaction.
  select * into v_account
  from public.loyalty_accounts
  where user_id = p_user_id
  for update;

  if not found then
    raise exception 'ACCOUNT_NOT_FOUND' using errcode = 'P0002';
  end if;

  if v_account.points < p_points then
    raise exception 'INSUFFICIENT_POINTS' using errcode = 'P0003';
  end if;

  v_new_points := v_account.points - p_points;
  v_new_lifetime := v_account.lifetime_points - p_points;

  -- Tier recalculation (mirrors src/lib/loyalty/calculate.ts).
  v_new_tier := case
    when v_new_lifetime >= 5000 then 'platinum'
    when v_new_lifetime >= 2000 then 'gold'
    when v_new_lifetime >= 500  then 'silver'
    else 'bronze'
  end;

  -- 100 points = S/ 5 off
  v_discount := (p_points / 100.0) * 5;

  update public.loyalty_accounts
  set points = v_new_points,
      lifetime_points = v_new_lifetime,
      tier = v_new_tier,
      updated_at = now()
  where user_id = p_user_id;

  insert into public.points_transactions (user_id, type, points, description)
  values (
    p_user_id,
    'redeem',
    -p_points,
    'Redeemed ' || p_points || ' points for S/ ' || to_char(v_discount, 'FM999990.00') || ' discount'
  );

  return query select v_new_points, v_new_lifetime, v_new_tier, v_discount;
end;
$$;

-- Only the service role should call this (the API uses the service key).
revoke all on function public.redeem_loyalty_points(uuid, integer) from public;
revoke all on function public.redeem_loyalty_points(uuid, integer) from anon, authenticated;
