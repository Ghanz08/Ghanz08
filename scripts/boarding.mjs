import { esc, svg, themes, PLANE } from "./theme.mjs";

// Warna dan logo sayap diambil dari desain Figma SkyBase.
const SB = { navy: "#02419b", blue: "#0059d6", bright: "#1677ff", sky: "#8bb8ff" };
const wing = (x, y, s, c) => `<g transform="translate(${x} ${y}) scale(${s})"><path d="M0 22 C6 8 20 0 40 0 C28 6 20 14 17 30 C12 24 6 22 0 22Z" fill="${c}"/><path d="M6 30 C10 22 18 18 26 18 C20 22 16 28 14 36 C11 33 8 31 6 30Z" fill="${c}" opacity=".55"/></g>`;

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
  const dk = name === "dark"; t.accent = dk ? SB.sky : SB.blue; t.accent2 = dk ? SB.blue : SB.bright; t.soft = dk ? "#10244d" : "#e8f0ff";
  let seed = 11, x = 756, bars = "";
  while (x < 926) {
    seed = (seed * 1103515245 + 12345) & 0x7fffffff;
    const w = 1 + (seed % 4);
    bars += `<rect x="${x}" y="156" width="${w}" height="44" fill="${t.fg}"/>`;
    x += w + 1 + ((seed >> 8) % 3);
  }
  const field = (x, y, label, val) => `<text class="m" x="${x}" y="${y}" font-size="9.5" letter-spacing="1" fill="${t.muted}">${esc(label)}</text>
<text class="m" x="${x}" y="${y + 20}" font-size="14" font-weight="700" fill="${t.fg}">${esc(val)}</text>`;
  const css = `@keyframes fly{from{transform:translateX(0)}to{transform:translateX(180px)}}
.fly{animation:fly 5.5s ease-in-out infinite alternate}`;
  const body = `<defs><clipPath id="c"><rect x="0" y="0" width="960" height="${H}" rx="18"/></clipPath>
<linearGradient id="hd" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="${SB.bright}"/><stop offset="1" stop-color="${SB.navy}"/></linearGradient></defs>
<rect x=".5" y=".5" width="959" height="${H - 1}" rx="18" fill="${t.card}" stroke="${t.line}"/>
<g clip-path="url(#c)"><rect width="960" height="42" fill="url(#hd)"/></g>
${wing(26, 9, .5, "#ffffff")}
<text x="58" y="27" font-size="15" font-weight="800" letter-spacing="1" fill="#ffffff">${c.air}</text>
<text class="m" x="700" y="26" font-size="11" letter-spacing="2" fill="#ffffff" text-anchor="end" opacity=".9">${c.bp}</text>

<g style="animation:appear .5s .1s ease-out both">
<text class="m" x="32" y="92" font-size="9.5" letter-spacing="1" fill="${t.muted}">FROM</text>
<text x="32" y="126" font-size="44" font-weight="700" fill="${t.fg}" letter-spacing="-1">SMK</text>
<text class="m" x="32" y="144" font-size="10.5" fill="${t.muted}">${esc(c.from)}</text>
<text class="m" x="520" y="92" font-size="9.5" letter-spacing="1" fill="${t.muted}" text-anchor="end">TO</text>
<text x="520" y="126" font-size="44" font-weight="700" fill="${t.accent}" letter-spacing="-1" text-anchor="end">SWE</text>
<text class="m" x="520" y="144" font-size="10.5" fill="${t.muted}" text-anchor="end">${esc(c.to)}</text></g>
<line x1="168" x2="392" y1="108" y2="108" stroke="${t.accent2}" stroke-width="2" stroke-dasharray="3 7" stroke-linecap="round"/>
<g transform="translate(196 108)"><g class="fly"><path d="${PLANE}" fill="${t.accent}"/></g></g>

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
