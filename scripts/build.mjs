import { writeFileSync, mkdirSync } from "node:fs";
import { banner } from "./banner.mjs";
import { card, projects } from "./cards.mjs";
import { timeline } from "./timeline.mjs";
import { stack } from "./stack.mjs";
import { roles } from "./roles.mjs";
import { whoami } from "./whoami.mjs";
import { contact, button } from "./contact.mjs";

mkdirSync("assets/cards", { recursive: true });
const btns = [["site", "ghanizulhusni.com", true], ["linkedin", "LinkedIn", false], ["instagram", "Instagram", false]];
for (const n of ["dark", "light"]) {
  writeFileSync(`assets/banner-${n}.svg`, banner(n));
  writeFileSync(`assets/timeline-${n}.svg`, timeline(n));
  writeFileSync(`assets/stack-${n}.svg`, stack(n));
  writeFileSync(`assets/roles-${n}.svg`, roles(n));
  for (const l of ["en", "id"]) {
    writeFileSync(`assets/whoami-${l}-${n}.svg`, whoami(n, l));
    writeFileSync(`assets/contact-${l}-${n}.svg`, contact(n, l));
  }
  for (const [k, label, primary] of btns) writeFileSync(`assets/btn-${k}-${n}.svg`, button(n, label, primary).svg);
  for (const p of projects) writeFileSync(`assets/cards/${p.id}-${n}.svg`, card(p, n));
}
console.log("aset statis dibuat");
