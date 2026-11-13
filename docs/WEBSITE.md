# SocialSamurai — front end

Two halves, one design system ("Steel & Ink"):

- **Marketing site** — `src/components/Site/`, rendered on the `landing` view.
- **Workspace (interactive preview)** — `src/app/`, lazy-loaded via `src/AppShell.tsx`.

`enterApp()` in `src/context/AppContext.tsx` moves between them (`signup` → onboarding,
`login`/`demo` → workspace, `arena` → Arena). The browser Back button returns to the site.

## Design system

- **Type:** Archivo Expanded for display (`.si-d`, `.si-d-med`), Geist for text, and
  Noto Serif JP 600 for kanji accents — subset to the glyphs used
  (`public/fonts/samurai-jp.woff2`). After adding Japanese text, re-run
  `python3 scripts/subset-jp-font.py`.
- **Color:** pure black page, `#1A1A1A` surfaces, white/steel text, Samurai Purple
  `#8B5CF6` for active states and glow, Deep Purple `#5B21B6` for depth. Primary
  actions are white; purple is an accent, never a background wash.
- Tokens live in `@theme` in `src/index.css`. Don't introduce colors outside that set.

## Marketing site

| File | Sections |
|---|---|
| `Header.tsx` | Fixed header, active-section dot, full-screen mobile menu |
| `Hero.tsx` | Guideline Samurai, blade-cut headline reveal, side rails |
| `Discover.tsx` | Scroll-lit manifesto, live keyword demo, pinned horizontal workflow |
| `Command.tsx` | Personality banners, approval split, capability spec sheet, Arena, pricing, FAQ, final call, footer |
| `content.ts` | Copy, prices, sample conversations, personalities, capabilities, FAQ |
| `kit.tsx` | Wrapper, logo, section opener, status tags |

## Workspace

| File | What it is |
|---|---|
| `app/Shell.tsx` | Sidebar, top bar, mobile drawer, notifications, toasts, `Dialog`, pricing dialog |
| `app/ui.tsx` | Card, Btn, Tag, PageHeader, ScoreDial, Toggle, Empty, Field, platform glyphs |
| `app/ReplyStudio.tsx` | Draft editor: tone switch, regenerate, save, approve |
| `app/Onboarding.tsx` | Three steps — personality, brand, keywords |
| `app/views/Overview.tsx` | Greeting, connection notice, counts, top opportunities, upcoming |
| `app/views/Opportunities.tsx` | Ranked list, signal breakdown, why-it-was-picked, save/dismiss |
| `app/views/Drafts.tsx` | Awaiting approval / approved |
| `app/views/Create.tsx` | Idea → post options → schedule or save |
| `app/views/Inbox.tsx` | Mentions and replies with a suggested response |
| `app/views/Calendar.tsx` | Week view plus unscheduled drafts |
| `app/views/Analytics.tsx` | Honest empty state; sample charts behind a toggle |
| `app/views/Arena.tsx` | Lobby → countdown → `ShadowFightGame` → results |
| `app/views/Setup.tsx` | Connections, Automations, Settings |

State is in `AppContext`; sample content is in `src/data/mockData.ts`. Nothing persists
between reloads — the preview is deliberately stateless.

## Honesty rules

These apply to both halves and are enforced by the QA suite:

1. No invented statistics, users, testimonials or partnerships.
2. Nothing is described as live unless it is. Connections show "Not connected" until
   simulated, and then read "Connected · simulated".
3. Analytics opens empty; sample charts only appear behind the toggle and stay labelled.
4. Approving a reply never publishes. Automations can never publish — that toggle is
   locked on and disabled.
5. Pricing is always marked proposed, and always shows both $19/month and $140/year.

## Assets

`public/brand/samurai.webp` and `samurai-640.webp` come from the brand-guidelines
artwork, upscaled 2× from a 530px crop. Replacing them with a high-resolution export
needs no code changes. `samurai-helm.webp` is the avatar crop; `logo.*` and `mark.*`
are the approved logo with transparency restored.

## Open items

- Privacy policy and terms pages (the footer says they're coming).
- Footer social links.
- A demo video — "Watch the demo" currently opens the preview.
- Real X and Reddit OAuth, replacing the simulated connection.
