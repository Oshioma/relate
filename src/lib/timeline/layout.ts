import type { TimelineEventWithClaims } from "@/lib/data/timeline";
import { claimInterval, eventDateLabel, fractionOf, type TimeScale, type TimeWindow } from "./time";

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

/** Breathing room between one event's label and the next event's marker. */
const ROW_GAP_PX = 14;

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
  /** Which side of the marker the caption sits on. See the flip in layoutTimeline. */
  labelSide: "right" | "left";
  /** The event's date, written for a caption. Null when no claim supplies one. */
  dateLabel: string | null;
};

export type PlacedCluster = {
  key: string;
  row: number;
  x: number;
  count: number;
  /** The window to move to when this cluster is opened. */
  from: number;
  to: number;
};

export type TimelineLayout = {
  events: PlacedEvent[];
  clusters: PlacedCluster[];
  rows: number;
};

function estimateLabelWidth(title: string, dateLabel: string | null): number {
  // ~6.2px per character at the 13px the labels render at, capped so one long
  // title can't reserve half the strip.
  const titleWidth = Math.min(190, Math.max(48, title.length * 6.2 + 18));

  // THE DATE IS RESERVED TOO, OR IT IS NOT REALLY THERE.
  //
  // The packer hides any caption whose neighbour is closer than the width
  // reserved for it, and the canvas truncates at exactly that width. A date
  // drawn beside the title but left out of this number is therefore drawn
  // either through the next label or not at all — the same class of bug as the
  // 190/220 mismatch that put four titles on top of each other. It is measured
  // slightly narrower per character because it renders a point smaller and in
  // tabular figures.
  const dateWidth = dateLabel ? dateLabel.length * 5.8 + 8 : 0;

  return Math.min(330, titleWidth + dateWidth);
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
  maxRows: number,
  scale: TimeScale = "linear"
): TimelineLayout {
  if (width <= 0) return { events: [], clusters: [], rows: 0 };

  const placed = events
    .map((event): PlacedEvent | null => {
      const claims = event.claims.map((claim) => placeClaim(claim, window, width, scale));
      if (claims.length === 0) return null;
      const dateLabel = eventDateLabel(event.claims);
      const xFrom = Math.min(...claims.map((c) => Math.min(c.x, c.x2)));
      const xTo = Math.max(...claims.map((c) => Math.max(c.x, c.x2)));
      // "Disputed" means the sources land in different places — two sources
      // that agree on 1066 are corroboration, and calling that a dispute would
      // make the whole signal meaningless.
      const disputed =
        claims.length > 1 &&
        claims.some((c) => Math.abs(c.x - claims[0].x) > 0.5 || Math.abs(c.x2 - claims[0].x2) > 0.5);
      return {
        event,
        row: 0,
        x: xFrom,
        xFrom,
        xTo,
        claims,
        disputed,
        showLabel: true,
        labelWidth: estimateLabelWidth(event.title, dateLabel),
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
    if (run.length >= CLUSTER_MIN) {
      const x = run.reduce((sum, item) => sum + item.xFrom, 0) / run.length;
      const from = window.from + (Math.min(...run.map((r) => r.xFrom)) - CLUSTER_PX) * yearsPerPixel;
      const to = window.from + (Math.max(...run.map((r) => r.xTo)) + CLUSTER_PX) * yearsPerPixel;
      clusters.push({ key: run.map((r) => r.event.id).join(":").slice(0, 60), row: 0, x, count: run.length, from, to });
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
  const labelEnds: number[] = [];
  const markerEnds: number[] = [];
  const placedRows: PlacedEvent[] = [];
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
    markerEnds[row] = item.xTo + ROW_GAP_PX;
    labelEnds[row] = item.xTo + item.labelWidth + ROW_GAP_PX;
    placedRows.push(item);
  }

  // Then decide captions, per row, now that the row's contents are known: a
  // label shows when the next thing in its own row starts far enough to the
  // right of it. survivors is sorted by xFrom, so each row is already in order.
  const rowContents = new Map<number, PlacedEvent[]>();
  for (const item of placedRows) {
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

  // Whatever still doesn't fit becomes "+N" markers, bucketed by position, in
  // the last row. Nothing is silently dropped.
  if (overflow.length > 0) {
    const bucketPx = 36;
    const buckets = new Map<number, PlacedEvent[]>();
    for (const item of overflow) {
      const bucket = Math.round(item.xFrom / bucketPx);
      const list = buckets.get(bucket);
      if (list) list.push(item);
      else buckets.set(bucket, [item]);
    }
    const row = Math.max(0, Math.min(maxRows, labelEnds.length) - 1);
    for (const [bucket, items] of buckets) {
      // A "+1" chip reads as a bug rather than as a crowd. One leftover event
      // goes back on the strip as a bare marker — it may sit under a neighbour's
      // label, which is a smaller cost than a badge that says nothing.
      if (items.length === 1) {
        items[0].row = row;
        items[0].showLabel = false;
        placedRows.push(items[0]);
        continue;
      }
      const x = items.reduce((sum, item) => sum + item.xFrom, 0) / items.length;
      clusters.push({
        key: `overflow-${bucket}`,
        row,
        x,
        count: items.length,
        from: window.from + (x - bucketPx) * yearsPerPixel,
        to: window.from + (x + bucketPx) * yearsPerPixel,
      });
    }
  }

  // Clusters share the rows: spread them so several in a row don't collide.
  const clusterRowEnds: number[] = [];
  for (const cluster of clusters.filter((c) => !c.key.startsWith("overflow-"))) {
    const start = cluster.x - 14;
    const end = cluster.x + 46;
    let row = clusterRowEnds.findIndex((rowEnd) => rowEnd <= start);
    if (row === -1) {
      row = Math.min(clusterRowEnds.length, Math.max(0, maxRows - 1));
      if (clusterRowEnds.length <= row) clusterRowEnds.push(end);
      else clusterRowEnds[row] = end;
    } else {
      clusterRowEnds[row] = end;
    }
    cluster.row = row;
  }

  const rows = Math.max(
    labelEnds.length,
    clusters.reduce((max, cluster) => Math.max(max, cluster.row + 1), 0)
  );

  // `placedRows`, not `survivors`: an event that overflowed is represented by
  // its cluster and must not also be drawn, or it is counted twice.
  return { events: placedRows, clusters, rows: Math.max(1, rows) };
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
      const claims = event.claims.map((claim) => placeClaim(claim, window, width, scale));
      if (claims.length === 0) return null;
      const dateLabel = eventDateLabel(event.claims);
      const xFrom = Math.min(...claims.map((c) => Math.min(c.x, c.x2)));
      const xTo = Math.max(...claims.map((c) => Math.max(c.x, c.x2)));
      return {
        event,
        row: 0,
        x: xFrom,
        xFrom,
        xTo,
        claims,
        disputed: claims.length > 1 && claims.some((c) => Math.abs(c.x - claims[0].x) > 0.5),
        showLabel: true,
        labelWidth: estimateLabelWidth(event.title, dateLabel),
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
