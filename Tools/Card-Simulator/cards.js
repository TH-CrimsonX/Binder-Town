/* หน้าจำลองสมุดการ์ด — ข้อมูลจาก wiki.bindertowngame.com (เทียบตัวเกม ณ 27 ต.ค. 2569) */
"use strict";

const CARD_COLORS = ["Attack", "Guard", "Growth", "Spirit", "Legendary"];
const COLOR_TH = {
  Attack: "Attack · โจมตี",
  Guard: "Guard · ป้องกัน",
  Growth: "Growth · เติบโต",
  Spirit: "Spirit · วิญญาณ",
  Legendary: "Legendary · ตำนาน",
};
const REGION_BY_COST = [
  [3000, "A"], [900, "A"], [180, "A"], [60, "A"],
  [3600, "B"], [1080, "B"], [216, "B"], [65, "B"],
  [4200, "C"], [1260, "C"], [252, "C"], [70, "C"], [75, "C"],
  [4800, "D"], [1440, "D"], [288, "D"], [80, "D"],
  [5400, "E"], [1620, "E"], [324, "E"],
];

const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, html) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html !== undefined) node.innerHTML = html;
  return node;
};
function toast(msg) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast._h);
  toast._h = setTimeout(() => (t.hidden = true), 2600);
}

const state = {
  lv: 1,
  dn: "day",
  slots: new Array(9).fill(null),
  selSlot: 0, /* ช่องที่เลือกไว้ — กด "ใส่" จะลงช่องนี้ */
  search: "",
  color: "",
  load: "",
  region: "",
  kind: "",
  kin: "",
  lvmin: 1,
  lvmax: 115,
};

/* Lv 1 เปิดช่องแรก + cap 4 ให้ทดลองทันที (ช่องจริงเปิดตามเกม) */
function loadCap(lv) {
  let cap = 4, open = 1;
  for (const [l, c] of CARD_DATA.loadCap) {
    if (lv >= l) {
      cap = c;
      open = Math.min(9, CARD_DATA.loadCap.filter(([x]) => lv >= x).length);
    }
  }
  if (lv >= 99) open = 9;
  return { cap, open };
}

function regionOf(card) {
  const hit = REGION_BY_COST.find(([c]) => c === card.cost);
  return hit ? hit[1] : "A";
}

/* รูปมอนของการ์ด (มี tint จากเกม) */
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
function mobImg(card) {
  const f = TINT_FILTER[card.tint];
  return `<img class="mob-img" src="../../Data/Card/img/mobs/${card.id}.svg" alt="" loading="lazy" onerror="this.style.visibility='hidden'"${f ? ` style="filter:${f}"` : ""}>`;
}

/* จำนวนใบที่ใส่ได้ต่อมอนตัวเดิม (Echo): ใบ 1 = 100% · ใบ 2 = 50% · ใบ 3 = 25% · ใบ 4 ขึ้นไป = ไม่มีผล */
function echoCountOf(id) {
  return state.slots.filter((s) => s && s.cardId === id).length;
}
function echoMultOf(n) {
  return n === 1 ? 1 : n === 2 ? 0.5 : n === 3 ? 0.25 : 0;
}

/* ---------- ประเภทมอน + สายมอน (จาก id/ชื่อ) ----------
   ประเภท: Spirit Load ตามเกม — ทั่วไป 1 · Elite 2 · Mini-Boss 3 · Field/World Boss 5 */
const KIND_TH = {
  common: "Monster · มอนทั่วไป",
  elite: "Elite · เอลิท",
  mini: "Mini-Boss · มินิบอส",
  field: "Field Boss · บอสใหญ่",
  world: "World Boss · บอสโลก",
};
function kindOf(c) {
  if (c.load >= 5) return "world";
  if (c.load >= 3) return "mini";
  if (c.load >= 2) return "elite";
  return "common";
}
/* สาย: จับจากคำใน id/ชื่อ — ครอบคลุมทุกสายใน CARD_DATA.resonances.kin */
function kinKeys() {
  try {
    return Object.keys((typeof CARD_DATA !== "undefined" ? CARD_DATA : window.CARD_DATA).resonances.kin);
  } catch {
    return [];
  }
}
function kinOf(c) {
  const hay = (c.id + " " + c.n).toLowerCase();
  for (const k of kinKeys()) {
    const base = k.toLowerCase();
    if (hay.includes(base)) return k;
    if (hay.includes(base + "s") || hay.includes(base.replace(/y$/, "i") + "es")) return k;
  }
  return "";
}

/* ---------- สมุด 9 ช่อง (3×3) — คลิกช่องเพื่อเลือกปลายทาง ---------- */
function renderSlots() {
  const { cap, open } = loadCap(state.lv);
  const used = state.slots.reduce((s, x) => s + (x ? cardLoad(x.cardId) : 0), 0);
  if (state.selSlot >= open) state.selSlot = 0;
  $("#load-info").textContent = `ภาระวิญญาณ (Spirit Load) ใช้ ${used} / ${cap} · เปิดอยู่ ${open} / 9 ช่อง · ช่องที่เลือก: ${state.selSlot + 1}`;

  const box = $("#slots");
  box.innerHTML = "";
  state.slots.forEach((s, i) => {
    const locked = i >= open;
    const slot = document.createElement("div");
    slot.className =
      "card-slot" + (locked ? " locked" : "") + (s ? " filled" : "") + (!locked && i === state.selSlot ? " picked" : "");
    slot.title = locked ? "" : "คลิกเพื่อเลือกช่องนี้";
    if (locked) {
      slot.innerHTML = `<span class="slot-num">${i + 1}</span><span>🔒 เปิดที่ Lv ${CARD_DATA.slotsOpen[i]}</span>`;
    } else if (s) {
      const c = CARD_DATA.cards.find((x) => x.id === s.cardId);
      slot.innerHTML = `
        <span class="slot-num">${i + 1}</span>
        ${mobImg(c)}
        <b>${c.n}</b>
        <span class="kin-dim">สาย ${kinOf(c) || "—"}</span>
        <span class="c-color c-${c.col}">${COLOR_TH[c.col]}</span>
        <span class="c-stars">★${s.stars}</span>
        <span class="c-load">ภาระวิญญาณ ◆${cardLoad(c.id)}</span>
        <div class="slot-actions">
          <label>ดาว <select class="star-sel" data-i="${i}">
            ${[1, 2, 3, 4, 5].map((n) => `<option value="${n}"${n === s.stars ? " selected" : ""}>★${n}</option>`).join("")}
          </select></label>
          <button class="btn ghost slot-remove" data-i="${i}">ถอด</button>
        </div>`;
    } else {
      slot.innerHTML = `<span class="slot-num">${i + 1}</span><span class="slot-empty">${i === state.selSlot ? '✓ ช่องที่เลือก — กด "ใส่" จากด้านล่าง' : "ช่องว่าง"}</span>`;
    }
    if (!locked) slot.addEventListener("click", (e) => {
      if (e.target.closest(".slot-actions")) return; /* ไม่นับคลิกปุ่มถอด/ดาว */
      state.selSlot = i;
      renderSlots();
    });
    box.append(slot);
  });
  document.querySelectorAll(".star-sel").forEach((sel) =>
    sel.addEventListener("change", () => {
      state.slots[+sel.dataset.i].stars = +sel.value;
      renderSlots();
      renderSum();
    }),
  );
  document.querySelectorAll(".slot-remove").forEach((b) =>
    b.addEventListener("click", () => {
      state.slots[+b.dataset.i] = null;
      renderSlots();
      renderSum();
      renderCardList();
    }),
  );
}

function cardLoad(id) {
  const c = CARD_DATA.cards.find((x) => x.id === id);
  return c ? c.load : 0;
}

/* ---------- สรุป (คำนวณดาว + Echo + กลางวัน/กลางคืนจริง) ---------- */
function renderSum() {
  const out = $("#sum-out");
  const filled = state.slots.filter(Boolean);
  out.innerHTML = "";
  if (!filled.length) {
    out.innerHTML = '<p class="empty">ยังไม่ได้ใส่การ์ด — กด "ใส่" จากรายการด้านล่าง</p>';
    return;
  }

  const byId = new Map();
  for (const s of filled) byId.set(s.cardId, (byId.get(s.cardId) || 0) + 1);
  /* นับลำดับใบของแต่ละมอน — ใบแรก 100% ใบที่สอง 50% ใบที่สาม 25% */
  const seq = new Map();

  const list = el("table", "sum-table");
  list.innerHTML = "<thead><tr><th>การ์ด</th><th>ดาว</th><th>ผลที่ได้</th></tr></thead>";
  const tb = el("tbody");
  const totalBy = new Map(); /* id → ผลรวมตัวเลขทุกตัว (ต่อมอนซ้ำ) */
  for (const s of filled) {
    const c = CARD_DATA.cards.find((x) => x.id === s.cardId);
    const n = (seq.get(s.cardId) || 0) + 1;
    seq.set(s.cardId, n);
    const echoN = byId.get(s.cardId);
    const echoMult = echoMultOf(n);
    const dnMult =
      c.dn === "nocturnal" ? (state.dn === "night" ? 1.4 : 0.85) :
      c.dn === "diurnal" ? (state.dn === "day" ? 1.4 : 0.85) : 1;
    const mult = (s.stars / 5) * echoMult * dnMult;
    const fx = c.fx.replace(/(\d+(?:\.\d+)?)(%?)/g, (m, num, pct) => {
      const v = parseFloat(num) * mult;
      const txt = pct ? (v < 1 ? v.toFixed(2) : v.toFixed(1).replace(/\.0$/, "")) : Math.round(v * 10) / 10;
      return txt + pct;
    });
    /* เก็บค่ารวมต่อมอน (ใช้ค่าหลังดาว/Echo แต่ไม่คูณกลางวัน-กลางคืน เพื่อไม่ซ้ำซ้อน) */
    if (echoN > 1) {
      const starMult = (s.stars / 5) * echoMult;
      const nums = [...c.fx.matchAll(/(\d+(?:\.\d+)?)(%?)/g)].map((m) => ({ v: parseFloat(m[1]) * starMult, pct: m[2] }));
      totalBy.set(s.cardId, (totalBy.get(s.cardId) || []).concat(nums));
    }
    const tag = n > 1 ? ` <span class="badge">Echo ใบที่ ${n} (${Math.round(echoMult * 100)}%)</span>` : "";
    const dnTag = dnMult !== 1 ? ` <span class="tip-dim">${dnMult > 1 ? "✦ โฉลกช่วงเวลา ×1.4" : "ไม่โฉลก ×0.85"}</span>` : "";
    tb.append(el("tr", null, `<td>${c.n}${tag}</td><td>★${s.stars}</td><td class="fx-line">${fx}${dnTag}</td>`));
  }
  /* แถวสรุปรวม — เฉพาะมอนที่ใส่ซ้ำ (ใช้งาน 2 ใบขึ้นไป) */
  for (const [id, nums] of totalBy) {
    const c = cardOf(id);
    const sum = new Map();
    for (const { v, pct } of nums) {
      const key = pct ? "%" : "flat";
      sum.set(key, (sum.get(key) || 0) + v);
    }
    const parts = [];
    if (sum.has("flat")) parts.push(`${Math.round(sum.get("flat") * 10) / 10}`);
    if (sum.has("%")) parts.push(`${(Math.round(sum.get("%") * 100) / 100)}%`);
    const summary = c.fx.replace(/\d+(?:\.\d+)?%?/g, "").trim().replace(/^[+·\s]+/, "") || "รวมผล";
    tb.append(
      el("tr", "sum-row",
        `<td colspan="2"><b>รวม ${c.n} ${echoCountOf(id)} ใบ</b></td><td class="fx-line"><b>${summary}: ${parts.join(" · ")}</b></td>`),
    );
  }
  list.append(tb);
  out.append(list);

  const res = resonanceList(filled);
  if (res.length) {
    const grid = el("div", "sum-grid");
    for (const r of res) grid.append(el("div", "sum-tile", `<b>✦</b><span>${r}</span>`));
    out.append(grid);
  }
}

/* Resonance: Region 3/5 ใบ · Kin 2 ตัว · สีเดียวกัน ★3+ 3 ใบ (Legendary 2) */
function resonanceList(filled) {
  const res = [];
  const uniq = [];
  const seen = new Set();
  for (const s of filled) if (!seen.has(s.cardId)) { seen.add(s.cardId); uniq.push(s); }

  const byRegion = {};
  for (const s of uniq) {
    const r = regionOf(cardOf(s.cardId));
    (byRegion[r] = byRegion[r] || []).push(s);
  }
  for (const [r, arr] of Object.entries(byRegion)) {
    const rd = CARD_DATA.resonances.region[r];
    if (arr.length >= 3) res.push(`ภูมิภาค ${CARD_DATA.regions[r]} I (${arr.length} ใบ) — ${rd.i}`);
    if (arr.length >= 5) res.push(`ภูมิภาค ${CARD_DATA.regions[r]} II — ${rd.ii}`);
  }

  const byKin = {};
  for (const s of uniq) {
    const k = cardOf(s.cardId).kin;
    if (k && CARD_DATA.resonances.kin[k]) (byKin[k] = byKin[k] || []).push(s);
  }
  for (const [k, arr] of Object.entries(byKin)) {
    if (arr.length >= 2) res.push(`สาย ${k} (${arr.length} ตัว) — ${CARD_DATA.resonances.kin[k]}`);
  }

  const byColor = {};
  for (const s of uniq) {
    const c = cardOf(s.cardId);
    if (s.stars >= 3) (byColor[c.col] = byColor[c.col] || []).push(s);
  }
  for (const [col, arr] of Object.entries(byColor)) {
    const need = col === "Legendary" ? 2 : 3;
    if (arr.length >= need) res.push(`${COLOR_TH[col]} — ${CARD_DATA.resonances.color[col]}`);
  }
  return res;
}

function cardOf(id) { return CARD_DATA.cards.find((x) => x.id === id); }

/* ---------- รายการค้นหา ---------- */
function renderFilters() {
  const csel = $("#c-color");
  csel.innerHTML = '<option value="">สี: ทั้งหมด</option>' +
    CARD_COLORS.map((c) => `<option value="${c}">${COLOR_TH[c]}</option>`).join("");
  csel.onchange = () => { state.color = csel.value; renderCardList(); };

  const lsel = $("#c-load");
  lsel.innerHTML = '<option value="">Load: ทั้งหมด</option>' +
    [1, 2, 3, 5].map((l) => `<option value="${l}">◆${l}</option>`).join("");
  lsel.onchange = () => { state.load = lsel.value; renderCardList(); };

  const rsel = $("#c-region");
  rsel.innerHTML = '<option value="">ภูมิภาค: ทั้งหมด</option>' +
    Object.entries(CARD_DATA.regions).map(([k, v]) => `<option value="${k}">${k} · ${v}</option>`).join("");
  rsel.onchange = () => { state.region = rsel.value; renderCardList(); };

  const ksel = $("#c-kind");
  ksel.innerHTML = '<option value="">ประเภท: ทั้งหมด</option>' +
    Object.entries(KIND_TH).map(([k, v]) => `<option value="${k}">${v}</option>`).join("");
  ksel.onchange = () => { state.kind = ksel.value; renderCardList(); };

  const kinSel = $("#c-kin");
  const kinList = [...new Set(CARD_DATA.cards.map(kinOf).filter(Boolean))].sort();
  kinSel.innerHTML = '<option value="">สาย: ทั้งหมด</option>' +
    kinList.map((k) => `<option value="${k}">${k}</option>`).join("");
  kinSel.onchange = () => { state.kin = kinSel.value; renderCardList(); };
}

function renderCardList() {
  const box = $("#card-list");
  box.innerHTML = "";
  const q = state.search.toLowerCase();
  const list = CARD_DATA.cards.filter((c) => {
    if (state.color && c.col !== state.color) return false;
    if (state.load && c.load !== +state.load) return false;
    if (state.region && regionOf(c) !== state.region) return false;
    if (state.kind && kindOf(c) !== state.kind) return false;
    if (state.kin && kinOf(c) !== state.kin) return false;
    if (q && !(c.n.toLowerCase().includes(q) || c.fx.toLowerCase().includes(q))) return false;
    return true;
  });
  $("#c-count").textContent = `พบ ${list.length} / ${CARD_DATA.cards.length} ใบ · ค่าการ์ดตามตัวเกม ณ 27 ต.ค. 2569 — อ้างอิงจาก Binder Town Wiki`;

  const { cap } = loadCap(state.lv);

  for (const c of list) {
    const card = el("article", "bag-card card-item");
    const count = echoCountOf(c.id);
    const maxed = count >= 3; /* ใบที่ 4 ไม่มีผล (0%) — ปุ่มเทา */
    const echoTxt = count === 0 ? "" : ` <span class="badge">ในสมุด ×${count}</span>`;
    const nextTxt = maxed
      ? `<span class="tip-dim">ใบที่ 4 ขึ้นไปไม่มีผล (0%)</span>`
      : ` <span class="tip-dim">ใบถัดไป ×${Math.round(echoMultOf(count + 1) * 100)}%</span>`;
    card.innerHTML = `
      <div class="bag-head">
        ${mobImg(c)}
        <div class="bag-title">
          <b>${c.n}${echoTxt}</b>
          <span class="kin-dim">สาย ${kinOf(c) || "—"}</span>
        </div>
        <span class="c-color c-${c.col}">${COLOR_TH[c.col]}</span>
      </div>
      <p><span class="fx-line">${c.fx}</span>${nextTxt}</p>
      <p class="p-load">ภาระวิญญาณ ◆${c.load} · ประเภท ${KIND_TH[kindOf(c)].split(" · ")[0]}</p>
      <p class="p-load2">ภูมิภาค ${regionOf(c)} · ${CARD_DATA.regions[regionOf(c)]} · แลก ${c.cost.toLocaleString()} ดวง · ${c.dn === "nocturnal" ? "☾ กลางคืน" : "☀ กลางวัน"}</p>
      <p class="p-kin">Resonance: ${resText(c)}</p>
      <button class="btn bag-add" ${maxed ? "disabled" : ""}>${maxed ? "✓ ครบ 3 ใบ (Echo หมดผล)" : "＋ ใส่"}</button>`;
    if (!maxed) card.querySelector(".bag-add").addEventListener("click", () => addCard(c.id));
    box.append(card);
  }
}

function resText(c) {
  const parts = [];
  const r = regionOf(c);
  const rd = CARD_DATA.resonances.region[r];
  if (rd) parts.push(`${rd.n} (ภูมิภาค)`);
  if (c.kin && CARD_DATA.resonances.kin[c.kin]) parts.push(CARD_DATA.resonances.kin[c.kin].split(" — ")[0]);
  parts.push(CARD_DATA.resonances.color[c.col].split(" (")[0]);
  return parts.join(" · ");
}

function addCard(id) {
  const { cap, open } = loadCap(state.lv);
  const used = state.slots.reduce((s, x) => s + (x ? cardLoad(x.cardId) : 0), 0);
  const c = cardOf(id);
  if (used + c.load > cap) {
    toast(`ภาระวิญญาณไม่พอ — ใช้ ${used} / ${cap} · การ์ดนี้ ◆${c.load}`);
    return;
  }
  /* ลงช่องที่เลือกก่อน — ถ้าช่องนั้นมีการ์ดอยู่/ล็อก หาช่องว่างถัดไป */
  let idx = state.selSlot < open && !state.slots[state.selSlot] ? state.selSlot : -1;
  if (idx === -1) idx = state.slots.findIndex((s, i) => !s && i < open);
  if (idx === -1) { toast("ช่องเต็มแล้ว — เลื่อนเลเวลขึ้นเพื่อเปิดช่องเพิ่ม"); return; }
  state.slots[idx] = { cardId: id, stars: 5 };
  /* เลื่อนช่องที่เลือกไปช่องว่างถัดไปอัตโนมัติ */
  const next = state.slots.findIndex((s, i) => !s && i < open);
  if (next !== -1) state.selSlot = next;
  renderSlots();
  renderSum();
  renderCardList();
  toast(`ใส่ ${c.n} ลงช่องที่ ${idx + 1} แล้ว`);
}

/* ---------- INIT ---------- */
function init() {
  if (window.__cardInit) return;
  window.__cardInit = true;
  $("#char-lv").addEventListener("input", (e) => {
    state.lv = Math.min(115, Math.max(1, +e.target.value || 1));
    renderSlots(); renderCardList(); renderSum();
  });
  $("#daynight").addEventListener("change", (e) => { state.dn = e.target.value; renderSum(); });
  $("#btn-reset").addEventListener("click", () => {
    state.slots = new Array(9).fill(null);
    renderSlots(); renderSum(); renderCardList();
    toast("ล้างสมุดการ์ดแล้ว");
  });
  $("#c-search").addEventListener("input", (e) => { state.search = e.target.value; renderCardList(); });

  renderFilters();
  renderSlots();
  renderSum();
  renderCardList();
}

if (document.readyState === "loading") window.addEventListener("DOMContentLoaded", init);
else init();
