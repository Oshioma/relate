// The single reaction members can leave on a post today. Stored per-row in
// post_reactions.emoji, so adding more kinds later doesn't need a migration —
// but the UI currently offers just this one.
export const SMILE_EMOJI = "😊";

// Who smiled, in the shape the avatar stack renders. Kept alongside the emoji
// rather than in a data module so both server loaders and the presentational
// component can import it without either depending on the other.
export type Reactor = {
  id: string;
  name: string;
  avatarUrl: string | null;
};

/**
 * The names behind an avatar stack, as a sentence — "Ana, Bo and 7 others".
 *
 * `total` is the full reaction count, which can exceed `reactors.length`: a
 * caller may hold only the first few profiles, and RLS can hide a reactor's
 * profile from this viewer even when their reaction row is visible. The
 * remainder is always spoken for, so the words never contradict the number.
 */
export function describeReactors(reactors: Reactor[], total: number): string {
  const names = reactors.map((r) => r.name);
  const others = Math.max(0, total - names.length);
  if (names.length === 0) return others === 1 ? "1 person smiled" : `${others} people smiled`;

  const parts = others > 0 ? [...names, others === 1 ? "1 other" : `${others} others`] : names;
  if (parts.length === 1) return `${parts[0]} smiled`;
  return `${parts.slice(0, -1).join(", ")} and ${parts[parts.length - 1]} smiled`;
}
