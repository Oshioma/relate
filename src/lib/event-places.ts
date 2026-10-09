// "12 places left" / "1 place left" / "Full" — null when there's no limit.
export function placesLeftLabel(capacity: number | null, going: number): string | null {
  if (capacity === null) return null;
  const left = capacity - going;
  if (left <= 0) return "Full";
  return `${left} ${left === 1 ? "place" : "places"} left`;
}
