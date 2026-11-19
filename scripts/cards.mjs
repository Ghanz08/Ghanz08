import { esc, svg, themes } from "./theme.mjs";
import { logo } from "./logo.mjs";

const wrap = (s, max) => {
  const out = []; let line = "";
  for (const w of s.split(" ")) {
    if ((line + " " + w).trim().length > max) { out.push(line); line = w; } else line = (line + " " + w).trim();
  }
  return out.concat(line);
};
const pills = (tags, x, y, t) => {
  let cx = x;
  return tags.map((g) => {
    const w = Math.round(g.length * 6.4 + 18), out = `<rect x="${cx}" y="${y}" width="${w}" height="22" rx="11" fill="${t.soft}"/><text class="m" x="${cx + w / 2}" y="${y + 15}" font-size="10.5" fill="${t.accent}" text-anchor="middle">${esc(g)}</text>`;
    cx += w + 6; return out;
  }).join("");
};

export const projects = [
  { id: "kost3g", kind: "FULL-STACK", state: "live", title: "Kost 3g", from: "#16855a", to: "#d97706",
    text: "Website and admin panel for a real 7-room boarding house: rooms, tenants, leases, finances and a lead inbox. Self-hosted, with CI/CD.",
    tags: ["Next.js 16", "Supabase", "Umami", "GitHub CD"] },
  { id: "glideslope", kind: "FULL-STACK", state: "repo", title: "Glideslope", from: "#4f46e5", to: "#3b82f6",
    text: "Personal finance that turns bank emails and receipt photos into transactions you confirm, so the books keep themselves.",
    tags: ["Next.js", "Go", "Supabase", "OCR"] },
  { id: "android", kind: "MOBILE", state: "repo", title: "Glideslope Android", from: "#22c55e", to: "#06b6d4",
    text: "Companion app that forwards finance notifications to Glideslope: encrypted secret, offline queue, retries with backoff.",
    tags: ["Kotlin", "Compose", "Room", "WorkManager"] },
  { id: "ted", kind: "PLATFORM", state: "live", title: "Tech Enthusiast Day", from: "#9333ea", to: "#4f46e5",
    text: "Registration platform for a national tech competition with thousands of participants. Led an 8-developer team through CI/CD and launch.",
    tags: ["Next.js", "Firebase", "Vercel", "Actions"] },
  { id: "sibudaya", kind: "BACKEND", state: "case study", title: "SIBUDAYA", from: "#6366f1", to: "#2563eb",
    text: "Facilitation system for cultural institutions at UGM: multi-stage approvals with audit trail, role-based access and PDF reports.",
    tags: ["NestJS", "PostgreSQL", "Prisma", "Docker"] },
  { id: "skybase", kind: "BACKEND", state: "case study", title: "SkyBase", from: "#174394", to: "#54A4D9", mark: true,
    text: "Aircraft parts inventory and warehouse system. Row-level locks keep stock exact when several people check out at once.",
    tags: ["Laravel 11", "MySQL", "Redis", "RBAC"] },
];

export function card(p, name) {
  const t = themes[name];
  const lines = wrap(p.text, 60).slice(0, 3);
  const live = p.state === "live";
  const body = `
<defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${p.from}"/><stop offset="1" stop-color="${p.to}"/></linearGradient></defs>
<rect x=".5" y=".5" width="439" height="185" rx="14" fill="${t.card}" stroke="${t.line}"/>
<rect x="0" y="0" width="6" height="186" rx="3" fill="url(#g)"/>
<text class="m" x="28" y="34" font-size="10.5" letter-spacing="1" fill="${t.muted}">${esc(p.kind)}</text>
<text class="m" x="412" y="34" font-size="10.5" fill="${live ? t.good : t.muted}" text-anchor="end">${live ? "● " : ""}${esc(p.state)}</text>
${p.mark ? logo(28, 44, 28, name === "dark" ? { main: "#8fb8ea", accent: "#54A4D9" } : { main: "#174394", accent: "#54A4D9" }, "ck")
  : `<text x="28" y="64" font-size="21" font-weight="700" fill="${t.fg}" letter-spacing="-.3">${esc(p.title)}</text>`}
${lines.map((l, i) => `<text x="28" y="${90 + i * 18}" font-size="12.5" fill="${t.muted}">${esc(l)}</text>`).join("")}
${pills(p.tags, 28, 148, t)}`;
  return svg(440, 186, t, `<title>${esc(p.title)}</title>${body}`);
}
