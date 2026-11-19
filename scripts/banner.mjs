import { esc, svg, monogram, themes, MONO } from "./theme.mjs";

const rows = [
  ["Role", "Software Engineer"],
  ["Works on", "Products, end to end"],
  ["Languages", "TypeScript, Go, PHP, Python"],
  ["Frameworks", "NestJS, Laravel, Next.js"],
  ["Databases", "PostgreSQL, Redis, MySQL"],
  ["Exploring", "Applied AI, computer vision"],
  ["Status", "Available for Opportunities"],
];

export function banner(name) {
  const t = themes[name];
  const rowSvg = rows.map(([k, v], i) => {
    const y = 146 + i * 25, d = (1.7 + i * 0.22).toFixed(2);
    const val = k === "Status" ? `<tspan fill="${t.good}">● </tspan>${esc(v)}` : esc(v);
    return `<g style="animation:appear .45s ${d}s ease-out both">
<text class="m" x="624" y="${y}" font-size="12" fill="${t.muted}">${esc(k)}</text>
<text class="m" x="912" y="${y}" font-size="12" font-weight="700" fill="${t.fg}" text-anchor="end">${val}</text></g>`;
  }).join("\n");

  const css = `
.cov{animation:type .8s .7s steps(8) both}
@keyframes type{to{transform:translateX(70px)}}
.strike{stroke-dasharray:400;stroke-dashoffset:400;animation:draw .6s 1.1s ease-out forwards}
`;
  const body = `
<defs><pattern id="g" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0H0V32" fill="none" stroke="${t.grid}"/></pattern></defs>
<rect x=".5" y=".5" width="959" height="399" rx="16" fill="${t.bg}" stroke="${t.line}"/>
<rect x="1" y="1" width="958" height="398" rx="16" fill="url(#g)"/>

${monogram(48, 38, 5, t.accent)}
<text x="96" y="56" font-size="17" font-weight="700" fill="${t.fg}">Ghani Zulhusni<tspan fill="${t.accent}">.</tspan></text>
<text class="m" x="96" y="72" font-size="11" fill="${t.muted}">software engineer</text>

<g style="animation:appear .5s .1s ease-out both">
<text class="m" x="48" y="126" font-size="13" fill="${t.muted}">hi, i’m <tspan font-weight="700" fill="${t.fg}">ghani zulhusni bahri</tspan></text>
<text class="m" x="48" y="148" font-size="13" fill="${t.muted}">software engineering @ UGM  /  yogyakarta</text>
</g>

<text x="48" y="214" font-size="46" font-weight="700" fill="${t.fg}" letter-spacing="-1" style="animation:appear .5s .25s ease-out both">I turn</text>
<g style="animation:appear .5s .5s ease-out both">
<text x="48" y="270" font-size="46" font-weight="700" fill="${t.muted}" opacity=".75" letter-spacing="-1">messy workflows</text></g>
<line class="strike" x1="46" y1="251" x2="438" y2="251" stroke="${t.fg}" stroke-width="4" stroke-linecap="round"/>
<g style="animation:appear .6s 1.7s ease-out both">
<text class="m" x="48" y="328" font-size="22" fill="${t.muted}">into →</text>
<rect x="150" y="338" width="388" height="8" rx="4" fill="${t.accent2}" opacity=".35"/>
<text x="150" y="328" font-size="46" font-weight="700" fill="${t.accent}" letter-spacing="-1">dependable apps</text></g>

<rect x="592" y="44" width="336" height="312" rx="12" fill="${t.card}" stroke="${t.line}"/>
<circle cx="612" cy="64" r="5" fill="#ff5f57"/><circle cx="630" cy="64" r="5" fill="#febc2e"/><circle cx="648" cy="64" r="5" fill="#28c840"/>
<text class="m" x="760" y="68" font-size="11" fill="${t.muted}" text-anchor="middle">~/ghani/portfolio</text>
<line x1="593" x2="927" y1="82" y2="82" stroke="${t.line}"/>
<text class="m" x="608" y="112" font-size="12" fill="${t.good}">➜</text>
<text class="m" x="626" y="112" font-size="12" font-weight="700" fill="${t.accent}">~/ghani/portfolio</text>
<text class="m" x="756" y="112" font-size="12" font-weight="700" fill="${t.fg}">$</text>
<text class="m" x="770" y="112" font-size="12" font-weight="700" fill="${t.fg}">neofetch</text>
<rect class="cov" x="768" y="99" width="70" height="18" fill="${t.card}"/>
${rowSvg}
<g style="animation:appear .4s 3.6s ease-out both">
<text class="m" x="608" y="334" font-size="12" fill="${t.good}">➜</text>
<text class="m" x="626" y="334" font-size="12" font-weight="700" fill="${t.accent}">~/ghani/portfolio</text>
<text class="m" x="756" y="334" font-size="12" font-weight="700" fill="${t.fg}">$</text>
<rect x="770" y="323" width="7" height="14" fill="${t.accent}" style="animation:blink 1.1s steps(1) infinite"/></g>`;
  return svg(960, 400, t, `<title>Ghani Zulhusni Bahri, software engineer: I turn messy workflows into dependable apps</title>${body}`, css);
}
