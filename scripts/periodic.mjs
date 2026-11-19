import { esc, svg, themes } from "./theme.mjs";

const groups = {
  lang: { label: "languages", c: ["#4f46e5", "#818cf8"] },
  fw: { label: "frameworks", c: ["#0284c7", "#38bdf8"] },
  data: { label: "data", c: ["#d97706", "#fbbf24"] },
  infra: { label: "infrastructure", c: ["#15803d", "#4ade80"] },
  next: { label: "exploring", c: ["#9333ea", "#c084fc"] },
};
const els = [
  ["lang", "Ts", "TypeScript"], ["lang", "Go", "Go"], ["lang", "Ph", "PHP"], ["lang", "Py", "Python"], ["lang", "Kt", "Kotlin"], ["lang", "Jv", "Java"], ["lang", "Da", "Dart"],
  ["fw", "Nx", "Next.js"], ["fw", "Re", "React"], ["fw", "Ns", "NestJS"], ["fw", "Lv", "Laravel"], ["fw", "Vu", "Vue"], ["fw", "Fl", "Flutter"],
  ["data", "Pg", "PostgreSQL"], ["data", "My", "MySQL"], ["data", "Rd", "Redis"], ["data", "Sb", "Supabase"], ["data", "Pr", "Prisma"],
  ["infra", "Dk", "Docker"], ["infra", "Ga", "Actions"], ["infra", "Cd", "Caddy"], ["infra", "Lx", "Linux"], ["infra", "Vc", "Vercel"],
  ["next", "Ai", "Applied AI"], ["next", "Cv", "Vision"],
];

export function periodic(name) {
  const t = themes[name], dark = name === "dark", W = 66, G = 6.6;
  const tiles = els.map(([g, sym, nm], i) => {
    const col = i < 13 ? i : i - 13, row = i < 13 ? 0 : 1, x = 12 + col * (W + G), y = 46 + row * 94;
    const c = groups[g].c[dark ? 1 : 0], d = (0.1 + i * 0.045).toFixed(2), ex = g === "next";
    return `<g style="animation:appear .45s ${d}s ease-out both">
<rect x="${x}" y="${y}" width="${W}" height="84" rx="9" fill="${c}" fill-opacity="${dark ? ".12" : ".09"}" stroke="${c}" stroke-width="1.5"${ex ? ' stroke-dasharray="4 3"' : ""}/>
<text class="m" x="${x + 7}" y="${y + 16}" font-size="9.5" fill="${c}" opacity=".85">${i + 1}</text>
<text x="${x + W / 2}" y="${y + 52}" font-size="28" font-weight="700" fill="${c}" text-anchor="middle" letter-spacing="-.5">${sym}</text>
<text class="m" x="${x + W / 2}" y="${y + 72}" font-size="9" fill="${t.fg}" text-anchor="middle">${esc(nm)}</text></g>`;
  }).join("\n");
  let lx = 14;
  const legend = Object.values(groups).map((g) => {
    const c = g.c[dark ? 1 : 0], s = `<rect x="${lx}" y="240" width="12" height="12" rx="3" fill="${c}" fill-opacity=".25" stroke="${c}" stroke-width="1.5"/><text class="m" x="${lx + 18}" y="250" font-size="10.5" fill="${t.muted}">${g.label}</text>`;
    lx += 36 + g.label.length * 6.6; return s;
  }).join("");
  const last = 12 * (W + G) + 12;
  const body = `<rect x=".5" y=".5" width="959" height="279" rx="16" fill="${t.card}" stroke="${t.line}"/>
<text class="m" x="14" y="30" font-size="10.5" letter-spacing="2" fill="${t.muted}">THE PERIODIC TABLE OF MY STACK</text>
${tiles}
<rect x="${last}" y="140" width="${W}" height="84" rx="9" fill="none" stroke="${t.line}" stroke-dasharray="2 4"/>
<text class="m" x="${last + W / 2}" y="186" font-size="9.5" fill="${t.muted}" text-anchor="middle">next?</text>
${legend}`;
  return svg(960, 280, t, `<title>Periodic table of my stack: ${esc(els.map((e) => e[2]).join(", "))}</title>${body}`);
}
