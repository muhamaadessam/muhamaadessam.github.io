import R from './react.js';
export default function Image(props) {
  const { fill, priority, unoptimized, ...rest } = props;
  const style = fill ? Object.assign({ position: 'absolute', inset: 0, width: '100%', height: '100%' }, rest.style || {}) : rest.style;
  return R.createElement('img', Object.assign({}, rest, { style, loading: priority ? 'eager' : rest.loading }));
}
