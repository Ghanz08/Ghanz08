// Gerak pesawat murni CSS: lintasan disampel per panjang busur menjadi @keyframes (teknik yang sama dengan snk).
// SMIL animateMotion tidak dipakai karena dukungan browsernya bervariasi.

/** Lintasan dari deretan titik; at(f) memberi posisi pada pecahan panjang f (0..1). */
export function track(points) {
  const cum = [0];
  for (let i = 1; i < points.length; i++) cum.push(cum[i - 1] + Math.hypot(points[i][0] - points[i - 1][0], points[i][1] - points[i - 1][1]));
  const total = cum.at(-1);
  const at = (f) => {
    const g = Math.min(1, Math.max(0, f)) * total;
    let n = 1; while (n < points.length - 1 && cum[n] < g) n++;
    const r = (g - cum[n - 1]) / (cum[n] - cum[n - 1] || 1);
    return [points[n - 1][0] + (points[n][0] - points[n - 1][0]) * r, points[n - 1][1] + (points[n][1] - points[n - 1][1]) * r];
  };
  return { total, at };
}

/** Titik-titik kurva Bezier kubik. */
export function bezier(P, steps = 80) {
  return Array.from({ length: steps + 1 }, (_, n) => { const t = n / steps, u = 1 - t; return [0, 1].map((k) => u * u * u * P[0][k] + 3 * u * u * t * P[1][k] + 3 * u * t * t * P[2][k] + t * t * t * P[3][k]); });
}

/**
 * Keyframe posisi + arah hidung. Sudut diurai (tanpa lompatan 359° ke 1°) karena CSS menginterpolasi rotate() secara numerik.
 * ease memetakan waktu ke pecahan lintasan; fade = pecahan awal/akhir waktu untuk memudar masuk/keluar.
 */
export function frames(tr, { K = 120, from = 0, to = 100, ease = (u) => u, fade = [0, 0] } = {}) {
  let prev = null;
  return Array.from({ length: K + 1 }, (_, n) => {
    const u = n / K, f = ease(u), [x, y] = tr.at(f), [ax, ay] = tr.at(f - 0.003), [bx, by] = tr.at(f + 0.003);
    let a = (Math.atan2(by - ay, bx - ax) * 180) / Math.PI;
    if (prev !== null) a += 360 * Math.round((prev - a) / 360);
    prev = a;
    const op = fade[0] && u < fade[0] ? u / fade[0] : fade[1] && u > 1 - fade[1] ? (1 - u) / fade[1] : 1;
    return `${(from + (to - from) * u).toFixed(2)}%{transform:translate(${x.toFixed(1)}px,${y.toFixed(1)}px) rotate(${a.toFixed(1)}deg);opacity:${op.toFixed(2)}}`;
  }).join("");
}
