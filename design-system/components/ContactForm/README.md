Contact form with name, email and message fields, a submit button and a status line.

## When to use

- A contact section at the bottom of a portfolio.
- Not for multi-step or long forms. Three fields is the scope.

## Consumer provides

- `onSubmit(values)`: receives `{ name, email, message }`. The form does not send anything itself.
- `status`: `idle`, `loading`, `success` or `error`. While `loading` the inputs and button are disabled and the button reads "Sending…".
- `statusMessage`: text shown under the button, such as a thank-you or an error.
- `idPrefix`, if more than one form is on the page, so the label ids stay unique.

## Specs

- Name and email share a row from 768px; the message spans full width.
- Inputs: `field-fill` background, 1px `border-subtle` edge, radius `radius-lg`, text `white` at 16px.
- Focus: the border and a 1px ring turn `primary`.
- Labels `gray-300` at 14px, weight 500. Placeholders `gray-500`, which is for placeholder text only.
- Submit uses the primary Button with `ink-deep` label. The source's gradient button is replaced with the solid primary, because white text on the gradient fails contrast.
- Status: `green-400` for success, `red-400` for error, `gray-300` otherwise.

## Notes

- Validation uses the browser's built-in `required` and `type="email"` checks.
