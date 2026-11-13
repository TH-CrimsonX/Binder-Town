/* หน้าจำลองอุปกรณ์ — ตัวละครซ้าย + กระเป๋าขวา
   ข้อมูลอ้างอิงจาก wiki.bindertowngame.com (เทียบกับตัวเกม ณ 24 ต.ค. 2569) */
"use strict";

/* ---------- state ของหน้านี้ (ผูกกับ state ร่วม) ---------- */
const state = {
  job: loadSharedState().job || "",
  gender: loadSharedState().gender || "m",
  itemLv: loadSharedState().itemLv || 0,
  slot: loadSharedState().slot || "weapon",
  picks: loadSharedState().picks || {},
  equipped: loadSharedState().equipped || {},
  inscriptions: loadSharedState().inscriptions || [],
  setPieces: loadSharedState().setPieces || {},
  insPick: loadSharedState().insPick || {},
  bagRar: "r",
  bagSlot: loadSharedState().slot || "weapon",
  bagItem: "",
  bagLvMin: 1,
  bagLvMax: 115,
  jobOnly: false,
  bagWtypes: new Set(), // ประเภทที่เลือกกรอง (Filter Buttons)
};

function persist() {
  saveSharedState({
    job: state.job,
    gender: state.gender,
    itemLv: state.itemLv,
    slot: state.slot,
    picks: state.picks,
    equipped: state.equipped,
    inscriptions: state.inscriptions,
    setPieces: state.setPieces,
    insPick: state.insPick,
  });
}

/* ---------- ตำแหน่งช่องสวมใส่แบบเกม ----------
   ซ้าย (บน→ล่าง): หมวก หน้า ปาก สร้อยคอ เกราะ เข็มขัด
   ขวา (บน→ล่าง): อาวุธ มือรอง ประดับ1 ประดับ2 รองเท้า */
const FORGE_LAYOUT = {
  left: [
    ["headgear", "หมวก"],
    ["face", "หน้า"],
    ["mouth", "ปาก"],
    ["necklace", "สร้อยคอ"],
    ["armor", "เกราะ"],
    ["belt", "เข็มขัด"],
  ],
  right: [
    ["weapon", "อาวุธ"],
    ["offhand", "มือรอง"],
    ["acc1", "ประดับ 1"],
    ["acc2", "ประดับ 2"],
    ["boots", "รองเท้า"],
  ],
};

const BAG_TABS = SLOTS;

/* ---------- ไอคอนแทนของแต่ละส่วน ---------- */
function forgeIcon(slot, lv = 1) {
  lv = lv || 1;
  const equippedId = (state.equipped || {})[slot];
  if (equippedId) {
    const eq = ITEMS.find((i) => i.id === equippedId);
    if (eq) return itemIcon(eq);
  }
  const tier = Math.min(8, Math.max(1, Math.ceil(lv / 12.4)));
  const cands = ITEMS.filter((i) => i.slot === slot && !i.unique);
  if (!cands.length) return null;
  const best = cands.sort(
    (a, b) => Math.abs(a.lv - lv) - Math.abs(b.lv - lv),
  )[0];
  return `${best.type || best.id.replace(/_lv\d+$/, "")}_t${tier >= 9 ? 10 : 9}`;
}

/* ---------- ตัวละคร ---------- */
function renderChar() {
  const name = $("#build-name").value.trim() || "ชุดของฉัน";
  $("#cv-name").textContent = name;
  const jobLabel = JOB_CODES.find(([c]) => c === state.job)?.[1];
  $("#cv-sub").textContent = jobLabel
    ? `${jobLabel} · Lv ${state.itemLv}`
    : `ไม่ระบุอาชีพ · Lv ${state.itemLv}`;

  const sprite = $("#char-sprite");
  const dir = (jobLabel || "scout").toLowerCase();
  sprite.src = `img/jobs/${dir}_${state.gender}.png`;
  sprite.onerror = () => { sprite.onerror = null; sprite.src = window.BT_JOB_SPRITE(dir, state.gender); };
  sprite.onerror = () => {
    sprite.onerror = null;
    sprite.src = `img/jobs/scout_${state.gender}.png`;
  };

  const maxT = maxTierFor(state.itemLv);
  $("#lv-out").textContent = `Lv ${state.itemLv}`;
  $("#lv-tier").textContent = `Tier สูงสุดที่ปลด: T${Math.min(8, maxT)}`;
}

function eqSlotBtn(slot) {
  const label = SLOT_TH[slot];
  const btn = el("button", "eq-slot" + (state.slot === slot ? " active" : ""));
  btn.type = "button";
  btn.dataset.slot = slot;
  btn.setAttribute("aria-label", label);
  const icon = forgeIcon(slot, state.itemLv);
  const hasPicks = (state.picks[slot] || []).length;
  if (icon && hasPicks) {
    btn.innerHTML = `<img src="img/${icon}.png" alt="" onerror="this.remove()"><span class="plus">+${hasPicks}</span>`;
  } else {
    btn.innerHTML = `<span class="slot-label">${label}</span>`;
  }

  const show = (e) => tipShow(eqTooltipHtml(slot), e.clientX, e.clientY);
  btn.addEventListener("mouseenter", show);
  btn.addEventListener("mousemove", show);
  btn.addEventListener("mouseleave", tipHide);

  btn.addEventListener("click", () => {
    state.slot = slot;
    state.bagSlot = slot;
    state.bagItem = "";
    state.bagWtypes.clear();
    persist();
    renderAll();
  });
  return btn;
}

function renderCharSlots() {
  const L = $("#col-left"),
    R = $("#col-right");
  L.innerHTML = "";
  R.innerHTML = "";
  for (const [slot] of FORGE_LAYOUT.left) L.append(eqSlotBtn(slot));
  for (const [slot] of FORGE_LAYOUT.right) R.append(eqSlotBtn(slot));
}

/* ---------- tooltip ของช่อง ---------- */
function eqTooltipHtml(slot) {
  const label = SLOT_TH[slot];
  const list = state.picks[slot] || [];
  const maxT = maxTierFor(state.itemLv);
  const icon = forgeIcon(slot, state.itemLv);
  const best = ITEMS.filter((i) => i.slot === slot && !i.unique).sort(
    (a, b) => Math.abs(a.lv - state.itemLv) - Math.abs(b.lv - state.itemLv),
  )[0];
  const info = best || null;

  const itemName = info ? info.name : label;
  const iconHtml = icon
    ? `<img src="img/${icon}.png" alt="" onerror="this.remove()">`
    : "";
  let h = `<div class="tip-iconrow">${iconHtml}<div><div class="tip-title r-r"><span class="tip-plus">+${list.length || 0}</span> ${itemName}</div>`;
  if (info) {
    h += `<div><span class="tip-rar">Epic</span> · ${info.type || ""}${info.hand ? " · " + info.hand : ""} · <span class="tip-lv">เลเวล ${info.lv}</span></div>`;
    const base = info.atk
      ? `ATK: <span class="tip-stat">${info.atk}</span>`
      : info.matk
        ? `MATK: <span class="tip-stat">${info.matk}</span>`
        : `DEF: <span class="tip-stat">${info.def}</span>`;
    h += `<div class="tip-sub">${base}</div>`;
  }
  h += `</div></div>`;
  h += `<div class="tip-sub">Tier สูงสุดที่ปลด ${tierPill(maxT)} (เลเวลไอเท็ม ${state.itemLv})</div>`;

  if (list.length) {
    h += `<hr><div class="tip-h">ออฟชั่นที่สวมอยู่</div>`;
    for (const p of list) {
      const a = AFFIXES.find((x) => x.id === p.affixId);
      const val = effValue(a.values, Math.min(maxT, 8), p.lines, a.kind === "T");
      h += `<div>${tierPill(Math.min(maxT, 8))} <span class="tip-stat">${a.fx.replace("{x}", fmt(val))}</span> <span class="tip-dim">(${p.lines} แถว${a.kind === "T" ? " · Proc" : ""})</span></div>`;
    }
    h += `<hr><div class="tip-none">✦ ไม่มี Affix ที่ซ้ำกัน</div>`;
  } else {
    h += `<div class="tip-none">✦ ไม่มี Affix — เลือกจากกระเป๋าฝั่งขวาเพื่อสวม</div>`;
  }
  h += `<div class="tip-box">🖱️ คลิกช่องนี้เพื่อเปิดกระเป๋าส่วน${label} · แถบเลเวลใต้ตัวละครปรับ Tier ของทุกชิ้นพร้อมกัน</div>`;
  return h;
}

/* ---------- อาชีพ ---------- */
function renderJobChips() {
  const box = $("#job-icons");
  box.innerHTML = "";
  for (const [code, label] of JOB_CODES) {
    const chip = el(
      "button",
      "chip jobchip",
      `<img src="img/jobs/icons/${label.toLowerCase()}.png" alt="" onerror="this.src=window.BT_JOB_ICON('${label.toLowerCase()}')"> ${label}`,
    );
    chip.type = "button";
    chip.setAttribute("aria-pressed", String(state.job === code));
    chip.addEventListener("click", () => {
      state.job = state.job === code ? "" : code;
      if (!state.job) {
        state.jobOnly = false;
        $("#bag-jobonly").checked = false;
        state.bagWtypes.clear();
      }
      persist();
      renderJobChips();
      renderAll();
    });
    box.append(chip);
  }
}

/* ---------- ปุ่มเลือกเพศ ---------- */
function wireGenderBtns() {
  document.querySelectorAll(".gender-btn").forEach((btn) => {
    btn.setAttribute("aria-pressed", String(btn.dataset.gender === state.gender));
    btn.addEventListener("click", () => {
      state.gender = btn.dataset.gender;
      persist();
      document
        .querySelectorAll(".gender-btn")
        .forEach((b) => b.setAttribute("aria-pressed", String(b.dataset.gender === state.gender)));
      renderChar();
    });
  });
}

/* ---------- แถบเลเวลใต้ตัวละคร ---------- */
function wireLvSlider() {
  const s = $("#lv-slider");
  s.value = state.itemLv;
  s.addEventListener("input", () => {
    state.itemLv = Number(s.value);
    persist();
    renderChar();
    renderBag();
    renderSummary();
    renderCharSlots();
  });
}

/* ---------- ฟิลเตอร์เลเวลช่วง + ค้นหาตรงอาชีพ ---------- */
function wireBagFilters() {
  const mn = $("#bag-lvmin"), mx = $("#bag-lvmax");
  mn.value = state.bagLvMin;
  mx.value = state.bagLvMax;
  const apply = () => {
    state.bagLvMin = Math.max(1, +mn.value || 1);
    state.bagLvMax = Math.min(115, +mx.value || 115);
    if (state.bagLvMin > state.bagLvMax)
      [state.bagLvMin, state.bagLvMax] = [state.bagLvMax, state.bagLvMin];
    renderBag();
  };
  mn.addEventListener("input", apply);
  mx.addEventListener("input", apply);

  /* ค้นหาตรงกับอาชีพ — ทำงานกับ อาวุธ + มือรอง เท่านั้น */
  const cb = $("#bag-jobonly");
  cb.checked = state.jobOnly;
  cb.addEventListener("change", () => {
    const slotOk0 = ["weapon", "offhand"].includes(state.bagSlot);
    const slotOk = ["weapon", "offhand"].includes(state.bagSlot);
    if (cb.checked && !state.job) {
      toast("เลือกอาชีพด้านล่างตัวละครก่อน");
      cb.checked = false;
      return;
    }
    if (cb.checked && !slotOk0) {
      toast("การกรองตามอาชีพใช้ได้กับ อาวุธ และ มือรอง เท่านั้น");
      cb.checked = false;
      return;
    }
    state.jobOnly = cb.checked;
    state.bagWtypes.clear();
    renderBag();
  });
}

/* ตรวจว่าอาชีพใช้ไอเทมนี้ได้ไหม (JOB_GEAR จากวิกิ) */
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

/* ---------- กระเป๋า (ขวา) ---------- */
function renderBagTabs() {
  const box = $("#bag-tabs");
  box.innerHTML = "";
  for (const [id, label] of BAG_TABS) {
    const btn = el("button", "chip", label);
    btn.type = "button";
    btn.setAttribute("role", "tab");
    btn.setAttribute("aria-pressed", String(state.bagSlot === id));
    btn.addEventListener("click", () => {
      state.bagSlot = id;
      state.bagItem = "";
      state.slot = id;
      state.bagWtypes.clear();
      persist();
      renderAll();
    });
    box.append(btn);
  }
}

/* dropdown แบบมีรูป: ปุ่ม + รายการรูปไอเทม */
function renderBagFilters() {
  const rarSel = $("#bag-rar");
  if (!rarSel.options.length) {
    for (const r of RARITIES) {
      const opt = el("option", null, `${r.name} — ${r.sub}`);
      opt.value = r.id;
      rarSel.append(opt);
    }
    rarSel.value = state.bagRar;
    rarSel.onchange = () => {
      state.bagRar = rarSel.value;
      renderBag();
    };
  }

  /* Filter Buttons ประเภทอาวุธ (เฉพาะเมื่อติ๊กค้นหาตรงกับอาชีพ + อาวุธ/มือรอง) */
  const wbox = $("#bag-wtype-btns");
  const showW = state.jobOnly && ["weapon", "offhand"].includes(state.bagSlot);
  wbox.hidden = !showW;
  if (showW) {
    const types = [...new Set(
      ITEMS.filter((i) => i.slot === state.bagSlot && !i.unique && jobCanUse(state.job, i) && i.type)
        .map((i) => i.type),
    )].sort();
    wbox.innerHTML = "";
    for (const t of types) {
      const on = state.bagWtypes.has(t);
      const b = el("button", "chip wtype-chip" + (on ? " active" : ""), window.WTYPE_TH[t] || t);
      b.type = "button";
      b.setAttribute("aria-pressed", String(on));
      b.addEventListener("click", () => {
        on ? state.bagWtypes.delete(t) : state.bagWtypes.add(t);
        renderBag();
      });
      wbox.append(b);
    }
  }

  /* dropdown แบบมีรูป */
  const itemSel = $("#bag-item");
  itemSel.style.display = "none";
  const wrap = itemSel.parentElement;
  let btn = wrap.querySelector(".item-dd-btn");
  if (!btn) {
    btn = el("button", "item-dd-btn");
    btn.type = "button";
    wrap.insertBefore(btn, itemSel);
    let box = wrap.querySelector(".item-dd");
    if (!box) {
      box = el("div", "item-dd");
      box.hidden = true;
      wrap.append(box);
      btn.addEventListener("click", () => {
        box.hidden = !box.hidden;
      });
      document.addEventListener("click", (e) => {
        if (!box.contains(e.target) && e.target !== btn && !btn.contains(e.target)) box.hidden = true;
      });
    }
    btn._box = box;
  }
  const cur = ITEMS.find((i) => i.id === state.bagItem);
  btn.innerHTML = `<img src="img/${cur ? itemIcon(cur) : "sword_t9"}.png" alt="" onerror="this.remove()"><span>${cur ? cur.name : "ไอเท็ม: ทั้งหมด"}</span><i class="chev">▾</i>`;
  const box = btn._box;
  box.innerHTML = "";
  const allRow = el("button", "item-dd-row", `<span>ไอเท็ม: ทั้งหมด</span>`);
  allRow.type = "button";
  allRow.addEventListener("click", () => {
    state.bagItem = "";
    persist();
    renderAll();
    box.hidden = true;
  });
  box.append(allRow);
  for (const i of itemsForBag()) {
    const row = el("button", "item-dd-row",
      `<img src="img/${itemIcon(i)}.png" alt="" onerror="this.remove()"><span>${i.name}</span><small>Lv ${i.lv}</small>`);
    row.type = "button";
    row.addEventListener("click", () => {
      state.bagItem = i.id;
      persist();
      renderAll();
      box.hidden = true;
    });
    box.append(row);
  }
  renderBagItemInfo();
}

/* ---------- Panel แสดงข้อมูลไอเท็มที่เลือก (Affix ที่สุ่มได้) ---------- */
function renderBagItemInfo() {
  const cur = ITEMS.find((i) => i.id === state.bagItem);
  const panel = document.getElementById("bag-item-info");
  if (!panel) return;
  if (!cur) { panel.innerHTML = ""; panel.hidden = true; return; }
  panel.hidden = false;
  const affKey = cur.type + "_t" + cur.tier;
  const aff = (window.ITEM_AFFIXES || {})[affKey];
  let h = `<h4 data-item-id="${cur.id}">${cur.name}</h4>`;
  h += `<table class="sum-table d-stats"><tbody>`;
  if (cur.atk) h += `<tr><td>ATK</td><td class="val">${cur.atk}</td></tr>`;
  if (cur.matk) h += `<tr><td>MATK</td><td class="val">${cur.matk}</td></tr>`;
  if (cur.def) h += `<tr><td>DEF</td><td class="val">${cur.def}</td></tr>`;
  h += `</tbody></table>`;
  h += `<h4>Affix ที่สุ่มได้บนชิ้นนี้</h4>`;
  if (aff && aff.groups && aff.groups.length) {
    for (const g of aff.groups) {
      if (g.title) h += `<div class="d-group">${g.title}</div>`;
      h += `<table class="sum-table d-affix"><thead><tr><th>Affix</th><th>ขั้น</th><th>ค่า</th></tr></thead><tbody>`;
      for (const row of g.affixes) h += `<tr><td>${row[0]}</td><td>${row[1]}</td><td class="val">${row[2]}</td></tr>`;
      h += `</tbody></table>`;
    }
  } else h += `<p class="hint">ไม่มีข้อมูล Affix สำหรับอุปกรณ์ขั้นนี้</p>`;
  panel.innerHTML = h;
}

function itemsForBag() {
  return ITEMS.filter(
    (i) =>
      i.slot === state.bagSlot &&
      !i.unique &&
      i.lv >= state.bagLvMin &&
      i.lv <= state.bagLvMax &&
      (!state.jobOnly || jobCanUse(state.job, i)) &&
      (!state.bagWtypes.size || state.bagWtypes.has(i.type)),
  ).sort((a, b) => a.lv - b.lv);
}

function wornIds(slot) {
  return new Set((state.picks[slot] || []).map((p) => p.affixId));
}

function renderBag() {
  renderBagFilters();
  const rar = RARITIES.find((r) => r.id === state.bagRar);
  const maxT = maxTierFor(state.itemLv);
  const box = $("#bag-content");
  box.innerHTML = "";

  const lines = rar.lines;
  if (!lines) {
    box.append(el("p", "hint", "ปกติ (Normal) ไม่มีแถวออฟชั่น — เลือกสีอื่น"));
    $("#bag-count").textContent = "";
    return;
  }

  const worn = wornIds(state.bagSlot);
  const cards = [];

  const pushCard = (a) => {
    const val = effValue(a.values, Math.min(maxT, 8), lines, a.kind === "T");
    const isWorn = worn.has(a.id);
    const card = el("article", "bag-card");
    const icon = state.bagItem
      ? itemIconById(state.bagItem)
      : forgeIcon(state.bagSlot, state.itemLv || 1);
    card.innerHTML = `
      <div class="bag-head">
        <img src="img/${icon || "sword_t9"}.png" alt="" onerror="this.remove()">
        <b>${a.name}</b>
        <span>${tierPill(Math.min(maxT, 8))} <b class="affix-val">${fmt(val)}</b></span>
      </div>
      <p>${a.fx.replace("{x}", fmt(val))}${lines < 3 && a.kind !== "T" ? ` <span class="tip-dim">(โหมด ${lines} แถว ×${lines === 1 ? "1.8" : "1.35"})</span>` : ""}</p>
      <div class="bag-ins-row">
        <select class="bag-ins" data-for="${a.id}" aria-label="Inscription สำหรับชิ้นนี้">
          <option value="">Inscription: ไม่มี</option>
        </select>
      </div>
      <button class="btn bag-add" ${isWorn ? "disabled" : ""}>${isWorn ? "✓ สวมอยู่" : "＋ ใส่"}</button>`;
    if (!isWorn) {
      card.querySelector(".bag-add").addEventListener("click", () => addPick(a.id, lines));
    }
    const insSel = card.querySelector(".bag-ins");
    const jobKey = (JOB_CODES.find(([c]) => c === state.job)?.[1] || "").toLowerCase();
    for (const ins of INSCRIPTIONS) {
      if (ins.job && jobKey && !ins.job.includes(jobKey)) continue;
      const opt = el("option", null, ins.n + (ins.job ? " · " + (JOB_FULL[ins.job] || ins.job) : " · ทุกอาชีพ"));
      opt.value = ins.id;
      if ((state.insPick || {})[a.id] === ins.id) opt.selected = true;
      insSel.append(opt);
    }
    insSel.addEventListener("change", () => {
      state.insPick = state.insPick || {};
      if (insSel.value) state.insPick[a.id] = insSel.value;
      else delete state.insPick[a.id];
      persist();
      renderSummary();
    });
    cards.push(card);
  };

  for (const a of AFFIXES.filter((x) => x.kind === "P" && x.slots.includes(state.bagSlot)))
    pushCard(a);
  for (const a of AFFIXES.filter((x) => x.kind === "S" && x.slots.includes(state.bagSlot)))
    pushCard(a);
  for (const a of AFFIXES.filter((x) => x.kind === "T" && x.slots.includes(state.bagSlot)))
    pushCard(a);

  for (const c of cards) box.append(c);
  $("#bag-count").textContent =
    `ส่วน${SLOT_TH[state.bagSlot]} · สี${rar.name} (${lines} แถว) · Tier สูงสุดที่ปลด T${Math.min(8, maxT)} — มี ${cards.length} ออฟชั่นให้เลือก`;
}

function itemIconById(id) {
  const it = ITEMS.find((i) => i.id === id);
  if (!it) return null;
  return itemIcon(it);
}

function addPick(affixId, lines) {
  const a = AFFIXES.find((x) => x.id === affixId);
  const slot = state.bagSlot;
  state.picks[slot] = state.picks[slot] || [];
  if (state.picks[slot].some((p) => p.affixId === affixId)) {
    toast("มีออฟชั่นนี้ในชิ้นนี้แล้ว (Affix ซ้ำกันในชิ้นเดียวไม่ได้)");
    return;
  }

  const maxLines = (RARITIES.find((r) => r.id === state.bagRar) || RARITIES[4]).lines;
  if (state.picks[slot].length >= maxLines) {
    toast(`ชิ้นนี้สี${(RARITIES.find((r) => r.id === state.bagRar) || {}).name} ใส่ได้สูงสุด ${maxLines} แถว — เลือกสีที่สูงขึ้นเพื่อเพิ่มแถว`);
    return;
  }

  if (state.bagItem && state.equipped[slot] !== state.bagItem) {
    const oldItem = ITEMS.find((i) => i.id === state.equipped[slot]);
    state.equipped[slot] = state.bagItem;
    state.picks[slot] = [];
    state.insPick = state.insPick || {};
    for (const key of Object.keys(state.insPick)) delete state.insPick[key];
    toast(`เปลี่ยนชิ้นใหม่: ${oldItem ? oldItem.name + " → " : ""}${(ITEMS.find((i) => i.id === state.bagItem) || {}).name || ""} (ออฟชั่นเดิมถูกดึงออก)`);
  }

  state.picks[slot].push({ affixId, lines });
  persist();
  renderAll();
  toast(`สวม ${a.name} ที่${SLOT_TH[slot]}แล้ว`);
}

/* ---------- สรุปพลังทั้งชุด ---------- */
function allPicks() {
  const out = [];
  for (const [slot, list] of Object.entries(state.picks)) {
    for (const p of list) out.push({ slot, ...p });
  }
  return out;
}

function renderSummary() {
  const out = $("#summary-out");
  const picks = allPicks();
  out.innerHTML = "";
  const lv = state.itemLv;
  const maxT = maxTierFor(lv);

  if (!picks.length) {
    out.append(el("p", "empty", "ยังไม่มีออฟชั่น — เลือกจากกระเป๋าฝั่งขวาแล้วกด “ใส่” ระบบจะรวมค่าให้ที่นี่"));
    return;
  }

  const table = el("table", "sum-table");
  table.innerHTML = `<thead><tr><th>ออฟชั่น</th><th>ช่อง</th><th>แถว</th><th>ค่า (T${maxT} · Lv ${lv})</th></tr></thead>`;
  const tbody = el("tbody");
  const totals = new Map();
  for (const p of picks) {
    const a = AFFIXES.find((x) => x.id === p.affixId);
    const val = effValue(a.values, Math.min(maxT, 8), p.lines, a.kind === "T");
    tbody.append(
      el("tr", null,
        `<td>${a.name}${(state.insPick || {})[p.affixId] ? ` <span class="badge">✒️ ${(INSCRIPTIONS.find((x) => x.id === (state.insPick || {})[p.affixId]) || {}).n || ""}</span>` : ""}</td><td>${SLOT_TH[p.slot] || p.slot}</td><td>${p.lines} แถว</td><td class="val">${fmtFx(a.fx, val)}</td>`),
    );
    const key = `${a.id}|${p.lines}|${a.kind}`;
    totals.set(key, (totals.get(key) || 0) + val);
  }
  table.append(tbody);
  out.append(table);

  const grid = el("div", "sum-grid");
  for (const [key, total] of totals) {
    const [id, lines, kind] = key.split("|");
    const a = AFFIXES.find((x) => x.id === id);
    grid.append(el("div", "sum-tile", `<b>${fmt(total)}</b><span>${a.name} (${lines} แถว${kind === "T" ? " · Proc" : ""}) รวมทุกชิ้น</span>`));
  }
  out.append(grid);
}

/* ---------- บันทึก / แชร์ / ล้าง ---------- */
const STORE_KEY = "bt-afx-builds";
function loadBuilds() {
  try {
    return JSON.parse(localStorage.getItem(STORE_KEY) || "[]");
  } catch {
    return [];
  }
}
function saveBuilds(list) {
  localStorage.setItem(STORE_KEY, JSON.stringify(list));
}

function renderSaved() {
  const box = $("#saved-list");
  box.innerHTML = "";
  const builds = loadBuilds();
  if (!builds.length) {
    box.append(el("span", "hint", "บันทึกไว้ในเครื่องนี้เท่านั้น — แต่ละเครื่อง/เบราว์เซอร์แยกกัน"));
    return;
  }
  for (const b of builds) {
    const pill = el("span", "saved-pill", `${b.name} <button title="เรียกใช้">↺</button><button title="ลบ">✕</button>`);
    const [use, del] = pill.querySelectorAll("button");
    use.addEventListener("click", () => {
      state.picks = b.picks;
      state.inscriptions = b.inscriptions || [];
      state.setPieces = b.setPieces || {};
      persist();
      renderAll();
      toast(`เรียกใช้ชุด “${b.name}” แล้ว`);
    });
    del.addEventListener("click", () => {
      saveBuilds(loadBuilds().filter((x) => x.name !== b.name));
      renderSaved();
    });
    box.append(pill);
  }
}

function encodeBuild() {
  return btoa(unescape(encodeURIComponent(JSON.stringify({
    p: state.picks,
    i: state.inscriptions,
    s: state.setPieces,
    n: $("#build-name").value || "ชุดของฉัน",
  }))));
}

function applyUrl() {
  const m = location.hash.match(/build=([^&]+)/);
  if (!m) return;
  try {
    const b = JSON.parse(decodeURIComponent(escape(atob(m[1]))));
    state.picks = b.p || {};
    state.inscriptions = b.i || [];
    state.setPieces = b.s || {};
    $("#build-name").value = b.n || "";
    toast("โหลดชุดจากลิงก์แล้ว");
  } catch {
    /* ลิงก์เสีย */
  }
}

function wireButtons() {
  $("#btn-save").addEventListener("click", () => {
    const name = $("#build-name").value.trim() || `ชุด ${new Date().toLocaleDateString("th-TH")}`;
    const builds = loadBuilds().filter((b) => b.name !== name);
    builds.push({
      name,
      picks: state.picks,
      inscriptions: state.inscriptions,
      setPieces: state.setPieces,
    });
    saveBuilds(builds);
    renderSaved();
    toast(`บันทึกชุด “${name}” แล้ว`);
  });
  $("#btn-share").addEventListener("click", async () => {
    const url = `${location.origin}${location.pathname}#build=${encodeBuild()}`;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        toast("คัดลอกลิงก์แชร์แล้ว");
      } else {
        location.hash = `build=${encodeBuild()}`;
        toast("คัดลอก URL จากแถบด้านบนเพื่อแชร์");
      }
    } catch {
      location.hash = `build=${encodeBuild()}`;
      toast("คัดลอก URL จากแถบด้านบนเพื่อแชร์");
    }
  });
  $("#btn-clear").addEventListener("click", () => {
    state.picks = {};
    state.inscriptions = [];
    state.setPieces = {};
    persist();
    renderAll();
    toast("ล้างทั้งชุดแล้ว");
  });
  $("#build-name").addEventListener("input", renderChar);
}

/* ---------- INIT ---------- */
function renderAll() {
  renderChar();
  renderCharSlots();
  renderBagTabs();
  renderBag();
  renderSummary();
}

window.BT_PAGE_INIT = function () {
  applyUrl();
  const picked = loadSharedState().pickedItem;
  if (picked) {
    const it = ITEMS.find((i) => i.id === picked);
    if (it) {
      state.bagSlot = it.slot;
      state.slot = it.slot;
      state.bagItem = it.id;
      state.itemLv = Math.max(state.itemLv, it.lv);
      saveSharedState({ pickedItem: null });
    }
  }
  renderAll();
  renderJobChips();
  wireLvSlider();
  wireGenderBtns();
  wireBagFilters();
  renderSaved();
  wireButtons();
};


/* ดับเบิลคลิก / คลิกขวาที่ช่องอุปกรณ์ = ถอดทั้งช่อง (delegation ที่ document — ทน DOM re-render) */
document.addEventListener("dblclick", (e) => {
  const btn = e.target.closest(".eq-slot");
  if (btn) removeSlotEq(btn.dataset.slot || "");
});
document.addEventListener("contextmenu", (e) => {
  const btn = e.target.closest(".eq-slot");
  if (btn) {
    e.preventDefault();
    removeSlotEq(btn.dataset.slot || "");
  }
});

function removeSlotEq(slot) {
  if (!slot) return;
  const had = (state.picks[slot] || []).length || state.equipped[slot];
  if (!had) {
    toast(SLOT_TH[slot] + " — ช่องนี้ว่างอยู่แล้ว");
    return;
  }
  pushHistory(slot);
  state.picks[slot] = [];
  delete state.equipped[slot];
  persist();
  renderAll();
  toast("ถอด " + SLOT_TH[slot] + " แล้ว — กด Undo เพื่อย้อน");
}

/* Undo history */
const BT_HISTORY = [];
function pushHistory(slot) {
  BT_HISTORY.push(
    JSON.stringify({
      slot,
      picks: state.picks[slot] ? JSON.parse(JSON.stringify(state.picks[slot])) : [],
      equipped: state.equipped[slot] || null,
    }),
  );
  if (BT_HISTORY.length > 60) BT_HISTORY.shift();
}
function undoAll() {
  const last = BT_HISTORY.pop();
  if (!last) { toast("ไม่มีอะไรให้ย้อนแล้ว"); return; }
  const snap = JSON.parse(last);
  if (snap.picks.length) state.picks[snap.slot] = snap.picks;
  else delete state.picks[snap.slot];
  if (snap.equipped) state.equipped[snap.slot] = snap.equipped;
  else delete state.equipped[snap.slot];
  persist();
  renderAll();
  toast("Undo — ย้อนการเปลี่ยนแปลงล่าสุดแล้ว");
}
