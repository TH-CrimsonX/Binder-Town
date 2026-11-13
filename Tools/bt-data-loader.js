/* bt-data-loader.js — โหลดข้อมูลเกม (Data/*.js) แบบ fetch+eval แล้ว expose เป็น window.*
   ใช้ร่วมทุกหน้า: <script src=".../Tools/bt-data-loader.js"></script>
   เรียกใช้ window.BT_DATA_READY เพื่อรอข้อมูลพร้อม */
(function () {
  "use strict";

  /* [ไฟล์ใน Data/, ชื่อตัวแปร const/var] */
  const FILES = [
    ["affixes.js", "AFFIX_DATA"],
    ["items.js", "ITEM_DATA"],
    ["inscriptions.js", "INSCRIPTION_DATA"],
    ["sets.js", "SET_DATA"],
    ["jobgear.js", "JOB_GEAR"],
    ["cards.js", "CARD_DATA"],
  ];

  function dataBase() {
    const seg = location.pathname
      .replace(/\\/g, "/")
      .split("/")
      .filter(Boolean);
    /* หน้าอยู่ลึก 2 ชั้น (Tools/X/, Data/X/) → ../../Data/ */
    return "../../Data/";
  }

  window.BT_DATA_READY = (async () => {
    const base = dataBase();
    for (const [file, varName] of FILES) {
      const src = base + file;
      const code = await fetch(src).then((r) => {
        if (!r.ok) throw new Error(src + " HTTP " + r.status);
        return r.text();
      });
      try {
        window[varName] = new Function(
          "window",
          code +
            "\nreturn typeof " +
            varName +
            ' !== "undefined" ? ' +
            varName +
            " : undefined;",
        )(window);
      } catch (e) {
        console.warn("bt-data-loader:", src, e.message);
      }
    }
    return window;
  })();
})();
