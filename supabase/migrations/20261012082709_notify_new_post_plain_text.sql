-- New-post notifications carried the first 140 characters of the raw post
-- body. A post written in HTML (a long-form guide with its own <style> block,
-- say) then showed CSS and tags in the bell, the email and the push message.
-- Strip <style>/<script> blocks and tags and collapse whitespace first, the
-- same way the app's htmlToPlainText does. Plain-text posts are unchanged.
create or replace function public.notify_new_post()
returns trigger
language plpgsql
security definer
set search_path to 'public'
as $function$
declare
  v_community_slug text;
  v_space_slug text;
  v_link text;
  v_actor_name text;
  v_verb text;
  v_excerpt text;
begin
  select slug into v_community_slug from public.communities where id = new.community_id;
  select slug into v_space_slug from public.spaces where id = new.space_id;
  v_link := '/c/' || v_community_slug || '/spaces/' || v_space_slug || '/posts/' || new.id;

  select coalesce(full_name, username) into v_actor_name from public.profiles where id = new.author_id;
  v_verb := case when new.post_type = 'announcement' then ' posted an announcement: "' else ' posted: "' end;

  v_excerpt := coalesce(new.body, '');
  v_excerpt := regexp_replace(v_excerpt, '<(style|script)\M[^>]*>.*?</\1\s*>', ' ', 'gi');
  v_excerpt := regexp_replace(v_excerpt, '<[^>]+>', ' ', 'g');
  v_excerpt := replace(replace(replace(v_excerpt, '&nbsp;', ' '), '&quot;', '"'), '&amp;', '&');
  v_excerpt := btrim(regexp_replace(v_excerpt, '\s+', ' ', 'g'));

  insert into public.notifications (user_id, community_id, type, title, body, link, actor_id)
  select
    m.user_id,
    new.community_id,
    'post',
    v_actor_name || v_verb || new.title || '"',
    left(v_excerpt, 140),
    v_link,
    new.author_id
  from public.community_memberships m
  where m.community_id = new.community_id
    and m.status = 'active'
    and m.user_id != new.author_id
    and public.can_view_space(new.space_id, m.user_id);

  return new;
end;
$function$;
