# รูปไอเท็ม — Pattern จากวิกิ

ไอคอนทั้งหมดเป็น WebP ที่ดึงมาจาก wiki.bindertowngame.com
ตั้งชื่อแบบ: `<family>_t<tier>.png` โดย `tier` มี 9 และ 10 เท่านั้น
เช่น `sword_t9.png`, `sword_t10.png`, `kite_shield_t9.png`

ตระกูลที่ใช้ (ดูเพิ่มใน common.js → ICON_ALIAS):
sword greatsword spear axe kris crossbow orb mace staff bow dagger wand
tome scythe hammer sling kite_shield tower_shield buckler plate robe
leather greaves lantern censer bell skull ward prism witch_hat halo
heartwood_crown shades bell skull skull familiar war_banner poison_vial

ถ้าไฟล์ไหนยังไม่มี — common.js จะสร้าง placeholder สีเทาแบบ inline
(data-URI) ให้อัตโนมัติ ไม่พัง ไม่มีรูปว่าง
