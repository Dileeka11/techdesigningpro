import type { Metadata } from "next";
import { contact } from "@/content/gallery";
import { site } from "@/content/site";
import { PageHero } from "@/components/sections/PageHero";
import { ContactForm } from "@/components/sections/ContactForm";
import { OfficeList } from "@/components/sections/OfficeList";
import { SplitHeading } from "@/components/ui/SplitHeading";
import { Tilt } from "@/components/ui/Tilt";
import { MailIcon, PhoneIcon, PinIcon, WhatsAppIcon } from "@/components/ui/Icons";
import { vars } from "@/lib/css";

export const metadata: Metadata = {
  title: contact.title,
  description: contact.formText,
  alternates: { canonical: "/contact-us/" },
};

const cards = [
  { Icon: PhoneIcon, label: site.phone, href: site.phoneHref },
  { Icon: MailIcon, label: site.email, href: site.emailHref },
  { Icon: PinIcon, label: site.location },
];

export default function ContactPage() {
  return (
    <>
      <PageHero title={contact.title} crumbs={[{ label: "Home", href: "/" }, { label: "Contact Us" }]} image="bg/about_header" scene="globe" />

      <section className="relative pb-20 pt-6 md:pb-28">
        <div className="container-x grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:gap-12">
          <div className="space-y-4">
            {cards.map(({ Icon, label, href }, i) => {
              const inner = (
                <div className="border-gold-gradient flex items-center gap-5 rounded-3xl p-6 transition-colors duration-500">
                  <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-gold-300/10 text-gold-200">
                    <Icon width={24} height={24} />
                  </span>
                  <span className="tilt-pop min-w-0 break-words text-lg text-white">{label}</span>
                </div>
              );
              return (
                <div key={label} data-reveal style={vars({ "--reveal-delay": `${i * 100}ms` })}>
                  <Tilt className="rounded-3xl" max={6}>
                    {href ? (
                      <a href={href} className="block">
                        {inner}
                      </a>
                    ) : (
                      inner
                    )}
                  </Tilt>
                </div>
              );
            })}
            <a
              data-reveal
              style={vars({ "--reveal-delay": "300ms" })}
              href={site.whatsappHref}
              target="_blank"
              rel="noopener"
              className="btn btn-gold w-full"
            >
              <WhatsAppIcon width={18} height={18} />
              {site.consultNow}
            </a>
            <div data-reveal className="rounded-3xl border border-line bg-panel/60 p-6">
              <OfficeList />
            </div>
          </div>

          <div data-reveal="zoom" id="contact-form" className="border-gold-gradient relative overflow-hidden rounded-[32px] p-7 sm:p-10">
            <div aria-hidden className="absolute -right-24 -top-24 h-72 w-72 rounded-full bg-gold-400/10 blur-3xl" />
            <div className="relative">
              <SplitHeading text={contact.formTitle} className="text-4xl font-medium sm:text-5xl" />
              <p className="mb-8 mt-4 text-[16px] leading-8 text-mist">{contact.formText}</p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      <section className="relative pb-28 md:pb-36">
        <div className="container-x">
          <div data-reveal className="corners overflow-hidden rounded-[32px] border border-line-strong">
            <iframe
              title={site.location}
              src={contact.mapSrc}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="block h-[420px] w-full [filter:grayscale(1)_invert(0.92)_sepia(0.35)_hue-rotate(5deg)_contrast(0.95)] md:h-[480px]"
            />
          </div>
        </div>
      </section>
    </>
  );
}
