-- Testimonials on a community's signed-out landing page (/welcome/<slug>).
-- An ordered list of { quote, name } that admins edit under Admin -> Landing
-- page; an empty list shows nothing. Read with the rest of the community row,
-- so the existing communities policies cover who sees and edits it.
alter table public.communities
  add column if not exists testimonials jsonb not null default '[]'::jsonb;

alter table public.communities
  drop constraint if exists communities_testimonials_is_array;
alter table public.communities
  add constraint communities_testimonials_is_array check (jsonb_typeof(testimonials) = 'array');

-- Escape Space's first three, word for word as the members wrote them. Only
-- filled while the list is still empty, so a re-run never overwrites edits.
update public.communities
set testimonials = $json$[
  {
    "quote": "The practice offered me a home within and a family without. Guided meditations, learning to breathe assisted me in making contact on a regular basis to Divine time, calming my body; and allowing me to engage in and with the life of my soul.",
    "name": "Tanya"
  },
  {
    "quote": "The Escape Space Morning meditations has given me the opportunity to connect with myself and have greater self-awareness. It’s a powerful way to start your day, to improve your well-being and mental clarity. Meditating in the mornings has enhanced my creativity and leaves me energised for my day.",
    "name": "Angela Cosmetic Astrology"
  },
  {
    "quote": "I found daily meditation to be very relaxing and a great way to clear my mind. Niko Is always very informative about why we did certain breathing patterns and what topics we where meditating on. It is lovely to share this space with our family. Much love to you all.",
    "name": "Mel"
  }
]$json$::jsonb
where slug = 'escapespace' and testimonials = '[]'::jsonb;
