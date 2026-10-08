import R from './react.js';
export const Fragment = R.Fragment;
export function jsx(type, props, key) {
  const p = Object.assign({}, props);
  if (key !== undefined) p.key = key;
  return R.createElement(type, p);
}
export const jsxs = jsx;
export const jsxDEV = jsx;
