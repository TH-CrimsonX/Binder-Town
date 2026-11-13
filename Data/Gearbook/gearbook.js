/* Region Gearbook — ชุดประจำภูมิภาค · ข้อมูลจาก wiki.bindertowngame.com */
"use strict";
/* ใช้ helpers จาก Data/_common.js ($, el, toast) — ห้ามประกาศ const ซ้ำ */

window.addEventListener("DOMContentLoaded", async () => {
  if (typeof window.BT_DATA_READY === "undefined") { setTimeout(() => location.reload(), 400); return; }
  try { await window.BT_DATA_READY; } catch {}
  /* รอตัวแปรจริง (loader assign เป็นขั้นตอน async) */
  let wait = 0;
  while (wait < 100 && !(window.SET_DATA && window.SET_DATA.sets)) {
    await new Promise((r) => setTimeout(r, 60));
    wait++;
  }
  {
    const box = $("#sets-list");
    box.innerHTML = "";
    for (const set of REGION_SETS.length ? REGION_SETS : window.SET_DATA.sets) {
      const card = window.el("article", "bag-card");
      const regions = window.SET_DATA.regions || {};
      const region =
        typeof set.reg === "string" && regions[set.reg] && regions[set.reg].n
          ? regions[set.reg].n
          : typeof regions[set.reg] === "string"
            ? regions[set.reg]
            : set.reg;
      card.innerHTML = `
        <div class="bag-head"><b>${set.n}</b><span class="badge">${region}</span></div>
        <p><b>2 ชิ้น:</b> ${set.p2 || "—"}</p>
        <p><b>4 ชิ้น:</b> ${set.p4 || "—"}</p>`;
      box.append(card);
    }
  }
});
