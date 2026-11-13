/* data-loader.js — Armory: fetch Data/*.js → eval ให้ตัวแปรลง window → เรียก armory.js
   (กลไกเดียวกับ Gear-Simulator/data-loader.js) */
(function () {
  "use strict";

  /* [src, ชื่อตัวแปรที่ต้อง expose เป็น window.*] */
  const FILES = [
    ["../../Data/items.js", "ITEM_DATA"],
    ["../../Data/affixes.js", "AFFIX_DATA"],
    ["../../Data/inscriptions.js", "INSCRIPTION_DATA"],
    ["../../Data/sets.js", "SET_DATA"],
    ["../../Data/jobgear.js", "JOB_GEAR"],
  ];

  window.BT_DATA_READY = (async () => {
    for (const [src, varName] of FILES) {
      const code = await fetch(src).then((r) => {
        if (!r.ok) throw new Error(src + " HTTP " + r.status);
        return r.text();
      });
      try {
        window[varName] = new Function(
          "window",
          code +
            "\nreturn typeof " + varName + ' !== "undefined" ? ' + varName + " : undefined;",
        )(window);
      } catch (e) {
        console.warn("loader:", src, e.message);
      }
    }

    /* โหลด _common.js + item-affixes.js (ไฟล์ปกติที่อ้าง window.* ตรงๆ) */
    for (const extra of ["../../Data/_common.js", "../../Data/item-affixes.js"]) {
      await new Promise((res) => {
        const s = document.createElement("script");
        s.src = extra;
        s.onload = res;
        s.onerror = () => {
          console.warn("load fail:", extra);
          res();
        };
        document.body.appendChild(s);
      });
    }

    /* สุดท้าย: armory.js */
    await new Promise((res) => {
      const s = document.createElement("script");
      s.src = "armory.js";
      s.onload = res;
      s.onerror = res;
      document.body.appendChild(s);
    });
    return window;
  })();
})();
