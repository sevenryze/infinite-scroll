import { easing } from "../lib/easing";

test("easing function should return a number", () => {
  expect(easing(100, 400)).toBeGreaterThanOrEqual(0);
});
