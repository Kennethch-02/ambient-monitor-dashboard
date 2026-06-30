// Build an SVG sparkline/area path from a list of values.
// Returns { line, area, last:[x,y], min, max }. Safe for empty input.
export function buildPath(vals, w, h, padTop = 4, padBot = 4) {
  if (!vals || vals.length === 0) {
    return { line: '', area: '', last: [0, h], min: 0, max: 0 };
  }
  const min = Math.min(...vals);
  const max = Math.max(...vals);
  const span = (max - min) || 1;
  const top = padTop;
  const bot = h - padBot;
  const n = vals.length;
  const pts = vals.map((v, i) => [
    n > 1 ? (i / (n - 1)) * w : 0,
    bot - ((v - min) / span) * (bot - top),
  ]);
  const line = 'M' + pts.map((p) => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join(' L');
  return {
    line,
    area: `${line} L${w},${h} L0,${h} Z`,
    last: pts[n - 1],
    min,
    max,
  };
}
