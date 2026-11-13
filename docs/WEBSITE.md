# Marketing website — "Steel & Ink"

The public site lives in `src/components/Site/` and renders when the app is on the
`landing` view. CTAs hand off to the app prototype through `enterApp()` in
`src/context/AppContext.tsx` (`signup` → onboarding, `login`/`demo` → dashboard,
`arena` → Arena). The app is lazy-loaded from `src/AppShell.tsx`.

## Files

| File | Sections |
|---|---|
| `Header.tsx` | Fixed header, active-section dot, full-screen mobile menu |
| `Hero.tsx` | Guideline Samurai, blade-cut headline reveal, side rails |
| `Discover.tsx` | Scroll-lit manifesto, live keyword demo ("Type what your customers say"), pinned horizontal workflow |
| `Command.tsx` | Personality banners, AI-vs-you approval, capability spec sheet, Arena, pricing, FAQ, final call, footer |
| `content.ts` | All copy, prices, sample conversations, personalities, capabilities, FAQ |
| `kit.tsx` | Layout wrapper, logo, section opener (kanji + meaning), status tags |

## Design system

- **Type:** Archivo Expanded for display (`.si-d`, `font-stretch:125%`), Geist for text,
  and Noto Serif JP 600 for kanji, subset to the glyphs used (`public/fonts/samurai-jp.woff2`).
  If you add new Japanese text, re-run `scripts/subset-jp-font.py`.
- **Color:** pure black page, `#1A1A1A` surfaces, white/steel text, Samurai Purple
  `#8B5CF6` for glow and active states, Deep Purple `#5B21B6` for depth.
  Primary buttons are white pills.
- **Kanji are labels, not decoration:** each section opener pairs a kanji with its
  English meaning, and each workflow step has its own (発見 Discovery … 学習 Learning).

## Assets

- `public/brand/samurai.webp`, `samurai-640.webp`: the Samurai from the brand-guidelines
  artwork, upscaled 2x from a 530px crop. **Swap in a high-resolution export when you
  have one** (square-ish, black background); no code changes are needed.
- `logo.*`, `mark.*`: the approved logo, with its black background turned into transparency.

## Honesty rules

No invented statistics, customers, testimonials or partnerships. Statuses in
`CAPABILITIES` must match reality ("Preview" = works on sample data). The live demo
uses `RADAR_POOL` sample conversations and says so on the page.

## Open items

- Privacy policy and terms pages (the footer says they're coming).
- Footer social links.
- A demo video (Watch the demo currently opens the interactive preview).
