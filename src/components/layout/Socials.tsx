import { site } from "@/content/site";
import { FacebookIcon, InstagramIcon, LinkedInIcon } from "@/components/ui/Icons";

const items = [
  { key: "linkedin", label: "LinkedIn", Icon: LinkedInIcon },
  { key: "instagram", label: "Instagram", Icon: InstagramIcon },
  { key: "facebook", label: "Facebook", Icon: FacebookIcon },
] as const;

/** Social icons – only rendered for networks that have a URL in content/site.ts. */
export function Socials({ className = "", boxed }: { className?: string; boxed?: boolean }) {
  const links = items.filter((i) => site.social[i.key]);
  if (!links.length) return null;
  return (
    <ul className={`flex items-center ${className}`}>
      {links.map(({ key, label, Icon }) => (
        <li key={key}>
          <a
            href={site.social[key]}
            target="_blank"
            rel="noopener"
            aria-label={label}
            className={
              boxed
                ? "grid h-10 w-10 place-items-center rounded-full border border-line-strong text-gold-200 transition-colors hover:border-gold-300 hover:bg-gold-300/10"
                : "text-mist transition-colors hover:text-gold-200"
            }
          >
            <Icon />
          </a>
        </li>
      ))}
    </ul>
  );
}
