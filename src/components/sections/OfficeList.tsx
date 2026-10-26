import { site } from "@/content/site";
import { vars } from "@/lib/css";

/**
 * Dubai | Philippines | India | Sri Lanka – shown next to the 3D office globe.
 * `compact` is the small, static version used in the header bars.
 */
export function OfficeList({ className = "", compact = false }: { className?: string; compact?: boolean }) {
  return (
    <ul className={`flex flex-wrap ${compact ? "gap-x-4 gap-y-1" : "gap-x-6 gap-y-3"} ${className}`}>
      {site.offices.map((o, i) => {
        const dot = i === 0 ? "bg-[#ff6b7d]" : "bg-gold-300";
        return compact ? (
          <li key={o} className="flex items-center gap-2 whitespace-nowrap">
            <span aria-hidden className={`inline-flex h-2 w-2 rounded-full ${dot}`} />
            {o}
          </li>
        ) : (
          <li key={o} data-reveal style={vars({ "--reveal-delay": `${i * 80}ms` })} className="flex items-center gap-2.5 text-sm text-fog">
            <span className="relative flex h-2.5 w-2.5">
              <span className={`absolute inline-flex h-full w-full animate-pulse-ring rounded-full ${dot}`} />
              <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${dot}`} />
            </span>
            {o}
          </li>
        );
      })}
    </ul>
  );
}
