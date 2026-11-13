/* Smith — ระบบช่างตีเหล็ก · ข้อมูลจาก wiki.bindertowngame.com ณ 30 ต.ค. 2569 */
"use strict";
const $ = (s) => document.querySelector(s);
const el = (t, c, h) => {
  const n = document.createElement(t);
  if (c) n.className = c;
  if (h !== undefined) n.innerHTML = h;
  return n;
};
const FORGE = [
  ["Lv 1–11", "ขั้น 1", "แร่เหล็กธรรมดา ×5 · หินตี ×1", "100%"],
  ["Lv 12–25", "ขั้น 2", "แร่เหล็กธรรมดา ×10 · หินตี ×2", "95%"],
  ["Lv 26–39", "ขั้น 3", "แร่เหล็กดี ×8 · หินตี ×3", "90%"],
  ["Lv 40–54", "ขั้น 4", "แร่เหล็กดี ×12 · หินตี ×4", "85%"],
  ["Lv 55–69", "ขั้น 5", "แร่เหล็กหายาก ×10 · หินตี ×5", "80%"],
  ["Lv 70–81", "ขั้น 6", "แร่เหล็กหายาก ×14 · หินตี ×6", "75%"],
  ["Lv 82–91", "ขั้น 7", "แร่เหล็กตำนาน ×12 · หินตี ×8", "70%"],
  ["Lv 92–115", "ขั้น 8", "แร่เหล็กตำนาน ×16 · หินตี ×10", "65%"],
];
const COST = [
  ["ขั้น 1", "Lv 1", "50", "×1"],
  ["ขั้น 2", "Lv 12", "120", "×2"],
  ["ขั้น 3", "Lv 26", "260", "×3"],
  ["ขั้น 4", "Lv 40", "480", "×4"],
  ["ขั้น 5", "Lv 55", "760", "×5"],
  ["ขั้น 6", "Lv 70", "1,200", "×6"],
  ["ขั้น 7", "Lv 82", "1,800", "×8"],
  ["ขั้น 8", "Lv 92", "2,600", "×10"],
];
window.addEventListener("DOMContentLoaded", () => {
  const fb = $("#forge-body");
  for (const r of FORGE) fb.append(el("tr", null, r.map((x) => `<td>${x}</td>`).join("")));
  const cb = $("#cost-body");
  for (const r of COST) cb.append(el("tr", null, r.map((x) => `<td>${x}</td>`).join("")));
});
