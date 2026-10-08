import R from './react.js';
export default function Link(props) {
  const { href, children, prefetch, replace, scroll, shallow, ...rest } = props;
  return R.createElement('a', Object.assign({ href: typeof href === 'string' ? href : href && href.pathname }, rest), children);
}
