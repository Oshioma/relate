import type { Metadata } from "next";
import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { ContactForm } from "./contact-form";

export const metadata: Metadata = { title: "Contact — Relate" };

// WhatsApp support. The number is public-facing (a support line), unlike the
// contact-form recipient, which stays server-side. wa.me wants the number in
// international format with no "+", spaces or dashes.
const WHATSAPP_NUMBER = "447951769553";
const WHATSAPP_DISPLAY = "+44 7951 769553";
const WHATSAPP_HREF = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent("Hi Relate, I'd like some help with…")}`;

export default function ContactPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-10 sm:px-6 sm:py-14">
      <Link href="/" className="text-sm text-muted-foreground hover:text-foreground">
        ← Relate
      </Link>
      <h1 className="mb-2 mt-4 text-2xl font-semibold tracking-tight text-foreground">Get in touch</h1>
      <p className="mb-8 text-sm text-muted-foreground">
        Send us a message and we&apos;ll reply by email, or reach us on WhatsApp for quicker support.
      </p>

      <a
        href={WHATSAPP_HREF}
        target="_blank"
        rel="noopener noreferrer"
        className="mb-8 flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-colors hover:bg-muted"
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent-soft text-accent">
          <MessageCircle className="h-5 w-5" />
        </span>
        <span>
          <span className="block text-sm font-medium text-foreground">WhatsApp support</span>
          <span className="block text-sm text-muted-foreground">{WHATSAPP_DISPLAY}</span>
        </span>
      </a>

      <ContactForm />
    </div>
  );
}
