/* ไอคอนอาชีพ: เรียก window.BT_JOB_ICON(job, gender)
   ถ้าไฟล์ img/jobs/icons/<job>.png ไม่มี → ส่ง placeholder สีต่างกันต่ออาชีพ */
window.BT_JOB_COLORS = {
  knight: "#8ea8ff", warrior: "#ff9b7a", scout: "#8ef0b8", rogue: "#c792ea",
  mage: "#6ec0ff", acolyte: "#ffe08a", summoner: "#ff8ac2",
};
window.BT_JOB_ICON = function (job) {
  const c = window.BT_JOB_COLORS[job] || "#9ab0c6";
  const letter = (job || "?").charAt(0).toUpperCase();
  return (
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">` +
        `<rect width="64" height="64" rx="12" fill="#16232f"/>` +
        `<circle cx="32" cy="32" r="20" fill="none" stroke="${c}" stroke-width="3"/>` +
        `<text x="32" y="41" font-family="sans-serif" font-size="24" font-weight="700" fill="${c}" text-anchor="middle">${letter}</text>` +
        `</svg>`,
    )
  );
};
/* ตัวละคร sprite: ใช้สีเดียวกัน */
window.BT_JOB_SPRITE = function (job, gender) {
  const c = window.BT_JOB_COLORS[job] || "#9ab0c6";
  return (
    "data:image/svg+xml," +
    encodeURIComponent(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 96 128">` +
        `<rect width="96" height="128" rx="10" fill="transparent"/>` +
        `<circle cx="48" cy="34" r="18" fill="${c}"/>` +
        `<rect x="26" y="56" width="44" height="48" rx="12" fill="${c}" opacity="0.85"/>` +
        `<rect x="30" y="106" width="14" height="16" rx="6" fill="${c}" opacity="0.7"/>` +
        `<rect x="52" y="106" width="14" height="16" rx="6" fill="${c}" opacity="0.7"/>` +
        `</svg>`,
    )
  );
};
