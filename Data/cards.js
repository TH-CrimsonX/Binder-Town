const CARD_DATA = {
 "version": "ค่าการ์ดตามตัวเกม ณ 30 ต.ค. 2569 (อ้างอิง Binder Town Wiki)",
 "regions": {
  "A": "Valebrook",
  "B": "Ashford",
  "C": "Stormwall",
  "D": "Sanctum",
  "E": "Nacreon"
 },
 "slotsOpen": [
  12,
  18,
  25,
  32,
  40,
  50,
  60,
  70,
  85
 ],
 "loadCap": [
  [
   12,
   4
  ],
  [
   18,
   5
  ],
  [
   25,
   6
  ],
  [
   32,
   7
  ],
  [
   40,
   8
  ],
  [
   50,
   10
  ],
  [
   60,
   12
  ],
  [
   70,
   13
  ],
  [
   85,
   16
  ],
  [
   99,
   18
  ]
 ],
 "resonances": {
  "region": {
   "A": {
    "n": "Hearthland",
    "i": "Max HP +6% · Gold จากมอน +6%",
    "ii": "Max HP +6% · เรทดรอป +6%"
   },
   "B": {
    "n": "Emberheart",
    "i": "ATK +5% · MATK +5%",
    "ii": "ดาเมจคริ +6% · ATK +3% · MATK +3%"
   },
   "C": {
    "n": "Frostbound",
    "i": "ลดดาเมจที่ได้รับ 5%",
    "ii": "ลดดาเมจที่ได้รับ 4% · Max HP +8%"
   },
   "D": {
    "n": "Riftsight",
    "i": "คูลดาวน์สกิล −4% · โอกาสคริ +2%",
    "ii": "คูลดาวน์สกิล −3% · โอกาสคริ +2% · เรทดรอปวิญญาณมอน +15%"
   },
   "E": {
    "n": "Tidebound",
    "i": "ลดดาเมจที่ได้รับ 3% · ATK +3% · MATK +3%",
    "ii": "Max HP +6% · เรทดรอป +4% · คูลดาวน์สกิล −2%"
   }
  },
  "kin": {
   "Skitter": "Swarm Instinct — โอกาสคริ +2%",
   "Hound": "Pack Bond — สปีดตี +5%",
   "Thornling": "Bramble Pact — ดาเมจใส่มอนที่ติดดีบัฟ +8%",
   "Brute": "Hide of Giants — Max HP +6%",
   "Crab": "Shellguard — เมื่อโดนดาเมจจากมอน: สะท้อนดาเมจกลับ 12%",
   "Pebblit": "Pebble Wall — ลดดาเมจที่ได้รับ 3%",
   "Sprout": "Deep Roots — VIT +3 · STR +3",
   "Lurker": "Mire Ambush — ดาเมจใส่มอนที่ HP > 90% +10%",
   "Wisp": "Will-o'-Chorus — MATK +5%",
   "Remnant": "Echoing Oath — คูลดาวน์สกิล −4%"
  },
  "color": {
   "Attack": "Crimson Mastery (3 ใบ ★3+) — ATK +3% · MATK +3%",
   "Guard": "Azure Mastery (3 ใบ ★3+) — ลดดาเมจที่ได้รับ 3% · Max HP +3%",
   "Growth": "Verdant Mastery (3 ใบ ★3+) — Gold จากมอน +5% · เรทดรอป +3% · เวลา Gathering / ตกปลา −3%",
   "Spirit": "Violet Mastery (3 ใบ ★3+) — คูลดาวน์สกิล −3% · โอกาสคริ +1%",
   "Legendary": "Sovereign Mastery (2 ใบ ★3+) — ดาเมจใส่ Field Boss +8% · Max HP +4%"
  }
 },
 "cards": [
  {
   "id": "sprout",
   "n": "Sprout",
   "col": "Growth",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "VIT +1"
  },
  {
   "id": "skitter",
   "n": "Skitter",
   "col": "Attack",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "โอกาสคริ +1%"
  },
  {
   "id": "acorn_skitter",
   "n": "Acorn Skitter",
   "col": "Attack",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "ดาเมจใส่สาย Sprout +6%"
  },
  {
   "id": "reed_skipper",
   "n": "Reed Skipper",
   "col": "Attack",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "ดาเมจใส่มอนที่ HP &gt; 90% +3.6%"
  },
  {
   "id": "wisp",
   "n": "Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "MATK +1%"
  },
  {
   "id": "lantern_moth",
   "n": "Lantern Moth",
   "col": "Growth",
   "load": 1,
   "cost": 3000,
   "region": "D",
   "fx": "LUK +1"
  },
  {
   "id": "clover_sprout",
   "n": "Clover Sprout",
   "col": "Growth",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "เวลา Gathering / ตกปลา −3%"
  },
  {
   "id": "elder_sprout",
   "n": "Elder Sprout",
   "col": "Growth",
   "load": 2,
   "cost": 900,
   "region": "A",
   "fx": "เวลา Gathering / ตกปลา −4.5% · VIT +2 · Max HP +0.4%"
  },
  {
   "id": "hive_skitter",
   "n": "Hive Skitter",
   "col": "Attack",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "ดาเมจใส่สาย Thornling +5%"
  },
  {
   "id": "thicket_stag",
   "n": "Thicket Stag",
   "col": "Guard",
   "load": 2,
   "cost": 900,
   "region": "A",
   "fx": "Max HP +2.8% · สปีดวิ่ง +1.4%"
  },
  {
   "id": "gloom_skitter",
   "n": "Gloom Skitter",
   "col": "Attack",
   "load": 1,
   "cost": 3000,
   "region": "D",
   "fx": "ช่วงกลางคืน: ดาเมจ +2.9%"
  },
  {
   "id": "pollen_wisp",
   "n": "Pollen Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "เมื่อสังหารมอน: ฮีล 0.8% Max HP"
  },
  {
   "id": "thornling",
   "n": "Thornling",
   "col": "Attack",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "ดาเมจใส่มอนที่ติดดีบัฟ +2.1%"
  },
  {
   "id": "gloom_wisp",
   "n": "Gloom Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "เมื่อสังหารมอน: ฟื้น MP 0.8% Max MP"
  },
  {
   "id": "willow_brute",
   "n": "Willow Brute",
   "col": "Guard",
   "load": 2,
   "cost": 900,
   "region": "A",
   "fx": "Max HP +3% · เมื่อสังหารมอน: ฮีล 0.4% Max HP"
  },
  {
   "id": "shrine_firefly",
   "n": "Shrine Firefly",
   "col": "Growth",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "Gold จากมอน +3%"
  },
  {
   "id": "spore_lantern",
   "n": "Spore Lantern",
   "col": "Growth",
   "load": 1,
   "cost": 3000,
   "region": "B",
   "fx": "สปีดวิ่ง +2.4%"
  },
  {
   "id": "river_wisp",
   "n": "River Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "เมื่อโจมตีโดน (12%): วิญญาณตีซ้ำ 8% ของดาเมจ (เวท)"
  },
  {
   "id": "bloom_crowned_stag",
   "n": "Bloom Crowned Stag",
   "col": "Attack",
   "load": 5,
   "cost": 60,
   "region": "A",
   "fx": "Spring Bloom · เมื่อสังหารมอน: ฮีลตัวเองและปาร์ตี้ในระยะ 8 ช่อง 6% Max HP (ทุก 15 วิ) · สปีดวิ่ง +3%"
  },
  {
   "id": "snipcrab",
   "n": "Snipcrab",
   "col": "Guard",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "เมื่อโดนดาเมจจากมอน: สะท้อนดาเมจกลับ 8%"
  },
  {
   "id": "fern_thornling",
   "n": "Fern Thornling",
   "col": "Attack",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "เมื่อคริ (35%): เลือดไหล 10% ของดาเมจใน 3 วิ"
  },
  {
   "id": "moss_crab",
   "n": "Moss Crab",
   "col": "Guard",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "ลดดาเมจที่ได้รับจากสาย Skitter 6.5%"
  },
  {
   "id": "rock_skitter",
   "n": "Rock Skitter",
   "col": "Attack",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "ดาเมจใส่สาย Brute +5%"
  },
  {
   "id": "burrow_skitter",
   "n": "Burrow Skitter",
   "col": "Attack",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "ดาเมจใส่มอนที่ HP &gt; 90% +3%"
  },
  {
   "id": "tide_brute",
   "n": "Tide Brute",
   "col": "Guard",
   "load": 2,
   "cost": 900,
   "region": "A",
   "fx": "Max HP +3.7%"
  },
  {
   "id": "pebblit",
   "n": "Pebblit",
   "col": "Guard",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "ลดดาเมจที่ได้รับ 1%"
  },
  {
   "id": "brute",
   "n": "Brute",
   "col": "Guard",
   "load": 2,
   "cost": 900,
   "region": "A",
   "fx": "เมื่อโดนดาเมจ (12%): ลดดาเมจที่ได้รับ 8% นาน 4 วิ"
  },
  {
   "id": "moss_brute",
   "n": "Moss Brute",
   "col": "Guard",
   "load": 2,
   "cost": 900,
   "region": "A",
   "fx": "เมื่อโดนดาเมจขณะ HP &lt; 40%: ฮีล 9% ทันที (ทุก 45 วิ) · ลดดาเมจที่ได้รับ 1.1%"
  },
  {
   "id": "copper_pebblit",
   "n": "Copper Pebblit",
   "col": "Guard",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "ช่วงกลางคืน: ลดดาเมจที่ได้รับ 3.2%"
  },
  {
   "id": "hill_hound",
   "n": "Hill Hound",
   "col": "Attack",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "ดาเมจใส่สาย Pebblit +5%"
  },
  {
   "id": "quarry_brute",
   "n": "Quarry Brute",
   "col": "Guard",
   "load": 2,
   "cost": 900,
   "region": "A",
   "fx": "ลดดาเมจที่ได้รับ 1.5% · ลดดาเมจที่ได้รับจาก Boss / Mini-boss 2%"
  },
  {
   "id": "dust_wisp",
   "n": "Dust Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 3000,
   "region": "A",
   "fx": "เมื่อสังหารมอน: ฟื้น MP 1% Max MP"
  },
  {
   "id": "remnant",
   "n": "Remnant",
   "col": "Spirit",
   "load": 2,
   "cost": 900,
   "region": "A",
   "fx": "MATK +2% · คูลดาวน์สกิล −1%"
  },
  {
   "id": "copper_brute",
   "n": "Copper Brute",
   "col": "Guard",
   "load": 2,
   "cost": 900,
   "region": "A",
   "fx": "ลดดาเมจที่ได้รับจาก Boss / Mini-boss 4.5% · ลดดาเมจที่ได้รับ 0.6%"
  },
  {
   "id": "field_sprout",
   "n": "Field Sprout",
   "col": "Growth",
   "load": 1,
   "cost": 3000,
   "region": "B",
   "fx": "STR +1"
  },
  {
   "id": "prism_shell_sovereign",
   "n": "Prism Shell Sovereign",
   "col": "Attack",
   "load": 5,
   "cost": 60,
   "region": "A",
   "fx": "Prism Ward · เมื่อโดนดาเมจ: ได้โล่ 10% Max HP นาน 8 วิ (ทุก 25 วิ) · ลดดาเมจที่ได้รับ 2%"
  },
  {
   "id": "plains_skitter",
   "n": "Plains Skitter",
   "col": "Attack",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "ATK +1%"
  },
  {
   "id": "vale_keeper",
   "n": "Vale Keeper",
   "col": "Spirit",
   "load": 3,
   "cost": 216,
   "region": "A",
   "fx": "ดาเมจใส่ Elite / Mini-boss +7.5% · เมื่อสังหารมอน: ฮีล 0.6% Max HP"
  },
  {
   "id": "ash_hound",
   "n": "Ash Hound",
   "col": "Attack",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "เมื่อคริ (30%): สปีดตี +4% นาน 5 วิ"
  },
  {
   "id": "field_brute",
   "n": "Field Brute",
   "col": "Guard",
   "load": 2,
   "cost": 1080,
   "region": "B",
   "fx": "เมื่อโดนดาเมจจากมอน: สะท้อนดาเมจกลับ 15% · ลดดาเมจที่ได้รับ 0.5%"
  },
  {
   "id": "resin_sprout",
   "n": "Resin Sprout",
   "col": "Growth",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "LUK +1"
  },
  {
   "id": "gloom_sprout",
   "n": "Gloom Sprout",
   "col": "Growth",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "INT +1"
  },
  {
   "id": "tar_thornling",
   "n": "Tar Thornling",
   "col": "Attack",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "ดาเมจใส่สาย Hound +5%"
  },
  {
   "id": "corrupt_thornling",
   "n": "Corrupt Thornling",
   "col": "Attack",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "ดูดเลือด 0.5% ของดาเมจกายภาพ"
  },
  {
   "id": "sap_wisp",
   "n": "Sap Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "ดาเมจใส่สาย Thornling +6%"
  },
  {
   "id": "corrupt_treant",
   "n": "Corrupt Treant",
   "col": "Guard",
   "load": 2,
   "cost": 1080,
   "region": "B",
   "fx": "เมื่อสังหารมอน: ฮีล 0.7% Max HP · ลดดาเมจที่ได้รับ 1.1%"
  },
  {
   "id": "ember_wisp",
   "n": "Ember Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "เมื่อสังหารมอน: ศพระเบิดตีหมู่รอบๆ 1% ของ Max HP ตัวที่ตาย"
  },
  {
   "id": "pitch_brute",
   "n": "Pitch Brute",
   "col": "Guard",
   "load": 2,
   "cost": 1080,
   "region": "B",
   "fx": "เมื่อโดนดาเมจจากมอน: สะท้อนดาเมจกลับ 14% · Max HP +0.8% · เจาะเกราะ 1.5% (ไม่สน DEF / MDEF มอน)"
  },
  {
   "id": "sulfur_skitter",
   "n": "Sulfur Skitter",
   "col": "Attack",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "ดาเมจใส่สาย Crab +5%"
  },
  {
   "id": "ember_hound",
   "n": "Ember Hound",
   "col": "Attack",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "ดาเมจใส่สาย Remnant +5%"
  },
  {
   "id": "magma_pebblit",
   "n": "Magma Pebblit",
   "col": "Guard",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "เมื่อโดนดาเมจขณะ HP &lt; 40%: ฮีล 7.9% ทันที (ทุก 45 วิ)"
  },
  {
   "id": "salt_pebblit",
   "n": "Salt Pebblit",
   "col": "Guard",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "ลดดาเมจที่ได้รับจากสาย Wisp 6.5%"
  },
  {
   "id": "vent_wisp",
   "n": "Vent Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "เมื่อสังหารมอน: ศพระเบิดตีหมู่รอบๆ 1.1% ของ Max HP ตัวที่ตาย"
  },
  {
   "id": "cinder_plume_roc",
   "n": "Cinder Plume Roc",
   "col": "Attack",
   "load": 5,
   "cost": 65,
   "region": "B",
   "fx": "Phoenix Flame · เมื่อโดนดาเมจขณะ HP &lt; 25%: ฟื้น 15% Max HP + ระเบิดไฟใส่มอนรอบตัว (ทุก 2 นาที) · ATK +2%"
  },
  {
   "id": "bog_crab",
   "n": "Bog Crab",
   "col": "Guard",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "ลดดาเมจที่ได้รับจากสาย Brute 6.5%"
  },
  {
   "id": "cinder_brute",
   "n": "Cinder Brute",
   "col": "Guard",
   "load": 2,
   "cost": 1080,
   "region": "B",
   "fx": "ลดดาเมจที่ได้รับจาก Boss / Mini-boss 5.3% · ลดดาเมจที่ได้รับ 0.5%"
  },
  {
   "id": "bog_wisp",
   "n": "Bog Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "ดาเมจใส่สาย Lurker +6%"
  },
  {
   "id": "salt_brute",
   "n": "Salt Brute",
   "col": "Guard",
   "load": 2,
   "cost": 1080,
   "region": "B",
   "fx": "ช่วงกลางคืน: ลดดาเมจที่ได้รับ 4% · ลดดาเมจที่ได้รับ 1%"
  },
  {
   "id": "mire_lurker",
   "n": "Mire Lurker",
   "col": "Growth",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "AGI +1"
  },
  {
   "id": "peat_crab",
   "n": "Peat Crab",
   "col": "Guard",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "ลดดาเมจที่ได้รับ 1.1%"
  },
  {
   "id": "reed_lurker",
   "n": "Reed Lurker",
   "col": "Growth",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "เรทดรอป +2%"
  },
  {
   "id": "peat_wisp",
   "n": "Peat Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 3600,
   "region": "B",
   "fx": "ดาเมจใส่สาย Crab +6%"
  },
  {
   "id": "lotus_maw_matriarch",
   "n": "Lotus Maw Matriarch",
   "col": "Attack",
   "load": 5,
   "cost": 65,
   "region": "B",
   "fx": "Lotus Drain · เมื่อสังหารมอน: ดูด HP และ MP 1.5% · ดูดเลือด 1% ของดาเมจกายภาพ"
  },
  {
   "id": "mire_elder",
   "n": "Mire Elder",
   "col": "Growth",
   "load": 2,
   "cost": 1260,
   "region": "B",
   "fx": "เรทดรอป +3% · Max HP +1%"
  },
  {
   "id": "dusk_skitter",
   "n": "Dusk Skitter",
   "col": "Attack",
   "load": 1,
   "cost": 4200,
   "region": "B",
   "fx": "เมื่อคริ (35%): เลือดไหล 13% ของดาเมจใน 3 วิ"
  },
  {
   "id": "peat_elder",
   "n": "Peat Elder",
   "col": "Growth",
   "load": 2,
   "cost": 1260,
   "region": "B",
   "fx": "เวลา Gathering / ตกปลา −4.5% · Max HP +1% · เรทดรอป +1.2%"
  },
  {
   "id": "dusk_remnant",
   "n": "Dusk Remnant",
   "col": "Spirit",
   "load": 2,
   "cost": 1260,
   "region": "B",
   "fx": "ช่วงกลางคืน: ดาเมจ +5% · เมื่อโจมตีโดน (10%): เป้าโดนดาเมจแรงขึ้น +3% นาน 4 วิ"
  },
  {
   "id": "gate_brute",
   "n": "Gate Brute",
   "col": "Guard",
   "load": 2,
   "cost": 1260,
   "region": "B",
   "fx": "ลดดาเมจที่ได้รับจากสาย Hound 9.2% · ลดดาเมจที่ได้รับ 1%"
  },
  {
   "id": "dusk_herald",
   "n": "Dusk Herald",
   "col": "Spirit",
   "load": 3,
   "cost": 252,
   "region": "B",
   "fx": "ช่วงกลางคืน: ดาเมจ +6% · เมื่อสังหารมอน: ศพระเบิดตีหมู่รอบๆ 2% ของ Max HP ตัวที่ตาย"
  },
  {
   "id": "frost_skitter",
   "n": "Frost Skitter",
   "col": "Attack",
   "load": 1,
   "cost": 4200,
   "region": "C",
   "fx": "ดาเมจใส่สาย Crab +6%"
  },
  {
   "id": "drift_skitter",
   "n": "Drift Skitter",
   "col": "Attack",
   "load": 1,
   "cost": 4200,
   "region": "C",
   "fx": "ดาเมจคริ +2%"
  },
  {
   "id": "frost_wisp",
   "n": "Frost Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 4200,
   "region": "C",
   "fx": "เมื่อโจมตีโดน (8%): สโลว์เป้า 10% นาน 2 วิ"
  },
  {
   "id": "frost_fang",
   "n": "Frost Fang",
   "col": "Attack",
   "load": 1,
   "cost": 4200,
   "region": "C",
   "fx": "ดาเมจใส่สาย Wisp +5%"
  },
  {
   "id": "tusk_fang",
   "n": "Tusk Fang",
   "col": "Attack",
   "load": 1,
   "cost": 4200,
   "region": "C",
   "fx": "ดาเมจใส่สาย Lurker +5%"
  },
  {
   "id": "scree_pebblit",
   "n": "Scree Pebblit",
   "col": "Guard",
   "load": 1,
   "cost": 4200,
   "region": "C",
   "fx": "เมื่อโดนดาเมจจากมอน: สะท้อนดาเมจกลับ 9%"
  },
  {
   "id": "ice_otter",
   "n": "Ice Otter",
   "col": "Attack",
   "load": 1,
   "cost": 4200,
   "region": "C",
   "fx": "เมื่อโจมตีโดน (12%): วิญญาณตีซ้ำ 10% ของดาเมจ (เวท)"
  },
  {
   "id": "rime_brute",
   "n": "Rime Brute",
   "col": "Guard",
   "load": 2,
   "cost": 1260,
   "region": "C",
   "fx": "ลดดาเมจที่ได้รับจากสาย Wisp 9.2% · ลดดาเมจที่ได้รับ 1%"
  },
  {
   "id": "gully_brute",
   "n": "Gully Brute",
   "col": "Guard",
   "load": 2,
   "cost": 1260,
   "region": "C",
   "fx": "ลดดาเมจที่ได้รับจากสาย Skitter 9.2% · ลดดาเมจที่ได้รับ 1%"
  },
  {
   "id": "frost_crab",
   "n": "Frost Crab",
   "col": "Guard",
   "load": 1,
   "cost": 4200,
   "region": "C",
   "fx": "ช่วงกลางคืน: ลดดาเมจที่ได้รับ 3.6%"
  },
  {
   "id": "ice_wisp",
   "n": "Ice Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 4200,
   "region": "C",
   "fx": "คูลดาวน์สกิล −1%"
  },
  {
   "id": "brine_crab",
   "n": "Brine Crab",
   "col": "Guard",
   "load": 1,
   "cost": 4200,
   "region": "C",
   "fx": "Max HP +1.5%"
  },
  {
   "id": "floe_wisp",
   "n": "Floe Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 4200,
   "region": "C",
   "fx": "MATK +1.1%"
  },
  {
   "id": "crust_lurker",
   "n": "Crust Lurker",
   "col": "Growth",
   "load": 1,
   "cost": 4200,
   "region": "C",
   "fx": "VIT +1"
  },
  {
   "id": "aurora_antler_regent",
   "n": "Aurora Antler Regent",
   "col": "Attack",
   "load": 5,
   "cost": 70,
   "region": "C",
   "fx": "Polar Night · เมื่อโจมตีโดน (15%): แช่แข็งเป้า 1.2 วิ + สโลว์มอนรอบเป้า 20% (ไม่ใช้กับ Boss / Mini-boss) · MATK +2%"
  },
  {
   "id": "mere_lurker",
   "n": "Mere Lurker",
   "col": "Growth",
   "load": 2,
   "cost": 1260,
   "region": "C",
   "fx": "เรทดรอปวิญญาณมอน +9.4%"
  },
  {
   "id": "gale_wisp",
   "n": "Gale Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 4800,
   "region": "C",
   "fx": "สปีดตี +1.5%"
  },
  {
   "id": "steppe_hound",
   "n": "Steppe Hound",
   "col": "Attack",
   "load": 1,
   "cost": 4800,
   "region": "C",
   "fx": "ดาเมจใส่สาย Skitter +5%"
  },
  {
   "id": "floe_brute",
   "n": "Floe Brute",
   "col": "Guard",
   "load": 2,
   "cost": 1440,
   "region": "C",
   "fx": "เมื่อโดนดาเมจขณะ HP &lt; 40%: ฮีล 11% ทันที (ทุก 45 วิ) · เมื่อโดนดาเมจจากมอน: สะท้อนดาเมจกลับ 8%"
  },
  {
   "id": "storm_harpy",
   "n": "Storm Harpy",
   "col": "Attack",
   "load": 1,
   "cost": 4800,
   "region": "C",
   "fx": "เมื่อโจมตีโดน (10%): สายฟ้าเชนใส่มอนข้างๆ 3 เด้ง 6.4% ของดาเมจ ลดลงทุกเด้ง"
  },
  {
   "id": "kite_harpy",
   "n": "Kite Harpy",
   "col": "Attack",
   "load": 1,
   "cost": 4800,
   "region": "C",
   "fx": "สปีดตี +1.5%"
  },
  {
   "id": "sky_wisp",
   "n": "Sky Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 4800,
   "region": "C",
   "fx": "ดาเมจใส่ Elite / Mini-boss +3%"
  },
  {
   "id": "terrace_skitter",
   "n": "Terrace Skitter",
   "col": "Attack",
   "load": 1,
   "cost": 4800,
   "region": "C",
   "fx": "ดาเมจใส่มอนที่ HP &gt; 90% +3.3%"
  },
  {
   "id": "storm_remnant",
   "n": "Storm Remnant",
   "col": "Spirit",
   "load": 2,
   "cost": 1440,
   "region": "C",
   "fx": "เมื่อโจมตีโดน (10%): สายฟ้าเชนใส่มอนข้างๆ 3 เด้ง 11% ของดาเมจ ลดลงทุกเด้ง · สปีดตี +0.8%"
  },
  {
   "id": "chime_wisp",
   "n": "Chime Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 4800,
   "region": "C",
   "fx": "เมื่อโจมตีโดน (12%): วิญญาณตีซ้ำ 9% ของดาเมจ (เวท)"
  },
  {
   "id": "golden_sentinel",
   "n": "Golden Sentinel",
   "col": "Spirit",
   "load": 2,
   "cost": 1440,
   "region": "D",
   "fx": "Gold จากมอน +4% · เรทดรอป +2%"
  },
  {
   "id": "tempest_kite_empress",
   "n": "Tempest Kite Empress",
   "col": "Attack",
   "load": 5,
   "cost": 75,
   "region": "C",
   "fx": "Storm Call · เมื่อโจมตีโดน (20%): ฟ้าผ่ามอนรอบเป้าสูงสุด 4 ตัว 60% ของดาเมจ (เวท) · สปีดตี +3%"
  },
  {
   "id": "cloud_brute",
   "n": "Cloud Brute",
   "col": "Guard",
   "load": 2,
   "cost": 1440,
   "region": "C",
   "fx": "ลดดาเมจที่ได้รับจากสาย Remnant 9.2% · ลดดาเมจที่ได้รับ 1%"
  },
  {
   "id": "terrace_sentinel",
   "n": "Terrace Sentinel",
   "col": "Spirit",
   "load": 2,
   "cost": 1440,
   "region": "C",
   "fx": "ดาเมจใส่ Elite / Mini-boss +6% · คูลดาวน์สกิล −0.8%"
  },
  {
   "id": "sky_sentinel",
   "n": "Sky Sentinel",
   "col": "Spirit",
   "load": 3,
   "cost": 288,
   "region": "C",
   "fx": "ดาเมจใส่ Field Boss +7.6% · โอกาสคริ +1.3% · เจาะเกราะ 2% (ไม่สน DEF / MDEF มอน)"
  },
  {
   "id": "glass_sprout",
   "n": "Glass Sprout",
   "col": "Growth",
   "load": 1,
   "cost": 4800,
   "region": "D",
   "fx": "INT +1"
  },
  {
   "id": "vale_sprout",
   "n": "Vale Sprout",
   "col": "Growth",
   "load": 1,
   "cost": 4800,
   "region": "D",
   "fx": "DEX +1"
  },
  {
   "id": "shard_thornling",
   "n": "Shard Thornling",
   "col": "Attack",
   "load": 1,
   "cost": 4800,
   "region": "D",
   "fx": "ดาเมจคริ +2.3%"
  },
  {
   "id": "wrack_skitter",
   "n": "Wrack Skitter",
   "col": "Attack",
   "load": 1,
   "cost": 4800,
   "region": "D",
   "fx": "เมื่อโจมตีโดน (10%): เป้าโดนดาเมจแรงขึ้น +3.6% นาน 4 วิ"
  },
  {
   "id": "void_wisp",
   "n": "Void Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 4800,
   "region": "D",
   "fx": "ดาเมจใส่ Field Boss +3.5%"
  },
  {
   "id": "glass_crab",
   "n": "Glass Crab",
   "col": "Guard",
   "load": 1,
   "cost": 4800,
   "region": "D",
   "fx": "ลดดาเมจที่ได้รับจาก Boss / Mini-boss 2.5%"
  },
  {
   "id": "abyss_jelly",
   "n": "Abyss Jelly",
   "col": "Growth",
   "load": 1,
   "cost": 4800,
   "region": "D",
   "fx": "เมื่อสังหารมอน: สปีดวิ่ง +13% นาน 3 วิ · Max HP +0.4%"
  },
  {
   "id": "vale_remnant",
   "n": "Vale Remnant",
   "col": "Spirit",
   "load": 2,
   "cost": 1440,
   "region": "D",
   "fx": "เมื่อสังหารมอน: ฮีล 0.5% Max HP · MATK +1.2%"
  },
  {
   "id": "throne_guard",
   "n": "Throne Guard",
   "col": "Spirit",
   "load": 2,
   "cost": 1440,
   "region": "D",
   "fx": "ลดดาเมจที่ได้รับ 1.2% · เมื่อโดนดาเมจจากมอน: สะท้อนดาเมจกลับ 7.3%"
  },
  {
   "id": "shard_brute",
   "n": "Shard Brute",
   "col": "Guard",
   "load": 2,
   "cost": 1620,
   "region": "D",
   "fx": "ลดดาเมจที่ได้รับ 1.2% · เมื่อโดนดาเมจจากมอน: สะท้อนดาเมจกลับ 7.3%"
  },
  {
   "id": "wrack_brute",
   "n": "Wrack Brute",
   "col": "Guard",
   "load": 2,
   "cost": 1620,
   "region": "D",
   "fx": "Max HP +2.8% · เมื่อโดนดาเมจจากมอน: สะท้อนดาเมจกลับ 6%"
  },
  {
   "id": "opal_weaver_queen",
   "n": "Opal Weaver Queen",
   "col": "Attack",
   "load": 5,
   "cost": 80,
   "region": "D",
   "fx": "Web of Fate · เมื่อคริ (50%): ตรึงเป้า 2 วิ + เป้าโดนดาเมจแรงขึ้น +8% นาน 4 วิ · ดาเมจใส่มอนที่ติดดีบัฟ +6%"
  },
  {
   "id": "marrow_skitter",
   "n": "Marrow Skitter",
   "col": "Attack",
   "load": 1,
   "cost": 5400,
   "region": "D",
   "fx": "เมื่อคริ (35%): เลือดไหล 12% ของดาเมจใน 3 วิ"
  },
  {
   "id": "umbral_skitter",
   "n": "Umbral Skitter",
   "col": "Attack",
   "load": 1,
   "cost": 5400,
   "region": "D",
   "fx": "เมื่อโจมตีโดน (10%): เป้าโดนดาเมจแรงขึ้น +4% นาน 4 วิ"
  },
  {
   "id": "pit_lurker",
   "n": "Pit Lurker",
   "col": "Growth",
   "load": 1,
   "cost": 5400,
   "region": "D",
   "fx": "สปีดวิ่ง +2.2%"
  },
  {
   "id": "tallow_wisp",
   "n": "Tallow Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 5400,
   "region": "D",
   "fx": "ช่วงกลางคืน: ดาเมจ +2.9%"
  },
  {
   "id": "umbral_horror",
   "n": "Umbral Horror",
   "col": "Attack",
   "load": 2,
   "cost": 1620,
   "region": "D",
   "fx": "ขณะ HP &lt; 35%: ดาเมจ +8% · โอกาสคริ +1% · เจาะเกราะ 1.5% (ไม่สน DEF / MDEF มอน)"
  },
  {
   "id": "depth_brute",
   "n": "Depth Brute",
   "col": "Guard",
   "load": 2,
   "cost": 1620,
   "region": "D",
   "fx": "เมื่อโดนดาเมจขณะ HP &lt; 40%: ฮีล 11% ทันที (ทุก 45 วิ) · ลดดาเมจที่ได้รับจาก Boss / Mini-boss 4.1%"
  },
  {
   "id": "marrow_horror",
   "n": "Marrow Horror",
   "col": "Attack",
   "load": 2,
   "cost": 1620,
   "region": "D",
   "fx": "ขณะ HP &lt; 35%: ดาเมจ +8% · โอกาสคริ +1.4% · เจาะเกราะ 1% (ไม่สน DEF / MDEF มอน)"
  },
  {
   "id": "rust_remnant",
   "n": "Rust Remnant",
   "col": "Spirit",
   "load": 1,
   "cost": 5400,
   "region": "D",
   "fx": "MATK +1%"
  },
  {
   "id": "muster_hound",
   "n": "Muster Hound",
   "col": "Attack",
   "load": 1,
   "cost": 5400,
   "region": "D",
   "fx": "ATK +1.1%"
  },
  {
   "id": "lamp_wisp",
   "n": "Lamp Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 5400,
   "region": "D",
   "fx": "Gold จากมอน +3%"
  },
  {
   "id": "vale_warden",
   "n": "Vale Warden",
   "col": "Attack",
   "load": 5,
   "cost": 80,
   "region": "D",
   "fx": "Warden's Judgment · เมื่อสังหารมอน: สกิลดาเมจครั้งถัดไปแรงขึ้น +40% (ทุก 20 วิ) · Max HP +4%"
  },
  {
   "id": "rust_captain",
   "n": "Rust Captain",
   "col": "Spirit",
   "load": 2,
   "cost": 1620,
   "region": "D",
   "fx": "ดาเมจใส่ Field Boss +6% · ลดดาเมจที่ได้รับ 1%"
  },
  {
   "id": "barnacle_remnant",
   "n": "Barnacle Remnant",
   "col": "Guard",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "ลดดาเมจที่ได้รับ 1%"
  },
  {
   "id": "anchor_crab",
   "n": "Anchor Crab",
   "col": "Guard",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "ลดดาเมจที่ได้รับจากสาย Remnant 9%"
  },
  {
   "id": "gull_harpy",
   "n": "Gull Harpy",
   "col": "Attack",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "สปีดตี +1.6%"
  },
  {
   "id": "drowned_bosun",
   "n": "Drowned Bosun",
   "col": "Guard",
   "load": 2,
   "cost": 1620,
   "region": "E",
   "fx": "ดาเมจใส่ Elite / Mini-boss +6% · Max HP +1%"
  },
  {
   "id": "straw_thornling",
   "n": "Straw Thornling",
   "col": "Attack",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "ดาเมจใส่มอนที่ HP &gt; 90% +3.4%"
  },
  {
   "id": "lantern_skitter",
   "n": "Lantern Skitter",
   "col": "Spirit",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "ช่วงกลางคืน: ดาเมจ +3%"
  },
  {
   "id": "brass_mimic",
   "n": "Brass Mimic",
   "col": "Spirit",
   "load": 2,
   "cost": 1620,
   "region": "E",
   "fx": "Gold จากมอน +4.4% · เรทดรอป +1.3%"
  },
  {
   "id": "reed_crane",
   "n": "Reed Crane",
   "col": "Attack",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "ดาเมจใส่สาย Skitter +6%"
  },
  {
   "id": "coral_pebblit",
   "n": "Coral Pebblit",
   "col": "Guard",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "เมื่อโดนดาเมจจากมอน: สะท้อนดาเมจกลับ 11%"
  },
  {
   "id": "hullbreaker_kraken",
   "n": "Hullbreaker Kraken",
   "col": "Guard",
   "load": 3,
   "cost": 324,
   "region": "E",
   "fx": "ลดดาเมจที่ได้รับจาก Boss / Mini-boss 7% · Max HP +1.7% · เมื่อโดนดาเมจจากมอน: สะท้อนดาเมจกลับ 12%"
  },
  {
   "id": "paddy_brute",
   "n": "Paddy Brute",
   "col": "Guard",
   "load": 2,
   "cost": 1620,
   "region": "E",
   "fx": "เมื่อโดนดาเมจขณะ HP &lt; 40%: ฮีล 11% ทันที (ทุก 45 วิ) · ลดดาเมจที่ได้รับจาก Boss / Mini-boss 4.3%"
  },
  {
   "id": "shell_remnant",
   "n": "Shell Remnant",
   "col": "Guard",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "ลดดาเมจที่ได้รับจาก Boss / Mini-boss 4.2%"
  },
  {
   "id": "pearl_wisp",
   "n": "Pearl Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "MATK +1.2% · Spell Amp 0.8% (ดาเมจสกิลเวท)"
  },
  {
   "id": "paddy_ox",
   "n": "Paddy Ox",
   "col": "Guard",
   "load": 2,
   "cost": 1620,
   "region": "E",
   "fx": "Max HP +1.4% · เมื่อสังหารมอน: ฮีล 0.5% Max HP · ลดดาเมจที่ได้รับ 1%"
  },
  {
   "id": "coral_brute",
   "n": "Coral Brute",
   "col": "Attack",
   "load": 2,
   "cost": 1620,
   "region": "E",
   "fx": "Max HP +1.8% · ขณะ HP &lt; 35%: ดาเมจ +9%"
  },
  {
   "id": "bronze_remnant",
   "n": "Bronze Remnant",
   "col": "Guard",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "ช่วงกลางคืน: ลดดาเมจที่ได้รับ 3.8%"
  },
  {
   "id": "kite_drake",
   "n": "Kite Drake",
   "col": "Attack",
   "load": 3,
   "cost": 324,
   "region": "E",
   "fx": "ATK +2% · MATK +2% · ช่วงกลางคืน: ดาเมจ +3%"
  },
  {
   "id": "mirror_merchant",
   "n": "Mirror Merchant",
   "col": "Spirit",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "Gold จากมอน +3.2%"
  },
  {
   "id": "vase_lurker",
   "n": "Vase Lurker",
   "col": "Attack",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "เมื่อโจมตีโดน (10%): เป้าโดนดาเมจแรงขึ้น +3.8% นาน 4 วิ"
  },
  {
   "id": "ammonite_crawler",
   "n": "Ammonite Crawler",
   "col": "Attack",
   "load": 2,
   "cost": 1620,
   "region": "E",
   "fx": "เจาะเกราะ 1.6% (ไม่สน DEF / MDEF มอน) · โอกาสคริ +1% · ดาเมจใส่มอนที่ HP &gt; 90% +2.4%"
  },
  {
   "id": "coralback_tortoise",
   "n": "Coralback Tortoise",
   "col": "Guard",
   "load": 3,
   "cost": 324,
   "region": "E",
   "fx": "ลดดาเมจที่ได้รับ 1.9% · เมื่อโดนดาเมจขณะ HP &lt; 40%: ฮีล 14% ทันที (ทุก 45 วิ) · เมื่อสังหารมอน: ฮีล 0.6% Max HP"
  },
  {
   "id": "compass_wisp",
   "n": "Compass Wisp",
   "col": "Spirit",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "สปีดวิ่ง +1.8% · เรทดรอป +0.8%"
  },
  {
   "id": "forum_sentinel",
   "n": "Forum Sentinel",
   "col": "Spirit",
   "load": 2,
   "cost": 1620,
   "region": "E",
   "fx": "ดาเมจใส่ Elite / Mini-boss +6.2% · คูลดาวน์สกิล −0.8%"
  },
  {
   "id": "thunder_harpy",
   "n": "Thunder Harpy",
   "col": "Attack",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "เมื่อโจมตีโดน (10%): สายฟ้าเชนใส่มอนข้างๆ 3 เด้ง 6.6% ของดาเมจ ลดลงทุกเด้ง"
  },
  {
   "id": "drowned_senator",
   "n": "Drowned Senator",
   "col": "Spirit",
   "load": 2,
   "cost": 1620,
   "region": "E",
   "fx": "MATK +1.6% · คูลดาวน์สกิล −0.8%"
  },
  {
   "id": "fountain_serpent",
   "n": "Fountain Serpent",
   "col": "Spirit",
   "load": 3,
   "cost": 324,
   "region": "E",
   "fx": "MATK +2.2% · เมื่อสังหารมอน: ฮีล 0.7% Max HP · เรทดรอปวิญญาณมอน +4.4%"
  },
  {
   "id": "tram_remnant",
   "n": "Tram Remnant",
   "col": "Spirit",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "เมื่อสังหารมอน: ฟื้น MP 1.4% Max MP"
  },
  {
   "id": "slag_skitter",
   "n": "Slag Skitter",
   "col": "Attack",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "ดาเมจใส่มอนที่ติดดีบัฟ +2%"
  },
  {
   "id": "rivet_golem",
   "n": "Rivet Golem",
   "col": "Guard",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "ลดดาเมจที่ได้รับ 1%"
  },
  {
   "id": "plate_turtle",
   "n": "Plate Turtle",
   "col": "Guard",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "เมื่อโดนดาเมจขณะ HP &lt; 40%: ฮีล 11% ทันที (ทุก 45 วิ)"
  },
  {
   "id": "rail_brute",
   "n": "Rail Brute",
   "col": "Attack",
   "load": 2,
   "cost": 1620,
   "region": "E",
   "fx": "ดาเมจใส่ Field Boss +6.2% · โอกาสคริ +1%"
  },
  {
   "id": "hollow_caster",
   "n": "Hollow Caster",
   "col": "Spirit",
   "load": 1,
   "cost": 5400,
   "region": "E",
   "fx": "MATK +1.2% · Spell Amp 0.8% (ดาเมจสกิลเวท)"
  },
  {
   "id": "spark_eel",
   "n": "Spark Eel",
   "col": "Attack",
   "load": 2,
   "cost": 1620,
   "region": "E",
   "fx": "เมื่อสังหารมอน: ศพระเบิดตีหมู่รอบๆ 1.4% ของ Max HP ตัวที่ตาย · สปีดตี +1%"
  },
  {
   "id": "stationmaster_automaton",
   "n": "Stationmaster Automaton",
   "col": "Spirit",
   "load": 3,
   "cost": 324,
   "region": "E",
   "fx": "คูลดาวน์สกิล −1.2% · สปีดตี +1.2% · ดาเมจใส่ Field Boss +5%"
  },
  {
   "id": "furnace_warden",
   "n": "Furnace Warden",
   "col": "Attack",
   "load": 2,
   "cost": 1620,
   "region": "E",
   "fx": "ATK +1.6% · เมื่อโดนดาเมจจากมอน: สะท้อนดาเมจกลับ 10%"
  },
  {
   "id": "crucible_hound",
   "n": "Crucible Hound",
   "col": "Attack",
   "load": 2,
   "cost": 1620,
   "region": "E",
   "fx": "โอกาสคริ +1% · ดาเมจคริ +2% · ดาเมจใส่มอนที่ HP &gt; 90% +2.4%"
  },
  {
   "id": "forge_hermit",
   "n": "Forge Hermit",
   "col": "Spirit",
   "load": 3,
   "cost": 324,
   "region": "E",
   "fx": "เจาะเกราะ 2% (ไม่สน DEF / MDEF มอน) · Max HP +1.7% · ATK +2%"
  }
 ]
};
