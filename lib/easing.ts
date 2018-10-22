/**
 * easeOutSine function
 *
 * @param distance The actual pull distance
 * @param max The max available height
 */
export function easing(distance: number, max: number): number {
  // t: current time, b: beginning value, c: change in value, d: duration
  const t = distance;
  const b = 0;
  const d = max;
  const c = d / 2.5;

  return c * Math.sin((t / d) * (Math.PI / 2)) + b;
}
