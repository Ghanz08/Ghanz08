// Mengambil data publik dari GitHub dan menggambar assets/stats-*.svg (skyline + dial) dan assets/board-*.svg.
// Jalan di GitHub Actions (GITHUB_TOKEN) maupun lokal (GH_TOKEN=$(gh auth token)).
import { writeFileSync } from "node:fs";
import { esc, svg, themes, PLANE } from "./theme.mjs";
import { board } from "./board.mjs";

const LOGIN = process.env.GH_LOGIN || "Ghanz08";
const token = process.env.GH_TOKEN || process.env.GITHUB_TOKEN;
if (!token) throw new Error("GH_TOKEN atau GITHUB_TOKEN belum diisi");
const H = { Authorization: `bearer ${token}`, "User-Agent": "profile-stats", Accept: "application/vnd.github+json" };

const query = `query($login:String!){ user(login:$login){
  repositories(ownerAffiliations:OWNER, isFork:false, privacy:PUBLIC, first:100){ totalCount
    nodes{ stargazerCount languages(first:8, orderBy:{field:SIZE,direction:DESC}){ edges{ size node{ name color } } } } }
  contributionsCollection{ totalCommitContributions totalPullRequestContributions totalIssueContributions totalRepositoriesWithContributedCommits
    contributionCalendar{ totalContributions weeks{ contributionDays{ contributionCount date } } } } } }`;

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
const top = Object.entries(langs).sort((a, b) => b[1].size - a[1].size).slice(0, 6);
const stars = u.repositories.nodes.reduce((a, r) => a + r.stargazerCount, 0);
const fmt = (n) => n.toLocaleString("en-US");
const days = weeks.flatMap((w) => w.contributionDays);

// Streak: hari berturut-turut dengan kontribusi. Streak berjalan boleh berakhir kemarin kalau hari ini belum ada.
let longest = { n: 0, end: null }, run = 0;
for (const d of days) { run = d.contributionCount > 0 ? run + 1 : 0; if (run > longest.n) longest = { n: run, end: d.date }; }
let cur = 0, curEnd = null, i = days.length - 1;
if (days[i]?.contributionCount === 0) i--;
for (; i >= 0 && days[i].contributionCount > 0; i--) { cur++; curEnd ??= days[i].date; }
const busiest = days.reduce((m, d) => (d.contributionCount > m.contributionCount ? d : m), days[0]);
const MON = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const nice = (iso, y) => `${MON[+iso.slice(5, 7) - 1]} ${+iso.slice(8, 10)}${y ? ", " + iso.slice(0, 4) : ""}`;

const nz = days.map((d) => d.contributionCount).filter(Boolean).sort((a, b) => a - b);
const q = [0.25, 0.5, 0.75].map((p) => nz[Math.floor(p * (nz.length - 1))] ?? 1);
const level = (c) => (c === 0 ? 0 : c <= q[0] ? 1 : c <= q[1] ? 2 : c <= q[2] ? 3 : 4);

const GREEN = { light: ["#ebedf0", "#9be9a8", "#40c463", "#30a14e", "#216e39"], dark: ["#21262d", "#0e4429", "#006d32", "#26a641", "#39d353"] };
const stat = [["commit", "Commits (last year)", fmt(cc.totalCommitContributions)], ["pr", "Pull requests", fmt(cc.totalPullRequestContributions)],
  ["issue", "Issues", fmt(cc.totalIssueContributions)], ["repo", "Public repos", fmt(u.repositories.totalCount)], ["contrib", "Contributed to", fmt(cc.totalRepositoriesWithContributedCommits)]];

function icon(k, x, y, c) {
  const a = `fill="none" stroke="${c}" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round"`;
  const g = {
    commit: `<circle cx="8" cy="8" r="3.2" ${a}/><path d="M0.5 8H4.8M11.2 8H15.5" ${a}/>`,
    pr: `<circle cx="4" cy="3.5" r="1.9" ${a}/><circle cx="4" cy="12.5" r="1.9" ${a}/><circle cx="12" cy="12.5" r="1.9" ${a}/><path d="M4 5.4V10.6M12 10.6V6.5A2 2 0 0 0 10 4.5H8.5" ${a}/>`,
    issue: `<circle cx="8" cy="8" r="6" ${a}/><circle cx="8" cy="8" r="1" fill="${c}"/>`,
    repo: `<path d="M3 2.5H12.5V12.5H4.5A1.5 1.5 0 0 0 3 14ZM3 14V2.5M6 12.5V14" ${a}/>`,
    contrib: `<circle cx="4" cy="3.5" r="1.9" ${a}/><circle cx="4" cy="12.5" r="1.9" ${a}/><circle cx="12" cy="5.5" r="1.9" ${a}/><path d="M4 5.4V10.6M12 7.4A4 4 0 0 1 6.5 10.6" ${a}/>`,
  }[k];
  return `<g transform="translate(${x} ${y})">${g}</g>`;
}

function render(name) {
  const t = themes[name], dark = name === "dark", G = GREEN[name], PW = 468;
  const card = (x, y, w, h) => `<rect x="${x + 0.5}" y="${y + 0.5}" width="${w}" height="${h}" rx="12" fill="${t.card}" stroke="${t.line}"/>`;

  // Kartu statistik
  const statRows = stat.map(([k, label, v], i) => {
    const y = 74 + i * 30;
    return `<g style="animation:appear .45s ${(0.1 + i * 0.08).toFixed(2)}s ease-out both">${icon(k, 28, y - 12, t.accent)}
<text x="56" y="${y}" font-size="13.5" fill="${t.fg}">${label}</text><text class="m" x="${PW - 24}" y="${y}" font-size="14" font-weight="700" fill="${t.fg}" text-anchor="end">${v}</text></g>`;
  }).join("");

  // Kartu bahasa: bar bertumpuk + legenda 2 kolom
  const BW = PW - 48; let bx = 24 + PW + 24 + 0;
  const L0 = 24 + PW + 24, segs = top.map(([n, l]) => { const w = Math.max(3, (l.size / total) * BW), s = `<rect x="${bx.toFixed(1)}" y="58" width="${w.toFixed(1)}" height="10" fill="${l.color}"/>`; bx += w; return s; }).join("");
  const legend = top.map(([n, l], i) => {
    const col = i % 2, row = Math.floor(i / 2), x = L0 + col * (BW / 2), y = 104 + row * 28;
    return `<g style="animation:appear .45s ${(0.3 + i * 0.07).toFixed(2)}s ease-out both"><circle cx="${x + 5}" cy="${y - 4}" r="5" fill="${l.color}"/><text x="${x + 18}" y="${y}" font-size="13" fill="${t.fg}">${esc(n)}</text><text class="m" x="${x + BW / 2 - 18}" y="${y}" font-size="12" fill="${t.muted}" text-anchor="end">${((l.size / total) * 100).toFixed(1)}%</text></g>`;
  }).join("");

  // Streak (tiga kolom, cincin di tengah)
  const SY = 232, col = (i) => 160 + i * 320;
  const ring = Math.min(1, cur / Math.max(longest.n, 1)), R = 38, C = 2 * Math.PI * R;
  const streak = `${[0, 1, 2].map((i) => i ? `<line x1="${i * 320}" x2="${i * 320}" y1="${SY + 22}" y2="${SY + 100}" stroke="${t.line}"/>` : "").join("")}
<g style="animation:appear .5s .3s ease-out both"><text x="${col(0)}" y="${SY + 54}" font-size="34" font-weight="700" fill="${t.fg}" text-anchor="middle">${fmt(cc.contributionCalendar.totalContributions)}</text><text x="${col(0)}" y="${SY + 78}" font-size="13" fill="${t.fg}" text-anchor="middle">Total contributions</text><text class="m" x="${col(0)}" y="${SY + 96}" font-size="10.5" fill="${t.muted}" text-anchor="middle">${nice(days[0].date, true)} – ${nice(days.at(-1).date, true)}</text></g>
<g style="animation:appear .5s .4s ease-out both"><circle cx="${col(1)}" cy="${SY + 48}" r="${R}" fill="none" stroke="${t.line}" stroke-width="5"/>
<circle cx="${col(1)}" cy="${SY + 48}" r="${R}" fill="none" stroke="${t.accent}" stroke-width="5" stroke-linecap="round" stroke-dasharray="${(C * ring).toFixed(1)} ${C.toFixed(1)}" transform="rotate(-90 ${col(1)} ${SY + 48})"/>
<text x="${col(1)}" y="${SY + 58}" font-size="28" font-weight="700" fill="${t.fg}" text-anchor="middle">${cur}</text></g>
<text x="${col(1)}" y="${SY + 104}" font-size="13" fill="${t.fg}" text-anchor="middle" style="animation:appear .5s .45s ease-out both">Current streak</text>
<g style="animation:appear .5s .5s ease-out both"><text x="${col(2)}" y="${SY + 54}" font-size="34" font-weight="700" fill="${t.fg}" text-anchor="middle">${longest.n}</text><text x="${col(2)}" y="${SY + 78}" font-size="13" fill="${t.fg}" text-anchor="middle">Longest streak</text><text class="m" x="${col(2)}" y="${SY + 96}" font-size="10.5" fill="${t.muted}" text-anchor="middle">ends ${nice(longest.end ?? days[0].date)}</text></g>`;

  // Heatmap standar GitHub. Pesawat memindai tahun: sel menyala saat dilewati (teknik CSS keyframes per sel, seperti snk).
  const HX = 64, HY = 424, CELL = 13, GAP = 3, STEP = CELL + GAP, T = 16, SWEEP = 44; // putaran 16 dtk, 44% pertama untuk terbang
  const ym = HY + 3.5 * STEP, x0 = HX - 36, x1 = HX + 53 * STEP + 36;
  const P = [[x0, ym + 18], [x0 + 280, ym - 70], [x1 - 280, ym + 70], [x1, ym - 18]];
  const bez = (t) => { const u = 1 - t; return [0, 1].map((k) => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]); };
  const N = 800, pts = Array.from({ length: N + 1 }, (_, n) => bez(n / N)), cum = [0];
  for (let n = 1; n <= N; n++) cum.push(cum[n - 1] + Math.hypot(pts[n][0] - pts[n - 1][0], pts[n][1] - pts[n - 1][1]));
  const at = (f) => { const tg = f * cum[N]; let n = 1; while (n < N && cum[n] < tg) n++; const r = (tg - cum[n - 1]) / (cum[n] - cum[n - 1] || 1); return [pts[n - 1][0] + (pts[n][0] - pts[n - 1][0]) * r, pts[n - 1][1] + (pts[n][1] - pts[n - 1][1]) * r]; };
  const fAtX = (x) => { let lo = 0, hi = 1; for (let n = 0; n < 24; n++) { const m = (lo + hi) / 2; if (at(m)[0] < x) lo = m; else hi = m; } return hi; };
  const K = 64, planeKf = Array.from({ length: K + 1 }, (_, n) => {
    const f = n / K, [px, py] = at(f), [ax, ay] = at(Math.max(0, f - 0.004)), [bx, by] = at(Math.min(1, f + 0.004));
    const op = n === 0 ? "opacity:0;" : n === 1 ? "opacity:1;" : n === K ? "opacity:1;" : "";
    return `${(SWEEP * f).toFixed(2)}%{transform:translate(${px.toFixed(1)}px,${py.toFixed(1)}px) rotate(${(Math.atan2(by - ay, bx - ax) * 180 / Math.PI).toFixed(1)}deg);${op}}`;
  }).join("");

  let cells = "", months = "", lastM = -1, bx2 = 0, by2 = 0, busyPct = 0, colKf = "";
  weeks.forEach((w, c) => {
    const first = w.contributionDays[0], m = +first.date.slice(5, 7);
    if (m !== lastM && c < weeks.length - 2) { months += `<text class="m" x="${HX + c * STEP}" y="${HY - 10}" font-size="10.5" fill="${t.muted}">${MON[m - 1]}</text>`; lastM = m; }
    const pc = SWEEP * fAtX(HX + c * STEP + CELL / 2);
    colKf += `@keyframes k${c}{0%,${Math.max(0, pc - 0.4).toFixed(2)}%{opacity:0}${(pc + 1.2).toFixed(2)}%,86%{opacity:1}95%,100%{opacity:0}}`;
    let base = "", lit = "";
    w.contributionDays.forEach((d, r) => {
      const x = HX + c * STEP, y = HY + r * STEP;
      base += `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2.5" fill="${G[0]}"/>`;
      if (d.contributionCount > 0) lit += `<rect x="${x}" y="${y}" width="${CELL}" height="${CELL}" rx="2.5" fill="${G[level(d.contributionCount)]}"/>`;
      if (d.date === busiest.date) { bx2 = x + CELL / 2; by2 = y; busyPct = pc; }
    });
    cells += base + (lit ? `<g style="animation:k${c} ${T}s linear infinite">${lit}</g>` : "");
  });
  const css = `${colKf}
.plane{opacity:0;animation:fly ${T}s linear infinite}@keyframes fly{${planeKf}${(SWEEP + 1.2).toFixed(2)}%,100%{opacity:0}}
.trail{opacity:0;stroke-dasharray:1;animation:trail ${T}s linear infinite}@keyframes trail{0%{stroke-dashoffset:1;opacity:.55}${SWEEP}%{stroke-dashoffset:0;opacity:.55}86%{opacity:.55}95%,100%{stroke-dashoffset:0;opacity:0}}
.burst{opacity:0;transform-box:fill-box;transform-origin:center;animation:burst ${T}s linear infinite}@keyframes burst{0%,${busyPct.toFixed(2)}%{opacity:0;transform:scale(.3)}${(busyPct + 0.3).toFixed(2)}%{opacity:.95;transform:scale(.5)}${(busyPct + 5).toFixed(2)}%,100%{opacity:0;transform:scale(3.4)}}`;
  const dayLbl = [["Mon", 1], ["Wed", 3], ["Fri", 5]].map(([l, r]) => `<text class="m" x="28" y="${HY + r * STEP + 10}" font-size="10" fill="${t.muted}">${l}</text>`).join("");
  const lg = [0, 1, 2, 3, 4].map((l, i) => `<rect x="${786 + i * 16}" y="${HY + 7 * STEP + 8}" width="${CELL}" height="${CELL}" rx="2.5" fill="${G[l]}"/>`).join("");
  const call = `<line x1="${bx2}" x2="${bx2}" y1="${by2 - 2}" y2="${HY - 26}" stroke="${t.muted}" stroke-dasharray="2 3"/><text class="m" x="${Math.min(bx2, 820)}" y="${HY - 30}" font-size="10.5" fill="${t.fg}" text-anchor="${bx2 > 820 ? "end" : "middle"}">busiest day · ${nice(busiest.date)} · ${busiest.contributionCount}</text>`;
  const flight = `M${P[0][0]} ${P[0][1]} C${P[1][0]} ${P[1][1]} ${P[2][0]} ${P[2][1]} ${P[3][0]} ${P[3][1]}`;
  const plane = `<path class="trail" d="${flight}" pathLength="1" fill="none" stroke="${t.accent}" stroke-width="1.6" stroke-linecap="round"/>
<circle class="burst" cx="${bx2}" cy="${by2 + CELL / 2}" r="9" fill="none" stroke="${t.good}" stroke-width="2"/>
<g class="plane"><path d="${PLANE}" transform="scale(.9)" fill="${t.accent}" stroke="${t.card}" stroke-width="1.3" stroke-linejoin="round"/></g>`;

  const body = `${card(0, 0, PW, 214)}${card(24 + PW, 0, PW - 1, 214)}${card(0, 230, 959, 118)}${card(0, 364, 959, 190)}
<text x="28" y="38" font-size="15" font-weight="700" fill="${t.accent}">GitHub stats</text>${statRows}
<text x="${L0}" y="38" font-size="15" font-weight="700" fill="${t.accent}">Top languages</text>${segs}${legend}
${streak}
<text x="28" y="396" font-size="15" font-weight="700" fill="${t.accent}">Contributions in the last year</text>${months}${dayLbl}${cells}${call}
<text class="m" x="770" y="${HY + 7 * STEP + 19}" font-size="10" fill="${t.muted}" text-anchor="end">Less</text>${lg}<text class="m" x="${786 + 5 * 16 + 4}" y="${HY + 7 * STEP + 19}" font-size="10" fill="${t.muted}">More</text>
${plane}
`;
  return svg(960, 556, t, `<title>GitHub stats of ${esc(LOGIN)}: contributions, streaks, top languages and a year of activity</title>${body}`, css);
}

for (const n of ["dark", "light"]) {
  writeFileSync(`assets/stats-${n}.svg`, render(n));
  writeFileSync(`assets/board-${n}.svg`, board(n, pushes));
}
console.log("stats:", `${cc.contributionCalendar.totalContributions} contributions | streak ${cur}/${longest.n} | busiest ${busiest.date} ${busiest.contributionCount} | stars ${stars} | langs ${top.map(([n]) => n).join(",")} | pushes ${pushes.length}`);
