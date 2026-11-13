/* Glossary — ศัพท์เกม · ข้อมูลจาก wiki.bindertowngame.com ณ 30 ต.ค. 2569 */
"use strict";

const GL = [
  ["Preacher", "คนที่ล่ามอนเพื่อสะสมวิญญาณแลกการ์ดเป็นหลัก", "การ์ด"],
  ["Nocturnal ☾", "มอนกลางคืน — การ์ดแรง ×1.4 ตอนกลางคืน", "การ์ด"],
  ["Diurnal ☀", "มอนกลางวัน — การ์ดแรง ×1.4 ตอนกลางวัน", "การ์ด"],
  ["Echo", "การ์ดมอนตัวเดิมใบที่ 2+ — ผลเหลือ 50/25/0%", "การ์ด"],
  ["Resonance", "โบนัสเมื่อใส่การ์ดชุด (ภูมิภาค/สาย/สี)", "การ์ด"],
  ["Spirit Load", "ค่าโหลดการ์ด — มอน 1 · Elite 2 · Mini-boss 3 · Boss 5", "การ์ด"],
  ["Spirit Album", "สมุดการ์ด 9 ช่อง — เปิด Lv 12 แล้วเพิ่มทุก 6 เลเวล", "การ์ด"],
  ["Bond", "ใส่การ์ดแล้วล่ามอนสายเดียวกัน การ์ดโตเอง", "การ์ด"],
  ["Tier / ขั้น", "เลเวลออฟชั่นอุปกรณ์ 1–10 — ยิ่งสูงยิ่งแรง", "อุปกรณ์"],
  ["Smith", "ช่างตีเหล็ก — ตีขึ้นรูป/อัปเกรดอุปกรณ์", "อุปกรณ์"],
  ["Inscription", "สลักชื่อบนอุปกรณ์ — เพิ่มเติมเอฟเฟกต์อิสระ", "อุปกรณ์"],
  ["Soul / วิญญาณ", "ทรัพยากรจากมอน — ใช้แลกการ์ด / อัปดาว / เรรวน", "ทั่วไป"],
  ["Weave", "เรรวน — ลงทะเบียนออฟชั่นชุดมอน", "ทั่วไป"],
  ["Reforge", "เปลี่ยนค่าออฟชั่น — สุ่มค่าใหม่ตาม Tier", "ทั่วไป"],
  ["Ward", "เกราะป้องกันพิเศษของ Boss", "มอน"],
  ["Elite", "มอนระดับ Elite — วิญญาณ ×3 ของมอนทั่วไป", "มอน"],
  ["Mini-boss", "มอนระดับกลาง — วิญญาณ ×9 ของมอนทั่วไป", "มอน"],
  ["Field Boss", "มอนระดับ Boss — วิญญาณ ×15 ของมอนทั่วไป"],
];

window.addEventListener("DOMContentLoaded", () => {
  const box = $("#glossary-list");
  const sel = $("#g-type");
  if (!box) return;
  const types = [...new Set(GL.map((g) => g[2]))];
  sel.innerHTML = '<option value="">ประเภท: ทั้งหมด</option>' + types.map((t) => `<option>${t}</option>`).join("");
  function render() {
    const q = ($("#g-search").value || "").toLowerCase();
    const ty = sel.value;
    const list = GL.filter(([n, , t]) => {
      if (ty && t !== ty) return false;
      if (q && !(n.toLowerCase().includes(q) || arguments[2]?.toLowerCase?.().includes(q))) return false;
      return true;
    });
    box.innerHTML = "";
    list.forEach(([n, , t, d]) => box.append(
      Object.assign(document.createElement("article"), { className: "g-card", innerHTML: `<b>${n}</b><span class="g-type">${t}</span><p>${d}</p>` })
    ));
  }
  sel.onchange = render;
  $("#g-search").addEventListener("input", render);
  render();
});
