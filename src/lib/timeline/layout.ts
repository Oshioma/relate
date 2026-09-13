import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { claimInterval, claimIsPositioned, eventDateLabel, fractionOf, type TimeScale, type TimeWindow } from "./time";

// Turning a set of events into positions on a strip of pixels.
//
// Pure and separate from the component that draws it, because this is where the
// hard parts are: nothing that happens at 13.8 billion years wide is intuitive,
// and it is much easier to reason about "four events within six pixels of each
// other" as a function than as a render.
//
// THREE THINGS THIS DOES
//
// 1. Places every claim of every event, not just one per event — the
//    disagreement between sources is drawn, so each claim needs its own x.
// 2. Clusters what cannot be told apart. At "all of time" the whole of recorded
//    history is under a pixel wide; drawing 900 overlapping dots there is worse
//    than useless, so a crowd becomes one marker with a count that zooms into
//    its own span when tapped.
// 3. Packs what is left into rows so labels don't sit on top of each other,
//    and stops at a row count that fits the height it was given rather than
//    growing without limit.

/** How close two events have to be, in pixels, before a reader can't tell them apart. */
const CLUSTER_PX = 12;
/** How many crowded events it takes before a cluster is more honest than a pile. */
const CLUSTER_MIN = 4;
/** The gap between a marker and its own caption. */
const LABEL_GAP_PX = 6;

/**
 * HOW FAR AN EVENT MAY REACH BEYOND THE STRIP BEFORE IT IS CUT OFF.
 *
 * An event is drawn from its earliest claim to its latest. At a narrow window
 * that span can start a very long way off screen: "the age of the universe" in
 * a six-thousand-year window begins about 2.9 BILLION pixels to the left, and
 * a record whose first claim is 13.8 billion years ago is not unusual on this
 * timeline.
 *
 * Left unclamped that number does two bad things. The browser gets a div three
 * billion pixels wide and clips it, which is wasteful but invisible. The row
 * packer gets a footprint three billion pixels wide and CANNOT clip it: it
 * reserves the row from −2,900,000,000 to wherever the event ends, and because
 * events are packed in order of xFrom nothing can ever precede it there. One
 * deep-time record therefore consumes a whole row on its own, and six of them
 * consume six — which is what pushed everything else into the overflow row.
 *
 * So a footprint is clamped to the strip plus this margin. The margin is small
 * and deliberate: a bar that stops exactly at the edge looks like a bar that
 * ends there, and one that runs a little past it reads as continuing.
 */
const OFF_STRIP_MARGIN_PX = 24;

/**
 * Clamp one event's drawn extent to the strip.
 *
 * Only the FOOTPRINT is clamped. Each claim keeps its own true x — the claim
 * markers are drawn from those, and a claim that is genuinely off screen should
 * stay off screen rather than being dragged to the edge.
 */
function clampToStrip(xFrom: number, xTo: number, width: number): { xFrom: number; xTo: number } {
  return {
    xFrom: Math.max(-OFF_STRIP_MARGIN_PX, xFrom),
    xTo: Math.min(width + OFF_STRIP_MARGIN_PX, xTo),
  };
}

/** Breathing room between one event's label and the next event's marker. */
const ROW_GAP_PX = 14;

/**
 * HOW MUCH OF THE STRIP A RECORD'S SPAN MAY COVER BEFORE IT STOPS RESERVING ITS ROW.
 *
 * An event is drawn from its earliest claim to its latest, and a row is
 * reserved for the whole of that footprint so two events never draw on top of
 * one another. That is right for a record whose sources are two centuries
 * apart. It is wrong for one whose sources are fifteen thousand years apart:
 * Tiwanaku's radiocarbon date and Posnansky's astronomical one put its
 * footprint across 1,639 pixels of an 1,800-pixel strip, so once it landed on
 * a row NOTHING COULD EVER FOLLOW IT THERE. Four such records took four of the
 * five available rows, and forty-one events went into "+N" chips.
 *
 * Beyond this fraction the span stops being a bar anyone can read and becomes
 * background: it is drawn faded and dashed, and it reserves only its marker and
 * its caption, like a point event. Other events then sit along it, which is
 * exactly what a reader wants — the disagreement is still visible, and it is no
 * longer hiding the rest of the timeline behind it.
 */
const OVER_WIDE_FRACTION = 0.6;

/** True when a footprint is too wide to read as a span at this zoom. */
function isOverWide(xFrom: number, xTo: number, width: number): boolean {
  return xTo - xFrom > width * OVER_WIDE_FRACTION;
}

/**
 * How far along a row this event actually speaks for.
 *
 * Its own marker for an over-wide record, its whole footprint otherwise.
 */
function reserveEnd(item: PlacedEvent): number {
  return item.overWide ? item.xFrom : item.xTo;
}

// HOW WIDE A CAPTION MAY GET BEFORE IT WRAPS, AND HOW TALL IT MAY THEN GROW.
//
// Captions used to be one line, truncated with an ellipsis at a fixed width.
// That is the right answer when the strip is out of room and the wrong one
// nearly always: the events area is normally half empty vertically, and
// "Inanna becomes associate…" was being cut off above several hundred pixels of
// nothing. Horizontal space on a timeline is time — it is genuinely scarce, and
// a caption cannot simply be given more of it. Vertical space is not, so a long
// title goes DOWN instead of being thrown away.
//
// The box is therefore capped in width and allowed up to three lines; a row
// containing a wrapped caption is made taller to fit it, and only that row.
export const LABEL_BOX_PX = 200;
/** Narrow captions still need a box a couple of words wide, or every one of them wraps. */
const MIN_LABEL_BOX_PX = 56;
// Five lines is a caption nobody wants and still better than a title cut in
// half: at 200px that is around six hundred pixels of text, which only the
// longest title plus a deep-time date range plus a chip reaches.
export const MAX_LABEL_LINES = 5;
/** The caption's own left and right padding (pl-1 pr-2), which the box width includes. */
const LABEL_PAD_PX = 12;
/** The gap before the date and before each chip (ml-1.5). */
const LABEL_PIECE_GAP_PX = 6;
/** A chip's own left and right padding (px-1.5). */
const CHIP_PAD_PX = 12;

/** The height of a row whose tallest caption is one line. */
export const ROW_BASE_PX = 34;
/** What each extra line of a wrapped caption adds to its row. Matches leading-[17px]. */
export const LABEL_LINE_PX = 17;

/** How tall a row is, given the tallest caption in it. */
export function rowHeightFor(lines: number): number {
  return ROW_BASE_PX + Math.max(0, lines - 1) * LABEL_LINE_PX;
}

export type PlacedClaim = {
  id: string;
  x: number;
  /** The right-hand end for a claim that is a range or a coarse precision; equal to x for a point. */
  x2: number;
  isRange: boolean;
  isApproximate: boolean;
};

export type PlacedEvent = {
  event: TimelineEventWithClaims;
  row: number;
  /** Where the event's own marker goes — the earliest thing any source claims. */
  x: number;
  /** The full footprint of every claim, which is the disagreement made visible. */
  xFrom: number;
  xTo: number;
  claims: PlacedClaim[];
  disputed: boolean;
  showLabel: boolean;
  labelWidth: number;
  /** How many lines the caption needs at labelWidth. Its row is sized to the largest. */
  labelLines: number;
  /** Pixels from the top of the events area. Rows are not a fixed pitch — see rowHeightFor. */
  top: number;
  /** Which side of the marker the caption sits on. See the flip in layoutTimeline. */
  labelSide: "right" | "left";
  /** The event's date, written for a caption. Null when no claim supplies one. */
  dateLabel: string | null;
  /**
   * This record's sources disagree by more than the whole visible window.
   *
   * The rail between them is then no longer a readable measure of anything —
   * it is a line across the page — so it is drawn faded and dashed, and it
   * does not reserve the row it lies on. See OVER_WIDE_FRACTION.
   */
  overWide: boolean;
};

export type PlacedCluster = {
  key: string;
  row: number;
  /** Pixels from the top of the events area, like PlacedEvent.top. */
  top: number;
  x: number;
  count: number;
  /** The window to move to when this cluster is opened. */
  from: number;
  to: number;
};

/**
 * What a caption ACTUALLY measured, once the browser has drawn it.
 *
 * measureLabel is a good guess and a guess is not good enough here: one line
 * short and the date is clipped off the bottom, which is the bug this whole
 * change exists to remove. So the canvas measures each caption it has drawn and
 * hands the answer back, and from the second frame on the height reserved for a
 * caption is the height that caption takes. Keyed by event and by the box width
 * it was measured at, because the same title in a narrower box is a different
 * number of lines.
 */
export type MeasuredLabels = Map<string, { width: number; lines: number }>;

export type TimelineLayout = {
  events: PlacedEvent[];
  clusters: PlacedCluster[];
  rows: number;
  /** Every row's height in pixels, in order. Rows differ when captions wrap. */
  rowHeights: number[];
  /** What the events area actually used, so the caller can tell whether it fitted. */
  height: number;
};

/**
 * How much room a caption needs — as a box width and a number of lines.
 *
 * EVERYTHING DRAWN IN THE CAPTION IS MEASURED, or it is not really reserved.
 * The packer hides any caption whose neighbour is closer than the width
 * reserved for it, so anything drawn but not counted here is drawn through the
 * label next to it. The date was the first thing to be missed that way; the
 * "5 dates" and "Pending" chips were the second, which is why "Great Pyramid of
 * Giza" came out as "Great Pyr…" — the title was being squeezed by two things
 * the reservation did not know about.
 *
 * Then the total is folded onto up to MAX_LABEL_LINES lines rather than
 * truncated, because the strip runs out of width long before it runs out of
 * height.
 */
// MEASURING TEXT INSTEAD OF GUESSING AT IT.
//
// The width of a caption used to be characters × 6.2px. That is fine for
// deciding whether two labels collide and hopeless for deciding how many lines
// one needs: it was wrong by a word either way, so a caption the layout called
// two lines rendered as three and had its date clipped off the bottom.
//
// The browser will tell us exactly, so it is asked. One canvas, one cache, and
// the answer is the same one the renderer will arrive at. On the server — where
// this runs during SSR with width 0 and produces nothing — there is no canvas
// and the old estimate stands in.
let measureCtx: CanvasRenderingContext2D | null | undefined;
const textCache = new Map<string, number>();

function fontStack(): string {
  if (typeof window === "undefined") return "sans-serif";
  const family = window.getComputedStyle(document.body).fontFamily;
  return family || "sans-serif";
}

/**
 * Canvas measurement comes out a few percent under what the same string
 * actually occupies — letter-spacing, font features and the webfont the canvas
 * may not have are all small differences in the same direction. Three percent
 * short is a word, and a word short means the date wraps to a line the layout
 * didn't reserve and is clipped off the bottom.
 *
 * So the number is biased UP. The two ways to be wrong here are not equal:
 * over-reserving spends a few pixels of height, which this strip has plenty of,
 * and under-reserving loses words, which is the bug this whole change exists to
 * fix.
 */
const TEXT_SAFETY = 1.06;

function textWidth(text: string, weight: number, size: number): number {
  const key = `${weight}|${size}|${text}`;
  const cached = textCache.get(key);
  if (cached !== undefined) return cached;

  if (measureCtx === undefined) {
    measureCtx = typeof document === "undefined" ? null : document.createElement("canvas").getContext("2d");
  }
  const measured = measureCtx
    ? (measureCtx.font = `${weight} ${size}px ${fontStack()}`, measureCtx.measureText(text).width)
    : // No canvas: the old per-character estimate, scaled by size.
      text.length * size * 0.48;

  const width = measured * TEXT_SAFETY;
  textCache.set(key, width);
  return width;
}

/** One unbreakable run of text, and the gap that precedes it. */
type LabelToken = { width: number; gap: number };

/**
 * How much room a caption needs — as a box width and a number of lines.
 *
 * EVERYTHING DRAWN IN THE CAPTION IS MEASURED, or it is not really reserved.
 * The packer hides any caption whose neighbour is closer than the width
 * reserved for it, so anything drawn but not counted here is drawn through the
 * label next to it. The date was the first thing to be missed that way; the
 * "5 dates" and "Pending" chips were the second, which is why "Great Pyramid of
 * Giza" came out as "Great Pyr…" — the title was being squeezed by two things
 * the reservation did not know about.
 *
 * Then the content is flowed onto lines exactly as the browser will flow it,
 * rather than truncated, because the strip runs out of width long before it
 * runs out of height.
 */
function measureLabel(
  title: string,
  dateLabel: string | null,
  badges: { disputed: boolean; pending: boolean; claimCount: number }
): { width: number; lines: number } {
  const space = textWidth(" ", 500, 13);
  const tokens: LabelToken[] = [];

  // The title breaks between words like any prose.
  const words = title.split(/\s+/).filter(Boolean);
  words.forEach((word, index) => {
    tokens.push({ width: textWidth(word, 500, 13), gap: index === 0 ? 0 : space });
  });

  // The date and the chips do not break. "135,000 – 92,000 years ago" moves to
  // the next line whole, because half a date is worse than none.
  if (dateLabel) tokens.push({ width: textWidth(dateLabel, 500, 12), gap: LABEL_PIECE_GAP_PX });
  if (badges.disputed) {
    tokens.push({ width: textWidth(`${badges.claimCount} dates`, 600, 10) + CHIP_PAD_PX, gap: LABEL_PIECE_GAP_PX });
  }
  if (badges.pending) {
    tokens.push({ width: textWidth("Pending", 600, 10) + CHIP_PAD_PX, gap: LABEL_PIECE_GAP_PX });
  }

  const natural = tokens.reduce((sum, token) => sum + token.gap + token.width, 0);
  const content = Math.max(MIN_LABEL_BOX_PX, Math.min(LABEL_BOX_PX, natural));

  // Greedy line-filling: the same algorithm the browser uses, on the same
  // numbers, so the space reserved and the space taken are the same space.
  let lines = 1;
  let used = 0;
  for (const token of tokens) {
    const needed = used === 0 ? token.width : token.gap + token.width;
    if (used > 0 && used + needed > content) {
      lines += 1;
      used = token.width;
    } else {
      used += needed;
    }
    // A single word too long for the box breaks inside itself
    // (overflow-wrap: anywhere), which costs whole lines.
    if (used > content) {
      const extra = Math.ceil(used / content) - 1;
      lines += extra;
      used -= extra * content;
    }
  }

  // The BOX is the content plus its own padding. Measuring the two as one
  // number was worth twelve pixels — most of a word at this size.
  return { width: content + LABEL_PAD_PX, lines: Math.min(MAX_LABEL_LINES, lines) };
}

/**
 * Where a single claim sits, and how wide it is.
 *
 * Width comes from the claim itself wherever the claim supplies it — a proposed
 * range, or a source-stated ± tolerance. A bare point still gets drawn at the
 * width its precision implies, because "the 3rd century BCE" is a hundred-year
 * bar and drawing it as a dot would assert a precision the claim explicitly
 * disclaims. Below a pixel that width simply disappears, which is correct
 * rather than a special case.
 */
function placeClaim(
  claim: TimelineEventWithClaims["claims"][number],
  window: TimeWindow,
  width: number,
  scale: TimeScale
): PlacedClaim {
  // The interval already carries the width a point claim's precision implies
  // (see claimInterval), so nothing is added here — doing both was how a
  // century-precision claim ended up drawn two centuries wide.
  const interval = claimInterval(claim);
  // UNREACHABLE FROM THE LAYOUT, which filters positionless claims out before
  // calling this — and it has to, because the zero below is not "nowhere", it
  // is the left edge of the visible window. Kept only so the function is total,
  // and deliberately not given a plausible-looking position: a positionless
  // claim that reaches the canvas should be obviously wrong, not quietly wrong.
  if (!interval) return { id: claim.id, x: 0, x2: 0, isRange: false, isApproximate: false };
  return {
    id: claim.id,
    x: fractionOf(window, interval.lo, scale) * width,
    x2: fractionOf(window, interval.hi, scale) * width,
    isRange: interval.kind !== "point",
    isApproximate: claim.is_approximate || interval.kind !== "point",
  };
}

export function layoutTimeline(
  events: TimelineEventWithClaims[],
  window: TimeWindow,
  width: number,
  /**
   * The pixels the events area has. Rows are no longer a fixed pitch — a row
   * holding a wrapped caption is taller than one that isn't — so the budget has
   * to be given in pixels rather than as a row count the caller guessed.
   */
  availableHeight: number,
  scale: TimeScale = "linear",
  /** What the browser reported for captions it has already drawn. See MeasuredLabels. */
  measured?: MeasuredLabels
): TimelineLayout {
  if (width <= 0) return { events: [], clusters: [], rows: 0, rowHeights: [], height: 0 };

  const placed = events
    .map((event): PlacedEvent | null => {
      // ONLY THE CLAIMS THAT PLACE THEMSELVES GET DRAWN. A claim asserting no
      // finite beginning has no x, and letting it through produced a zero —
      // which is not "nowhere", it is the left edge of the window, so the
      // event's footprint stretched from the start of the visible span to
      // wherever its real dates were. An event with nothing positioned is
      // dropped from the strip entirely, which is the honest answer: it is
      // read on its record, because there is nowhere on a strip of time to
      // put a claim that names no time.
      const claims = event.claims.filter(claimIsPositioned).map((claim) => placeClaim(claim, window, width, scale));
      if (claims.length === 0) return null;
      const dateLabel = eventDateLabel(event.claims);
      const span = clampToStrip(
        Math.min(...claims.map((c) => Math.min(c.x, c.x2))),
        Math.max(...claims.map((c) => Math.max(c.x, c.x2))),
        width
      );
      const xFrom = span.xFrom;
      const xTo = span.xTo;
      // "Disputed" means the sources land in different places — two sources
      // that agree on 1066 are corroboration, and calling that a dispute would
      // make the whole signal meaningless.
      const disputed =
        claims.length > 1 &&
        claims.some((c) => Math.abs(c.x - claims[0].x) > 0.5 || Math.abs(c.x2 - claims[0].x2) > 0.5);
      const label = measureLabel(event.title, dateLabel, {
        disputed,
        pending: event.status === "pending",
        claimCount: event.claims.length,
      });
      // The measurement wins over the estimate, but only if it was taken at the
      // width this caption is about to be drawn at.
      const seen = measured?.get(event.id);
      const lines =
        seen && Math.abs(seen.width - label.width) < 0.5
          ? Math.min(MAX_LABEL_LINES, seen.lines)
          : label.lines;
      return {
        event,
        row: 0,
        top: 0,
        x: xFrom,
        xFrom,
        xTo,
        claims,
        disputed,
        overWide: isOverWide(xFrom, xTo, width),
        showLabel: true,
        labelWidth: label.width,
        labelLines: lines,
        labelSide: "right",
        dateLabel,
      };
    })
    .filter((item): item is PlacedEvent => item !== null)
    // EVENTS OFF THE EDGE ARE NOT DRAWN AT ALL.
    //
    // Without this they were: an event placed at x = −900 keeps its caption,
    // because a caption 190px wide starting at −894 still "fits" inside the
    // canvas by the arithmetic. It then renders at Math.max(0, −894) = 0. Six
    // events off the left edge therefore drew six captions stacked on the same
    // pixel, which is what a reader sees as an unreadable smear at the left of
    // the strip.
    //
    // It shows up most while a window is still loading, when the strip is
    // holding the PREVIOUS window's events — most of which are, by definition,
    // somewhere else in time.
    //
    // Partly-visible events stay: a claim whose range crosses the edge really
    // is in view, and clipping the bar at the boundary is the honest drawing of
    // it. Only events with no part of themselves on screen are dropped.
    .filter((item) => item.xTo >= 0 && item.xFrom <= width)
    .sort((a, b) => a.xFrom - b.xFrom);

  // --- Cluster the indistinguishable ------------------------------------------------
  //
  // HOW MANY ROWS THERE ARE TO STACK A CROWD ACROSS, which is what decides
  // whether a crowd needs collapsing at all. Optimistic, like the packing
  // below: it assumes one-line rows, and the height budget is applied properly
  // once the real heights are known.
  const maxRows = Math.max(1, Math.floor(availableHeight / ROW_BASE_PX));
  const clusters: PlacedCluster[] = [];
  const survivors: PlacedEvent[] = [];
  const yearsPerPixel = (window.to - window.from) / width;

  let i = 0;
  while (i < placed.length) {
    let j = i + 1;
    // A run of events that all start within CLUSTER_PX of the first, and none
    // of which is wide enough to be worth drawing as a span of its own.
    while (
      j < placed.length &&
      placed[j].xFrom - placed[i].xFrom < CLUSTER_PX &&
      placed[j].xTo - placed[j].xFrom < CLUSTER_PX
    ) {
      j++;
    }
    const run = placed.slice(i, j);
    // A CROWD IS ONLY COLLAPSED WHEN THE ROWS CANNOT HOLD IT.
    //
    // Rows exist precisely to separate things that share an x, and this ran
    // before the rows were packed — so six events a few pixels apart became a
    // "6" chip while nine rows sat empty underneath it. On a real timeline that
    // hid thirty events behind three chips while only two were genuinely out of
    // room, and the whole strip read as "no events here, zoom in".
    //
    // The crowd is now handed to the packer whenever the rows could stack it,
    // and the packer's own overflow is the backstop for what will not fit. The
    // original reason for clustering is untouched: at "all of time" a thousand
    // events land on one pixel, no number of rows can show them apart, and one
    // marker with a count is the honest drawing of that.
    const tooManyToStack = run.length >= Math.max(CLUSTER_MIN, maxRows + 1);
    if (tooManyToStack) {
      const x = run.reduce((sum, item) => sum + item.xFrom, 0) / run.length;
      const from = window.from + (Math.min(...run.map((r) => r.xFrom)) - CLUSTER_PX) * yearsPerPixel;
      const to = window.from + (Math.max(...run.map((r) => r.xTo)) + CLUSTER_PX) * yearsPerPixel;
      clusters.push({ key: run.map((r) => r.event.id).join(":").slice(0, 60), row: 0, top: 0, x, count: run.length, from, to });
    } else {
      survivors.push(...run);
    }
    i = j;
  }

  // --- Pack into rows ---------------------------------------------------------------
  //
  // Two reservations per row, not one. `labelEnds` is how far a row is spoken
  // for including the caption; `markerEnds` is how far it is spoken for by the
  // marker alone. An event takes the first row where its LABEL fits, and only
  // when every row is captioned does it squeeze into one where the marker fits
  // — so labels spread out while they can, and a crowded stretch degrades to
  // bare dots rather than to events that aren't drawn.
  //
  // The row limit here is optimistic: it assumes every row ends up one line
  // tall, and the height budget is applied properly further down, once each
  // row's contents — and therefore its real height — are known.
  // (maxRows is worked out before the clustering above, which needs it.)
  const labelEnds: number[] = [];
  const markerEnds: number[] = [];
  let placedRows: PlacedEvent[] = [];
  const overflow: PlacedEvent[] = [];

  for (const item of survivors) {
    const start = item.xFrom - 6;

    let row = labelEnds.findIndex((rowEnd) => rowEnd <= start);
    if (row === -1 && labelEnds.length < maxRows) {
      row = labelEnds.length;
      labelEnds.push(-Infinity);
      markerEnds.push(-Infinity);
    }
    if (row === -1) row = markerEnds.findIndex((rowEnd) => rowEnd <= start);
    if (row === -1) {
      overflow.push(item);
      continue;
    }

    item.row = row;
    const reserved = reserveEnd(item);
    markerEnds[row] = reserved + ROW_GAP_PX;
    labelEnds[row] = reserved + item.labelWidth + ROW_GAP_PX;
    placedRows.push(item);
  }

  // CAPTIONS ARE DECIDED BEFORE THE HEIGHT BUDGET IS SPENT, NOT AFTER.
  //
  // This used to run further down, and that order was quietly throwing rows
  // away. A row is as tall as its tallest caption, and every event arrives
  // claiming it will show one — so the budget was spent against captions three
  // lines deep that this pass then decided not to draw at all. On a real
  // community's timeline that meant eleven rows were packed, six were given up
  // as unaffordable, sixteen events were pushed into "+N" chips, and the strip
  // finished 255 pixels tall inside a 400-pixel box. The room was there the
  // whole time; the estimate was wrong.
  //
  // Deciding captions first makes the heights real before anything is given up.
  const decideCaptions = (rows: PlacedEvent[]) => {
    // Then decide captions, per row, now that the row's contents are known: a
    // label shows when the next thing in its own row starts far enough to the
    // right of it. survivors is sorted by xFrom, so each row is already in order.
    const rowContents = new Map<number, PlacedEvent[]>();
    for (const item of rows) {
      const list = rowContents.get(item.row);
      if (list) list.push(item);
      else rowContents.set(item.row, [item]);
    }
    // CAPTIONS, AND WHICH SIDE THEY GO ON.
    //
    // A label normally sits to the right of its event. Near the right-hand edge
    // that runs it off the strip: with events bunched in the last fifth of a
    // 22,000-year window, five of ten captions were drawing past the edge and
    // being clipped, so events that WERE on screen looked as though they were
    // missing. Nothing was lost — the words were just cut in half by the canvas.
    //
    // So a caption that will not fit on the right flips to the left of its own
    // marker, where there is usually nothing but empty axis. It flips only if
    // that space is genuinely free: the previous event in the same row has to
    // end before it starts, or the label is dropped as it always was. Better no
    // caption than two captions on top of each other.
    for (const list of rowContents.values()) {
      // How far along this row anything has been drawn — markers AND the labels
      // already given a side. Checking the previous MARKER is not enough: a
      // caption that flips left lands in the space the previous event's caption
      // is using, and the two draw on top of each other. This is the only
      // quantity that knows about both.
      let occupiedUntil = -Infinity;

      for (let index = 0; index < list.length; index++) {
        const item = list[index];
        const next = list[index + 1];

        const rightEnd = item.xTo + LABEL_GAP_PX + item.labelWidth;
        const clearOfNext = !next || next.xFrom > rightEnd + ROW_GAP_PX;
        if (clearOfNext && rightEnd <= width) {
          item.showLabel = true;
          item.labelSide = "right";
          occupiedUntil = rightEnd;
          continue;
        }

        // No room to the right — try the empty axis to the left of the marker.
        const leftStart = item.xFrom - LABEL_GAP_PX - item.labelWidth;
        if (leftStart >= 0 && leftStart >= occupiedUntil + ROW_GAP_PX) {
          item.showLabel = true;
          item.labelSide = "left";
          occupiedUntil = Math.max(occupiedUntil, item.xTo);
          continue;
        }

        // Neither side is free. Better no caption than two on top of each other.
        item.showLabel = false;
        item.labelSide = "right";
        occupiedUntil = Math.max(occupiedUntil, item.xTo);
      }
    }
  };

  decideCaptions(placedRows);

  // --- Spend the height budget, now that the rows have contents ----------------------
  //
  // A row is as tall as its tallest caption. Rows are therefore measured rather
  // than assumed, and any row that would hang off the bottom of the strip is
  // given up: its events go to overflow, where they become a "+N" marker like
  // any other event that didn't fit. Nothing is drawn outside the box, and
  // nothing is silently lost.
  const linesPerRow = (rows: PlacedEvent[]): number[] => {
    const lines: number[] = [];
    for (const item of rows) {
      lines[item.row] = Math.max(lines[item.row] ?? 1, item.showLabel ? item.labelLines : 1);
    }
    for (let r = 0; r < labelEnds.length; r++) lines[r] = lines[r] ?? 1;
    return lines;
  };

  let rowLines = linesPerRow(placedRows);
  let rowTops: number[] = [];
  let used = 0;
  let rowsThatFit = 0;
  for (let r = 0; r < rowLines.length; r++) {
    const height = rowHeightFor(rowLines[r]);
    // The first row always draws, even on a strip too short for it: a phone in
    // landscape with one three-line caption should show the caption clipped,
    // not show nothing at all.
    if (r > 0 && used + height > availableHeight) break;
    rowTops[r] = used;
    used += height;
    rowsThatFit = r + 1;
  }

  if (rowsThatFit < rowLines.length) {
    // THE ROWS THAT DID NOT FIT ARE GIVEN UP — BUT THEIR EVENTS ARE OFFERED THE
    // ROWS THAT DID, FIRST.
    //
    // The packer is optimistic: it assumes every row ends up one line tall and
    // creates as many as that allows. Once the real heights are known, rows with
    // wrapped captions are more than twice as tall and several of the rows it
    // created have to go. Their events used to be dumped straight into overflow,
    // where they became "+N" chips — even when a surviving row had room for them
    // at that x. That is what put ten events into count chips while a row above
    // was two-thirds empty.
    //
    // So they are re-offered here, by the same rule as the first pass: a row
    // whose label reservation clears this event's start, or failing that one
    // whose marker does. Only what still does not fit overflows.
    const survivingLabelEnds = labelEnds.slice(0, rowsThatFit).map(() => -Infinity);
    const survivingMarkerEnds = survivingLabelEnds.slice();
    const kept: PlacedEvent[] = [];
    const homeless: PlacedEvent[] = [];
    for (const item of placedRows) {
      if (item.row < rowsThatFit) {
        kept.push(item);
        survivingMarkerEnds[item.row] = Math.max(survivingMarkerEnds[item.row], reserveEnd(item) + ROW_GAP_PX);
        survivingLabelEnds[item.row] = Math.max(
          survivingLabelEnds[item.row],
          reserveEnd(item) + item.labelWidth + ROW_GAP_PX
        );
      } else {
        homeless.push(item);
      }
    }
    // In x order, so a row fills left to right exactly as it does in the first
    // pass and the reservations stay monotonic.
    homeless.sort((a, b) => a.xFrom - b.xFrom);
    for (const item of homeless) {
      const start = item.xFrom - 6;
      let row = survivingLabelEnds.findIndex((rowEnd) => rowEnd <= start);
      if (row === -1) row = survivingMarkerEnds.findIndex((rowEnd) => rowEnd <= start);
      if (row === -1) {
        overflow.push(item);
        continue;
      }
      item.row = row;
      const reserved = reserveEnd(item);
      survivingMarkerEnds[row] = reserved + ROW_GAP_PX;
      survivingLabelEnds[row] = reserved + item.labelWidth + ROW_GAP_PX;
      kept.push(item);
    }
    placedRows = kept;
    rowLines = rowLines.slice(0, rowsThatFit);
    rowTops = rowTops.slice(0, rowsThatFit);
    // The surviving rows hold different events now, so the caption decision is
    // no longer the one that was made for them.
    decideCaptions(placedRows);
  }

  // A row whose captions were all dropped doesn't need the height they asked
  // for. Re-measuring after the side decision is what keeps a crowded strip
  // from reserving three lines for labels it isn't drawing.
  const finalLines = linesPerRow(placedRows).slice(0, Math.max(1, rowLines.length));
  rowTops = [];
  used = 0;
  for (let r = 0; r < finalLines.length; r++) {
    rowTops[r] = used;
    used += rowHeightFor(finalLines[r]);
  }
  for (const item of placedRows) item.top = rowTops[item.row] ?? 0;

  // Whatever still doesn't fit becomes "+N" markers, bucketed by position.
  // Nothing is silently dropped.
  //
  // THEY USED TO ALL GO ON THE LAST ROW, and that is what a crowded timeline
  // looked like from the outside: a bottom line of count chips, sitting on top
  // of whatever events that row already held, while rows above had gaps. The
  // chips are now packed by the same rule as every other cluster — a row where
  // nothing already reaches this far — which is done in the loop below, so they
  // are created here WITHOUT a row and placed there with the rest.
  if (overflow.length > 0) {
    const bucketPx = 36;
    const buckets = new Map<number, PlacedEvent[]>();
    for (const item of overflow) {
      const bucket = Math.round(item.xFrom / bucketPx);
      const list = buckets.get(bucket);
      if (list) list.push(item);
      else buckets.set(bucket, [item]);
    }
    const lastRow = Math.max(0, finalLines.length - 1);
    for (const [bucket, items] of buckets) {
      // A "+1" chip reads as a bug rather than as a crowd. One leftover event
      // goes back on the strip as a bare marker — it may sit under a neighbour's
      // label, which is a smaller cost than a badge that says nothing.
      if (items.length === 1) {
        items[0].row = lastRow;
        items[0].top = rowTops[lastRow] ?? 0;
        items[0].showLabel = false;
        placedRows.push(items[0]);
        continue;
      }
      const x = items.reduce((sum, item) => sum + item.xFrom, 0) / items.length;
      clusters.push({
        key: `overflow-${bucket}`,
        // Row decided below, with every other cluster.
        row: 0,
        top: 0,
        x,
        count: items.length,
        from: window.from + (x - bucketPx) * yearsPerPixel,
        to: window.from + (x + bucketPx) * yearsPerPixel,
      });
    }
  }

  // Clusters share the rows with the events, so they start from where the
  // events left off rather than from an empty strip.
  //
  // They used to be packed into rows 0, 1, 2… with no knowledge of what was
  // already drawn there, which put a "7" chip straight on top of a caption's
  // date — two unrelated pieces of information occupying the same pixels, and
  // neither readable. Seeding the row ends from labelEnds means a cluster only
  // takes a place on a row where nothing already reaches that far, which is the
  // same rule the events themselves are packed by.
  //
  // (labelEnds is the FIRST pass's reservations, which are stale for any row
  // whose contents changed when rows were given up. Seeding from what is
  // actually drawn instead is arguably more correct — but it changed no
  // placement on real data or on any fixture, so it is deliberately NOT done
  // here rather than carried as an unprovable change.)
  const clusterRowEnds: number[] = labelEnds.slice(0, finalLines.length);
  // How many chips each row has taken. On a strip where every row is drawn all
  // the way across, no row is "free" and the fallback below has to choose one
  // anyway — and it has to choose a DIFFERENT one each time.
  const chipsOnRow: number[] = new Array(Math.max(1, finalLines.length)).fill(0);
  for (const cluster of clusters) {
    const start = cluster.x - 14;
    const end = cluster.x + 46;
    let row = clusterRowEnds.findIndex((rowEnd) => rowEnd <= start);
    if (row === -1) {
      // NOWHERE IS FREE, SO TAKE THE LEAST CROWDED ROW RATHER THAN THE LAST.
      //
      // This used to be `finalLines.length - 1` unconditionally, and that one
      // line is what produced the bottom line of count chips on a busy
      // timeline: every cluster that could not find a gap was stacked onto the
      // last row, on top of whatever events that row already held, while rows
      // above kept their gaps. Falling back to the row whose reservation ends
      // earliest spreads them instead, and still guarantees a place for every
      // one — nothing is dropped either way.
      //
      // BY FEWEST CHIPS FIRST, then by the earliest reservation. Taking the
      // earliest reservation alone was not enough, and this is the half of the
      // bottom-row bug that survived its first fix: the row a chip lands on is
      // recorded with Math.max against a reservation that is already past the
      // chip, so the array does not change, and every following chip makes the
      // same choice. Four chips, one row — which is the bottom line of counts
      // all over again, just harder to see because it only happens once every
      // row is drawn right across the strip.
      let best = 0;
      for (let r = 1; r < chipsOnRow.length; r++) {
        if (chipsOnRow[r] < chipsOnRow[best]) best = r;
        else if (chipsOnRow[r] === chipsOnRow[best] && clusterRowEnds[r] < clusterRowEnds[best]) best = r;
      }
      row = best;
    }
    chipsOnRow[row] = (chipsOnRow[row] ?? 0) + 1;
    clusterRowEnds[row] = Math.max(clusterRowEnds[row], end);
    cluster.row = row;
    cluster.top = rowTops[row] ?? 0;
  }

  const rowHeights = finalLines.map(rowHeightFor);

  // `placedRows`, not `survivors`: an event that overflowed is represented by
  // its cluster and must not also be drawn, or it is counted twice.
  return {
    events: placedRows,
    clusters,
    rows: Math.max(1, rowHeights.length),
    rowHeights,
    height: rowHeights.reduce((sum, height) => sum + height, 0),
  };
}

/** The same placement for one lane of Compare mode: a single row, labels dropped where they'd collide. */
export function layoutLane(
  events: TimelineEventWithClaims[],
  window: TimeWindow,
  width: number,
  scale: TimeScale = "linear"
): PlacedEvent[] {
  if (width <= 0) return [];
  const placed = events
    .map((event): PlacedEvent | null => {
      // ONLY THE CLAIMS THAT PLACE THEMSELVES GET DRAWN. A claim asserting no
      // finite beginning has no x, and letting it through produced a zero —
      // which is not "nowhere", it is the left edge of the window, so the
      // event's footprint stretched from the start of the visible span to
      // wherever its real dates were. An event with nothing positioned is
      // dropped from the strip entirely, which is the honest answer: it is
      // read on its record, because there is nowhere on a strip of time to
      // put a claim that names no time.
      const claims = event.claims.filter(claimIsPositioned).map((claim) => placeClaim(claim, window, width, scale));
      if (claims.length === 0) return null;
      const dateLabel = eventDateLabel(event.claims);
      const span = clampToStrip(
        Math.min(...claims.map((c) => Math.min(c.x, c.x2))),
        Math.max(...claims.map((c) => Math.max(c.x, c.x2))),
        width
      );
      const xFrom = span.xFrom;
      const xTo = span.xTo;
      const disputed = claims.length > 1 && claims.some((c) => Math.abs(c.x - claims[0].x) > 0.5);
      const label = measureLabel(event.title, dateLabel, {
        disputed,
        pending: event.status === "pending",
        claimCount: event.claims.length,
      });
      return {
        event,
        row: 0,
        top: 0,
        x: xFrom,
        xFrom,
        xTo,
        claims,
        disputed,
        overWide: isOverWide(xFrom, xTo, width),
        showLabel: true,
        labelWidth: label.width,
        labelLines: label.lines,
        labelSide: "right",
        dateLabel,
      };
    })
    .filter((item): item is PlacedEvent => item !== null)
    // EVENTS OFF THE EDGE ARE NOT DRAWN AT ALL.
    //
    // Without this they were: an event placed at x = −900 keeps its caption,
    // because a caption 190px wide starting at −894 still "fits" inside the
    // canvas by the arithmetic. It then renders at Math.max(0, −894) = 0. Six
    // events off the left edge therefore drew six captions stacked on the same
    // pixel, which is what a reader sees as an unreadable smear at the left of
    // the strip.
    //
    // It shows up most while a window is still loading, when the strip is
    // holding the PREVIOUS window's events — most of which are, by definition,
    // somewhere else in time.
    //
    // Partly-visible events stay: a claim whose range crosses the edge really
    // is in view, and clipping the bar at the boundary is the honest drawing of
    // it. Only events with no part of themselves on screen are dropped.
    .filter((item) => item.xTo >= 0 && item.xFrom <= width)
    .sort((a, b) => a.xFrom - b.xFrom);

  let lastLabelEnd = -Infinity;
  for (const item of placed) {
    if (item.xFrom < lastLabelEnd) item.showLabel = false;
    else lastLabelEnd = item.xTo + item.labelWidth + 10;
  }
  return placed;
}
