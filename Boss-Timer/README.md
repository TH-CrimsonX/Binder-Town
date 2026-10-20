<p align="right">
  <a href="https://github.com/TH-CrimsonX/Binder-Town"><img src="https://img.shields.io/github/stars/TH-CrimsonX/Binder-Town?style=for-the-badge&logo=github&logoColor=white&color=242938" alt="GitHub stars"></a>
  <a href="https://github.com/TH-CrimsonX/Binder-Town/commits"><img src="https://img.shields.io/github/last-commit/TH-CrimsonX/Binder-Town?style=for-the-badge&logo=git&logoColor=white&color=343b52" alt="Last commit"></a>
  <img src="https://img.shields.io/badge/Node.js-18%2B-43853d?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 18+">
  <img src="https://img.shields.io/badge/Express-Backend-343b52?style=for-the-badge&logo=express&logoColor=white" alt="Express backend">
  <img src="https://img.shields.io/badge/GitHub_Pages-Live-7c5cff?style=for-the-badge&logo=githubpages&logoColor=white" alt="GitHub Pages">
</p>

<h1 align="center">Binder Town Boss Timer</h1>

<p align="center">เว็บแสดงและนับเวลาบอสในเกม Binder Town พร้อมเสียงแจ้งเตือนและระบบบันทึกเวลาเกิดบอส</p>

## ความสามารถ

- แสดงบอสแยกตามหมวด Elite, Mini-Boss และ Field Boss
- แสดงเวลานับถอยหลังและข้อมูลของบอส
- แสดงบอส Mini-Boss 3 คอลัมน์บนจอกว้าง พร้อมรายละเอียดท่าโจมตีและการ์ด 5★ จาก Binder Town Wiki
- เล่นเสียงแจ้งเตือนเมื่อบอสใกล้เกิด โดยเปิดหรือปิดเสียงได้
- บันทึกเวลาเกิดบอสพร้อมชื่อผู้บันทึก
- เมื่อรันผ่านเซิร์ฟเวอร์ Node.js ข้อมูลเวลาจะบันทึกไว้ที่ `data/timers.json`
- หากเปิดใช้งานแบบเว็บสแตติก ระบบจะบันทึกข้อมูลไว้ในเบราว์เซอร์นี้

## เวอร์ชันบนเว็บไซต์

ใช้งานบนเว็บไซต์ <span style="font-size:1.08em;"><a href="https://TH-CrimsonX.github.io/Binder-Town/Boss-Timer/">🔗 คลิกที่นี่</a></span>

## สิ่งที่ต้องมี

- [Node.js](https://nodejs.org/) เวอร์ชัน 18 ขึ้นไป
- npm (ติดตั้งมาพร้อม Node.js)

## รันบนเครื่อง (Local)

เปิด Terminal หรือ PowerShell ที่โฟลเดอร์หลักของ repository แล้วเข้าไปยังโฟลเดอร์โปรเจกต์:

```powershell
cd "Boss-Timer"
npm install
npm start
```

จากนั้นเปิด <http://localhost:3000> ในเบราว์เซอร์

ต้องเปิดหน้าต่าง Terminal ที่รันเซิร์ฟเวอร์ค้างไว้ขณะใช้งาน หากต้องการเปลี่ยนพอร์ต ให้กำหนด environment variable `PORT` ก่อนสั่ง `npm start`

## การเผยแพร่บน GitHub

สามารถอัปโหลดโฟลเดอร์ `Boss-Timer` ทั้งโฟลเดอร์ขึ้น GitHub ได้ โดย `README.md` นี้ควรอยู่ที่โฟลเดอร์เดียวกับ `package.json` และ `server.js` ส่วน README หลักของ repository อยู่ที่โฟลเดอร์ราก

**GitHub Pages รองรับเฉพาะเว็บสแตติกและไม่สามารถรัน `server.js` ได้** หากเผยแพร่ด้วย GitHub Pages ระบบจะบันทึกเวลาไว้ในเบราว์เซอร์นี้เท่านั้น

## ข้อมูลและความเป็นส่วนตัว

- เวลาเกิดบอสที่บันทึกผ่านเซิร์ฟเวอร์จะถูกเก็บใน `data/timers.json`
- รายการบันทึกมีชื่อผู้บันทึกและ IP ที่เซิร์ฟเวอร์ตรวจพบ รวมถึงเวลาที่อัปเดต ตรวจสอบไฟล์นี้ก่อนอัปโหลด โดยเฉพาะเมื่อ repository เป็นสาธารณะ และลบข้อมูลที่ไม่ต้องการเผยแพร่
- ชื่อผู้บันทึกและข้อมูลสำรองของตัวจับเวลาบางส่วนถูกเก็บใน Local Storage ของเบราว์เซอร์
- เมื่อเปิดฟอร์ม ระบบพยายามระบุ IP สาธารณะผ่านบริการภายนอก `api.ipify.org`

## โครงสร้างไฟล์

```text
Boss-Timer/
├── README.md
├── app.js
├── bosses.json
├── index.html
├── package.json
├── server.js
├── styles.css
├── data/
│   └── timers.json
├── image/
│   └── Binder Town Map 2k PNG.png
└── sound/
    ├── มี Field Boss กำลังจะเกิดในอีกสามนาที.mp3
    ├── มี Mini Boss กำลังจะเกิดในอีกสามนาที.mp3
    └── มี Mini Boss กำลังจะเกิดในอีกหนึ่งนาที.mp3
```

## API

- `GET /api/health` — ตรวจสอบสถานะเซิร์ฟเวอร์
- `GET /api/bosses` — อ่านข้อมูลบอสและเวลาที่บันทึกไว้
- `POST /api/bosses/:slug` — บันทึกเวลาของบอส โดยส่ง JSON ที่มี `name`, `remainingHours`, `remainingMinutes` และ `remainingSeconds`

## เทคโนโลยี

- Node.js และ Express
- HTML, CSS และ JavaScript

---

Developer by CrimsonX
