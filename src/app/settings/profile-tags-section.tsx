import { TagListEditor } from "@/components/ui/tag-list-editor";
import {
  addInterest,
  removeInterest,
  addSkill,
  removeSkill,
  addNeedsHelpTopic,
  removeNeedsHelpTopic,
  addCanHelpTopic,
  removeCanHelpTopic,
} from "./actions";

export function ProfileTagsSection({
  interests,
  skills,
  needsHelpWith,
  canHelpWith,
}: {
  interests: string[];
  skills: string[];
  needsHelpWith: string[];
  canHelpWith: string[];
}) {
  return (
    <div className="space-y-6">
      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Interests</p>
        <TagListEditor tags={interests} placeholder="Add an interest…" onAdd={addInterest} onRemove={removeInterest} />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Skills</p>
        <TagListEditor tags={skills} placeholder="Add a skill…" onAdd={addSkill} onRemove={removeSkill} />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Needs help with</p>
        <TagListEditor
          tags={needsHelpWith}
          placeholder="Something you'd like help with…"
          onAdd={addNeedsHelpTopic}
          onRemove={removeNeedsHelpTopic}
        />
      </div>

      <div>
        <p className="mb-2 text-sm font-medium text-foreground">Can help with</p>
        <TagListEditor
          tags={canHelpWith}
          placeholder="Something you can help others with…"
          onAdd={addCanHelpTopic}
          onRemove={removeCanHelpTopic}
        />
      </div>
    </div>
  );
}
