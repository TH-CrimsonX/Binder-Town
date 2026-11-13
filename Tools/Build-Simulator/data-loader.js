/* โหลดไฟล์ข้อมูลเกมแบบ dynamic — หน้าอยู่ที่ /Tools/Build-Simulator/ → ../../data/ */
(function () {
  "use strict";

  const FILES = ["affixes.js", "items.js", "inscriptions.js", "sets.js", "cards.js"];

  function dataBase() {
    const seg = location.pathname.replace(/\\/g, "/").split("/").filter(Boolean);
    if (seg[seg.length - 2] === "Build-Simulator") return "../../Data/";
    return "./data/";
  }

  window.BT_DATA_READY = Promise.all(
    FILES.map((f) =>
      fetch(dataBase() + f)
        .then((r) => {
          if (!r.ok) throw new Error(f + " HTTP " + r.status);
          return r.text();
        })
        .then((code) => {
          const m = code.match(/const\s+([A-Z_]+)\s*=/);
          const name = m && m[1];
          const value = new Function(code + `return ${name};`)();
          window[name] = value;
          return value;
        }),
    ),
  );
})();
