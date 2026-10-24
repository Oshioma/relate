import { Quote } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import type { CommunityTestimonial } from "@/types/database";

// What members say, on the signed-out landing page. The quotes are the
// admin's list (Admin -> Landing page), shown in order and word for word.
export function TestimonialsSection({
  communityName,
  testimonials,
}: {
  communityName: string;
  testimonials: CommunityTestimonial[];
}) {
  if (testimonials.length === 0) return null;
  return (
    <section aria-labelledby="testimonials-heading">
      <h2 id="testimonials-heading" className="mb-4 text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
        What members say about {communityName}
      </h2>
      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {testimonials.map((t, i) => (
          <Card key={i} className="flex flex-col gap-4 p-6">
            <Quote className="h-6 w-6 text-accent" aria-hidden />
            <blockquote className="flex-1 whitespace-pre-line text-base leading-relaxed text-foreground">
              “{t.quote}”
            </blockquote>
            {(t.name || t.avatarUrl) && (
              <div className="flex items-center gap-3">
                <Avatar src={t.avatarUrl} name={t.name || communityName} size={44} />
                {t.name && <p className="text-sm font-medium text-muted-foreground">– {t.name}</p>}
              </div>
            )}
          </Card>
        ))}
      </div>
    </section>
  );
}
