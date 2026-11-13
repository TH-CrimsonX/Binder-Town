/* Binder Town — sidebar ร่วมของทุกหน้า (หุบ/กางได้)
   ใช้: <script src=".../nav.js"></script> + <div id="bt-sidebar"></div>
   ระบบจะฉีด sidebar + ส่วนหัวหน้า + footer ให้เอง */
(function () {
  "use strict";

  /* ลำดับเมนูมาตรฐาน */
  const W = "https://wiki.bindertowngame.com/img/";
  const ICONS = {
    armory: W + "item/iron_sword.png",
    gearbook: W + "item/buckler.png",
    glossary: W + "item/exp_scroll.png",
    smith: W + "item/repair_kit.png",
    cardcodex: W + "item/spirit_card.png",
    monstercodex: W + "mob/brute.png",
    map: W + "ui/world_atlas.png",
    patch: W + "item/star_shard.png",
    build: W + "item/mithril_ore.png",
    gearsim: W + "item/copper_ore.png",
    cardsim: W + "item/loose_spirit.png",
    boss: W + "mob/vale_keeper.png",
  };
  const MENU = {
    data: [
      ["armory", "Armory", "คลังแสง"],
      ["gearbook", "Region Gearbook", "ชุดภูมิภาค"],
      ["glossary", "Glossary", "อภิธานศัพท์"],
      ["smith", "Smith", "ช่างตีเหล็ก"],
      ["cardcodex", "Card Codex", "ตำราการ์ด"],
      ["monstercodex", "Monster Codex", "ข้อมูลมอนสเตอร์"],
      ["map", "Map", "แผนที่"],
      ["patch", "Patch Note", "บันทึกอัปเดต"],
    ],
    tools: [
      ["build", "Build Simulator", "จำลองการสร้างบิลด์"],
      ["gearsim", "Gear Simulator", "จำลองอุปกรณ์"],
      ["cardsim", "Card Book Simulator", "จำลองสมุดการ์ด"],
      ["boss", "Boss Timer", "ตัวจับเวลาเกิดบอส"],
    ],
  };

  function segs() {
    return location.pathname.replace(/\\/g, "/").split("/").filter(Boolean);
  }
  /* path รากเว็บจากหน้าปัจจุบัน — นับ depth จากจำนวน segment */
  function root() {
    const s = segs();
    const depth = s.filter((x) => !x.includes(".")).length;
    return depth === 0 ? "./" : "../".repeat(depth);
  }
  /* โฟลเดอร์ปลายทางของแต่ละหน้า */
  const PAGES = {
    armory: () => root() + "Data/Armory/index.html",
    gearbook: () => root() + "Data/Gearbook/index.html",
    glossary: () => root() + "Data/Glossary/index.html",
    smith: () => root() + "Data/Smith/index.html",
    cardcodex: () => root() + "Data/Card/index.html",
    monstercodex: () => root() + "Data/Monster/index.html",
    map: () => root() + "Data/Map/index.html",
    patch: () => root() + "Data/Patch/index.html",
    build: () => root() + "Tools/Build-Simulator/index.html",
    gearsim: () => root() + "Tools/Gear-Simulator/index.html",
    cardsim: () => root() + "Tools/Card-Simulator/index.html",
    boss: () => root() + "Tools/Boss-Timer/index.html",
  };

  function currentPage() {
    const p = segs().join("/");
    if (/[Dd]ata\/[Mm]onster/.test(p)) return "monstercodex";
    if (/[Dd]ata\/[Mm]ap/.test(p)) return "map";
    if (/[Dd]ata\/[Cc]ard/.test(p)) return "cardcodex";
    if (/[Dd]ata\/[Aa]rmory/.test(p)) return "armory";
    if (/[Dd]ata\/[Gg]earbook/.test(p)) return "gearbook";
    if (/[Dd]ata\/[Gg]lossary/.test(p)) return "glossary";
    if (/[Dd]ata\/[Ss]mith/.test(p)) return "smith";
    if (/[Dd]ata\/[Pp]atch/.test(p)) return "patch";
    if (/[Tt]ools\/[Bb]uild-[Ss]imulator/.test(p)) return "build";
    if (/[Tt]ools\/[Gg]ear-[Ss]imulator/.test(p)) return "gearsim";
    if (/[Tt]ools\/[Cc]ard-[Ss]imulator/.test(p)) return "cardsim";
    if (/[Tt]ools\/[Bb]oss-[Tt]imer/.test(p)) return "boss";
    return "";
  }

  /* ชื่อหน้า: [อังกฤษ, ไทย] */
  const TITLES = {
    armory: ["Armory", "คลังแสง"],
    gearbook: ["Region Gearbook", "ชุดภูมิภาค"],
    glossary: ["Glossary", "อภิธานศัพท์"],
    smith: ["Smith", "ช่างตีเหล็ก"],
    cardcodex: ["Card Codex", "ตำราการ์ด"],
    monstercodex: ["Monster Codex", "ข้อมูลมอนสเตอร์"],
    map: ["Map", "แผนที่"],
    patch: ["Patch Note", "บันทึกอัปเดต"],
    build: ["Build Simulator", "จำลองการสร้างบิลด์"],
    gearsim: ["Gear Simulator", "จำลองอุปกรณ์"],
    cardsim: ["Card Book Simulator", "จำลองสมุดการ์ด"],
    boss: ["Boss Timer", "ตัวจับเวลาเกิดบอส"],
    home: ["Home", "หน้าแรก"],
  };

  const STYLE = `
:root{--sb-w:264px;--sb-w-collapsed:0px}
#bt-sidebar{position:fixed;top:0;left:0;bottom:0;width:var(--sb-w);z-index:100;display:flex;flex-direction:column;background:rgba(6,15,24,.96);border-right:1px solid rgba(168,190,214,.16);backdrop-filter:blur(14px);transition:transform .25s ease}
#bt-sidebar.hidden{transform:translateX(-100%)}
.bt-sb-head{display:flex;align-items:center;gap:.7rem;padding:1rem 1rem .8rem;border-bottom:1px solid rgba(168,190,214,.14)}
.bt-sb-head img{width:42px;height:42px;border-radius:10px}
.bt-sb-head b{color:#edf4ff;font-size:1.05rem;letter-spacing:.04em}
.bt-sb-head small{display:block;color:#9ab0c6;font-size:.66rem;letter-spacing:.12em;text-transform:uppercase}
.bt-sb-scroll{overflow-y:auto;flex:1;padding:.8rem .7rem 1rem}
.bt-sb-sec{margin:0 0 .6rem;color:#9ab0c6;font-size:.66rem;letter-spacing:.14em;text-transform:uppercase;padding:0 .5rem}
.bt-sb-sec:not(:first-child){margin-top:1rem}
.bt-sb-link{display:flex;align-items:center;gap:.6rem;padding:.55rem .7rem;border-radius:10px;color:#9ab0c6;text-decoration:none;font-size:.92rem}
.bt-sb-link .em{width:1.4rem;text-align:center}
.bt-sb-link:hover{color:#edf4ff;background:rgba(89,208,255,.08)}
.bt-sb-link.here{color:#03131c;background:linear-gradient(135deg,#8ee4ff,#00b1ff);font-weight:700}
.bt-sb-link .th{display:block;font-size:.72rem;font-weight:400;opacity:.85}
.bt-sb-foot{padding:.8rem 1rem;border-top:1px solid rgba(168,190,214,.14);color:#9ab0c6;font-size:.72rem}
.bt-sb-foot a{color:#59d0ff}
#bt-sb-toggle{position:fixed;top:50%;left:var(--sb-w);transform:translate(-50%,-50%);z-index:101;width:2rem;height:3.2rem;border-radius:0 10px 10px 0;border:1px solid rgba(89,208,255,.3);border-left:0;background:rgba(9,18,28,.92);color:#59d0ff;font-size:1rem;cursor:pointer;display:flex;align-items:center;justify-content:center;backdrop-filter:blur(8px);transition:left .25s ease}
#bt-sb-toggle.collapsed{left:0;border-radius:0 10px 10px 0}
#bt-sb-toggle:hover{background:rgba(89,208,255,.12)}
#bt-backdrop{position:fixed;inset:0;z-index:99;background:rgba(1,7,13,.55);opacity:0;pointer-events:none;transition:opacity .2s}
#bt-backdrop.show{opacity:1;pointer-events:auto}
/* เนื้อหาเลื่อนขวาเมื่อ sidebar กาง (จอกว้าง) */
@media(min-width:1024px){body.bt-sb-open{padding-left:var(--sb-w)}}
/* ส่วนหัวหน้า */
.bt-page-head{margin:1.4rem 0 0}
.bt-page-head .bt-brand{color:#edf4ff;font-size:clamp(1.6rem,3.5vw,2.2rem);font-weight:700;letter-spacing:.04em;line-height:1.15}
.bt-page-head .bt-title{color:#9ab0c6;font-size:1.02rem;font-weight:500;margin-top:2px}
.bt-page-head .bt-title b{color:#edf4ff}
/* footer */
.bt-footer{display:grid;justify-items:center;gap:8px;width:100%;margin:2rem auto 1.2rem;padding:.8rem 1rem;font-size:.8rem;color:#9ab0c6;background:rgba(7,18,28,.56);border:1px solid rgba(154,176,198,.18);border-radius:12px}
.bt-footer .bt-credits{display:flex;align-items:center;flex-wrap:wrap;justify-content:center;gap:.5rem}
.bt-footer .bt-avatar{width:22px;height:22px;border-radius:50%;object-fit:cover;border:1px solid rgba(154,176,198,.32)}
.bt-footer strong{color:#edf4ff}
.bt-footer a{color:#59d0ff}
`;

  function inject() {
    const head = document.head;
    const st = document.createElement("style");
    st.textContent = STYLE;
    head.append(st);

    /* ตัวอักษรกระชับ (สไตล์วิกิ) */
    const lk = document.createElement("link");
    lk.rel = "stylesheet";
    lk.href = root() + "Tools/compact.css";
    head.append(lk);

    const cur = currentPage();
    /* mount: ใช้ #bt-sidebar ถ้ามี ไม่มีก็สร้างใหม่ติด body */
    let mount = document.getElementById("bt-sidebar");
    if (!mount) {
      mount = document.createElement("div");
      mount.id = "bt-sidebar";
      document.body.prepend(mount);
    }

    /* ปุ่ม toggle + backdrop */
    const toggle = document.createElement("button");
    toggle.id = "bt-sb-toggle";
    toggle.setAttribute("aria-label", "กาง/หุบเมนู");
    toggle.textContent = "◀";
    document.body.prepend(toggle);
    const backdrop = document.createElement("div");
    backdrop.id = "bt-backdrop";
    document.body.prepend(backdrop);

    if (mount) {
      const link = (id, en, th) =>
        `<a class="bt-sb-link${id === cur ? " here" : ""}" href="${PAGES[id]()}"><span class="em"><img src="${ICONS[id]}" alt="" style="width:1.15rem;height:1.15rem;object-fit:contain;vertical-align:-0.22em" loading="lazy"></span><span>${en}<span class="th">${th}</span></span></a>`;
      mount.innerHTML = `
        <div class="bt-sb-head">
          <a href="${root()}index.html" title="กลับหน้าแรก"><img src="https://wiki.bindertowngame.com/img/ui/logo.png" alt="หน้าแรก" /></a>
          <div><small>Binder Town</small><a href="${root()}index.html" style="color:#edf4ff;text-decoration:none;font-weight:700;font-size:1.05rem">Tools &amp; Data</a></div>
        </div>
        <div class="bt-sb-scroll">
          <p class="bt-sb-sec">Data · ข้อมูลเกม</p>
          ${MENU.data.map((x) => link(...x)).join("")}
          <p class="bt-sb-sec">Tools · เครื่องมือ</p>
          ${MENU.tools.map((x) => link(...x)).join("")}
        </div>
        <div class="bt-sb-foot">
          <a href="${root()}index.html">🏠 หน้าแรก</a> ·
          <a href="https://wiki.bindertowngame.com/" target="_blank" rel="noopener">Wiki</a> ·
          <a href="https://play.bindertowngame.com/" target="_blank" rel="noopener">เข้าเล่นเกม</a>
        </div>`;
    }

    /* หัวหน้า: "Binder Town" ใหญ่ + หัวข้อหน้า Eng (ไทย) — ข้ามหน้าแรก (มี hero ของตัวเอง) */
    const title = TITLES[cur] || TITLES.home;
    if (cur) {
      const head2 = document.createElement("div");
      head2.className = "bt-page-head";
      head2.innerHTML = `<div class="bt-brand">Binder Town</div><div class="bt-title"><b>${title[0]}</b> (${title[1]})</div>`;
      const main = document.querySelector("main");
      if (main) main.prepend(head2);
    }

    /* footer */
    const foot = document.createElement("footer");
    foot.className = "bt-footer";
    foot.innerHTML = `
      <div class="bt-credits">
        <span>Developed by</span>
        <img class="bt-avatar" src="https://avatars.githubusercontent.com/u/96268091?v=4" alt="CrimsonX avatar" />
        <strong>CrimsonX</strong>
      </div>
      <span>ข้อมูลอ้างอิงจาก <a href="https://wiki.bindertowngame.com/" target="_blank" rel="noopener">Binder Town Wiki</a> · เข้าเล่นเกมที่ <a href="https://play.bindertowngame.com/" target="_blank" rel="noopener">play.bindertowngame.com</a></span>`;
    document.body.append(foot);

    /* พฤติกรรมหุบ/กาง */
    const wide = () => window.innerWidth >= 1024;
    const setOpen = (open) => {
      document.body.classList.toggle("bt-sb-open", open);
      mount?.classList.toggle("hidden", !open);
      toggle.classList.toggle("collapsed", !open);
      backdrop.classList.toggle("show", open && !wide());
      toggle.textContent = open ? "◀" : "▶";
      try {
        localStorage.setItem("bt-sb-open", open ? "1" : "0");
      } catch {}
    };
    let open = wide();
    try {
      open =
        localStorage.getItem("bt-sb-open") === "1" ||
        (localStorage.getItem("bt-sb-open") === null && wide());
    } catch {}
    setOpen(open);
    toggle.addEventListener("click", () =>
      setOpen(!document.body.classList.contains("bt-sb-open")),
    );
    backdrop.addEventListener("click", () => setOpen(false));
    window.addEventListener("resize", () => {
      if (wide()) backdrop.classList.remove("show");
    });
  }

  if (document.readyState === "loading")
    document.addEventListener("DOMContentLoaded", inject);
  else inject();
})();
