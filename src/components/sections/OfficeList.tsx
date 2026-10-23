import { site } from "@/content/site";
import { vars } from "@/lib/css";

/** Dubai | Philippines | India | Sri Lanka – shown next to the 3D office globe. */
export function OfficeList({ className = "" }: { className?: string }) {
  return (
    <ul className={`flex flex-wrap gap-x-6 gap-y-3 ${className}`}>
      {site.offices.map((o, i) => (
        <li key={o} data-reveal style={vars({ "--reveal-delay": `${i * 80}ms` })} className="flex items-center gap-2.5 text-sm text-fog">
          <span className="relative flex h-2.5 w-2.5">
            <span className={`absolute inline-flex h-full w-full animate-pulse-ring rounded-full ${i === 0 ? "bg-[#ff6b7d]" : "bg-gold-300"}`} />
            <span className={`relative inline-flex h-2.5 w-2.5 rounded-full ${i === 0 ? "bg-[#ff6b7d]" : "bg-gold-300"}`} />
          </span>
          {o}
        </li>
      ))}
    </ul>
  );
}
