import { writeFileSync } from "node:fs";

const pic = (name, alt, extra = 'width="100%"') =>
  `<picture>\n  <source media="(prefers-color-scheme: dark)" srcset="assets/${name}-dark.svg">\n  <source media="(prefers-color-scheme: light)" srcset="assets/${name}-light.svg">\n  <img alt="${alt}" src="assets/${name}-dark.svg" ${extra}>\n</picture>`;

const cards = [
  ["kost3g", "Kost 3g", "https://kost3g.ghanizulhusni.space"],
  ["glideslope", "Glideslope", "https://github.com/Ghanz08/glideslope-app"],
  ["android", "Glideslope Android", "https://github.com/Ghanz08/glideslope-android"],
  ["ted", "Tech Enthusiast Day", "https://techenthusiastday.id"],
  ["sibudaya", "SIBUDAYA", "https://ghanizulhusni.com/projects/sibudaya"],
  ["skybase", "Skybase", "https://ghanizulhusni.com/projects/skybase"],
];
const grid = () => "<table>\n" + [0, 2, 4].map((i) => `  <tr>\n${cards.slice(i, i + 2).map(([n, t, u]) => `    <td width="50%"><a href="${u}">\n${pic("cards/" + n, t)}\n</a></td>`).join("\n")}\n  </tr>`).join("\n") + "\n</table>";

const buttons = [
  ["site", "ghanizulhusni.com", "https://ghanizulhusni.com"],
  ["linkedin", "LinkedIn", "https://www.linkedin.com/in/ghanizulhusni"],
  ["instagram", "Instagram", "https://www.instagram.com/zulhusnibahri_06/"],
];
const btns = () => `<p align="center">\n${buttons.map(([k, l, u]) => `  <a href="${u}">${pic("btn-" + k, l, 'height="48"')}</a>`).join("\n")}\n</p>`;

const T = {
  en: {
    other: "<sub>English | [Bahasa Indonesia](README.id.md)</sub>",
    intro: "I study software engineering at Universitas Gadjah Mada in Yogyakarta and build products end to end: the data model, the API, the interface, the deployment, and an AI model in the loop when it actually earns its place. Registration platforms, inventory systems and mobile apps that real people log into, not demos.",
    act: "Activity", actNote: "Drawn from my public GitHub data by a daily workflow ([`scripts/stats.mjs`](scripts/stats.mjs)). No third-party widgets.",
    ship: "Shipped", shipNote: "Things real people use, or could. Tap a card.",
    path: "Path", stack: "Stack",
    lead: "Leading and teaching", leadNote: "Each lane is an organisation, each bar a role, measured in months. Solid is where I am now.",
    rec: "Recognition",
    recs: ["**GEMASTIK XVIII finalist** (2025): national finals of Indonesia's largest student ICT competition, Software Development division, with team OTW JUARAA.",
      "**IFEST Unpad hackathon, top 15** (2026): national finals.",
      "**Staff of the 3 Months** (2025): KMTEDI UGM, for improving EatsTedi, the internal canteen app."],
    foot: "Every graphic here is hand-built SVG that lives in this repo, in light and dark. Source in <a href=\"scripts/\"><code>scripts/</code></a>.",
  },
  id: {
    other: "<sub>[English](README.md) | Bahasa Indonesia</sub>",
    intro: "Saya kuliah Teknologi Rekayasa Perangkat Lunak di Universitas Gadjah Mada, Yogyakarta, dan membangun produk dari ujung ke ujung: model data, API, antarmuka, deployment, plus model AI bila memang layak dipakai. Platform pendaftaran, sistem inventori, dan aplikasi mobile yang dipakai orang sungguhan, bukan sekadar demo.",
    act: "Aktivitas", actNote: "Digambar dari data GitHub publik saya oleh workflow harian ([`scripts/stats.mjs`](scripts/stats.mjs)). Tanpa widget pihak ketiga.",
    ship: "Karya", shipNote: "Yang dipakai orang sungguhan, atau bisa dipakai. Ketuk kartunya.",
    path: "Perjalanan", stack: "Stack",
    lead: "Memimpin dan mengajar", leadNote: "Satu lajur satu organisasi, satu batang satu peran, dihitung per bulan. Yang pekat adalah peran saya sekarang.",
    rec: "Penghargaan",
    recs: ["**Finalis GEMASTIK XVIII** (2025): final nasional kompetisi ICT mahasiswa terbesar di Indonesia, divisi Pengembangan Perangkat Lunak, bersama tim OTW JUARAA.",
      "**Hackathon IFEST Unpad, 15 besar** (2026): final nasional.",
      "**Staff of the 3 Months** (2025): KMTEDI UGM, atas perbaikan EatsTedi, aplikasi kantin internal."],
    foot: "Semua grafik di sini adalah SVG buatan tangan yang tersimpan di repo ini, dalam mode terang dan gelap. Sumbernya di <a href=\"scripts/\"><code>scripts/</code></a>.",
  },
};

for (const lang of ["en", "id"]) {
  const d = T[lang], sfx = lang;
  const md = `${pic("banner", "Ghani Zulhusni Bahri, software engineer: I turn messy workflows into dependable apps")}

${d.other}

${d.intro}

${pic("whoami-" + sfx, "4+ years coding, 10+ projects shipped, GEMASTIK XVIII finalist, 4+ tech organisations")}

### ${d.act}

${pic("stats", "GitHub activity: contributions, repositories and languages")}

<sub>${d.actNote}</sub>

### ${d.ship}

${d.shipNote}

${grid()}

### ${d.path}

${pic("timeline", "Timeline from 2021 to now")}

### ${d.stack}

${pic("stack", "Languages, frameworks, data and infrastructure I work with")}

### ${d.lead}

${pic("roles", "Roles by organisation from 2024 to 2026")}

<sub>${d.leadNote}</sub>

### ${d.rec}

${d.recs.map((x) => "- " + x).join("\n")}

<br>

${pic("contact-" + sfx, "Got a messy workflow? Let's make it dependable.")}

${btns()}

<p align="center"><sub>${d.foot}</sub></p>
`;
  writeFileSync(lang === "en" ? "README.md" : "README.id.md", md);
}
console.log("README dibuat");
