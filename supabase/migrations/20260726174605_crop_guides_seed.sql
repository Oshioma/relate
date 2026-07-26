-- =============================================================================
-- Relate — Crop Guides: starter seed data (Phase 1)
--
-- A handful of published, organic-first crop guides so a fresh Crop Guides space
-- is useful on day one. Idempotent: `on conflict (slug) do nothing` means
-- re-running never duplicates or overwrites (super admins curate from the UI
-- after this). created_by is null — these are canonical platform records, not
-- owned by any member.
--
-- Section jsonb is a flat object of label_key -> value; the crop page humanises
-- the keys. Feeding covers organic amendments only, in keeping with the
-- organic-only policy.
-- =============================================================================

insert into public.crops (
  slug, common_name, scientific_name, family, category,
  difficulty, lifecycle, beginner_friendly, time_to_maturity_days, average_yield,
  preferred_climate, usda_zones, tropical_suitable, pollination_type,
  sun, water_need, drought_tolerant, pollinator_friendly, nitrogen_fixer,
  organic_favourite, edible_part, overview,
  soil, sowing, watering, feeding, harvest, status
) values
(
  'tomato', 'Tomato', 'Solanum lycopersicum', 'Solanaceae', 'vegetables',
  'beginner', 'annual', true, 75, '3–5 kg per plant',
  'Warm temperate to subtropical', '3–11', true, 'Self-fertile',
  'full_sun', 'moderate', false, true, false,
  true, 'Fruit',
  'One of the most rewarding crops for new growers. Tomatoes crop generously in warm weather and a single healthy plant can feed a household through the season. Grow indeterminate types up a support for a long harvest, or bush types for a concentrated flush.',
  '{"texture":"Free-draining loam enriched with compost","ph":"6.0–6.8","drainage":"Good — never waterlogged","organic_matter":"High; dig in plenty of well-rotted compost","raised_beds":"Excellent in raised beds and large containers"}'::jsonb,
  '{"indoor":"Start indoors 6–8 weeks before the last frost","transplant":"Move out once nights stay above 10°C","depth":"5 mm","spacing":"45–60 cm between plants","row_spacing":"75–90 cm","germination_days":"6–10 days","soil_temp":"21–27°C for reliable germination"}'::jsonb,
  '{"frequency":"Deep watering 2–3 times a week; keep even to prevent splitting","mulching":"Mulch with straw or compost to hold moisture","overwatering":"Yellowing lower leaves, split fruit","underwatering":"Wilting in heat, blossom-end rot"}'::jsonb,
  '{"before_planting":"Work in well-rotted compost or aged manure","vegetative":"Balanced compost feed to build leaf and stem","flowering":"Switch to a potassium-rich feed such as comfrey tea","fruiting":"Liquid seaweed or comfrey every 1–2 weeks","amendments":"Compost, aged manure, seaweed, comfrey tea, bone meal, rock dust"}'::jsonb,
  '{"days_to_harvest":"60–85 days from transplant","signs":"Fully coloured and slightly soft to gentle pressure","method":"Twist or snip with a short stalk attached","storage":"Keep at room temperature; never refrigerate for flavour","seed_saving":"Ferment seed from open-pollinated fruit, rinse and dry"}'::jsonb,
  'published'
),
(
  'carrot', 'Carrot', 'Daucus carota', 'Apiaceae', 'vegetables',
  'beginner', 'biennial', true, 75, '2–4 kg per square metre',
  'Cool to temperate', '3–10', false, 'Insect-pollinated (for seed)',
  'full_sun', 'moderate', true, true, false,
  true, 'Root',
  'A dependable root crop grown for its sweet taproot. Carrots ask for loose, stone-free soil and thinning, but little else. Sow in succession for a steady supply and pull young for the sweetest roots.',
  '{"texture":"Light, deep, stone-free sandy loam","ph":"6.0–6.8","drainage":"Free-draining — stony soil forks the roots","organic_matter":"Moderate; avoid fresh manure which splits roots","containers":"Use deep containers for round or short types"}'::jsonb,
  '{"direct":"Sow direct where they are to grow — carrots dislike transplanting","depth":"1 cm","spacing":"Thin to 5–7 cm apart","row_spacing":"15–30 cm","germination_days":"14–21 days","soil_temp":"7–24°C","thinning":"Thin in the evening and firm soil to deter carrot fly"}'::jsonb,
  '{"frequency":"Even, moderate moisture; sudden water after drought splits roots","mulching":"Light mulch keeps the soil cool and moist","underwatering":"Woody, bitter roots"}'::jsonb,
  '{"before_planting":"Compost the bed the season before, not at sowing","vegetative":"Little feeding needed; excess nitrogen grows leaf not root","amendments":"Well-rotted compost (applied ahead of time), rock dust, wood ash for potassium"}'::jsonb,
  '{"days_to_harvest":"60–80 days","signs":"Shoulders 1.5–2 cm across at the soil surface","method":"Loosen with a fork and lift by the shoulders","storage":"Store in damp sand in a cool place, or leave in the ground under mulch"}'::jsonb,
  'published'
),
(
  'basil', 'Basil', 'Ocimum basilicum', 'Lamiaceae', 'herbs',
  'beginner', 'annual', true, 60, 'Continuous cut-and-come-again',
  'Warm temperate to tropical', '10–11', true, 'Self-fertile',
  'full_sun', 'moderate', false, true, false,
  true, 'Leaf',
  'A warmth-loving herb that thrives beside tomatoes and rewards frequent picking. Pinch out flower buds to keep the leaves coming, and never let it sit cold or wet.',
  '{"texture":"Rich, moist but well-drained soil","ph":"6.0–7.0","drainage":"Good — hates cold, wet feet","organic_matter":"High; compost-rich soil grows lush leaf","containers":"Excellent on a warm, bright windowsill"}'::jsonb,
  '{"indoor":"Start indoors 4–6 weeks before warm weather settles","transplant":"Only once nights are reliably above 12°C","depth":"5 mm","spacing":"20–30 cm","germination_days":"5–10 days","soil_temp":"20–25°C"}'::jsonb,
  '{"frequency":"Keep evenly moist; water in the morning at the base","mulching":"Light compost mulch holds warmth and moisture","overwatering":"Damping-off in seedlings, root rot","underwatering":"Wilting and early flowering"}'::jsonb,
  '{"before_planting":"Mix compost into the bed or potting mix","vegetative":"Light liquid seaweed feed every few weeks for leafy growth","amendments":"Compost, worm castings, liquid seaweed"}'::jsonb,
  '{"days_to_harvest":"From 3–4 weeks, cut as needed","signs":"Stems with several leaf pairs above a node","method":"Pinch just above a leaf pair to force bushy regrowth","storage":"Use fresh; keep stems in water, or freeze as pesto"}'::jsonb,
  'published'
),
(
  'cowpea', 'Cowpea', 'Vigna unguiculata', 'Fabaceae', 'legumes',
  'beginner', 'annual', true, 70, '1–2 kg dry pods per square metre',
  'Warm, tolerant of heat and drought', '9–11', true, 'Self-fertile',
  'full_sun', 'low', true, true, true,
  true, 'Seed and leaf',
  'A heat- and drought-tolerant legume grown across the tropics for its pods, dry beans and edible leaves. As a nitrogen fixer it also feeds the soil — an excellent beginner crop and cover crop in warm regions.',
  '{"texture":"Adapts to poor soils; prefers well-drained sandy loam","ph":"5.5–7.0","drainage":"Good — tolerant of dry ground once established","organic_matter":"Low needs; fixes its own nitrogen","cover_crop":"Sow as a warm-season green manure to build soil"}'::jsonb,
  '{"direct":"Sow direct once the soil is warm","depth":"2–3 cm","spacing":"10–15 cm","row_spacing":"45–60 cm","germination_days":"5–10 days","soil_temp":"20–35°C"}'::jsonb,
  '{"frequency":"Low — water to establish, then only in prolonged drought","drought_tolerance":"High once established","overwatering":"Encourages leaf at the expense of pods"}'::jsonb,
  '{"before_planting":"No nitrogen feed needed — it fixes its own","vegetative":"Inoculate seed with rhizobia in new ground if available","amendments":"A little compost and rock phosphate on very poor soils"}'::jsonb,
  '{"days_to_harvest":"60–90 days","signs":"Pods for fresh use plump and tender; dry pods papery","method":"Pick fresh pods regularly; leave the rest to dry on the plant","storage":"Dry beans store for months in an airtight jar","seed_saving":"Save the driest, healthiest pods for next season"}'::jsonb,
  'published'
)
on conflict (slug) do nothing;
