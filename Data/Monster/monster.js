/* Monster Codex — มอนทุกตัวจากตัวเกม (MOB_DATA) · ข้อมูลจาก wiki.bindertowngame.com */
"use strict";

const $ = (s) => document.querySelector(s);
const el = (t, c, h) => {
  const n = document.createElement(t);
  if (c) n.className = c;
  if (h !== undefined) n.innerHTML = h;
  return n;
};

const REGIONS = { A: "Valebrook", B: "Ashford", C: "Stormwall", D: "Sanctum", E: "Tidehaven" };
const ROLE_TH = {
  trash: "มอนทั่วไป", elite: "Elite", pack: "ฝูง", tank: "ถึก",
  ambush: "ซุ่มโจมตี", "mini-boss": "Mini-Boss", boss: "Field Boss",
};
const TINT_FILTER = {
  0x89c47c: "sepia(.4) hue-rotate(55deg) saturate(1.3)",
  0x6ec0ff: "sepia(.4) hue-rotate(165deg) saturate(1.4)",
  0xc792ea: "sepia(.4) hue-rotate(225deg) saturate(1.4)",
  0xffc857: "sepia(.5) hue-rotate(-8deg) saturate(1.6)",
  0xff7b72: "sepia(.5) hue-rotate(-35deg) saturate(1.8)",
  0xa98c6b: "sepia(.6) saturate(.9)",
  0xf0f4ff: "saturate(.2) brightness(1.15)",
  0x3a4653: "saturate(.3) brightness(.65)",
};

const state = { search: "", region: "", role: "" };

function mobImg(id, tint) {
  const f = TINT_FILTER[tint];
  return `<img class="mob-img" src="img/mobs/${id}.png" alt="" onerror="this.style.visibility='hidden'"${f ? ` style="filter:${f}"` : ""}>`;
}

function renderList() {
  const box = $("#mob-list");
  box.innerHTML = "";
  const q = state.search.toLowerCase();
  const mobs = Object.entries(MOB_DATA.mobTable)
    .map(([id, d]) => ({ id, ...d }))
    .filter((m) => {
      if (state.region && m.region !== state.region) return false;
      if (state.role && m.role !== state.role) return false;
      if (q && !m.id.toLowerCase().includes(q)) return false;
      return true;
    })
    .sort((a, b) => a.lv - b.lv);
  $("#m-count").textContent = `แสดง ${mobs.length} จาก ${Object.keys(MOB_DATA.mobTable).length} ตัว`;
  for (const m of mobs) {
    const roleCls = { boss: "c-4", "mini-boss": "c-4", elite: "c-3" }[m.role] || "c-0";
    box.append(
      el("article", "bag-card", `
        <div class="bag-head">${mobImg(m.id, m.tint)}<b>${m.id.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase())}</b></div>
        <p>Lv ${m.lv} · ภูมิภาค ${m.region} (${REGIONS[m.region] || m.region})</p>
        <p class="tip-dim">บทบาท: <span class="c-color ${roleCls}">${ROLE_TH[m.role] || m.role}</span></p>`),
    );
  }
}

window.addEventListener("DOMContentLoaded", () => {
  $("#m-region").innerHTML = '<option value="">ทุกภูมิภาค</option>' +
    Object.entries(REGIONS).map(([k, v]) => `<option value="${k}">${k} · ${v}</option>`).join("");
  $("#m-role").innerHTML = '<option value="">ทุกบทบาท</option>' +
    Object.entries(ROLE_TH).map(([k, v]) => `<option value="${k}">${v}</option>`).join("");
  $("#m-search").addEventListener("input", (e) => { state.search = e.target.value; renderList(); });
  $("#m-region").addEventListener("change", (e) => { state.region = e.target.value; renderList(); });
  $("#m-role").addEventListener("change", (e) => { state.role = e.target.value; renderList(); });
  renderList();
});
