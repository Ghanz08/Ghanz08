import { esc, svg, themes, PLANE } from "./theme.mjs";
import { track, bezier, frames } from "./flight.mjs";

const takeoff = track([[430, 204], [640, 204], ...bezier([[640, 204], [760, 204], [850, 160], [940, 70]], 60)]);

const copy = {
  en: { cmd: "cleared for takeoff?", live: "available for opportunities", a: "Got a messy workflow?", b: "Let's make it dependable." },
  id: { cmd: "siap lepas landas?", live: "terbuka untuk peluang", a: "Punya alur kerja berantakan?", b: "Kita bikin jadi andal." },
};

export function contact(name, lang) {
  const t = themes[name], c = copy[lang];
  const lights = Array.from({ length: 16 }, (_, i) => `<rect x="${430 + i * 30}" y="213" width="16" height="3" rx="1.5" fill="${t.accent}" style="animation:run 1.6s ${(i * 0.1).toFixed(1)}s linear infinite"/>`).join("");
  const css = `@keyframes run{0%{opacity:.15}20%{opacity:1}60%,100%{opacity:.15}}
@keyframes pulse{0%{r:5;opacity:.8}100%{r:13;opacity:0}}.pulse{animation:pulse 1.8s ease-out infinite}
.plane{opacity:0;animation:fly 6s linear infinite both}@keyframes fly{${frames(takeoff, { K: 90, ease: (u) => Math.pow(u, 1.7), fade: [0.04, 0.1] })}}`;
  const body = `<defs><pattern id="g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="${t.grid}"/></pattern></defs>
<rect x=".5" y=".5" width="959" height="229" rx="16" fill="${t.bg}" stroke="${t.line}"/><rect x="1" y="1" width="958" height="228" rx="16" fill="url(#g)"/>
<g style="animation:appear .5s .1s ease-out both">
<text class="m" x="48" y="52" font-size="13" fill="${t.muted}">${esc(c.cmd)}</text>
<circle cx="53" cy="80" r="5" fill="${t.good}"/><circle class="pulse" cx="53" cy="80" r="5" fill="none" stroke="${t.good}" stroke-width="1.5"/>
<text class="m" x="68" y="84" font-size="13" font-weight="700" fill="${t.good}">${esc(c.live)}</text></g>
<text x="48" y="130" font-size="40" font-weight="700" fill="${t.fg}" letter-spacing="-1" style="animation:appear .5s .4s ease-out both">${esc(c.a)}</text>
<g style="animation:appear .5s .7s ease-out both"><rect x="48" y="192" width="${Math.round(c.b.length * 19.5)}" height="8" rx="4" fill="${t.accent2}" opacity=".35"/>
<text x="48" y="184" font-size="40" font-weight="700" fill="${t.accent}" letter-spacing="-1">${esc(c.b)}</text></g>
<line x1="410" x2="930" y1="214.5" y2="214.5" stroke="${t.line}"/>${lights}
<path d="M0 0 L0 0" fill="none"/>
<g class="plane"><path d="${PLANE}" transform="scale(1.05)" fill="${t.accent}" stroke="${t.bg}" stroke-width="1.2" stroke-linejoin="round"/></g>`;
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
