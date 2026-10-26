"use client";

import { useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import {
  BookOpen,
  Building2,
  CalendarDays,
  Check,
  Crown,
  FileText,
  Globe,
  GraduationCap,
  Heart,
  Layers,
  Link2,
  Lock,
  MapPin,
  Megaphone,
  MessageCircle,
  PlayCircle,
  Search,
  Store,
  Users,
  Video,
} from "lucide-react";
import { cn } from "@/lib/utils";

// The homepage's "see how it works" demo. Everything in it is an illustration
// written for the demo, labelled as such on screen: no real community, member,
// price or activity, nothing fetched and nothing saved. Each tab mirrors a
// real Relate feature (the space types in src/lib/space-types.ts, membership
// tiers and paid spaces) so the picture matches what a host actually gets.

type Tab = {
  key: string;
  label: string;
  icon: ReactNode;
  title: string;
  description: string;
  points: string[];
  preview: ReactNode;
};

const TABS: Tab[] = [
  {
    key: "discussions",
    label: "Discussions",
    icon: <MessageCircle className="h-4 w-4" />,
    title: "Conversations that keep people coming back",
    description: "A feed where members post, reply and react, with photos and links, and pinned posts from you.",
    points: ["Posts, comments and reactions", "Pin announcements to the top", "Email and push notifications"],
    preview: <DiscussionsPreview />,
  },
  {
    key: "spaces",
    label: "Spaces",
    icon: <Layers className="h-4 w-4" />,
    title: "Organise everything into spaces",
    description: "Give each topic its own space and decide who can see it, who can post, and whether it's paid.",
    points: ["Open, members-only or paid spaces", "Announcement spaces only staff post in", "Group spaces in your sidebar"],
    preview: <SpacesPreview />,
  },
  {
    key: "courses",
    label: "Courses",
    icon: <GraduationCap className="h-4 w-4" />,
    title: "Teach what you know",
    description: "Build a course lesson by lesson. Members enrol and work through it at their own pace.",
    points: ["Lessons with video, text and files", "Free or paid courses", "Live lessons in the browser"],
    preview: <CoursesPreview />,
  },
  {
    key: "events",
    label: "Events",
    icon: <CalendarDays className="h-4 w-4" />,
    title: "Bring people together, online or in person",
    description: "Publish events, collect RSVPs and go live with video sessions right inside your community.",
    points: ["RSVPs and reminders", "Capacity limits", "Live video sessions"],
    preview: <EventsPreview />,
  },
  {
    key: "marketplace",
    label: "Marketplace",
    icon: <Store className="h-4 w-4" />,
    title: "A place for members to trade",
    description: "Members list goods, services and things to give away or find, and get in touch with each other directly.",
    points: ["Listings with photos", "Categories and search", "Messages between members"],
    preview: <MarketplacePreview />,
  },
  {
    key: "directories",
    label: "Directories",
    icon: <Building2 className="h-4 w-4" />,
    title: "Help people find each other",
    description: "A searchable directory of members, or of local businesses with profiles, hours and reviews.",
    points: ["Member and business directories", "Opening hours and reviews", "Map of places"],
    preview: <DirectoriesPreview />,
  },
  {
    key: "memberships",
    label: "Memberships",
    icon: <Crown className="h-4 w-4" />,
    title: "Free, paid, or both",
    description:
      "Let everyone in free, charge for membership, or keep the community free with paid extras. On plans that include paid memberships, members pay you through your own Stripe account.",
    points: ["Membership tiers you price", "Paid spaces and courses", "Approve or invite new members"],
    preview: <MembershipsPreview />,
  },
  {
    key: "resources",
    label: "Resources",
    icon: <BookOpen className="h-4 w-4" />,
    title: "Keep the useful stuff close",
    description: "Links, files and guides in one place, so members stop asking where things are.",
    points: ["Files and links", "Guides members can write", "Private files for members only"],
    preview: <ResourcesPreview />,
  },
];

export function ProductDemo() {
  const [active, setActive] = useState(0);
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const tab = TABS[active];

  // Arrow keys move along the tabs (wrapping), Home/End jump to the ends — the
  // usual tablist keyboard pattern.
  function onKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    const moves: Record<string, number> = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 };
    let next: number | null = null;
    if (event.key in moves) next = (active + moves[event.key] + TABS.length) % TABS.length;
    if (event.key === "Home") next = 0;
    if (event.key === "End") next = TABS.length - 1;
    if (next === null) return;
    event.preventDefault();
    setActive(next);
    tabRefs.current[next]?.focus();
  }

  return (
    <div>
      <div
        role="tablist"
        aria-label="Relate features"
        onKeyDown={onKeyDown}
        className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-2 [scrollbar-width:none] sm:mx-0 sm:flex-wrap sm:justify-center sm:px-0 [&::-webkit-scrollbar]:hidden"
      >
        {TABS.map((t, i) => (
          <button
            key={t.key}
            ref={(el) => {
              tabRefs.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`demo-tab-${t.key}`}
            aria-selected={i === active}
            aria-controls="demo-panel"
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={cn(
              "inline-flex shrink-0 items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#326B42] focus-visible:ring-offset-2",
              i === active
                ? "border-[#326B42] bg-[#326B42] text-white"
                : "border-[#222A25]/10 bg-white text-[#3B463E] hover:border-[#326B42]/40 hover:text-[#326B42]"
            )}
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      <div
        id="demo-panel"
        role="tabpanel"
        aria-labelledby={`demo-tab-${tab.key}`}
        className="mt-8 grid items-center gap-8 lg:grid-cols-[0.8fr_1.2fr]"
      >
        <div>
          <h3 className="font-[family-name:var(--font-display)] text-2xl font-bold tracking-tight">{tab.title}</h3>
          <p className="mt-3 text-[#526452]">{tab.description}</p>
          <ul className="mt-5 space-y-2 text-sm text-[#3B463E]">
            {tab.points.map((point) => (
              <li key={point} className="flex items-start gap-2">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#326B42]" /> {point}
              </li>
            ))}
          </ul>
        </div>

        {/* key: remount per tab so the (motion-safe) fade replays. */}
        <div key={tab.key} className="motion-safe:animate-[demo-in_250ms_ease-out]">
          <DemoWindow>{tab.preview}</DemoWindow>
        </div>
      </div>
      <style>{`@keyframes demo-in { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: none; } }`}</style>
    </div>
  );
}

// The browser frame every preview sits in, with the "example" label that keeps
// it from being mistaken for a real community.
function DemoWindow({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-black/5">
      <div className="flex items-center gap-3 border-b border-[#EDEDE4] bg-[#FBFAF6] px-4 py-2.5">
        <span className="flex gap-1.5" aria-hidden>
          <span className="h-2.5 w-2.5 rounded-full bg-[#E4C7B8]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#EFE0B5]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[#C9DCC8]" />
        </span>
        <span className="flex items-center gap-1.5 text-xs font-semibold text-[#3B463E]">
          <Heart className="h-3.5 w-3.5 text-[#326B42]" /> Your community
        </span>
        <span className="ml-auto rounded-full bg-[#F6E1D6] px-2.5 py-0.5 text-[11px] font-semibold text-[#9C492E]">
          Example
        </span>
      </div>
      <div className="min-h-[19rem] p-4 sm:p-5">{children}</div>
    </div>
  );
}

// Placeholder people: a coloured initial, never a made-up face.
function Person({ initial, tone = "green" }: { initial: string; tone?: "green" | "terracotta" | "honey" }) {
  const tones = {
    green: "bg-[#DCE8D9] text-[#326B42]",
    terracotta: "bg-[#F6E1D6] text-[#C96745]",
    honey: "bg-[#FBEBC8] text-[#A87512]",
  };
  return (
    <span aria-hidden className={cn("flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-xs font-bold", tones[tone])}>
      {initial}
    </span>
  );
}

function Pill({ children, tone = "sage" }: { children: ReactNode; tone?: "sage" | "terracotta" | "honey" }) {
  const tones = {
    sage: "bg-[#E9EEE4] text-[#326B42]",
    terracotta: "bg-[#F6E1D6] text-[#9C492E]",
    honey: "bg-[#FBEBC8] text-[#8A5F0E]",
  };
  return <span className={cn("rounded-full px-2 py-0.5 text-[11px] font-semibold", tones[tone])}>{children}</span>;
}

function DiscussionsPreview() {
  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3 rounded-xl border border-[#EDEDE4] px-3 py-2.5 text-sm text-[#8A948C]">
        <Person initial="Y" /> Share something with the community…
      </div>
      <Post
        initial="H"
        who="Host"
        badge={<Pill>Pinned</Pill>}
        text="Welcome in! Start by introducing yourself below: who you are, and what brought you here."
      />
      <Post
        initial="M"
        tone="terracotta"
        who="A member"
        text="Hi all! I've just moved to the area and I'd love to find people to walk with at the weekends."
      />
    </div>
  );
}

function Post({
  initial,
  tone,
  who,
  badge,
  text,
}: {
  initial: string;
  tone?: "green" | "terracotta" | "honey";
  who: string;
  badge?: ReactNode;
  text: string;
}) {
  return (
    <div className="rounded-xl border border-[#EDEDE4] p-3">
      <div className="flex items-center gap-2">
        <Person initial={initial} tone={tone} />
        <span className="text-sm font-semibold">{who}</span>
        {badge}
      </div>
      <p className="mt-2 text-sm leading-6 text-[#3B463E]">{text}</p>
      <div className="mt-2 flex gap-4 text-xs font-semibold text-[#637067]">
        <span className="flex items-center gap-1">
          <Heart className="h-3.5 w-3.5" /> Like
        </span>
        <span className="flex items-center gap-1">
          <MessageCircle className="h-3.5 w-3.5" /> Reply
        </span>
      </div>
    </div>
  );
}

function SpacesPreview() {
  const spaces: { icon: ReactNode; name: string; access: ReactNode }[] = [
    { icon: <Megaphone className="h-4 w-4" />, name: "Announcements", access: <Pill>Staff post</Pill> },
    { icon: <MessageCircle className="h-4 w-4" />, name: "General chat", access: <Pill>Open</Pill> },
    { icon: <Users className="h-4 w-4" />, name: "Members' lounge", access: <Pill tone="honey">Members only</Pill> },
    { icon: <GraduationCap className="h-4 w-4" />, name: "Masterclass", access: <Pill tone="terracotta">Paid</Pill> },
    { icon: <BookOpen className="h-4 w-4" />, name: "Resources", access: <Pill>Open</Pill> },
  ];
  return (
    <ul className="divide-y divide-[#EDEDE4] rounded-xl border border-[#EDEDE4]">
      {spaces.map((space) => (
        <li key={space.name} className="flex items-center gap-3 px-3 py-3">
          <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#F7F4EC] text-[#326B42]">{space.icon}</span>
          <span className="flex-1 text-sm font-semibold">{space.name}</span>
          {space.access}
        </li>
      ))}
    </ul>
  );
}

function CoursesPreview() {
  const lessons = ["Welcome and how this course works", "Finding your first members", "Running your first event", "Keeping people engaged"];
  return (
    <div>
      <div className="flex items-center gap-3 rounded-xl bg-gradient-to-r from-[#DCE8D9] to-[#F6E6D6] p-4">
        <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-white text-[#326B42]">
          <GraduationCap className="h-5 w-5" />
        </span>
        <div>
          <p className="font-semibold">Starting a community</p>
          <p className="text-xs text-[#526452]">A sample course · 4 lessons</p>
        </div>
      </div>
      <ol className="mt-3 space-y-2">
        {lessons.map((lesson, i) => (
          <li key={lesson} className="flex items-center gap-3 rounded-lg border border-[#EDEDE4] px-3 py-2.5 text-sm">
            {i === 0 ? (
              <Check className="h-4 w-4 text-[#326B42]" />
            ) : (
              <PlayCircle className={cn("h-4 w-4", i === 1 ? "text-[#C96745]" : "text-[#A9B2AB]")} />
            )}
            <span className={cn(i === 1 && "font-semibold")}>{lesson}</span>
            {i === 1 && <span className="ml-auto text-xs font-semibold text-[#C96745]">Up next</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

function EventsPreview() {
  const events: { day: string; month: string; title: string; where: ReactNode }[] = [
    {
      day: "12",
      month: "Sat",
      title: "Saturday morning walk",
      where: (
        <>
          <MapPin className="h-3.5 w-3.5" /> Meet at the harbour
        </>
      ),
    },
    {
      day: "16",
      month: "Wed",
      title: "Monthly members' call",
      where: (
        <>
          <Video className="h-3.5 w-3.5" /> Live, in the community
        </>
      ),
    },
  ];
  return (
    <div className="space-y-3">
      {events.map((event, i) => (
        <div key={event.title} className="flex items-center gap-4 rounded-xl border border-[#EDEDE4] p-3">
          <span className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-xl bg-[#F6E1D6] text-[#9C492E]">
            <span className="text-[11px] font-semibold uppercase">{event.month}</span>
            <span className="text-xl font-bold leading-none">{event.day}</span>
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate font-semibold">{event.title}</p>
            <p className="mt-0.5 flex items-center gap-1 text-xs text-[#637067]">{event.where}</p>
          </div>
          <span
            className={cn(
              "rounded-lg px-3 py-1.5 text-xs font-semibold",
              i === 0 ? "bg-[#326B42] text-white" : "border border-[#326B42]/30 text-[#326B42]"
            )}
          >
            {i === 0 ? "Going" : "RSVP"}
          </span>
        </div>
      ))}
      <p className="text-xs text-[#8A948C]">Dates are for illustration.</p>
    </div>
  );
}

function MarketplacePreview() {
  const listings: { title: string; tag: ReactNode; tone: string }[] = [
    { title: "Kids' bike, outgrown", tag: <Pill>Goods</Pill>, tone: "from-[#DCE8D9] to-[#C9DCC8]" },
    { title: "Spare seedlings", tag: <Pill tone="honey">Free</Pill>, tone: "from-[#FBEBC8] to-[#F3DDA6]" },
    { title: "Looking for a yoga mat", tag: <Pill tone="terracotta">Wanted</Pill>, tone: "from-[#F6E1D6] to-[#EBC9B7]" },
    { title: "Surfboard lessons", tag: <Pill>Services</Pill>, tone: "from-[#E9EEE4] to-[#DCE8D9]" },
  ];
  return (
    <div>
      <SearchBar placeholder="Search listings" />
      <div className="mt-3 grid grid-cols-2 gap-3">
        {listings.map((listing) => (
          <div key={listing.title} className="overflow-hidden rounded-xl border border-[#EDEDE4]">
            <div className={cn("flex h-16 items-center justify-center bg-gradient-to-br text-[#326B42]/50", listing.tone)}>
              <Store className="h-5 w-5" />
            </div>
            <div className="p-2.5">
              <p className="truncate text-sm font-semibold">{listing.title}</p>
              <div className="mt-1.5">{listing.tag}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function DirectoriesPreview() {
  const entries: { initial: string; tone: "green" | "terracotta" | "honey"; name: string; kind: string }[] = [
    { initial: "C", tone: "honey", name: "A local café", kind: "Food & drink · Open today" },
    { initial: "Y", tone: "green", name: "A yoga teacher", kind: "Wellness · Member" },
    { initial: "B", tone: "terracotta", name: "A bike repair shop", kind: "Services · Open today" },
  ];
  return (
    <div>
      <SearchBar placeholder="Search the directory" />
      <div className="mt-3 flex gap-2">
        <Pill>All</Pill>
        <Pill tone="honey">Food &amp; drink</Pill>
        <Pill tone="terracotta">Services</Pill>
      </div>
      <ul className="mt-3 space-y-2">
        {entries.map((entry) => (
          <li key={entry.name} className="flex items-center gap-3 rounded-xl border border-[#EDEDE4] p-3">
            <Person initial={entry.initial} tone={entry.tone} />
            <div>
              <p className="text-sm font-semibold">{entry.name}</p>
              <p className="text-xs text-[#637067]">{entry.kind}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

function MembershipsPreview() {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <div className="rounded-xl border border-[#EDEDE4] p-4">
        <p className="flex items-center gap-2 font-semibold">
          <Globe className="h-4 w-4 text-[#326B42]" /> Community
        </p>
        <p className="mt-1 text-2xl font-bold">Free</p>
        <ul className="mt-3 space-y-1.5 text-sm text-[#3B463E]">
          <li className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 text-[#326B42]" /> Discussions and events
          </li>
          <li className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 text-[#326B42]" /> Member directory
          </li>
        </ul>
      </div>
      <div className="rounded-xl border-2 border-[#326B42] p-4">
        <p className="flex items-center gap-2 font-semibold">
          <Crown className="h-4 w-4 text-[#C08A1E]" /> Supporter
        </p>
        <p className="mt-1 text-2xl font-bold">
          You set the price
        </p>
        <ul className="mt-3 space-y-1.5 text-sm text-[#3B463E]">
          <li className="flex gap-2">
            <Check className="mt-0.5 h-4 w-4 text-[#326B42]" /> Everything in Community
          </li>
          <li className="flex gap-2">
            <Lock className="mt-0.5 h-4 w-4 text-[#C96745]" /> Paid spaces and courses
          </li>
        </ul>
      </div>
    </div>
  );
}

function ResourcesPreview() {
  const items: { icon: ReactNode; name: string; kind: string }[] = [
    { icon: <FileText className="h-4 w-4" />, name: "Welcome pack", kind: "PDF file" },
    { icon: <Link2 className="h-4 w-4" />, name: "Booking calendar", kind: "Link" },
    { icon: <BookOpen className="h-4 w-4" />, name: "Getting around: a members' guide", kind: "Guide" },
    { icon: <Lock className="h-4 w-4" />, name: "Committee minutes", kind: "Members-only file" },
  ];
  return (
    <ul className="space-y-2">
      {items.map((item) => (
        <li key={item.name} className="flex items-center gap-3 rounded-xl border border-[#EDEDE4] p-3">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#E9EEE4] text-[#326B42]">{item.icon}</span>
          <div>
            <p className="text-sm font-semibold">{item.name}</p>
            <p className="text-xs text-[#637067]">{item.kind}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}

function SearchBar({ placeholder }: { placeholder: string }) {
  return (
    <div className="flex items-center gap-2 rounded-xl border border-[#EDEDE4] px-3 py-2 text-sm text-[#8A948C]">
      <Search className="h-4 w-4" /> {placeholder}
    </div>
  );
}
