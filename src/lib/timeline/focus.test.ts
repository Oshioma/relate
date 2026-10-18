import { test } from "node:test";
import assert from "node:assert/strict";

import {
  buildFocusGroups,
  currentFocus,
  decodeFocus,
  encodeFocus,
  filterFocusGroups,
  filtersForFocus,
  focusLinkSearch,
} from "./focus";

const none = { trackId: "", category: "", civilisation: "", tag: "", person: "" };

test("a choice survives the round trip through a select value, colons in the value included", () => {
  const choice = { kind: "tag", value: "flood: Mesopotamia" } as const;
  assert.deepEqual(decodeFocus(encodeFocus(choice)), choice);
  assert.equal(decodeFocus(""), null);
  assert.equal(decodeFocus("nonsense:value"), null);
  assert.equal(decodeFocus("track:"), null);
});

test("only a single filter on its own counts as one topic", () => {
  assert.equal(currentFocus(none), null);
  assert.deepEqual(currentFocus({ ...none, civilisation: "Benin" }), { kind: "civilisation", value: "Benin" });
  assert.equal(currentFocus({ ...none, civilisation: "Benin", tag: "bronze" }), null);
});

test("choosing a topic clears every other one, and choosing nothing clears them all", () => {
  assert.deepEqual(filtersForFocus({ kind: "track", value: "t1" }), { ...none, trackId: "t1" });
  assert.deepEqual(filtersForFocus({ kind: "person", value: "Ewuare" }), { ...none, person: "Ewuare" });
  assert.deepEqual(filtersForFocus(null), none);
});

test("the groups list every kind that has something in it, and leave empty ones out", () => {
  const groups = buildFocusGroups({
    tracks: [
      { id: "b", name: "Okomilo family" },
      { id: "a", name: "Hannibal" },
    ],
    categories: [{ key: "history", label: "History" }],
    civilisations: [],
    tags: ["flood"],
    people: ["Ewuare"],
  });
  assert.deepEqual(
    groups.map((group) => group.label),
    ["Tracks and datasets", "Topics", "Related (shared tags)", "People"]
  );
  assert.deepEqual(groups[0].options.map((option) => option.label), ["Hannibal", "Okomilo family"]);
  assert.deepEqual(decodeFocus(groups[0].options[0].value), { kind: "track", value: "a" });
});

test("the link names the filter and a window wide enough to hold the whole span", () => {
  const search = new URLSearchParams(focusLinkSearch("civilisation", "Kingdom of Benin", { from: 1150.4, to: 2034.2 }));
  assert.equal(search.get("civilisation"), "Kingdom of Benin");
  assert.equal(search.get("from"), "1150");
  assert.equal(search.get("to"), "2035");
  assert.equal(new URLSearchParams(focusLinkSearch("track", "hannibal", { from: -220, to: -180 })).get("track"), "hannibal");
});

test("a search finds a track by any word in its name, and keeps the groups it found things in", () => {
  const groups = buildFocusGroups({
    tracks: [
      { id: "t1", name: "Origins of the Moors — 315,000 BCE to 711 CE" },
      { id: "t2", name: "Carthage and Rome" },
    ],
    categories: [],
    civilisations: ["Mauretania"],
    tags: ["moors: Garamantes and the Sahara", "flood: Mesopotamia"],
    people: ["Cléopâtre Séléné II"],
  });
  assert.deepEqual(
    filterFocusGroups(groups, "moor").map((group) => [group.label, group.options.map((option) => option.label)]),
    [
      ["Tracks and datasets", ["Origins of the Moors — 315,000 BCE to 711 CE"]],
      ["Related (shared tags)", ["moors: Garamantes and the Sahara"]],
    ]
  );
  // Every word, any order, any case.
  assert.deepEqual(filterFocusGroups(groups, "SAHARA moors")[0].options.map((option) => option.label), ["moors: Garamantes and the Sahara"]);
  // Accents don't have to be typed.
  assert.deepEqual(filterFocusGroups(groups, "selene")[0].options.map((option) => option.label), ["Cléopâtre Séléné II"]);
  assert.deepEqual(filterFocusGroups(groups, "   "), groups);
  assert.deepEqual(filterFocusGroups(groups, "zzz"), []);
});
