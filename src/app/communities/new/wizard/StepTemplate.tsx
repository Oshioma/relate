"use client";

import { useMemo } from "react";
import { Sparkles, Check, CalendarClock, Video, MessagesSquare, Blocks } from "lucide-react";
import {
  COMMUNITY_TEMPLATES,
  COMMUNITY_INTENTS,
  PLACE_LOCATION_TYPES,
  ARTIST_MODES,
  ACTIVITY_KINDS,
  SCHOOL_KINDS,
  CRAFT_KINDS,
  recommendPlaceSetup,
  recommendArtistSetup,
  recommendActivitySetup,
  recommendSchoolSetup,
  recommendCraftSetup,
  templatesForIntents,
} from "@/lib/community-templates";
import { TEMPLATE_ICONS } from "@/lib/template-icons";
import { Card } from "@/components/ui/card";
import { Input, Label } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { nextId } from "./types";
import type { WizardState, WizardSpace } from "./types";
import type { TemplateSpace, StarterActivity } from "@/lib/community-templates";
import type { SpaceType } from "@/types/database";

// Turns a template's suggested spaces into wizard spaces, dropping any whose
// type the super admin hasn't made available — the pool wins, so a banned type
// never even reaches the starter box.
function toWizardSpaces(spaces: TemplateSpace[], allowedTypes: SpaceType[]): WizardSpace[] {
  const allowed = new Set(allowedTypes);
  return spaces
    .filter((s) => allowed.has(s.space_type ?? "discussion"))
    .map((s) => ({ id: nextId("space"), name: s.name, description: s.description, show_in_nav: true, space_type: s.space_type ?? "discussion", staff_post_only: s.staff_post_only ?? false, visibility: s.visibility ?? "members" }));
}

// The suggested rituals for the chosen kind, with the one that gets seeded for
// real called out. Rendered under the kind picker so the owner sees what their
// community will DO, not only which rooms it will have.
function StarterActivities({ activities }: { activities: StarterActivity[] }) {
  if (!activities.length) return null;
  const seededTitle = activities.find((a) => a.spaceType === "challenges" && a.durationDays)?.title;

  return (
    <div className="mt-4 rounded-md border border-border p-3.5">
      <div className="flex items-center gap-2">
        <CalendarClock className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Things to run in your first month</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        Spaces are rooms — these are the reason to walk into one. The first challenge below starts the day you launch.
      </p>
      <ul className="mt-3 space-y-2.5">
        {activities.map((activity) => (
          <li key={activity.title} className="text-xs">
            <p className="font-semibold text-foreground">
              {activity.title}
              {activity.title === seededTitle && (
                <span className="ml-1.5 rounded-full bg-accent-soft px-2 py-0.5 text-[10px] font-medium text-accent">
                  starts on launch
                </span>
              )}
            </p>
            <p className="mt-0.5 text-muted-foreground">{activity.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// What every community gets regardless of the type picked here, said under the
// grid because this is the step where the choice feels irreversible. It isn't:
// the type only decides which spaces are seeded, and every module stays
// available in Admin afterward.
//
// Only claims things that exist. Direct messages are /messages, live video is
// the 'live' space type, custom pages are the 'custom' one (labelled "Custom
// Page" in the picker), and the module count is the platform's real pool as
// passed into this step — not a number typed into copy that drifts. "Request a
// module" links to /contact, which stores the message and emails support.
function IncludedEverywhere({ moduleCount }: { moduleCount: number }) {
  return (
    <div className="mt-4 rounded-md border border-border bg-muted/50 p-3.5">
      <div className="flex items-center gap-2">
        <Blocks className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">Every community gets these, whichever type you pick</span>
      </div>
      <div className="mt-2 grid gap-1.5 sm:grid-cols-3">
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <MessagesSquare className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          Direct messages between your members
        </p>
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Video className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          Live video sessions, hosted in the community
        </p>
        <p className="flex items-start gap-1.5 text-xs text-muted-foreground">
          <Sparkles className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
          Custom pages you write yourself
        </p>
      </div>
      <p className="mt-2.5 text-xs text-muted-foreground">
        This choice isn&apos;t a cage — it only decides what you start with. All {moduleCount} modules stay available to add
        whenever you want them, from Admin. Need one that isn&apos;t here?{" "}
        <a href="/contact" target="_blank" className="font-medium text-accent underline underline-offset-2">
          Ask us for it
        </a>
        .
      </p>
    </div>
  );
}

// The one thing about the craft setup worth selling to the owner, said once and
// only here — never in the space's own description, which members read forever.
// Deliberately not framed as "the space you charge for": charging needs a plan
// that grants paid_memberships, and plenty of communities will happily run this
// free. So it states the capability and leaves the pricing decision open.
function LiveSpaceNote({ name }: { name: string }) {
  return (
    <div className="mt-4 rounded-md border border-border p-3.5">
      <div className="flex items-center gap-2">
        <Video className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-foreground">{name} — live video, built in</span>
      </div>
      <p className="mt-1 text-xs text-muted-foreground">
        A great thing to offer your members. Video runs inside the community, so nobody has to leave for a meeting link: schedule
        a session, members RSVP, and everyone gets a reminder before it starts. Offer it to all your members for free — or, on a
        paid plan, put a price on the space and let members subscribe to join. That choice is yours to make later, in Admin.
      </p>
    </div>
  );
}

export function StepTemplate({
  state,
  update,
  defaultSpacesByTemplate,
  allowedTypes,
}: {
  state: WizardState;
  update: (patch: Partial<WizardState>) => void;
  defaultSpacesByTemplate?: Record<string, TemplateSpace[]>;
  // Space types the platform makes available to new communities. Template
  // suggestions of any other type are filtered out of the starter box.
  allowedTypes: SpaceType[];
}) {
  const isPlace = state.templateKey === "place";
  const isArtist = state.templateKey === "fanclub";
  const isActivity = state.templateKey === "activity";
  const isSchool = state.templateKey === "school";
  const isCraft = state.templateKey === "craft";
  const selectedCraft = isCraft ? CRAFT_KINDS.find((k) => k.key === state.craftKind) : undefined;

  // The grid, narrowed by whatever the owner said their community is for. A
  // type they have already picked always stays on screen, so changing an intent
  // afterward can never make the current selection vanish.
  const visibleTemplates = useMemo(() => {
    const list = templatesForIntents(state.intents);
    if (state.templateKey && !list.some((t) => t.key === state.templateKey)) {
      const picked = COMMUNITY_TEMPLATES.find((t) => t.key === state.templateKey);
      if (picked) return [picked, ...list];
    }
    return list;
  }, [state.intents, state.templateKey]);

  const hiddenCount = COMMUNITY_TEMPLATES.length - visibleTemplates.length;

  function toggleIntent(key: string) {
    update({
      intents: state.intents.includes(key) ? state.intents.filter((k) => k !== key) : [...state.intents, key],
    });
  }

  function selectTemplate(key: string) {
    const template = COMMUNITY_TEMPLATES.find((t) => t.key === key)!;
    // Prefer the super-admin-configured defaults for this type; fall back to
    // the template's code defaults.
    const defaultSpaces = defaultSpacesByTemplate?.[key] ?? template.defaultSpaces;
    update({
      templateKey: key,
      spaces: toWizardSpaces(defaultSpaces, allowedTypes),
      locationType: "",
      artistMode: "",
      activityKind: "",
      schoolKind: "",
      craftKind: "",
      starterActivities: [],
      mapLayers: [],
      rationale: [],
    });
  }

  function selectArtistMode(key: string) {
    const rec = recommendArtistSetup(key);
    update({
      artistMode: key,
      spaces: toWizardSpaces(rec.spaces, allowedTypes),
      rationale: rec.rationale,
    });
  }

  function selectActivityKind(key: string) {
    const rec = recommendActivitySetup(key, defaultSpacesByTemplate?.["activity"]);
    update({
      activityKind: key,
      spaces: toWizardSpaces(rec.spaces, allowedTypes),
      rationale: rec.rationale,
      mapLayers: rec.mapLayers,
    });
  }

  function selectSchoolKind(key: string) {
    const rec = recommendSchoolSetup(key, defaultSpacesByTemplate?.["school"]);
    update({
      schoolKind: key,
      spaces: toWizardSpaces(rec.spaces, allowedTypes),
      rationale: rec.rationale,
    });
  }

  function selectCraftKind(key: string) {
    const rec = recommendCraftSetup(key, defaultSpacesByTemplate?.["craft"]);
    update({
      craftKind: key,
      spaces: toWizardSpaces(rec.spaces, allowedTypes),
      rationale: rec.rationale,
      starterActivities: rec.starterActivities,
    });
  }

  function selectLocationType(key: string) {
    const rec = recommendPlaceSetup(key, defaultSpacesByTemplate?.["place"]);
    update({
      locationType: key,
      spaces: toWizardSpaces(rec.spaces, allowedTypes),
      rationale: rec.rationale,
      mapLayers: rec.mapLayers,
    });
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-semibold tracking-tight text-foreground">What do you want your community to do?</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick one or two and we&apos;ll narrow the list below — or skip this and browse all {COMMUNITY_TEMPLATES.length} types.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {COMMUNITY_INTENTS.map((intent) => {
          const Icon = TEMPLATE_ICONS[intent.icon] ?? Sparkles;
          const isActive = state.intents.includes(intent.key);
          return (
            <button
              key={intent.key}
              type="button"
              onClick={() => toggleIntent(intent.key)}
              title={intent.description}
              className={cn(
                "flex items-center gap-1.5 rounded-full border-2 px-3 py-1.5 text-sm font-medium transition-colors",
                isActive ? "border-accent bg-accent-soft text-foreground" : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
              )}
            >
              <Icon className="h-3.5 w-3.5" />
              {intent.label}
            </button>
          );
        })}
      </div>

      <div>
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="text-sm font-semibold text-foreground">
            {state.intents.length ? "Types that fit what you picked" : "What type of community are you creating?"}
          </h2>
          {hiddenCount > 0 && (
            <button type="button" onClick={() => update({ intents: [] })} className="text-xs font-medium text-accent hover:underline">
              Show all {COMMUNITY_TEMPLATES.length}
            </button>
          )}
        </div>
        <p className="mt-1 text-sm text-muted-foreground">
          Each type suggests a starting set of spaces — you can change everything in the next step.
        </p>

        <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3">
          {visibleTemplates.map((t) => {
            const Icon = TEMPLATE_ICONS[t.icon] ?? Sparkles;
            const isActive = state.templateKey === t.key;
            return (
              <button
                key={t.key}
                type="button"
                onClick={() => selectTemplate(t.key)}
                className={cn(
                  "rounded-lg border-2 p-3.5 text-left transition-colors",
                  isActive ? "border-accent bg-accent-soft" : "border-border bg-card hover:border-muted-foreground/40"
                )}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-accent-foreground">
                  <Icon className="h-4 w-4" />
                </div>
                <p className="mt-2.5 text-sm font-semibold text-foreground">{t.label}</p>
                <p className="mt-0.5 text-xs text-muted-foreground">{t.tagline}</p>
              </button>
            );
          })}
        </div>

        <IncludedEverywhere moduleCount={allowedTypes.length} />
      </div>

      {state.templateKey && isPlace && (
        <Card className="p-5">
          <div>
            <Label htmlFor="locationName">Where is this?</Label>
            <Input
              id="locationName"
              placeholder="e.g. Zanzibar, Tanzania"
              value={state.locationName}
              onChange={(e) => update({ locationName: e.target.value })}
            />
          </div>

          <div className="mt-4 flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">What kind of place is this?</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Tailors your spaces, profile fields and Explore Map layers — still editable afterward.</p>

          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {PLACE_LOCATION_TYPES.map((lt) => {
              const isActive = state.locationType === lt.key;
              return (
                <button
                  key={lt.key}
                  type="button"
                  onClick={() => selectLocationType(lt.key)}
                  title={lt.description}
                  className={cn(
                    "rounded-md border-2 px-3 py-2 text-left text-sm font-medium transition-colors",
                    isActive ? "border-accent bg-accent-soft text-foreground" : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
                  )}
                >
                  {lt.label}
                </button>
              );
            })}
          </div>

          {state.mapLayers.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {state.mapLayers.map((layer) => (
                <span key={layer} className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {layer}
                </span>
              ))}
            </div>
          )}

          {state.rationale.length > 0 && (
            <ul className="mt-3 space-y-1 rounded-md bg-muted p-3 text-xs text-muted-foreground">
              {state.rationale.map((line, i) => (
                <li key={i} className="flex gap-1.5">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                  {line}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {state.templateKey && isArtist && (
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Which kind of music community is this?</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">Sets a different starting set of spaces and profile fields — still editable afterward.</p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {ARTIST_MODES.map((m) => {
              const isActive = state.artistMode === m.key;
              return (
                <button
                  key={m.key}
                  type="button"
                  onClick={() => selectArtistMode(m.key)}
                  className={cn(
                    "rounded-md border-2 p-3 text-left transition-colors",
                    isActive ? "border-accent bg-accent-soft" : "border-border bg-card hover:border-muted-foreground/40"
                  )}
                >
                  <p className="text-sm font-semibold text-foreground">{m.label}</p>
                  <p className="mt-0.5 text-xs font-medium text-accent">{m.tagline}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{m.description}</p>
                </button>
              );
            })}
          </div>

          {state.rationale.length > 0 && (
            <ul className="mt-3 space-y-1 rounded-md bg-muted p-3 text-xs text-muted-foreground">
              {state.rationale.map((line, i) => (
                <li key={i} className="flex gap-1.5">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                  {line}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {state.templateKey && isCraft && (
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Which craft is this community built around?</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Every making community runs the same loop — make it, show it, write down how, work out why it went wrong. Picking the craft
            names the spaces the way your members would, and suggests what to run in the first month.
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {CRAFT_KINDS.map((kind) => {
              const isActive = state.craftKind === kind.key;
              return (
                <button
                  key={kind.key}
                  type="button"
                  onClick={() => selectCraftKind(kind.key)}
                  className={cn(
                    "rounded-md border-2 p-3 text-left transition-colors",
                    isActive ? "border-accent bg-accent-soft" : "border-border bg-card hover:border-muted-foreground/40"
                  )}
                >
                  <p className="text-sm font-semibold text-foreground">{kind.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{kind.description}</p>
                </button>
              );
            })}
          </div>

          {state.rationale.length > 0 && (
            <ul className="mt-3 space-y-1 rounded-md bg-muted p-3 text-xs text-muted-foreground">
              {state.rationale.map((line, i) => (
                <li key={i} className="flex gap-1.5">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                  {line}
                </li>
              ))}
            </ul>
          )}

          {selectedCraft && <LiveSpaceNote name={selectedCraft.liveSpace.name} />}

          <StarterActivities activities={state.starterActivities} />
        </Card>
      )}

      {state.templateKey && isSchool && (
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">What kind of school is this?</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Tailors your spaces and profile fields, and sets the reading age new lessons are written for. Everything stays editable
            afterward, and every lesson can be written for a different age on the day.
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {SCHOOL_KINDS.map((kind) => {
              const isActive = state.schoolKind === kind.key;
              return (
                <button
                  key={kind.key}
                  type="button"
                  onClick={() => selectSchoolKind(kind.key)}
                  className={cn(
                    "rounded-md border-2 p-3 text-left transition-colors",
                    isActive ? "border-accent bg-accent-soft" : "border-border bg-card hover:border-muted-foreground/40"
                  )}
                >
                  <p className="text-sm font-semibold text-foreground">{kind.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{kind.description}</p>
                </button>
              );
            })}
          </div>

          {state.rationale.length > 0 && (
            <ul className="mt-3 space-y-1 rounded-md bg-muted p-3 text-xs text-muted-foreground">
              {state.rationale.map((line, i) => (
                <li key={i} className="flex gap-1.5">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                  {line}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}

      {state.templateKey && isActivity && (
        <Card className="p-5">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-muted-foreground" />
            <span className="text-sm font-medium text-foreground">Which activity is this community built around?</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Everything starts from Happening Now — members post what they&apos;re doing and when, and whoever&apos;s free comes along. Picking the
            activity tailors the rest of the spaces, profile fields and Meet-Up Map layers.
          </p>

          <div className="mt-3 grid gap-2 sm:grid-cols-2">
            {ACTIVITY_KINDS.map((kind) => {
              const isActive = state.activityKind === kind.key;
              return (
                <button
                  key={kind.key}
                  type="button"
                  onClick={() => selectActivityKind(kind.key)}
                  className={cn(
                    "rounded-md border-2 p-3 text-left transition-colors",
                    isActive ? "border-accent bg-accent-soft" : "border-border bg-card hover:border-muted-foreground/40"
                  )}
                >
                  <p className="text-sm font-semibold text-foreground">{kind.label}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{kind.description}</p>
                </button>
              );
            })}
          </div>

          {state.mapLayers.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1.5">
              {state.mapLayers.map((layer) => (
                <span key={layer} className="rounded-full border border-border px-2.5 py-1 text-xs font-medium text-muted-foreground">
                  {layer}
                </span>
              ))}
            </div>
          )}

          {state.rationale.length > 0 && (
            <ul className="mt-3 space-y-1 rounded-md bg-muted p-3 text-xs text-muted-foreground">
              {state.rationale.map((line, i) => (
                <li key={i} className="flex gap-1.5">
                  <Check className="mt-0.5 h-3 w-3 shrink-0 text-accent" />
                  {line}
                </li>
              ))}
            </ul>
          )}
        </Card>
      )}
    </div>
  );
}
