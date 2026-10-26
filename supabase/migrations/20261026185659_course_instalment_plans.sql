-- Courses can be paid in monthly instalments as well as once: e.g. £144 once,
-- or £40 a month for 4 months. The buyer picks at checkout. The instalments
-- are a monthly Stripe subscription on the community's connected account; the
-- webhook counts paid invoices and stops the subscription after the last one.

-- --- The plan a course offers (0/0 = no instalment plan) -----------------------
alter table public.courses add column if not exists instalment_count integer not null default 0;
alter table public.courses add column if not exists instalment_price_cents integer not null default 0;

alter table public.courses drop constraint if exists courses_instalment_plan_valid;
alter table public.courses
  add constraint courses_instalment_plan_valid check (
    (instalment_count = 0 and instalment_price_cents = 0)
    or (instalment_count between 2 and 24 and instalment_price_cents > 0)
  );

-- --- Where each buyer's plan stands ----------------------------------------------
-- payment_plan: 'one_off' | 'instalments' (null for free, tier and granted
-- enrolments). instalment_status: 'active' | 'past_due' | 'completed' |
-- 'canceled'. Only the webhook (service role) writes these.
alter table public.course_enrollments add column if not exists payment_plan text;
alter table public.course_enrollments add column if not exists stripe_subscription_id text;
alter table public.course_enrollments add column if not exists instalments_paid integer not null default 0;
alter table public.course_enrollments add column if not exists instalments_total integer not null default 0;
alter table public.course_enrollments add column if not exists instalment_status text;

alter table public.course_enrollments drop constraint if exists course_enrollments_payment_plan_valid;
alter table public.course_enrollments
  add constraint course_enrollments_payment_plan_valid check (payment_plan is null or payment_plan in ('one_off', 'instalments'));

alter table public.course_enrollments drop constraint if exists course_enrollments_instalment_status_valid;
alter table public.course_enrollments
  add constraint course_enrollments_instalment_status_valid check (
    instalment_status is null or instalment_status in ('active', 'past_due', 'completed', 'canceled')
  );

create index if not exists idx_course_enrollments_stripe_subscription
  on public.course_enrollments (stripe_subscription_id)
  where stripe_subscription_id is not null;

-- Members still can't write a paid enrolment or any payment fields themselves.
drop policy if exists "course_enrollments_insert_self" on public.course_enrollments;
create policy "course_enrollments_insert_self" on public.course_enrollments
  for insert to authenticated
  with check (
    user_id = auth.uid()
    and paid = false
    and stripe_checkout_session_id is null
    and stripe_subscription_id is null
    and payment_plan is null
    and instalments_paid = 0
    and instalments_total = 0
    and instalment_status is null
    and exists (
      select 1 from public.courses c
      where c.id = course_enrollments.course_id
        and c.status = 'published'
        and (c.price_cents = 0 or public.has_active_tier_for_course(c.id, auth.uid()))
        and public.is_community_member(c.community_id, auth.uid())
        and public.has_space_access(c.space_id, auth.uid())
    )
  );
