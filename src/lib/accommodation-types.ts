import type { AccommodationType } from "@/types/database";

export const ACCOMMODATION_TYPES: { value: AccommodationType; label: string }[] = [
  { value: "hotel", label: "Hotel" },
  { value: "hostel", label: "Hostel" },
  { value: "guesthouse", label: "Guesthouse" },
  { value: "holiday_rental", label: "Holiday rental" },
  { value: "long_term_rental", label: "Long-term rental" },
  { value: "house_share", label: "House share" },
  { value: "camping", label: "Camping" },
];

export function accommodationTypeLabel(type: AccommodationType): string {
  return ACCOMMODATION_TYPES.find((t) => t.value === type)?.label ?? type;
}
