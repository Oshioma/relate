import Link from "next/link";
import { redirect } from "next/navigation";
import { Users, Layers, CalendarDays, BookOpen, MessageCircle, ArrowRight, ShieldCheck, Heart, GraduationCap, Store, MapPin, Crown, BarChart3, Check, Sparkles } from "lucide-react";
import type { ReactNode } from "react";
import { createClient } from "@/lib/supabase/server";
import { Avatar } from "@/components/ui/avatar";
import type { Community } from "@/types/database";
import { SHOWCASE_COUNT } from "@/lib/homepage-showcase";
import { communitySubdomainUrl } from "@/lib/custom-domain";
import { WHATSAPP_DISPLAY, WHATSAPP_HREF } from "@/lib/support-contact";

const SHOWCASE_POOL = 12;
const green = "#326B42";
function showcaseRank(community: Community): number {
  return (community.description?.trim() ? 2 : 0) + (community.logo_url ? 1 : 0);
}
function communityFrontDoor(community: Community): string {
  if (community.custom_domain && community.custom_domain_verified_at) return `https://${community.custom_domain}`;
  return communitySubdomainUrl(community.slug) ?? `/c/${community.slug}`;
}
const features: { icon: ReactNode; title: string; description: string }[] = [
  { icon: <MessageCircle />, title: "Discussions", description: "Bring people together with thoughtful conversations." },
  { icon: <Layers />, title: "Spaces", description: "Organize public, private and premium spaces." },
  { icon: <GraduationCap />, title: "Courses", description: "Share knowledge, lessons and resources." },
  { icon: <CalendarDays />, title: "Events", description: "Bring members together online or in person." },
  { icon: <Store />, title: "Marketplace", description: "Give your community a place to exchange." },
  { icon: <MapPin />, title: "Directories", description: "Help people discover members, places and resources." },
  { icon: <Crown />, title: "Memberships", description: "Offer free access, paid membership or premium spaces." },
  { icon: <BarChart3 />, title: "Community tools", description: "Manage members, roles and community activity." },
];
const presets = [
  ["Open", "A welcoming space anyone can explore."],
  ["Private", "A quieter home for invited members."],
  ["Paid membership", "Build a community around your expertise."],
  ["Free + premium", "Let everyone in, with extras for supporters."],
  ["Custom", "Make your own rules for every space."],
];
export default async function LandingPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (user) redirect("/dashboard");

  const { data: picked } = await supabase.from("communities").select("*")
    .eq("is_public", true).not("featured_at", "is", null)
    .order("featured_at", { ascending: false }).limit(SHOWCASE_COUNT);
  let featuredCommunities: Community[] = picked ?? [];
  if (featuredCommunities.length === 0) {
    const { data: recentPublic } = await supabase.from("communities").select("*")
      .eq("is_public", true).order("created_at", { ascending: false }).limit(SHOWCASE_POOL);
    featuredCommunities = [...(recentPublic ?? [])]
      .sort((a, b) => showcaseRank(b) - showcaseRank(a)).slice(0, SHOWCASE_COUNT);
  }

  return (
    <div className="min-h-screen bg-[#F7F4EC] text-[#222A25]">
      <header className="sticky top-0 z-30 border-b border-[#326B42]/10 bg-[#F7F4EC]/95 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-5 py-4 sm:px-8">
          <Link href="/" className="flex items-center gap-2 text-xl font-extrabold tracking-tight" aria-label="Relate home">
            <Heart className="h-7 w-7 text-[#326B42]" strokeWidth={2.5} />
            relate<span className="text-[#326B42]">.click</span>
          </Link>
          <nav aria-label="Main navigation" className="hidden items-center gap-7 text-sm font-medium md:flex">
            <a href="#features" className="hover:text-[#326B42]">Features</a>
            <a href="#communities" className="hover:text-[#326B42]">Communities</a>
            <a href="#how-it-works" className="hover:text-[#326B42]">How it works</a>
            <Link href="/pricing" className="hover:text-[#326B42]">Pricing</Link>
            <Link href="/contact" className="hover:text-[#326B42]">Support</Link>
          </nav>
          <div className="flex items-center gap-3 text-sm font-semibold">
            <Link href="/login" className="hover:text-[#326B42]">Sign in</Link>
            <Link href="/signup" className="rounded-full bg-[#326B42] px-4 py-2.5 text-white transition hover:bg-[#255333]">Get started <ArrowRight className="ml-1 inline h-4 w-4" /></Link>
          </div>
        </div>
      </header>

      <main>
        <section className="relative overflow-hidden bg-gradient-to-br from-[#F7F4EC] via-[#F3F4E9] to-[#DCE8D9]">
          <div className="mx-auto grid max-w-7xl items-center gap-12 px-6 py-20 sm:px-8 lg:grid-cols-2 lg:py-28">
            <div>
              <span className="inline-flex rounded-full bg-[#DCE8D9] px-4 py-2 text-xs font-bold uppercase tracking-widest text-[#326B42]">Communities for real people</span>
              <h1 className="mt-6 text-5xl font-extrabold leading-[1.08] tracking-tight sm:text-6xl">Build your community.<br /><span className="text-[#326B42]">Bring your people together.</span></h1>
              <p className="mt-6 text-lg font-medium">A calm, private home for your community.</p>
              <p className="mt-3 max-w-xl text-base leading-7 text-[#4D5A50]">Whether you run a networking group, mastermind, co-working space, membership, or local community, Relate helps your audience connect like never before — creating stronger relationships that keep people coming back.</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/signup" className="inline-flex items-center gap-2 rounded-xl bg-[#326B42] px-6 py-3.5 font-semibold text-white shadow-sm hover:bg-[#255333]">Create your community <ArrowRight className="h-4 w-4" /></Link>
                <a href="#communities" className="inline-flex items-center gap-2 rounded-xl border border-[#326B42] px-6 py-3.5 font-semibold text-[#326B42] hover:bg-white">Explore communities</a>
              </div>
              <p className="mt-6 text-sm text-[#526452]"><Check className="mr-1 inline h-4 w-4 text-[#326B42]" /> Simple to set up <Check className="ml-3 mr-1 inline h-4 w-4 text-[#326B42]" /> Flexible access <Check className="ml-3 mr-1 inline h-4 w-4 text-[#326B42]" /> Built to grow</p>
              <p className="mt-4 text-sm text-[#526452]">Spend less time managing your community and more time growing it.</p>
            </div>
            <div className="relative rounded-[2rem] bg-white p-4 shadow-2xl ring-1 ring-[#326B42]/10 sm:p-6">
              <div className="overflow-hidden rounded-2xl border border-[#DCE8D9]">
                <div className="flex items-center justify-between bg-[#326B42] px-5 py-4 text-white"><span className="font-bold">Your community</span><span className="rounded-full bg-white/20 px-3 py-1 text-xs">Community preview</span></div>
                <div className="bg-gradient-to-r from-[#DCE8D9] to-[#F6E6D6] px-5 py-8">
                  <div className="flex items-center gap-3"><div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-[#326B42]"><Heart /></div><div><p className="text-xl font-bold">A place to belong</p><p className="text-sm text-[#526452]">Connect · Share · Grow</p></div></div>
                </div>
                <div className="grid grid-cols-3 gap-2 border-b p-3 text-center text-xs font-semibold sm:grid-cols-6">
                  {["Feed", "Spaces", "Events", "Courses", "Guides", "Members"].map(item => <span key={item} className="rounded-lg bg-[#F7F4EC] px-1 py-2">{item}</span>)}
                </div>
                <div className="grid gap-3 bg-[#FBFAF7] p-4 sm:grid-cols-2">
                  <div className="rounded-xl border bg-white p-4"><MessageCircle className="mb-3 text-[#326B42]" /><h3 className="font-semibold">Start a conversation</h3><p className="mt-2 text-sm text-[#637067]">A welcoming place for your members to share ideas.</p></div>
                  <div className="rounded-xl border bg-white p-4"><CalendarDays className="mb-3 text-[#C96745]" /><h3 className="font-semibold">Upcoming gatherings</h3><p className="mt-2 text-sm text-[#637067]">Make it easy to connect beyond the feed.</p></div>
                  <div className="rounded-xl border bg-white p-4"><BookOpen className="mb-3 text-[#326B42]" /><h3 className="font-semibold">Resources & guides</h3><p className="mt-2 text-sm text-[#637067]">Keep useful knowledge in one place.</p></div>
                  <div className="rounded-xl border bg-white p-4"><Users className="mb-3 text-[#C96745]" /><h3 className="font-semibold">Your people</h3><p className="mt-2 text-sm text-[#637067]">Build lasting relationships in your community.</p></div>
                </div>
              </div>
              <span className="absolute -bottom-4 -right-3 rounded-2xl bg-[#F6E6D6] px-5 py-3 text-sm font-bold text-[#9C492E] shadow-lg">Your people. Your way.</span>
            </div>
          </div>
        </section>

        <section id="features" className="mx-auto max-w-7xl scroll-mt-24 px-6 py-20 sm:px-8">
          <div className="mx-auto max-w-2xl text-center"><p className="text-xs font-bold uppercase tracking-widest text-[#326B42]">Everything in one place</p><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Turn members into a thriving community.</h2><p className="mt-4 text-[#526452]">Communities grow because people build relationships. Relate helps community hosts make those connections happen.</p></div>
          <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{features.map(feature => <div key={feature.title} className="rounded-2xl border border-[#E7E7DC] bg-white p-6 shadow-sm"><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-[#DCE8D9] text-[#326B42]">{feature.icon}</div><h3 className="font-bold">{feature.title}</h3><p className="mt-2 text-sm leading-6 text-[#637067]">{feature.description}</p></div>)}</div>
          <p className="mt-6 text-center text-sm text-[#526452]">And all the essentials: announcements, member permissions, resources, links, files and guides.</p>
        </section>

        {featuredCommunities.length > 0 && <section id="communities" className="scroll-mt-24 bg-white py-20"><div className="mx-auto max-w-7xl px-6 sm:px-8"><p className="text-xs font-bold uppercase tracking-widest text-[#326B42]">Real communities</p><div className="mt-3 flex flex-wrap items-end justify-between gap-4"><div><h2 className="text-3xl font-extrabold sm:text-4xl">Already at home on Relate.</h2><p className="mt-3 text-[#526452]">Discover the people, places and ideas bringing communities together.</p></div></div><div className="mt-9 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">{featuredCommunities.map(community => <a key={community.id} href={communityFrontDoor(community)} target="_blank" rel="noopener noreferrer" className="group rounded-2xl border border-[#E7E7DC] bg-[#FBFAF7] p-6 transition hover:-translate-y-1 hover:shadow-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#326B42]"><Avatar src={community.logo_url} name={community.name} initials={community.logo_initials} size={56} className="mb-4" /><h3 className="text-lg font-bold group-hover:text-[#326B42]">{community.name} <ArrowRight className="inline h-4 w-4" /></h3>{community.description && <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#637067]">{community.description}</p>}</a>)}</div></div></section>}

        <section id="how-it-works" className="scroll-mt-24 bg-[#E9EEE4] py-20"><div className="mx-auto max-w-7xl px-6 sm:px-8"><div className="max-w-2xl"><p className="text-xs font-bold uppercase tracking-widest text-[#326B42]">Your community, your rules</p><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">Powerful tools. Without the complexity.</h2><p className="mt-4 text-[#526452]">Start with a simple community setup and choose the access model that fits your people.</p></div><div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">{presets.map(([title, description], i) => <div key={title} className="rounded-2xl bg-white p-5 shadow-sm"><span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#DCE8D9] text-sm font-bold text-[#326B42]">{i + 1}</span><h3 className="mt-4 font-bold">{title}</h3><p className="mt-2 text-sm leading-6 text-[#637067]">{description}</p></div>)}</div><div className="mt-9 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-[#326B42] px-7 py-7 text-white"><div><h3 className="text-xl font-bold">Free, private or paid — make it yours.</h3><p className="mt-1 text-sm text-white/85">Bring together discussions, resources and memberships as your community grows.</p></div><Link href="/signup" className="rounded-xl bg-white px-5 py-3 font-bold text-[#326B42]">Get started <ArrowRight className="ml-1 inline h-4 w-4" /></Link></div></div></section>

        <section className="mx-auto max-w-5xl px-6 py-20 text-center"><p className="text-xs font-bold uppercase tracking-widest text-[#326B42]">From a community creator</p><h2 className="mt-3 text-3xl font-extrabold">Real people. Real impact.</h2><div className="mx-auto mt-8 max-w-2xl rounded-3xl border border-[#DCE8D9] bg-white px-8 py-10"><p className="text-lg italic leading-8 text-[#526452]">Your community creator testimonial will appear here.</p><p className="mt-5 text-sm font-semibold text-[#326B42]">Creator name · Community name</p></div></section>

        <section className="bg-[#326B42] py-16 text-white"><div className="mx-auto grid max-w-7xl gap-8 px-6 sm:px-8 lg:grid-cols-2 lg:items-center"><div><p className="text-xs font-bold uppercase tracking-widest text-[#DCE8D9]">We are for the budget crowd</p><h2 className="mt-3 text-3xl font-extrabold sm:text-4xl">24 hour support.</h2><p className="mt-4 text-xl font-semibold">Call me for improvements. Let&apos;s make this work together!</p><p className="mt-3 text-white/85">You want everything, but you don&apos;t want to pay the world.</p></div><div className="flex flex-wrap gap-3 lg:justify-end"><a href={WHATSAPP_HREF} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3 font-bold text-[#326B42]"><MessageCircle className="h-5 w-5" /> WhatsApp {WHATSAPP_DISPLAY}</a><Link href="/contact" className="inline-flex items-center rounded-xl border border-white/70 px-6 py-3 font-bold text-white">Or send a message</Link></div></div></section>

        <section className="bg-gradient-to-r from-[#F6E6D6] to-[#DCE8D9] px-6 py-20 text-center"><Sparkles className="mx-auto h-8 w-8 text-[#C96745]" /><h2 className="mt-4 text-4xl font-extrabold">Your people are out there.<br />Bring them together.</h2><p className="mx-auto mt-4 max-w-xl text-[#526452]">A calm, private home for your community, with the tools to help it grow.</p><div className="mt-7 flex flex-wrap justify-center gap-3"><Link href="/signup" className="rounded-xl bg-[#326B42] px-6 py-3 font-bold text-white">Create your community <ArrowRight className="ml-1 inline h-4 w-4" /></Link><a href="#communities" className="rounded-xl border border-[#326B42] px-6 py-3 font-bold text-[#326B42]">Explore communities</a></div></section>
      </main>
      <footer className="bg-[#222A25] px-6 py-10 text-sm text-white/80"><div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-5"><span className="font-bold text-white">relate.click <span className="ml-2 font-normal text-white/65">— built for quiet, focused communities.</span></span><nav aria-label="Legal and support" className="flex flex-wrap gap-x-5 gap-y-2"><Link href="/terms" className="hover:text-white">Terms &amp; Conditions</Link><Link href="/privacy" className="hover:text-white">Privacy Policy</Link><Link href="/community-owner-agreement" className="hover:text-white">Owner Agreement</Link><Link href="/pricing" className="hover:text-white">Pricing</Link><Link href="/contact" className="hover:text-white">Contact</Link></nav></div></footer>
    </div>
  );
}
