import { esc, svg, themes } from "./theme.mjs";

// Bulan diindeks dari Sep 2024 = 0. "now" = pertengahan Nov 2026.
const idx = (y, m) => (y - 2024) * 12 + (m - 1) - 8;
const END = 29, NOW = idx(2026, 11) + 18 / 30;
const span = (y1, m1, y2, m2) => [idx(y1, m1), idx(y2, m2) + 1];

// cur = peran yang sedang dijalani; null di akhir berarti "sampai sekarang"
const lanes = [
  { org: "KMTEDI UGM", bars: [["IPTEK Division", ...span(2024, 10, 2025, 10), false]] },
  { org: "GDGoC UGM", bars: [["Hacker Backend", ...span(2024, 11, 2025, 5), false], ["Hacker Backend & Academic Mentor", idx(2025, 6), NOW, true]] },
  { org: "KOMATIK UGM", bars: [["Staff SRD", ...span(2024, 11, 2025, 10), false], ["Head of Software Research & Dev", idx(2025, 11), NOW, true]] },
  { org: "ASSETS UGM", bars: [["IPTEK Division", ...span(2025, 3, 2025, 12), false], ["Head of Tech Development", idx(2026, 3), NOW, true]] },
  { org: "Tech Enthusiast Day", bars: [["IT Coordinator", ...span(2025, 5, 2025, 11), false]] },
  { org: "UGM teaching", bars: [["Practicum assistant", ...span(2025, 8, 2025, 12), false], ["PAD mentor", ...span(2026, 8, 2026, 12), true]] },
  { org: "Hackathon Refactory", bars: [["Event Lead", ...span(2026, 1, 2026, 2), false]] },
  { org: "GELEX UGM", bars: [["IT Division", ...span(2026, 8, 2026, 9), false]] },
];

export function roles(name) {
  const t = themes[name], X0 = 210, W = 720, PX = W / END, top = 74, RH = 36;
  const on = name === "dark" ? "#0d1117" : "#ffffff";
  const x = (i) => (X0 + i * PX).toFixed(1);
  const css = `.bar{transform-box:fill-box;transform-origin:left center;animation:grow .7s ease-out both}
@keyframes grow{from{transform:scaleX(0)}}
@keyframes ring{0%{r:4;opacity:.9}100%{r:11;opacity:0}}
.ring{animation:ring 1.8s ease-out infinite}`;

  const marks = [[0, "2024"], [4, "2025"], [16, "2026"]].map(([i, y]) =>
    `<text class="m" x="${x(i) * 1 + 6}" y="54" font-size="12" font-weight="700" fill="${t.fg}">${y}</text>
<line x1="${x(i)}" x2="${x(i)}" y1="40" y2="${top + lanes.length * RH}" stroke="${t.line}"/>`).join("");
  const quarters = [7, 10, 13, 19, 22, 25].map((i) => `<line x1="${x(i)}" x2="${x(i)}" y1="62" y2="${top + lanes.length * RH}" stroke="${t.grid}" stroke-dasharray="2 4"/>`).join("");

  const rows = lanes.map((ln, r) => {
    const cy = top + r * RH + RH / 2, d0 = 0.25 + r * 0.12;
    const bars = ln.bars.map(([label, a, b, cur], k) => {
      const bx = X0 + a * PX, bw = (b - a) * PX, d = (d0 + k * 0.1).toFixed(2);
      const need = label.length * 6.1 + 18, inside = bw >= need;
      let txt;
      if (inside) txt = `<text class="m" x="${bx + 10}" y="${cy + 3.5}" font-size="10.5" font-weight="${cur ? 700 : 400}" fill="${cur ? on : t.accent}">${esc(label)}</text>`;
      else if (bx + bw + 8 + label.length * 6.1 < 950) txt = `<text class="m" x="${bx + bw + 8}" y="${cy + 3.5}" font-size="10.5" fill="${t.muted}">${esc(label)}</text>`;
      else txt = `<text class="m" x="${bx - 8}" y="${cy + 3.5}" font-size="10.5" fill="${t.muted}" text-anchor="end">${esc(label)}</text>`;
      const live = cur && b >= NOW - 0.01 && b < END;
      return `<g><rect class="bar" style="animation-delay:${d}s" x="${bx.toFixed(1)}" y="${cy - 10}" width="${bw.toFixed(1)}" height="20" rx="6" fill="${cur ? t.accent : t.soft}" stroke="${t.accent}" stroke-width="${cur ? 0 : 1.2}"/>
<g style="animation:appear .5s ${(+d + 0.5).toFixed(2)}s ease-out both">${txt}</g>
${live ? `<circle cx="${(bx + bw).toFixed(1)}" cy="${cy}" r="4" fill="${t.good}"/><circle class="ring" cx="${(bx + bw).toFixed(1)}" cy="${cy}" r="4" fill="none" stroke="${t.good}" stroke-width="1.5"/>` : ""}</g>`;
    }).join("");
    return `<text class="m" x="32" y="${cy + 4}" font-size="12" fill="${t.fg}">${esc(ln.org)}</text>${bars}`;
  }).join("\n");

  const H = top + lanes.length * RH + 40;
  const body = `<rect x=".5" y=".5" width="959" height="${H - 1}" rx="14" fill="${t.card}" stroke="${t.line}"/>
${quarters}${marks}
<line x1="${x(NOW)}" x2="${x(NOW)}" y1="62" y2="${top + lanes.length * RH}" stroke="${t.good}" stroke-width="1.5" stroke-dasharray="4 3"/>
<text class="m" x="${x(NOW)}" y="${54}" font-size="11" font-weight="700" fill="${t.good}" text-anchor="middle">now</text>
${rows}
<circle cx="32" cy="${H - 22}" r="5" fill="${t.accent}"/><text class="m" x="44" y="${H - 18}" font-size="10.5" fill="${t.muted}">current role</text>
<rect x="136" y="${H - 28}" width="16" height="12" rx="4" fill="${t.soft}" stroke="${t.accent}" stroke-width="1.2"/><text class="m" x="158" y="${H - 18}" font-size="10.5" fill="${t.muted}">earlier role</text>`;
  return svg(960, H, t, `<title>Roles by organisation from Sep 2024 to Dec 2026</title>${body}`, css);
}
