// Warna dan helper SVG bersama. Palet mengikuti ghanizulhusni.com (indigo + terminal).
export const themes = {
  light: {
    bg: "#fbfbfe", card: "#ffffff", line: "#e2e5f0", grid: "#eef0f8", fg: "#090d16", muted: "#5b6478",
    accent: "#4f46e5", accent2: "#818cf8", soft: "#eef0ff", good: "#10b981", page: "#ffffff", on: "#ffffff",
  },
  dark: {
    bg: "#0d1117", card: "#161b22", line: "#30363d", grid: "#161b22", fg: "#e6edf3", muted: "#8b949e",
    accent: "#818cf8", accent2: "#4f46e5", soft: "#1c2140", good: "#34d399", page: "#0d1117", on: "#0d1117",
  },
};

export const SANS = "system-ui,-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
export const MONO = "ui-monospace,SFMono-Regular,Menlo,Consolas,'Liberation Mono',monospace";

export const esc = (s) => String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Pembungkus SVG: font, kelas teks, dan aturan gerak berkurang dipakai semua aset. */
export function svg(w, h, t, body, css = "") {
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img">
<style>
text{font-family:${SANS}}
.m{font-family:${MONO}}
@keyframes appear{from{opacity:0;transform:translateY(6px)}}
@keyframes blink{50%{opacity:0}}
@keyframes draw{to{stroke-dashoffset:0}}
@keyframes pop{from{opacity:0;transform:scale(.4)}}
${css}
@media (prefers-reduced-motion:reduce){*{animation:none!important}}
</style>
${body}
</svg>
`;
}

/** Monogram GZ 7x7 yang sama dengan situs; palang G berkedip seperti kursor. */
const G = [".#####.", "#.....#", "#......", "#..####", "#.....#", "#.....#", ".#####."];
export function monogram(x, y, cell, color) {
  let out = "";
  G.forEach((row, j) => [...row].forEach((c, i) => {
    if (c !== "#") return;
    const caret = j === 3 && i >= 3;
    out += `<rect x="${x + i * cell}" y="${y + j * cell}" width="${cell}" height="${cell}" fill="${color}"${caret ? ' style="animation:blink 1.2s steps(1) infinite"' : ""}/>`;
  }));
  return out;
}

/** Pesawat kecil menghadap kanan, berpusat di (0,0). */
export const PLANE = "M13 0 L-3 -9 L-1 0 L-3 9 Z M3 -3 L-6 -14 L-8 -14 L-3 -2 Z M3 3 L-6 14 L-8 14 L-3 2 Z";
