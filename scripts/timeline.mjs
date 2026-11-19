import { esc, svg, themes } from "./theme.mjs";

const items = [
  { x: 70, year: "2021", title: "SMK Muhammadiyah 1", lines: ["Software engineering", "track, Yogyakarta"], up: false },
  { x: 250, year: "2023", title: "First real teams", lines: ["Intern at Jogja Media Web:", "3 full-stack projects"], up: true },
  { x: 430, year: "2024", title: "UGM, Software Eng.", lines: ["Joined GDGoC, KOMATIK", "and KMTEDI (EatsTedi)"], up: false },
  { x: 610, year: "2025", title: "Leading, then finals", lines: ["TED IT Coordinator", "GEMASTIK XVIII finalist"], up: true },
  { x: 790, year: "2026", title: "Heading divisions", lines: ["Head of Tech @ ASSETS UGM", "IFEST top 15, PAD mentor"], up: false },
  { x: 910, year: "now", title: "Shipping", lines: ["Kost 3g, Glideslope,", "and what comes next"], up: true, end: true },
];

export function timeline(name) {
  const t = themes[name], Y = 150;
  const css = `.line{stroke-dasharray:900;stroke-dashoffset:900;animation:draw 1.8s .2s ease-out forwards}
.n{transform-box:fill-box;transform-origin:center}`;
  const nodes = items.map((it, i) => {
    const d = (0.3 + i * 0.28).toFixed(2), a = it.end ? "end" : "start";
    const tx = it.end ? it.x + 6 : it.x - 6, top = it.up ? 22 : 178;
    const stem = it.up ? `<line x1="${it.x}" x2="${it.x}" y1="${Y - 8}" y2="${top + 62}" stroke="${t.line}"/>` : `<line x1="${it.x}" x2="${it.x}" y1="${Y + 8}" y2="${top - 14}" stroke="${t.line}"/>`;
    return `<g style="animation:appear .5s ${d}s ease-out both">${stem}
<text class="m" x="${tx}" y="${top + 4}" font-size="13" font-weight="700" fill="${t.accent}" text-anchor="${a}">${it.year}</text>
<text x="${tx}" y="${top + 24}" font-size="13.5" font-weight="700" fill="${t.fg}" text-anchor="${a}">${esc(it.title)}</text>
${it.lines.map((l, k) => `<text class="m" x="${tx}" y="${top + 42 + k * 15}" font-size="10.5" fill="${t.muted}" text-anchor="${a}">${esc(l)}</text>`).join("")}</g>
<circle class="n" cx="${it.x}" cy="${Y}" r="${it.end ? 8 : 6}" fill="${it.end ? t.accent : t.card}" stroke="${t.accent}" stroke-width="3" style="animation:pop .4s ${d}s ease-out both"/>`;
  }).join("\n");
  const body = `<line class="line" x1="30" y1="${Y}" x2="930" y2="${Y}" stroke="${t.accent}" stroke-width="3" stroke-linecap="round"/>${nodes}`;
  return svg(960, 270, t, `<title>Timeline 2021 to now: SMK, first teams, UGM, leadership roles, shipping</title>${body}`, css);
}
