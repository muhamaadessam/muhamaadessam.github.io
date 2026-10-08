Landing block for the top of a page: name, role on its own line, a short lead paragraph, keyword tags and up to two actions.

## When to use

- The first screen of a portfolio or product landing page.
- Use one primary action and, if needed, one secondary action. More than two actions belong in a menu.

## Consumer provides

- `name` and `role`. The role renders in `primary` on its own line.
- `lead`: one or two sentences, `gray-300`.
- `keywords`: short technology or skill names, shown as tags.
- `primaryAction` and `secondaryAction`: `{ label, href, icon? }`. The secondary action opens in a new tab.

## Specs

- Padding `space-24` vertical, `space-6` horizontal. Centred on every width.
- Name in the mono face: 48px bold below 768px, 72px from 768px.
- Lead 18px / 28px, maximum width 576px.
- Actions use the Button component: primary with `ink-deep` label, secondary with `surface-card` fill.

## Notes

- The source hero is a full-height screen with a textured background and a rotated logo. This version uses a flat `surface-page` and leaves the texture out; add it as a background layer if the page needs it.
