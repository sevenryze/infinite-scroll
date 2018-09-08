// easeOutSine
export function easing(distance) {
  // t: current time, b: beginning value, c: change in value, d: duration
  const t = distance;
  const b = 0;
  const d = window.screen.availHeight; // 允许拖拽的最大距离
  const c = d / 2.5; // 提示标签最大有效拖拽距离

  return c * Math.sin((t / d) * (Math.PI / 2)) + b;
}
