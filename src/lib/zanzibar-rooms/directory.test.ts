import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mergeDirectory,
  partnerStayLocation,
  partnerStayType,
  placePartnerStays,
  showsPartnerStays,
  type DirectoryFilters,
  type PartnerStay,
} from "./directory";

const LABELS = ["Fumba", "Jambiani", "Kendwa", "Matemwe", "Nungwi", "Paje", "Stone Town"];

function stay(over: Partial<PartnerStay> = {}): PartnerStay {
  return {
    id: "zr-1",
    name: "Paje Beach Studio",
    area: "Paje",
    fromPrice: 85,
    currency: "USD",
    priceUnit: "night",
    maxGuests: 2,
    photoUrl: null,
    photoAlt: "Paje Beach Studio",
    url: "https://www.zanzibarrooms.com/stays/paje-beach-studio",
    summary: "A bright studio near the beach.",
    priceLabel: "from $85 / night",
    ...over,
  };
}

const NONE: DirectoryFilters = { term: "all", type: "all", location: "all", query: "", min: null, max: null, amenities: [], savedOnly: false, sort: "newest" };
const listing = (id: string, price: number | null) => ({ id, price_per_night: price });
const ids = (items: ReturnType<typeof mergeDirectory<{ id: string; price_per_night: number | null }>>) =>
  items.map((i) => (i.kind === "listing" ? i.listing.id : i.stay.id));

test("only Mzungu Zanzibar's accomodation space shows partner stays", () => {
  assert.equal(showsPartnerStays("mzunguzanzibar", "accomodation"), true);
  assert.equal(showsPartnerStays("mzunguzanzibar", "jobs"), false);
  assert.equal(showsPartnerStays("another-community", "accomodation"), false);
});

test("area maps to a location chip by its leading place name", () => {
  assert.equal(partnerStayLocation("Jambiani - Kikadini", LABELS), "Jambiani");
  assert.equal(partnerStayLocation("Kendwa", LABELS), "Kendwa");
  assert.equal(partnerStayLocation("paje", LABELS), "Paje");
  assert.equal(partnerStayLocation("Stone Town, Shangani", LABELS), "Stone Town");
  // Not the leading place, unknown places and no area: All locations only.
  assert.equal(partnerStayLocation("Near Paje", LABELS), null);
  assert.equal(partnerStayLocation("Michamvi", LABELS), null);
  assert.equal(partnerStayLocation("Stone", LABELS), null);
  assert.equal(partnerStayLocation(null, LABELS), null);
  assert.equal(partnerStayLocation("Paje", []), null);
});

test("longest matching chip wins", () => {
  assert.equal(partnerStayLocation("Stone Town Old Fort", ["Stone", "Stone Town"]), "Stone Town");
});

test("nightly stays are holiday rentals, monthly ones long-term rentals", () => {
  assert.equal(partnerStayType({ priceUnit: "night" }), "holiday_rental");
  assert.equal(partnerStayType({ priceUnit: "month" }), "long_term_rental");
  const [nightly, monthly] = placePartnerStays([stay(), stay({ id: "zr-2", priceUnit: "month", area: "Jambiani - Kikadini" })], LABELS);
  assert.deepEqual([nightly.type, nightly.term, nightly.location], ["holiday_rental", "short_stay", "Paje"]);
  assert.deepEqual([monthly.type, monthly.term, monthly.location], ["long_term_rental", "long_term", "Jambiani"]);
});

test("a failed feed leaves the members' list unchanged", () => {
  const listings = [listing("a", 50), listing("b", null)];
  for (const stays of [null, undefined, []]) {
    const items = mergeDirectory(listings, placePartnerStays(stays, LABELS), { ...NONE, sort: "price_asc" });
    assert.deepEqual(ids(items), ["a", "b"]);
  }
});

test("newest and top-rated put partner stays after members' listings", () => {
  const partners = placePartnerStays([stay({ fromPrice: 10 })], LABELS);
  assert.deepEqual(ids(mergeDirectory([listing("a", 50), listing("b", 20)], partners, NONE)), ["a", "b", "zr-1"]);
  assert.deepEqual(ids(mergeDirectory([listing("a", 50)], partners, { ...NONE, sort: "top_rated" })), ["a", "zr-1"]);
});

test("price sorts interleave by from-price, unpriced listings last", () => {
  const partners = placePartnerStays([stay({ id: "zr-85" }), stay({ id: "zr-30", fromPrice: 30 })], LABELS);
  const asc = [listing("p20", 20), listing("p50", 50), listing("p85", 85), listing("none", null)];
  assert.deepEqual(ids(mergeDirectory(asc, partners, { ...NONE, sort: "price_asc" })), ["p20", "zr-30", "p50", "p85", "zr-85", "none"]);
  const desc = [listing("p85", 85), listing("p50", 50), listing("p20", 20), listing("none", null)];
  assert.deepEqual(ids(mergeDirectory(desc, partners, { ...NONE, sort: "price_desc" })), ["p85", "zr-85", "p50", "zr-30", "p20", "none"]);
});

test("an amenity filter or Saved hides partner stays", () => {
  const partners = placePartnerStays([stay()], LABELS);
  assert.deepEqual(ids(mergeDirectory([listing("a", 50)], partners, { ...NONE, amenities: ["wifi"] })), ["a"]);
  assert.deepEqual(ids(mergeDirectory([listing("a", 50)], partners, { ...NONE, savedOnly: true })), ["a"]);
});

test("type, term, location, search and price filters apply to partner stays", () => {
  const partners = placePartnerStays(
    [stay(), stay({ id: "zr-m", name: "Kendwa flat", area: "Kendwa", priceUnit: "month", fromPrice: 600 }), stay({ id: "zr-x", area: "Michamvi", name: "Michamvi villa" })],
    LABELS
  );
  const only = (f: Partial<DirectoryFilters>) => ids(mergeDirectory([], partners, { ...NONE, ...f }));
  assert.deepEqual(only({}), ["zr-1", "zr-m", "zr-x"]);
  assert.deepEqual(only({ type: "holiday_rental" }), ["zr-1", "zr-x"]);
  assert.deepEqual(only({ type: "hotel" }), []);
  assert.deepEqual(only({ term: "long_term" }), ["zr-m"]);
  assert.deepEqual(only({ location: "Kendwa" }), ["zr-m"]);
  assert.deepEqual(only({ location: "Paje" }), ["zr-1"]);
  assert.deepEqual(only({ query: "villa" }), ["zr-x"]);
  assert.deepEqual(only({ query: "michamvi" }), ["zr-x"]);
  assert.deepEqual(only({ min: 100 }), ["zr-m"]);
  assert.deepEqual(only({ max: 100 }), ["zr-1", "zr-x"]);
});
