// The one gentle "next recommended action" on a journey dashboard, worked out
// from what has actually happened — never a nag list.

export type NextActionInput = {
  status: "active" | "completed" | "ended";
  isMentor: boolean;
  updateFrequency: string;
  lastBeginnerUpdateAt: string | null;
  openQuestion: { askerName: string; question: string } | null;
  currentMilestone: { title: string; description: string | null } | null;
  now?: number;
};

export function frequencyDays(frequency: string): number {
  if (/month/i.test(frequency)) return 30;
  if (/two|fortnight|2/i.test(frequency)) return 14;
  return 7;
}

export function nextRecommendedAction(input: NextActionInput): string {
  const now = input.now ?? Date.now();
  if (input.status === "completed") return "Completed — celebrate and share your story.";
  if (input.status === "ended") return "This journey has ended.";
  if (input.isMentor && input.openQuestion) {
    return `Answer ${input.openQuestion.askerName.split(" ")[0]}'s question: “${input.openQuestion.question}”`;
  }
  const overdue =
    !input.lastBeginnerUpdateAt || now - new Date(input.lastBeginnerUpdateAt).getTime() > frequencyDays(input.updateFrequency) * 86_400_000;
  if (!input.isMentor && overdue) return `Post your ${input.updateFrequency} update — a photo and a line is plenty.`;
  if (input.currentMilestone) {
    const { title, description } = input.currentMilestone;
    return `Work on “${title}”${description ? ` — ${description}` : ""}`;
  }
  return "Every milestone is done — mark the journey complete and celebrate!";
}
