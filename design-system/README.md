# Muhammad Essam — Design System

The visual language of Muhammad Essam's portfolio: a dark, quiet, developer-toned page with one blue accent, monospace type everywhere and translucent glass cards. It is extracted from the Next.js codebase (Tailwind v4, `src/app/globals.css`), so the tokens match what ships.

## Content fundamentals

- **Plain and professional.** Copy states facts about experience and work: "Flutter Developer with 3+ years of experience building and shipping production mobile applications for Android and iOS." No hype words, no emoji.
- **Short labels, sentence case.** Buttons are verbs with an object: "View Projects", "Download CV". Keywords are lowercase tags: `Flutter`, `Dart`, `BLoC`, `Clean Architecture`.
- **Technology names keep their casing.** Flutter, Dart, BLoC, Firebase, REST APIs.
- **Headings are the name, then the role.** The hero sets the name in white and the job title on the next line in primary.

## Visual foundations

- **Dark first.** The site renders with `class="dark"` on `<html>`, so the dark theme is the real one. The light theme exists in the source only as the `:root` background and foreground; treat it as a fallback.
- **One accent.** `primary` (#42A5F5) carries links, the hero role, primary buttons, focus and scrollbar hover. Everything else is neutral: `surface-page`, `surface-card`, and the greys `gray-300`/`gray-400`.
- **Monospace everywhere.** Fira Code (Google Fonts) is the only family, applied to `body`. Hierarchy comes from size and weight, not from a second face. Use the `type` styles in `tokens.json`.
- **Glass for panels.** In dark mode a panel is `glass-fill` with a 1px `glass-edge` border and a 16px backdrop blur. Use it for floating cards over the hero and project grids.
- **Hairlines, not shadows, on flat surfaces.** Chips and secondary buttons use `border-subtle` (white 10%) or `border-faint` (white 5%). Shadows (`shadow-lg`, `shadow-2xl`) appear only on raised panels and modals.
- **Generous spacing at section level.** Sections use `space-24` vertical padding; inside a card, `space-6`.
- **Pill for tags, rounded rectangle for actions.** Tags are `radius-full`; buttons and cards are `radius-2xl` (16px).
- **Background texture.** The hero layers a 24px grid of hairlines and a faint, rotated logo tile (`assets/Logos/essamLogoBorder.webp`) over `surface-page`, faded at the edges.
- **Motion.** Hover lifts (`scale-105`) and colour transitions on actions; content fades in on scroll. Respect `prefers-reduced-motion`: the source collapses all durations to 0.01ms.

## Iconography

- Line icons from **lucide-react** (`ChevronRight`, `FileText`, sized `w-5 h-5`), coloured `gray-300` on dark grounds.
- Brand marks (GitHub, LinkedIn) from **react-icons** (Font Awesome set), in the same size.
- Do not mix in filled or emoji icons.

## Logos

- `essamLogo` — the round mark. Use for favicons, avatars and small headers.
- `essamLogoBorder` — the mark with its border ring. Use as the textured hero background at low opacity (12%).
- `essamLogoWithText` — the mark with the wordmark. Use in headers and the footer.

Copy the files from `assets/Logos/`; never redraw them.

## Usage rules

1. Set the page on `surface-page` and put cards on `surface-card` (solid) or `glass-fill` (translucent).
2. Use `primary` for one action per view, with `ink-deep` as its label. Secondary actions use `surface-card` with a `border-faint` edge.
3. Body copy is `gray-300`; secondary copy is `gray-400`. Do not use `gray-500` for anything a reader must read.
4. Corners: `radius-2xl` for buttons and cards, `radius-full` for tags.

## Accessibility notes

- **Labels on `primary` use `ink-deep`** (about 7.4:1). The source used white (about 2.65:1), which is below the 4.5:1 needed for text. The brand colour is unchanged; only the label changed.
- **`primary` as text on white fails** (about 2.65:1). On the dark page it passes (about 5.3:1).
- **`primary-dark` with white text** is about 3.7:1, which only passes for large text. Use `ink-deep` there too.
- **`gray-500` fails for reading text** on `surface-page` (about 2.9:1). Use `gray-400` (about 5.5:1) or lighter.
- Focus rings use `primary`. Keep them at 2px or more.
- **Not checked:** the source's translucent `glass-fill` card, where the blur shows the background behind it, has no fixed contrast figure.

## Components

There are two sets of components:

- **Hand-written (`Essam.*`)**, in `components/bundle.js`: Button, Card, Tag, Navbar, ProjectCard, Hero, ContactForm, Section, SectionHeading, About, Experience, Skills, Projects, Faq and Footer. Plain JavaScript, styled with the tokens in `components/bundle.css`. They do not depend on the site code.
- **Built from the site (`EssamSite.Site*`)**, in `components/lib/essam-site.js`: SiteHeader, SiteHero, SiteAbout, SiteExperience, SiteSkills, SiteProjects, SiteFaq and SiteFooter. These are the site's own components from `src/components/*.tsx`, compiled with esbuild. Their Tailwind classes come from the site's theme and are appended to `components/bundle.css`.

Types are in `components/index.d.ts`. The previews mount the live components.

## Not synced

- The built set compiles the real site components. The site's source is not changed; these changes are made at build time only:
  - `next/image`, `next/link` and `next/navigation` are replaced by plain `img`, `a` and stub router calls.
  - `src/lib/services.ts` (Firebase) is replaced by no-op analytics functions. Data comes in as props, so the previews use sample data.
  - Public image paths (`/logos/...`, `/backgrounds/...`, `/profilePic.webp`) are rewritten to this system's uploaded assets (`/_blob/<id>`).
  - Rebuilding needs the site repository and esbuild.
- The hand-written set is plain JavaScript from the source's markup, not compiled from the site code.
- Tailwind's default greys (`gray-300`, `gray-400`, `gray-500`, `gray-700`), red and blue, and `#25D366` come from the source's class names, not from its CSS variables. They are listed as tokens with that note.
- Fonts are not fetched: Fira Code is a Google-hosted face, named in `type.families` only.
- Not documented: the admin dashboard pages under `src/app/admin`.
