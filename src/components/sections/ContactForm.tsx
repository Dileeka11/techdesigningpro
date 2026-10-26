"use client";

import { useEffect, useState, type FormEvent } from "react";
import { contact } from "@/content/gallery";
import { site } from "@/content/site";
import { ArrowIcon, CheckIcon } from "@/components/ui/Icons";

type Status = "idle" | "sending" | "sent" | "error";

export const field =
  "peer w-full rounded-2xl border border-line-strong bg-ink/60 px-5 pb-3 pt-6 text-[15px] text-white outline-none transition-[border-color,box-shadow] duration-300 placeholder:text-transparent focus:border-gold-300/70 focus:shadow-[0_0_0_4px_rgba(214,170,72,0.12)]";
export const label =
  "pointer-events-none absolute left-5 top-4 origin-left text-[15px] text-mist transition-all duration-300 peer-focus:top-2 peer-focus:text-[11px] peer-focus:tracking-wider peer-focus:text-gold-300 peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:tracking-wider";

/**
 * Posts to /contact.php (PHP mail handler for shared hosting). Without JS the
 * form still works as a normal POST and the handler redirects back here.
 */
export function ContactForm() {
  const [status, setStatus] = useState<Status>("idle");

  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("sent") === "1") setStatus("sent");
    if (p.get("sent") === "0") setStatus("error");
  }, []);

  const onSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    try {
      const res = await fetch(site.contactEndpoint, { method: "POST", body: new FormData(form), headers: { Accept: "application/json" } });
      const json = (await res.json().catch(() => ({}))) as { ok?: boolean };
      if (!res.ok || !json.ok) throw new Error("failed");
      setStatus("sent");
      form.reset();
    } catch {
      setStatus("error");
    }
  };

  return (
    <form action={site.contactEndpoint} method="post" onSubmit={onSubmit} className="relative space-y-4" noValidate={false}>
      {/* honeypot – real visitors never see or fill this */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="relative">
          <input id="pname" name="pname" type="text" required maxLength={120} placeholder={contact.fields.name} autoComplete="name" className={field} />
          <label htmlFor="pname" className={label}>
            {contact.fields.name}
          </label>
        </div>
        <div className="relative">
          <input id="pcell" name="pcell" type="tel" required maxLength={40} placeholder={contact.fields.phone} autoComplete="tel" className={field} />
          <label htmlFor="pcell" className={label}>
            {contact.fields.phone}
          </label>
        </div>
      </div>
      <div className="relative">
        <input id="pemail" name="pemail" type="email" required maxLength={160} placeholder={contact.fields.email} autoComplete="email" className={field} />
        <label htmlFor="pemail" className={label}>
          {contact.fields.email}
        </label>
      </div>
      <div className="relative">
        <textarea id="message" name="message" required rows={6} maxLength={5000} placeholder={contact.fields.message} className={`${field} resize-none`} />
        <label htmlFor="message" className={label}>
          {contact.fields.message}
        </label>
      </div>

      <div className="flex flex-wrap items-center gap-5 pt-2">
        <button type="submit" disabled={status === "sending"} className="btn btn-gold min-w-44 disabled:opacity-70">
          {status === "sending" ? (
            <span aria-hidden className="h-5 w-5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
          ) : status === "sent" ? (
            <CheckIcon />
          ) : null}
          {contact.submit}
          {status === "idle" || status === "error" ? <ArrowIcon width={18} height={18} /> : null}
        </button>
        <p role="status" aria-live="polite" className="text-sm">
          {status === "sent" ? (
            <span className="grid h-9 w-9 place-items-center rounded-full border border-gold-300/50 text-gold-200">
              <CheckIcon width={18} height={18} />
            </span>
          ) : status === "error" ? (
            <a href={site.emailHref} className="text-[#ff8a9a] underline-offset-4 hover:underline">
              {site.email}
            </a>
          ) : null}
        </p>
      </div>
    </form>
  );
}
