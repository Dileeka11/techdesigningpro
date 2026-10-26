"use client";

import { useState, type FormEvent } from "react";
import { contact } from "@/content/gallery";
import { projects } from "@/content/projects";
import { site } from "@/content/site";
import { field, label } from "@/components/sections/ContactForm";
import { ArrowIcon, CheckIcon } from "@/components/ui/Icons";

type Status = "idle" | "sending" | "sent" | "error";

const inputs = [
  { id: "ri-name", name: "pname", type: "text", max: 120, auto: "name", text: contact.fields.name },
  { id: "ri-phone", name: "pcell", type: "tel", max: 40, auto: "tel", text: contact.fields.phone },
  { id: "ri-email", name: "pemail", type: "email", max: 160, auto: "email", text: contact.fields.email },
] as const;

/** One-row "Request Information" form on the Projects page – posts to /contact.php. */
export function RequestInfoBar() {
  const [status, setStatus] = useState<Status>("idle");

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
    <div data-reveal className="border-gold-gradient relative overflow-hidden rounded-[28px] p-6 sm:p-8">
      <div aria-hidden className="absolute -left-24 -top-24 h-64 w-64 rounded-full bg-gold-400/10 blur-3xl" />
      <form action={site.contactEndpoint} method="post" onSubmit={onSubmit} className="relative grid items-center gap-4 lg:grid-cols-[auto_1fr_1fr_1fr_auto]">
        <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
          <input type="text" name="website" tabIndex={-1} autoComplete="off" />
        </div>
        <input type="hidden" name="message" value={projects.requestInfo.message} />
        <h2 className="font-display text-2xl text-white lg:pr-4 lg:text-[1.65rem]">{projects.requestInfo.title}</h2>
        {inputs.map((i) => (
          <div key={i.id} className="relative">
            <input id={i.id} name={i.name} type={i.type} required maxLength={i.max} placeholder={i.text} autoComplete={i.auto} className={field} />
            <label htmlFor={i.id} className={label}>
              {i.text}
            </label>
          </div>
        ))}
        <div className="flex items-center gap-4">
          <button type="submit" disabled={status === "sending"} className="btn btn-gold w-full disabled:opacity-70 lg:w-auto">
            {status === "sending" ? (
              <span aria-hidden className="h-5 w-5 animate-spin rounded-full border-2 border-ink/30 border-t-ink" />
            ) : status === "sent" ? (
              <CheckIcon />
            ) : null}
            {contact.submit}
            {status === "idle" || status === "error" ? <ArrowIcon width={18} height={18} /> : null}
          </button>
          <p role="status" aria-live="polite" className="text-sm empty:hidden">
            {status === "error" ? (
              <a href={site.emailHref} className="text-[#ff8a9a] underline-offset-4 hover:underline">
                {site.email}
              </a>
            ) : null}
          </p>
        </div>
      </form>
    </div>
  );
}
