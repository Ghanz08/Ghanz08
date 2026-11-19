import { esc, svg, themes, PLANE } from "./theme.mjs";
import { logo } from "./logo.mjs";

// Lepas landas di garis lurus. Tiap pesawat: masuk landasan, menunggu sebentar, dipercepat sambil membesar, lalu memudar di akhir.
// Pesawat baru muncul saat yang lama hampir hilang (tumpang tindih OV detik), supaya gerak tidak berhenti.
// Dua pesawat bergantian: jeda D = L - OV, durasi putaran T = 2 * D.
const L = 7, OV = 0.8, D = L - OV, T = 2 * D, PLANES = 2, Y = 113, XS = 146, X0 = 172, X1 = 334;
const pct = (sec) => ((100 * sec) / T).toFixed(2) + "%";
// Percepatan konstan berarti posisi ~ t^2 dan ukuran ~ t^3; kedua kurva ini persis cubic-bezier(1/3,0,2/3,1/3) dan (1/3,0,2/3,0).
const OUT = "cubic-bezier(.33,1,.68,1)", QUAD = "cubic-bezier(.3333,0,.6667,.3333)", CUBE = "cubic-bezier(.3333,0,.6667,0)", SINE = "cubic-bezier(.37,0,.63,1)";
const px = (y0, y1) => `0%{transform:translate(${XS}px,${y0}px);animation-timing-function:${OUT}}${pct(0.7)}{transform:translate(${X0}px,${y0}px)}${pct(1.9)}{transform:translate(${X0}px,${y0}px);animation-timing-function:${QUAD}}${pct(L)},100%{transform:translate(${X1}px,${y1}px)}`;
const ps = (a, b) => `0%{transform:scale(.6)}${pct(1.9)}{transform:scale(.6);animation-timing-function:${CUBE}}${pct(L)},100%{transform:scale(${b})}`;
const po = (m, e) => `0%{opacity:0;animation-timing-function:${OUT}}${pct(0.7)}{opacity:${m}}${pct(1.9)}{opacity:${m};animation-timing-function:linear}${pct(L - 0.9)}{opacity:${e};animation-timing-function:${SINE}}${pct(L)},100%{opacity:0}`;

// Warna dan logo sayap diambil dari desain Figma SkyBase.
const SB = { navy: "#174394", sky: "#54A4D9", mid: "#2a6bc0" };
const copy = {
  en: { air: "SKYBASE", bp: "BOARDING PASS", pax: "PASSENGER", prog: "PROGRAM", exp: "EXPERIENCE", ship: "SHIPPED", fin: "FINALIST", org: "ORGANISATIONS",
        v: ["GHANI ZULHUSNI BAHRI", "SOFTWARE ENG. · UGM", "4+ YEARS", "10+ PROJECTS", "GEMASTIK XVIII", "4+ TECH ORGS"],
        from: "SMK RPL · 2021", to: "Software Engineer · 2028", st: "BOARDING", note: "open to opportunities", gate: "GATE" },
  id: { air: "SKYBASE", bp: "KARTU NAIK PESAWAT", pax: "PENUMPANG", prog: "PROGRAM", exp: "PENGALAMAN", ship: "RILIS", fin: "FINALIS", org: "ORGANISASI",
        v: ["GHANI ZULHUSNI BAHRI", "REKAYASA PERANGKAT LUNAK · UGM", "4+ TAHUN", "10+ PROYEK", "GEMASTIK XVIII", "4+ ORG TEKNOLOGI"],
        from: "SMK RPL · 2021", to: "Software Engineer · 2028", st: "BOARDING", note: "terbuka untuk peluang", gate: "GERBANG" },
};

export function boarding(name, lang) {
  const t = { ...themes[name] }, c = copy[lang], H = 250;
  const dk = name === "dark"; t.accent = dk ? SB.sky : SB.navy; t.accent2 = dk ? SB.mid : SB.sky; t.soft = dk ? "#10244d" : "#e6f0fb";
  let seed = 11, x = 756, bars = "";
  while (x < 926) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const w = 1 + (seed % 4);
    bars += `<rect x="${x}" y="156" width="${w}" height="44" fill="${t.fg}"/>`;
    x += w + 1 + ((seed >> 8) % 3);
  }
  const field = (x, y, label, val) => `<text class="m" x="${x}" y="${y}" font-size="9.5" letter-spacing="1" fill="${t.muted}">${esc(label)}</text>
<text class="m" x="${x}" y="${y + 20}" font-size="14" font-weight="700" fill="${t.fg}">${esc(val)}</text>`;
  const css = `@keyframes px{${px(Y, Y)}}@keyframes ps{${ps(0.6, 1.7)}}@keyframes po{${po(1, 1)}}
@keyframes sx{${px(Y + 1, Y + 16)}}@keyframes ss{${ps(0.6, 1.5)}}@keyframes so{${po(0.28, 0.16)}}
.px,.sx{animation:px ${T}s linear infinite both}.sx{animation-name:sx}
.ps{opacity:0;animation:ps ${T}s linear infinite both,po ${T}s linear infinite both}
.ss{opacity:0;animation:ss ${T}s linear infinite both,so ${T}s linear infinite both}
@keyframes chase{to{stroke-dashoffset:-20}}.lights{animation:chase 1.1s linear infinite}`;
  const body = `<defs><clipPath id="c"><rect x="0" y="0" width="960" height="${H}" rx="18"/></clipPath>
<linearGradient id="hd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${SB.mid}"/><stop offset="1" stop-color="${SB.navy}"/></linearGradient></defs>
<rect x=".5" y=".5" width="959" height="${H - 1}" rx="18" fill="${t.card}" stroke="${t.line}"/>
<g clip-path="url(#c)"><rect width="960" height="42" fill="url(#hd)"/></g>
${logo(24, 8, 26, { main: "#ffffff", accent: "#cfe6fa" }, "bp")}
<text class="m" x="700" y="26" font-size="11" letter-spacing="2" fill="#ffffff" text-anchor="end" opacity=".9">${c.bp}</text>

<g style="animation:appear .5s .1s ease-out both">
<text class="m" x="32" y="92" font-size="9.5" letter-spacing="1" fill="${t.muted}">FROM</text>
<text x="32" y="126" font-size="44" font-weight="700" fill="${t.fg}" letter-spacing="-1">SMK</text>
<text class="m" x="32" y="144" font-size="10.5" fill="${t.muted}">${esc(c.from)}</text>
<text class="m" x="520" y="92" font-size="9.5" letter-spacing="1" fill="${t.muted}" text-anchor="end">TO</text>
<text x="520" y="126" font-size="44" font-weight="700" fill="${t.accent}" letter-spacing="-1" text-anchor="end">SWE</text>
<text class="m" x="520" y="144" font-size="10.5" fill="${t.muted}" text-anchor="end">${esc(c.to)}</text></g>
<line x1="160" x2="392" y1="${Y}" y2="${Y}" stroke="${t.accent2}" stroke-width="2" stroke-dasharray="3 7" stroke-linecap="round" class="lights"/>
${Array.from({ length: PLANES }, (_, k) => {
    const d = k * D, st = `style="animation-delay:${d}s"`;
    return `<g class="sx" ${st}><g class="ss" ${st}><path d="${PLANE}" fill="${name === "dark" ? "#000" : t.fg}"/></g></g><g class="px" ${st}><g class="ps" ${st}><path d="${PLANE}" fill="${t.accent}" stroke="${t.card}" stroke-width="1.2" stroke-linejoin="round"/></g></g>`;
  }).join("")}

<g style="animation:appear .5s .5s ease-out both">${field(32, 176, c.pax, c.v[0])}${field(300, 176, c.prog, c.v[1])}</g>
<g style="animation:appear .5s .7s ease-out both">${field(32, 214, c.exp, c.v[2])}${field(212, 214, c.ship, c.v[3])}${field(392, 214, c.fin, c.v[4])}${field(560, 214, c.org, c.v[5])}</g>

<line x1="728" x2="728" y1="14" y2="${H - 14}" stroke="${t.line}" stroke-dasharray="4 5"/>
<path d="M716 0 A12 12 0 0 0 740 0 Z" fill="${t.page}" stroke="${t.line}"/><path d="M716 ${H} A12 12 0 0 1 740 ${H} Z" fill="${t.page}" stroke="${t.line}"/>
<g style="animation:appear .5s .9s ease-out both">
<text class="m" x="756" y="72" font-size="9.5" letter-spacing="1" fill="${t.muted}">${c.gate}</text>
<text x="756" y="104" font-size="30" font-weight="700" fill="${t.fg}" letter-spacing="-.5">GZ-2028</text>
<text class="m" x="756" y="128" font-size="10.5" fill="${t.muted}">UGM · YOGYAKARTA</text>
${bars}
<circle cx="762" cy="222" r="5" fill="${t.good}" style="animation:blink 1.4s steps(1) infinite"/>
<text class="m" x="774" y="226" font-size="12" font-weight="700" fill="${t.good}">${c.st}</text>
<text class="m" x="756" y="242" font-size="10" fill="${t.muted}">${esc(c.note)}</text></g>`;
  return svg(960, H, t, `<title>${esc("Boarding pass: Ghani Zulhusni Bahri, " + c.v.slice(1).join(", "))}</title>${body}`, css);
}
