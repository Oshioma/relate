import Image from "next/image";
import { ArrowRight, Car, ExternalLink, Users } from "lucide-react";
import { formatTaxiPrice, getZanzibarRentalsTaxis, LIST_YOUR_TAXI_URL } from "@/lib/zanzibar-rentals/taxis";

// "Taxis on Zanzibar Rentals": every taxi route hosts list on
// www.zanzibarrentals.com, under Mzungu Zanzibar's directory Taxi category and
// the Getting Around guide's drivers. Fetched on the server (cached, 3s
// timeout); render it inside <Suspense> so a slow feed never holds up the
// page. Any failure renders nothing at all. One photo per card, each linking
// out, so no photo viewer here.
export async function ZanzibarRentalsTaxis({ headingLevel = "h2", className = "mt-10" }: { headingLevel?: "h2" | "h3"; className?: string }) {
  const taxis = await getZanzibarRentalsTaxis();
  if (!taxis) return null;
  const Heading = headingLevel;
  return (
    <section aria-labelledby="zr-rentals-taxis" className={`${className} rounded-lg border border-border bg-card p-4`}>
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <Heading id="zr-rentals-taxis" className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Car className="h-4 w-4 text-accent" aria-hidden /> Taxis on Zanzibar Rentals
        </Heading>
        <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">Partner listings</p>
      </div>
      <ul className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {taxis.map((taxi) => (
          <li key={taxi.id}>
            <a
              href={taxi.url}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex h-full gap-3 rounded-lg border border-border bg-background p-3 hover:border-accent/50"
            >
              <span className="relative h-16 w-16 shrink-0 overflow-hidden rounded-md bg-muted">
                {taxi.photoUrl ? (
                  <Image src={taxi.photoUrl} alt={`${taxi.host}'s car`} fill sizes="64px" className="object-cover" />
                ) : (
                  <span className="absolute inset-0 flex items-center justify-center text-muted-foreground" aria-hidden>
                    <Car className="h-6 w-6" />
                  </span>
                )}
              </span>
              <span className="flex min-w-0 flex-1 flex-col">
                <span className="flex items-center gap-1 text-sm font-semibold text-foreground group-hover:text-accent">
                  <span className="truncate">{taxi.from}</span>
                  {taxi.to && (
                    <>
                      <ArrowRight className="h-3.5 w-3.5 shrink-0 text-accent" aria-label="to" />
                      <span className="truncate">{taxi.to}</span>
                    </>
                  )}
                </span>
                <span className="mt-0.5 truncate text-xs text-muted-foreground">{taxi.host}</span>
                <span className="mt-auto flex flex-wrap items-center justify-between gap-2 pt-2 text-xs">
                  <span className="font-medium text-foreground">{formatTaxiPrice(taxi)}</span>
                  {taxi.seats && (
                    <span className="inline-flex items-center gap-1 text-muted-foreground">
                      <Users className="h-3 w-3" aria-hidden /> Up to {taxi.seats}
                    </span>
                  )}
                </span>
                <span className="mt-1 inline-flex items-center gap-1 text-xs font-medium text-accent">
                  Book on Zanzibar Rentals <ExternalLink className="h-3 w-3" aria-hidden />
                  <span className="sr-only">(opens in a new tab)</span>
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
      <p className="mt-3 text-xs text-muted-foreground">
        Listed and priced by their drivers on Zanzibar Rentals, a separate site; you book and pay the driver there. Not reviewed by our editors.
      </p>
      <p className="mt-3 text-sm text-foreground">
        Drive a taxi in Zanzibar?{" "}
        <a href={LIST_YOUR_TAXI_URL} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 font-medium text-accent hover:underline">
          Add your routes to ZanzibarRentals.com <ExternalLink className="h-3 w-3" aria-hidden />
          <span className="sr-only">(opens in a new tab)</span>
        </a>
      </p>
    </section>
  );
}
