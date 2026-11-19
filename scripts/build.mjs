import { writeFileSync, mkdirSync } from "node:fs";
import { banner } from "./banner.mjs";
import { card, projects } from "./cards.mjs";
import { timeline } from "./timeline.mjs";
import { stack } from "./stack.mjs";

mkdirSync("assets/cards", { recursive: true });
for (const n of ["dark", "light"]) {
  writeFileSync(`assets/banner-${n}.svg`, banner(n));
  writeFileSync(`assets/timeline-${n}.svg`, timeline(n));
  writeFileSync(`assets/stack-${n}.svg`, stack(n));
  for (const p of projects) writeFileSync(`assets/cards/${p.id}-${n}.svg`, card(p, n));
}
console.log("aset statis dibuat");
