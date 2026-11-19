import { esc, svg, themes } from "./theme.mjs";

const G = [".#####.", "#.....#", "#......", "#..####", "#.....#", "#.....#", ".#####."];
const Z = ["#######", ".....##", "....##.", "...##..", "..##...", "##.....", "#######"];
const copy = {
  en: { cmd: "./contact --status", live: "available for opportunities", a: "Got a messy workflow?", b: "Let's make it dependable." },
  id: { cmd: "./contact --status", live: "terbuka untuk peluang", a: "Punya alur kerja berantakan?", b: "Kita bikin jadi andal." },
};

export function contact(name, lang) {
  const t = themes[name], c = copy[lang], cell = 13, mx = 790, my = 62;
  let px = "";
  for (let j = 0; j < 7; j++) for (let i = 0; i < 7; i++) {
    const g = G[j][i] === "#", z = Z[j][i] === "#";
    if (!g && !z) continue;
    const anim = g && z ? "" : g ? ' style="animation:toG 7s ease-in-out infinite"' : ' style="animation:toZ 7s ease-in-out infinite"';
    px += `<rect x="${mx + i * cell}" y="${my + j * cell}" width="${cell - 2}" height="${cell - 2}" rx="2" fill="${t.accent}"${anim}/>`;
  }
  const css = `@keyframes toG{0%,38%{opacity:1}50%,88%{opacity:0}100%{opacity:1}}
@keyframes toZ{0%,38%{opacity:0}50%,88%{opacity:1}100%{opacity:0}}
@keyframes pulse{0%{r:5;opacity:.8}100%{r:13;opacity:0}}.pulse{animation:pulse 1.8s ease-out infinite}`;
  const body = `<defs><pattern id="g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="${t.grid}"/></pattern></defs>
<rect x=".5" y=".5" width="959" height="229" rx="16" fill="${t.bg}" stroke="${t.line}"/><rect x="1" y="1" width="958" height="228" rx="16" fill="url(#g)"/>
<g style="animation:appear .5s .1s ease-out both">
<text class="m" x="48" y="52" font-size="13" fill="${t.muted}"><tspan fill="${t.good}">➜</tspan> <tspan fill="${t.accent}" font-weight="700">~</tspan> $ ${esc(c.cmd)}</text>
<circle cx="53" cy="80" r="5" fill="${t.good}"/><circle class="pulse" cx="53" cy="80" r="5" fill="none" stroke="${t.good}" stroke-width="1.5"/>
<text class="m" x="68" y="84" font-size="13" font-weight="700" fill="${t.good}">${esc(c.live)}</text></g>
<text x="48" y="130" font-size="40" font-weight="700" fill="${t.fg}" letter-spacing="-1" style="animation:appear .5s .4s ease-out both">${esc(c.a)}</text>
<g style="animation:appear .5s .7s ease-out both"><rect x="48" y="192" width="${Math.round(c.b.length * 19.5)}" height="8" rx="4" fill="${t.accent2}" opacity=".35"/>
<text x="48" y="184" font-size="40" font-weight="700" fill="${t.accent}" letter-spacing="-1">${esc(c.b)}</text></g>
${px}`;
  return svg(960, 230, t, `<title>${esc(c.a + " " + c.b)}</title>${body}`, css);
}

/** Tombol kecil; ditautkan dari README. primary = terisi aksen. */
export function button(name, label, primary) {
  const t = themes[name], w = Math.round(label.length * 8.2 + 64), on = name === "dark" ? "#0d1117" : "#ffffff";
  const body = `<rect x="1" y="1" width="${w - 2}" height="46" rx="23" fill="${primary ? t.accent : t.card}" stroke="${primary ? t.accent : t.line}" stroke-width="1.5"/>
<text class="m" x="${w / 2 - 8}" y="29" font-size="14" font-weight="700" fill="${primary ? on : t.fg}" text-anchor="middle">${esc(label)}</text>
<text class="m" x="${w - 30}" y="29" font-size="14" font-weight="700" fill="${primary ? on : t.accent}">↗</text>`;
  return { w, svg: svg(w, 48, t, `<title>${esc(label)}</title>${body}`) };
}
