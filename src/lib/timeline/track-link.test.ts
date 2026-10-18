import { test } from "node:test";
import assert from "node:assert/strict";

import { resolveTrackParam, trackLinkSearch } from "./track-link";
import { OKOMILO_EVENTS, OKOMILO_TRACK, OKOMILO_TRACK_WINDOW } from "./okomilo-avhianwu-benin-seed";

const tracks = [
  { id: "0d0749b6-e9b9-4f17-93c5-a5b6b07d7f12", slug: "okomilo-avhianwu-benin" },
  { id: "11111111-2222-3333-4444-555555555555", slug: "hannibal" },
];

test("a ?track= value resolves by id or by slug, and an unknown one is dropped", () => {
  assert.equal(resolveTrackParam("0d0749b6-e9b9-4f17-93c5-a5b6b07d7f12", tracks), tracks[0].id);
  assert.equal(resolveTrackParam("okomilo-avhianwu-benin", tracks), tracks[0].id);
  assert.equal(resolveTrackParam("hannibal", tracks), tracks[1].id);
  assert.equal(resolveTrackParam("no-such-track", tracks), "");
  assert.equal(resolveTrackParam("", tracks), "");
});

test("the track link names the slug and the window", () => {
  const search = new URLSearchParams(trackLinkSearch("okomilo-avhianwu-benin", { from: 1150, to: 2035 }));
  assert.equal(search.get("track"), "okomilo-avhianwu-benin");
  assert.equal(search.get("from"), "1150");
  assert.equal(search.get("to"), "2035");
});

test("every dated Okomilo claim falls inside the window its link opens on", () => {
  for (const event of OKOMILO_EVENTS) {
    for (const claim of event.claims) {
      if (claim.startYear == null) continue;
      const end = claim.endYear ?? claim.startYear;
      assert.ok(
        claim.startYear >= OKOMILO_TRACK_WINDOW.from && end <= OKOMILO_TRACK_WINDOW.to,
        `${event.slug}: ${claim.originalDateText} falls outside the track link's window`
      );
    }
  }
  assert.equal(OKOMILO_TRACK.slug, "okomilo-avhianwu-benin");
});
