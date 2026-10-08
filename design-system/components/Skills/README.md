Skill groups in a grid. Each group has a primary title and a list of chips.

## When to use

- A skills section under the projects, or in a sidebar.

## Consumer provides

- `groups`: `[{ title, skills: string[] }]`.

## Specs

- Two columns from 768px, one below. Gap `space-6`.
- Each group is a glass card. Title 20px medium in `primary`. Chips use `border-subtle` and `gray-300`.
- The source's icon badge per group is not included. Add it as a prop if a set needs it.
