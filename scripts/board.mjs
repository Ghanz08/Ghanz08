import { esc, svg, PLANE } from "./theme.mjs";

const AMBER = "#ffb000", DIM = "#8a6a1c", BG = "#0b0e14", LINE = "#252a36";

/** Papan keberangkatan dari push terbaru. `pushes` = [{ repo, msg, at: Date }]. */
export function board(name, pushes) {
  const rows = pushes.slice(0, 6), H = 100 + rows.length * 38 + 20;
  const wib = (d) => new Date(d.getTime() + 7 * 3600e3).toISOString();
  const fmt = (d) => { const s = wib(d); return `${s.slice(8, 10)} ${["JAN","FEB","MAR","APR","MEI","JUN","JUL","AGU","SEP","OKT","NOV","DES"][+s.slice(5, 7) - 1]} ${s.slice(11, 16)}`; };
  const cut = (s, n) => { const u = s.replace(/\s+/g, " ").toUpperCase(); return u.length > n ? u.slice(0, n - 1) + "…" : u; };
  const css = `@keyframes flap{0%{opacity:0;transform:scaleY(0)}55%{opacity:1;transform:scaleY(1.06)}100%{transform:scaleY(1)}}
.f{transform-box:fill-box;transform-origin:center;animation:flap .55s ease-out both}`;
  const rowSvg = rows.map((r, i) => {
    const y = 112 + i * 38, d = (0.2 + i * 0.16).toFixed(2);
    return `<g class="f" style="animation-delay:${d}s">
<rect x="20" y="${y - 24}" width="920" height="32" rx="5" fill="#131824"/>
<text class="m" x="36" y="${y - 3}" font-size="13" font-weight="700" fill="${AMBER}">${fmt(r.at)}</text>
<text class="m" x="196" y="${y - 3}" font-size="13" font-weight="700" fill="${AMBER}">${esc(cut(r.repo, 20))}</text>
<text class="m" x="410" y="${y - 3}" font-size="13" fill="${AMBER}">${esc(cut(r.msg, 40))}</text>
<text class="m" x="920" y="${y - 3}" font-size="12" font-weight="700" fill="#34d399" text-anchor="end">PUSHED</text>
<line x1="20" x2="940" y1="${y - 8}" y2="${y - 8}" stroke="${BG}" stroke-width="1" opacity=".45"/></g>`;
  }).join("\n");
  const body = `<rect x=".5" y=".5" width="959" height="${H - 1}" rx="16" fill="${BG}" stroke="${LINE}"/>
<path d="${PLANE}" transform="translate(42 34) scale(.75)" fill="${AMBER}"/>
<text class="m" x="64" y="40" font-size="14" font-weight="700" letter-spacing="3" fill="${AMBER}">DEPARTURES</text>
<text class="m" x="920" y="40" font-size="11" letter-spacing="1" fill="${DIM}" text-anchor="end">LATEST PUSHES · WIB</text>
<text class="m" x="36" y="76" font-size="10" letter-spacing="1.5" fill="${DIM}">TIME</text><text class="m" x="196" y="76" font-size="10" letter-spacing="1.5" fill="${DIM}">DESTINATION</text>
<text class="m" x="410" y="76" font-size="10" letter-spacing="1.5" fill="${DIM}">FLIGHT</text><text class="m" x="920" y="76" font-size="10" letter-spacing="1.5" fill="${DIM}" text-anchor="end">STATUS</text>
<line x1="20" x2="940" y1="86" y2="86" stroke="${LINE}"/>
${rowSvg}`;
  return svg(960, H, { fg: AMBER }, `<title>Latest pushes to public repositories, shown as a departures board</title>${body}`, css);
}
