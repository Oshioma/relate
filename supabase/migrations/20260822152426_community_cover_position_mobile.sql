-- A separate crop for the cover photo on a phone.
--
-- cover_position solves the desktop case: the header there is a wide band, far
-- wider than any photograph, so the photo is scaled to the width and it's the
-- top and bottom that get cut — hence three vertical choices.
--
-- On a phone the same header is roughly square, so the crop turns ninety
-- degrees: a landscape photo is now scaled to the height and cut at the SIDES,
-- where 'top' and 'bottom' do nothing at all. That's why a cover can look right
-- on a laptop and lose its subject on a phone, with no setting that helps.
--
-- Which axis gets cut on a phone depends on the photograph (a portrait shot is
-- still cut top and bottom), so the mobile value is a focal point rather than
-- an axis: one of the nine object-position keywords. Null = fall back to
-- cover_position, so every existing community keeps exactly the crop it has.
--
-- No new RLS: `communities` already restricts updates to the owner and admins,
-- and this column rides along with the row like cover_position itself.
alter table public.communities
  add column if not exists cover_position_mobile text;

alter table public.communities
  drop constraint if exists communities_cover_position_mobile_valid;

alter table public.communities
  add constraint communities_cover_position_mobile_valid
  check (
    cover_position_mobile is null
    or cover_position_mobile in (
      'top-left', 'top', 'top-right',
      'left', 'center', 'right',
      'bottom-left', 'bottom', 'bottom-right'
    )
  );
