/* Binder Town Tools — โครงหลังร่วมของทุกหน้า
   ข้อมูลอ้างอิงจาก wiki.bindertowngame.com (เทียบกับตัวเกม ณ 24 ต.ค. 2569) */
"use strict";

const RARITIES = [
  { id: "n", name: "ปกติ", sub: "Normal · ไม่มีแถว", lines: 0 },
  { id: "g", name: "เขียว", sub: "Magic · 1 แถว", lines: 1 },
  { id: "b", name: "ฟ้า", sub: "Magic · 2 แถว", lines: 2 },
  { id: "y", name: "ทอง", sub: "Rare · 3 แถว", lines: 3 },
  { id: "r", name: "แดง", sub: "Epic · 4 แถว", lines: 4 },
];

const SLOTS = [
  ["weapon", "อาวุธ"],
  ["offhand", "มือรอง"],
  ["headgear", "หมวก"],
  ["face", "หน้า"],
  ["mouth", "ปาก"],
  ["necklace", "สร้อยคอ"],
  ["armor", "เกราะ"],
  ["belt", "เข็มขัด"],
  ["boots", "รองเท้า"],
  ["acc1", "ประดับ 1"],
  ["acc2", "ประดับ 2"],
];

const KIND_NAMES = { P: "Prefix", S: "Suffix", T: "Proc (Trigger)" };

const TIERS = [
  { t: 1, lv: 1 },
  { t: 2, lv: 12 },
  { t: 3, lv: 26 },
  { t: 4, lv: 40 },
  { t: 5, lv: 55 },
  { t: 6, lv: 70 },
  { t: 7, lv: 82 },
  { t: 8, lv: 92 },
];

const JOB_CODES = [
  ["k", "Knight"],
  ["w", "Warrior"],
  ["s", "Scout"],
  ["r", "Rogue"],
  ["m", "Mage"],
  ["a", "Acolyte"],
  ["u", "Summoner"],
];
const JOB_FULL = {
  knight: "Knight",
  warrior: "Warrior",
  scout: "Scout",
  rogue: "Rogue",
  mage: "Mage",
  acolyte: "Acolyte",
  summoner: "Summoner",
};

/* ชื่อประเภทอาวุธภาษาไทย (ใช้ร่วมกับ Armory + Gear Simulator) */
const WTYPE_TH = {
  sword: "ดาบ",
  greatsword: "ดาบใหญ่",
  spear: "หอก",
  axe: "ขวาน",
  kris: "กริช",
  crossbow: "หน้าไม้",
  orb: "ลูกแก้ว",
  mace: "กระบอง",
  staff: "ไม้เท้ามนตร์",
  bow: "ธนู",
  dagger: "ดาบสั้น",
  wand: "หวายมนตร์",
  tome: "ตำรามนตร์",
  scythe: "เคียว",
  hammer: "ค้อน",
  sling: "ผ้าคลุมโยน",
  chain_sickle: "เชือกหวีด",
  kite_shield: "โล่เต็ม",
  buckler: "โล่เล็ก",
  plate: "เกราะแผ่น",
  robe: "เสื้อคลุม",
  leather: "เสื้อหนัง",
  chain: "เสื้อโซ่",
  greaves: "เกราะขา",
  tower_shield: "โล่ประตู",
  lantern: "โคมไฟ",
  censer: "กระถางธูป",
  bell: "ระฆัง",
  skull: "กะโหลก",
  ward: "เครื่องกั้น",
  prism: "ปริซึม",
  quiver: "ซองธนู",
  bandolier: "สายสะพาย",
  war_banner: "ธงรบ",
  familiar: "สัตว์วิญญาณ",
  poison_vial: "ขวดพิษ",
  stone_pouch: "ถุงหิน",
  javelin: "หอกโยน",
  pike: "หอกยาว",
  lance: "หอกศึก",
  rapier: "ดาบเล็บ",
  flail: "ลูกตุ้ม",
  knuckles: "กำปั้นเหล็ก",
  parrying_dagger: "ดาบป้องกัน",
  hand_crossbow: "หน้าไม้มือ",
  throwing_knife: "มีดโยน",
  greatstaff: "ไม้เท้าใหญ่",
  lightstaff: "ไม้เท้าแสง",
  spellstaff: "ไม้เท้าเวท",
  rod: "หวายเวท",
  maul: "ค้อนยักษ์",
  amulet: "เครื่องรางคอ",
  necklace: "สร้อยคอ",
  charm: "เครื่องราง",
  ring: "แหวน",
  belt: "เข็มขัด",
  boots: "รองเท้า",
  witch_hat: "หมวกแม่มด",
  beanie: "หมวกกันหนาว",
  halo: "รัศมี",
  heartwood_crown: "มงกุฎไม้",
  shades: "แว่นกันแดด",
  rose: "ดอกกุหลาบ",
};
window.WTYPE_TH = WTYPE_TH;

var SLOT_TH = window.SLOT_TH = Object.fromEntries(SLOTS);

var AFFIXES = window.AFFIXES = [];
var ITEMS = window.ITEMS = [];
var INSCRIPTIONS = window.INSCRIPTIONS = [];
var REGION_SETS = window.REGION_SETS = [];
var REGION_NAMES = window.REGION_NAMES = [];

/* แม็ป slot ในข้อมูล affix (เก่า) → ชื่อ slot จริงของเกม */
const AFFIX_SLOT_MAP = {
  wpn: "weapon",
  off: "offhand",
  hat: "headgear",
  face: "face",
  mouth: "mouth",
  neck: "necklace",
  armor: "armor",
  belt: "belt",
  boots: "boots",
  acc: "acc1",
};

const __btReady = window.BT_DATA_READY || new Promise((res) => {
    const t = setInterval(() => {
      if (window.BT_DATA_READY) { clearInterval(t); window.BT_DATA_READY.then(res); }
    }, 50);
  });
  __btReady.then(() => {
  for (const a of window.AFFIX_DATA)
    AFFIXES.push({
      id: a.id,
      kind: a.k,
      name: a.n,
      fx: a.fx,
      slots: a.sl.map((s) => AFFIX_SLOT_MAP[s] || s),
      values: a.v,
      flag: a.flag || "",
    });
  for (const a of window.ITEM_DATA)
    ITEMS.push({
      id: a[0],
      name: a[1],
      slot: a[2],
      type: a[3],
      hand: a[4],
      jobs: a[5],
      lv: a[6],
      tier: a[7],
      atk: a[8],
      matk: a[9],
      def: a[10],
      fx: a[11],
      unique: !!a[12],
    });
  INSCRIPTIONS = window.INSCRIPTION_DATA;
  REGION_SETS = window.SET_DATA.sets;
  REGION_NAMES = window.SET_DATA.regions;
  if (typeof window.BT_PAGE_INIT === "function") window.BT_PAGE_INIT();
});

/* ---------- helpers ---------- */
const $ = (sel) => document.querySelector(sel);
const el = (tag, cls, html) => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (html !== undefined) node.innerHTML = html;
  return node;
};

function fmt(n) {
  return Number.isInteger(n) ? String(n) : String(Number(n.toFixed(2)));
}

function tierRange(values, t) {
  return { min: values[(t - 1) * 2], max: values[(t - 1) * 2 + 1] };
}

function maxTierFor(lv) {
  let t = 1;
  for (const tier of TIERS) if (lv >= tier.lv) t = tier.t;
  return Math.min(8, t + 1);
}

function effValue(values, t, lines, isProc) {
  const { max } = tierRange(values, t);
  if (isProc) return max;
  return lines === 1 ? max * 1.8 : lines === 2 ? max * 1.35 : max;
}

function fmtFx(fx, x) {
  return fx.replace("{x}", `<b class="affix-val">${fmt(x)}</b>`);
}

function toast(msg) {
  const t = $("#toast");
  if (!t) return;
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toast._h);
  toast._h = setTimeout(() => {
    t.hidden = true;
  }, 2600);
}

function tierPill(t) {
  return `<span class="tpill t${t}">T${t}</span>`;
}

/* ---------- ไอคอนไอเท็ม: <family>_t<9|10>.png ---------- */
const ICON_ALIAS = {
  shield: "kite_shield",
  hammer: "mace",
  throwing_knife: "dagger",
};

function itemIcon(item) {
  const base = (item.type || item.id.replace(/_lv\d+$/, "")).replace(
    /[^a-z_]/g,
    "",
  );
  const t = item.tier >= 9 ? 10 : 9;
  const key = ICON_ALIAS[base] || base;
  return `${key}_t${t}`;
}

/* ---------- shared state ---------- */
const BT_STATE_KEY = "bt-afx-state-v2";

function loadSharedState() {
  try {
    return JSON.parse(localStorage.getItem(BT_STATE_KEY) || "{}");
  } catch {
    return {};
  }
}

function saveSharedState(patch) {
  const cur = loadSharedState();
  localStorage.setItem(BT_STATE_KEY, JSON.stringify({ ...cur, ...patch }));
}

/* ---------- Game-style tooltip ---------- */
function tipShow(html, x, y) {
  const tip = document.getElementById("gametip");
  if (!tip) return;
  tip.innerHTML = html;
  tip.hidden = false;
  const r = tip.getBoundingClientRect();
  let px = x + 14;
  let py = y + 16;
  if (px + r.width > innerWidth - 12) px = x - r.width - 14;
  if (py + r.height > innerHeight - 12) py = innerHeight - r.height - 12;
  tip.style.left = Math.max(8, px) + "px";
  tip.style.top = Math.max(8, py) + "px";
}

function tipHide() {
  const tip = document.getElementById("gametip");
  if (tip) tip.hidden = true;
}

/* ---------- รูปไอเท็มพร้อม fallback ----------
   ถ้าไฟล์ .png ยังไม่มีใน img/ — สร้าง placeholder SVG สีเทา inline
   วิธีเดียวกับ Armory: ไม่มีรูปว่าง ไม่มี broken-image icon */
window.BT_ICON_FALLBACK = function (name) {
  return (
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
        `<rect width="64" height="64" rx="10" fill="#1c2c3a"/>` +
        `<rect x="14" y="14" width="36" height="36" rx="6" fill="none" stroke="#3e5670" stroke-width="2"/>` +
        `<text x="32" y="38" font-family="sans-serif" font-size="11" fill="#6a82a0" text-anchor="middle">${(name || "").replace(/[^a-z_]/g, "").slice(0, 12)}</text>` +
        `</svg>`,
    )
  );
};

/* ติดตั้งกล่อง fallback ให้ทุก <img class="bt-icon"> ทั้งหน้า
   — เรียกหลัง DOM สร้างแล้ว (ทุกหน้าเรียกใน BT_PAGE_INIT) */
window.BT_WIRE_ICONS = function (root) {
  (root || document)
    .querySelectorAll("img.bt-icon[data-fallback]")
    .forEach((img) => {
      if (!img.dataset.wired) {
        img.dataset.wired = "1";
        img.onerror = () => {
          img.onerror = null;
          img.src = window.BT_ICON_FALLBACK(img.dataset.fallback || "item");
        };
      }
    });
};

window.fmt = fmt;
window.maxTierFor = maxTierFor;
window.effValue = effValue;
window.fmtFx = fmtFx;
window.itemIcon = itemIcon;
window.jobCanUse = jobCanUse;
window.toast = toast;
window.el = el;
window["$"] = $;
