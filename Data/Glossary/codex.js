/* Mechanics Codex — tier table & rules จาก wiki.bindertowngame.com */
"use strict";
window.addEventListener("DOMContentLoaded", () => {
  if (typeof window.BT_DATA_READY === "undefined") return;
  window.BT_DATA_READY.then(() => {
    const rows = document.querySelector("#tier-rows");
    if (rows && typeof TIERS !== "undefined") {
      for (const t of TIERS)
        rows.insertAdjacentHTML(
          "beforeend",
          `<tr><td><b>ขั้น ${t.t}</b></td><td>Lv ${t.lv}</td></tr>`,
        );
    }
    const odds = document.querySelector("#odds");
    if (odds && typeof maxTierFor !== "undefined") {
      for (let lv = 12; lv <= 99; lv += 6) {
        const t = maxTierFor(lv);
        odds.insertAdjacentHTML(
          "beforeend",
          `<div><b>Lv ${lv}</b><span>สุ่มได้ถึง ขั้น ${Math.max(1, t)} · ${["", "6%", "30%", "50%", "10%", "3%", "1%", ".5%", ".3%"][Math.min(8, t)] || "-"} (ขั้นสูงสุด)</span></div>`,
        );
      }
    }
  });
});
