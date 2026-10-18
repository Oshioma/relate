-- Only community staff may pin or unpin a post.
--
-- posts_update_author_or_staff lets an author edit their own post, and RLS
-- can't restrict a single column, so without this an author could pin their
-- own post (or create it pinned) straight through the API. Updates made
-- without a signed-in user (service role, migrations) are left alone.
create or replace function public.enforce_post_pin_staff_only()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if auth.uid() is null then
    return new;
  end if;

  if tg_op = 'INSERT' then
    if new.is_pinned and not public.is_community_staff(new.community_id, auth.uid()) then
      raise exception 'Only community staff can pin posts.' using errcode = '42501';
    end if;
  elsif new.is_pinned is distinct from old.is_pinned
        and not public.is_community_staff(new.community_id, auth.uid()) then
    raise exception 'Only community staff can pin posts.' using errcode = '42501';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_enforce_post_pin_staff_only on public.posts;
create trigger trg_enforce_post_pin_staff_only
  before insert or update of is_pinned on public.posts
  for each row execute function public.enforce_post_pin_staff_only();
