<p align="right">
  <a href="https://github.com/TH-CrimsonX/Binder-Town"><img src="https://img.shields.io/github/stars/TH-CrimsonX/Binder-Town?style=for-the-badge&logo=github&logoColor=white&color=242938" alt="GitHub stars"></a>
  <a href="https://github.com/TH-CrimsonX/Binder-Town/commits"><img src="https://img.shields.io/github/last-commit/TH-CrimsonX/Binder-Town?style=for-the-badge&logo=git&logoColor=white&color=343b52" alt="Last commit"></a>
  <img src="https://img.shields.io/badge/Node.js-18%2B-43853d?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js 18+">
  <img src="https://img.shields.io/badge/Express-Backend-343b52?style=for-the-badge&logo=express&logoColor=white" alt="Express backend">
</p>

<p align="center">
  <img src="https://wiki.bindertowngame.com/img/ui/logo.png" alt="Binder Town Logo" width="88">
</p>

<h1 align="center">Binder Town Boss Timer</h1>

<p align="center">เว็บติดตามเวลาบอส พร้อมเสียงแจ้งเตือนสำหรับเกม Binder Town</br>โดยสามารถเข้าเล่นเกมได้ที่ <span style="font-size:1.08em;"><a href="https://play.bindertowngame.com/">https://play.bindertowngame.com/</a></p>

## ความสามารถ

- แสดงบอส Elite, Mini-Boss และ Field Boss พร้อมเวลานับถอยหลัง
- ตั้งเวลาเกิดบอสและบันทึกเวลา
- แจ้งเตือนด้วยเสียงเมื่อบอสใกล้เกิด

## เวอร์ชันบนเว็บไซต์

ใช้งานบนเว็บไซต์ <span style="font-size:1.08em;">🔗 <a href="https://TH-CrimsonX.github.io/Binder-Town/Boss-Timer/">คลิกที่นี่</a></span>

## รันบนเครื่อง (Local)

ต้องติดตั้ง [Node.js](https://nodejs.org/) ก่อน จากนั้นเปิด Terminal ในโฟลเดอร์โปรเจกต์และรัน:

```powershell
cd Boss-Timer
npm install
npm start
```

เปิด <http://localhost:3000> เพื่อใช้งาน

> หากเปิดผ่าน GitHub Pages ระบบจะแสดงข้อมูลบอสและบันทึกเวลาไว้เฉพาะในเบราว์เซอร์นี้ เพราะ GitHub Pages ไม่รองรับเซิร์ฟเวอร์ Node.js

## โครงสร้างไฟล์

```text
Binder-Town/
├── index.html
├── README.md
└── Boss-Timer/
    ├── README.md
    ├── app.js
    ├── bosses.json
    ├── index.html
    ├── package-lock.json
    ├── package.json
    ├── server.js
    ├── styles.css
    ├── data/
    │   └── timers.json
    ├── image/
    │   └── Binder Town Map 2k PNG.png
    └── sound/
        ├── มี Field Boss กำลังจะเกิดในอีกสามนาที.mp3
        └── มี Mini Boss กำลังจะเกิดในอีกหนึ่งนาที.mp3
```

> ผังนี้ไม่แสดงโฟลเดอร์ `.git` และ `node_modules`

---

<p align="center">Developed by <img src="https://avatars.githubusercontent.com/u/96268091?v=4" alt="CrimsonX avatar" width="20" height="20" align="absmiddle"> <strong>CrimsonX</strong></p>