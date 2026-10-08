Site footer with a logo or wordmark, a short line about the author, quick links, contact links and social icons.

## When to use

- The bottom of a portfolio or a marketing page.

## Consumer provides

- `logo` (an image URL) or `brand` (text), and `about`.
- `links`, `contacts` and `socials`. A contact with `external: true` opens in a new tab. Icons are passed as elements.
- `copyright`, and `linksHeading` or `contactHeading` if the labels differ from the defaults.

## Specs

- Three columns from 768px, stacked and centred below. Top border `border-faint`.
- Links `gray-400`, hover `primary`. Social buttons are 40px glass circles that lift 4px on hover.

## Contrast

- The source's copyright line uses `gray-500`, about 2.9:1. This library uses `gray-400`, about 5.5:1, instead. This is a deliberate change.
