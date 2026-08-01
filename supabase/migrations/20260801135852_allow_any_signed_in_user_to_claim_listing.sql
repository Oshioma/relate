-- Relate — Business Directory: let a new (not-yet-member) user claim a listing
--
-- "Claim your business" is an onboarding path: someone finds the listing a
-- curator added for their business and asks to own it. Previously only *active
-- members* could open a claim, so a signed-in visitor browsing a public space
-- never saw (or could use) the claim CTA. Loosen the insert policy so any
-- authenticated user may open a claim on an unclaimed listing. This changes who
-- can *request* ownership, not who gets it — staff still approve every claim
-- before businesses.claimed_by is set, so the control point is unchanged.

drop policy if exists "business_claims_insert_self" on public.business_claims;
create policy "business_claims_insert_self" on public.business_claims
  for insert to authenticated
  with check (
    claimant_id = auth.uid()
    and exists (
      select 1
      from public.businesses b
      where b.id = business_claims.business_id
        and b.community_id = business_claims.community_id
        and b.claimed_by is null
    )
  );
