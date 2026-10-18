// THE HISTORICAL EMERALD TABLET, VERSION BY VERSION.
//
// The Tablet survives in several distinct versions, and they are kept whole
// and separate, never merged into one "real" text: the Arabic of the Book of
// the Secret of Creation, the Latin of the Secret of Secrets, the Latin
// vulgate, and Newton's English of the vulgate. Each version is a passage of
// division 'version'; each of its lines is a passage beneath it, numbered as
// the edition sets it out, so a reader can put line 2 of one version beside
// line 2 of another — and see where the versions stop lining up.
//
// NOT HERE: Doreal's "Emerald Tablets of Thoth" (1930s), a different, modern
// book that borrows the name. It has its own record (modern.doreal-emerald-tablets).
//
// Line texts are taken from the editions named on each layer, as quoted in the
// English Wikipedia article "Emerald Tablet" (checked 16 October 2026). They
// are marked unverified until checked against scans of the editions.

import type { SeedSource } from "../../seed-types";
import type { CorpusImage, CorpusLayer, CorpusLink, CorpusManuscript, CorpusPassage, TextCorpusFile } from "../corpus-types";
import { INVENTORY_SOURCES } from "../inventory";

const SOURCES: SeedSource[] = [
  ...INVENTORY_SOURCES.filter((s) => ["ruska-tabula", "holmyard-1923", "steele-secretum"].includes(s.key)),
  {
    key: "weisser-sirr",
    title: "Buch über das Geheimnis der Schöpfung und die Darstellung der Natur (Buch der Ursachen) von Pseudo-Apollonios von Tyana",
    author: "Ursula Weisser (ed.)",
    publisher: "Institute for the History of Arabic-Islamic Science, Aleppo",
    publishedYear: 1979,
    sourceType: "primary",
    notes: "Critical edition of the Arabic Kitāb sirr al-khalīqa. In copyright: the Arabic lines here are short quotations from it, pp. 524–525.",
  },
  {
    key: "steele-singer-1928",
    title: "The Emerald Table",
    author: "Robert Steele and Dorothea Waley Singer",
    publisher: "Proceedings of the Royal Society of Medicine 21, 41–57 / 485–501",
    publishedYear: 1928,
    url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2101974/",
    sourceType: "academic_paper",
    notes: "Edition of the Latin vulgate from the manuscripts, with an English translation. Published before 1929, so public domain in the United States.",
  },
  {
    key: "newton-keynes-28",
    title: "Keynes MS 28: Isaac Newton's translation and commentary on the Emerald Tablet",
    author: "Isaac Newton",
    publisher: "King's College, Cambridge",
    url: "https://www.newtonproject.ox.ac.uk/view/texts/normalized/ALCH00017",
    sourceType: "historical_document",
    notes: "Newton's own English translation of the Latin vulgate, written in the 1680s; public domain. Quoted in modernised spelling.",
  },
  {
    key: "wikipedia-emerald-tablet",
    title: "Emerald Tablet",
    author: "Wikipedia contributors",
    publisher: "Wikipedia",
    url: "https://en.wikipedia.org/wiki/Emerald_Tablet",
    sourceType: "website",
    notes: "Openly licensed (CC BY-SA 4.0) literal English translation of the Arabic Secret of Creation version, made by Wikipedia editors from Weisser's edition.",
  },
];

const MANUSCRIPTS: CorpusManuscript[] = [
  {
    key: "paris-arabe-2300",
    name: "Paris, Bibliothèque nationale de France, Arabe 2300 (Kitāb sirr al-khalīqa)",
    objectKind: "codex",
    holdingInstitution: "Bibliothèque nationale de France",
    accessionNumber: "Arabe 2300",
    isApproximate: true,
    catalogueUrl: "https://gallica.bnf.fr/ark:/12148/btv1b11001673r/f141.item",
    notes: "A witness of the younger recension B of the Secret of Creation. The Tablet appears at f. 141 of the Gallica digitisation. Its date has not been recorded here.",
  },
  {
    key: "majles-14456",
    name: "Tehran, Majles Library, MS 14456 (IR1526)",
    objectKind: "codex",
    holdingInstitution: "Library of the Islamic Consultative Assembly (Majles), Tehran",
    accessionNumber: "14456 / IR1526",
    startYear: 1800,
    endYear: 1899,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "nineteenth century",
    datingEvidence: "As described on Wikimedia Commons; not checked against the library's catalogue.",
    notes: "A late copy of the Secret of Creation with the Tablet and part of its frame story.",
  },
  {
    key: "christ-church-99",
    name: "Oxford, Christ Church, MS 99 (Secretum secretorum)",
    objectKind: "codex",
    holdingInstitution: "Christ Church, Oxford (digitised by the Bodleian Libraries)",
    accessionNumber: "MS 99",
    startYear: 1290,
    endYear: 1320,
    datePrecision: "decade",
    isApproximate: true,
    originalDateText: "c. 1290–1320",
    datingEvidence: "As given with the image on Wikimedia Commons and Digital Bodleian.",
    catalogueUrl: "https://digital.bodleian.ox.ac.uk/objects/34eea5fd-a8c2-48ef-9844-e91dfff62078/",
  },
  {
    key: "arundel-164",
    name: "London, British Library, Arundel MS 164",
    objectKind: "codex",
    holdingInstitution: "British Library",
    accessionNumber: "Arundel MS 164",
    startYear: 1400,
    endYear: 1499,
    datePrecision: "century",
    isApproximate: true,
    originalDateText: "fifteenth century",
    datingEvidence: "As given with the image on Wikimedia Commons; not checked against the British Library catalogue.",
    notes: "Contains the vulgate Latin Tablet at f. 155r.",
  },
];

/** With `passageKey` an image sits on that version; without, on the work. */
type Placed = CorpusImage & { manuscriptKey?: string; passageKey?: string };

const IMAGES: Placed[] = [
  {
    key: "paris-arabe-2300-tablet",
    manuscriptKey: "paris-arabe-2300",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f7/Cropped_Text_of_Sirr_al_Khaliqe_Emerald_Tablet.png",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Cropped_Text_of_Sirr_al_Khaliqe_Emerald_Tablet.png",
    institution: "Bibliothèque nationale de France",
    accessionNumber: "Arabe 2300, f. 141 (Gallica)",
    caption:
      "The Arabic text of the Emerald Tablet as it appears in a Paris manuscript of the Book of the Secret of Creation (recension B), cropped from the Bibliothèque nationale's digitisation.",
    credit: "Bibliothèque nationale de France (Gallica), via Wikimedia Commons",
    licence: "Public domain",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "majles-14456-tablet",
    manuscriptKey: "majles-14456",
    url: "https://upload.wikimedia.org/wikipedia/commons/c/c3/Emerald_Tablet_Majles_Library_MS_14456%3BIR1526.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Emerald_Tablet_Majles_Library_MS_14456;IR1526.jpg",
    institution: "Majles Library, Tehran",
    accessionNumber: "MS 14456 / IR1526",
    objectDate: "Nineteenth century",
    caption:
      "A nineteenth-century Persian copy of the Book of the Secret of Creation, showing the Arabic Emerald Tablet and part of the story of its discovery beneath the statue of Hermes.",
    credit: "Majles Library, via Wikimedia Commons",
    licence: "Public domain",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "christ-church-99-tablet",
    manuscriptKey: "christ-church-99",
    url: "https://upload.wikimedia.org/wikipedia/commons/e/ea/Tabula_ex_Secretum_Secretorum.png",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Tabula_ex_Secretum_Secretorum.png",
    institution: "Christ Church, Oxford",
    accessionNumber: "MS 99",
    objectDate: "c. 1290–1320",
    caption:
      "The Latin Emerald Tablet in the Secret of Secrets (Secretum secretorum), from an Oxford manuscript of about 1290–1320. This is the version Philip of Tripoli translated from the Arabic.",
    credit: "Christ Church, Oxford / Digital Bodleian, via Wikimedia Commons",
    licence: "Public domain",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "arundel-164-f155r",
    manuscriptKey: "arundel-164",
    url: "https://upload.wikimedia.org/wikipedia/commons/f/f6/Emerald_Tablet_British_Library_Arundel_MS_164_fol_155r_cropped.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Emerald_Tablet_British_Library_Arundel_MS_164_fol_155r_cropped.jpg",
    institution: "British Library",
    accessionNumber: "Arundel MS 164, f. 155r",
    objectDate: "Fifteenth century",
    imageDate: "2023",
    caption: "The vulgate Latin text of the Emerald Tablet on folio 155r of a fifteenth-century British Library manuscript, Arundel MS 164.",
    creator: "Photograph: Wikimedia Commons user Paracelsus1493",
    credit: "British Library; photograph by Paracelsus1493, CC BY 4.0",
    licence: "CC BY 4.0",
    licenceStatus: "attribution",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "paris-arabe-2300-tablet-full-page",
    manuscriptKey: "paris-arabe-2300",
    duplicateOf: "paris-arabe-2300-tablet",
    url: "https://upload.wikimedia.org/wikipedia/commons/2/29/Biblioth%C3%A8que_nationale_de_France._D%C3%A9partement_des_Manuscrits._Arabe_2300_fol._149.png",
    sourcePageUrl:
      "https://commons.wikimedia.org/wiki/File:Biblioth%C3%A8que_nationale_de_France._D%C3%A9partement_des_Manuscrits._Arabe_2300_fol._149.png",
    institution: "Bibliothèque nationale de France",
    accessionNumber: "Arabe 2300 (Gallica view f141; the file name says fol. 149)",
    caption:
      "The whole page of the Paris manuscript of the Book of the Secret of Creation on which the Arabic Emerald Tablet stands, with the surrounding frame story in which Balinus speaks. Uncropped: probably the same Gallica image (view f141) from which the cropped view of the Tablet was cut.",
    credit: "Bibliothèque nationale de France (Gallica), via Wikimedia Commons",
    licence: "Public domain (PD-US-expired, PD-old-70)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "leipzig-vollers-832-tablet",
    passageKey: "arab.tab.arabic",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/3f/Leipzig_tablet_text.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Leipzig_tablet_text.jpg",
    institution: "Universitätsbibliothek Leipzig (Refaiya collection)",
    accessionNumber: "Vollers 832, final folio",
    caption:
      "The Arabic Emerald Tablet in a Leipzig manuscript; its first line has the words 'truth, without doubt'. The Commons record identifies it as the final folio of Vollers 832 and as the older recension A, which would make it a second recension beside the Paris copy; neither point has been checked here, and the date the record gives is unexplained, so none is stated.",
    creator: "Unknown scribe",
    credit: "Universitätsbibliothek Leipzig (via Qalamos), via Wikimedia Commons",
    licence: "Public domain (PD-US-expired, PD-old-70)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "probable",
    verificationStatus: "unverified",
  },
  {
    key: "ibn-umayl-topkapi-sage-tablet",
    passageKey: "arab.tab.arabic",
    url: "https://upload.wikimedia.org/wikipedia/commons/b/b2/Ibn_Umayl_Hermes_Crop.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Ibn_Umayl_Hermes_Crop.jpg",
    institution: "Topkapı Palace Museum Library, Istanbul",
    accessionNumber: "Ahmet III 2075",
    objectDate: "1339 (739 AH), per the Commons record",
    caption:
      "A seated sage holding a tablet painted with suns, moons and two birds, from a fourteenth-century copy of Ibn Umayl's alchemical Book of the Silvery Water and the Starry Earth. Ibn Umayl describes a statue of a sage, later identified as Hermes, holding a tablet of ancient knowledge. Related context: this is not the Emerald Tablet's text.",
    creator: "Unknown painter",
    credit: "Topkapı Palace Museum Library, via Wikimedia Commons",
    licence: "Public domain (PD-US-expired, PD-old-70)",
    licenceStatus: "open",
    shows: "later_artwork",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "bodleian-canon-class-lat-135-secretum",
    passageKey: "arab.tab.secretum",
    url: "https://upload.wikimedia.org/wikipedia/commons/3/37/Bodleian_Library_MS._Canon._Class._Lat._135_-_Philip_of_Tripoli.png",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Bodleian_Library_MS._Canon._Class._Lat._135_-_Philip_of_Tripoli.png",
    institution: "Bodleian Library, Oxford",
    accessionNumber: "MS. Canon. Class. Lat. 135",
    objectDate: "c. 1400–1405",
    caption:
      "The opening of Philip of Tripoli's Latin Secret of Secrets in a north Italian manuscript of about 1400–1405: his dedication to Guido de Valencia, bishop of Tripoli, beneath a decorated initial with a teaching figure. Related evidence: the book that carries this version of the Tablet, not the page with the Tablet on it.",
    creator: "Unknown scribe and illuminator",
    credit: "Bodleian Libraries, University of Oxford, via Wikimedia Commons",
    licence: "Public domain (PD-Art)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "nlm-sirr-al-asrar-1848-onomancy",
    passageKey: "arab.tab.secretum",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/d8/Secret_of_secrets_a.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Secret_of_secrets_a.jpg",
    institution: "US National Library of Medicine",
    objectDate: "1848 (Rajab 1264), as dated in the copy",
    caption:
      "Two number grids, a 'tablet of life' and a 'tablet of death', for foretelling whether a patient will live from the numerical value of his name, in an 1848 copy of part of the Arabic Secret of Secrets (Sirr al-asrār). Related evidence for the Arabic book Philip translated; this page is not the Emerald Tablet.",
    creator: "Unknown scribe",
    credit: "US National Library of Medicine, via Wikimedia Commons",
    licence: "Public domain (PD-USGov-HHS-NIH)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "probable",
    verificationStatus: "unverified",
  },
  {
    key: "chrysogonus-1541-tabula-smaragdina",
    passageKey: "arab.tab.vulgate",
    url: "https://upload.wikimedia.org/wikipedia/commons/9/91/Table_Emeraude_Chrysogonus.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:Table_Emeraude_Chrysogonus.jpg",
    objectDate: "1541",
    caption:
      "The vulgate Latin Tablet in its first printing, 'Tabula Smaragdina Hermetis Trismegisti … incerto interprete', in the alchemical collection De alchemia edited by Chrysogonus Polydorus (Nuremberg, 1541). The full text from 'Verba secretorum Hermetis' to 'de operatione Solis' is on the page.",
    creator: "Chrysogonus Polydorus (editor)",
    credit: "Wikimedia Commons (from la-rose-bleue.org)",
    licence: "Public domain (PD-old-100)",
    licenceStatus: "open",
    shows: "manuscript",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
  {
    key: "khunrath-emerald-tablet-wellcome",
    passageKey: "arab.tab.vulgate",
    url: "https://upload.wikimedia.org/wikipedia/commons/d/de/%27The_Emerald_Table_of_Hermes%27._Wellcome_M0012393.jpg",
    sourcePageUrl: "https://commons.wikimedia.org/wiki/File:%27The_Emerald_Table_of_Hermes%27._Wellcome_M0012393.jpg",
    institution: "Wellcome Collection, London",
    accessionNumber: "Photo M0012393",
    objectDate: "1606 or earlier (as Commons dates the same plate)",
    caption:
      "The Emerald Tablet as an engraving: the Latin vulgate text carved on a rocky peak in a landscape, with a long inscription below, from Heinrich Khunrath's Amphitheatrum sapientiae aeternae. Later artwork showing how the Tablet was imagined, not an artefact.",
    creator: "Heinrich Khunrath (designer); engraver not named",
    credit: "Wellcome Collection, CC BY 4.0",
    licence: "CC BY 4.0",
    licenceStatus: "attribution",
    shows: "later_artwork",
    identificationStatus: "secure",
    verificationStatus: "unverified",
  },
];

function imagesFor(passageKey: string): CorpusImage[] | undefined {
  const found = IMAGES.filter((image) => image.passageKey === passageKey).map((image) => {
    const copy: Placed = { ...image };
    delete copy.passageKey;
    delete copy.manuscriptKey;
    return copy;
  });
  return found.length > 0 ? found : undefined;
}

// ---------------------------------------------------------------------------
// THE VERSIONS, LINE BY LINE
// ---------------------------------------------------------------------------

const ARABIC: [string, string][] = [
  ["حقٌّ لا شكَّ فيه صَحيح،", "(a) truth; no doubt [it] is true"],
  ["إنّ الأعلى من الأسفل والأسفل من الأعلى،", "indeed, the uppermost is from the lowermost and the lowermost is from the uppermost,"],
  [
    "عمل العجائب من واحد كما كانت الأشياء كلّها من واحد بتدبير واحد،",
    "[it] worked the wonders from one, (just) as all things come from one by means of one plan / with one considered act,",
  ],
  ["أبوه الشمس، أُمّه القمر،", "[its] father is the sun, [its] mother is the moon,"],
  ["حملته الريح في بطنها، غذته الأرض،", "the wind carried [it] in her womb, the earth fed [it],"],
  ["أبو الطِّلسمات، خازن العجائب، كامل القوى،", "father of talismans, keeper of wonders, perfect in power,"],
  ["نار صارت أرضاً ٱعزِل الأرض من النار،", "fire became earth, separate the earth from the fire,"],
  ["اللطيف أكرم من الغليظ،", "the soft / delicate / gentle / subtle is more noble than the crude / rough / unintelligent / gross,"],
  [
    "برِفق وحُكم يصعد من الأرض إلى السماء وينزل إلى الأرض من السماء،",
    "with gentle-being and wisdom [it] ascends from the earth to the heaven and descends to the earth from the heaven,",
  ],
  ["وفيه قُوّة الأعلى والأسفل،", "and in [it] is the power of the uppermost and the lowermost,"],
  ["لأنّ معه نور الأنوار فلذلك تهرب منه الظُّلمة،", "since with [it] is the light of lights therefore the darkness escapes (away) from [it],"],
  ["قُوّة القوى", "power of powers"],
  ["يغلب كلّ شيء لطيف، يدخل في كلّ شيء غليظ،", "it prevails over everything soft / delicate / gentle / subtle, enters into everything crude / rough / unintelligent / gross,"],
  ["على تكوين العالَم الأكبر تكوّن العمل،", "against the creation of the macrocosm the work was created,"],
  ["فهذا فَخْرِي ولذلك سُمّيتُ هرمس المثلَّث بالحكمة.", "this is my renown and therefore I am named Hermes the threefold with the wisdom."],
];

const SECRETUM: string[] = [
  "Veritas ita se habet et non est dubium,",
  "quod inferiora superioribus et superiora inferioribus respondent.",
  "Operator miraculorum unus solus est Deus, a quo descendit omnis operacio mirabilis.",
  "Sic omnes res generantur ab una sola substancia, una sua sola disposicione.",
  "Quarum pater est Sol, quarum mater est Luna.",
  "Que portavit ipsam naturam per auram in utero, terra impregnata est ab ea.",
  "Hinc dicitur Sol causatorum pater, thesaurus miraculorum, largitor virtutum.",
  "Ex igne facta est terra.",
  "Separa terrenum ab igneo, quia subtile dignius est grosso, et rarum spisso.",
  "Hoc fit sapienter et discrete. Ascendit enim de terra in celum, et ruit de celo in terram.",
  "Et inde interficit superiorem et inferiorem virtutem.",
  "Sic ergo dominatur inferioribus et superioribus et tu dominaberis sursum et deorsum,",
  "tecum enim est lux luminum, et propter hoc fugient a te omnes tenebre.",
  "Virtus superior vincit omnia.",
  "Omne enim rarum agit in omne densum.",
  "Et secundum disposicionem majoris mundi currit hec operacio,",
  "et propter hoc vocatur Hermogenes triplex in philosophia.",
];

const VULGATE: [string, string][] = [
  ["Verum sine mendacio, certum, certissimum.", "True it is, without falsehood, certain and most true."],
  [
    "Quod est superius est sicut quod inferius, et quod inferius est sicut quod est superius.",
    "That which is above is like to that which is below, and that which is below is like to that which is above,",
  ],
  ["Ad preparanda miracula rei unius.", "to accomplish the miracles of one thing."],
  [
    "Sicut res omnes ab una fuerunt meditatione unius, et sic sunt nate res omnes ab hac re una aptatione.",
    "And as all things were by contemplation of one, so all things arose from this one thing by a single act of adaptation.",
  ],
  ["Pater ejus sol, mater ejus luna.", "The father thereof is the Sun, the mother the Moon."],
  ["Portavit illuc ventus in ventre suo. Nutrix ejus terra est.", "The wind carried it in its womb, the earth is the nurse thereof."],
  ["Pater omnis Telesmi tocius mundi hic est.", "It is the father of all works of wonder throughout the whole world."],
  ["Vis ejus integra est.", "The power thereof is perfect."],
  [
    "Si versa fuerit in terram separabit terram ab igne, subtile a spisso.",
    "If it be cast on to earth, it will separate the element of earth from that of fire, the subtle from the gross.",
  ],
  [
    "Suaviter cum magno ingenio ascendit a terra in celum. Iterum descendit in terram,",
    "With great sagacity it doth ascend gently from earth to heaven. Again it doth descend to earth,",
  ],
  ["et recipit vim superiorem atque inferiorem.", "and uniteth in itself the force from things superior and things inferior."],
  [
    "Sicque habebis gloriam claritatis mundi. Ideo fugiet a te omnis obscuritas.",
    "Thus thou wilt possess the glory of the brightness of the whole world, and all obscurity will fly far from thee.",
  ],
  ["Hic est tocius fortitudinis fortitudo fortis,", "This thing is the strong fortitude of all strength,"],
  [
    "quia vincet omnem rem subtilem, omnemque rem solidam penetrabit.",
    "for it overcometh every subtle thing and doth penetrate every solid substance.",
  ],
  ["Sicut hic mundus creatus est.", "Thus was this world created."],
  ["Hinc erunt aptationes mirabiles quarum mos hic est.", "Hence will there be marvellous adaptations achieved, of which the manner is this."],
  [
    "Itaque vocatus sum Hermes, tres tocius mundi partes habens sapientie.",
    "For this reason I am called Hermes Trismegistus, because I hold three parts of the wisdom of the whole world.",
  ],
  [
    "Et completum est quod diximus de opere solis ex libro Galieni Alfachimi.",
    "That which I had to say about the operation of Sol is completed.",
  ],
];

/** Newton's English, divided at the vulgate's lines so the two can be read side by side. */
const NEWTON: string[] = [
  "Tis true without lying, certain and most true.",
  "That which is below is like that which is above and that which is above is like that which is below",
  "to do the miracle of one only thing.",
  "And as all things have been and arose from one by the mediation of one: so all things have their birth from this one thing by adaptation.",
  "The Sun is its father, the moon its mother,",
  "the wind hath carried it in its belly, the earth is its nurse.",
  "The father of all perfection in the whole world is here.",
  "Its force or power is entire if it be converted into earth.",
  "Separate thou the earth from the fire, the subtle from the gross",
  "sweetly with great industry. It ascends from the earth to the heaven and again it descends to the earth",
  "and receives the force of things superior and inferior.",
  "By this means you shall have the glory of the whole world and thereby all obscurity shall fly from you.",
  "Its force is above all force,",
  "for it vanquishes every subtle thing and penetrates every solid thing.",
  "So was the world created.",
  "From this are and do come admirable adaptations where of the means is here in this.",
  "Hence I am called Hermes Trismegist, having the three parts of the philosophy of the whole world.",
  "That which I have said of the operation of the Sun is accomplished and ended.",
];

const pad = (n: number) => String(n).padStart(2, "0");

const LINE_NOTE =
  "Line division follows the edition's own layout as quoted; versions do not share a numbering, so line n of one version need not correspond to line n of another.";

function lines(
  versionKey: string,
  title: string,
  rows: { layers: CorpusLayer[] }[],
  witness?: string
): CorpusPassage[] {
  return rows.map((row, i) => ({
    key: `arab.tab.${versionKey}.${pad(i + 1)}`,
    parentKey: `arab.tab.${versionKey}`,
    divisionKind: "line",
    label: `${title}, line ${i + 1}`,
    reference: `${title}, line ${i + 1}`,
    verificationStatus: "unverified",
    layers: row.layers,
    witnesses: witness ? [{ manuscriptKey: witness }] : undefined,
    themes: THEMES_BY_LINE[versionKey]?.[i + 1],
  }));
}

const ABOVE_BELOW = { themeKey: "above-and-below", note: "The correspondence of above and below — the line later quoted as 'as above, so below'." };
const SUN_MOON = { themeKey: "sun-and-moon", note: "The Sun as father and the Moon as mother of 'the one thing'." };
const CREATION = { themeKey: "creation", note: "All things arise from one; the world is created after this pattern." };
const ASCENT = { themeKey: "ascension", note: "Ascent from earth to heaven and descent again." };
const TRANSFORM = { themeKey: "transformation", note: "Separation of earth from fire, subtle from gross — read by alchemists as a stage of the Work." };
const THOTH = { themeKey: "thoth-and-hermes", note: "The text names its author as Hermes, the 'threefold' or 'thrice-great'." };
const KNOWLEDGE = { themeKey: "divine-knowledge", note: "Hermes holds the threefold wisdom of the whole world." };

const THEMES_BY_LINE: Record<string, Record<number, { themeKey: string; note: string }[]>> = {
  arabic: { 2: [ABOVE_BELOW], 3: [CREATION], 4: [SUN_MOON], 7: [TRANSFORM], 9: [ASCENT], 14: [CREATION], 15: [THOTH, KNOWLEDGE] },
  secretum: { 2: [ABOVE_BELOW], 4: [CREATION], 5: [SUN_MOON], 9: [TRANSFORM], 10: [ASCENT], 17: [THOTH, KNOWLEDGE] },
  vulgate: { 2: [ABOVE_BELOW], 4: [CREATION], 5: [SUN_MOON], 9: [TRANSFORM], 10: [ASCENT], 15: [CREATION], 17: [THOTH, KNOWLEDGE] },
  newton: { 2: [ABOVE_BELOW], 4: [CREATION], 5: [SUN_MOON], 9: [TRANSFORM], 10: [ASCENT], 15: [CREATION], 17: [THOTH, KNOWLEDGE] },
};

const PASSAGES: CorpusPassage[] = [
  {
    key: "arab.tab.arabic",
    divisionKind: "version",
    label: "Arabic: the Book of the Secret of Creation",
    reference: "Kitāb sirr al-khalīqa, appendix; Weisser 1979, pp. 524–525",
    sourceKey: "weisser-sirr",
    summary:
      "The oldest known version, appended to an Arabic cosmological treatise that presents itself as the work of Balīnūs (Apollonius of Tyana), who found the Tablet in a vault beneath a statue of Hermes.",
    notes: LINE_NOTE,
    verificationStatus: "unverified",
    layers: [],
    dates: [
      {
        key: "composition",
        role: "composition",
        startYear: 750,
        endYear: 833,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "late eighth or early ninth century (Weisser: c. 750–800; Kraus: c. 813–833)",
        evidence: "Scholarly estimates for the compilation of the Secret of Creation; Ruska had earlier proposed the sixth to eighth centuries. No Greek or Syriac original is known.",
        sourceKey: "ruska-tabula",
      },
    ],
  },
  ...lines(
    "arabic",
    "Arabic version",
    ARABIC.map(([arabic, english]) => ({
      layers: [
        {
          key: "ara-weisser",
          layer: "primary_text",
          sourceKey: "weisser-sirr",
          content: arabic,
          language: "Arabic",
          script: "Arabic",
          licence: "copyrighted_excerpt",
          evidence: "Weisser's critical edition of the Arabic, quoted line by line.",
        },
        {
          key: "eng-wikipedia",
          layer: "translation",
          sourceKey: "wikipedia-emerald-tablet",
          content: english,
          language: "English",
          licence: "cc_by_sa",
          evidence: "A deliberately literal translation; alternatives for ambiguous Arabic words are separated by slashes, and [it] may equally be read [he].",
        },
      ],
    })),
    "paris-arabe-2300"
  ),
  {
    key: "arab.tab.secretum",
    divisionKind: "version",
    label: "Latin: the Secret of Secrets (Philip of Tripoli)",
    reference: "Secretum secretorum, ed. Steele 1920, pp. 115–117",
    sourceKey: "steele-secretum",
    summary:
      "Philip of Tripoli's thirteenth-century Latin translation of the Arabic Secret of Secrets (Sirr al-asrār), which includes the Tablet. It differs markedly from the vulgate. Text as in Roger Bacon's copy.",
    notes: `${LINE_NOTE} No public-domain English translation of this version has been located yet.`,
    verificationStatus: "unverified",
    layers: [],
    dates: [
      {
        key: "translation",
        role: "translation_publication",
        startYear: 1220,
        endYear: 1240,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "Philip of Tripoli's translation, first half of the thirteenth century",
        evidence: "Philip of Tripoli was active in the first half of the thirteenth century; the translation is not dated more closely here.",
        sourceKey: "steele-secretum",
      },
    ],
  },
  ...lines(
    "secretum",
    "Secret of Secrets version",
    SECRETUM.map((latin) => ({
      layers: [
        {
          key: "lat-steele",
          layer: "primary_text",
          sourceKey: "steele-secretum",
          content: latin,
          language: "Latin",
          script: "Latin",
          licence: "public_domain",
          evidence: "Steele's 1920 edition of the Latin text with Roger Bacon's glosses.",
        },
      ],
    })),
    "christ-church-99"
  ),
  {
    key: "arab.tab.vulgate",
    divisionKind: "version",
    label: "Latin: the vulgate",
    reference: "Steele & Singer 1928, p. 48/492 (Latin), p. 42/486 (English)",
    sourceKey: "steele-singer-1928",
    summary:
      "The Latin version found in a twelfth-century alchemical compilation translated from a lost Arabic text. It became the standard text in Europe and the basis of every later vernacular translation.",
    notes: `${LINE_NOTE} 'Telesmi' (line 7) transliterates the Arabic ṭilasm, talisman, which the translator did not understand.`,
    verificationStatus: "unverified",
    layers: [],
    dates: [
      {
        key: "translation",
        role: "composition",
        startYear: 1100,
        endYear: 1150,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "first half of the twelfth century",
        evidence: "Dated from internal indications in the compilation; the translator is unknown (Plato of Tivoli is a conjecture).",
        sourceKey: "steele-singer-1928",
      },
      {
        key: "earliest-ms",
        role: "earliest_evidence",
        startYear: 1200,
        endYear: 1399,
        datePrecision: "century",
        isApproximate: true,
        originalDateText: "no extant manuscript before the thirteenth or fourteenth century",
        evidence: "The surviving manuscripts listed by Steele and Singer are later than the translation.",
        sourceKey: "steele-singer-1928",
      },
    ],
  },
  ...lines(
    "vulgate",
    "Vulgate",
    VULGATE.map(([latin, english]) => ({
      layers: [
        {
          key: "lat-steele-singer",
          layer: "primary_text",
          sourceKey: "steele-singer-1928",
          content: latin,
          language: "Latin",
          script: "Latin",
          licence: "public_domain_us",
          evidence: "Steele and Singer's edition of the vulgate from the manuscripts.",
        },
        {
          key: "eng-steele-singer",
          layer: "translation",
          sourceKey: "steele-singer-1928",
          content: english,
          language: "English",
          licence: "public_domain_us",
          evidence: "Steele and Singer's English translation, printed with their edition.",
        },
      ],
    })),
    "arundel-164"
  ),
  {
    key: "arab.tab.newton",
    divisionKind: "version",
    label: "English: Isaac Newton's translation of the vulgate",
    reference: "King's College Cambridge, Keynes MS 28",
    sourceKey: "newton-keynes-28",
    summary: "Newton's private English translation of the Latin vulgate, part of his alchemical papers.",
    notes: "Newton translates the vulgate, so his lines are divided where the vulgate's are. Spelling modernised.",
    verificationStatus: "unverified",
    layers: [],
    dates: [
      {
        key: "written",
        role: "translation_publication",
        startYear: 1680,
        endYear: 1689,
        datePrecision: "decade",
        isApproximate: true,
        originalDateText: "1680s",
        evidence: "Dated by the Newton Project from the hand and paper; never published by Newton.",
        sourceKey: "newton-keynes-28",
      },
    ],
  },
  ...lines(
    "newton",
    "Newton",
    NEWTON.map((english) => ({
      layers: [
        {
          key: "eng-newton",
          layer: "translation",
          sourceKey: "newton-keynes-28",
          content: english,
          language: "English",
          licence: "public_domain",
          evidence: "Newton's own translation from the Latin vulgate, in modernised spelling.",
        },
      ],
    }))
  ),
];

const LINKS: CorpusLink[] = [
  {
    key: "vulgate-02-from-arabic-02",
    from: "arab.tab.vulgate.02",
    to: "arab.tab.arabic.02",
    connectionClass: "documented_transmission",
    similarities: "Both pair the upper and the lower in a reciprocal formula.",
    differences:
      "The Arabic says the upper is FROM the lower and the lower FROM the upper; the vulgate says each is LIKE the other. The famous 'as above, so below' reading belongs to the Latin.",
    wordingComparable: "partly",
    meaningComparable: "partly",
    transmissionEvidence:
      "The vulgate is a Latin translation of a lost Arabic text of the Tablet; the Arabic lines and the Latin lines follow the same sequence of statements.",
    scholarlyView: "The shift from 'from' to 'like' turned a cosmological statement into a doctrine of correspondence.",
    sourceKey: "steele-singer-1928",
    reviewStatus: "reviewed",
  },
  {
    key: "secretum-02-from-arabic-02",
    from: "arab.tab.secretum.02",
    to: "arab.tab.arabic.02",
    connectionClass: "documented_transmission",
    similarities: "Both state a reciprocal relation between the upper and the lower.",
    differences: "The Secret of Secrets has 'correspond to' (respondent), different again from both the Arabic 'from' and the vulgate 'like'.",
    wordingComparable: "partly",
    meaningComparable: "partly",
    transmissionEvidence: "Philip of Tripoli translated the Arabic Secret of Secrets, which contains this version of the Tablet.",
    sourceKey: "steele-secretum",
    reviewStatus: "reviewed",
  },
  {
    key: "newton-02-from-vulgate-02",
    from: "arab.tab.newton.02",
    to: "arab.tab.vulgate.02",
    connectionClass: "direct_textual_parallel",
    similarities: "Newton translates the vulgate line word for word.",
    differences: "Newton puts 'below' before 'above'; the meaning is unchanged.",
    wordingComparable: "yes",
    meaningComparable: "yes",
    transmissionEvidence: "Keynes MS 28 is Newton's translation of the vulgate.",
    sourceKey: "newton-keynes-28",
    reviewStatus: "reviewed",
  },
  {
    key: "newton-07-from-vulgate-07",
    from: "arab.tab.newton.07",
    to: "arab.tab.vulgate.07",
    connectionClass: "later_reinterpretation",
    similarities: "Newton renders the vulgate's 'telesmi' line.",
    differences: "Newton reads 'telesmus' as 'perfection'; Steele and Singer as 'works of wonder'; the Arabic behind it means 'talismans'.",
    wordingComparable: "partly",
    meaningComparable: "partly",
    transmissionEvidence: "Newton is translating the vulgate; the difference is his interpretation of a word the Latin translator had only transliterated.",
    sourceKey: "newton-keynes-28",
    reviewStatus: "reviewed",
  },
];

export const EMERALD_TABLET_CORPUS: TextCorpusFile = {
  workKey: "arab.emerald-tablet",
  revision: "2026-10-16",
  sources: SOURCES,
  manuscripts: MANUSCRIPTS,
  images: IMAGES.filter((image) => image.passageKey == null).map((image) => {
    const copy: Placed = { ...image };
    delete copy.passageKey;
    return copy;
  }),
  passages: PASSAGES.map((passage) => {
    const images = imagesFor(passage.key);
    return images ? { ...passage, images } : passage;
  }),
  links: LINKS,
};
