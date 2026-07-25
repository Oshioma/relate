-- Remember which wizard template a community was created from.
--
-- Until now only place communities left a trace (location_type). Storing the
-- template key lets features gate on community type — first use: AI event
-- discovery is offered only to place-based communities.
--
-- Free text (validated against COMMUNITY_TEMPLATES at the app layer), matching
-- how location_type is handled. Null for communities created before this and
-- not back-fillable to a specific type — except places, which we can infer
-- from a non-null location_type.

alter table public.communities add column if not exists template_key text;

update public.communities
  set template_key = 'place'
  where template_key is null and location_type is not null;
