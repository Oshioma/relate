-- =============================================================================
-- Relate — the guides' places to eat, listed in the business directory
--
-- Every restaurant, beach bar and café picked in Mzungu Zanzibar's guides
-- (Zanzibar's Best Restaurants, the beach bars guide and the two-per-
-- destination picks in Where to Stay) becomes a listing in the community's
-- business directory, category "restaurant". The text is the guide's own
-- (tagline and description, or the Where to Stay "why"), the photos are the
-- guide's securely identified ones (the directory shows no caption, so
-- UNVERIFIED photos stay in the guides), and each listing gets its own place
-- the way a listing added in the app does. The two that already have a stay
-- listing (Mr. Kahawa, Zanzibar Sunrise at Bandas) share that stay's place.
--
-- Places already in the directory are skipped: the guides already link to
-- them (6 Degrees South, Cape Town Fish Market, The 5th, Fisherman's Seafood
-- & Grill, Kajibange, Makofi, Hanoi House, Passion & Thyme, Organzibar,
-- Fahari Off The Grid, and Kendwa Rocks, listed under Activities), and any
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
  ('the-tea-house-at-emerson-spice', 'The Tea House at Emerson Spice', 'Stone Town', null, 'An eight-course seafood tasting menu on a rooftop above the old town.

The rooftop pavilion of Emerson Spice hotel, framed in carved wooden fretwork, looks out over Stone Town''s tin roofs and minarets to the sea. By day it serves an à la carte lunch; in the evening, sundowners and then a set eight-course seafood tasting menu with Swahili-coast flavours, at one seating.

Hearing the call to prayer rise from the mosques below as the light goes is part of the experience.

Cuisine: Swahili-coast seafood tasting menu.', 'https://emersonspice.com/dining/', null, null, array['https://www.mzunguzanzibar.com/guides/restaurants/emerson-spice-tea-house-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/emerson-spice-tea-house-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/emerson-spice-tea-house-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/emerson-spice-tea-house-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/emerson-spice-tea-house-5-1280.webp']),
  ('lukmaan', 'Lukmaan', 'Stone Town', 'Stone Town (Mkunazini)', 'Stone Town''s favourite local canteen: biryani, curries and fresh juices.

A busy, simple canteen by the big baobab on New Mkunazini Road, near the old slave market and the Anglican cathedral. You choose at the counter from trays of curries, stews, rice and grilled fish and meat, and usually pay up front.

It has won awards for the best local dining experience, and it''s where many visitors first try real Zanzibari home-style food.

Cuisine: Swahili and Zanzibari.', null, null, null, array['https://www.mzunguzanzibar.com/guides/restaurants/lukmaan-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/lukmaan-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/lukmaan-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/lukmaan-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/lukmaan-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/lukmaan-6-1280.webp']),
  ('abyssinian-maritim', 'Abyssinian Maritim', 'Stone Town', 'Stone Town (Vuga)', 'Ethiopian injera platters and a coffee ceremony in a courtyard.

A long-standing Ethiopian restaurant in a courtyard near the Vuga roundabout, where you eat with your hands from shared platters of injera topped with stews and stir-fries. It offers a traditional coffee ceremony, with roasting, incense and popcorn.

Cuisine: Ethiopian.', 'https://abyssinianmaritim1.wixsite.com/amer', null, null, array['https://www.mzunguzanzibar.com/guides/restaurants/abyssinian-maritim-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/abyssinian-maritim-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/abyssinian-maritim-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/abyssinian-maritim-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/abyssinian-maritim-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/abyssinian-maritim-6-1280.webp']),
  ('forodhani-night-market', 'Forodhani Night Market', 'Stone Town', 'Stone Town (Forodhani Gardens)', 'Zanzibar pizza, seafood skewers and sugar-cane juice under the lamps by the sea.

Every evening, stalls set up in Forodhani Gardens on the seafront in front of the Old Fort, and by dark the whole waterfront is lit with lamps and grills. It''s Stone Town''s great open-air food hall.

Try a Zanzibar ''pizza'' — a stuffed, folded pancake fried on a griddle, savoury or sweet — grilled seafood and meat skewers, urojo soup and freshly pressed sugar-cane juice with ginger and lime.', null, null, null, array['https://www.mzunguzanzibar.com/guides/restaurants/forodhani-night-market-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/forodhani-night-market-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/forodhani-night-market-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/forodhani-night-market-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/forodhani-night-market-5-1280.webp']),
  ('mercurys', 'Mercury''s', 'Stone Town', null, 'Stone Town''s classic sundowner, named after its most famous son.

A waterfront bar-restaurant on Mizingani Road named after Freddie Mercury, who was born in Stone Town. Its terrace looks straight out over the harbour beach, with dhows and ferries passing in front as the sun goes down.

Guides have long called it the best sundowner view in town. Expect Queen on the playlist, football on the TV and, most Saturdays, live music — often classic rock or reggae.', 'https://www.tripadvisor.com/Restaurant_Review-g488129-d1218647', null, null, array['https://www.mzunguzanzibar.com/guides/beach-bars/mercurys-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mercurys-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mercurys-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mercurys-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mercurys-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mercurys-6-1280.webp']),
  ('livingstones', 'Livingstone''s', 'Stone Town', 'Stone Town (Shangani beach)', 'Candlelit tables on the sand, and salsa on Thursdays.

In the old British consulate building on Shangani beach, Livingstone''s puts its tables directly on the sand under the trees, looking west over the water — the closest Stone Town comes to a proper beach bar. It''s been relaunched by new Italian owners as Livingstone''s – Style Italiano.

There''s a daily happy hour before sunset, salsa night every Thursday, and live music on some evenings; after dark the tables are lit by candles.', 'https://www.livingstoneszanzibar.com/', null, null, array['https://www.mzunguzanzibar.com/guides/beach-bars/livingstones-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/livingstones-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/livingstones-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/livingstones-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/livingstones-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/livingstones-6-1280.webp']),
  ('tatu', 'Tatu', 'Stone Town', 'Stone Town (Shangani)', 'Three floors, a rooftop over the sea, and a club after dark.

Tatu means three in Swahili, after its three floors: a bar with a pool table on the ground floor, a pub-style restaurant above, and a rooftop cocktail lounge looking out over the sea.

It''s a few steps from the Shangani seafront rather than on the sand, but the rooftop catches the sunset — and late at night, especially at weekends, it turns into a club with a DJ and a mixed crowd of young Zanzibaris and travellers.', 'https://www.tripadvisor.com/Restaurant_Review-g488129-d1937616', null, null, array['https://www.mzunguzanzibar.com/guides/beach-bars/tatu-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/tatu-2-1280.webp']),
  ('sexy-fish', 'Sexy Fish at The Z Hotel', 'Nungwi', null, 'Seafood on a deck over the sand, facing the sunset.

The Z Hotel''s signature restaurant is an open-sided wooden deck built over Nungwi beach, facing west into the sunset. The cooking is contemporary seafood with Zanzibari ingredients and spices, served on white tablecloths with an international wine list.

Starters and small plates get the most praise — you can order a few in place of a main — and the setting makes it Nungwi''s go-to for a special evening.

Cuisine: Contemporary seafood.', 'https://www.thezhotel.com/facilities/restaurants', 'Lunch 12:00–15:00 · dinner 18:30–22:30', null, array['https://www.mzunguzanzibar.com/guides/restaurants/sexy-fish-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/sexy-fish-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/sexy-fish-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/sexy-fish-4-1280.webp']),
  ('fish-market-local-restaurant', 'Fish Market Local Restaurant', 'Nungwi', null, 'Pick your fish from the display and eat it with your feet in the sand.

A simple, locally run seafood grill on Nungwi beach, right beside the village fish market where the dhows land their catch each morning. You choose from the display and it comes grilled or fried, with rice, chips, vegetables or salad.

Tables sit on the sand under a thatched roof, looking out at the fishing boats — about as close to the source as seafood gets.

Cuisine: Local seafood grill.', 'https://www.facebook.com/p/Fish-Market-Local-Restaurant-100091960764143/', null, null, array['https://www.mzunguzanzibar.com/guides/restaurants/fish-market-nungwi-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/fish-market-nungwi-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/fish-market-nungwi-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/fish-market-nungwi-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/fish-market-nungwi-5-1280.webp']),
  ('kibanda-beach-club', 'Kibanda Beach Club', 'Nungwi', null, 'Sunbeds by day, Ibiza-style sunset sets, and Nungwi''s Sunday party.

At the quieter northern end of Nungwi beach, Kibanda is a beach lounge of sunbeds and cocktails by day that turns up the music at sunset, with DJs playing as the sun drops into the sea.

Sunday is its big day: a live DJ from the afternoon into the night — a party, as one Nungwi guide puts it, that avoids the big crowds.', null, null, null, array['https://www.mzunguzanzibar.com/guides/beach-bars/kibanda-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/kibanda-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/kibanda-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/kibanda-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/kibanda-5-1280.webp']),
  ('mama-mia', 'Mama Mia', 'Nungwi', null, 'Nungwi''s most popular sunset spot: cocktails, a daily DJ and gelato.

Right on the main west-facing strip of Nungwi beach, Mama Mia is a pizzeria, cocktail bar and gelateria in one — running since 2016, freshly refurbished, and one of the busiest places on the beach at sunset.

A DJ plays every afternoon into the evening while the sun goes down, and there''s gelato from its own gelateria to take away.', 'https://www.mamamiarestaurantzanzibar.com/', null, null, array['https://www.mzunguzanzibar.com/guides/beach-bars/mama-mia-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mama-mia-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mama-mia-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mama-mia-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mama-mia-5-1280.webp']),
  ('bobo-beach', 'Bobo Beach', 'Nungwi', null, 'A chic, hassle-free beach club with a sunset DJ.

A newer beach club on Nungwi''s west-facing strip, with sunbeds and umbrellas on the sand and staff who move your shade and keep an eye on your bag while you swim.

Around sunset the music goes up and a DJ plays Afro, amapiano and house; by eight it quietens down and the tables are laid for dinner.', 'https://www.instagram.com/bobo.beachclub/', null, null, array['https://www.mzunguzanzibar.com/guides/beach-bars/bobo-beach-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/bobo-beach-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/bobo-beach-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/bobo-beach-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/bobo-beach-5-1280.webp']),
  ('rooftops-at-the-z-hotel', 'Rooftops at The Z Hotel', 'Nungwi', null, 'Sofas on a rooftop, dhows on the water and one of the island''s best sunsets.

The top-floor bar of The Z Hotel, on Nungwi''s west-facing beach, is one of the island''s favourite places to watch the sun go down: comfortable sofas, a view of dhows sailing past, and the hotel''s signature passion dawa.

On Wednesdays and Saturdays a DJ plays chilled sunset beats, and you can order sharing plates and sushi from the hotel''s Cinnamon menu at the bar.', 'https://www.thezhotel.com/facilities/restaurants#Rooftops', null, null, array['https://www.mzunguzanzibar.com/guides/beach-bars/z-rooftops-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/z-rooftops-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/z-rooftops-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/z-rooftops-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/z-rooftops-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/z-rooftops-6-1280.webp']),
  ('fisherman-local-restaurant', 'Fisherman Local Restaurant', 'Kendwa', 'Kendwa back street, inland from the beach', 'A plain back-street restaurant that reviewers repeatedly say beats the beach restaurants on food and value. Recent diners praise fresh seafood curry, grilled octopus and prawn masala at very fair prices. Expect a simple setting and some waiting.

Cuisine: Local Zanzibari and seafood.', null, null, null, array[]::text[]),
  ('marafiki-beach-bar', 'Marafiki Beach Bar', 'Matemwe', null, 'A thatched deck bar on Matemwe beach, with kitesurfers on the lagoon.

The beach bar of Marafiki Beach Hotel sits on a wooden deck under thatch, right on Matemwe''s long white beach. Guests describe a laid-back crowd of hotel guests, kiters and people from neighbouring lodges, with chilled beers and cocktails as the afternoon fades.

On some evenings there''s live music — a band or a Swahili drumming group — and occasionally a DJ.', null, null, null, array['https://www.mzunguzanzibar.com/guides/beach-bars/marafiki-beach-bar-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/marafiki-beach-bar-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/marafiki-beach-bar-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/marafiki-beach-bar-4-1280.webp']),
  ('marlin-restaurant', 'Marlin Restaurant', 'Matemwe', 'Matemwe village', 'A small local restaurant with a Swahili menu that reviewers often call a hidden gem. They consistently praise the fresh seafood — the octopus in particular — friendly service and very good value. Vegetarian and vegan options are available.

Cuisine: Swahili and local seafood.', null, null, null, array[]::text[]),
  ('zanzibar-sunrise-at-bandas-restaurant', 'Zanzibar Sunrise at Bandas Restaurant', 'Matemwe', 'Matemwe beachfront', 'A beachside lodge restaurant with live music on set nights. Recent reviewers praise the seafood, the breakfasts, the friendly staff and the relaxed setting.

Cuisine: Seafood and international.', 'https://zanzibarsunrise.com/', null, 'zanzibar-sunrise-at-bandas', array[]::text[]),
  ('the-beach-lounge', 'The Beach Lounge', 'Kiwengwa', null, 'Cushions under a palm-thatch roof, watching kiters cross the lagoon.

The public lounge of the DPC kite centre at Mvuvi Boutique Resort is a long makuti-roofed space of cushions, wooden cabanas and sunbeds on Kiwengwa beach, open to anyone from breakfast until late.

Cocktails come with charcoal-grilled seafood, meat and vegetables, homemade pizza and ice cream, and the kitchen leans local and organic. Evenings are quiet; reviewers recommend staying for the stars.', 'https://www.dpc-zanzibar.com/beach-lounge', 'Daily 08:00–22:00', null, array['https://www.mzunguzanzibar.com/guides/beach-bars/the-beach-lounge-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/the-beach-lounge-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/the-beach-lounge-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/the-beach-lounge-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/the-beach-lounge-5-1280.webp']),
  ('il-pontile', 'Il Pontile', 'Kiwengwa', null, 'A thatched bar at the end of a long pier over the lagoon.

A wooden pier runs out from Kiwengwa beach to a thatched bar and dining deck standing over the lagoon, with the sea on every side at high tide.

It''s a cocktail bar and seafood restaurant — fresh juices, seafood platters, octopus and grilled lobster — but the walk out and the view are the reason to come.', 'https://www.instagram.com/ilpontile_restaurant_kiwengwa/', null, null, array['https://www.mzunguzanzibar.com/guides/beach-bars/il-pontile-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/il-pontile-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/il-pontile-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/il-pontile-4-1280.webp']),
  ('la-capannina-zanzibar', 'La Capannina Zanzibar', 'Kiwengwa', 'Kiwengwa (easy to miss from the road)', 'A small Italian restaurant whose owners and Italian chef reviewers describe as warm and attentive. Diners consistently praise the fresh homemade pasta, pizza and desserts, at prices seen as reasonable for the quality. It fills up, so book ahead for dinner.

Cuisine: Italian: homemade pasta, pizza and seafood.', null, null, null, array[]::text[]),
  ('la-base-junglekite', 'La Base JungleKite', 'Kiwengwa', 'Kiwengwa beachfront', 'A beachfront terrace restaurant at the JungleKite kitesurfing school that welcomes non-kiters too. Recent reviewers praise the Italian dishes, the seafood and the owners'' hospitality. It is a relaxed lunch spot with a view of the kites.

Cuisine: Italian and seafood.', null, null, null, array[]::text[]),
  ('kae-funk-sunset-beach-bar', 'Kae Funk Sunset Beach Bar', 'Michamvi', 'Michamvi Kae', 'The east coast''s sunset party, reached along a boardwalk through the mangroves.

On the bay side of the Michamvi peninsula, a raised boardwalk through the mangroves leads to a sandy beach of swing beds, hammocks and painted driftwood sculptures, facing west across Chwaka Bay.

As the sun goes down over the bay and the dhows sail past, the DJs start and, on some evenings, acrobats and fire dancers perform. The food — grilled seafood and snacks — is secondary to the setting.', null, null, null, array['https://www.mzunguzanzibar.com/guides/restaurants/kae-funk-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/kae-funk-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/kae-funk-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/kae-funk-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/kae-funk-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/kae-funk-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/kae-funk-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/kae-funk-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/kae-funk-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/kae-funk-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/kae-funk-6-1280.webp']),
  ('boho-social-at-upendo-beach', 'Boho Social at Upendo Beach', 'Michamvi', 'Michamvi Pingwe', 'A chic beach deck with a direct view of The Rock.

The beachfront restaurant of Upendo Beach hotel sits on Pingwe beach with daybeds, thatched parasols and a wooden deck looking straight out at The Rock across the lagoon.

The cooking is fusion — local seafood with Swahili, Indian, Thai and Japanese influences, sushi included — and Sunday brunch comes with a DJ.

Cuisine: Fusion, seafood, sushi.', 'https://upendozanzibar.com/bohosocial/', 'Daily 08:00–22:00', null, array['https://www.mzunguzanzibar.com/guides/restaurants/boho-social-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/boho-social-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/boho-social-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/boho-social-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/boho-social-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/boho-social-6-1280.webp']),
  ('boho-lounge-at-upendo-beach', 'Boho Lounge at Upendo Beach', 'Michamvi', 'Michamvi Pingwe', 'Daybeds, beanbags and an infinity pool facing The Rock.

Upendo Beach hotel''s beach club is the most styled spot on the peninsula: daybeds, yellow beanbags, thatched tipi parasols and an infinity pool, with curated music and a direct view of The Rock restaurant out on the lagoon.

Boho Lounge is the day-pass pool and beach lounge; next door, Boho Social serves signature cocktails and fusion seafood on the sand into the evening.', 'https://upendozanzibar.com/boho-lounge/', 'Lounge daily 09:00–18:00', null, array['https://www.mzunguzanzibar.com/guides/beach-bars/boho-lounge-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/boho-lounge-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/boho-lounge-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/boho-lounge-4-1280.webp']),
  ('the-rock', 'The Rock', 'Michamvi', 'Michamvi Pingwe', 'Zanzibar''s most famous restaurant: a thatched dining room on a coral rock in the sea.

A one-room restaurant on a coral outcrop just off Pingwe beach, with windows on every side and the lagoon all around. Founded in 2011, it cooks seafood with Zanzibari ingredients and Italian technique.

You walk out across the sand at low tide and take the restaurant''s boat at high tide — the arrival is half the experience.

Cuisine: Seafood, Zanzibari-Italian.', 'https://www.therockrestaurantzanzibar.com/', null, null, array['https://www.mzunguzanzibar.com/guides/restaurants/the-rock-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/the-rock-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/the-rock-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/the-rock-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/the-rock-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/the-rock-6-1280.webp']),
  ('sunset-bar-at-michamvi-sunset-bay', 'Sunset Bar at Michamvi Sunset Bay', 'Michamvi', 'Michamvi Kae', 'A calmer sundowner on the same sunset bay as Kae Funk.

A few hundred metres up the beach from Kae Funk, Michamvi Sunset Bay resort''s beach bar looks west across Chwaka Bay — built, as the resort says, for a sundowner and the sunset.

It''s a hotel bar, well stocked with cocktails and soft drinks, with a book swap and board games by day and occasional bonfire evenings.', 'https://michamvi.com/food-drink/', null, null, array['https://www.mzunguzanzibar.com/guides/beach-bars/michamvi-sunset-bay-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/michamvi-sunset-bay-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/michamvi-sunset-bay-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/michamvi-sunset-bay-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/michamvi-sunset-bay-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/michamvi-sunset-bay-6-1280.webp']),
  ('baladin-zanzibar-beach-hotel-restaurant', 'Baladin Zanzibar Beach Hotel & Restaurant', 'Michamvi', 'Michamvi Pingwe beach (east side)', 'A beachfront hotel restaurant from the Italian Baladin brewery, serving its craft beer on draught alongside house-made pizza, pasta and seafood. Recent reviewers praise the varied menu and quality ingredients and describe it as a romantic dinner spot. It is a few steps from The Rock.

Cuisine: Italian (house-made pizza and pasta), seafood and Baladin craft beer.', null, null, null, array[]::text[]),
  ('mr-kahawa', 'Mr. Kahawa', 'Paje', null, 'Tanzanian coffee, brunch and fish curry under an almond tree on Paje beach.

An open-sided, thatched beach café on Paje beach, open since 2014, serving single-origin Tanzanian Arabica, brunch and, in the evenings, Swahili-spiced curries and fresh fish.

It''s the hub of Paje''s kitesurfing crowd, with vegetarian and vegan options at every meal and live music on Thursday nights.

Cuisine: Café, brunch, Swahili curries.', 'https://mrkahawa.com/cafe-restaurant', 'Daily 08:00–21:30', 'mr-kahawa-boutique-hotel-caf-restaurant', array['https://www.mzunguzanzibar.com/guides/restaurants/mr-kahawa-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/mr-kahawa-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/mr-kahawa-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/mr-kahawa-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/restaurants/mr-kahawa-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mr-kahawa-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mr-kahawa-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mr-kahawa-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mr-kahawa-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mr-kahawa-5-1280.webp']),
  ('mahali-beachbar', 'Mahali Beachbar', 'Paje', null, 'A cosy lounge on the sand with some of Paje''s best cocktails.

The beach bar of Mahali Zanzibar, a small resort in the middle of Paje, is a relaxed lounge on the sand serving lunch, dinner and cocktails to anyone who walks in off the beach.

Reviewers rate its cocktails among the best in Paje — the Negroni especially — and there''s live music on some Saturdays.', 'https://www.mahalizanzibar.com/', 'Daily 11:00–23:00', null, array['https://www.mzunguzanzibar.com/guides/beach-bars/mahali-beachbar-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mahali-beachbar-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mahali-beachbar-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/mahali-beachbar-4-1280.webp']),
  ('b4-beach-club', 'B4 Beach Club', 'Paje', null, 'Paje''s electronic beach club: after-kite sessions and DJs on the sand.

Paje''s electro beach club since 2017 has a dance floor on the sand, a small pool and a kite school, and a line-up of Afro house, deep electro and funk — from resident DJ Zainooba, billed as Zanzibar''s first female DJ, to international guests.

After-kite sessions pull in the kitesurfers in the late afternoon, and Sundays start at midday with Balearic sounds; the big parties are usually at the weekend.', 'https://www.instagram.com/b4beachclub/', null, null, array['https://www.mzunguzanzibar.com/guides/beach-bars/b4-beach-club-3-1280.webp']),
  ('paje-by-night', 'Paje by Night', 'Paje', null, 'A long-running Paje favourite for pizza, pool and Swahili nights.

The name says it all: Paje by Night has been one of the village''s social hubs for years, a garden bar and restaurant with a pool and jacuzzi, popular with the kite crowd and now a yoga and kitesurf hotel too.

It sits about seventy metres back from the beach rather than on the sand. Event nights centre on the pool, and in high season Mondays bring a Swahili buffet with live music.', 'https://www.pajebynight.net/', null, null, array['https://www.mzunguzanzibar.com/guides/beach-bars/paje-by-night-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/paje-by-night-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/paje-by-night-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/paje-by-night-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/paje-by-night-6-1280.webp']),
  ('mapacha-food-court', 'Mapacha Food Court', 'Paje', 'Paje main roundabout, on the main road', 'A casual food court on Paje''s main roundabout where several stalls cook different cuisines to order. Recent reviewers praise friendly staff, fair prices and generous portions. It is a good choice for groups with mixed tastes, and for vegetarian, vegan or gluten-free diners.

Cuisine: Street-food court: seafood, pizza, sushi, falafel, salads and bakery.', null, null, null, array[]::text[]),
  ('zanzibarista', 'ZanziBarista', 'Paje', 'Paje beachfront', 'A coffee shop, restaurant and beach bar right on Paje beach, from breakfast through to evening drinks. Reviewers consistently praise the sea view, warm and efficient staff and the seafood, and many come back daily for coffee. It costs a little more than places nearby.

Cuisine: Speciality coffee, brunch, seafood and cocktails.', null, null, null, array[]::text[]),
  ('chez-hassan', 'Chez Hassan', 'Jambiani', null, 'A small family kitchen cooking honest Swahili food in a Jambiani lane.

A modest, family-run thatched dining room on a sandy lane a little back from Jambiani beach. Much of the cooking is done by Hassan''s wife: fish in coconut sauce, octopus and calamari, Swahili curries with coconut rice, roti and samosas.

Reviewers call it an expat favourite for simple local food done well at fair prices.

Cuisine: Swahili home cooking.', null, null, null, array['https://www.mzunguzanzibar.com/guides/restaurants/chez-hassan-1-1280.webp']),
  ('lost-soles', 'Lost Soles', 'Jambiani', null, 'Barefoot cocktails, a fire pit and stories under the fig trees.

The "more social" half of a pair of Jambiani lodges, Lost Soles is a barefoot bar with tables under fig trees on the beach, a pool deck at the water''s edge and a sunken restaurant.

Cocktails at dusk lead to the fire being lit and the stories starting; reviewers love the signature cocktails, the funny quotes around the bar and the drinking games the staff get going.', 'https://lostsoleslodge.com/', 'Daily, about 07:00–22:30', null, array['https://www.mzunguzanzibar.com/guides/beach-bars/lost-soles-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/lost-soles-3-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/lost-soles-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/lost-soles-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/lost-soles-6-1280.webp']),
  ('new-teddys-on-the-beach', 'New Teddy''s on the Beach', 'Jambiani', null, 'Hammocks, swings and daybeds, a daily happy hour and a monthly Swahili feast.

A backpacker-friendly lodge on Jambiani beach with a beach bar, a pool and plenty of places to lie about: hammocks, swings and daybeds on the sand.

There''s a happy hour every evening, a garden barbecue with live music on Wednesdays, and on the last Friday of the month a Busati Night — a Swahili feast eaten sitting on the floor, with no tables or cutlery.', 'https://newteddysonthebeach.com/', null, null, array['https://www.mzunguzanzibar.com/guides/beach-bars/new-teddys-1-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/new-teddys-2-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/new-teddys-4-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/new-teddys-5-1280.webp', 'https://www.mzunguzanzibar.com/guides/beach-bars/new-teddys-6-1280.webp']),
  ('fadhil-restaurant', 'Fadhil Restaurant', 'Jambiani', 'Jambiani village, a short walk from the beach', 'A small family-run restaurant in a village alley, with a handwritten daily menu and a few tables on a sand floor. Reviewers praise the seafood, large portions and fair prices. Service is slow, so locals advise ordering a few hours ahead; no alcohol is served.

Cuisine: Local Zanzibari and seafood.', null, null, null, array[]::text[]),
  ('ocean-boho-house-restaurant', 'Ocean Boho House Restaurant', 'Jambiani', 'Jambiani', 'A guesthouse restaurant with bohemian décor, a lush garden and live music. Reviewers praise fresh ingredients that work for vegetarians and meat-eaters alike, and good value. Service is usually warm and attentive.

Cuisine: International with fresh seafood and good vegetarian options.', null, null, null, array[]::text[]),
  ('leo-beach-bar-restaurant', 'Leo Beach Bar & Restaurant', 'Bwejuu', 'Bwejuu beachfront, by The African Paradise Beach Hotel', 'A casual beachfront spot whose reviewers single out the grilled fish, octopus and lobster, along with good cocktails and fresh juices. The welcome is warm and prices reasonable. It has fewer reviews than longer-established places, so treat it as a promising casual choice.

Cuisine: Seafood, grills and local Zanzibari dishes.', null, null, null, array[]::text[]),
  ('sahari-zanzibar', 'Sahari Zanzibar', 'Bwejuu', 'Bwejuu beachfront', 'A boutique-hotel restaurant with dinner tables set around the pool and on the beach. Reviewers praise the friendly staff, the seafood platter and the pizza, and say dietary requests are handled well. It is pricier than the local places in Bwejuu or Paje.

Cuisine: European, Asian and Zanzibari.', null, null, null, array[]::text[]),
  ('the-island-pongwe-restaurant', 'The Island – Pongwe Restaurant', 'Pongwe', 'Just off Pongwe beach', 'A restaurant on a small coral-rock islet just off Pongwe beach, open to non-residents for lunch and dinner. Reviewers consistently describe the setting as spectacular and praise the fresh, well-presented seafood. Be ready to get your feet wet or take a boat at high tide.

Cuisine: Seafood-led international.', null, null, null, array[]::text[]),
  ('pongwe-beach-hotel-restaurant', 'Pongwe Beach Hotel Restaurant', 'Pongwe', 'Pongwe beachfront', 'The hotel''s oceanfront kitchen builds its menu around the morning catch and local produce. Its Swahili buffet and beach barbecue nights are open to non-residents who book ahead. Reviewers describe a quiet setting and helpful service.

Cuisine: Daily-changing seafood and Swahili cooking.', 'https://pongwe.com/dining/', null, null, array[]::text[]),
  ('blue-moon-villa-restaurant', 'Blue Moon Villa Restaurant', 'Pwani Mchangani', 'Pwani Mchangani, a few minutes'' walk from the beach', 'A guesthouse restaurant a short walk from the sea. Reviewers consistently praise the lobster, octopus, prawns and mixed fish grill, and say the quiet setting suits families. Service and value both get strong marks.

Cuisine: Italian and African, with a focus on seafood.', null, null, null, array[]::text[]),
  ('the-breeze-tui-blue-bahari', 'The Breeze (TUI BLUE Bahari Zanzibar)', 'Pwani Mchangani', 'Pwani Mchangani beachfront, at TUI BLUE Bahari', 'The resort''s speciality restaurant for candlelit dinners. Reviewers praise the seafood platter, fish of the day and attentive staff. It opens for dinner on set nights and needs a reservation.

Cuisine: Seafood-focused à la carte.', null, null, null, array[]::text[]),
  ('blue-pontile-dongwe', 'Blue Pontile Dongwe', 'Dongwe', 'Dongwe, at the end of Dongwe Club''s jetty', 'A restaurant at the end of Dongwe Club''s long jetty over the lagoon. Reviewers consistently praise the setting, the shellfish pasta and the lobster, and describe it as romantic. Staff are often called attentive and welcoming.

Cuisine: Italian-Mediterranean seafood.', null, null, null, array[]::text[]),
  ('fishers-restaurant', 'Fishers Restaurant', 'Dongwe', 'Dongwe beach', 'A small, family-run beach spot serving fish straight from the boats at around half resort prices. The setting is simple but atmospheric. Reviews are mixed on service and food can take a long time.

Cuisine: Fresh local seafood.', null, null, null, array[]::text[]),
  ('kameleon-blue-bar-restaurant', 'Kameleon Blue Bar & Restaurant', 'Kizimkazi', 'Kizimkazi, about 13 minutes'' walk from the beach', 'A garden bar and restaurant with a pool at a small, independent arts lodge. Reviewers praise the seafood platter and the Zanzibari calamari curry, and several recommend the Swahili dishes. It hosts live-music evenings.

Cuisine: Italian and Mediterranean, plus Swahili dishes.', null, null, null, array[]::text[]),
  ('kambakocho-bar-beach-restaurant', 'Kambakocho Bar & Beach Restaurant', 'Uroa', 'Uroa beachfront', 'A beachfront restaurant with ocean views. Reviewers praise the grilled lobster, octopus carpaccio and cocktails, and the multilingual staff. Recurring complaints are slow service and billing, so check your bill before paying.

Cuisine: Seafood, pizza, pasta and cocktails.', null, null, null, array[]::text[]),
  ('zan-taste-restaurant', 'Zan Taste Restaurant', 'Uroa', 'Uroa village', 'A small, locally run spot praised for octopus, fresh fish, juices and smoothies at low prices for the area. Staff are consistently described as friendly.

Cuisine: Local Zanzibari, seafood, juices and smoothies.', null, null, null, array[]::text[])
    ) as src (slug, name, village, address, description, website, hours, stay_slug, images)
  loop
    if exists (
      select 1 from public.businesses b
      where b.space_id = v_space and (b.slug = r.slug or lower(b.name) = lower(r.name))
    ) then
      continue;
    end if;

    v_place := null;
    if r.stay_slug is not null then
      select a.place_id into v_place
      from public.accommodation_listings a
      where a.community_id = v_community and a.slug = r.stay_slug;
    end if;
    if v_place is null then
      insert into public.places (community_id, name, description, address, location_label, website, lat, lng, cover_url, created_by)
      values (v_community, r.name, r.description, r.address, r.village, r.website, null, null, r.images[1], v_author)
      returning id into v_place;
    end if;

    insert into public.businesses (
      space_id, community_id, created_by, place_id, slug, name, category, description,
      website, address, location_label, opening_hours, image_url
    )
    values (
      v_space, v_community, v_author, v_place, r.slug, r.name, 'restaurant', r.description,
      r.website, r.address, r.village, r.hours, r.images[1]
    )
    returning id into v_business;

    for i in 1 .. coalesce(array_length(r.images, 1), 0) loop
      insert into public.business_images (business_id, url, sort_order, created_by)
      values (v_business, r.images[i], i - 1, v_author);
    end loop;
  end loop;
end
$seed$;
