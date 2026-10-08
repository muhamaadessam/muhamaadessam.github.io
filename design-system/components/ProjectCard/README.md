Tile for one project: optional image, title, technology tags, a short description and links.

## When to use

- Project grids on the portfolio, with three columns on large screens.
- Use a text-only tile (no `image`) when no screenshot exists; the layout stays the same.

## Consumer provides

- `title` and `description`. Keep the description to about three lines.
- `tags`: technology names. They show in uppercase.
- `links`: `[{ label, href }]`, opened in a new tab. Use short labels such as "GitHub" or "Live demo".
- `image` and `imageAlt`, optional. Images are cropped to 192px tall.

## Specs

- Fill `glass-fill`, 1px `glass-edge` border, radius `radius-2xl`, 16px backdrop blur. The border brightens to `glass-edge-hover` on hover.
- Body padding `space-6`. Title 24px bold.
- Tags: `primary-soft` fill, `primary` text, 10px bold uppercase.
- Links: pill with a `border-subtle` edge; hover fills with `primary` and uses `ink-deep` text.
- Image hover: a 10% zoom over 0.7 seconds, removed for reduced motion.

## Contrast

- Tag text `primary` on `primary-soft` is about 4.2 to 4.4:1, just under the 4.5:1 for small text. The source uses this pair; the 10px size makes it the weak point. Keep tag labels short.
- The description uses `gray-400`, about 4.6:1 on the card. Do not drop it to `gray-500`.
