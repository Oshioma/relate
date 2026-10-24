-- =============================================================================
-- Relate — photos for Mzungu Zanzibar's restaurants that had none, and a tidy-up
--
-- 1. Fifteen restaurant listings in the business directory had no photo and
--    showed a blank card. Each gets the photos found for it on the web, lead
--    photo first, every one checked to show that restaurant (or, where noted
--    below, its hotel). Only listings that still have no photo at all are
--    touched, so a photo an owner or admin has added since is never replaced,
--    and re-running is a no-op. Listed as added by the community's admin.
--
--    Photos belong to the sources below and are used with credit; any owner
--    who wants one taken down can ask and it will be removed.
--   Baladin Zanzibar Beach Hotel & Restaurant: Baladin Zanzibar Beach Hotel / MyBoutiqueHotel
--   Blue Moon Villa Restaurant: Blue Moon Villa (property photos via Booking.com / Laterooms)
--   Blue Pontile Dongwe: Dongwe Club (hotel photos via Trip.com)
--   Kameleon Blue Bar & Restaurant: Kameleon Blue (property photos via Expedia/LateRooms)
--   La Base JungleKite: La Base JungleKite (junglekitelabase.com)
--   La Capannina Zanzibar: La Capannina via ZanzibarApp; Lapili Residence / La Capannina (lapiliresidence.com)
--   Leo Beach Bar & Restaurant: African Paradise Beach Hotel (property photos via Expedia/LateRooms)
--   Mapacha Food Court: Mapacha (mapacha-zanzibar.com); Mapacha via ZanzibarApp
--   Ocean Boho House Restaurant: Ocean Boho House (oceanbohohouse.com)
--   Pongwe Beach Hotel Restaurant: Pongwe Beach Hotel (pongwe.com); Pongwe Beach Hotel (property photos via Expedia/LateRooms)
--   Sahari Zanzibar: Sahari Zanzibar (saharizanzibar.com)
--   The Breeze (TUI BLUE Bahari Zanzibar): TUI BLUE (tui-blue.com)
--   The Island – Pongwe Restaurant: The Island Pongwe (theislandpongwe.com)
--   Zanzibar Sunrise at Bandas Restaurant: Zanzibar Sunrise at Bandas (property photos via Expedia/LateRooms); Zanzibar Sunrise at Bandas (zanzibarsunrise.com)
--   ZanziBarista: ZanziBarista (zanzibarista.com)
--
-- 2. Organzibar's logo comes out of its gallery (its own food photos replaced
--    it as the lead), and the second "Passion & Thyme" listing, a duplicate of
--    the first whose photo has already moved onto it, is removed — only while
--    nothing (reviews, saves, claims…) points at it.
--
-- Looked up by the community's slug, so a no-op elsewhere. No schema change.
-- =============================================================================

do $seed$
declare
  v_space uuid;
  v_author uuid := '484bd7fe-e0b2-494a-a6a9-1bb79659821d';
  v_business uuid;
  v_place uuid;
  r record;
  i int;
begin
  select s.id into v_space
  from public.spaces s
  join public.communities c on c.id = s.community_id
  where c.slug = 'mzunguzanzibar' and s.slug = 'business-directory' and s.space_type = 'business_directory';
  if v_space is null or not exists (select 1 from public.profiles p where p.id = v_author) then
    return;
  end if;

  for r in
    select * from (values
    ('baladin-zanzibar-beach-hotel-restaurant', array[
      'https://www.myboutiquehotel.com/photos/110079/baladin-zanzibar-beach-hotel-zanzibar-021-17338-2220x1400.jpg',
      'https://www.myboutiquehotel.com/photos/110079/baladin-zanzibar-beach-hotel-zanzibar-022-17338-2220x1400.jpg',
      'https://www.myboutiquehotel.com/photos/110079/baladin-zanzibar-beach-hotel-zanzibar-020-17338-2220x1400.jpg',
      'https://www.myboutiquehotel.com/photos/110079/baladin-zanzibar-beach-hotel-zanzibar-024-17339-2220x1400.jpg',
      'https://www.myboutiquehotel.com/photos/110079/baladin-zanzibar-beach-hotel-zanzibar-006-17336-2220x1400.jpg'
    ]),
    ('blue-moon-villa-restaurant', array[
      'https://q-xx.bstatic.com/xdata/images/hotel/max1280/515940217.jpg?k=6ef3b95b2cb7bafbda75ecff7d91de46c8f870fd29c015169cb538fc98ab8df1&o=&a=328129',
      'https://q-xx.bstatic.com/xdata/images/hotel/max1280/515940222.jpg?k=a4bf68a626a4a54f21c515275d964bf227e53a1ec80baabb8b53c275e99f7029&o=&a=328129',
      'https://q-xx.bstatic.com/xdata/images/hotel/max1280/515940226.jpg?k=aca0a5f0d1194ab901141e5e919edae8680033246f2e2d7148b916137da90402&o=&a=328129',
      'https://q-xx.bstatic.com/xdata/images/hotel/max1280/515940229.jpg?k=ba2ef066f222a26d4c22674fa06803644aa8e9afe2bce591e8a3f7cd5c1a8d1d&o=&a=328129'
    ]),
    ('blue-pontile-dongwe', array[
      'https://ak-d.tripcdn.com/images/0584512000iffaw7r5136_Z_1280_853_R50_Q90.jpg',
      'https://ak-d.tripcdn.com/images/0585412000l5xz8vv796E_Z_1280_853_R50_Q90.jpg',
      'https://ak-d.tripcdn.com/images/0584i12000o01ilrc51DD_Z_1280_853_R50_Q90.jpg',
      'https://ak-d.tripcdn.com/images/0586o12000k571hzvBDC9_Z_1280_853_R50_Q90.jpg',
      'https://ak-d.tripcdn.com/images/0226412000kwlo4ohA6C0_Z_1280_853_R50_Q90.jpg'
    ]),
    ('kameleon-blue-bar-restaurant', array[
      'https://i.travelapi.com/lodging/89000000/88290000/88288500/88288412/4e477d26_z.jpg',
      'https://i.travelapi.com/lodging/89000000/88290000/88288500/88288412/9a1a0aeb_z.jpg',
      'https://i.travelapi.com/lodging/89000000/88290000/88288500/88288412/688216c8_z.jpg',
      'https://i.travelapi.com/lodging/89000000/88290000/88288500/88288412/6f4cd583_z.jpg',
      'https://i.travelapi.com/lodging/89000000/88290000/88288500/88288412/c56d1bc4_z.jpg'
    ]),
    ('la-base-junglekite', array[
      'https://junglekitelabase.com/wp-content/uploads/2026/06/image00044-38-2.jpg',
      'https://junglekitelabase.com/wp-content/uploads/2026/06/labase-3-49.jpg',
      'https://junglekitelabase.com/wp-content/uploads/2026/06/labase-33-61.jpg',
      'https://junglekitelabase.com/wp-content/uploads/2026/06/image00048-40.jpg',
      'https://junglekitelabase.com/wp-content/uploads/2019/03/DSC_4497-3.jpg'
    ]),
    ('la-capannina-zanzibar', array[
      'https://www.lapiliresidence.com/wp-content/uploads/2025/05/lapili-residence-restaurant-la-capannina-kiwengwa-zanzibar-4.jpg',
      'https://cmsphoto.ww-cdn.com/superstatic/2467743/art/grande/60675834-44391001.jpg?v=1638278681',
      'https://cmsphoto.ww-cdn.com/superstatic/2467743/art/grande/60675834-44391004.jpg?v=1638278709',
      'https://cmsphoto.ww-cdn.com/superstatic/2467743/art/grande/60675834-44391013.jpg?v=1638278737',
      'https://cmsphoto.ww-cdn.com/superstatic/2467743/art/grande/60675834-44391003.jpg?v=1638278695'
    ]),
    ('leo-beach-bar-restaurant', array[
      'https://i.travelapi.com/lodging/45000000/44240000/44230500/44230467/38a08fd0_z.jpg',
      'https://i.travelapi.com/lodging/45000000/44240000/44230500/44230467/911b58bc_z.jpg',
      'https://i.travelapi.com/lodging/45000000/44240000/44230500/44230467/df12ede4_z.jpg',
      'https://i.travelapi.com/lodging/45000000/44240000/44230500/44230467/8a2540e3_z.jpg',
      'https://i.travelapi.com/lodging/45000000/44240000/44230500/44230467/9b469164_z.jpg'
    ]),
    ('mapacha-food-court', array[
      'https://static.wixstatic.com/media/b630f1_48ba0e9218d4408bbba6d7232fd3b74a~mv2.jpg',
      'https://static.wixstatic.com/media/b630f1_c6b7d6033c7e42d2ab925f7e3836f38f~mv2.jpeg',
      'https://cmsphoto.ww-cdn.com/superstatic/2467743/art/grande/77653828-56414386.jpg?v=1704547882',
      'https://static.wixstatic.com/media/b630f1_8de5b0e10c604c87803fb110485a3ebe~mv2.jpg'
    ]),
    ('ocean-boho-house-restaurant', array[
      'https://oceanbohohouse.com/img/restaurant-lights.jpg',
      'https://oceanbohohouse.com/img/restaurant-deck.jpg',
      'https://oceanbohohouse.com/img/dish-lobster.jpg',
      'https://oceanbohohouse.com/img/dish-calamari.jpg',
      'https://oceanbohohouse.com/img/dish-by-pool.jpg'
    ]),
    ('pongwe-beach-hotel-restaurant', array[
      'https://i.travelapi.com/lodging/9000000/8060000/8057400/8057383/9c66b4c9_z.jpg',
      'https://i.travelapi.com/lodging/9000000/8060000/8057400/8057383/58f40ec4_z.jpg',
      'https://i.travelapi.com/lodging/9000000/8060000/8057400/8057383/ed3c2f6d_z.jpg',
      'https://pongwe.com/wp-content/uploads/2026/08/Pongwe-Gabriels-Kitchen-Site-Images-8.jpg',
      'https://pongwe.com/wp-content/uploads/2026/08/Pongwe-Gabriels-Kitchen-Site-Images-6.jpg'
    ]),
    ('sahari-zanzibar', array[
      'https://saharizanzibar.com/wp-content/uploads/2022/12/Sahari-027.webp',
      'https://saharizanzibar.com/wp-content/uploads/2022/12/Sahari-034.webp',
      'https://saharizanzibar.com/wp-content/uploads/2022/12/Sahari-033.webp',
      'https://saharizanzibar.com/wp-content/uploads/2022/12/Sahari-031.webp',
      'https://saharizanzibar.com/wp-content/uploads/2022/12/Sahari-038.webp'
    ]),
    ('the-breeze-tui-blue-bahari', array[
      'https://www.tui-blue.com/media/hotels/Bahari_Zanzibar/Kulinarik/Kulinarik_NEU_2022/tui-blue-bahari-zanzibar-speciality-restaurant-the-breeze.jpg',
      'https://www.tui-blue.com/media/hotels/Bahari_Zanzibar/Kulinarik_NEU_2021/tui-blue-bahari-zanzibar-breeze-7.jpg',
      'https://www.tui-blue.com/media/hotels/Bahari_Zanzibar/Uebersicht_NEU_2022/tui-blue-bahari-zanzibar-beach.jpg'
    ]),
    ('the-island-pongwe-restaurant', array[
      'https://static.wixstatic.com/media/14dbea_68418644f0a54ab3825ebf353acb9a45~mv2.jpeg',
      'https://static.wixstatic.com/media/14dbea_6d5a5793577c4d79bb4dde837a5dde33~mv2.jpg',
      'https://static.wixstatic.com/media/14dbea_c553aaf8f2644bf99ec48f1d12bedc0a~mv2.jpeg',
      'https://static.wixstatic.com/media/14dbea_50eb0f789a924424b4aef0bc6cd341b1~mv2.jpg'
    ]),
    ('zanzibar-sunrise-at-bandas-restaurant', array[
      'https://zanzibarsunrise.com/wp-content/uploads/2024/05/hotel.jpg',
      'https://i.travelapi.com/lodging/23000000/22800000/22797900/22797890/1fa949aa_z.jpg',
      'https://i.travelapi.com/lodging/23000000/22800000/22797900/22797890/35dfcabb_z.jpg',
      'https://i.travelapi.com/lodging/23000000/22800000/22797900/22797890/fcccbeff_z.jpg',
      'https://i.travelapi.com/lodging/23000000/22800000/22797900/22797890/1287ca5b_z.jpg'
    ]),
    ('zanzibarista', array[
      'https://cdn.prod.website-files.com/65e431fb67b227d8df3d76d3/663f390553275a78f251e029_Hero%20Beach%20Bar.webp',
      'https://cdn.prod.website-files.com/65e431fb67b227d8df3d76d3/6646102795fc6f173b3fab4c_16.webp',
      'https://cdn.prod.website-files.com/65e431fb67b227d8df3d76d3/66461028cabbf4e45c4867ff_19.webp',
      'https://cdn.prod.website-files.com/65e431fb67b227d8df3d76d3/66461026856f6e7d3f832d4e_6.webp',
      'https://cdn.prod.website-files.com/65e431fb67b227d8df3d76d3/663f412e26f763216e31595f_SesameCrustedTunaSteak.webp'
    ])
    ) as src (slug, images)
  loop
    select b.id, b.place_id into v_business, v_place
    from public.businesses b
    where b.space_id = v_space and b.slug = r.slug and b.image_url is null
      and not exists (select 1 from public.business_images i where i.business_id = b.id);
    if v_business is null then
      continue;
    end if;

    update public.businesses set image_url = r.images[1] where id = v_business;
    update public.places set cover_url = r.images[1] where id = v_place and cover_url is null;
    for i in 1 .. array_length(r.images, 1) loop
      insert into public.business_images (business_id, url, sort_order, created_by)
      values (v_business, r.images[i], i - 1, v_author);
    end loop;
  end loop;

  delete from public.business_images i
  using public.businesses b
  where i.business_id = b.id and b.space_id = v_space and b.slug = 'organzibar'
    and i.url = 'https://organzibar.com/og-image.png'
    and b.image_url is distinct from i.url;

  delete from public.businesses b
  where b.space_id = v_space and b.slug = 'passion-thyme-2'
    and exists (select 1 from public.businesses o where o.space_id = v_space and o.slug = 'passion-thyme')
    and not exists (select 1 from public.business_images x where x.business_id = b.id)
    and not exists (select 1 from public.business_reviews x where x.business_id = b.id)
    and not exists (select 1 from public.business_review_replies x where x.business_id = b.id)
    and not exists (select 1 from public.business_saves x where x.business_id = b.id)
    and not exists (select 1 from public.business_claims x where x.business_id = b.id)
    and not exists (select 1 from public.recommendations x where x.business_id = b.id)
    and not exists (select 1 from public.job_listings x where x.business_id = b.id)
    and not exists (select 1 from public.accommodation_listings x where x.business_id = b.id);
end
$seed$;
