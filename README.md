# TechDesigningPro – website

Redesign of www.techdesigningpro.com as a 3D, animated **Next.js** site that exports to plain
HTML/CSS/JS, so it runs on any **shared host** (cPanel, `public_html`) with no Node.js server.

Every sentence of the old site is kept word for word (the text lives in `src/content/`).

## Stack

| Part | What it does |
| --- | --- |
| Next.js 16 (`output: "export"`) | Pre-renders every page to static HTML in `out/` |
| Tailwind CSS 4 | Black & gold design system (`src/app/globals.css`) |
| three.js + React Three Fiber | Live 3D scenes: gold tower (home), office globe, gold knot (about), one scene per service, gallery carousel |
| Remotion (`@remotion/player`) | The BIM workflow showreel on the home page, rendered live in the browser – no video file |
| Lenis | Smooth scrolling |
| sharp | Converts the original images to responsive WebP at build time |

3D and the showreel only download when they scroll into view, pause when off-screen, respect
"reduce motion", and fall back gracefully on devices without WebGL.

## Commands

```bash
npm install
npm run dev        # local development at http://localhost:3000
npm run build      # optimise images + build the static site into out/
npm run preview    # serve out/ at http://localhost:4173 to check the build
npm run studio     # open the showreel in Remotion Studio (edit timing/captions)
npm run render:showreel   # export the showreel as renders/showreel.mp4 (e.g. for social media)
```

## Deploy to shared hosting (cPanel)

1. `npm run build`
2. Upload **everything inside `out/`** to `public_html/` (File Manager → Upload a zip and Extract, or FTP).
   Make sure hidden files are included – `out/.htaccess` is important.
3. Done. `.htaccess` already:
   - 301-redirects the old URLs (`index.php`, `profile.php`, `services.php?mainid=5&subid=1..4`,
     `gallery.php`, `contact-us.php`) to the new pages, so Google rankings and old links keep working;
   - enables gzip/brotli compression and long-term caching of the hashed JS/CSS/font files;
   - serves `404.html` for missing pages.
   - Once SSL is active, uncomment the "Force HTTPS + www" lines at the top.

### Contact form

The "Get in Touch!" form posts to `/contact.php`, which emails the message with PHP `mail()`
(available on almost every shared host). Open `public/contact.php` to change:

- `$TO` – where enquiries are delivered (currently `info@techdesigningpro.com`)
- `$FROM` – must be an address on the hosted domain, otherwise many hosts reject the mail

It has a honeypot field against spam bots and works without JavaScript too.

## Editing

- **Text:** `src/content/site.ts`, `home.ts`, `about.ts`, `services.ts`, `gallery.ts`
- **Social icons:** add the LinkedIn / Instagram / Facebook URLs in `src/content/site.ts`
  (the old site linked them to `#`, so they stay hidden until real URLs are added)
- **Images:** put originals in `assets/original/{img,bg,gallery}` and run `npm run images`
  (also runs automatically on `npm run build`)
- **Showreel:** `src/remotion/` – captions are phrases from the site; preview with `npm run studio`

## Notes

- Remotion is free for individuals and companies with up to 3 employees; larger companies need a
  Remotion company licence (https://www.remotion.dev/license). If that applies, buy the licence
  and you can then add `acknowledgeRemotionLicense` to the `<Player>` in
  `src/components/showreel/ShowreelPlayer.tsx` to silence the console notice.
- The last paragraph of "FACILITY MANAGEMENT & OPERATIONS" on the Revit page ends mid-word
  ("…into one 3D model wi") on the original site as well; it was kept unchanged.
- The old floating WhatsApp/call buttons pointed to a different number (+971 52 909 7932) with the
  message "Hello M3 International" (left over from another site). They now use the company number
  +971 55 484 1633 like the rest of the site.
