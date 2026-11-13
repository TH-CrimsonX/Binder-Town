/* ตำราการ์ด — ข้อมูลจาก wiki.bindertowngame.com (เทียบตัวเกม ณ 27 ต.ค. 2569) */
"use strict";

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

const $ = (s) => document.querySelector(s);
const el = (t, c, h) => {
  const n = document.createElement(t);
  if (c) n.className = c;
  if (h !== undefined) n.innerHTML = h;
  return n;
};
function toast(msg) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast._h);
  toast._h = setTimeout(() => (t.hidden = true), 2600);
}

function regionOf(card) {
  const hit = REGION_BY_COST.find(([c]) => c === card.cost);
  return hit ? hit[1] : "A";
}

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
  return `<img class="mob-img" src="img/mobs/${card.id}.svg" alt="" loading="lazy" onerror="this.style.visibility='hidden'"${f ? ` style="filter:${f}"` : ""}>`;
}

const state = { search: "", color: "", load: "", region: "" };

function renderCardList() {
  const box = $("#card-list");
  box.innerHTML = "";
  const q = state.search.toLowerCase();
  const list = CARD_DATA.cards.filter((c) => {
    if (state.color && c.col !== state.color) return false;
    if (state.load && c.load !== +state.load) return false;
    if (state.region && regionOf(c) !== state.region) return false;
    if (q && !(c.n.toLowerCase().includes(q) || c.fx.toLowerCase().includes(q))) return false;
    return true;
  });
  $("#c-count").textContent = `แสดง ${list.length} จาก ${CARD_DATA.cards.length} ใบ`;

  for (const c of list) {
    const card = el("article", "bag-card");
    card.innerHTML = `
      <div class="bag-head">
        ${mobImg(c)}
        <b>${c.n}</b>
        <span class="c-color c-${c.col}">${COLOR_TH[c.col]}</span>
      </div>
      <p>Load ◆${c.load} · ภูมิภาค ${regionOf(c)} · ${CARD_DATA.regions[regionOf(c)]} · แลก ${c.cost.toLocaleString()} ดวง</p>
      <p><b>ผล:</b> ${c.fx}</p>
      <p class="tip-dim">สาย ${c.kin || "—"} · ${c.dn === "nocturnal" ? "☾ กลางคืน (×1.4 ตอนกลางคืน)" : "☀ กลางวัน (×1.4 ตอนกลางวัน)"}</p>`;
    box.append(card);
  }
}

function scaleFx(fx, m) {
  return fx.replace(/(\d+(?:\.\d+)?)(%?)/g, (mm, num, pct) => {
    const v = parseFloat(num) * m;
    const txt = pct ? (v < 1 ? v.toFixed(2) : v.toFixed(1).replace(/\.0$/, "")) : Math.round(v * 10) / 10;
    return txt + pct;
  });
}

function renderStars() {
  const tbody = $("#star-body");
  tbody.innerHTML = "";
  const SAMPLES = ["Sprout", "Skitter", "Wisp", "Brute", "Bloom Crowned Stag", "Tempest Kite Empress"];
  for (const name of SAMPLES) {
    const c = CARD_DATA.cards.find((x) => x.n === name);
    if (!c) continue;
    tbody.append(
      el("tr", null,
        `<td>${c.n}</td><td>${scaleFx(c.fx, 0.2)}</td><td>${scaleFx(c.fx, 0.4)}</td><td>${scaleFx(c.fx, 0.6)}</td><td>${scaleFx(c.fx, 0.8)}</td><td>${c.fx}</td>`),
    );
  }
}

function renderResonance() {
  const out = $("#res-out");
  out.innerHTML = "";
  const sec = (title, rows) => {
    const tbl = el("table", "sum-table");
    tbl.innerHTML = `<thead><tr><th style="width:220px">${title}</th><th>ผล</th></tr></thead>`;
    const tb = el("tbody");
    for (const [k, v] of rows) tb.append(el("tr", null, `<td>${k}</td><td>${v}</td>`));
    tbl.append(tb);
    out.append(tbl);
  };
  sec("ภูมิภาค (3 / 5 ใบ)", Object.entries(CARD_DATA.resonances.region).map(([k, v]) => [`${CARD_DATA.regions[k]} — ${v.n}`, `3 ใบ: ${v.i} · 5 ใบ: ${v.ii}`]));
  sec("สายมอน (2 ตัว)", Object.entries(CARD_DATA.resonances.kin));
  sec("สี (★3+ 3 ใบ / Legendary 2 ใบ)", Object.entries(CARD_DATA.resonances.color));
}

window.addEventListener("DOMContentLoaded", () => {
  const csel = $("#c-color");
  csel.innerHTML = '<option value="">สี: ทั้งหมด</option>' +
    Object.entries(COLOR_TH).map(([k, v]) => `<option value="${k}">${v}</option>`).join("");
  csel.onchange = () => { state.color = csel.value; renderCardList(); };

  const lsel = $("#c-load");
  lsel.innerHTML = '<option value="">Load: ทั้งหมด</option>' +
    [1, 2, 3, 5].map((l) => `<option value="${l}">◆${l}</option>`).join("");
  lsel.onchange = () => { state.load = lsel.value; renderCardList(); };

  const rsel = $("#c-region");
  rsel.innerHTML = '<option value="">ภูมิภาค: ทั้งหมด</option>' +
    Object.entries(CARD_DATA.regions).map(([k, v]) => `<option value="${k}">${k} · ${v}</option>`).join("");
  rsel.onchange = () => { state.region = rsel.value; renderCardList(); };

  $("#c-search").addEventListener("input", (e) => { state.search = e.target.value; renderCardList(); });

  renderResonance();
  renderStars();
  renderCardList();
});
