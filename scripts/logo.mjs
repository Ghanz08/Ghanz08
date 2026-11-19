import { readFileSync } from "node:fs";

// Logo SkyBase asli, diekspor dari desain Figma (assets/brand/skybase-logo.svg). Bentuknya tidak diubah, hanya diwarnai ulang.
const raw = readFileSync(new URL("../assets/brand/skybase-logo.svg", import.meta.url), "utf8");
const inner = raw.replace(/^[\s\S]*?<svg[^>]*>/, "").replace(/<\/svg>\s*$/, "");
const MAIN = "#174394", ACCENT = "#54A4D9";

const tint = (s, { main, accent }, id) =>
  s.replaceAll(MAIN, main).replaceAll(ACCENT, accent).replace(/clip(\d)_0_1/g, `${id}-c$1`);

/** Logo lengkap (sayap + tulisan), tinggi h. */
export function logo(x, y, h, colors, id = "sb") {
  return `<svg x="${x}" y="${y}" width="${((h * 298) / 74).toFixed(1)}" height="${h}" viewBox="0 0 298 74">${tint(inner, colors, id)}</svg>`;
}

/** Hanya sayapnya (ikon), tinggi h. */
export function mark(x, y, h, colors, id = "sbm") {
  const wing = inner.match(/<g id="Layer_1_2"[\s\S]*?<\/g>/)[0];
  const clip = inner.match(/<clipPath id="clip1_0_1">[\s\S]*?<\/clipPath>/)[0];
  return `<svg x="${x}" y="${y}" width="${((h * 72) / 73).toFixed(1)}" height="${h}" viewBox="0 0 72 73">${tint(wing + "<defs>" + clip + "</defs>", colors, id)}</svg>`;
}
