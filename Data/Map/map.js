/* Map — แผนที่ + ลักษณะมอนต่อแมพ · ข้อมูลจาก wiki.bindertowngame.com */
"use strict";

const $ = (s) => document.querySelector(s);
const el = (t, c, h) => {
  const n = document.createElement(t);
  if (c) n.className = c;
  if (h !== undefined) n.innerHTML = h;
  return n;
};
const REGIONS = { A: "Valebrook", B: "Ashford", C: "Stormwall", D: "Sanctum", E: "Tidehaven", SP: "แมพพิเศษ" };

function render() {
  const rg = $("#mp-region").value;
  const box = $("#map-list");
  box.innerHTML = "";
  for (const [rk, r] of Object.entries(MOB_DATA.maps)) {
    if (rg && rk !== rg) continue;
    for (const [mapName, lv] of r.fields) {
      const t = MOB_DATA.threats[mapName] || { traits: [], elems: [] };
      box.append(
        el("article", "map-card", `
          <h4>${mapName}${r.isNew ? ' <span class="trait-pill">ใหม่</span>' : ""}</h4>
          <div class="sub">${REGIONS[rk] || rk} · ${lv} · มอน ${t.count || "—"} ตัว</div>
          <div>${t.traits.map(([n, p]) => `<span class="trait-pill">${n}<small>${p}%</small></span>`).join("")}
              ${t.elems.map(([n, p]) => `<span class="elem-pill${n.startsWith("ต้าน") ? " small" : ""}">${n}<small>${p}%</small></span>`).join("")}</div>`),
      );
    }
  }
}
window.addEventListener("DOMContentLoaded", () => {
  $("#mp-region").innerHTML = '<option value="">ทุกภูมิภาค</option>' +
    Object.entries(REGIONS).map(([k, v]) => `<option value="${k}">${k} · ${v}</option>`).join("");
  $("#mp-region").addEventListener("change", render);
  render();
});
