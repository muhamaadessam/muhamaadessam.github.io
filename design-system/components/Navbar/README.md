Floating header with the brand on the left and section links on the right. Under 768px the links collapse behind a menu button.

## When to use

- The top of a single-page site, where the links jump to sections on the same page.
- Not for multi-level menus or search; the source has only flat links.

## Consumer provides

- `brand` (wordmark text) or `logo` (an image URL, with `logoAlt`).
- `links`: `[{ label, href }]`. Links to sections use `#id`.
- `homeHref`, if the brand should link somewhere other than `/`.

## Specs

- Container max width 896px, padding `space-3` by `space-6`, radius `radius-2xl`.
- Fill `nav-fill` (dark card at 60%), 1px `glass-edge` border, `shadow-lg`, 12px backdrop blur.
- Link text `gray-300` at 14px weight 500; hover `white` with a 2px `primary` underline that grows from the left.
- Logo height 40px. Wordmark 18px bold.
- Menu button and dropdown appear below 768px; the dropdown links are 18px and centred.

## Notes

- The library version is static: it does not hide itself on scroll or fix to the top. The consumer places it.
- Links are `gray-300` on the translucent bar, about 9:1 on the dark page, so the text contrast is safe.
