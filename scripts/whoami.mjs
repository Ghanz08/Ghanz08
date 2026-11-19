import { esc, svg, themes } from "./theme.mjs";

const data = {
  en: [["exp.years", "4+", "yrs at the keyboard", "and still debugging"],
       ["projects.built", "10+", "projects shipped", "class work to real users"],
       ["gemastik.xviii", "Finalist", "national ICT contest", "GEMASTIK XVIII"],
       ["orgs.joined", "4+", "tech organisations", "building with people"]],
  id: [["exp.years", "4+", "tahun ngoding", "dan masih debugging"],
       ["projects.built", "10+", "proyek rilis", "dari tugas kuliah sampai pengguna nyata"],
       ["gemastik.xviii", "Finalis", "lomba ICT nasional", "GEMASTIK XVIII"],
       ["orgs.joined", "4+", "organisasi teknologi", "membangun bersama orang"]],
};

export function whoami(name, lang) {
  const t = themes[name], cols = data[lang];
  const css = `.cov{animation:type .9s .2s steps(16) both}@keyframes type{to{transform:translateX(130px)}}`;
  const tiles = cols.map(([k, v, label, note], i) => {
    const x = 32 + i * 232;
    return `<g style="animation:appear .5s ${(0.9 + i * 0.15).toFixed(2)}s ease-out both">
${i ? `<line x1="${x - 18}" x2="${x - 18}" y1="62" y2="164" stroke="${t.line}"/>` : ""}
<text class="m" x="${x}" y="72" font-size="10.5" fill="${t.muted}">${esc(k)}</text>
<text x="${x}" y="114" font-size="${v.length > 4 ? 32 : 40}" font-weight="700" fill="${i === 2 ? t.accent : t.fg}" letter-spacing="-1">${esc(v)}</text>
<text x="${x}" y="137" font-size="13" font-weight="700" fill="${t.fg}">${esc(label)}</text>
<text class="m" x="${x}" y="155" font-size="10" fill="${t.muted}">${esc(note)}</text></g>`;
  }).join("");
  const body = `<rect x=".5" y=".5" width="959" height="179" rx="14" fill="${t.card}" stroke="${t.line}"/>
<circle cx="28" cy="26" r="5" fill="#ff5f57"/><circle cx="46" cy="26" r="5" fill="#febc2e"/><circle cx="64" cy="26" r="5" fill="#28c840"/>
<text class="m" x="92" y="30" font-size="12" fill="${t.good}">➜</text>
<text class="m" x="108" y="30" font-size="12" font-weight="700" fill="${t.accent}">~</text>
<text class="m" x="120" y="30" font-size="12" font-weight="700" fill="${t.fg}">$ whoami --stats</text>
<rect class="cov" x="118" y="16" width="130" height="20" fill="${t.card}"/>
<line x1="1" x2="959" y1="46" y2="46" stroke="${t.line}"/>${tiles}`;
  return svg(960, 180, t, `<title>${esc(cols.map((c) => c[1] + " " + c[2]).join(", "))}</title>${body}`, css);
}
