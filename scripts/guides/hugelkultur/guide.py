"""Build the Hügelkultur guide body (HTML for Relate's SafeHtml renderer).

The output is the body of a post in the Nature's Gardeners Knowledge Base
space. Run: python3 guide.py > guide.html
"""
import html
import sys

IMG = "/communities/naturesgardeners/guides/hugelkultur"
SIZES = {
    "mound-vs-bed": (900, 560), "video-numbers": (900, 520), "woods-recommended": (900, 760),
    "woods-avoid": (900, 700), "never-bury": (900, 640), "sourcing": (900, 520),
    "nitrogen-boundary": (900, 640), "termite-distance": (900, 520), "mesh-barrier": (900, 560),
    "packing-compare": (900, 620), "drainage": (900, 560), "steps-1-4": (900, 880),
    "steps-5-8": (900, 880), "steps-9-12": (900, 880), "steps-13-16": (900, 880),
    "steps-17-19": (900, 880), "layers-76cm": (900, 980), "decomposition-stages": (900, 560),
    "tropical-bed": (900, 680),
}


def fig(name, alt, caption, credit="Illustration: Nature's Gardeners"):
    w, h = SIZES[name]
    return (
        f'<figure class="hk-fig"><img src="{IMG}/{name}.svg" alt="{html.escape(alt)}" width="{w}" height="{h}" loading="lazy">'
        f"<figcaption>{caption} <span class=\"hk-credit\">{credit}</span></figcaption></figure>"
    )


def photo(src, alt, caption, w, h):
    return (
        f'<figure class="hk-fig hk-photo"><img src="{src}" alt="{html.escape(alt)}" width="{w}" height="{h}" loading="lazy">'
        f"<figcaption>{caption} <span class=\"hk-credit\">Photo: Nature's Gardeners library</span></figcaption></figure>"
    )


VIDEO = '<span class="hk-tag hk-tag-video">From the video</span>'
EXTRA = '<span class="hk-tag hk-tag-extra">Extra advice</span>'


def note(kind, title, body):
    return f'<aside class="hk-note hk-note-{kind}"><p><strong>{title}</strong> {body}</p></aside>'


def faq(q, a):
    return f"<details class=\"hk-faq\"><summary>{q}</summary><div>{a}</div></details>"


CSS = """
.hk { --hk-green: var(--accent); --hk-soft: var(--accent-soft); --hk-line: var(--border); --hk-muted: var(--muted-foreground);
  color: var(--foreground); font-size: 16px; line-height: 1.7; max-width: 46rem; }
.hk p { margin: 0 0 1em; }
.hk h2 { font-size: 1.45rem; line-height: 1.3; font-weight: 700; margin: 2.6em 0 .6em; padding-top: .4em; border-top: 1px solid var(--hk-line); scroll-margin-top: 5rem; }
.hk h3 { font-size: 1.12rem; font-weight: 700; margin: 1.8em 0 .5em; scroll-margin-top: 5rem; }
.hk h4 { font-size: 1rem; font-weight: 700; margin: 1.4em 0 .4em; }
.hk ul, .hk ol { margin: 0 0 1em; padding-left: 1.4em; }
.hk ul { list-style: disc; } .hk ol { list-style: decimal; }
.hk li { margin: .25em 0; }
.hk a { color: var(--hk-green); text-decoration: underline; text-underline-offset: 2px; }
.hk-lede { font-size: 1.15rem; line-height: 1.6; color: var(--foreground); }
.hk-meta { font-size: .85rem; color: var(--hk-muted); }
.hk-tag { display: inline-block; font-size: .7rem; font-weight: 700; letter-spacing: .03em; text-transform: uppercase; border-radius: 999px; padding: .15em .65em; margin-right: .4em; vertical-align: .15em; white-space: nowrap; }
.hk-tag-video { background: var(--hk-soft); color: var(--hk-green); }
.hk-tag-extra { background: color-mix(in srgb, #b7832f 18%, transparent); color: #9a6b1f; }
.hk-legend { font-size: .9rem; color: var(--hk-muted); }
.hk-fig { margin: 1.6em 0; }
.hk-fig img { display: block; width: 100%; height: auto; border-radius: 16px; border: 1px solid var(--hk-line); background: #faf9f5; }
.hk-photo img { aspect-ratio: 16 / 10; object-fit: cover; }
.hk-fig figcaption { font-size: .85rem; color: var(--hk-muted); margin-top: .55em; line-height: 1.5; }
.hk-credit { opacity: .8; font-style: italic; }
.hk-video { margin: 1.6em 0; }
.hk-video-frame { position: relative; aspect-ratio: 16 / 9; width: 100%; border-radius: 16px; overflow: hidden; background: #111; border: 1px solid var(--hk-line); }
.hk-video-frame iframe { position: absolute; inset: 0; width: 100%; height: 100%; border: 0; }
.hk-toc { background: var(--muted); border: 1px solid var(--hk-line); border-radius: 16px; padding: .2em 1.1em; margin: 1.6em 0; }
.hk-toc summary { cursor: pointer; font-weight: 700; padding: .7em 0; }
.hk-toc ol { columns: 2; column-gap: 2em; font-size: .92rem; margin-bottom: 1em; }
.hk-toc li { break-inside: avoid; }
.hk-toc a { text-decoration: none; color: var(--foreground); }
.hk-toc a:hover { color: var(--hk-green); text-decoration: underline; }
.hk-note { border-radius: 14px; padding: .9em 1.1em; margin: 1.2em 0; border: 1px solid var(--hk-line); font-size: .95rem; }
.hk-note p { margin: 0; }
.hk-note-tip { background: var(--hk-soft); border-color: color-mix(in srgb, var(--hk-green) 30%, transparent); }
.hk-note-warn { background: color-mix(in srgb, #b6503a 10%, transparent); border-color: color-mix(in srgb, #b6503a 35%, transparent); }
.hk-note-info { background: color-mix(in srgb, #3f7aa6 10%, transparent); border-color: color-mix(in srgb, #3f7aa6 30%, transparent); }
.hk-table-wrap { overflow-x: auto; margin: 1.2em 0; border: 1px solid var(--hk-line); border-radius: 14px; }
.hk table { width: 100%; border-collapse: collapse; font-size: .92rem; }
.hk th, .hk td { text-align: left; vertical-align: top; padding: .6em .8em; border-bottom: 1px solid var(--hk-line); }
.hk th { background: var(--muted); font-weight: 700; white-space: nowrap; }
.hk tr:last-child td { border-bottom: 0; }
.hk-good { color: var(--hk-green); font-weight: 700; }
.hk-bad { color: #b6503a; font-weight: 700; }
.hk-slow { color: #3f7aa6; font-weight: 700; }
.hk-maybe { color: #9a6b1f; font-weight: 700; }
.hk td:first-child { min-width: 7.5em; }
.hk-problem { border: 1px solid var(--hk-line); border-radius: 16px; padding: .2em 1.2em .4em; margin: 1.4em 0; background: var(--card); }
.hk-steps { list-style: none; padding: 0; counter-reset: none; }
.hk-steps > li { display: flex; gap: .8em; padding: .7em 0; border-bottom: 1px dashed var(--hk-line); }
.hk-steps > li:last-child { border-bottom: 0; }
.hk-num { flex: 0 0 2em; height: 2em; border-radius: 999px; background: var(--hk-green); color: var(--accent-foreground); font-weight: 700; display: inline-flex; align-items: center; justify-content: center; font-size: .9rem; }
.hk-steps p { margin: .2em 0 0; }
.hk-check { list-style: none; padding: 0; columns: 2; column-gap: 2em; font-size: .92rem; }
.hk-check li { break-inside: avoid; padding: .2em 0; }
.hk-check li::before { content: "☐"; margin-right: .5em; color: var(--hk-green); font-size: 1.1em; }
.hk-faq { border: 1px solid var(--hk-line); border-radius: 12px; margin: .55em 0; background: var(--card); }
.hk-faq summary { cursor: pointer; font-weight: 600; padding: .75em 1em; }
.hk-faq > div { padding: 0 1em .8em; font-size: .95rem; }
.hk-faq > div p:last-child { margin-bottom: 0; }
.hk-discuss { background: var(--hk-soft); border-radius: 18px; padding: 1.2em 1.4em; margin: 2em 0 1em; }
.hk-discuss h2 { border-top: 0; margin-top: 0; padding-top: 0; }
.hk-sources { font-size: .88rem; color: var(--hk-muted); }
@media (max-width: 640px) {
  .hk { font-size: 15.5px; }
  .hk-toc ol, .hk-check { columns: 1; }
  .hk h2 { font-size: 1.3rem; }
  .hk th, .hk td { padding: .5em .6em; }
}
"""

SECTIONS = [
    ("why", "Why put wood in raised beds?"),
    ("video", "Watch the video"),
    ("which-wood", "Which wood should you use?"),
    ("sourcing", "Where to source your logs"),
    ("problems", "The five problems with burying logs"),
    ("build", "Step-by-step construction"),
    ("layers", "How deep should the layers be?"),
    ("calculator", "How much will you need?"),
    ("decomposition", "What happens as wood decomposes"),
    ("tropical", "Tropical gardens: Zanzibar, Pemba and East Africa"),
    ("faq", "Common questions and troubleshooting"),
    ("checklist", "Build checklist"),
    ("discuss", "Share your experience"),
]

parts = []
add = parts.append

add(f"<style>{CSS}</style>")
add('<article class="hk">')
add('<p class="hk-lede">Save money on soil, build healthier raised beds, retain moisture and avoid the common mistakes of burying logs beneath your vegetables.</p>')
add('<p class="hk-meta">A Nature\'s Gardeners Knowledge Base guide, based on the Epic Gardening video <a href="https://www.youtube.com/watch?v=CVYYgYozf4A">How to fill raised beds with wood</a>, with extra notes for growers in the tropics.</p>')
add(f'<p class="hk-legend">Throughout the guide, {VIDEO} marks what the presenter recommends in the video, and {EXTRA} marks additional horticultural advice from Nature\'s Gardeners. Where sources disagree, we say so.</p>')

# TOC
add('<details class="hk-toc" open><summary>Jump to a section</summary><ol>')
for sid, title in SECTIONS:
    add(f'<li><a href="#{sid}">{title}</a></li>')
add("</ol></details>")

# ---------------- why
add('<h2 id="why">Why put wood in raised beds?</h2>')
add("<p><strong>Hügelkultur</strong> (German for \"hill culture\") is a traditional method of piling logs and branches on the ground and burying them under soil and turf to make a mound. As the wood slowly breaks down, it feeds the soil life above it. The same idea works inside a tall raised bed: the bottom of the bed is filled with logs and woody material, and only the top part, where most roots grow, gets good growing soil.</p>")
add(fig("mound-vs-bed", "Side-by-side drawing of a traditional hügel mound of logs under soil and a tall raised bed with logs at the bottom and soil on top",
        "The traditional mound and its raised-bed version work on the same principle: wood low down, good soil where the roots are."))
add(f"<h3>The money side {VIDEO}</h3>")
add("<p>Tall beds swallow a surprising amount of soil. The example bed in the video is <strong>4 × 8 feet and 30 inches tall</strong> (about 1.2 × 2.4 m and 76 cm tall), which needs roughly <strong>80 cubic feet (about 2.3 m³)</strong> of material to fill. In the video that works out at around <strong>40 to 50 bags</strong> of commercial soil, which the presenter estimates at <strong>$400 to $1,000</strong> for premium mixes. By filling the lower part with wood, he estimates you can buy <strong>up to about 60% less soil</strong>.</p>")
add(fig("video-numbers", "Infographic: 4 by 8 foot bed, 30 inches tall, about 80 cubic feet, 40 to 50 bags of soil, 400 to 1,000 dollars, up to 60 percent less soil",
        "The figures from the video. Prices are the presenter's US estimates and will differ where you live."))
add(f"<h3>What the wood does over time {EXTRA}</h3>")
add("<p>Buried wood is slowly broken down by fungi, bacteria and soil animals. Over the years it turns into dark, spongy organic matter that can hold water and gives roots and soil life something to work with. That is why people say hügel beds need less watering. In practice the benefit depends a lot on the wood, your climate and how long the bed has been running:</p>")
add("<ul><li>Fresh, hard logs hold little water at first. The \"sponge\" effect builds as the wood softens, which can take years.</li><li>Moisture retention helps in dry spells, but it is not a reason to stop watering a new bed.</li><li>In the early stages the decaying wood can actually <em>compete</em> with your plants for nitrogen (see <a href=\"#problems\">the five problems</a>).</li></ul>")
add(note("info", "In short:", "wood in the bottom of a tall bed is mainly a way to save soil and add long-term organic matter. Better water retention is a likely bonus, not a guarantee."))

# ---------------- video
add('<h2 id="video">Watch the video</h2>')
add('<figure class="hk-video"><div class="hk-video-frame"><iframe src="https://www.youtube-nocookie.com/embed/CVYYgYozf4A" title="Epic Gardening: filling raised beds with wood" loading="lazy" allowfullscreen referrerpolicy="strict-origin-when-cross-origin"></iframe></div>'
    '<figcaption class="hk-meta">Source: Epic Gardening on YouTube. Video not playing? <a href="https://www.youtube.com/watch?v=CVYYgYozf4A">Watch it on YouTube</a>.</figcaption></figure>')

# ---------------- which wood
add('<h2 id="which-wood">Which wood should you use?</h2>')
add(f"<p>{VIDEO} The video recommends ordinary, untreated logs from common trees, and warns against two quite different groups of wood: species that may <strong>hold back plant growth</strong>, and species that <strong>resist decay</strong> so well they barely break down. Don't confuse the two. None of the woods below is being called poisonous to people.</p>")
add(fig("woods-recommended", "Illustrated end-grain rounds of oak, maple, birch, poplar, apple, pine and fir logs with short notes",
        "The seven woods the presenter recommends. These are illustrations to help you remember the list, not identification photos."))
add(fig("woods-avoid", "Two panels: black walnut, butternut and pecan under juglone concern; cedar, redwood and black locust under resists rotting",
        "Two separate reasons to avoid a wood. The juglone group may affect plant growth; the decay-resistant group simply lasts too long to feed the bed."))
add('<div class="hk-table-wrap"><table><thead><tr><th>Wood</th><th>Why</th></tr></thead><tbody>')
rows = [
    ("Oak", "good", "Recommended in the video. Dense hardwood, so it breaks down slowly and lasts many years."),
    ("Maple", "good", "Recommended in the video."),
    ("Birch", "good", "Recommended in the video. Tends to rot relatively quickly once buried."),
    ("Poplar", "good", "Recommended in the video. Light wood that breaks down fast."),
    ("Apple", "good", "Recommended in the video. Fruit-tree prunings are often easy to come by."),
    ("Pine", "good", "Recommended in the video. Softwood that breaks down faster than most hardwoods."),
    ("Fir", "good", "Recommended in the video. Softwood."),
    ("Black walnut", "bad", "Avoid (video). Contains juglone, which can inhibit the growth of sensitive plants such as tomatoes."),
    ("Butternut", "bad", "Avoid (video). A walnut relative included in the presenter's juglone warning."),
    ("Pecan", "bad", "Avoid (video). Included in the presenter's juglone warning. Pecan is in the walnut family; how much juglone it carries is debated."),
    ("Cedar", "slow", "Avoid (video). Naturally resists decay, which is why it's used for fences and bed walls."),
    ("Redwood", "slow", "Avoid (video). Resists decay."),
    ("Black locust", "slow", "Avoid (video). Among the most rot-resistant woods there is; it can sit almost unchanged for decades."),
]
labels = {"good": ('hk-good', "Use"), "bad": ('hk-bad', "Avoid: juglone"), "slow": ('hk-slow', "Avoid: resists decay")}
for name, kind, why in rows:
    cls, lab = labels[kind]
    add(f'<tr><td><strong>{name}</strong><br><span class="{cls}">{lab}</span></td><td>{why}</td></tr>')
add("</tbody></table></div>")
add(f"<h3>Materials to never bury {EXTRA}</h3>")
add("<p>Anything that might carry chemicals into soil you'll grow food in should stay out of the bed, whatever the species underneath:</p>")
add(fig("never-bury", "Six crossed-out materials: pressure-treated timber, painted wood, creosote, plywood and MDF, unknown pallets, diseased wood",
        "If you don't know what's in it or on it, leave it out."))
add('<div class="hk-table-wrap"><table><thead><tr><th>Material</th><th>Why to avoid it</th></tr></thead><tbody>')
for name, why in [
    ("Pressure-treated timber", "Treated with preservatives designed to stop rot. Older timber may contain arsenic-based treatments."),
    ("Painted or varnished wood", "Old paint can contain lead; coatings of unknown make-up don't belong in a food bed."),
    ("Construction offcuts", "Often treated, painted, glued or mixed with nails and fixings. Only use offcuts you can confirm are plain solid wood."),
    ("Creosote-treated wood", "Railway sleepers, old posts and poles. Creosote is a toxic tar preservative."),
    ("Wood with unknown preservatives", "If you can't confirm it's untreated, don't use it."),
    ("Chemically contaminated wood", "Anything that has had oil, fuel, solvents or herbicide spilled on it."),
    ("Plywood, MDF and chipboard", "Made with glues and resins, and they break down into a mush rather than a slow-feeding log."),
    ("Unknown industrial pallets", "Some pallets are chemically treated. Pallets stamped HT (heat-treated) are generally considered safer; avoid MB (methyl bromide) or unmarked pallets you can't trace."),
    ("Badly diseased or infested wood", "Wood with significant disease or wood-boring pests can carry the problem into your garden."),
]:
    add(f"<tr><td><strong>{name}</strong></td><td>{why}</td></tr>")
add("</tbody></table></div>")
add(f"<h3>Notes on choosing wood {EXTRA}</h3>")
add("<ul>"
    "<li><strong>Untreated is non-negotiable.</strong> Plain logs and branches from known trees are the safest choice.</li>"
    "<li><strong>Aged wood is better than fresh.</strong> Logs that have been lying around for a season or more have started to break down, absorb water more readily, and are less likely to resprout. Willow and poplar in particular can sprout from fresh cuttings.</li>"
    "<li><strong>Partly rotten logs are a gift.</strong> They're already full of fungi, hold more water and settle less later. They also lock up nitrogen sooner, so keep the soil above them generous.</li>"
    "<li><strong>Hardwoods vs softwoods.</strong> Dense hardwoods like oak last longer and feed the bed slowly over many years. Lighter woods such as poplar, birch, pine and fir break down faster, giving quicker benefits but more settling. Mixing both is a sensible middle ground.</li>"
    "<li><strong>Wood chips and small branches</strong> break down much faster than logs and have a lot of surface area, so they tie up nitrogen faster. They're great as a layer above the logs, not as a substitute for soil in the root zone.</li>"
    "</ul>")

# ---------------- sourcing
add('<h2 id="sourcing">Where to source your logs</h2>')
add(fig("sourcing", "Four numbered cards: arborists and tree surgeons, hardwood workshops, firewood suppliers, your own garden",
        "The four sources covered in the video."))
add('<ol>'
    f'<li><strong>Local arborists and tree surgeons.</strong> {VIDEO} They cut trees every day and often have to pay to dispose of the wood. The presenter sourced enough logs this way to fill <strong>more than 15 raised beds</strong>.</li>'
    f'<li><strong>Hardwood workshops.</strong> {VIDEO} Furniture makers and joiners may give away offcuts. Only take pieces you can confirm are <strong>untreated solid wood</strong>, never plywood, MDF or painted scraps.</li>'
    f'<li><strong>Firewood suppliers.</strong> {VIDEO} Seasoned firewood is already dry and split, which makes it easy to pack.</li>'
    f'<li><strong>Your own garden.</strong> {VIDEO} Pruning and fallen branches cost nothing, and you know exactly where they came from.</li>'
    '</ol>')
add(note("warn", "Before you accept a load:", "ask what species it is, whether the tree was diseased or infested, and whether any of the wood has been treated or sprayed. A load of mixed arborist wood can include walnut or cedar, so look through it before it goes in the bed."))

# ---------------- problems
add('<h2 id="problems">The five problems with burying logs</h2>')
add("<p>Burying wood isn't free of downsides. The video walks through five, and each one has a fix.</p>")

add('<div class="hk-problem"><h3 id="nitrogen">1. Nitrogen lockout</h3>')
add(f"<p>{VIDEO} Wood is very high in carbon and very low in nitrogen, about <strong>400 parts carbon to 1 part nitrogen</strong> according to the video. The microbes that break wood down need nitrogen too, and they take it from the soil around them.</p>")
add(fig("nitrogen-boundary", "Diagram of a buried log surrounded by a band where microbes draw nitrogen from the soil, with plant roots reaching down",
        "Nitrogen gets tied up mostly at the boundary where wood meets soil. Roots that grow down into that zone may find less nitrogen."))
add(f"<p>{EXTRA} This is called nitrogen immobilisation. The nitrogen isn't lost forever: it's held in the bodies of microbes and released again as they die and decompose. The effect is strongest close to the wood and in the first year or two. Two things reduce the risk:</p>")
add("<ul><li><strong>A deep layer of real growing soil</strong> above the wood, so most roots never reach the boundary.</li><li><strong>Some extra nitrogen</strong> during the build. The video adds light applications of fertiliser between layers (see the <a href=\"#build\">build steps</a>).</li></ul>")
add(note("tip", "Watch for:", "pale or yellowing older leaves, especially on hungry crops such as brassicas and leafy greens. A nitrogen-rich feed, compost or well-rotted manure usually sorts it out."))
add("</div>")

add('<div class="hk-problem"><h3 id="termites">2. Termites and carpenter ants</h3>')
add(f"<p>{VIDEO} A large pile of buried wood can attract wood-eating insects. The video suggests siting wood-filled beds roughly <strong>10 to 15 feet (about 3 to 4.5 m) from the house</strong>.</p>")
add(fig("termite-distance", "A house and a wood-filled raised bed with a 10 to 15 foot gap marked between them",
        "Distance reduces the risk of insects moving from the bed to your home. It isn't a guarantee of termite protection."))
add(f"<p>{EXTRA} Keep beds away from decks, sheds, fences and any wooden structure, not just the house. Check the bed walls and nearby timber now and then. If termites are a known problem where you live, see the <a href=\"#tropical\">tropical section</a> for extra precautions.</p>")
add("</div>")

add('<div class="hk-problem"><h3 id="animals">3. Burrowing animals</h3>')
add(f"<p>{VIDEO} The gaps and soft soil around logs are attractive to <strong>moles, voles and gophers</strong>. If they're around, the video's answer is a layer of heavy-duty <strong>¼-inch (6.35 mm) hardware cloth</strong> laid on the ground before you build, extending beyond the bed's perimeter and fixed securely so animals can't push past the edges.</p>")
add(fig("mesh-barrier", "Cut-away of a raised bed sitting on quarter-inch metal mesh that extends past the walls, with a mole blocked underneath",
        "The mesh goes down first, wider than the bed, and is fixed to the frame."))
add(f"<p>{EXTRA} Galvanised mesh is the usual choice. <strong>Stainless steel</strong> mesh lasts much longer in damp soil where it's available and affordable. Either way, the mesh will eventually corrode, so a wood-filled bed that's meant to last decades may need it renewed when you rebuild.</p>")
add("</div>")

add('<div class="hk-problem"><h3 id="settling">4. Soil settling and air pockets</h3>')
add(f"<p>{VIDEO} Logs thrown in loosely leave large cavities. As the soil above trickles into them, and as the wood itself softens, the bed sinks. The video describes beds losing <strong>6 to 12 inches (15 to 30 cm)</strong> of height in extreme cases.</p>")
add(fig("packing-compare", "Two raised beds: one with loosely placed logs and dark air gaps, one with tightly fitted logs and soil filling every gap",
        "The fix is packing: largest logs first, fitted like a Jenga puzzle, then soil shaken and washed into every gap."))
add("<p>The fix is in the build method: biggest logs at the bottom, pieces fitted closely, soil added between them, then shaken and hosed down into the crevices. Slightly overfilling the bed and letting it settle overnight covers whatever sinking is left.</p>")
add("</div>")

add('<div class="hk-problem"><h3 id="drainage">5. Drainage and anaerobic conditions</h3>')
add(f"<p>{VIDEO} If water can't drain out of the bottom of the bed, the logs end up sitting in water. Without oxygen, the decomposition turns anaerobic: the bed can start to smell sour or rotten, and roots that reach down there struggle.</p>")
add(fig("drainage", "Two beds: one where water drains through damp logs into the ground, one with standing water around the bottom logs",
        "Moist wood is the goal. Standing water is a problem."))
add(f"<p>{EXTRA} There's a difference between wood that holds moisture, which is the benefit people want, and a bed with standing water in the bottom. Build on ground that drains, avoid low spots where water collects after rain, and on heavy clay consider loosening the ground underneath first or raising the bed on a layer of coarse material. If a bed smells bad or stays soggy, stop watering and check whether water is pooling at the base.</p>")
add("</div>")

# ---------------- build
add('<h2 id="build">Step-by-step construction method</h2>')
add(f"<p>These are the steps shown in the video, in order. Each step is from the video unless it's marked {EXTRA}. The video gives no exact amount of fertiliser for any step, so this guide doesn't invent one: follow the label of the product you use and keep it light.</p>")


def steps(items):
    out = ['<ol class="hk-steps">']
    for n, title, body in items:
        out.append(f'<li><span class="hk-num">{n}</span><div><strong>{title}</strong><p>{body}</p></div></li>')
    out.append("</ol>")
    return "".join(out)


add("<h3>Prepare the base</h3>")
add(fig("steps-1-4", "Four panels showing steps 1 to 4: marking out a well-drained site, laying mesh, placing the largest logs, packing logs tightly",
        "Steps 1 to 4."))
add(steps([
    (1, "Select and prepare a well-drained site", f"Choose a sunny, level spot that doesn't flood. {EXTRA} Clear weeds and grass, and keep the bed away from the house and other wooden structures."),
    (2, "Install metal mesh if burrowing pests are a concern", "Lay heavy-duty ¼-inch (6.35 mm) hardware cloth across the base, extending beyond the perimeter, and fix it securely to the frame."),
    (3, "Put the largest logs in first", "The biggest, heaviest pieces go flat on the bottom."),
    (4, "Fit logs closely together, like a Jenga puzzle", "Turn and swap pieces so they nest together with as few gaps as possible. Fill spaces between big logs with smaller ones."),
]))
add("<h3>Fill the gaps</h3>")
add(fig("steps-5-8", "Four panels showing steps 5 to 8: wetting the logs, pouring soil between them, shaking it down, washing it into gaps with a hose jet",
        "Steps 5 to 8. The hose jet is one of the most useful tricks in the video."))
add(steps([
    (5, "Wet the logs", "Give the wood a thorough soaking. Pre-soaking logs before they go in is optional."),
    (6, "Add soil between the logs", "Pour soil over the log layer so it runs down into the spaces."),
    (7, "Shake the soil down into the crevices", "Jiggle and tap so the soil falls into the gaps rather than bridging over them."),
    (8, "Use the hose jet to settle soil into gaps", "A strong jet of water washes soil deep into the cavities that shaking can't reach. Repeat until the soil stops disappearing."),
]))
add("<h3>Build the middle layers</h3>")
add(fig("steps-9-12", "Four panels showing steps 9 to 12: a light fertiliser sprinkle, twigs and grass clippings, buried food scraps, and a second light feed",
        "Steps 9 to 12."))
add(steps([
    (9, "Add a light application of suitable fertiliser", "A light dusting over the logs and soil gives the microbes nitrogen so they take less from your plants. The video gives no exact quantity."),
    (10, "Add twigs, grass clippings and suitable garden debris", "Smaller woody material and green waste fill the next layer. Grass clippings add nitrogen. Avoid weeds that have gone to seed or diseased plants."),
    (11, "Food scraps (optional)", f"The video mentions food scraps as a possible addition. {EXTRA} Keep to plant-based kitchen scraps such as vegetable peelings, fruit cores and coffee grounds; leave out meat, fish, dairy, fat and cooked leftovers, which smell and attract rats, dogs and other pests. Bury scraps well below the surface and cover them with soil straight away."),
    (12, "Apply a second light fertiliser layer if needed", "Another light application before the soil goes on, especially if the bed has a lot of woody material."),
]))
add("<h3>Finish with soil</h3>")
add(fig("steps-13-16", "Four panels showing steps 13 to 16: a layer of budget soil, premium soil on top, optional organic feed, and a slight overfill",
        "Steps 13 to 16: the split soil approach puts your best soil where the roots are."))
add(steps([
    (13, "Add the lower-cost growing soil", "Use a cheaper, suitable soil mix for the middle of the bed."),
    (14, "Finish with high-quality planting soil", "Save the premium soil for the top layer, where most roots grow."),
    (15, "Optionally apply organic fertiliser near the surface", "A final organic feed mixed into the top few inches."),
    (16, "Slightly overfill the bed", "Mound the soil a little above the rim to allow for settling."),
]))
add(fig("steps-17-19", "Three panels showing steps 17 to 19: watering thoroughly, leaving the bed to settle overnight, and topping up before planting",
        "Steps 17 to 19."))
add(steps([
    (17, "Water thoroughly", "Soak the whole bed so the soil settles around the wood."),
    (18, "Let the bed settle", "Leave it, ideally overnight."),
    (19, "Check the level and plant", "Top up any low spots with good soil, then plant."),
]))
add(note("tip", "Extra advice:", "a 2 to 5 cm (1 to 2 in) layer of mulch such as straw, leaves or wood chips on top after planting helps keep the surface moist, especially in hot climates. Keep wood-chip mulch on the surface rather than mixing it into the soil."))

# ---------------- layers
add('<h2 id="layers">How deep should the layers be?</h2>')
add(f"<p>{EXTRA} The video doesn't give exact layer depths, so the diagram below is a suggestion, using a 76 cm (30 in) bed like the one in the video. The principle that matters most: keep a generous layer of real growing soil above the wood so roots have plenty of room before they reach the nitrogen-hungry zone.</p>")
add(fig("layers-76cm", "Labelled cross-section of a 76 centimetre raised bed showing mulch, high-quality soil, additional soil, twigs and compost, packed logs, optional mesh and free-draining ground",
        "Suggested layers for a 76 cm (30 in) bed. These depths are recommendations for illustration, not measurements from the video."))
add('<div class="hk-table-wrap"><table><thead><tr><th>Layer</th><th>Suggested depth</th><th>Notes</th></tr></thead><tbody>'
    "<tr><td>Surface mulch</td><td>1–2 in · 3–5 cm</td><td>Straw, leaves or chips, added after planting.</td></tr>"
    "<tr><td>High-quality growing soil</td><td>8 in or more · 20 cm+</td><td>The main root zone. Deeper for carrots, parsnips and other deep-rooted crops.</td></tr>"
    "<tr><td>Additional growing soil</td><td>about 6 in · 15 cm</td><td>A cheaper suitable mix.</td></tr>"
    "<tr><td>Twigs, clippings and compost</td><td>about 4 in · 10 cm</td><td>With a light fertiliser application.</td></tr>"
    "<tr><td>Large logs packed with soil</td><td>about 11 in · 28 cm</td><td>Roughly the bottom third of the bed, gaps filled with soil.</td></tr>"
    "<tr><td>Metal mesh (optional)</td><td>at ground level</td><td>Only where burrowing animals are a problem.</td></tr>"
    "</tbody></table></div>")
add("<p>For shallower beds, cut the wood layer first and keep the soil depth. A bed under about 30 cm (12 in) tall usually has no room for logs at all; see the <a href=\"#faq\">FAQ</a>.</p>")

# ---------------- calculator
add('<h2 id="calculator">How much will you need?</h2>')
add(f"<p>{EXTRA} To estimate your own bed, multiply length × width × height to get the total volume, then decide what share of the depth will be the woody layer. Here's how the numbers work out for some common sizes:</p>")
add('<div class="hk-table-wrap"><table><thead><tr><th>Bed (L × W × H)</th><th>Total volume</th><th>Woody share</th><th>Woody layer</th><th>Soil on top</th></tr></thead><tbody>')
calc = [
    ("2.4 × 1.2 × 0.76 m<br>(8 × 4 ft × 30 in)", 2.27, 80.0),
    ("2.4 × 1.2 × 0.5 m<br>(8 × 4 ft × 20 in)", 1.44, 50.9),
    ("2.0 × 1.0 × 0.6 m<br>(6.6 × 3.3 ft × 24 in)", 1.20, 42.4),
]
for label, m3, ft3 in calc:
    first = True
    for pct in (30, 40):
        wood_m3, wood_ft3 = m3 * pct / 100, ft3 * pct / 100
        soil_m3, soil_ft3 = m3 - wood_m3, ft3 - wood_ft3
        lead = f'<td rowspan="2"><strong>{label}</strong></td><td rowspan="2">{m3:.2f} m³<br>{ft3:.0f} ft³<br>{m3 * 1000:,.0f} L</td>' if first else ""
        add(f"<tr>{lead}<td>{pct}%</td><td>{wood_m3:.2f} m³ · {wood_ft3:.0f} ft³</td><td>{soil_m3:.2f} m³ · {soil_ft3:.0f} ft³<br>≈ {soil_m3 * 1000 / 50:.0f} × 50 L bags</td></tr>")
        first = False
add("</tbody></table></div>")
add("<p><strong>Formula:</strong> volume (m³) = length × width × height in metres. 1 m³ = 1,000 litres = 35.3 ft³. Woody layer = volume × woody share. Soil on top = volume − woody layer.</p>")
add(note("info", "These are estimates.", "The woody layer isn't solid wood: soil gets washed into the gaps between logs, and twigs, clippings and compost take up space too. So you'll still need some soil for the woody zone, and the bed will settle. Buy a little more than the \"soil on top\" figure, and remember the presenter's own estimate is up to about 60% less soil, not 60% wood."))

# ---------------- decomposition
add('<h2 id="decomposition">What happens as wood decomposes?</h2>')
add(f"<p>{EXTRA} A wood-filled bed changes from year to year. How fast depends on the species, the size of the pieces, temperature and moisture: soft, thin, already-rotting wood in a warm, damp bed can break down in a few years, while big oak rounds in a cool climate can last well over a decade.</p>")
add(fig("decomposition-stages", "Three stages: a fresh log being colonised by fungi, a softened darker log with a mushroom, and crumbly dark organic matter",
        "Early, middle and later stages. Timescales vary widely."))
add("<h4>Early stage</h4><ul><li>Fungi and bacteria colonise the wood, starting at the bark, cut ends and cracks.</li><li>This is when nitrogen immobilisation is strongest.</li><li>Fresh, dry wood absorbs water slowly.</li></ul>")
add("<h4>Intermediate stage</h4><ul><li>The wood softens, darkens and starts to crumble. Fungal threads and sometimes mushrooms appear.</li><li>Soil animals such as worms and beetles move in.</li><li>The bed settles as the wood loses structure, so expect to top up.</li></ul>")
add("<h4>Later stage</h4><ul><li>The wood has become spongy organic matter that can absorb and hold water.</li><li>Microbes release the nitrogen they were holding, and the bed becomes richer.</li><li>Faster-rotting species reach this stage years before dense hardwoods.</li></ul>")
add(note("info", "A realistic expectation:", "not every buried log becomes a water reservoir. Rot-resistant woods, very dry climates and waterlogged beds all slow or change the process."))

# ---------------- tropical
add('<h2 id="tropical">Tropical gardens: Zanzibar, Pemba and East Africa</h2>')
add(f"<p>{EXTRA} The video was made for a temperate climate. Growing in Zanzibar, Pemba and coastal East Africa changes several things, and the advice in this section is Nature's Gardeners' own, not the presenter's.</p>")
add(fig("tropical-bed", "A tropical raised bed with thick mulch, packed wood and good drainage, with sun, a palm tree and heavy rain",
        "In the tropics, drainage and termites matter more, and wood breaks down faster."))
add("<ul>"
    "<li><strong>Heat and humidity.</strong> Warmth speeds up decomposition. Wood breaks down faster than in the video's climate, which means quicker benefits but more settling and more frequent top-ups.</li>"
    "<li><strong>Heavy seasonal rain.</strong> The long and short rains can saturate a bed. Drainage is the first priority: build on higher ground, avoid spots where water stands, and consider a layer of coarse gravel or rubble under the bed on heavy soil.</li>"
    "<li><strong>Termites.</strong> Termites are common and active all year. Keep beds well away from houses and wooden structures, check the bed and frame regularly, and consider using less wood with more coarse organic material in areas with heavy termite activity.</li>"
    "<li><strong>Dry season.</strong> A thick surface mulch of grass, palm fronds or leaves shades the soil and slows evaporation. This is where the long-term moisture-holding benefit of rotted wood is most useful.</li>"
    "<li><strong>Local wood sources.</strong> Tree-pruning waste from gardens, hotels, farms and roadside clearing is common. Ask what species it is before you take it.</li>"
    "</ul>")
add("<h3>Tropical wood reference</h3>")
add("<p>None of these species was covered in the video, and we're not aware of any of them being tested specifically for hügelkultur. The table separates what's reasonably well known about each wood from our tentative suggestions.</p>")
add('<div class="hk-table-wrap"><table><thead><tr><th>Material</th><th>What\'s known</th></tr></thead><tbody>')
for name, known, sugg, cls in [
    ("Mango", "Common pruning wood; the timber is not durable and decays fairly quickly in the ground.", "Likely a good, fast-breaking fill.", "hk-good"),
    ("Guava", "Dense, hard branch wood, usually in small sizes from pruning.", "Probably useful as smaller filler pieces.", "hk-good"),
    ("Jackfruit", "The heartwood is a fairly durable timber with some reported resistance to termites.", "Usable, but expect it to break down slowly.", "hk-maybe"),
    ("Papaya stems", "Soft, hollow, very wet stems, not true wood. They rot down within months.", "Fine as green material; won't give long-term structure.", "hk-maybe"),
    ("Banana pseudostems", "Mostly water and soft fibre, not wood. They break down quickly and release moisture and potassium.", "Use chopped in a middle layer, not as logs.", "hk-maybe"),
    ("Coconut husks", "Fibrous and slow to decompose; coir holds a lot of water.", "Useful for moisture retention; soak first, as some husks are salty.", "hk-good"),
    ("Coconut trunks", "Fibrous palm wood. Rotting coconut wood is a breeding site for the coconut rhinoceros beetle, a serious palm pest.", "Avoid near coconut palms, or use only well away from them.", "hk-bad"),
    ("Neem", "The wood is durable and known for resisting termites and decay.", "Slow to break down; better used elsewhere.", "hk-slow"),
    ("Casuarina", "Dense wood, widely planted on the coast. Its needle litter is reported to inhibit some plants.", "Use logs sparingly and leave out the needles until more is known.", "hk-maybe"),
    ("Eucalyptus", "Many species are durable and decay-resistant. Leaves and bark contain oils reported to suppress some plant growth.", "Not recommended as the main fill.", "hk-slow"),
    ("Mangrove wood", "Mangroves protect the coast, shelter fish and are legally protected in Tanzania, including Zanzibar.", "Do not harvest or use.", "hk-bad"),
]:
    add(f'<tr><td><strong>{name}</strong></td><td>{known}<br><span class="{cls}">Tentative: {sugg}</span></td></tr>')
add("</tbody></table></div>")
add(note("warn", "Avoid:", "mangrove wood, unidentified timber, and anything from building sites, boatyards or workshops that might be treated, painted or contaminated."))

# ---------------- faq
add('<h2 id="faq">Common questions and troubleshooting</h2>')
for q, a in [
    ("Can I use freshly cut logs?", "<p>Yes, but aged wood is better. Fresh wood holds less water at first, ties up nitrogen as it starts to rot, and some species such as willow and poplar can resprout. If fresh wood is all you have, use it, keep the soil above it generous and add a little extra nitrogen.</p>"),
    ("Is rotten wood better?", "<p>Partly rotten wood is excellent: it absorbs water faster, settles less later and is already full of fungi. Wood that's crumbling to dust is closer to compost and won't add much bulk. Avoid wood that's rotten because of a disease you don't want in the garden.</p>"),
    ("Do I need to soak the wood?", "<p>The video wets the logs as part of the build, and says pre-soaking beforehand is optional. Dry wood takes a long time to absorb water, so soaking helps the bed get going, especially in dry weather.</p>"),
    ("Can I use pine?", "<p>Yes. Pine is on the video's recommended list. It breaks down faster than most hardwoods.</p>"),
    ("Can I use cedar?", "<p>The video advises against it. Cedar resists decay, so it lasts far too long to feed the bed. That's the same reason it's popular for building bed walls.</p>"),
    ("Can I use wood chips?", "<p>Yes, as a layer above the logs or as surface mulch. Chips break down faster than logs and tie up nitrogen faster, so keep them out of the main root zone or add some nitrogen with them.</p>"),
    ("Will wood steal nitrogen?", "<p>It borrows it. Microbes breaking down the wood take nitrogen from the surrounding soil, mainly right at the wood's surface. A deep soil layer above the wood and light fertiliser applications, as in the video, keep your plants supplied. The nitrogen is released again later.</p>"),
    ("Will it attract termites?", "<p>It can. That's why the video suggests keeping beds about 10 to 15 feet (3 to 4.5 m) from the house. In termite-prone areas, keep beds away from all wooden structures and check them regularly.</p>"),
    ("Can I plant immediately?", "<p>The video lets the bed settle, ideally overnight, then tops it up and plants. You can plant the next day as long as the top layer is good soil.</p>"),
    ("What causes my soil to sink?", "<p>Air pockets between logs collapsing, and the wood itself softening over time. Packing logs tightly, washing soil into the gaps with a hose jet and slightly overfilling all help. Some sinking over the years is normal, so top up with compost and soil each season.</p>"),
    ("How can I prevent waterlogging?", "<p>Build on free-draining ground, avoid low spots, and on heavy clay loosen the ground underneath or add a coarse drainage layer. Don't line the bottom of the bed with plastic.</p>"),
    ("Will my bed need less watering?", "<p>Possibly, once the wood has started to break down and act like a sponge. In the first year or two, water as you would any raised bed.</p>"),
    ("Is metal mesh necessary?", "<p>Only if moles, voles, gophers or other burrowing animals are a problem where you live. If they are, the video recommends heavy-duty ¼-inch (6.35 mm) hardware cloth, wider than the bed and fixed securely.</p>"),
    ("Can I use sawdust?", "<p>Only untreated sawdust, and only in thin layers. It packs down tightly, can block water and air, and ties up a lot of nitrogen fast. Never use sawdust from treated timber, plywood or MDF.</p>"),
    ("Can I use grass clippings?", "<p>Yes, the video includes them. They add nitrogen, which helps balance the wood. Spread them in thin layers so they don't mat into a slimy layer, and avoid clippings from lawns treated with weedkiller.</p>"),
    ("Can I bury kitchen scraps?", "<p>The video mentions food scraps. Stick to plant-based scraps, bury them deep and cover them straight away. Leave out meat, fish, dairy, oils and cooked food, which attract pests.</p>"),
    ("How much soil is needed above the logs?", "<p>The video doesn't give a figure. As a suggestion, aim for at least 20 to 30 cm (8 to 12 in) of real growing soil above the wood, and more for deep-rooted crops.</p>"),
    ("How long will the wood last?", "<p>Anywhere from a few years for soft, thin or already-rotting wood in a warm climate to well over a decade for large hardwood logs in a cool one.</p>"),
    ("What should I do if leaves turn yellow?", "<p>Yellowing older leaves often mean nitrogen shortage, which is common in the first season of a wood-filled bed. Feed with a nitrogen-rich fertiliser, compost or well-rotted manure. If the bed is also soggy or smells, check drainage first.</p>"),
    ("Are fungi or mushrooms normal?", "<p>Yes. Fungi are the main decomposers of wood, and mushrooms are a sign the process is working. Don't eat any mushroom unless an expert has identified it.</p>"),
    ("Is this suitable for shallow raised beds?", "<p>Not really. Beds less than about 30 cm (12 in) tall need all their depth for soil. The method pays off most in beds 50 cm (20 in) tall or more.</p>"),
]:
    add(faq(q, a))

# ---------------- checklist
add('<h2 id="checklist">Build checklist</h2>')
add("<p>Screenshot or print this and tick off each step as you go.</p>")
add('<ul class="hk-check">')
for item in [
    "Well-drained, sunny site chosen", "Bed placed away from house and wooden structures", "Wood checked: species known, untreated, no walnut, cedar, redwood or black locust",
    "Mesh laid and fixed (if needed)", "Largest logs placed first", "Logs fitted tightly, Jenga-style", "Logs wetted (pre-soaked if you chose to)",
    "Soil added between logs", "Soil shaken into crevices", "Gaps washed in with the hose jet", "First light fertiliser layer", "Twigs, clippings and debris added",
    "Food scraps buried (optional)", "Second light fertiliser layer (if needed)", "Budget growing soil added", "High-quality soil on top",
    "Organic feed near the surface (optional)", "Bed slightly overfilled", "Watered thoroughly", "Left to settle overnight", "Level checked and topped up", "Planted and mulched",
]:
    add(f"<li>{item}</li>")
add("</ul>")

# ---------------- discuss
add('<div class="hk-discuss"><h2 id="discuss">Share your experience</h2>')
add("<p><strong>Have you tried burying wood in your raised beds? Which wood did you use, and how has it performed in your climate? Share your experience and photos with the Nature's Gardeners community.</strong></p>")
add("<p>Leave a comment below, or post photos of your build in <a href=\"/c/naturesgardeners/spaces/growing-journey\">Growing Journey</a>. Got a problem with a bed? Ask in <a href=\"/c/naturesgardeners/spaces/ask-for-help\">Ask for Help</a>.</p></div>")

add('<h2 id="sources">Sources</h2>')
add('<div class="hk-sources"><p>Primary source: Epic Gardening, <a href="https://www.youtube.com/watch?v=CVYYgYozf4A">How to fill raised beds with wood</a> (YouTube). Points marked "From the video" summarise the presenter\'s recommendations. Points marked "Extra advice", the tropical section and the layer depths are Nature\'s Gardeners\' additions based on general horticultural practice.</p>'
    "<p>All diagrams and illustrations are original artwork made for this guide. Photos are from the Nature's Gardeners library.</p></div>")
add("</article>")

sys.stdout.write("".join(parts))
