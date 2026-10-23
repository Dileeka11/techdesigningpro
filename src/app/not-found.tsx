import Link from "next/link";
import { nav } from "@/content/site";

export default function NotFound() {
  return (
    <section className="relative grid min-h-[80vh] place-items-center overflow-hidden pt-32">
      <div aria-hidden className="bg-blueprint mask-radial absolute inset-0 opacity-70" />
      <div className="container-x relative text-center">
        <p className="text-gold font-display text-[9rem] leading-none sm:text-[13rem]">404</p>
        <ul className="mt-10 flex flex-wrap justify-center gap-3">
          {nav.map((n) => (
            <li key={n.href}>
              <Link href={n.href} className={n.href === "/" ? "btn btn-gold" : "btn btn-ghost"}>
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
