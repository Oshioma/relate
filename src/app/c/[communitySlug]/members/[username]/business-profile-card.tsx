import { Globe } from "lucide-react";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import type { BusinessProfile } from "@/types/database";

const SOCIAL_LABELS: Record<string, string> = {
  linkedin: "LinkedIn",
  twitter: "Twitter / X",
  instagram: "Instagram",
  facebook: "Facebook",
};

export function BusinessProfileCard({ business }: { business: BusinessProfile }) {
  const contactEntries = Object.entries(business.contact_links).filter(([, value]) => Boolean(value));
  const socialEntries = Object.entries(business.social_links).filter(([, url]) => Boolean(url));

  return (
    <div>
      <div className="flex items-start gap-3">
        <Avatar src={business.logo_url} name={business.business_name} size={48} />
        <div className="min-w-0">
          <h3 className="text-sm font-semibold text-foreground">{business.business_name}</h3>
          {business.industry && <p className="text-xs text-muted-foreground">{business.industry}</p>}
          {business.location && <p className="text-xs text-muted-foreground">{business.location}</p>}
        </div>
      </div>

      {business.description && <p className="mt-3 text-sm text-foreground">{business.description}</p>}

      {business.services.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Services</p>
          <div className="flex flex-wrap gap-1.5">
            {business.services.map((service) => (
              <Badge key={service} tone="neutral">
                {service}
              </Badge>
            ))}
          </div>
        </div>
      )}

      {business.products.length > 0 && (
        <div className="mt-3">
          <p className="mb-1.5 text-xs font-medium uppercase tracking-wide text-muted-foreground">Products</p>
          <div className="flex flex-wrap gap-1.5">
            {business.products.map((product) => (
              <Badge key={product} tone="neutral">
                {product}
              </Badge>
            ))}
          </div>
        </div>
      )}

      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm">
        {business.website && (
          <a href={business.website} target="_blank" rel="noreferrer" className="flex items-center gap-1 text-accent hover:underline">
            <Globe className="h-3.5 w-3.5" /> Website
          </a>
        )}
        {contactEntries.map(([key, value]) => (
          <span key={key} className="text-muted-foreground">
            {value}
          </span>
        ))}
        {socialEntries.map(([key, url]) => (
          <a key={key} href={url} target="_blank" rel="noreferrer" className="text-accent hover:underline">
            {SOCIAL_LABELS[key] ?? key}
          </a>
        ))}
      </div>
    </div>
  );
}
