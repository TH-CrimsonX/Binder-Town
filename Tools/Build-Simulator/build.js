/* Build Simulator — ประกอบบิลด์ทั้งชุด (ธีมเดียวกับเว็บ)
   อ้างอิงข้อมูลจาก wiki.bindertowngame.com และตัวเกม */
"use strict";

const state = {
  job: loadSharedState().job || "",
  lv: 92,
  /* gear: ดึงชุดออฟชั่นจาก Gear Simulator (state ร่วม) */
  picks: loadSharedState().picks || {},
  equipped: loadSharedState().equipped || {},
  insPick: loadSharedState().insPick || {},
  /* cards: 9 ช่อง {cardId, stars} */
  cards: new Array(9).fill(null),
};

const STORE_KEY = "bt-build-sim";
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

/* ---------- อาชีพ ---------- */
function renderJob() {
  const sel = $("#b-job");
  sel.innerHTML =
    '<option value="">ไม่ระบุอาชีพ</option>' +
    JOB_CODES.map(
      ([c, n]) =>
        `<option value="${c}"${c === state.job ? " selected" : ""}>${n}</option>`,
    ).join("");
  sel.onchange = () => {
    state.job = sel.value;
    saveSharedState({ job: state.job });
    renderSlots();
  };
}

/* ---------- อุปกรณ์ + ออฟชั่น (จาก Gear Simulator) ---------- */
function renderSlots() {
  const box = $("#b-slots");
  box.innerHTML = "";
  const maxT = maxTierFor(state.lv);
  let any = false;
  for (const [slot, label] of SLOTS) {
    const list = state.picks[slot] || [];
    const eq = state.equipped[slot];
    if (!list.length && !eq) continue;
    any = true;
    const item = eq ? ITEMS.find((i) => i.id === eq) : null;
    const div = el("div", "b-slot");
    let h = `<div class="b-slot-head"><img src="../Gear-Simulator/img/${item ? itemIcon(item) : "sword_t9"}.png" alt="" onerror="this.remove()"><b>${label}</b>${item ? `<span class="hint">${item.name} · Lv ${item.lv}</span>` : ""}</div>`;
    for (const p of list) {
      const a = AFFIXES.find((x) => x.id === p.affixId);
      const val = effValue(a.values, Math.min(maxT, 8), p.lines, a.kind === "T");
      const ins = (state.insPick || {})[p.affixId];
      h += `<div class="b-afx">${tierPill(Math.min(maxT, 8))} ${fmtFx(a.fx, val)}${ins ? ` <span class="badge">✒️ ${(INSCRIPTIONS.find((x) => x.id === ins) || {}).n || ""}</span>` : ""}</div>`;
    }
    div.innerHTML = h;
    box.append(div);
  }
  if (!any) {
    box.append(
      el("p", "hint", "ยังไม่มีอุปกรณ์ — ไปตั้งค่าที่ Gear Simulator แล้วกลับมา ระบบจะดึงชุดมาให้"),
    );
  }
}

/* ---------- การ์ด 9 ช่อง ---------- */
function renderCards() {
  const box = $("#b-cards");
  box.innerHTML = "";
  state.cards.forEach((s, i) => {
    const sel = el("select", "b-card-sel");
    sel.innerHTML =
      `<option value="">ช่อง ${i + 1}: ว่าง</option>` +
      CARD_DATA.cards
        .map(
          (c) =>
            `<option value="${c.id}"${s && s.cardId === c.id ? " selected" : ""}>${c.n} (Load ◆${c.load})</option>`,
        )
        .join("");
    const star = el("select", "b-star-sel");
    star.innerHTML = [1, 2, 3, 4, 5]
      .map(
        (n) =>
          `<option value="${n}"${s && s.stars === n ? " selected" : ""}>★${n}</option>`,
      )
      .join("");
    sel.onchange = () => {
      state.cards[i] = sel.value
        ? { cardId: sel.value, stars: +star.value }
        : null;
      renderSum();
    };
    star.onchange = () => {
      if (state.cards[i]) state.cards[i].stars = +star.value;
      renderSum();
    };
    const wrap = el("div", "b-card-row");
    wrap.append(sel, star);
    box.append(wrap);
  });
}

/* ---------- สรุป ---------- */
function renderSum() {
  const out = $("#b-sum");
  out.innerHTML = "";
  const maxT = maxTierFor(state.lv);
  const table = el("table", "sum-table");
  table.innerHTML = `<thead><tr><th>รายการ</th><th>ที่มา</th><th>ค่า (T${maxT} · Lv ${state.lv})</th></tr></thead>`;
  const tbody = el("tbody");
  const totals = new Map();

  /* ออฟชั่นจากอุปกรณ์ */
  for (const [slot, list] of Object.entries(state.picks)) {
    for (const p of list) {
      const a = AFFIXES.find((x) => x.id === p.affixId);
      const val = effValue(a.values, Math.min(maxT, 8), p.lines, a.kind === "T");
      tbody.append(
        el(
          "tr",
          null,
          `<td>${a.name}</td><td>${SLOT_TH[slot] || slot} · ${p.lines} แถว</td><td class="val">${fmtFx(a.fx, val)}</td>`,
        ),
      );
      const key = `${a.id}|${p.lines}|${a.kind}`;
      totals.set(key, (totals.get(key) || 0) + val);
    }
  }
  /* การ์ด */
  for (const s of state.cards.filter(Boolean)) {
    const c = CARD_DATA.cards.find((x) => x.id === s.cardId);
    const mult = s.stars / 5;
    tbody.append(
      el(
        "tr",
        null,
        `<td>🃏 ${c.n}</td><td>การ์ด ★${s.stars}</td><td class="val">${c.fx.replace(
          /\d+(?:\.\d+)?%?/g,
          (m) => {
            const v = parseFloat(m) * mult;
            return (
              (m.endsWith("%") ? v.toFixed(1).replace(/\.0$/, "") : v) +
              (m.endsWith("%") ? "%" : "")
            );
          },
        )}</td>`,
      ),
    );
  }
  table.append(tbody);
  out.append(table);

  const grid = el("div", "sum-grid");
  for (const [key, total] of totals) {
    const [id, lines, kind] = key.split("|");
    const a = AFFIXES.find((x) => x.id === id);
    grid.append(
      el(
        "div",
        "sum-tile",
        `<b>${fmt(total)}</b><span>${a.name} (${lines} แถว${kind === "T" ? " · Proc" : ""}) รวมทุกชิ้น</span>`,
      ),
    );
  }
  if (grid.children.length) out.append(grid);
}

/* ---------- บันทึก: แถบหุบ (details) แนวนอน ---------- */
function scaleFx(fx, m) {
  return fx.replace(/(\d+(?:\.\d+)?)(%?)/g, (mm, num, pct) => {
    const v = parseFloat(num) * m;
    const txt = pct
      ? v < 1
        ? v.toFixed(2)
        : v.toFixed(1).replace(/\.0$/, "")
      : Math.round(v * 10) / 10;
    return txt + pct;
  });
}

function renderSaved() {
  const box = $("#b-saved");
  box.innerHTML = "";
  const builds = loadBuilds();
  $("#saved-count").textContent = builds.length;
  if (!builds.length) {
    box.append(
      el("span", "hint", "ยังไม่มีบิลด์ที่บันทึก — ตั้งค่าด้านบนแล้วกดบันทึก"),
    );
    return;
  }
  for (const b of builds) {
    const d = el("details", "saved-item");
    d.innerHTML = `<summary>${b.name} · Lv ${b.lv} · การ์ด ${(b.cards || []).filter(Boolean).length}/9 <button class="mini-btn">ลบ</button></summary><div class="saved-body"></div>`;
    const body = d.querySelector(".saved-body");
    const table = el("table", "sum-table");
    table.innerHTML =
      "<thead><tr><th>รายการ</th><th>ที่มา</th><th>ค่า</th></tr></thead>";
    const tb = el("tbody");
    const bMaxT = Math.min(8, maxTierFor(b.lv));
    for (const [slot, list] of Object.entries(b.picks || {})) {
      for (const p of list) {
        const a = AFFIXES.find((x) => x.id === p.affixId);
        const val = effValue(a.values, bMaxT, p.lines, a.kind === "T");
        tb.append(
          el(
            "tr",
            null,
            `<td>${a.name}</td><td>${SLOT_TH[slot] || slot}</td><td class="val">${fmtFx(a.fx, val)}</td>`,
          ),
        );
      }
    }
    for (const s of (b.cards || []).filter(Boolean)) {
      const c = CARD_DATA.cards.find((x) => x.id === s.cardId);
      tb.append(
        el(
          "tr",
          null,
          `<td>🃏 ${c.n}</td><td>การ์ด ★${s.stars}</td><td class="val">${scaleFx(c.fx, s.stars / 5)}</td>`,
        ),
      );
    }
    table.append(tb);
    body.append(table);
    const btnUse = el("button", "btn ghost", "↺ เรียกใช้บิลด์นี้");
    btnUse.addEventListener("click", () => {
      state.cards = JSON.parse(JSON.stringify(b.cards));
      state.lv = b.lv;
      $("#b-lv").value = b.lv;
      renderCards();
      renderSum();
      toast(`เรียกใช้บิลด์ "${b.name}" แล้ว`);
    });
    body.append(btnUse);
    d.querySelector(".mini-btn").addEventListener("click", (e) => {
      e.stopPropagation();
      saveBuilds(loadBuilds().filter((x) => x.name !== b.name));
      renderSaved();
    });
    box.append(d);
  }
}

window.addEventListener("DOMContentLoaded", () => {
  const tog = document.querySelector("#saved-toggle");
  if (tog)
    tog.addEventListener("click", () => {
      const box = document.querySelector("#b-saved");
      box.hidden = !box.hidden;
    });
});

window.BT_PAGE_INIT = function () {
  renderJob();
  renderSlots();
  renderCards();
  renderSum();
  renderSaved();
  $("#b-lv").addEventListener("input", (e) => {
    state.lv = Math.min(115, Math.max(1, +e.target.value || 1));
    renderSlots();
    renderSum();
  });
  $("#b-save").addEventListener("click", () => {
    const name =
      $("#b-name").value.trim() ||
      `บิลด์ ${new Date().toLocaleDateString("th-TH")}`;
    const builds = loadBuilds().filter((b) => b.name !== name);
    builds.push({
      name,
      cards: JSON.parse(JSON.stringify(state.cards)),
      lv: state.lv,
      picks: JSON.parse(JSON.stringify(state.picks)),
    });
    saveBuilds(builds);
    renderSaved();
    $("#b-saved").hidden = false;
    toast(`บันทึกบิลด์ "${name}" แล้ว`);
  });
  $("#b-clear").addEventListener("click", () => {
    state.cards = new Array(9).fill(null);
    renderCards();
    renderSum();
    toast("ล้างบิลด์แล้ว");
  });
};
