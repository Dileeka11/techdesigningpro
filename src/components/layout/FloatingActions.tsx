import { site } from "@/content/site";
import { PhoneIcon, WhatsAppIcon } from "@/components/ui/Icons";

/** Floating WhatsApp + call buttons, like the old site had. */
export function FloatingActions() {
  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col gap-3 md:bottom-8 md:right-8">
      <a
        href={site.phoneHref}
        aria-label={site.phone}
        className="grid h-12 w-12 place-items-center rounded-full border border-gold-300/40 bg-ink/90 text-gold-200 shadow-lg transition-transform duration-500 hover:-translate-y-1"
      >
        <PhoneIcon />
      </a>
      <a
        href={site.whatsappHref}
        target="_blank"
        rel="noopener"
        aria-label={`WhatsApp ${site.phone}`}
        className="relative grid h-14 w-14 place-items-center rounded-full bg-[#25d366] text-white shadow-[0_12px_30px_-8px_rgba(37,211,102,0.7)] transition-transform duration-500 hover:-translate-y-1"
      >
        <span aria-hidden className="absolute inset-0 animate-pulse-ring rounded-full bg-[#25d366]" />
        <WhatsAppIcon width={28} height={28} className="relative" />
      </a>
    </div>
  );
}
