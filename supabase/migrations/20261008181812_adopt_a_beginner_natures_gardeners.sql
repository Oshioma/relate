-- =============================================================================
-- Relate — "Adopt a Beginner" for Nature's Gardeners
--
-- The first guided-journey space. Everything that makes it about gardening
-- comes from the 'gardening' preset (src/lib/guided-journey/presets.ts) plus
-- the journey templates below — no gardening logic lives in code paths, so a
-- sailing or cooking community gets the same feature from a different preset.
--
-- Only touches the community whose slug is 'naturesgardeners', and only when
-- it has no 'adopt-a-beginner' space yet, so this is a no-op everywhere else
-- and on re-run. The space is public so the landing page and the community
-- gallery can be read by visitors; onboarding, mentor profiles, requests and
-- journeys stay members-only through the RLS in
-- 20261008181810_guided_journey_tables.sql.
-- =============================================================================

do $$
declare
  v_community uuid;
  v_space uuid;
  v_sort integer;
begin
  select id into v_community from public.communities where slug = 'naturesgardeners';
  if v_community is null then
    return;
  end if;

  select id into v_space from public.spaces where community_id = v_community and slug = 'adopt-a-beginner';
  if v_space is null then
    select coalesce(max(sort_order), -1) + 1 into v_sort from public.spaces where community_id = v_community;
    insert into public.spaces (community_id, name, slug, description, visibility, space_type, sort_order, show_in_nav)
    values (
      v_community,
      'Adopt a Beginner',
      'adopt-a-beginner',
      'Grow something. Learn together. Share the harvest.',
      'public',
      'guided_journey',
      v_sort,
      true
    )
    returning id into v_space;
  end if;

  insert into public.guided_journey_spaces (space_id, preset_key)
  values (v_space, 'gardening')
  on conflict (space_id) do nothing;

  if not exists (select 1 from public.journey_templates where space_id = v_space) then
    insert into public.journey_templates (space_id, title, subject, summary, cover_image_url, duration_label, expected_weeks, milestones, sort_order)
    values
    (
      v_space, 'My First Tomatoes', 'Tomatoes',
      'From seed or seedling to your first ripe tomato — in pots, on a balcony or in the ground.',
      '/images/adopt-a-beginner/stage-4-progress.webp',
      'About 10–16 weeks — adjust for your climate and variety',
      12,
      '[
        {"title": "Choose your crop", "description": "Pick a tomato variety that suits your space and season. Cherry types are forgiving for a first go."},
        {"title": "Prepare your soil and containers", "description": "Find a sunny spot, get a pot of at least 20 litres or a bed, and a rich, free-draining compost."},
        {"title": "Plant your seeds", "description": "Sow a few seeds indoors or somewhere warm, or plant a healthy seedling."},
        {"title": "First shoots appear", "description": "Share a photo of the first leaves. Keep the soil moist but not soggy."},
        {"title": "Transplant or thin seedlings", "description": "Move the strongest plants into their final pots once they have true leaves and the nights are warm."},
        {"title": "Keep plants healthy", "description": "Water deeply, feed with something natural, stake or support, and watch for pests together."},
        {"title": "Watch flowering and fruit development", "description": "Flowers, then small green fruit. A gentle shake of the plant helps pollination."},
        {"title": "Prepare for harvest", "description": "Fruit colours up. Keep watering steady so the skins don''t split."},
        {"title": "First harvest", "description": "Pick your first ripe tomato — take a photo before you eat it!"},
        {"title": "Share what you learned", "description": "Write down what worked, what didn''t and what you''d do next time."}
      ]'::jsonb,
      0
    ),
    (
      v_space, 'Salad Leaves & Radishes', 'Salad leaves',
      'The quickest first harvest: cut-and-come-again lettuce and crunchy radishes in a trough or bed.',
      '/images/adopt-a-beginner/stage-5-harvest.webp',
      'About 4–8 weeks, depending on the season',
      6,
      '[
        {"title": "Choose your seeds", "description": "A loose-leaf lettuce mix and a quick radish variety."},
        {"title": "Prepare a trough or bed", "description": "Shallow is fine — 15 cm of good compost in partial sun."},
        {"title": "Sow in short rows", "description": "Sow thinly and little and often, so you get a steady supply."},
        {"title": "First shoots appear", "description": "Share a photo when the rows come up."},
        {"title": "Thin and water", "description": "Thin radishes to a finger''s width apart and keep the soil evenly moist."},
        {"title": "First harvest", "description": "Pull radishes and cut leaves from the outside of the plants."},
        {"title": "Share what you learned", "description": "What would you sow again, and when?"}
      ]'::jsonb,
      1
    ),
    (
      v_space, 'Kitchen Herbs in Pots', 'Herbs',
      'Basil, parsley and chives on a windowsill or balcony — small space, big flavour.',
      '/images/adopt-a-beginner/stage-1-profile.webp',
      'About 6–10 weeks to a regular harvest',
      8,
      '[
        {"title": "Choose your herbs", "description": "Pick two or three you actually cook with."},
        {"title": "Pots, compost and a sunny spot", "description": "Pots with drainage holes, a light compost and four or more hours of sun."},
        {"title": "Sow or plant", "description": "Sow seeds or pot up small plants from a nursery."},
        {"title": "First shoots appear", "description": "Share a photo and keep the compost just moist."},
        {"title": "Pinch and shape", "description": "Pinch out tips so plants grow bushy rather than tall."},
        {"title": "First harvest", "description": "Cut little and often — never more than a third at a time."},
        {"title": "Share what you learned", "description": "Which herb thrived, and which struggled?"}
      ]'::jsonb,
      2
    );
  end if;
end;
$$;
