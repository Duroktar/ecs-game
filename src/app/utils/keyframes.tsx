export function keyframes(...handlers: [Function, number][]) {
  return handlers.map(([cb, frameNo]) => setTimeout(() => cb(), frameNo));
}
