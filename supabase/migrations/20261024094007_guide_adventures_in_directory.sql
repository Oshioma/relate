-- =============================================================================
-- Relate — the adventure guide's activities, listed in the business directory
--
-- Every adventure in Mzungu Zanzibar's "Off the Sun Lounger: Zanzibar's
-- Adventures" guide becomes a listing in the community's business directory,
-- category "activity", so they all show on the Activities page. The text is
-- the guide's own (tagline, description and how to book), the photos are the
-- guide's securely identified ones (the directory shows no caption, so
-- UNVERIFIED photos stay in the guide), and each listing gets its own place,
-- pinned at the activity's approximate position, the way a listing added in
-- the app does. Zanzibar Watersports' catamaran cruises and Tumbatu snorkelling
-- get listings of their own.
--
-- Skydive Zanzibar, Zanzibar Horse Club and Nungwi Mnarani Aquarium are
-- already listed and the guide links to them, so they're not in the list; any
-- row whose slug or name is already in the directory is left alone, so this
-- never duplicates a listing and is safe to re-run. Listed as added by the
-- community's admin (Osh Admin), who can edit or remove them like any other.
--
-- Looked up by the community's slug and the admin's id, so a no-op anywhere
-- else. No schema change.
-- =============================================================================

do $seed$
declare
  v_space uuid;
  v_community uuid;
  v_author uuid := '484bd7fe-e0b2-494a-a6a9-1bb79659821d';
  v_place uuid;
  v_business uuid;
  r record;
  i int;
begin
  select s.id, s.community_id into v_space, v_community
  from public.spaces s
  join public.communities c on c.id = s.community_id
  where c.slug = 'mzunguzanzibar' and s.slug = 'business-directory' and s.space_type = 'business_directory';
  if v_space is null or not exists (select 1 from public.profiles p where p.id = v_author) then
    return;
  end if;

  for r in
    select *
    from (values
  ('helicopter-flight', 'Scenic helicopter flights', 'Airport & Kiwengwa', 'Airport & Kiwengwa (Island-wide)', 'Reef channels, sandbanks and Mnemba atoll from the air.

Since June 2026, Tropic Helicopters has had two Airbus H120s based permanently on the island, flying scenic loops, island hops and resort transfers. Low over the reef channels, sandbanks and Mnemba atoll, it''s the only way to take in the whole sweep of the coast.

Hotels sell private 30- or 60-minute flights — Tulia Zanzibar in Pongwe offers them for up to four or six passengers — from the airport or a landing area at Kiwengwa.

How to book: Book through your hotel or a tour planner (Tulia Zanzibar sells flights directly); there''s no Zanzibar-specific booking site yet. Priced per aircraft, so it suits groups of three to six sharing.', 'https://tuliazanzibar.com/helicopter-scenic-flight-zanzibar/', -6.222, 39.225, array['https://www.mzunguzanzibar.com/guides/adventure/helicopter-flight-1-1280.webp']),
  ('mnemba-diving', 'Scuba diving at Mnemba Atoll', 'Matemwe & Muyuni', 'Matemwe & Muyuni (North-east coast)', 'Coral walls, turtles, white-tip reef sharks and twenty-metre visibility.

Mnemba''s oval reef, seven kilometres by four in a protected conservation area off Matemwe, is Zanzibar''s best-known dive: walls dropping from two to forty metres, coral blocks full of frogfish and morays, schooling snappers and fusiliers, Napoleon wrasse, white-tip reef sharks and green turtles, which have nested on the island since monitoring began in 1996. Dolphins often join the boat ride out.

Matemwe and Muyuni are minutes away by boat. One Ocean (Zanzibar''s first PADI five-star centre, since 2001), Dive Point and Scubafish all run two-dive morning trips, with try-dives for complete beginners and four-day Open Water courses.

How to book: Book with One Ocean (zanzibaroneocean.com) in Matemwe or Kiwengwa, Dive Point (divepointzanzibar.com) in Muyuni or Scubafish (scubafishzanzibar.com) in Matemwe. Trips leave around 08:00 and are back by early afternoon. From Nungwi and Kendwa it''s a long boat ride.', 'https://zanzibaroneocean.com/', -5.8709, 39.3535, array['https://www.mzunguzanzibar.com/guides/adventure/mnemba-diving-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/mnemba-diving-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/mnemba-diving-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/mnemba-diving-5-1280.webp']),
  ('north-coast-diving', 'Diving the north coast and Leven Bank', 'Nungwi & Kendwa', 'Nungwi & Kendwa (Northern tip)', 'Frogfish and seahorses close in; sharks and big currents at Leven Bank.

Off Nungwi, Kendwa and Tumbatu Island, the shallow, sheltered reefs are some of the best places on the island to learn and to look for small things: frogfish, seahorses, ghost pipefish, leaf fish and nudibranchs. Further out, Hunga and Nankivell are patch reefs with schooling snappers and rays, dived on slack tide.

Leven Bank, a pinnacle in the Pemba Channel with walls dropping past 160 metres, is the island''s big-animal dive — sharks, rays and big game fish in strong current, for experienced divers only.

How to book: Zanzibar Watersports in Kendwa runs dives from dhows and a speedboat; One Ocean has a Kendwa base. Spanish Dancer Divers in Nungwi is well reviewed, but its website is currently down — confirm it''s trading before you book.', 'https://zanzibarwatersports.com/', -5.752, 39.289, array['https://www.mzunguzanzibar.com/guides/adventure/north-coast-diving-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/north-coast-diving-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/north-coast-diving-6-1280.webp']),
  ('stone-town-reefs', 'Wrecks and reefs off Stone Town', 'Stone Town', 'Stone Town (West coast)', 'A Victorian cable ship at 4–12 metres, and turtles at Bawe.

A few kilometres off Stone Town, the Great Northern — a British cable-laying ship built in 1870 and sunk on New Year''s Eve 1902 — lies at four to twelve metres, shallow enough for snorkellers to see. Bawe Island has a coral wall with cuttlefish, seahorses and batfish on one side and a long shallow reef with green and hawksbill turtles on the other.

One Ocean''s Stone Town centre runs reef, wreck and night dives; half-day snorkel trips to Bawe, Changuu (Prison Island) and the Nyange sandbank leave from the seafront.

How to book: Dive with One Ocean, Stone Town (boats leave Kenyatta Road around 09:00, back by 13:30). Snorkel trips are sold widely along the seafront — ask about group size and gear before you pay.', 'https://zanzibaroneocean.com/', -6.1615, 39.1868, array['https://www.mzunguzanzibar.com/guides/adventure/stone-town-reefs-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/stone-town-reefs-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/stone-town-reefs-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/stone-town-reefs-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/stone-town-reefs-6-1280.webp']),
  ('mnemba-snorkelling', 'Snorkelling at Mnemba', 'Matemwe', 'Matemwe (North-east coast)', 'Turtles, anemonefish and coral heads in two to six metres of clear water.

Mnemba''s shallow reef, two to six metres over coral heads, is where most visitors first put their faces in the Indian Ocean: anemonefish, boxfish, sergeant majors, starfish, turtles, and often dolphins on the way out.

Boats leave Matemwe and Muyuni for a short ride. From Kendwa, Zanzibar Watersports runs a full day to Mnemba with a guide and a vegetarian lunch on board, and on Saturdays its "Seafari" goes by dhow, with a seafood lunch and the marine-park fee included.

How to book: Go with a dive centre''s snorkel boat — One Ocean and Scubafish in Matemwe — or from Kendwa with Zanzibar Watersports (daily Mnemba trips leave at 09:15 and return by about 16:00; the Seafari dhow runs on Saturdays only). Make sure the boat has life jackets and a dedicated snorkel guide.', 'https://scubafishzanzibar.com/', -5.8624, 39.355, array['https://www.mzunguzanzibar.com/guides/adventure/mnemba-snorkelling-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/mnemba-snorkelling-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/mnemba-snorkelling-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/mnemba-snorkelling-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/mnemba-snorkelling-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/mnemba-snorkelling-6-1280.webp']),
  ('tumbatu-snorkelling', 'Snorkelling Tumbatu with Zanzibar Watersports', 'Kendwa', 'Kendwa (North-west coast)', 'Shallow, wonderfully preserved reefs off a quiet island, a morning''s sail from Kendwa.

Off Tumbatu, the island across the channel from Kendwa, the reefs come almost to the surface and are some of the best preserved on Zanzibar: thousands of fish, ribbon eels and whip gobies, with the action close enough to touch — though you shouldn''t.

Zanzibar Watersports runs the trip as a half-day from Kendwa, past a hundred-year-old lighthouse, with a guide in the water carrying a life ring, all the gear and free buoyancy aids for anyone less confident. The same team runs a full day to Mnemba, with a vegetarian lunch on board.

How to book: Book the day before with Zanzibar Watersports (zanzibarwatersports.com) and be at Kendwa beach 15 minutes before the 09:15 departure. Water and fresh fruit are included.', 'https://zanzibarwatersports.com/snorkeling/', -5.7535, 39.288, array['https://www.mzunguzanzibar.com/guides/adventure/tumbatu-snorkelling-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/tumbatu-snorkelling-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/tumbatu-snorkelling-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/tumbatu-snorkelling-4-1280.webp']),
  ('chumbe-snorkelling', 'Snorkelling Chumbe Island Coral Park', 'Chumbe Island', 'Chumbe Island (West coast)', 'Tanzania''s first marine park: rangers, 500 reef fish and no fishing since 1992.

Chumbe''s fringing reef has been closed to fishing since 1992 and became Tanzania''s first marine park in 1994, run by a non-profit. More than 500 reef fish species and almost 60 kinds of hard coral have been recorded. Rangers lead about an hour of snorkelling, with all the gear and floats provided, then a forest walk, an intertidal walk and the old lighthouse.

Scuba diving is banned, numbers are capped, and day visits are taken only when the eco-lodge has space.

How to book: Book direct (chumbeisland.com) — bookings open just four days ahead and are capped at about 14 visitors. Check in at 09:30 at Jungle Paradise Resort, about 10 minutes south of Stone Town, for the 10:00 boat. Staying overnight gets better reviews than the day trip.', 'https://chumbeisland.com/', -6.2775, 39.1831, array['https://www.mzunguzanzibar.com/guides/adventure/chumbe-snorkelling-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/chumbe-snorkelling-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/chumbe-snorkelling-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/chumbe-snorkelling-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/chumbe-snorkelling-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/chumbe-snorkelling-6-1280.webp']),
  ('safari-blue-menai', 'Safari Blue in Menai Bay', 'Fumba', 'Fumba (South-west coast)', 'A day by dhow: sandbanks, a reef, a lagoon and lunch under a baobab.

From Fumba village, mahogany dhows cross the Menai Bay Conservation Area to sandbanks, a reef snorkel stop and Kwale Island, with its tidal lagoon, its giant baobab and a seafood lunch. Bottlenose and humpback dolphins are often seen on the crossing.

The Original Safari Blue has run the trip since 1995 and says it uses no single-use plastic. Many cheaper trips copy the name — check the company on your booking.

How to book: Book The Original Safari Blue (safariblue.net) a day or two ahead; it''s a full day with food and drinks included. Fumba is about 30 minutes from Stone Town.', 'https://safariblue.net/', -6.308, 39.2665, array['https://www.mzunguzanzibar.com/guides/adventure/safari-blue-menai-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/safari-blue-menai-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/safari-blue-menai-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/safari-blue-menai-6-1280.webp']),
  ('kizimkazi-dolphins', 'Dolphins at Kizimkazi', 'Kizimkazi', 'Kizimkazi (South coast)', 'Resident bottlenose and humpback dolphins — and a real problem with how they''re watched.

Indo-Pacific bottlenose and Indian Ocean humpback dolphins live year-round in the Menai Bay Conservation Area off Kizimkazi, and small boats leave the beach at dawn to find them.

We have to be honest: research off Kizimkazi has found that tourist boats cut into the dolphins'' resting, feeding and socialising, and recent reviews describe twenty or thirty boats chasing a handful of dolphins. Guidelines exist but are weakly enforced, and we couldn''t verify any operator as consistently not chasing, so we don''t recommend one.

How to book: If you go, choose a small operator and ask before you pay how close they approach, whether they chase or surround a pod, and how many boats will be there. Agree the price in advance. Kizimkazi is about 1–1½ hours from Stone Town or 45 minutes from Paje.', null, -6.4371, 39.4619, array['https://www.mzunguzanzibar.com/guides/adventure/kizimkazi-dolphins-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/kizimkazi-dolphins-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/kizimkazi-dolphins-6-1280.webp']),
  ('nungwi-sea-walk', 'Sea walking at Nungwi', 'Nungwi', 'Nungwi (Northern tip)', 'Walk on the seabed in an air-fed helmet — no swimming needed.

Zanzibar SeaWalk takes you out by boat to a platform off Nungwi, fits you with an air-fed helmet and lets you walk the sandy seabed for about twenty minutes among sergeant majors and reef fish. You don''t need to swim or dive, and you can keep your glasses on.

How to book: Book with Zanzibar SeaWalk (zanzibar-seawalk.com), based at Double A Beach Hotel in Nungwi. Some packages include photos and video.', 'https://zanzibar-seawalk.com/', -5.7256, 39.2927, array['https://www.mzunguzanzibar.com/guides/adventure/nungwi-sea-walk-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/nungwi-sea-walk-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/nungwi-sea-walk-3-1280.webp']),
  ('deep-sea-fishing', 'Deep-sea fishing from Nungwi', 'Nungwi & Kendwa', 'Nungwi & Kendwa (Northern tip)', 'Wahoo, dorado, tuna and sailfish in the Pemba Channel.

From Nungwi and Kendwa, sportfishing boats head out into the deep Pemba Channel and over Leven Bank for yellowfin tuna, wahoo, dorado, kingfish, giant trevally and, in season, sailfish and marlin. Day charters, night fishing and multi-day trips are all on offer.

Fishing Zanzibar, now part of Zanzibar Yacht Charter, has fished from Nungwi since 2005; Zanzibar Watersports in Kendwa runs its own small fleet.

How to book: Charter a boat with Zanzibar Yacht Charter (zanzibaryachtcharter.com) in Nungwi or Zanzibar Watersports in Kendwa. Agree the weather and cancellation policy before you pay.', 'https://zanzibaryachtcharter.com/fishing-charters/', -5.726, 39.296, array['https://www.mzunguzanzibar.com/guides/adventure/deep-sea-fishing-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/deep-sea-fishing-5-1280.webp']),
  ('paje-kitesurfing', 'Kitesurfing in Paje', 'Paje', 'Paje (South-east coast)', 'East Africa''s kitesurfing capital: a huge, warm, waist-deep lagoon.

Behind a reef a kilometre and a half offshore, Paje''s lagoon is huge, sandy and waist- to knee-deep, with the wind blowing side-onshore — one of the best places in the world to learn. A dozen schools line the beach; most beginners are riding short distances after a three-day, nine- or ten-hour course.

Experienced riders head out to the reef for waves, in groups or with a guide. Kite Centre Zanzibar (since 2006), B4 Kitesurf, Aquaholics and Zanzibar Kite Paradise are among the best-rated schools.

How to book: Book a course a few days ahead in peak months. Kite Centre Zanzibar (kitecentrezanzibar.com), B4 Kitesurf (b4kite.surf), Aquaholics and Zanzibar Kite Paradise all teach here, and rent gear to certified riders.', 'https://kitecentrezanzibar.com/', -6.2691, 39.5364, array['https://www.mzunguzanzibar.com/guides/adventure/paje-kitesurfing-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/paje-kitesurfing-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/paje-kitesurfing-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/paje-kitesurfing-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/paje-kitesurfing-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/paje-kitesurfing-6-1280.webp']),
  ('jambiani-kitesurfing', 'Kitesurfing in Jambiani', 'Jambiani', 'Jambiani (South-east coast)', 'The quieter Paje: a big lagoon behind a 2 km sandbank, with space to learn.

Five to eight kilometres south of Paje, a two-kilometre sandbank forms another big, shallow lagoon with a side-shore wind — and far fewer kites. Advanced riders head out to the reef waves or downwind all the way to Paje.

ZanziKite, Coconuts Kite (IKO-listed) and Mawimbi Kite School teach here, with Zanzibar Kitesurfing working both beaches.

How to book: Book with ZanziKite (zanzi-kite.com) or Coconuts Kite (coconutskite.com); Mawimbi Kite School has no website, so contact it through its Google listing or Instagram.', 'https://zanzi-kite.com/', -6.3366, 39.5543, array['https://www.mzunguzanzibar.com/guides/adventure/jambiani-kitesurfing-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/jambiani-kitesurfing-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/jambiani-kitesurfing-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/jambiani-kitesurfing-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/jambiani-kitesurfing-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/jambiani-kitesurfing-6-1280.webp']),
  ('kiwengwa-kitesurfing', 'Kitesurfing and windsurfing in Kiwengwa', 'Kiwengwa', 'Kiwengwa (East coast)', 'An official Duotone centre on an uncrowded north-east lagoon.

On the long white beach at Kiwengwa, the Duotone Pro Center teaches kitesurfing, wing foiling, kite foiling and — unusually for Zanzibar — windsurfing, with at most two students per instructor and a rescue boat on standby.

The lagoon is wide and far less busy than Paje, with The Beach Lounge right on the spot for afterwards.

How to book: Book with the Duotone Pro Center (dpc-zanzibar.com) at Mvuvi Boutique Resort. Zanzibar Watersports in Kendwa also runs kite lessons through a partner centre, with transfers.', 'https://www.dpc-zanzibar.com/', -5.9937, 39.3803, array['https://www.mzunguzanzibar.com/guides/adventure/kiwengwa-kitesurfing-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/kiwengwa-kitesurfing-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/kiwengwa-kitesurfing-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/kiwengwa-kitesurfing-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/kiwengwa-kitesurfing-5-1280.webp']),
  ('wing-foiling', 'Wing foiling', 'Paje & Kiwengwa', 'Paje & Kiwengwa (East and south-east)', 'Flying over the lagoon on a foil, with a wing in your hands.

Wing foiling — holding an inflatable wing while riding a board on a hydrofoil — works in lighter wind than kitesurfing, and the lagoons are a good place to learn. Lessons start on a big board in the shallows; some schools tow you behind a boat to get the feel of the foil.

Kite Centre Zanzibar and Zanzibar Kite Paradise teach it in Paje, the Duotone Pro Center in Kiwengwa (a nine-hour, three-day beginner course), and ZanziKite and Coconuts Kite in Jambiani.

How to book: Book a beginner course with Kite Centre Zanzibar or Zanzibar Kite Paradise in Paje, or the Duotone Pro Center in Kiwengwa.', 'https://kitecentrezanzibar.com/', -6.2802, 39.537, array['https://www.mzunguzanzibar.com/guides/adventure/wing-foiling-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/wing-foiling-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/wing-foiling-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/wing-foiling-5-1280.webp']),
  ('reef-surfing', 'Reef surfing off Dongwe and Jambiani', 'Paje, Dongwe & Jambiani', 'Paje, Dongwe & Jambiani (South-east coast)', 'Yes, Zanzibar has surf — on the outer reef, by boat, for a few hours a day.

Zanzibar''s waves break on the outer reef, reached by boat, and they work only for an hour and a half to three hours a day around specific tides. Off Dongwe, Tamarins is a soft, knee-to-waist-high right for beginners; Doughnuts, on the outside of the same reef, is fast and powerful; Keep Lefties is a left that holds on small swells.

Off Jambiani, J-Box is the longest right on the coast, waist to overhead, working only on the lowest tides. Aquaholics in Paje guides surf trips and lessons; Kite Centre Zanzibar and the Duotone Pro Center run reef sessions too.

How to book: Go guided — the breaks don''t appear on forecast sites and need a boat. Book with Aquaholics (aquaholics-zanzibar.com) in Paje.', 'https://aquaholics-zanzibar.com/', -6.2667, 39.5364, array['https://www.mzunguzanzibar.com/guides/adventure/reef-surfing-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/reef-surfing-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/reef-surfing-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/reef-surfing-5-1280.webp']),
  ('sup-mangroves-chukwani', 'Stand-up paddling in the Chukwani mangroves', 'Chukwani', 'Chukwani (West coast, near Stone Town)', 'Gliding through mangrove tunnels, with a floating bar at sunset.

In the sheltered mangrove creeks at Chukwani, just south of Stone Town, 2 Winds Paddle Sports — the island''s first stand-up paddle school — leads three-hour tours by board or kayak through tunnels and channels, with birds, crabs and young fish below.

There''s a sunset paddle with a floating bar, a floating breakfast at sunrise, paddleboard yoga and a seven-kilometre paddle all the way to Stone Town.

How to book: Book with 2 Winds Paddle Sports (paddlesportszanzibar.com), which takes a deposit and refunds or reschedules if it cancels for weather. Transfers are extra. Aquaholics (Paje) and the Duotone Pro Center (Kiwengwa) rent boards on the east coast.', 'https://paddlesportszanzibar.com/', -6.2231, 39.2042, array['https://www.mzunguzanzibar.com/guides/adventure/sup-mangroves-chukwani-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/sup-mangroves-chukwani-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/sup-mangroves-chukwani-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/sup-mangroves-chukwani-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/sup-mangroves-chukwani-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/sup-mangroves-chukwani-6-1280.webp']),
  ('kayak-michamvi-mangroves', 'Kayaking the mangroves at Michamvi', 'Michamvi', 'Michamvi (South-east coast (Chwaka Bay side))', 'Mangrove tunnels, then out across the bay as the sun goes down.

On the Chwaka Bay side of the Michamvi peninsula, Ally Kayak takes small groups in sit-on-top kayaks through the mangrove tunnels and out across the bay — and because this shore faces west, sunset paddles are the favourite.

South of Stone Town, the mangroves around Uzi Island, reached by a causeway that floods at high tide, are another kayaking spot, usually combined with a village visit.

How to book: Contact Ally Kayak in Michamvi through Instagram or WhatsApp to agree a time with the tide; it''s a small, informal operator, so confirm the day before. 2 Winds (Chukwani) also has kayaks.', 'https://www.instagram.com/allykayak_michamvi/', -6.1438, 39.492, array['https://www.mzunguzanzibar.com/guides/adventure/kayak-michamvi-mangroves-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/kayak-michamvi-mangroves-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/kayak-michamvi-mangroves-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/kayak-michamvi-mangroves-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/kayak-michamvi-mangroves-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/kayak-michamvi-mangroves-6-1280.webp']),
  ('dhow-sailing-kendwa', 'Dhow sailing from Kendwa', 'Kendwa', 'Kendwa (North-west coast)', 'A wooden dhow under a lateen sail, into the sunset.

Kendwa faces west, which makes it the island''s classic sunset-dhow beach: two hours under a traditional lateen sail with drinks as the sun goes down. Full-day sails go to Mnemba with snorkelling, a sandbank stop and a seafood lunch on board.

Zanzibar Watersports runs the sunset dhow from Kendwa Rocks beach (16:30–18:30) and, on Saturdays, the full-day "Seafari" to Mnemba; Dream Dhow, which says it uses no plastic, doesn''t chase dolphins and never anchors on coral, and Zanzibar Dhow are both well reviewed.

How to book: Book the day before with Zanzibar Watersports (zanzibarwatersports.com), Dream Dhow (dreamdhow.com) or Zanzibar Dhow on Kendwa beach. In the south-west, Safari Blue runs the best-known full-day dhow sail from Fumba.', 'https://zanzibarwatersports.com/', -5.757, 39.2879, array['https://www.mzunguzanzibar.com/guides/adventure/dhow-sailing-kendwa-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/dhow-sailing-kendwa-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/dhow-sailing-kendwa-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/dhow-sailing-kendwa-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/dhow-sailing-kendwa-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/dhow-sailing-kendwa-6-1280.webp']),
  ('catamaran-kendwa', 'Catamaran cruises with Zanzibar Watersports', 'Kendwa', 'Kendwa (North-west coast)', 'Trampolines, cushions and the open sea — and a Saturday sunset party on board.

Zanzibar Watersports sails two Polynesian-style catamarans from Kendwa: Pelagic One, at 35 feet, and the 45-foot Tsitsikamma. Both are built for open-air lounging, with no cabin — just two big trampolines, a wide open deck scattered with cushions, a galley and a toilet on board — and take up to 20 people.

Charter one for a half-day or full-day cruise, a sunset sail, a fishing trip or as a floating base for a day of diving or kiting; every Saturday from 17:00 to 20:00, Pelagic One hosts the Kendwa By Night party at sea.

How to book: Book a private charter (half day, full day or sunset) with Zanzibar Watersports (zanzibarwatersports.com) in Kendwa, or join the Saturday Kendwa By Night party. Prices are per boat for a group, so it''s best value shared. There are no overnight trips.', 'https://zanzibarwatersports.com/catamaran-charters/', -5.7535, 39.2885, array['https://www.mzunguzanzibar.com/guides/adventure/catamaran-kendwa-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/catamaran-kendwa-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/catamaran-kendwa-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/catamaran-kendwa-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/catamaran-kendwa-5-1280.webp']),
  ('motor-watersports-kendwa', 'Parasailing, jet skis and waterskiing at Kendwa', 'Kendwa & Nungwi', 'Kendwa & Nungwi (North-west coast)', 'Three hundred metres over the reef, then a wakeboard and an inflatable water park.

Kendwa is the island''s motor-watersports beach. Zanzibar Watersports flies parasails about 300 metres over the Nungwi–Kendwa reef (tandem rides allowed) and tows waterskiers, wakeboarders and ringos; Nengo Water Sports adds jet skis, a "jet car", clear kayaks and drone filming.

Just offshore, Splash Paradise is an inflatable water park of slides and climbing walls, open daily.

How to book: Book on the beach or ahead with Zanzibar Watersports (zanzibarwatersports.com) or Nengo Water Sports (nengowatersports.com). For Splash Paradise, life vests are compulsory, under-12s need an adult and everyone signs a waiver.', 'https://zanzibarwatersports.com/', -5.754, 39.288, array['https://www.mzunguzanzibar.com/guides/adventure/motor-watersports-kendwa-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/motor-watersports-kendwa-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/motor-watersports-kendwa-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/motor-watersports-kendwa-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/motor-watersports-kendwa-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/motor-watersports-kendwa-6-1280.webp']),
  ('quad-biking', 'Quad biking through the villages', 'Nungwi, Kiwengwa & Jambiani', 'Nungwi, Kiwengwa & Jambiani (North, north-east and south-east)', 'Dust, baobabs, sugar cane and fishing villages, on an automatic quad.

Quad tours run for two and a half to four hours along farm tracks and village lanes, past baobabs, spice trees and sugar cane to a beach stop, with coconuts and fruit along the way. Afternoon rides on the north coast finish at sunset.

Osseliche runs from Nungwi and Kendwa; Zanzibar Quad Adventure, which says it was the island''s first in 2008, rides from Kiwengwa and Jambiani. The quads are automatic, so no off-road experience is needed.

How to book: Operators include hotel pickup in their area: Osseliche (Nungwi and Kendwa) and Zanzibar Quad Adventure (Kiwengwa and Jambiani). Book a day or two ahead; private or small-group tours are calmer than a convoy.', 'https://www.zanzibarquadadventure.com/', -5.9722, 39.37, array['https://www.mzunguzanzibar.com/guides/adventure/quad-biking-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/quad-biking-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/quad-biking-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/quad-biking-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/quad-biking-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/quad-biking-6-1280.webp']),
  ('cycling', 'Bike tours from Stone Town and bike hire in Paje', 'Stone Town & Paje', 'Stone Town & Paje (West and south-east)', 'Alleys, spice farms and village lanes at bicycle pace.

Happy Bikes Zanzibar runs guided rides from the Old Fort: a Stone Town tour through the old town and Ng''ambo, the town''s other side, and a six-hour spice-farm ride out to Dole village, back through Masingini forest, where red colobus monkeys are sometimes seen.

On the east coast you can hire a bike in Paje and ride the flat lanes to Jambiani and Bwejuu — or along the hard sand at low tide.

How to book: Book Happy Bikes through its website or Airbnb Experiences (the Stone Town tour is 18+, up to 10 riders). In Paje, bike hire is a walk from most hotels; ask your hotel for the nearest.', 'https://happybikeszanzibar.com/', -6.1622, 39.1886, array['https://www.mzunguzanzibar.com/guides/adventure/cycling-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/cycling-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/cycling-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/cycling-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/cycling-5-1280.webp']),
  ('jozani-forest', 'Jozani forest and the mangrove boardwalk', 'Jozani', 'Jozani (Centre-south)', 'Red colobus monkeys, mahogany and a six-hour hike into Zanzibar''s only national park.

Jozani–Chwaka Bay National Park is Zanzibar''s only national park and home to the endemic Zanzibar red colobus, which you''ll meet up close. The usual visit is an hour''s gentle walk, but the park also runs a two- to three-hour middle tour, an early-morning bird walk and a six- to seven-hour long hike deep into the forest, with Sykes''s monkeys, chameleons, bushbabies and elephant shrews.

A short drive south, the Pete mangrove boardwalk crosses the swamp, with mudskippers and crabs at the right tide.

How to book: Go with an official park guide from the gate, or book the long, middle or bird tours ahead through jozaniforest.com. It''s about 40 minutes from Stone Town and 20–25 minutes from Paje by taxi; the dala-dala to Makunduchi or Paje stops at the gate.', 'https://jozaniforest.com/', -6.2416, 39.414, array['https://www.mzunguzanzibar.com/guides/adventure/jozani-forest-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/jozani-forest-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/jozani-forest-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/jozani-forest-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/jozani-forest-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/jozani-forest-6-1280.webp']),
  ('kuza-cave', 'Swimming in Kuza Cave', 'Jambiani', 'Jambiani (South-east coast)', 'A cool, clear pool in a limestone cave, down a jungle path.

Down a five-minute jungle path and a flight of steep steps, Kuza Cave opens into a limestone sinkhole of stalactites over a pool of clear, cool water up to about three metres deep. You swim or snorkel among the submerged formations.

It''s run as a community culture centre, with a Swahili house, an African history map and, if you stay longer, cooking, drumming and craft lessons.

How to book: No booking needed for the cave (30–60 minutes). Turn inland at the Kuza Cave sign in Jambiani — 5–10 minutes by tuk-tuk from Jambiani or Paje.', 'https://www.kuzacave.com/', -6.3034, 39.534, array['https://www.mzunguzanzibar.com/guides/adventure/kuza-cave-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/kuza-cave-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/kuza-cave-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/kuza-cave-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/kuza-cave-5-1280.webp']),
  ('mangapwani-caves', 'Mangapwani coral cavern and slave chamber', 'Mangapwani', 'Mangapwani (North-west coast)', 'A scramble into a dark coral cavern — and a sobering memorial to the slave trade.

North of Stone Town, stone steps lead down into Mangapwani''s coral cavern, a big dark chamber lit by shafts of daylight. Local guides lead you along slippery, scrambling routes with a few squeezes to a freshwater pool at the bottom.

A few kilometres up the coast, the slave chamber is a cell cut into the coral rock, reportedly built around 1880 to hide enslaved people after the trade was banned. It''s a short visit, beside a modern memorial.

How to book: Take a taxi from Stone Town (30–40 minutes) or join a north-west day tour; local guides wait at the cavern. Expect a small cash entry and a tip for the guide.', null, -6.0018, 39.1912, array['https://www.mzunguzanzibar.com/guides/adventure/mangapwani-caves-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/mangapwani-caves-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/mangapwani-caves-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/mangapwani-caves-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/adventure/mangapwani-caves-6-1280.webp']),
  ('masingini-zipline', 'Zipline over Masingini forest', 'Masingini', 'Masingini (Inland, near Stone Town)', 'About a kilometre on a wire over the treetops, twenty minutes from Stone Town.

In the hills east of Stone Town, the Masingini forest reserve has what operators sell as Zanzibar''s longest zipline — a single line of about a kilometre over the canopy. You walk back up through the forest with a guide, sometimes past red colobus monkeys.

It''s sold by tour companies rather than direct, often with transfers and other stops; we couldn''t confirm who owns and runs the line itself.

How to book: Book through a tour company (several sell it on GetYourGuide, Viator and Expedia), usually with hotel transfer; the meeting point is the Masingini forest office. Some listings charge the zipline fee separately on site.', null, -6.13, 39.26, array[]::text[])
    ) as src (slug, name, village, address, description, website, lat, lng, images)
  loop
    if exists (
      select 1 from public.businesses b
      where b.space_id = v_space and (b.slug = r.slug or lower(b.name) = lower(r.name))
    ) then
      continue;
    end if;

    insert into public.places (community_id, name, description, address, location_label, website, lat, lng, cover_url, created_by)
    values (v_community, r.name, r.description, r.address, r.village, r.website, r.lat, r.lng, r.images[1], v_author)
    returning id into v_place;

    insert into public.businesses (
      space_id, community_id, created_by, place_id, slug, name, category, description,
      website, address, location_label, lat, lng, image_url
    )
    values (
      v_space, v_community, v_author, v_place, r.slug, r.name, 'activity', r.description,
      r.website, r.address, r.village, r.lat, r.lng, r.images[1]
    )
    returning id into v_business;

    for i in 1 .. coalesce(array_length(r.images, 1), 0) loop
      insert into public.business_images (business_id, url, sort_order, created_by)
      values (v_business, r.images[i], i - 1, v_author);
    end loop;
  end loop;
end
$seed$;
