Work history list. Each role has a title, company, employment type, dates, location, bullet points and skill tags.

## When to use

- The experience section of a CV-style portfolio.

## Consumer provides

- `items`: `{ title, company, companyUrl?, employmentType?, duration?, location?, points?, skills? }`.
- `duration` is text. The library does not calculate it, so pass the formatted string.

## Specs

- Each role is a glass card with `space-8` padding (`space-6` on mobile). Title 24px bold, company in `primary`.
- Bullets use a `primary` ▸ marker. Skill tags use `border-subtle` and `gray-300`.
- Roles stack with `space-8` between them.

## Contrast

- Dates and employment type use `gray-400`, about 4.6:1 on the card. Do not drop them to `gray-500`.
