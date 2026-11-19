import { esc, svg, themes } from "./theme.mjs";

const data = {
  en: [["XVIII", "GEMASTIK XVIII", "National finalist · 2025", "Team OTW JUARAA, Software Development", ["#fde68a", "#d97706"]],
       ["15", "IFEST Unpad", "Hackathon top 15 · 2026", "National finals, Universitas Padjadjaran", ["#e5e7eb", "#6b7280"]],
       ["3M", "Staff of the 3 Months", "KMTEDI UGM · 2025", "For improving EatsTedi, the canteen app", ["#fdba74", "#c2410c"]]],
  id: [["XVIII", "GEMASTIK XVIII", "Finalis nasional · 2025", "Tim OTW JUARAA, Pengembangan Perangkat Lunak", ["#fde68a", "#d97706"]],
       ["15", "IFEST Unpad", "Hackathon 15 besar · 2026", "Final nasional, Universitas Padjadjaran", ["#e5e7eb", "#6b7280"]],
       ["3M", "Staff of the 3 Months", "KMTEDI UGM · 2025", "Atas perbaikan EatsTedi, aplikasi kantin", ["#fdba74", "#c2410c"]]],
};

export function pins(name, lang) {
  const t = themes[name];
  const css = `@keyframes shine{from{transform:translateX(-60px) skewX(-20deg)}to{transform:translateX(70px) skewX(-20deg)}}
.sh{animation:shine 3.6s ease-in-out infinite}
@keyframes bob{50%{transform:translateY(-3px)}}.pin{animation:bob 4.5s ease-in-out infinite}`;
  const body = data[lang].map(([glyph, title, sub, desc, [hi, lo]], i) => {
    const cx = 60 + i * 318, cy = 82, d = (0.2 + i * 0.2).toFixed(1);
    return `<g style="animation:appear .5s ${d}s ease-out both">
<defs><linearGradient id="m${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${hi}"/><stop offset="1" stop-color="${lo}"/></linearGradient>
<clipPath id="k${i}"><circle cx="${cx}" cy="${cy}" r="35"/></clipPath></defs>
<ellipse cx="${cx}" cy="${cy + 52}" rx="30" ry="5" fill="${t.fg}" opacity=".10"/>
<g class="pin" style="animation-delay:${i * 0.7}s">
<circle cx="${cx}" cy="${cy}" r="42" fill="url(#m${i})"/>
<circle cx="${cx}" cy="${cy}" r="35" fill="${t.accent}"/>
<circle cx="${cx}" cy="${cy}" r="35" fill="none" stroke="#fff" stroke-opacity=".35" stroke-width="1.5" stroke-dasharray="2 4"/>
<text x="${cx}" y="${cy + (glyph.length > 2 ? 8 : 12)}" font-size="${glyph.length > 2 ? 22 : 30}" font-weight="800" fill="${t.on}" text-anchor="middle" letter-spacing="-.5">${esc(glyph)}</text>
<g clip-path="url(#k${i})"><rect class="sh" style="animation-delay:${i * 0.9}s" x="${cx - 8}" y="${cy - 40}" width="14" height="80" fill="#fff" opacity=".35"/></g></g>
<text x="${cx + 56}" y="${cy - 14}" font-size="15" font-weight="700" fill="${t.fg}">${esc(title)}</text>
<text class="m" x="${cx + 56}" y="${cy + 6}" font-size="11" fill="${t.accent}">${esc(sub)}</text>
<text x="${cx + 56}" y="${cy + 26}" font-size="11.5" fill="${t.muted}">${esc(desc.length > 34 ? desc.slice(0, desc.lastIndexOf(" ", 34)) : desc)}</text>
${desc.length > 34 ? `<text x="${cx + 56}" y="${cy + 42}" font-size="11.5" fill="${t.muted}">${esc(desc.slice(desc.lastIndexOf(" ", 34) + 1))}</text>` : ""}</g>`;
  }).join("\n");
  return svg(960, 170, t, `<title>${esc(data[lang].map((p) => p[1]).join(", "))}</title>
<rect x=".5" y=".5" width="959" height="169" rx="16" fill="${t.card}" stroke="${t.line}"/>${body}`, css);
}
