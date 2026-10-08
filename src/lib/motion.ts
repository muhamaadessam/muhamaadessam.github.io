export function pointerPosition(offset: number, size: number): number {
  if (size <= 0) return 0;
  return Math.max(-1, Math.min(1, (offset / size) * 2 - 1));
}
