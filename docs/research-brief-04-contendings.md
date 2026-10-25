# Research brief 04 — The Contendings of Horus and Seth

**For a researcher with web access. Pasteable as-is.**
**Supersedes brief 01.** Same subject, sharper targets: the dataset has since
grown a structure that this material has to fit into, and two completed rounds
have shown what a usable result looks like.

---

## Why this one matters

The record it feeds currently contains this sentence about itself:

> *"The papyrus has not been read here in any edition. The description above is
> the standard characterisation, given without page references, and it is
> exactly the kind of confident secondhand summary this dataset exists to be
> suspicious of."*

It is the **longest surviving Egyptian narrative about Seth**, and it is the one
record in the dataset that openly admits to being written from nothing. Three
specific assertions in it are unbacked, and each is listed below as a question.

---

## The standard

Unchanged from the previous briefs, and it has worked both times.

- **Quote verbatim, with page and line references.** Do not paraphrase and
  present it as the translation.
- **Never reconstruct a transliteration from memory.** Quote the published one
  or write `NOT FOUND`.
- **If you cannot open a source, write `NOT FOUND`** rather than answering from
  general knowledge.
- **Give the URL you actually opened** for every claim.
- **Keep the lacunae.** Where the papyrus is damaged or Gardiner hedges, say so.
  Brackets and ellipses are the honest shape of a damaged text; tidying them
  away turns a wrecked passage into a readable one.
- **The editor's own limits are the most valuable page in the book.** Both
  previous rounds produced their best material from what the scholars said they
  could *not* establish. Quote those.
- **Refusing is allowed and is sometimes correct.** The last round was asked for
  a regional model the authors had not drawn, and correctly reported that they
  had not drawn one. Do that wherever it applies.

A long `NOT FOUND` list is a good result.

---

## The source

**Papyrus Chester Beatty I, recto 1,1–16,8.** Twentieth Dynasty / Ramesside,
c. twelfth century BCE. Provenance Thebes, associated with the workmen's village
at Deir el-Medina. Now Chester Beatty Library, Dublin.

Primary edition — **full scan, free**:

> Alan H. Gardiner, *The Library of A. Chester Beatty: Description of a Hieratic
> Papyrus with a Mythological Story, Love-Songs, and Other Miscellaneous Texts*
> (Oxford, 1931).
>
> https://chesterbeatty.ie/assets/uploads/2018/11/The-Library-of-A.-Chestera-Beatty-Description-of-a-Hieratic-Papyrus-with-a-Mythological-Story-Love-Songs-and-Other-Miscellaneous-Texts.pdf

Gardiner's hieroglyphic transcription also in *Late Egyptian Stories*, pp. 37–60.

Supporting:

- Digital transcription after Gardiner:
  https://webperso.iut.univ-paris8.fr/~rosmord/hieroglyphes/HorusAndSeth/
- Page-by-page transcription project:
  https://tansebe.github.io/hr-st/hr-st.html
- Miriam Lichtheim, *Ancient Egyptian Literature* II, pp. 214–223.
  **Cite and quote briefly only — do not reproduce it whole.**
- Edward Wente's translation in W. K. Simpson (ed.), *The Literature of Ancient
  Egypt*.
- A photograph of **recto page 4** is reproduced in *Metropolitan Museum Journal*
  50 (2015), which is open access:
  https://resources.metmuseum.org/resources/metpublications/pdf/Metropolitan_Museum_Journal_v_50_2015.pdf
  Note its **figure number and page**, and whether the image is reusable.

---

## What the output has to fit

The dataset now stores primary text as **passages**, each carrying **layers**.
The layer keys are fixed:

```
primary_object   primary_text   transcription   transliteration
translation      modern_summary interpretation
```

More than one `translation` layer per passage is **normal and wanted** — that is
the whole point of the structure. Where Gardiner, Lichtheim and Wente differ,
each becomes its own row, and the difference is recorded rather than resolved.

So please return **one block per episode**, in this shape:

```
### EPISODE <n> — <short label>

PAPYRUS LOCATION:   recto <page>,<line> – <page>,<line>
GARDINER PAGES:     pp. <n>–<n> of the 1931 edition

TRANSLITERATION:    <published, with brackets intact — or NOT FOUND>
    source:         <where you got it>

TRANSLATION — GARDINER 1931 (verbatim):
"<quote>"           — p. <n>

TRANSLATION — LICHTHEIM 1976 (short quote only, where it differs):
"<quote>"           — p. <n>
    differs in:     <what changes, and what turns on it>

TRANSLATION — WENTE / SIMPSON (short quote only, where it differs):
"<quote>"           — p. <n>
    differs in:     <what changes, and what turns on it>

NEUTRAL SUMMARY (your own words, 2–4 sentences, no interpretation):

TEXTUAL PROBLEMS:
<lacunae, damaged signs, Gardiner's footnoted doubts, disputed readings>

INTERPRETATIONS (attributed, dated, kept out of the summary):
<whose, when, what they read it as, and whether it is current or superseded>

URLS OPENED:
```

**A citation-only entry is a real entry.** If a translation exists but cannot be
quoted, give the translator, the page range, and say the text is withheld. That
row says the translation exists and where to read it, which is far more useful
than silence.

Finish with:

```
### NOT FOUND
<one line per thing you could not retrieve, and why>

### SOURCES I COULD NOT OPEN
<url — reason>
```

---

## Two framing points

**The central dispute is succession to the office of Osiris.** The text is a
legal proceeding before a divine tribunal, not a morality tale. Anything showing
it working as a lawsuit — arguments, precedent, procedural delay, appeals,
letters, adjournments — is high value.

**Seth has a case.** The dataset's record says he is "a litigant with a bad
temper and a real case", entirely on secondhand authority. His actual stated
basis, verbatim with a line reference, is the single most useful thing in this
brief.

**Do not soften the text.** Two episodes are routinely censored or euphemised.
Both are wanted in full, in plain academic language. A dataset that quietly
drops what is awkward is editing its source.

---

## The episodes

Extract the narrative **as it actually divides**. This list is a checklist, not
a script. If the manuscript divides differently, follow the manuscript and say
so — that is a finding. If something here is not there, say that too.

1. Horus claims the office of Osiris.
2. **Seth's counterclaim. PRIORITY.** The actual basis, verbatim, with location.
3. The divine court — Re-Harakhty / the Master of the Universe, Thoth, the
   Ennead, Neith, Isis. How the proceeding runs, and the eighty years.
4. Neith's judgment — her message, what she proposes, how the Ennead reacts.
5. Re-Harakhty's reaction — the disagreement inside the court.
6. Hathor and Re-Harakhty — he withdraws in anger; she approaches; the
   manuscript describes her exposing herself and his laughing and recovering.
   Record as an ancient textual episode. The *Met Museum Journal* photograph of
   recto page 4 covers this section.
7. Isis intervenes — what she actually does, not "helps Horus".
8. **Isis and Seth. PRIORITY.** Disguised, she obtains a statement from him.
   What she says, what he says, and **why his answer matters to the succession
   claim**. Quote in full — this is where the narrative frames his legal
   position, and it may be the single most revealing passage in the text.
9. The hippopotamus contest — terms, duration, Isis's intervention, outcomes.
10. Horus and Isis — the violent episode, exactly as the manuscript has it.
11. Seth's sexual challenge — Seth's action, Horus's response, Isis's response,
    what becomes of each god's semen, the lettuce, the hearing that follows.
    Neutral academic language, neither sensationalised nor censored.
12. The semen test — Thoth's determination, and what the court concludes.
13. The boat contest — what Seth builds, what Horus builds, how Horus disguises
    his, what happens, how it ends.
14. **Osiris intervenes. PRIORITY.** The correspondence and Osiris's own
    argument — the strongest evidence for how the text conceives legitimate
    kingship and the authority of the dead ruler. Quote at length.
15. **The final judgment. PRIORITY.** Who receives the office, what happens to
    Seth, **what role Seth is subsequently given**, and how the gods react. Not
    "good defeats evil" — the actual settlement, verbatim.

---

## Six questions the dataset's own claims depend on

Each with a location reference. **A "no" is as valuable as a "yes"** — it tells
me to change the record rather than keep it.

**Q1. Is the tone actually comic?**
The record asserts the text is "closer to farce" than to solemn scripture, and
builds an argument on it: that the solemnity in modern retellings is imported.
That assertion has no citation behind it. Quote two or three passages that
support or undercut it, and say which way you think the evidence points.

**Q2. Is it really eighty years?**
The record says the case drags on for eighty years. Where does the number
appear, in what words, and is it a duration, a formula, or a round number?

**Q3. Is Seth ever described in terms that would justify calling him evil** —
as opposed to violent, crude, dangerous or ridiculous? Quote the strongest
example either way. The dataset dates his demonisation centuries later than this
papyrus, and this text is the best available test of that.

**Q4. What does the settlement give Seth?**
If he is given a role rather than simply defeated, quote it. This is the hinge
between this record and the dataset's late-period material.

**Q5. Does the text place Seth in the solar barque, or with Re, in any way?**
Two other records now carry this: the 400-Year Stela hails Seth as "great in
strength in the barque of millions of years, overthrowing enemies in front of
the barque of Re", and the Ramesside stela from Mut el-Kharab has the
disconnected word "prow" in a broken line. **Do not go looking for a parallel
and find one.** The question is genuinely open, and "no, the Contendings does
not do this" is a perfectly good answer.

**Q6. What does Gardiner say he cannot establish?**
His hedges, his uncertain readings, his footnoted doubts. In both previous
rounds this produced the most valuable material in the result.

---

## Four factual gaps in the record

Small, specific, and currently guessed at:

1. **The reign.** The record dates the papyrus "Twentieth Dynasty" and notes
   that a reign is "sometimes attached to it". Which reign, on what basis, and
   how firm?
2. **The papyrus's history before the Chester Beatty Library.** How did it get
   there, and from where?
3. **Is the Deir el-Medina association secure?** The record states it as fact.
4. **How much of the text actually survives?** Is recto 1,1–16,8 substantially
   complete, or is it damaged like the Mut stela — where only two of nine lines
   could be read? The dataset currently implies a complete narrative and has no
   basis for that.

---

## What not to do

- Do not design timeline records, choose classifications, or decide what is a
  precursor versus a parallel. That needs the codebase open.
- Do not reproduce Lichtheim or Wente in bulk. Short quotations for comparison,
  with full citation.
- Do not fill a line reference by inference from a summary. `NOT FOUND` is
  better than a plausible number, because a wrong line reference looks
  checkable and is not.
- Do not resolve a disagreement between translators. Send both.
- Do not supply a structure the edition does not have. If Gardiner does not
  divide the narrative into episodes, say so and describe how he does divide it.
