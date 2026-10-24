-- =============================================================================
-- Relate — "Pole Pole: How to Get Around Zanzibar" editorial guide
--
-- 1. Mzungu Zanzibar's transport guide, built on the place-guide template. The
--    content ships with the app (src/lib/guides/getting-around/…); this row
--    records that the community has it, whether it is published and when its
--    editors last reviewed it. Goes live published; `on conflict do nothing`
--    never touches an existing guide.
--
-- 2. The Zanzibus (thezanzibus.com), the shuttle and taxi operator the guide
--    covers, joins the business directory under Taxis, so it shows in the
--    guide's live list of every taxi in the directory and the guide's entry
--    links to it. Its own meeting-point photos (from the operator's stop
--    guide, credited in the app) are served from the guide's images. Skipped
--    if a listing with that slug or name already exists, so it never
--    duplicates one and is safe to re-run. Listed as added by the community's
--    admin, who can edit or remove it like any other.
--
-- 3. Mohamad's listing had its website stored as "http:!!chaguaadventures.com".
--    That domain only forwards to https://chaguaadventure.com, the site of
--    Chagua Adventure Tours, which lists the same phone number. Fixed only
--    while the broken value is still there.
--
-- Looked up by the community's slug, so a no-op elsewhere. No schema change.
-- =============================================================================

insert into public.editorial_guides (community_id, slug, title, status, last_reviewed_on)
select c.id, 'getting-around-zanzibar', 'Pole Pole: How to Get Around Zanzibar', 'published', current_date
from public.communities c
where c.slug = 'mzunguzanzibar'
on conflict (community_id, slug) do nothing;

do $seed$
declare
  v_space uuid;
  v_community uuid;
  v_author uuid := '484bd7fe-e0b2-494a-a6a9-1bb79659821d';
  v_place uuid;
  v_business uuid;
  v_images text[] := array[
    'https://www.mzunguzanzibar.com/guides/getting-around/zanzibus-1-1280.webp',
    'https://www.mzunguzanzibar.com/guides/getting-around/zanzibus-2-1280.webp',
    'https://www.mzunguzanzibar.com/guides/getting-around/zanzibus-3-1280.webp',
    'https://www.mzunguzanzibar.com/guides/getting-around/zanzibus-4-1280.webp',
    'https://www.mzunguzanzibar.com/guides/getting-around/zanzibus-5-1280.webp',
    'https://www.mzunguzanzibar.com/guides/getting-around/zanzibus-6-1280.webp'
  ];
  v_description text := 'Shared shuttles and private taxis between the airport, Stone Town and the beaches, booked online.

The Zanzibus runs a daily shuttle each way between three hubs — Stone Town and the airport, Paje and Jambiani, and Nungwi and Kendwa — with stops at the Matemwe and Kiwengwa junctions. Shuttles leave Stone Town and the airport for the beaches in the morning, leave the beaches for Stone Town and the airport in the afternoon, and run beach to beach around midday, from named meeting points (its website has a photo of every stop). Its private taxis go anywhere on the island at any time.

How to book: Book and pay online at thezanzibus.com (shuttles by card; taxis are paid in cash to the driver). Changes and questions by WhatsApp. One large and one small bag per shuttle seat. Book at least a day ahead and confirm airport pickups the day before.';
  i int;
begin
  select s.id, s.community_id into v_space, v_community
  from public.spaces s
  join public.communities c on c.id = s.community_id
  where c.slug = 'mzunguzanzibar' and s.slug = 'business-directory' and s.space_type = 'business_directory';
  if v_space is null or not exists (select 1 from public.profiles p where p.id = v_author) then
    return;
  end if;

  if not exists (
    select 1 from public.businesses b
    where b.space_id = v_space and (b.slug = 'the-zanzibus' or lower(b.name) in ('the zanzibus', 'zanzibus'))
  ) then
    insert into public.places (community_id, name, description, address, location_label, website, lat, lng, cover_url, created_by)
    values (v_community, 'The Zanzibus', v_description, 'Meeting points in Stone Town, at the airport, in Paje, Jambiani, Nungwi and Kendwa', 'Island-wide', 'https://www.thezanzibus.com/', -6.1584, 39.1920, v_images[1], v_author)
    returning id into v_place;

    insert into public.businesses (
      space_id, community_id, created_by, place_id, slug, name, category, description,
      website, phone, address, location_label, lat, lng, image_url
    )
    values (
      v_space, v_community, v_author, v_place, 'the-zanzibus', 'The Zanzibus', 'taxi', v_description,
      'https://www.thezanzibus.com/', '+44 7476 067753', 'Meeting points in Stone Town, at the airport, in Paje, Jambiani, Nungwi and Kendwa', 'Island-wide', -6.1584, 39.1920, v_images[1]
    )
    returning id into v_business;

    for i in 1 .. array_length(v_images, 1) loop
      insert into public.business_images (business_id, url, sort_order, created_by)
      values (v_business, v_images[i], i - 1, v_author);
    end loop;
  end if;

  update public.businesses
  set website = 'https://chaguaadventure.com/'
  where space_id = v_space and slug = 'mohamad' and website = 'http:!!chaguaadventures.com';
end
$seed$;
