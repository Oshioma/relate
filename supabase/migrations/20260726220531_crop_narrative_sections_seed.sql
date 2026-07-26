-- =============================================================================
-- Relate — seed content for the new crop sections (pruning, pollination,
-- seasonal timeline, troubleshooting, biodiversity) for the four starter crops.
-- Plain UPDATEs by slug — safe to re-run (sets the same values). Empty sections
-- simply don't render on the crop page.
-- =============================================================================

update public.crops set
  pruning = '{"suckers":"On indeterminate (cordon) types, pinch out side shoots so energy goes into fruit","topping":"Pinch the growing tip in late season to ripen the fruit already set","support":"Tie to a stake or string as it grows and support heavy trusses","bush_types":"Determinate (bush) types need little or no pruning"}'::jsonb,
  pollination = '{"type":"Self-fertile","hand_pollination":"Gently shake or tap the flower trusses on still days, or brush them, to improve fruit set","outdoors":"Bees and a light breeze improve set outdoors","under_cover":"Hand-pollinate in a still greenhouse or polytunnel"}'::jsonb,
  task_timeline = '{"spring":"Sow indoors, pot on and harden off","early_summer":"Transplant out, stake, mulch and start feeding","summer":"Water deeply, remove suckers, feed weekly and harvest","autumn":"Top the plants, ripen the last fruit, save seed and clear spent plants"}'::jsonb,
  troubleshooting = '{"yellowing_lower_leaves":"Usually uneven watering or hungry plants — feed and water evenly","split_fruit":"Irregular watering after a dry spell — keep moisture steady and mulch","blossom_end_rot":"Uneven watering / calcium uptake — water consistently and mulch","no_fruit_set":"Too hot, too cold or poor pollination — shade in heat and hand-pollinate","leaf_curl":"Often heat or wind stress; usually harmless if the plant is otherwise healthy"}'::jsonb,
  biodiversity = '{"pollinators":"Open flowers feed bees and hoverflies","companions":"Basil and marigold nearby draw beneficial insects","soil":"Mulching and no-dig care build soil life","wildlife":"Fallen fruit feeds birds and insects late in the season"}'::jsonb
where slug = 'tomato';

update public.crops set
  pruning = '{"maintenance":"No pruning — keep weeded and thinned","thinning":"Thin seedlings to final spacing in the evening to reduce carrot-fly attraction"}'::jsonb,
  pollination = '{"type":"Insect-pollinated (only needed for seed)","seed_saving":"Leave a few roots to flower in their second year; the umbels attract hoverflies"}'::jsonb,
  task_timeline = '{"spring":"Direct sow in succession from mid-spring","summer":"Thin, weed, water evenly and keep sowing","autumn":"Harvest; lift for storage or leave under mulch","winter":"Store roots in damp sand in a cool place"}'::jsonb,
  troubleshooting = '{"forked_roots":"Stony ground or fresh manure — grow in loose, stone-free soil","green_shoulders":"Exposed to light — earth up the shoulders","woody_or_bitter":"Sudden water after drought, or over-mature — water evenly and harvest younger"}'::jsonb,
  biodiversity = '{"pollinators":"Flowering umbels (when left for seed) feed hoverflies and lacewings","beneficials":"Attracts aphid predators when allowed to flower"}'::jsonb
where slug = 'carrot';

update public.crops set
  pruning = '{"pinching":"Pinch the growing tips regularly, just above a leaf pair, to keep it bushy","flowers":"Pinch out flower buds to prolong leaf production"}'::jsonb,
  pollination = '{"type":"Self-fertile","note":"Not grown for fruit — pinch flowers off, but let some bloom for bees at the end of the season"}'::jsonb,
  task_timeline = '{"spring":"Sow indoors in warmth","early_summer":"Transplant out once warm and pinch the tips","summer":"Harvest often, pinch flowers and feed lightly","autumn":"Take a final harvest before the cold and freeze as pesto"}'::jsonb,
  troubleshooting = '{"leggy_growth":"Too little light or not pinched — give bright light and pinch the tips","yellow_leaves":"Cold or overwatering — keep warm and water in the morning","black_spots":"Cold damage — basil dislikes temperatures below about 10C"}'::jsonb,
  biodiversity = '{"pollinators":"Flowers left at season end are loved by bees","companions":"A classic tomato companion that may help deter some pests"}'::jsonb
where slug = 'basil';

update public.crops set
  pruning = '{"maintenance":"No pruning needed; give climbing types some low support"}'::jsonb,
  pollination = '{"type":"Self-fertile","note":"Largely self-pollinating; bees may cross-pollinate but saved seed comes true enough"}'::jsonb,
  task_timeline = '{"warm_season":"Direct sow once the soil is warm","growing":"Water to establish, then minimal; keep weeded","harvest":"Pick pods young for fresh use, or dry them on the plant for beans","after":"Cut and dig the plants in as a nitrogen-rich green manure"}'::jsonb,
  troubleshooting = '{"lots_of_leaf_few_pods":"Too much nitrogen or water — ease off; it fixes its own nitrogen","poor_germination":"Soil too cold or wet — wait for warmth","aphids":"Blast off with water or tolerate; natural predators usually cope"}'::jsonb,
  biodiversity = '{"nitrogen_fixation":"Fixes atmospheric nitrogen, feeding the soil for following crops","cover_crop":"Excellent warm-season green manure and living mulch","pollinators":"Flowers offer forage for bees"}'::jsonb
where slug = 'cowpea';
