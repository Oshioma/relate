-- =============================================================================
-- Relate — Crop Guides Phase 2: starter section content for Tomato
--
-- Gives the tomato guide real varieties, companions, pests and diseases so the
-- new sections render with meaningful content. Idempotent: each row is inserted
-- only `where not exists`, so re-running never duplicates. Pest/disease rows
-- carry organic guidance only, in keeping with the organic-only policy.
-- =============================================================================

-- Varieties -------------------------------------------------------------------
insert into public.crop_varieties (crop_id, name, description, growth_habit, time_to_harvest, yield, disease_resistance, best_climates, flavour, uses, sort_order)
select c.id, v.name, v.description, v.growth_habit, v.time_to_harvest, v.yield, v.disease_resistance, v.best_climates, v.flavour, v.uses, v.sort_order
from (select id from public.crops where slug = 'tomato') c
cross join (values
  ('Roma', 'A reliable plum tomato with meaty, low-seed flesh.', 'Determinate', '75 days', 'Heavy, concentrated flush', 'Good (VF)', 'Warm temperate to subtropical', 'Rich, low-acid', 'Sauces, paste, canning', 1),
  ('Cherry', 'Small, sweet fruit borne in long trusses over a long season.', 'Indeterminate', '60 days', 'Very high over a long season', 'Moderate', 'Wide-ranging', 'Very sweet', 'Fresh, snacking, salads', 2),
  ('Beefsteak', 'Large, thick-sliced fruit for sandwiches.', 'Indeterminate', '85 days', 'Large fruit, moderate count', 'Variable', 'Warm with a long season', 'Full and juicy', 'Slicing, fresh', 3),
  ('San Marzano', 'Classic elongated paste tomato prized for sauce.', 'Indeterminate', '80 days', 'Good', 'Moderate', 'Mediterranean, warm temperate', 'Sweet, intense', 'Sauce, paste', 4),
  ('Brandywine', 'Heirloom beefsteak with outstanding old-fashioned flavour.', 'Indeterminate', '90 days', 'Moderate', 'Lower', 'Warm temperate', 'Exceptional, complex', 'Fresh, slicing', 5)
) as v(name, description, growth_habit, time_to_harvest, yield, disease_resistance, best_climates, flavour, uses, sort_order)
where not exists (
  select 1 from public.crop_varieties x where x.crop_id = c.id and x.name = v.name
);

-- Companions (companion_crop_id links to the library where the crop exists) ----
insert into public.crop_companions (crop_id, companion_crop_id, companion_name, relationship, reason, sort_order)
select c.id, (select cc.id from public.crops cc where cc.slug = v.companion_slug), v.companion_name, v.relationship, v.reason, v.sort_order
from (select id from public.crops where slug = 'tomato') c
cross join (values
  ('basil',  'Basil',      'excellent', 'Traditionally improves flavour and helps repel thrips and whitefly.', 1),
  (null,     'Marigold',   'excellent', 'Deters nematodes and whitefly; draws in beneficial insects.', 2),
  (null,     'Nasturtium', 'excellent', 'Acts as a trap crop for aphids, luring them away from the tomatoes.', 3),
  (null,     'Garlic',     'excellent', 'Its scent helps deter aphids, mites and other soft-bodied pests.', 4),
  ('carrot', 'Carrot',     'neutral',   'Coexist happily; loosen soil but compete a little for space.', 5),
  (null,     'Potato',     'avoid',     'Same family — shares late blight and encourages its spread.', 6),
  (null,     'Fennel',     'avoid',     'Releases compounds that inhibit tomato growth.', 7)
) as v(companion_slug, companion_name, relationship, reason, sort_order)
where not exists (
  select 1 from public.crop_companions x where x.crop_id = c.id and x.companion_name = v.companion_name
);

-- Pests (organic guidance only) -----------------------------------------------
insert into public.crop_pests (crop_id, name, symptoms, life_cycle, damage, organic_treatments, natural_predators, prevention, severity, sort_order)
select c.id, v.name, v.symptoms, v.life_cycle, v.damage, v.organic_treatments, v.natural_predators, v.prevention, v.severity, v.sort_order
from (select id from public.crops where slug = 'tomato') c
cross join (values
  ('Whitefly', 'Clouds of tiny white insects rise when the plant is disturbed; sticky honeydew and sooty mould on leaves.', 'Eggs hatch on leaf undersides; several overlapping generations in warm weather.', 'Weakens plants by sap-sucking and spreads virus; honeydew fuels sooty mould.', 'Spray leaf undersides with insecticidal soap or neem in the evening; hang yellow sticky traps; blast with water.', 'Encarsia parasitic wasps, ladybirds, lacewings.', 'Interplant marigolds and nasturtiums; keep plants unstressed; inspect undersides weekly.', 'moderate', 1),
  ('Tomato hornworm', 'Large green caterpillars strip leaves fast; dark droppings on leaves below.', 'Moths lay eggs on leaves; caterpillars feed for several weeks before pupating in soil.', 'Rapid, heavy defoliation and chewed fruit.', 'Hand-pick at dusk; apply Bacillus thuringiensis (Bt) to young larvae; encourage predators.', 'Braconid wasps (white cocoons on the caterpillar), birds, paper wasps.', 'Rotate crops; till lightly to expose pupae; plant dill and basil nearby.', 'high', 2),
  ('Aphids', 'Clusters of small soft insects on new growth; curled, distorted leaves and honeydew.', 'Rapid asexual reproduction; many generations per season.', 'Sap loss stunts growth and can transmit viruses.', 'Dislodge with a water jet; spray insecticidal soap or neem; tolerate low numbers to feed predators.', 'Ladybirds, lacewing larvae, hoverfly larvae, parasitic wasps.', 'Avoid over-feeding with nitrogen; grow flowers to attract predators; use nasturtium as a trap crop.', 'moderate', 3)
) as v(name, symptoms, life_cycle, damage, organic_treatments, natural_predators, prevention, severity, sort_order)
where not exists (
  select 1 from public.crop_pests x where x.crop_id = c.id and x.name = v.name
);

-- Diseases (organic guidance only) --------------------------------------------
insert into public.crop_diseases (crop_id, name, symptoms, causes, organic_control, prevention, early_signs, sort_order)
select c.id, v.name, v.symptoms, v.causes, v.organic_control, v.prevention, v.early_signs, v.sort_order
from (select id from public.crops where slug = 'tomato') c
cross join (values
  ('Late blight', 'Dark, greasy patches on leaves and stems; fruit develops firm brown rot; whole plants can collapse quickly in wet weather.', 'The water mould Phytophthora infestans, spread by wind and rain in cool, humid conditions.', 'Remove and destroy affected plants immediately; improve airflow; a copper-based organic spray may slow spread in a wet season.', 'Grow resistant varieties; space and stake for airflow; water at the base; never compost infected material.', 'Small dark blotches on lower leaves after a cool, wet spell.', 1),
  ('Blossom-end rot', 'Sunken, leathery dark patch at the base of the fruit.', 'Not an infection — a calcium-uptake problem driven by uneven watering, not a pathogen.', 'Keep soil evenly moist and mulched; add well-rotted compost; correct erratic watering rather than spraying.', 'Water consistently; mulch to buffer moisture; avoid over-feeding with nitrogen; ensure calcium-rich soil.', 'First fruits of a truss show small water-soaked spots at the tip.', 2),
  ('Powdery mildew', 'White powdery coating on leaves; yellowing and early leaf drop.', 'Fungal spores that thrive in warm days with humid nights and poor airflow.', 'Spray a diluted milk or potassium-bicarbonate solution; remove worst-affected leaves; improve spacing.', 'Space plants for airflow; water at the base in the morning; avoid dense, shaded growth.', 'A few dusty white spots on older leaves.', 3)
) as v(name, symptoms, causes, organic_control, prevention, early_signs, sort_order)
where not exists (
  select 1 from public.crop_diseases x where x.crop_id = c.id and x.name = v.name
);
