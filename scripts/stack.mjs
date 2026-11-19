import { esc, svg, themes } from "./theme.mjs";

const rows = [
  ["languages", ["TypeScript", "Go", "PHP", "Python", "Kotlin", "Java", "Dart"]],
  ["frameworks", ["Next.js", "React", "NestJS", "Laravel", "Vue", "Flutter"]],
  ["data", ["PostgreSQL", "MySQL", "Redis", "Supabase", "Prisma"]],
  ["infra", ["Docker", "GitHub Actions", "Caddy", "Linux VPS", "Vercel"]],
  ["exploring", ["Applied AI", "computer vision"]],
];

export function stack(name) {
  const t = themes[name];
  const body = rows.map(([k, tags], r) => {
    const y = 58 + r * 44; let cx = 150;
    const pills = tags.map((g) => {
      const w = Math.round(g.length * 6.6 + 20), s = `<rect x="${cx}" y="${y - 15}" width="${w}" height="24" rx="12" fill="${k === "exploring" ? "none" : t.soft}" stroke="${k === "exploring" ? t.accent : "none"}" stroke-dasharray="${k === "exploring" ? "4 3" : "0"}"/><text class="m" x="${cx + w / 2}" y="${y + 1}" font-size="11" fill="${t.accent}" text-anchor="middle">${esc(g)}</text>`;
      cx += w + 8; return s;
    }).join("");
    return `<g style="animation:appear .45s ${(0.15 + r * 0.12).toFixed(2)}s ease-out both"><text class="m" x="32" y="${y + 1}" font-size="12" fill="${t.muted}">${esc(k)}</text>${pills}</g>`;
  }).join("\n");
  return svg(960, 268, t, `<title>Tech stack</title>
<rect x=".5" y=".5" width="959" height="267" rx="14" fill="${t.card}" stroke="${t.line}"/>${body}`);
}
