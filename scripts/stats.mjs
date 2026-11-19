// Mengambil data publik dari GitHub dan menggambar assets/stats-*.svg (skyline + dial) dan assets/board-*.svg.
// Jalan di GitHub Actions (GITHUB_TOKEN) maupun lokal (GH_TOKEN=$(gh auth token)).
import { writeFileSync } from "node:fs";
import { esc, svg, themes } from "./theme.mjs";
import { board } from "./board.mjs";

const LOGIN = process.env.GH_LOGIN || "Ghanz08";
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
if (!token) throw new Error("GH_TOKEN atau GITHUB_TOKEN belum diisi");
const H = { Authorization: `bearer ${token}`, "User-Agent": "profile-stats", Accept: "application/vnd.github+json" };

const query = `query($login:String!){ user(login:$login){
  repositories(ownerAffiliations:OWNER, isFork:false, privacy:PUBLIC, first:100){ totalCount
    nodes{ languages(first:8, orderBy:{field:SIZE,direction:DESC}){ edges{ size node{ name color } } } } }
  contributionsCollection{ totalCommitContributions totalPullRequestContributions
    contributionCalendar{ totalContributions weeks{ contributionDays{ contributionCount } } } } } }`;

const res = await fetch("https://api.github.com/graphql", { method: "POST", headers: { ...H, "Content-Type": "application/json" }, body: JSON.stringify({ query, variables: { login: LOGIN } }) });
const json = await res.json();
// Gagal berarti berhenti: lebih baik gambar lama bertahan daripada menimpanya dengan kartu kosong.
if (!res.ok || json.errors || !json.data?.user) throw new Error("GraphQL gagal: " + JSON.stringify(json.errors ?? res.status));

// Event push GitHub tak lagi memuat daftar commit, jadi ambil commit terbaru tiap repo publik yang paling baru aktif.
const reposRes = await fetch(`https://api.github.com/users/${LOGIN}/repos?sort=pushed&per_page=15&type=owner`, { headers: H });
if (!reposRes.ok) throw new Error("repos gagal: " + reposRes.status);
const recent = (await reposRes.json()).filter((r) => !r.fork && r.name !== LOGIN && !/-sv-\d+$/i.test(r.name)).slice(0, 6);
const pushes = (await Promise.all(recent.map(async (r) => {
  const c = await fetch(`https://api.github.com/repos/${r.full_name}/commits?per_page=1`, { headers: H });
  if (!c.ok) return null;
  const [head] = await c.json();
  return head ? { repo: r.name, msg: head.commit.message.split("\n")[0], at: new Date(head.commit.committer.date) } : null;
}))).filter(Boolean).sort((a, b) => b.at - a.at);

const u = json.data.user, cc = u.contributionsCollection, weeks = cc.contributionCalendar.weeks;
// Markup dan template tidak dihitung: yang ingin ditunjukkan adalah bahasa pemrograman.
const SKIP = new Set(["HTML", "CSS", "SCSS", "Blade", "Dockerfile", "Shell"]);
const langs = {};
for (const r of u.repositories.nodes) for (const e of r.languages.edges) if (!SKIP.has(e.node.name))
  (langs[e.node.name] ??= { size: 0, color: e.node.color || "#8b949e" }).size += e.size;
const total = Object.values(langs).reduce((a, l) => a + l.size, 0);
const top = Object.entries(langs).sort((a, b) => b[1].size - a[1].size).slice(0, 4);
const max = Math.max(1, ...weeks.flatMap((w) => w.contributionDays.map((d) => d.contributionCount)));
const fmt = (n) => n.toLocaleString("en-US");
const tiles = [[fmt(cc.contributionCalendar.totalContributions), "contributions, last year"], [fmt(cc.totalCommitContributions), "commits"],
  [fmt(cc.totalPullRequestContributions), "pull requests"], [fmt(u.repositories.totalCount), "public repos"]];

const shade = (hex, f) => "#" + [1, 3, 5].map((i) => Math.max(0, Math.min(255, Math.round(parseInt(hex.slice(i, i + 2), 16) * f))).toString(16).padStart(2, "0")).join("");

function render(name) {
  const t = themes[name], dark = name === "dark";
  const tileSvg = tiles.map(([v, l], i) => {
    const x = 32 + i * 226;
    return `<g style="animation:appear .5s ${(i * 0.1).toFixed(1)}s ease-out both"><text class="m" x="${x}" y="52" font-size="30" font-weight="700" fill="${t.fg}">${esc(v)}</text><text class="m" x="${x}" y="74" font-size="11" fill="${t.muted}">${esc(l)}</text></g>`;
  }).join("");

  // Skyline: tiap hari jadi balok; baris belakang digambar lebih dulu, lalu bergeser ke depan.
  const BW = 11, DX = 5, DY = 4, CX = 15, SX = 6, RY = 11, X0 = 40, Y0 = 196, MAXH = 70;
  const base = dark ? "#818cf8" : "#4f46e5", flat = dark ? "#2a2f3a" : "#e4e7f2";
  let city = "";
  for (let r = 0; r < 7; r++) weeks.forEach((w, c) => {
    const n = w.contributionDays[r]?.contributionCount ?? 0, h = 2 + Math.sqrt(n / max) * MAXH;
    const x = X0 + c * CX + r * SX, y = Y0 + r * RY, col = n === 0 ? flat : base;
    const delay = (0.3 + c * 0.03 + r * 0.02).toFixed(2);
    city += `<g style="animation:appear .5s ${delay}s ease-out both"><rect x="${x}" y="${y - h}" width="${BW}" height="${h}" fill="${col}"/>` +
      `<polygon points="${x},${y - h} ${x + BW},${y - h} ${x + BW + DX},${y - h - DY} ${x + DX},${y - h - DY}" fill="${n === 0 ? shade(flat, dark ? 1.4 : 1.03) : shade(base, 1.25)}"/>` +
      `<polygon points="${x + BW},${y - h} ${x + BW + DX},${y - h - DY} ${x + BW + DX},${y - DY} ${x + BW},${y}" fill="${n === 0 ? shade(flat, .85) : shade(base, .7)}"/></g>`;
  });

  // Dial: busur 240 derajat; panjang isi = porsi bahasa terhadap total.
  const R = 32, arc = (a) => { const rad = (Math.PI / 180) * (150 + a); return [(R * Math.cos(rad)).toFixed(1), (R * Math.sin(rad)).toFixed(1)]; };
  const dials = top.map(([n, l], i) => {
    const cx = 130 + i * 233, cy = 356, pct = l.size / total, a1 = 240 * Math.min(0.999, pct);
    const [sx, sy] = arc(0), [ex, ey] = arc(240), [fx, fy] = arc(a1), big = a1 > 180 ? 1 : 0;
    return `<g transform="translate(${cx} ${cy})"><g style="animation:appear .6s ${(1.2 + i * 0.15).toFixed(2)}s ease-out both">
<path d="M${sx} ${sy} A${R} ${R} 0 1 1 ${ex} ${ey}" fill="none" stroke="${t.line}" stroke-width="7" stroke-linecap="round"/>
<path d="M${sx} ${sy} A${R} ${R} 0 ${big} 1 ${fx} ${fy}" fill="none" stroke="${l.color}" stroke-width="7" stroke-linecap="round"/>
<text class="m" y="6" font-size="17" font-weight="700" fill="${t.fg}" text-anchor="middle">${(pct * 100).toFixed(0)}%</text>
<text class="m" y="52" font-size="11.5" fill="${t.muted}" text-anchor="middle">${esc(n)}</text></g></g>`;
  }).join("");

  const body = `<rect x=".5" y=".5" width="959" height="447" rx="14" fill="${t.card}" stroke="${t.line}"/>
${tileSvg}${city}
<text class="m" x="32" y="300" font-size="10.5" letter-spacing="2" fill="${t.muted}">INSTRUMENTS · MOST-USED LANGUAGES, PUBLIC REPOS</text>
${dials}
<text class="m" x="928" y="436" font-size="10" fill="${t.muted}" text-anchor="end" opacity=".7">updated ${new Date().toISOString().slice(0, 10)} · generated by scripts/stats.mjs</text>`;
  return svg(960, 448, t, `<title>GitHub activity of ${esc(LOGIN)} drawn as a city skyline, with language gauges</title>${body}`, "");
}

for (const n of ["dark", "light"]) {
  writeFileSync(`assets/stats-${n}.svg`, render(n));
  writeFileSync(`assets/board-${n}.svg`, board(n, pushes));
}
console.log("stats:", tiles.map((t) => t.join(" ")).join(" | "), "|", top.map(([n]) => n).join(","), "| pushes:", pushes.length);
