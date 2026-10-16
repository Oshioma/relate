// THE ARCHIVE'S QUALITY CHECKS.
//
// Every rule the brief lists under "Quality assurance" that can be decided from
// the data alone is decided here, before anything reaches the database: the
// importer refuses a file this returns problems for, and the test suite runs it
// over every inventory entry and corpus file in the repository. A check that
// only runs when somebody remembers to run it is a check that does not run.
//
// What it cannot decide from the data — whether a link still resolves, whether
// a photograph really shows the papyrus its caption names — is left to the
// verification statuses, which say plainly that a person has not checked yet.

import {
  CLAIM_VIEWPOINTS,
  DATING_METHODS,
  EVENT_RELATIONS,
  EVIDENCE_LAYERS,
  IDENTIFICATION_STATUSES,
  MEDIA_KINDS,
  TEMPORAL_CLAIM_TYPES,
  TIMELINE_CATEGORIES,
  TIMELINE_EVENT_TYPES,
  TIMELINE_SOURCE_TYPES,
} from "../taxonomy";
import type { SeedClaim } from "../seed-types";
import type { CorpusImage, InventoryWork, TextCorpusFile } from "./corpus-types";
import {
  COPYRIGHT_EXCERPT_MAX_CHARS,
  PASSAGE_DATE_ROLES,
  isArchiveTheme,
  isComparability,
  isConnectionClass,
  isCorpusGroup,
  isDivisionKind,
  isImageLicenceStatus,
  isImageVerification,
  isLayerLicence,
  isLinkReviewStatus,
  isPassageDateRole,
  isPassageVerification,
  isTraditionClass,
  traditionIsModern,
} from "./taxonomy";

const keysOf = (list: readonly { key: string }[]) => new Set(list.map((item) => item.key));
const LAYER_KEYS = keysOf(EVIDENCE_LAYERS);
const MEDIA_KEYS = keysOf(MEDIA_KINDS);
const IDENTIFICATION_KEYS = keysOf(IDENTIFICATION_STATUSES);
const VIEWPOINT_KEYS = keysOf(CLAIM_VIEWPOINTS);
const DATING_KEYS = keysOf(DATING_METHODS);
const TEMPORAL_KEYS = keysOf(TEMPORAL_CLAIM_TYPES);
const RELATION_KEYS = keysOf(EVENT_RELATIONS);
const EVENT_TYPE_KEYS = keysOf(TIMELINE_EVENT_TYPES);
const SOURCE_TYPE_KEYS = keysOf(TIMELINE_SOURCE_TYPES);
const CATEGORY_KEYS = new Set<string>(TIMELINE_CATEGORIES.map((c) => c.key));
const POSITIONLESS = new Set(["cyclic", "eternal", "no_beginning", "primordial", "previous_world", "unknown"]);
const DATE_PRECISIONS = new Set([
  "day",
  "month",
  "year",
  "decade",
  "century",
  "millennium",
  "thousand_years",
  "million_years",
  "billion_years",
]);
/** Precisions too fine to assert for anything before this year without a dated record. */
const FINE_PRECISIONS = new Set(["day", "month", "year"]);
const CONFIDENCE_SCORE = /confidence (score|level|rating)/i;

/** Media kinds that would present a picture as the physical text itself. */
const ARTEFACT_KINDS = new Set(["manuscript", "artefact", "evidence_photograph", "museum_specimen"]);

export type Problem = { where: string; problem: string };

// ---------------------------------------------------------------------------
// DATES
// ---------------------------------------------------------------------------

/**
 * A claim on a work's marker. The five chronological concepts must be told
 * apart by what_is_dated, and an undated ancient writing must never acquire a
 * precise year it does not have.
 */
export function checkWorkClaim(where: string, claim: SeedClaim): Problem[] {
  const problems: Problem[] = [];
  const say = (problem: string) => problems.push({ where: `${where} — "${claim.originalDateText}"`, problem });

  if (!claim.whatIsDated || !PASSAGE_DATE_ROLES.some((role) => claim.whatIsDated!.startsWith(role.label))) {
    say("whatIsDated must start with one of the five chronological concepts (PASSAGE_DATE_ROLES labels)");
  }
  if (!claim.originalDateText.trim()) say("originalDateText is empty");
  if (!claim.evidence.trim()) say("evidence is empty");
  if (CONFIDENCE_SCORE.test(claim.evidence)) say("evidence states a confidence score");
  if (!DATE_PRECISIONS.has(claim.datePrecision)) say(`unknown datePrecision ${claim.datePrecision}`);
  if (!DATING_KEYS.has(claim.datingMethod)) say(`unknown datingMethod ${claim.datingMethod}`);
  if (!VIEWPOINT_KEYS.has(claim.chronology)) say(`unknown chronology ${claim.chronology}`);
  if (claim.temporalClaimType && !TEMPORAL_KEYS.has(claim.temporalClaimType)) {
    say(`unknown temporalClaimType ${claim.temporalClaimType}`);
  }
  if (claim.startYear == null) {
    if (!POSITIONLESS.has(claim.temporalClaimType ?? "")) {
      say("a claim with no startYear must be a positionless temporalClaimType, or the database refuses it");
    }
    if (claim.endYear != null) say("endYear without startYear");
  } else {
    if (claim.endYear != null && claim.endYear < claim.startYear) say("endYear is before startYear");
    // NEVER INVENT A PRECISE DATE FOR AN UNDATED WRITING. Before the first
    // millennium CE, a single-year date is only allowed where it is genuinely
    // a dated record and says so by not being approximate.
    if (claim.startYear < 1000 && FINE_PRECISIONS.has(claim.datePrecision) && claim.isApproximate) {
      say("an approximate pre-1000 CE date must not claim year, month or day precision");
    }
  }
  return problems;
}

// ---------------------------------------------------------------------------
// INVENTORY
// ---------------------------------------------------------------------------

export function validateInventory(works: InventoryWork[]): Problem[] {
  const problems: Problem[] = [];
  const say = (where: string, problem: string) => problems.push({ where, problem });

  const workKeys = new Set<string>();
  const prefixes = new Set<string>();
  const anchorSlugs = new Set<string>();

  for (const work of works) {
    const where = work.workKey;
    if (workKeys.has(work.workKey)) say(where, "duplicate workKey");
    workKeys.add(work.workKey);
    if (prefixes.has(work.passagePrefix)) say(where, `duplicate passagePrefix ${work.passagePrefix}`);
    prefixes.add(work.passagePrefix);
    if (!/^[a-z]+(\.[a-z0-9-]+)+$/.test(work.workKey)) say(where, "workKey must look like 'group.name'");
    if (!/^[a-z]+(\.[a-z0-9-]+)+$/.test(work.passagePrefix)) say(where, "passagePrefix must look like 'group.abbr'");
    if (work.briefItem < 1 || work.briefItem > 33) say(where, "briefItem must be 1–33");
    if (!isCorpusGroup(work.corpusGroup)) say(where, `unknown corpusGroup ${work.corpusGroup}`);
    if (!isTraditionClass(work.traditionClass)) say(where, `unknown traditionClass ${work.traditionClass}`);
    if (!isDivisionKind(work.unitDivisionKind)) say(where, `unknown unitDivisionKind ${work.unitDivisionKind}`);
    if (!work.summary.trim()) say(where, "summary is empty");
    if (!work.inventoryBasis.trim()) say(where, "inventoryBasis is empty");
    if (!work.copyrightSummary.trim()) say(where, "copyrightSummary is empty");

    // MISLEADING ANCIENT/MODERN CLASSIFICATION.
    if (work.corpusGroup === "modern_esoteric" && !traditionIsModern(work.traditionClass)) {
      say(where, "a modern esoteric work must have a modern tradition class");
    }
    if (traditionIsModern(work.traditionClass) && work.corpusGroup !== "modern_esoteric") {
      say(where, "a modern work must be shelved with the modern esoteric texts, whatever it claims");
    }

    // NEVER COMPLETE WITHOUT A CHECKED INVENTORY.
    if (work.inventoryVerified && work.expectedUnits == null) {
      say(where, "inventoryVerified needs an expectedUnits count");
    }
    if (work.expectedUnits != null && (!Number.isInteger(work.expectedUnits) || work.expectedUnits < 0)) {
      say(where, "expectedUnits must be a whole number");
    }

    if (work.aliasOf && work.anchor) say(where, "an alias has no marker of its own");

    if (work.anchor && "event" in work.anchor) {
      const event = work.anchor.event;
      if (anchorSlugs.has(event.slug)) say(where, `duplicate anchor slug ${event.slug}`);
      anchorSlugs.add(event.slug);
      if (!CATEGORY_KEYS.has(event.category)) say(where, `unknown category ${event.category}`);
      if (!EVENT_TYPE_KEYS.has(event.eventType)) say(where, `unknown eventType ${event.eventType}`);
      if (event.claims.length === 0) say(where, "the marker has no date claims and cannot be placed");
      const texts = new Set<string>();
      for (const claim of event.claims) {
        if (texts.has(claim.originalDateText)) say(where, `duplicate originalDateText "${claim.originalDateText}"`);
        texts.add(claim.originalDateText);
        problems.push(...checkWorkClaim(where, claim));
      }
      // A MODERN TEXT PRESENTED AS ANCIENT carries both its claimed date and
      // its real one, side by side — never only the claim.
      if (work.traditionClass === "modern_claiming_ancient") {
        const roles = event.claims.map((claim) => claim.whatIsDated ?? "");
        if (!roles.some((r) => r.startsWith("Date claimed"))) say(where, "must state the date it claims");
        if (!roles.some((r) => r.startsWith("Translation or publication") || r.startsWith("Estimated composition"))) {
          say(where, "must state when it was actually written or published");
        }
      }
    } else if (work.anchor && "existingSlug" in work.anchor) {
      for (const claim of work.anchor.extraClaims ?? []) problems.push(...checkWorkClaim(where, claim));
    }

    for (const link of work.eventLinks ?? []) {
      if (!RELATION_KEYS.has(link.relation)) say(where, `unknown relation ${link.relation}`);
      if (!link.note.trim()) say(where, `link to ${link.slug} has no note`);
    }
  }

  for (const work of works) {
    if (work.aliasOf && !workKeys.has(work.aliasOf.workKey)) {
      say(work.workKey, `alias points at unknown work ${work.aliasOf.workKey}`);
    }
  }

  return problems;
}

// ---------------------------------------------------------------------------
// IMAGES
// ---------------------------------------------------------------------------

export function checkImage(where: string, image: CorpusImage, work: InventoryWork | undefined): Problem[] {
  const problems: Problem[] = [];
  const say = (problem: string) => problems.push({ where: `${where} — image ${image.key}`, problem });

  if (!/^https:\/\//.test(image.url)) say("url must be https");
  if (!/^https:\/\//.test(image.sourcePageUrl)) say("sourcePageUrl must be the https catalogue or file page");
  if (image.caption.trim().length <= 40) say("caption must say what the picture shows (over 40 characters)");
  if (!MEDIA_KEYS.has(image.shows)) say(`unknown shows ${image.shows}`);
  if (!IDENTIFICATION_KEYS.has(image.identificationStatus)) say(`unknown identificationStatus ${image.identificationStatus}`);
  if (!isImageLicenceStatus(image.licenceStatus)) say(`unknown licenceStatus ${image.licenceStatus}`);
  if (!isImageVerification(image.verificationStatus)) say(`unknown verificationStatus ${image.verificationStatus}`);
  if (!image.licence?.trim() && image.licenceStatus !== "unknown") say("a licence status needs the licence as stated");

  // UNVERIFIED images: caption and an explicit statement of what is unverified.
  if (image.identificationStatus === "unverified") {
    if (!image.caption.startsWith("UNVERIFIED —")) say("an unverified identification must begin 'UNVERIFIED —'");
    if (!image.whatIsUnverified?.trim()) say("an unverified identification must say what is unverified");
  } else if (image.caption.startsWith("UNVERIFIED")) {
    say("caption says UNVERIFIED but identificationStatus does not");
  }

  // NEVER PRESENT A MODERN TEXT'S PICTURE AS AN ANCIENT ARTEFACT. There are no
  // authenticated physical "Emerald Tablets of Thoth"; any picture on those
  // records is of something else and must not be filed as the object.
  if (work?.traditionClass === "modern_claiming_ancient" && ARTEFACT_KINDS.has(image.shows)) {
    say("a modern text presented as ancient has no artefact to photograph; file the picture as what it is");
  }
  if (image.shows === "reconstruction" && !/reconstruct/i.test(image.caption)) {
    say("a reconstruction must say so in its caption");
  }
  return problems;
}

// ---------------------------------------------------------------------------
// A CORPUS FILE
// ---------------------------------------------------------------------------

export function validateCorpus(file: TextCorpusFile, inventory: InventoryWork[]): Problem[] {
  const problems: Problem[] = [];
  const say = (where: string, problem: string) => problems.push({ where, problem });

  const work = inventory.find((w) => w.workKey === file.workKey);
  if (!work) {
    say(file.workKey, "no inventory entry for this work");
    return problems;
  }
  if (work.aliasOf) say(file.workKey, "an alias cannot carry passages of its own");
  const prefix = `${work.passagePrefix}.`;
  const knownPrefixes = inventory.map((w) => `${w.passagePrefix}.`);

  // Sources
  const sourceKeys = new Set<string>();
  for (const source of file.sources) {
    if (sourceKeys.has(source.key)) say(file.workKey, `duplicate source key ${source.key}`);
    sourceKeys.add(source.key);
    if (!SOURCE_TYPE_KEYS.has(source.sourceType)) say(file.workKey, `source ${source.key}: unknown sourceType`);
    if (!source.notes.trim()) say(file.workKey, `source ${source.key}: notes must say what it is cited for`);
  }
  const needSource = (where: string, key: string | null | undefined) => {
    if (key && !sourceKeys.has(key)) say(where, `unknown sourceKey ${key}`);
  };

  const versionKeys = new Set((file.versions ?? []).map((v) => v.key));
  const manuscriptKeys = new Set<string>();
  for (const manuscript of file.manuscripts ?? []) {
    const where = `${file.workKey} — manuscript ${manuscript.key}`;
    if (manuscriptKeys.has(manuscript.key)) say(where, "duplicate manuscript key");
    manuscriptKeys.add(manuscript.key);
    needSource(where, manuscript.sourceKey);
    if (manuscript.startYear != null && manuscript.endYear != null && manuscript.endYear < manuscript.startYear) {
      say(where, "endYear is before startYear");
    }
    if (manuscript.startYear != null && !manuscript.originalDateText?.trim()) {
      say(where, "a dated manuscript must quote the catalogue's own date wording");
    }
  }

  const imageKeys = new Set<string>();
  const allImages: CorpusImage[] = [];
  for (const image of file.images ?? []) {
    allImages.push(image);
    if (image.manuscriptKey && !manuscriptKeys.has(image.manuscriptKey)) {
      say(file.workKey, `image ${image.key}: unknown manuscriptKey ${image.manuscriptKey}`);
    }
  }

  // Passages
  const passageKeys = new Set<string>();
  for (const passage of file.passages) {
    const where = `${file.workKey} — ${passage.key}`;
    if (passageKeys.has(passage.key)) say(where, "duplicate passage key");
    if (!passage.key.startsWith(prefix)) say(where, `passage key must start with ${prefix}`);
    if (passage.parentKey && !passageKeys.has(passage.parentKey)) {
      say(where, `parent ${passage.parentKey} must appear earlier in the file`);
    }
    passageKeys.add(passage.key);
    if (!isDivisionKind(passage.divisionKind)) say(where, `unknown divisionKind ${passage.divisionKind}`);
    if (!isPassageVerification(passage.verificationStatus)) {
      say(where, `unknown verificationStatus ${passage.verificationStatus}`);
    }
    if (!passage.label.trim()) say(where, "label is empty");
    if (!passage.reference.trim()) say(where, "reference is empty — a passage must be locatable");
    if (passage.versionKey && !versionKeys.has(passage.versionKey)) say(where, `unknown versionKey ${passage.versionKey}`);
    needSource(where, passage.sourceKey);

    const layerKeys = new Set<string>();
    for (const layer of passage.layers) {
      const at = `${where} — layer ${layer.key}`;
      if (layerKeys.has(layer.key)) say(at, "duplicate layer key");
      layerKeys.add(layer.key);
      if (!LAYER_KEYS.has(layer.layer)) say(at, `unknown layer ${layer.layer}`);
      if (!isLayerLicence(layer.licence)) say(at, `unknown licence ${layer.licence}`);
      if (layer.content == null && !layer.contentAbsentReason?.trim()) say(at, "no content and no reason");
      if (layer.content != null && !layer.content.trim()) say(at, "content is blank");
      if (!layer.evidence.trim()) say(at, "evidence is empty");
      if (CONFIDENCE_SCORE.test(layer.evidence)) say(at, "evidence states a confidence score");
      if (layer.viewpoint && !VIEWPOINT_KEYS.has(layer.viewpoint)) say(at, `unknown viewpoint ${layer.viewpoint}`);
      needSource(at, layer.sourceKey);

      // COPYRIGHT. Short quotation or nothing.
      if (layer.licence === "copyrighted_reference" && layer.content != null) {
        say(at, "a reference-only layer must not carry text");
      }
      if (layer.licence === "copyrighted_excerpt" && (layer.content?.length ?? 0) > COPYRIGHT_EXCERPT_MAX_CHARS) {
        say(at, `a copyrighted excerpt is limited to ${COPYRIGHT_EXCERPT_MAX_CHARS} characters`);
      }
      // A translation or interpretation must name who made it.
      if ((layer.layer === "translation" || layer.layer === "interpretation") && !layer.sourceKey) {
        say(at, "a translation or interpretation must name its source");
      }
    }

    for (const witness of passage.witnesses ?? []) {
      if (!manuscriptKeys.has(witness.manuscriptKey)) say(where, `unknown witness ${witness.manuscriptKey}`);
    }
    for (const date of passage.dates ?? []) {
      const at = `${where} — date ${date.key}`;
      if (!isPassageDateRole(date.role)) say(at, `unknown role ${date.role}`);
      if (!DATE_PRECISIONS.has(date.datePrecision)) say(at, `unknown datePrecision ${date.datePrecision}`);
      if (date.startYear != null && date.endYear != null && date.endYear < date.startYear) say(at, "range reversed");
      if (!date.evidence.trim() || CONFIDENCE_SCORE.test(date.evidence)) say(at, "evidence missing or scored");
      if (
        date.startYear != null &&
        date.startYear < 1000 &&
        date.isApproximate &&
        FINE_PRECISIONS.has(date.datePrecision)
      ) {
        say(at, "an approximate pre-1000 CE date must not claim year, month or day precision");
      }
      needSource(at, date.sourceKey);
    }
    for (const image of passage.images ?? []) allImages.push(image);
    for (const theme of passage.themes ?? []) {
      if (!isArchiveTheme(theme.themeKey)) say(where, `unknown theme ${theme.themeKey}`);
      if (!theme.note.trim()) say(where, `theme ${theme.themeKey} needs a note saying why`);
    }
  }

  for (const image of allImages) {
    if (imageKeys.has(image.key)) say(file.workKey, `duplicate image key ${image.key}`);
    imageKeys.add(image.key);
    problems.push(...checkImage(file.workKey, image, work));
  }
  for (const image of allImages) {
    if (image.duplicateOf && !imageKeys.has(image.duplicateOf)) {
      say(file.workKey, `image ${image.key}: duplicateOf ${image.duplicateOf} is not in this file`);
    }
  }

  // Connections
  const linkKeys = new Set<string>();
  for (const link of file.links ?? []) {
    const where = `${file.workKey} — link ${link.key}`;
    if (linkKeys.has(link.key)) say(where, "duplicate link key");
    linkKeys.add(link.key);
    if (link.from === link.to) say(where, "a passage cannot be connected to itself");
    for (const end of [link.from, link.to]) {
      if (!knownPrefixes.some((p) => end.startsWith(p))) say(where, `${end} belongs to no inventoried work`);
    }
    if (!link.from.startsWith(prefix) && !link.to.startsWith(prefix)) {
      say(where, "a connection must have one end in the work whose file carries it");
    }
    if (!isConnectionClass(link.connectionClass)) say(where, `unknown connectionClass ${link.connectionClass}`);
    if (!isComparability(link.wordingComparable)) say(where, "unknown wordingComparable");
    if (!isComparability(link.meaningComparable)) say(where, "unknown meaningComparable");
    if (!isLinkReviewStatus(link.reviewStatus)) say(where, "unknown reviewStatus");
    if (!link.similarities.trim() || !link.differences.trim() || !link.transmissionEvidence.trim()) {
      say(where, "similarities, differences and transmissionEvidence are all required");
    }
    if (CONFIDENCE_SCORE.test(link.similarities) || CONFIDENCE_SCORE.test(link.transmissionEvidence)) {
      say(where, "a connection is argued, never scored");
    }
    // A DIRECT PARALLEL CLAIMS THE WORDING CORRESPONDS. It may not say otherwise.
    if (link.connectionClass === "direct_textual_parallel" && link.wordingComparable === "no") {
      say(where, "a direct textual parallel cannot have non-comparable wording");
    }
    needSource(where, link.sourceKey);
  }

  return problems;
}

/** Problems as one readable block, for a test failure or an import refusal. */
export function formatProblems(problems: Problem[]): string {
  return problems.map((p) => `${p.where}: ${p.problem}`).join("\n");
}
