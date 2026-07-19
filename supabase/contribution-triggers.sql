-- =============================================================================
-- Relate — Member Directory, Stage 7: contribution score triggers
--
-- Run this after supabase/member-contribution.sql (needs member_contribution_scores
-- and its apply_contribution_score() trigger already in place). Safe to re-run.
--
-- Wires real point-earning events into the ledger built in Stage 1c: creating
-- a post, leaving a comment, sharing a resource, hosting an event, and
-- attending (RSVPing to) an event each insert one row into
-- member_contribution_scores, which the existing trigger there folds into
-- profiles.contribution_score. Nothing in the app needs to change — every
-- page that already reads contribution_score (the member profile page, Top
-- Contributors) picks these up automatically.
--
-- Deliberately append-only: deleting the underlying post/comment/resource/
-- event/RSVP does NOT claw back points. Simpler, and avoids negative-score
-- churn — a member who contributed once keeps credit for it, matching how
-- the ledger itself is documented (append-only, never updated/deleted).
--
-- Reactions and accepted-answers are still future scoring sources per the
-- original spec — this app has no reactions/likes feature yet to hang a
-- trigger off of, so they're intentionally not part of this stage.
-- =============================================================================

create or replace function public.award_points_for_post()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.member_contribution_scores (profile_id, points, reason, source_type, source_id)
  values (new.author_id, 5, 'Created a post', 'post', new.id);
  return new;
end;
$$;

drop trigger if exists trg_award_points_for_post on public.posts;
create trigger trg_award_points_for_post
  after insert on public.posts
  for each row execute function public.award_points_for_post();

create or replace function public.award_points_for_comment()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.member_contribution_scores (profile_id, points, reason, source_type, source_id)
  values (new.author_id, 2, 'Left a comment', 'comment', new.id);
  return new;
end;
$$;

drop trigger if exists trg_award_points_for_comment on public.comments;
create trigger trg_award_points_for_comment
  after insert on public.comments
  for each row execute function public.award_points_for_comment();

create or replace function public.award_points_for_resource()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.member_contribution_scores (profile_id, points, reason, source_type, source_id)
  values (new.created_by, 5, 'Shared a resource', 'resource', new.id);
  return new;
end;
$$;

drop trigger if exists trg_award_points_for_resource on public.resources;
create trigger trg_award_points_for_resource
  after insert on public.resources
  for each row execute function public.award_points_for_resource();

create or replace function public.award_points_for_event_hosted()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.member_contribution_scores (profile_id, points, reason, source_type, source_id)
  values (new.created_by, 5, 'Hosted an event', 'event', new.id);
  return new;
end;
$$;

drop trigger if exists trg_award_points_for_event_hosted on public.events;
create trigger trg_award_points_for_event_hosted
  after insert on public.events
  for each row execute function public.award_points_for_event_hosted();

create or replace function public.award_points_for_event_attendance()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.member_contribution_scores (profile_id, points, reason, source_type, source_id)
  values (new.user_id, 2, 'Attended an event', 'event_rsvp', new.id);
  return new;
end;
$$;

drop trigger if exists trg_award_points_for_event_attendance on public.event_rsvps;
create trigger trg_award_points_for_event_attendance
  after insert on public.event_rsvps
  for each row execute function public.award_points_for_event_attendance();
