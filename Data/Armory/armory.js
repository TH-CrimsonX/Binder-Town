/* Armory — ตารางจาก wiki /items/gear + panel รายละเอียดครึ่งขวา */
"use strict";

const SLOT_FILTERS = [["", "ทุกส่วน"], ...SLOTS];
let currentRows = [];
let selectedId = null;
let tierSel = ""; // "" = ทุก tier

function renderSlotFilter() {
  const sel = $("#f-slot");
  sel.innerHTML = "";
  for (const [id, label] of SLOT_FILTERS) {
    const opt = el("option", null, label);
    opt.value = id;
    sel.append(opt);
  }
}

function renderWtypeFilter() {
  const sel = $("#f-wtype");
  sel.innerHTML = '<option value="">ประเภท: ทั้งหมด</option>';
  const types = [...new Set(ITEMS.map((i) => i.type).filter(Boolean))].sort();
  for (const t of types) {
    const opt = el("option", null, window.WTYPE_TH[t] || t);
    opt.value = t;
    sel.append(opt);
  }
}

function jobCanUse(jobCode, item) {
  const G = window.JOB_GEAR || {};
  const lbl = (JOB_CODES.find(([c]) => c === jobCode) || [])[1] || jobCode;
  const cfg = G[jobCode] || G[lbl.toLowerCase()];
  if (!cfg) return true;
  const t = (item.type || "").toLowerCase();
  const list = ["weapon", "offhand"].includes(item.slot) ? cfg.weapon : cfg.armor;
  if (!list) return true;
  return list.some((w) => t.includes(w) || w.includes(t));
}

function readFilters() {
  return {
    slot: $("#f-slot").value,
    wtype: $("#f-wtype").value,
    job: $("#f-job").value,
    lvMin: Number($("#f-lvmin").value) || 1,
    lvMax: Number($("#f-lvmax").value) || 115,
    q: $("#f-search").value.trim().toLowerCase(),
  };
}

function renderTierChips() {
  const tiers = [...new Set(ITEMS.map((i) => i.tier).filter(Boolean))].sort((a, b) => a - b);
  const row = $("#f-tier-row");
  row.querySelectorAll(".tier-chip").forEach((n) => n.remove());
  const mk = (val, label) => {
    const b = el("button", "tier-chip" + (tierSel === val ? " on" : ""), label);
    b.type = "button";
    b.addEventListener("click", () => {
      tierSel = tierSel === val ? "" : val;
      renderTierChips();
      renderRows();
    });
    row.append(b);
  };
  mk("", "ทั้งหมด");
  for (const t of tiers) mk(String(t), `T${t}`);
}

function renderRows() {
  const f = readFilters();
  const rows = ITEMS.filter(
    (i) =>
      (!f.slot || i.slot === f.slot) &&
      (!f.wtype || i.type === f.wtype) &&
      (!f.job || jobCanUse(f.job, i)) &&
      (!tierSel || String(i.tier) === tierSel) &&
      i.lv >= f.lvMin &&
      i.lv <= f.lvMax &&
      (!f.q ||
        i.name.toLowerCase().includes(f.q) ||
        (i.type || "").toLowerCase().includes(f.q)),
  );
  rows.sort(
    (a, b) => a.slot.localeCompare(b.slot) || a.lv - b.lv || a.name.localeCompare(b.name, "th"),
  );
  currentRows = rows;
  const tbody = $("#item-table tbody");
  tbody.innerHTML = "";
  for (const i of rows) {
    const tr = el("tr", null, "");
    tr.dataset.id = i.id;
    tr.innerHTML = `<td class="name"><img class="iticon" src="../../Tools/Gear-Simulator/img/${itemIcon(i)}.png" alt="" loading="lazy" onerror="this.src=window.BT_ICON_FALLBACK('${i.type || "item"}')"> ${i.name}</td><td>${SLOT_TH[i.slot] || i.slot}</td><td>${window.WTYPE_TH[i.type] || i.type || "—"}</td><td class="num">${i.lv}</td><td class="num">ขั้น ${i.tier}</td><td class="num">${i.atk || "—"}</td><td class="num">${i.matk || "—"}</td><td class="num">${i.def || "—"}</td>`;
    tbody.append(tr);
  }
  $("#items-count").textContent = `แสดง ${rows.length} / ${ITEMS.length} ชิ้น · คลิกแถวเพื่อดูรายละเอียด`;
  tbody.querySelectorAll("tr").forEach((tr) => {
    tr.addEventListener("click", () => {
      tbody.querySelectorAll("tr").forEach((x) => x.classList.remove("sel"));
      tr.classList.add("sel");
      showDetail(tr.dataset.id);
    });
  });
}

/* ---------- panel ครึ่งขวา ---------- */
function showDetail(id) {
  if (selectedId === id) return;
  selectedId = id;
  const item = ITEMS.find((i) => i.id === id);
  const panel = $("#detail-panel");
  if (!item) { panel.innerHTML = '<p class="empty">ไม่พบข้อมูล</p>'; return; }

  /* affix จาก ITEM_AFFIXES (key = family_tier) */
  const affKey = `${item.type}_t${item.tier}`;
  const aff = (window.ITEM_AFFIXES || {})[affKey];

  let h = `<div class="d-head"><img src="../../Tools/Gear-Simulator/img/${itemIcon(item)}.png" alt="" onerror="this.src=window.BT_ICON_FALLBACK('${item.type || "item"}')"><div><b>${item.name}</b><div class="hint">${SLOT_TH[item.slot] || item.slot} · ${window.WTYPE_TH[item.type] || item.type || ""} · ขั้น ${item.tier} · Lv ${item.lv}</div></div></div>`;

  /* ค่าพลังหลัก */
  h += `<table class="sum-table d-stats"><tbody>`;
  if (item.atk) h += `<tr><td>ATK</td><td class="val">${item.atk}</td></tr>`;
  if (item.matk) h += `<tr><td>MATK</td><td class="val">${item.matk}</td></tr>`;
  if (item.def) h += `<tr><td>DEF</td><td class="val">${item.def}</td></tr>`;
  h += `</tbody></table>`;

  /* Affix ที่สุ่มได้บนชิ้นนี้ */
  h += `<h4>Affix ที่สุ่มได้บนชิ้นนี้</h4>`;
  if (aff && aff.groups && aff.groups.length) {
    for (const g of aff.groups) {
      if (g.title) h += `<div class="d-group">${g.title}</div>`;
      h += `<table class="sum-table d-affix"><thead><tr><th>Affix</th><th>ขั้น</th><th>ค่า</th></tr></thead><tbody>`;
      for (const row of g.affixes) {
        h += `<tr><td>${row[0]}</td><td>${row[1]}</td><td class="val">${row[2]}</td></tr>`;
      }
      h += `</tbody></table>`;
    }
  } else {
    h += `<p class="hint">ไม่มีข้อมูล Affix สำหรับอุปกรณ์ขั้นนี้</p>`;
  }
  panel.innerHTML = h;
}

window.BT_PAGE_INIT = function () {
  renderSlotFilter();
  renderWtypeFilter();
  renderTierChips();
  const jobSel = $("#f-job");
  jobSel.innerHTML = '<option value="">อาชีพ: ทุกอาชีพ</option>' +
    JOB_CODES.map(([c, n]) => `<option value="${c}">${n}</option>`).join("");
  for (const id of ["f-slot", "f-wtype", "f-job", "f-lvmin", "f-lvmax", "f-search"]) {
    $(`#${id}`).addEventListener("change", renderRows);
    $(`#${id}`).addEventListener("input", renderRows);
  }
  $("#f-reset").addEventListener("click", () => {
    $("#f-slot").value = "";
    $("#f-wtype").value = "";
    $("#f-job").value = "";
    $("#f-lvmin").value = 1;
    $("#f-lvmax").value = 115;
    $("#f-search").value = "";
    tierSel = "";
    renderTierChips();
    renderRows();
  });
  renderRows();
};

/* เริ่ม render หลังข้อมูลพร้อม (_common.js เติม ITEMS ใน BT_DATA_READY promise) */
if (window.BT_DATA_READY) {
  window.BT_DATA_READY.then(() => window.BT_PAGE_INIT());
} else {
  window.BT_PAGE_INIT();
}
