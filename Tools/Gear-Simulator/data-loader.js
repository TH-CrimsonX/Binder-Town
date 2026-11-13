/* data-loader.js — Gear-Simulator: fetch Data/*.js → expose เป็น window.*
   หน้าอยู่ที่ /Tools/Gear-Simulator/ → ../../Data/ */
(function () {
  "use strict";

  const FILES = [
    "items.js",
    "affixes.js",
    "inscriptions.js",
    "sets.js",
    "jobgear.js",
  ];

  window.BT_DATA_READY = (async () => {
    const base = "../../Data/";
    for (const file of FILES) {
      const src = base + file;
      const code = await fetch(src).then((r) => {
        if (!r.ok) throw new Error(src + " HTTP " + r.status);
        return r.text();
      });
      try {
        const m = code.match(/(?:const|var)\s+([A-Z_]+)\s*=/);
        const name = m && m[1];
        if (!name) continue;
        const val = new Function(
          "window",
          code +
            "\nreturn typeof " +
            name +
            ' !== "undefined" ? ' +
            name +
            " : undefined;",
        )(window);
        if (val !== undefined) window[name] = val;
      } catch (e) {
        console.warn("loader:", src, e.message);
      }
    }
    return window;
  })();
})();
