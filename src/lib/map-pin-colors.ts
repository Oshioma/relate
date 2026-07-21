// Deterministic color per map category, so a layer's pins stay the same
// color across renders without storing a color on every category row.
const PALETTE = ["#2563eb", "#dc2626", "#16a34a", "#d97706", "#7c3aed", "#0891b2", "#db2777", "#65a30d"];

export function colorForCategory(categoryId: string | null): string {
  if (!categoryId) return "#64748b"; // slate — uncategorized pins
  let hash = 0;
  for (let i = 0; i < categoryId.length; i++) {
    hash = (hash * 31 + categoryId.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}
