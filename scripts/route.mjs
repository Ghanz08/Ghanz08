import { esc, svg, themes, PLANE } from "./theme.mjs";

const pts = [
  [70, 222, "2021", "SMK RPL", "Yogyakarta"],
  [240, 138, "2023", "Jogja Media Web", "first real teams"],
  [412, 214, "2024", "UGM", "GDGoC · KOMATIK · KMTEDI"],
  [590, 124, "2025", "TED · GEMASTIK XVIII", "IT Coordinator, finalist"],
  [762, 188, "2026", "ASSETS UGM", "Head of Tech · IFEST top 15"],
  [892, 82, "2028", "Graduation", "expected, Jul 2028"],
];

// Catmull-Rom ke kurva Bezier, per ruas, supaya bagian lalu dan depan bisa digambar beda.
const seg = pts.map((p, i) => {
  if (i === pts.length - 1) return null;
  const p0 = pts[i - 1] || p, p1 = p, p2 = pts[i + 1], p3 = pts[i + 2] || p2;
  const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6], c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
  return `C${c1.map((n) => n.toFixed(1))} ${c2.map((n) => n.toFixed(1))} ${p2[0]} ${p2[1]}`;
}).filter(Boolean);
const start = `M${pts[0][0]} ${pts[0][1]}`;
const past = start + " " + seg.slice(0, 4).join(" ");
const future = `M${pts[4][0]} ${pts[4][1]} ` + seg[4];
const full = start + " " + seg.join(" ");

export function route(name) {
  const t = themes[name];
  const css = `.past{stroke-dasharray:1400;stroke-dashoffset:1400;animation:draw 2.6s .3s ease-out forwards}
.n{transform-box:fill-box;transform-origin:center}
@keyframes drift{from{transform:translateX(-30px)}to{transform:translateX(30px)}}.cloud{animation:drift 14s ease-in-out infinite alternate}`;
  const labels = pts.map(([x, y, yr, title, sub], i) => {
    const up = y < 160, ty = up ? y - 44 : y + 30, d = (0.5 + i * 0.4).toFixed(2), last = i === pts.length - 1;
    return `<g style="animation:appear .5s ${d}s ease-out both">
<text class="m" x="${x}" y="${ty}" font-size="12" font-weight="700" fill="${last ? t.muted : t.accent}" text-anchor="middle">${yr}</text>
<text x="${x}" y="${ty + 16}" font-size="13" font-weight="700" fill="${t.fg}" text-anchor="middle">${esc(title)}</text>
<text class="m" x="${x}" y="${ty + 31}" font-size="10" fill="${t.muted}" text-anchor="middle">${esc(sub)}</text></g>
<circle class="n" cx="${x}" cy="${y}" r="7" fill="${last ? t.card : t.accent}" stroke="${last ? t.muted : t.card}" stroke-width="3" ${last ? 'stroke-dasharray="3 3"' : ""} style="animation:pop .4s ${d}s ease-out both"/>`;
  }).join("\n");
  const body = `<defs><pattern id="g" width="40" height="40" patternUnits="userSpaceOnUse"><path d="M40 0H0V40" fill="none" stroke="${t.grid}"/></pattern></defs>
<rect x=".5" y=".5" width="959" height="299" rx="16" fill="${t.card}" stroke="${t.line}"/><rect x="1" y="1" width="958" height="298" rx="16" fill="url(#g)"/>
<g class="cloud" opacity="${name === "dark" ? ".07" : ".5"}" fill="${name === "dark" ? "#fff" : t.soft}"><ellipse cx="150" cy="60" rx="70" ry="14"/><ellipse cx="190" cy="52" rx="44" ry="12"/><ellipse cx="640" cy="258" rx="80" ry="13"/><ellipse cx="610" cy="250" rx="44" ry="11"/></g>
<text class="m" x="28" y="34" font-size="10.5" letter-spacing="2" fill="${t.muted}">ROUTE · 2021 → 2028</text>
<path d="${future}" fill="none" stroke="${t.muted}" stroke-width="2.5" stroke-dasharray="2 8" stroke-linecap="round" opacity=".8"/>
<path d="${past}" fill="none" stroke="${t.accent}" stroke-width="3" stroke-linecap="round" class="past"/>
${labels}
<g><path d="${PLANE}" fill="${t.accent}" stroke="${t.card}" stroke-width="1.5" stroke-linejoin="round"><animateMotion dur="11s" repeatCount="indefinite" rotate="auto" path="${full}"/></path></g>`;
  return svg(960, 300, t, `<title>Flight route 2021 to 2028: SMK, Jogja Media Web, UGM, TED and GEMASTIK, ASSETS UGM, graduation</title>${body}`, css);
}
