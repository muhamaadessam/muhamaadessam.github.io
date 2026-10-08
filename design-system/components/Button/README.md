Primary and secondary call-to-action button with an optional trailing icon.

## When to use

- **Primary**: the single main action in a view, such as "View Projects" in the hero. One per view.
- **Secondary**: a second action beside a primary one, such as "Download CV".

## Consumer provides

- The label, and optionally an icon element (rendered at 20px).
- An `href` for links, or an `onClick` for actions.

## Specs

- Padding `space-4` vertical, `space-8` horizontal; minimum width 200px.
- Radius `radius-2xl`; label `16px` weight 500 in the mono face.
- Primary: fill `primary`, label `ink-deep` (about 7.4:1). Hover fill `primary-dark`, scale 105%.
- Secondary: fill `surface-card`, label `white`, 1px `border-faint` edge. Hover fill `gray-700`, scale 105%.
- Focus ring: 2px `primary`, 2px offset.

## Contrast

The source used white labels on `primary`. That pair is about 2.65:1, below the 4.5:1 needed for body text, so the primary label is `ink-deep` instead. The brand colour itself is unchanged.
