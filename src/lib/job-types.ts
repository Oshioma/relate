import type { JobType } from "@/types/database";

export const JOB_TYPES: { value: JobType; label: string }[] = [
  { value: "full_time", label: "Full-time" },
  { value: "part_time", label: "Part-time" },
  { value: "remote", label: "Remote" },
  { value: "internship", label: "Internship" },
  { value: "seasonal", label: "Seasonal" },
  { value: "volunteer", label: "Volunteer" },
];

export function jobTypeLabel(type: JobType): string {
  return JOB_TYPES.find((t) => t.value === type)?.label ?? type;
}
