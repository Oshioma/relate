// THE TEXT ARCHIVE'S VOCABULARIES.
//
// Kept apart from ../taxonomy.ts because these words belong to the archive —
// works, passages, manuscripts and the connections between them — and that
// file is already the dictionary for everything else on the timeline. The
// same rules apply here as there: a key says what KIND of thing something is,
// never how good it is, and nothing here is a score.

type Term = { key: string; label: string; hint: string };

function lookup(list: readonly Term[]) {
  const byKey = new Map(list.map((term) => [term.key, term]));
  return {
    has: (key: string | null | undefined) => byKey.has(key ?? ""),
    label: (key: string | null | undefined) => byKey.get(key ?? "")?.label ?? key ?? "",
    hint: (key: string | null | undefined) => byKey.get(key ?? "")?.hint ?? "",
  };
}

// ---------------------------------------------------------------------------
// CORPUS GROUPS — the shelves of the library, in the order a reader walks them.
// ---------------------------------------------------------------------------

export const CORPUS_GROUPS = [
  {
    key: "egyptian",
    label: "Ancient Egyptian writings",
    hint: "Funerary, netherworld, wisdom and temple texts from Old Kingdom pyramids to Demotic papyri.",
  },
  {
    key: "greek_hermetic",
    label: "Greek and Hermetic writings",
    hint: "Plato's Atlantis dialogues and the Greek, Latin and Coptic Hermetica of Roman Egypt.",
  },
  {
    key: "gnostic",
    label: "Gnostic and related texts",
    hint: "Coptic codices from Nag Hammadi and elsewhere, and the ancient writers who described the same systems.",
  },
  {
    key: "arabic_medieval",
    label: "Arabic and medieval Hermetic texts",
    hint: "The historical Emerald Tablet, the Secret of Creation, the Secret of Secrets and the commentaries on them.",
  },
  {
    key: "modern_esoteric",
    label: "Modern esoteric texts",
    hint: "Nineteenth- and twentieth-century writers who drew on, reinterpreted or claimed these traditions.",
  },
] as const satisfies readonly Term[];

export type CorpusGroup = (typeof CORPUS_GROUPS)[number]["key"];
const corpusGroups = lookup(CORPUS_GROUPS);
export const isCorpusGroup = corpusGroups.has;
export const corpusGroupLabel = corpusGroups.label;
export const corpusGroupHint = corpusGroups.hint;

// ---------------------------------------------------------------------------
// TRADITION CLASSES — how a work stands in time.
//
// THE CLASSIFICATION THIS ARCHIVE MOST NEEDS TO GET RIGHT. A book published in
// Colorado in the 1930s that presents itself as the translation of Atlantean
// tablets is a modern text making an ancient claim. Filing it beside the
// Pyramid Texts as though both were "ancient writings" is the single most
// misleading thing this library could do, and the validator refuses it.
// ---------------------------------------------------------------------------

export const TEXT_TRADITION_CLASSES = [
  {
    key: "ancient_primary",
    label: "Ancient text, surviving in ancient witnesses",
    hint: "Composed in antiquity and preserved on objects or manuscripts made in antiquity.",
  },
  {
    key: "ancient_late_transmission",
    label: "Ancient text, surviving only in later copies",
    hint:
      "Composed in antiquity but known only from medieval or later manuscripts — Plato and the Corpus Hermeticum are known from Byzantine copies a thousand years after composition.",
  },
  {
    key: "medieval",
    label: "Medieval text",
    hint: "Composed in the medieval Islamic or Latin worlds, even where it claims an ancient author.",
  },
  {
    key: "early_modern",
    label: "Early modern text",
    hint: "Printed editions, commentaries and translations of the sixteenth to eighteenth centuries.",
  },
  {
    key: "modern_claiming_ancient",
    label: "Modern text presented as ancient",
    hint:
      "Written in the nineteenth or twentieth century and presented by its author as the translation or record of an ancient source that has not been produced for examination.",
  },
  {
    key: "modern",
    label: "Modern text",
    hint: "Written in the nineteenth century or later, presented as the author's own work or interpretation.",
  },
] as const satisfies readonly Term[];

const traditionClasses = lookup(TEXT_TRADITION_CLASSES);
export const isTraditionClass = traditionClasses.has;
export const traditionClassLabel = traditionClasses.label;
export const traditionClassHint = traditionClasses.hint;

/** Is this class a modern composition, whatever it claims about itself? */
export function traditionIsModern(key: string | null | undefined): boolean {
  return key === "modern" || key === "modern_claiming_ancient";
}

// ---------------------------------------------------------------------------
// COMPLETENESS — never "done" on the strength of an import alone.
// ---------------------------------------------------------------------------

export const TEXT_COMPLETENESS_STATUSES = [
  {
    key: "not_started",
    label: "Not yet imported",
    hint: "The work is in the inventory and on the timeline; none of its passages is in the archive yet.",
  },
  {
    key: "inventory_documented",
    label: "Inventory documented",
    hint: "Its structure — how many utterances, spells or sections, on which edition's numbering — has been written down.",
  },
  {
    key: "partial",
    label: "Partly imported",
    hint: "Some passages are in the archive. The manifest says exactly which are missing.",
  },
  {
    key: "imported_unverified",
    label: "Imported, not yet verified",
    hint: "Every expected passage is present, but not every passage has been checked against the edition.",
  },
  {
    key: "verified_against_edition",
    label: "Complete — verified against the edition",
    hint:
      "Every expected passage is present and checked, AND the expected count itself has been checked against a reliable edition or catalogue. The only status that may be called complete.",
  },
] as const satisfies readonly Term[];

const completeness = lookup(TEXT_COMPLETENESS_STATUSES);
export const isCompletenessStatus = completeness.has;
export const completenessLabel = completeness.label;
export const completenessHint = completeness.hint;

// ---------------------------------------------------------------------------
// DIVISIONS — what a numbered unit of this text is called.
// ---------------------------------------------------------------------------

export const TEXT_DIVISION_KINDS = [
  { key: "book", label: "Book", hint: "A major division of a long work." },
  { key: "part", label: "Part", hint: "A modern editor's grouping." },
  { key: "treatise", label: "Treatise", hint: "One self-contained work within a collection — a Corpus Hermeticum tractate." },
  { key: "tractate", label: "Tractate", hint: "One work within a Nag Hammadi codex." },
  { key: "chapter", label: "Chapter", hint: "A numbered chapter." },
  { key: "spell", label: "Spell", hint: "A Coffin Text or Book of the Dead spell." },
  { key: "utterance", label: "Utterance", hint: "A Pyramid Text utterance in Sethe's numbering." },
  { key: "paragraph", label: "Paragraph", hint: "A numbered paragraph (§) of an edition." },
  { key: "hour", label: "Hour", hint: "One hour of the night in a netherworld book." },
  { key: "register", label: "Register", hint: "One horizontal band of a netherworld book's hour." },
  { key: "scene", label: "Scene", hint: "A scene with its captions." },
  { key: "gate", label: "Gate", hint: "A gate of the Book of Gates." },
  { key: "maxim", label: "Maxim", hint: "One maxim of a wisdom instruction." },
  { key: "page", label: "Page", hint: "A page of a standard reference edition — a Stephanus page of Plato." },
  { key: "section", label: "Section", hint: "A numbered section within a chapter, treatise or page." },
  { key: "fragment", label: "Fragment", hint: "A surviving fragment, numbered by its editor." },
  { key: "line", label: "Line", hint: "A line or group of lines of a short text." },
  { key: "tablet", label: "Tablet", hint: "One of Doreal's fifteen 'tablets' — a chapter of a modern book." },
  { key: "version", label: "Version", hint: "One whole version of a short text, kept apart from the others." },
] as const satisfies readonly Term[];

const divisions = lookup(TEXT_DIVISION_KINDS);
export const isDivisionKind = divisions.has;
export const divisionKindLabel = divisions.label;

// ---------------------------------------------------------------------------
// PASSAGE VERIFICATION — has a person checked THIS passage?
// ---------------------------------------------------------------------------

export const PASSAGE_VERIFICATION_STATUSES = [
  {
    key: "unverified",
    label: "Not yet checked",
    hint: "Imported from the named source and not yet checked against it by a person.",
  },
  {
    key: "structure_verified",
    label: "Numbering checked",
    hint: "The passage's place in the work has been checked against the edition's own numbering; the wording has not been proof-read.",
  },
  {
    key: "text_verified",
    label: "Text checked",
    hint: "The wording of every layer with text has been compared with the printed edition or page image.",
  },
] as const satisfies readonly Term[];

const verification = lookup(PASSAGE_VERIFICATION_STATUSES);
export const isPassageVerification = verification.has;
export const passageVerificationLabel = verification.label;
export const passageVerificationHint = verification.hint;

// ---------------------------------------------------------------------------
// THE FIVE CHRONOLOGICAL CONCEPTS — kept separate, never merged into one date.
//
// Stored as date claims on the work's timeline event (what_is_dated carries
// the label), and as passage_date rows where a single passage has its own.
// ---------------------------------------------------------------------------

export const PASSAGE_DATE_ROLES = [
  {
    key: "event_described",
    label: "Date of the event described",
    hint: "When the text says its story happened — Plato's Atlantis, '9,000 years' before Solon. A claim the text makes, not a date anyone has established.",
  },
  {
    key: "claimed",
    label: "Date claimed by the author or tradition",
    hint: "When the author or later tradition says the text itself was written or revealed. Often far earlier than any evidence.",
  },
  {
    key: "composition",
    label: "Estimated composition",
    hint: "When scholars estimate the text was composed, and on what grounds.",
  },
  {
    key: "earliest_evidence",
    label: "Earliest surviving physical evidence",
    hint: "The oldest surviving object that carries the text. The text is at least this old; it may be much older.",
  },
  {
    key: "manuscript",
    label: "Date of a specific manuscript",
    hint: "When one particular witness was made.",
  },
  {
    key: "translation_publication",
    label: "Translation or publication",
    hint: "When a translation, edition or modern book was published.",
  },
] as const satisfies readonly Term[];

const dateRoles = lookup(PASSAGE_DATE_ROLES);
export const isPassageDateRole = dateRoles.has;
export const passageDateRoleLabel = dateRoles.label;
export const passageDateRoleHint = dateRoles.hint;

/**
 * The what_is_dated wording used on a work's timeline claims, so that the
 * reader can sort a work's dates back into the five concepts.
 */
export function whatIsDatedFor(role: string): string {
  return passageDateRoleLabel(role);
}

/** Which of the five concepts a stored what_is_dated text belongs to, if any. */
export function dateRoleFromWhatIsDated(text: string | null | undefined): string | null {
  if (!text) return null;
  const match = PASSAGE_DATE_ROLES.find((role) => text.startsWith(role.label));
  return match?.key ?? null;
}

// ---------------------------------------------------------------------------
// CONNECTION CLASSES — the eight kinds of relationship between two passages.
//
// `documented` decides how a connection is drawn: solid for relationships the
// evidence establishes, dashed for resemblance a reader is being shown so they
// can judge it. The order runs from strongest evidence to weakest.
// ---------------------------------------------------------------------------

export const PASSAGE_CONNECTION_CLASSES = [
  {
    key: "direct_textual_parallel",
    label: "Direct textual parallel",
    documented: true,
    hint: "The wording itself corresponds, line for line or phrase for phrase — the same spell in two corpora.",
  },
  {
    key: "documented_transmission",
    label: "Documented transmission",
    documented: true,
    hint: "There is evidence one text reached the other — a translation, a quotation, a named source, a manuscript chain.",
  },
  {
    key: "later_reinterpretation",
    label: "Later reinterpretation",
    documented: true,
    hint: "The later text knowingly takes up the earlier one and gives it a new meaning.",
  },
  {
    key: "contradiction",
    label: "Contradiction",
    documented: true,
    hint: "The later text says something incompatible with the earlier one it is compared with.",
  },
  {
    key: "close_conceptual_parallel",
    label: "Close conceptual parallel",
    documented: false,
    hint: "The same specific idea in different words, with no evidence that one text knew the other.",
  },
  {
    key: "symbolic_similarity",
    label: "Symbolic similarity",
    documented: false,
    hint: "The same symbol or image is used, possibly with different meanings.",
  },
  {
    key: "broad_thematic_resemblance",
    label: "Broad thematic resemblance",
    documented: false,
    hint: "Both texts are about the same large subject. Common across religions and weak on its own.",
  },
  {
    key: "speculative_connection",
    label: "Speculative connection",
    documented: false,
    hint: "A connection proposed by someone and not supported by evidence a reader can check. Shown so it can be judged, not because it is established.",
  },
] as const satisfies readonly (Term & { documented: boolean })[];

const connectionClasses = lookup(PASSAGE_CONNECTION_CLASSES);
export const isConnectionClass = connectionClasses.has;
export const connectionClassLabel = connectionClasses.label;
export const connectionClassHint = connectionClasses.hint;

/** Drawn solid (true) or dashed (false). */
export function connectionIsDocumented(key: string | null | undefined): boolean {
  return PASSAGE_CONNECTION_CLASSES.find((c) => c.key === key)?.documented ?? false;
}

/** Sort order: strongest evidence first. */
export function connectionClassOrder(key: string | null | undefined): number {
  const index = PASSAGE_CONNECTION_CLASSES.findIndex((c) => c.key === key);
  return index === -1 ? PASSAGE_CONNECTION_CLASSES.length : index;
}

export const COMPARABILITY = [
  { key: "yes", label: "Yes", hint: "Comparable." },
  { key: "partly", label: "Partly", hint: "Comparable in some respects and not in others." },
  { key: "no", label: "No", hint: "Not comparable." },
  { key: "unknown", label: "Not established", hint: "Nobody has shown either way." },
] as const satisfies readonly Term[];

const comparability = lookup(COMPARABILITY);
export const isComparability = comparability.has;
export const comparabilityLabel = comparability.label;

export const LINK_REVIEW_STATUSES = [
  { key: "proposed", label: "Proposed", hint: "Written up, not yet checked by a second person against both passages." },
  { key: "reviewed", label: "Reviewed", hint: "Both passages and the argument have been checked." },
] as const satisfies readonly Term[];

const reviewStatuses = lookup(LINK_REVIEW_STATUSES);
export const isLinkReviewStatus = reviewStatuses.has;
export const linkReviewStatusLabel = reviewStatuses.label;

// ---------------------------------------------------------------------------
// IMAGE LICENCES — what may be done with a picture.
// ---------------------------------------------------------------------------

export const IMAGE_LICENCE_STATUSES = [
  { key: "open", label: "Public domain or CC0", hint: "No restriction on reuse." },
  { key: "attribution", label: "Attribution required", hint: "CC BY or equivalent: reuse with credit." },
  { key: "share_alike", label: "Attribution and share-alike", hint: "CC BY-SA or equivalent." },
  {
    key: "non_commercial",
    label: "Non-commercial only",
    hint: "CC BY-NC or an institution's non-commercial terms. Linked to the institution rather than copied, until the owner decides otherwise.",
  },
  { key: "restricted", label: "Restricted", hint: "Permission needed. Linked to the institution, never copied." },
  { key: "unknown", label: "Not established", hint: "The licence has not been checked. Treated as restricted." },
] as const satisfies readonly Term[];

const licences = lookup(IMAGE_LICENCE_STATUSES);
export const isImageLicenceStatus = licences.has;
export const imageLicenceLabel = licences.label;
export const imageLicenceHint = licences.hint;

/** May the archive copy this image into its own storage? */
export function licenceAllowsCopy(key: string | null | undefined): boolean {
  return key === "open" || key === "attribution" || key === "share_alike";
}

export const IMAGE_VERIFICATION_STATUSES = [
  { key: "unverified", label: "Not yet checked", hint: "The attribution has not been checked against the institution's record." },
  { key: "verified", label: "Checked", hint: "Object, institution, accession number and licence checked against the holding institution's record." },
] as const satisfies readonly Term[];

const imageVerification = lookup(IMAGE_VERIFICATION_STATUSES);
export const isImageVerification = imageVerification.has;
export const imageVerificationLabel = imageVerification.label;

// ---------------------------------------------------------------------------
// LAYER LICENCES — what may be reproduced of one rendering.
// ---------------------------------------------------------------------------

export const LAYER_LICENCES = [
  { key: "public_domain", label: "Public domain", hint: "May be reproduced in full." },
  { key: "public_domain_us", label: "Public domain in the US", hint: "Out of copyright in the United States, where this site is hosted; may still be in copyright elsewhere." },
  { key: "cc_by_sa", label: "CC BY-SA", hint: "Openly licensed with attribution and share-alike." },
  { key: "original_work", label: "Written for this archive", hint: "A summary or analysis written for this archive." },
  {
    key: "copyrighted_excerpt",
    label: "In copyright — short quotation only",
    hint: "In copyright. Quoted briefly for comment and comparison, with a link to an authorised edition.",
  },
  { key: "copyrighted_reference", label: "In copyright — reference only", hint: "In copyright. Cited, not quoted." },
] as const satisfies readonly Term[];

const layerLicences = lookup(LAYER_LICENCES);
export const isLayerLicence = layerLicences.has;
export const layerLicenceLabel = layerLicences.label;

/** The longest quotation a copyrighted layer may carry, in characters. */
export const COPYRIGHT_EXCERPT_MAX_CHARS = 400;

// ---------------------------------------------------------------------------
// THEMES — navigation, not proof.
//
// A theme collects passages a reader may want to see together. Two passages
// under "Seven planetary spheres" are not thereby shown to share a doctrine;
// what they share, if anything, is argued in a passage connection.
// ---------------------------------------------------------------------------

export const ARCHIVE_THEMES = [
  { key: "seven-cosmic-rulers", label: "Seven cosmic rulers", hint: "Seven governors, archons or lords set over the world." },
  { key: "creation", label: "Creation", hint: "How the world came to be." },
  { key: "sun-and-moon", label: "The Sun and Moon", hint: "The two lights, as gods, symbols or parents." },
  { key: "seven-planetary-spheres", label: "Seven planetary spheres", hint: "The planets as concentric spheres the soul passes through." },
  { key: "sacred-numbers", label: "Sacred numbers", hint: "Numbers given religious or cosmic meaning." },
  { key: "cosmic-cycles", label: "Cosmic cycles", hint: "Ages, great years and recurring destructions." },
  { key: "time-and-eternity", label: "Time and eternity", hint: "Aion, neheh and djet, eternity against time." },
  { key: "divine-knowledge", label: "Divine knowledge", hint: "Gnosis, revealed wisdom and secret knowledge." },
  { key: "thoth-and-hermes", label: "Thoth and Hermes", hint: "The Egyptian god of writing and his Greek identification." },
  { key: "atlantis", label: "Atlantis", hint: "Plato's island and what later writers made of it." },
  { key: "underworld", label: "The underworld", hint: "The Duat and other worlds of the dead." },
  { key: "amenti", label: "Amenti", hint: "Amentet, 'the West', and Doreal's Halls of Amenti." },
  { key: "death-and-rebirth", label: "Death and rebirth", hint: "Dying and coming back to life." },
  { key: "immortality", label: "Immortality", hint: "Life that does not end." },
  { key: "sacred-geometry", label: "Sacred geometry", hint: "Geometry given cosmic meaning." },
  { key: "ascension", label: "Ascension", hint: "The ascent of the king, the soul or the initiate to the sky." },
  { key: "the-soul", label: "The soul", hint: "Ba, ka, psyche, nous and their relation." },
  { key: "reincarnation", label: "Reincarnation", hint: "Return of the soul into another body." },
  { key: "magic-and-sacred-words", label: "Magic and sacred words", hint: "Heka, names of power and effective speech." },
  { key: "above-and-below", label: "Above and below", hint: "Correspondence between heaven and earth." },
  { key: "cosmic-law", label: "Cosmic law", hint: "Ma'at, order and the law of the cosmos." },
  { key: "fate-and-free-will", label: "Fate and free will", hint: "Heimarmene, destiny and escape from it." },
  { key: "hidden-chambers", label: "Hidden chambers", hint: "Secret rooms, sealed books and hidden records." },
  { key: "initiation", label: "Initiation", hint: "Admission to a mystery through ordeal or teaching." },
  { key: "transformation", label: "Transformation", hint: "Changing form — the dead into gods, metals into gold." },
  { key: "consciousness", label: "Consciousness", hint: "Mind, awareness and states of being awake." },
] as const satisfies readonly Term[];

const themes = lookup(ARCHIVE_THEMES);
export const isArchiveTheme = themes.has;
export const archiveThemeLabel = themes.label;
export const archiveThemeHint = themes.hint;
