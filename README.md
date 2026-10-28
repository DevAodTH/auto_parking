# AUTO PARKING — Frontend

ระบบจัดการที่จอดรถ (ชื่อบน UI ตอนนี้ใช้ **ParkPlan** · ชื่อแบรนด์ยังรอตัดสินใจ)
ใช้กล้องอ่านป้ายทะเบียนแทนบัตรจอด มี 3 ฝั่ง:

| ฝั่ง | ผู้ใช้ | อุปกรณ์ |
|---|---|---|
| **Admin Web** | เจ้าหน้าที่ / ผู้ดูแลระบบ | Desktop (ออกแบบที่ 1440px) |
| **Customer Web** | ลูกค้าที่มาจอด (สแกน QR → ค้นทะเบียน → จ่าย PromptPay) | มือถือ (ออกแบบที่ 390px) |
| **Kiosk** | จอที่ทางเข้า / ทางออก | จอ 1920×1080 |

> **ขอบเขตตอนนี้: หน้าบ้านอย่างเดียว** ยังไม่มี backend ข้อมูลทั้งหมดเป็น mock (JSON ใน `src/db/`)

---

## สารบัญ

1. [เริ่มต้นใช้งาน](#1-เริ่มต้นใช้งาน)
2. [Tech stack](#2-tech-stack)
3. [โครงสร้างโปรเจกต์](#3-โครงสร้างโปรเจกต์)
4. [Routes ↔ Figma ↔ ผู้รับผิดชอบ](#4-routes--figma--ผู้รับผิดชอบ)
5. [ก่อนลงมือทำฟังก์ชัน: อ่าน Figma ก่อน](#5-ก่อนลงมือทำฟังก์ชัน-อ่าน-figma-ก่อน)
6. [Figma อ้างอิงรายหน้า](#6-figma-อ้างอิงรายหน้า)
7. [กติกาการเขียนโค้ด](#7-กติกาการเขียนโค้ด)
8. [Mock data](#8-mock-data)
9. [Git และ Pull Request](#9-git-และ-pull-request)
10. [เรื่องที่ยังรอตัดสินใจ](#10-เรื่องที่ยังรอตัดสินใจ)

---

## 1. เริ่มต้นใช้งาน

ต้องใช้ **Node.js 20.9 ขึ้นไป**

```bash
npm install
npm run dev        # http://localhost:3000
npm run build      # build สำหรับ production
npm run start      # รันเวอร์ชันที่ build แล้ว (ต้อง npm run build ก่อน) http://localhost:3000
npm run lint       # ตรวจโค้ดด้วย ESLint
```

หน้าเริ่มต้นที่ควรลองเปิด:

| URL | หน้า |
|---|---|
| `/login` | เข้าสู่ระบบ (บัญชีตัวอย่างอยู่ใน `src/db/user.json`) |
| `/dashboard` | หน้าแรกหลัง login |
| `/pay` | เว็บลูกค้า (เปิดด้วยมือถือหรือ DevTools โหมดมือถือ) |
| `/kiosk/entry` · `/kiosk/exit` | จอ Kiosk (เปิดเต็มจอ 1920×1080) |

---

## 2. Tech stack

| ส่วน | ใช้ |
|---|---|
| Framework | Next.js (App Router) + TypeScript |
| Styling | Tailwind CSS + token ตาม [DESIGN-STYLE.md](./DESIGN-STYLE.md) |
| UI components | TailGrids (ติดตั้งผ่าน `tailgrids.config.json` ลงใน `src/components/tailgrids/`) ปรับสีและขนาดให้ตรง Figma ก่อนใช้ |
| ไอคอน | lucide-react |
| ผังที่จอด | Fabric.js |
| กราฟ | Recharts |
| ธีม | next-themes (สว่าง / มืด / ตามระบบ ใช้กับ Admin เท่านั้น) |
| ฟอนต์ | Inter + Noto Sans Thai (`next/font/google`) |
| Backend (ภายหลัง) | MariaDB + Prisma |

---

## 3. โครงสร้างโปรเจกต์

```
auto_parking/
├─ public/
├─ src/
│  ├─ app/                        # routing ของ Next.js
│  │  ├─ layout.tsx               # root: <html lang="th">, ฟอนต์, ThemeProvider
│  │  ├─ page.tsx                 # redirect → /dashboard
│  │  ├─ globals.css              # token สี / ตัวอักษร / ระยะ ตาม DESIGN-STYLE.md
│  │  ├─ favicon.ico
│  │  │
│  │  ├─ (admin)/                 # หลังบ้าน ต้อง login (วงเล็บ = ไม่อยู่ใน URL)
│  │  │  ├─ layout.tsx            # เช็ก session + Sidebar
│  │  │  ├─ 403/                  # ไม่มีสิทธิ์เข้าถึง
│  │  │  ├─ account/              # บัญชีของฉัน
│  │  │  ├─ activity-log/         # รถเข้า–ออก (เดิมชื่อ Traffic Activity)
│  │  │  ├─ audit-logs/           # ประวัติการใช้งานระบบ
│  │  │  ├─ dashboard/
│  │  │  ├─ financial-overview/
│  │  │  ├─ heat-map/
│  │  │  ├─ parking-layout/
│  │  │  ├─ settings/             # แท็บ: branch · slot-types · fees
│  │  │  └─ users/                # User & Permissions
│  │  │
│  │  ├─ (auth)/                  # login · forgot-password · set-password
│  │  ├─ (customer)/              # pay/ → ค้นหา · [sessionId] · qr · success
│  │  └─ kiosk/                   # entry/ · exit/
│  │
│  ├─ components/
│  │  ├─ tailgrids/               # component จาก TailGrids (ปรับเป็น token ของเราแล้ว)
│  │  └─ sidebarmenu.tsx          # เมนูด้านซ้ายของ Admin
│  │
│  ├─ db/                         # mock data (JSON) แทนฐานข้อมูลไปก่อน
│  │  └─ user.json
│  │
│  └─ utils/                      # ฟังก์ชันช่วย (format วันที่ไทย, ฿, ระยะเวลา, ทะเบียน ฯลฯ)
│
├─ AGENTS.md                      # คำแนะนำสำหรับ AI coding agent
├─ DESIGN-STYLE.md                # กติกา UI ทั้งหมด (สี ตัวอักษร component layout)
├─ eslint.config.mjs
├─ next.config.ts
├─ tailgrids.config.json
└─ tsconfig.json
```

**กติกาโฟลเดอร์ `app/`**

- ใน `app/` มีได้แค่ไฟล์ของ Next.js (`page.tsx`, `layout.tsx`, `loading.tsx`, `error.tsx`, `not-found.tsx`)
- `page.tsx` ทำแค่ 3 อย่าง: เช็กสิทธิ์ของหน้า → อ่าน `searchParams` → render component
- ตัวกรอง, ช่วงวัน, เลขหน้า และโหมดดู / แก้ไข เก็บใน URL (`?floor=B1&mode=edit`) refresh แล้วไม่หาย และส่งลิงก์ให้กันได้
- `layout.tsx` ใส่ได้แค่ของที่ทุกหน้าในโฟลเดอร์ใช้ร่วมกัน **ห้ามเช็กสิทธิ์ราย page ใน layout** เพราะ layout ไม่ทำงานซ้ำเมื่อเปลี่ยนหน้า

---

## 4. Routes ↔ Figma ↔ ผู้รับผิดชอบ

Figma: [AUTO PARKING / ParkPlan](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=2-2) · หน้า **📐 Screens** (หน้าจอ) และ **🎨 Design System** (component + สี)

| Route | หน้า | เฟรมหลักใน Figma | ผู้รับผิดชอบ |
|---|---|---|---|
| `/login` | เข้าสู่ระบบ | [09.7](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=58-12887) | อ๊อด (PM) |
| `/forgot-password` | ลืมรหัสผ่าน | [09.8](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=58-13040) | อ๊อด |
| `/set-password` | ตั้งรหัสผ่านใหม่ | [09.9](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=58-13189) | อ๊อด |
| — (ทุกหน้า Admin) | Sidebar + Profile menu | [09](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=56-10145) | อ๊อด |
| `/account` | บัญชีของฉัน | [09.2](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=57-12581) | อ๊อด |
| `/users` | User & Permissions | [07](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=37-6912) | อ๊อด |
| `/403` | ไม่มีสิทธิ์ | [07.9](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=39-8866) | อ๊อด |
| `/audit-logs` | Audit Logs | [08](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=50-9390) | อ๊อด |
| `/dashboard` | Dashboard | [12](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=156-28177) | ตาล |
| `/financial-overview` | Financial Overview | [13](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=145-24919) | ตาล |
| `/parking-layout` | Parking Layout | [01](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=16-3034) · [02](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=16-6185) | ริว |
| `/activity-log` | Activity Log | [14](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=103-16043) | ฟ่า |
| `/heat-map` | Parking Heat Map | [15](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=140-22253) | ฟ่า |
| `/settings/*` | System Settings | [10](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=59-13184) | ต้น |
| `/pay/*` | Customer Web | [17](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=233-43072) | ต้น |
| `/kiosk/entry` | Kiosk ทางเข้า | [18](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=239-44453) | ต้น |
| `/kiosk/exit` | Kiosk ทางออก | [16](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=234-43291) | ต้น |

แก้ไฟล์ในโฟลเดอร์ของคนอื่น ต้องให้เจ้าของหน้านั้นรีวิว ส่วน `layout.tsx` ระดับกลุ่ม, `components/` และ `globals.css` เป็นของอ๊อด

---

## 5. ก่อนลงมือทำฟังก์ชัน: อ่าน Figma ก่อน

ทำตามลำดับนี้ทุกครั้งก่อนเริ่มเขียนฟังก์ชันใหม่

1. **เปิดเฟรมหลักของหน้า** จากตารางในข้อ 4
2. **ไล่ดูเฟรมย่อยทุกเลข** (เช่น 14.1 – 14.15) แต่ละเฟรมคือ **state ที่โค้ดต้องรองรับ** เช่น dropdown เปิด, ผลการกรอง, ไม่พบผลลัพธ์, hover, error
3. **ดู prototype** (ปุ่ม ▶ Present มุมขวาบนใน Figma แล้วเลือก flow ตามชื่อหน้า) เพื่อดูว่าการกดแต่ละจุดพาไปที่ไหน
4. **ดู section `Components · <ชื่อหน้า>`** ข้างเฟรม และหน้า 🎨 Design System
   - ใช้ component ที่มีอยู่แล้ว
   - ถ้าโค้ดยังไม่มี ให้สร้างใน `components/` ตามสเปก **ห้ามสร้างหน้าตาใหม่เอง**
5. **จดข้อมูลที่หน้าต้องใช้** แล้วเพิ่ม mock ใน `src/db/` (ใช้ตัวเลขชุดเดียวกับในเฟรม จะเทียบหน้าจอได้ง่าย)
6. **ใช้ข้อความตาม Figma ทุกตัวอักษร** (หัวข้อ, ปุ่ม, placeholder, error) ห้ามคิดคำใหม่เอง
7. **เขียนตาม [DESIGN-STYLE.md](./DESIGN-STYLE.md)** ใช้เฉพาะ token ไม่ใส่สี hex ไม่ใช้ค่า arbitrary
8. **ก่อนเปิด PR** แคปหน้าจอจริงคู่กับเฟรม Figma ที่เลขเดียวกัน แนบใน PR

> ถ้า Figma กับสิ่งที่ต้องทำไม่ตรงกัน หรือ Figma ไม่มี state ที่ต้องใช้ **ให้ถาม PM ก่อนทำ** อย่าเดาเอง

---

## 6. Figma อ้างอิงรายหน้า

> ลิงก์ทุกอันเปิดไปที่เฟรมใน Figma โดยตรง · ☐ = ฟังก์ชันที่ต้องทำ (สรุปจากเฟรม)

### 6.1 Login / ลืมรหัสผ่าน / ตั้งรหัสใหม่ — อ๊อด

เฟรม: [09.7 Login](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=58-12887) · [09.8 ลืมรหัสผ่าน](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=58-13040) · [09.9 ตั้งรหัสผ่านใหม่](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=58-13189)

- ☐ Login ด้วย Username **หรือ** Email + รหัสผ่าน
- ☐ ลืมรหัสผ่าน: กรอก email → แสดง "ส่งลิงก์แล้ว" (ซ่อนบางส่วนของ email) + ปุ่มส่งอีกครั้ง · ลิงก์อายุ 24 ชม.
- ☐ ตั้งรหัสใหม่: ใช้ทั้งจากอีเมลเชิญและลืมรหัสผ่าน · เช็กเงื่อนไขทีละข้อแบบ real-time:
  - อย่างน้อย 10 ตัวอักษร
  - มีตัวพิมพ์ใหญ่และตัวพิมพ์เล็ก
  - มีตัวเลขอย่างน้อย 1 ตัว
  - มีอักขระพิเศษ
  - รหัสผ่านทั้งสองช่องตรงกัน
- ☐ ผู้ใช้ใหม่ต้องตั้งรหัสใหม่ก่อนเข้าระบบครั้งแรก
- ☐ บันทึกลง Audit Logs ทั้งกรณีเข้าสู่ระบบสำเร็จและไม่สำเร็จ

### 6.2 Sidebar + Profile menu — อ๊อด

เฟรม: [09 Profile menu](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=56-10145) · [09.1 เลือกธีม](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=56-10458) · [09.5 ยืนยันออก](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=56-10805) · [09.6 ออกขณะผังยังไม่บันทึก](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=56-11033) · [09.11 มุมมอง Admin](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=163-29575) · [11 ธีมมืด](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=59-14500)

- ☐ เมนูเรียงตามนี้:
  - เมนูหลัก: Dashboard → Parking Layout → Financial Overview → Activity Log → Parking Heat Map
  - จัดการระบบ: User & Permissions → System Settings → Audit Logs
- ☐ ซ่อนเมนูที่ผู้ใช้ไม่มีสิทธิ์
- ☐ Profile menu มี 3 รายการ: บัญชีของฉัน · ธีม (สว่าง / มืด / ตามระบบ บันทึกกับบัญชี) · ออกจากระบบ (มี dialog ยืนยัน)
- ☐ ถ้ากดออกจากระบบขณะแก้ผังที่ยังไม่บันทึก ต้องมีให้เลือก "บันทึกและออก" หรือ "ออกโดยไม่บันทึก"

### 6.3 บัญชีของฉัน — อ๊อด

เฟรม: [09.2 Superadmin](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=57-12581) · [09.3 Admin](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=57-13060) · [09.4 เปลี่ยนรหัสสำเร็จ](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=57-13273)

- ☐ แสดงข้อมูลบัญชี (Username, Email, Role, วันที่สร้าง) และ "สิทธิ์ของฉัน" ราย page
- ☐ เปลี่ยนรหัสผ่าน (เงื่อนไขเดียวกับ 6.1)

### 6.4 User & Permissions — อ๊อด (เฉพาะ Superadmin)

เฟรม: [07 รายการ](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=37-6912) · [07.1](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=39-7201)–[07.3](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=39-8323) กรอง · [07.4 แก้ไข (Drawer)](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=40-7811) · [07.5 ยืนยันเปลี่ยน Role](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=40-8335) · [07.6 เพิ่มผู้ใช้](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=41-8544) · [07.7 ยืนยันลบ](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=41-8895) · [07.8 Toast](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=41-9418) · [07.9 หน้า 403](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=39-8866)

- ☐ ตารางผู้ใช้: ค้นหา username / email · กรองตาม "สิทธิ์การเห็นหน้า" · แบ่งหน้า
- ☐ เพิ่มผู้ใช้:
  - Username ใช้ได้ a–z, 0–9, `.`, `_` และแก้ภายหลังไม่ได้
  - ระบบสร้างรหัสผ่านเริ่มต้นให้
  - เลือก Role
  - ติ๊กส่งอีเมลเชิญได้
  - ถ้าเป็น Admin ให้เปิด drawer ตั้งสิทธิ์ต่อทันที
- ☐ แก้ไข (Drawer):
  - แก้ email
  - เปลี่ยน Role (ต้องยืนยันก่อน)
  - ตั้งสิทธิ์ราย page เป็น ไม่มีสิทธิ์ / ดูได้ / แก้ไขได้
  - ปุ่มลัด "ดูได้ทุกหน้า" / "ล้างทั้งหมด"
- ☐ ลบผู้ใช้ (ยืนยัน → ลบถาวร → แสดง toast)
- ☐ Admin ที่เข้าหน้านี้ต้องไปหน้า 403
- ☐ ทุกการเปลี่ยนแปลงบันทึกลง Audit Logs

### 6.5 Audit Logs — อ๊อด

เฟรม: [08 รายการ](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=50-9390) · [08.2 รายละเอียด](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=52-10037) · [08.3 มุมมอง Admin](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=52-10478) · [08.4](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=68-14298)–[08.13](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=69-16829) ตัวกรอง · [08.14](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=196-42130)–[08.18](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=196-43094) ปฏิทิน

- ☐ ตัวกรอง: ช่วงวันที่ (ค่าเริ่มต้น 7 วันล่าสุด / กำหนดเอง) · หน้า · การกระทำ (สร้าง / แก้ไข / ลบ / เข้าสู่ระบบ / ล้มเหลว) · ค้นหารายละเอียดหรือ username
- ☐ ตาราง: เวลา + IP · ผู้กระทำ + Role · การกระทำ · หน้า · รายละเอียด
- ☐ กดแถวเพื่อเปิด drawer รายละเอียด:
  - เลข `#AL-xxxxx`, เป้าหมาย, IP, อุปกรณ์
  - ตารางเทียบก่อน → หลัง
  - ปุ่มคัดลอกลิงก์ (ใช้ `?id=` ใน URL)
- ☐ Export Excel เฉพาะผู้มีสิทธิ์แก้ไขได้ · สิทธิ์ดูได้เห็นข้อความแจ้งแทนปุ่ม (08.3)
- ☐ log **แก้ไขหรือลบไม่ได้**
- ☐ มี `audit()` กลางให้ทุกหน้าเรียกใช้ (ตอนนี้เก็บใน memory หรือ mock)

### 6.6 Dashboard — ตาล

เฟรม: [12 หลัก](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=156-28177) · [12.1–12.2 hover](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=156-28719) · [12.3–12.22 การ์ดเปรียบเทียบ](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=174-33160) · [12.23–12.25 ช่วงวัน](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=176-37780) · [12.26–12.34 กำหนดเอง](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=183-38203) · [Components · Dashboard](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=156-28158) · [Components · Date range picker](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=196-40068)

- ☐ ช่วงเวลาของทั้งหน้า: วันนี้ / เมื่อวาน / 7 วัน / 30 วัน / กำหนดเอง
  - กำหนดเองใช้ปฏิทิน เลื่อนดูเดือนก่อนได้
  - ปุ่ม "กำหนดเอง" ต้องแสดงสถานะเลือกอยู่ตลอดที่ปฏิทินเปิด
- ☐ KPI 4 ใบ: ช่องว่างตอนนี้ · รายรับ · รถเข้า · เวลาจอดเฉลี่ย (+ % เทียบช่วงก่อน)
- ☐ กราฟรถเข้า–ออกรายชั่วโมง (เข้า / ออก / เข้าเมื่อวาน) + hover tooltip
- ☐ การ์ดช่องจอดตอนนี้ · รายรับ 14 วัน · การ์ดแจ้งเตือน (ไม่ทราบสถานะ / ปิดใช้งาน)
- ☐ การ์ดเปรียบเทียบประเภทรถ:
  - เลือก 2–4 ประเภท
  - เลือกช่วงวัน
  - สลับดูรถเข้า / เวลาจอดเฉลี่ย / รายรับ
  - ตารางสรุปด้านล่าง
- ☐ ความเคลื่อนไหวล่าสุด + ลิงก์ไป Activity Log
- ☐ **ทำ Date Range Picker เป็น component กลาง** (Audit Logs และ Activity Log ใช้ตัวเดียวกัน)

### 6.7 Financial Overview — ตาล

เฟรม: [13 หลัก](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=145-24919) · [13.1 วันก่อน](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=145-25483) · [13.2 รายเดือน](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=145-26051) · [13.3 รายปี](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=145-26619) · [13.4 หน้า 2](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=145-27181) · [13.5 Export](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=145-27745) · [Components · Financial](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=145-24900)

- ☐ มุมมอง รายวัน / รายเดือน / รายปี + ตัวเลือกวันที่ + ปุ่ม ‹ ›
- ☐ KPI: รายรับรวม · จำนวนรายการชำระ · ค่าจอดเฉลี่ยต่อครั้ง · ช่วงที่รายรับสูงสุด
- ☐ กราฟรายรับรายชั่วโมง / รายวัน / รายเดือน (ตามมุมมอง)
- ☐ แยกรายรับตามประเภทช่องจอด และตามระยะเวลาจอด
- ☐ ตารางรายการชำระ + แบ่งหน้า
- ☐ Export Excel ตามช่วงที่เลือก (เฉพาะผู้มีสิทธิ์แก้ไขได้)

### 6.8 Parking Layout — ริว

เฟรม: [01 โหมดดู](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=16-3034) · [01.1 popover](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=7-158) · [01.2 ตัวกรอง](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=16-3776) · [01.3 กรองแล้ว](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=16-4596) · [01.4 เลือกชั้น](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=16-5381) · [01.5 ชั้นว่าง](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=19-6742) · [02 โหมดแก้ไข](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=16-6185) · [02.1 เลือกประเภท](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=10-744) · [02.2 วางเป็นแถว](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=16-7117) · [03 ตั้งค่าช่อง](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=11-1402) · [04 เพิ่มชั้น](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=12-2051) · [05 empty state](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=12-3024) · [06 states ประกอบ](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=13-2950)

**โหมดดู**
- ☐ เลือกอาคาร / ชั้น (dropdown ค้นหาได้)
- ☐ ตัวกรองประเภท + สถานะ (ช่องที่ไม่ตรงจาง 25%)
- ☐ คลิกช่องเพื่อเปิด popover (เลขช่อง, ประเภท, สถานะ)
- ☐ แผงขวา:
  - ภาพรวมชั้น
  - อัตราการใช้งาน
  - ช่องว่างแยกประเภท
  - แท็บรายการช่องจอด (คลิกแถวเพื่อไฮไลต์บนผัง)
  - แท็บกิจกรรมล่าสุด
- ☐ ซูม − / + / เต็มจอ

**โหมดแก้ไข**
- ☐ แถบเครื่องมือ:
  - วางวัตถุ: ช่องจอด, วางเป็นแถว, ทางเข้า–ออก, ประตูคนเดิน, ลูกศร, เสา, ลิฟต์, บันได
  - จัดการวัตถุ: เลือก, เลื่อนผัง, หมุน, จัดแนว, คัดลอก, วาง, ลบ
  - Undo / Redo
  - กริด / Snap
- ☐ วางเป็นแถว: เลือกประเภท + Prefix + เลขเริ่ม + จำนวน + ทิศทาง → แสดงตัวอย่างก่อนวาง
- ☐ แผงตั้งค่าช่อง:
  - เลขช่อง (เตือนเมื่อซ้ำในชั้นเดียวกัน)
  - ประเภท
  - ขนาด
  - หมุน 0 / 45 / 90°
  - ปิดใช้งาน / ซ่อมบำรุง
  - ลบ / ทำสำเนา
- ☐ เพิ่มชั้น: ชื่อ, ลำดับ, ขนาดพื้นที่ (ม.), อัปโหลดแปลน (PNG / JPG / PDF ≤ 10 MB)
- ☐ แถบ "มีการแก้ไขที่ยังไม่บันทึก N รายการ" + ย้อนกลับทั้งหมด + บันทึก (ลง Audit Logs)
- ☐ สถานะ ว่าง / ไม่ว่าง มาจากเซนเซอร์เท่านั้น ตั้งเองไม่ได้
- ☐ **export `FloorMapView` (โหมดดูอย่างเดียว) ให้ฟ่าใช้ทำ Heat Map**

### 6.9 Activity Log — ฟ่า

เฟรม: [14 หลัก](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=103-16043) · [14.1 วันที่](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=109-16362) · [14.2 เวลา](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=109-17301) · [14.3 ประเภทรถ](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=109-18090) · [14.5–14.8 ค้นทะเบียน](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=109-20414) · [14.9 ตามวัน](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=109-24597) · [14.10 Export](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=109-25730) · [14.11–14.13 ปฏิทิน](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=114-20142) · [Components · Activity Log](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=103-15981)

- ☐ ตัวกรอง: วันที่เริ่ม–สิ้นสุด · เวลาเริ่ม–สิ้นสุด · ประเภทรถ · ทะเบียน → ปุ่มค้นหา / ล้าง (ค่าเริ่มต้น 7 วันล่าสุด)
- ☐ KPI: รถเข้า · รถออก · จอดอยู่ตอนนี้ · เวลาจอดเฉลี่ย
- ☐ ตารางสีช่วงเวลาหนาแน่น (วัน × ชั่วโมง)
- ☐ กราฟประเภทรถตามช่วงเวลา (สลับตามชั่วโมง / ตามวัน) + ตารางสรุปตามประเภท
- ☐ ตารางรายการเข้า–ออก (สถานะมีแค่ **จอดอยู่ / ออกแล้ว**) + แบ่งหน้า
- ☐ กรณีไม่พบผลลัพธ์ (14.8)
- ☐ Export Excel

### 6.10 Parking Heat Map — ฟ่า

เฟรม: [15 หลัก](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=140-22253) · [15.1 hover](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=140-22886) · [15.2 ชั่วโมงรวม](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=140-23519) · [15.3 อัตราการใช้](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=140-24152) · [15.4 7 วัน](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=140-24785) · [15.6 ประเภท](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=140-26052) · [15.8 เลือกช่อง](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=140-27286) · [Components · Heat Map](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=140-22192)

- ☐ ตัวกรอง: อาคาร · ชั้น · 7 / 30 / 90 วัน · ค่าที่ใช้ระบายสี (จำนวนครั้ง / ชั่วโมงจอดรวม / อัตราการใช้) · ประเภทช่อง
- ☐ ผังระบายสี 6 ระดับ (ใช้ `FloorMapView` ของริว) + hover tooltip
- ☐ คลิกช่องเพื่อเปิดรายละเอียด: จำนวนครั้ง, ชั่วโมงรวม, อัตราการใช้, เวลาจอดเฉลี่ย, สถานะตอนนี้, กราฟเวลาที่เริ่มจอด
- ☐ อันดับช่องที่ใช้บ่อยที่สุด / น้อยที่สุด · ค่าเฉลี่ยตามแถว

### 6.11 System Settings — ต้น (เฉพาะ Superadmin)

เฟรม: [10 ข้อมูลสาขา](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=59-13184) · [10.1 ประเภทช่องจอด](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=59-13582) · [10.2 แก้ไขประเภท](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=59-14098) · [10.3 ค่าจอด](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=66-14208) · [10.4–10.6 โลโก้](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=172-29898) · [10.7–10.22 จัดการประเภท](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=172-30204) · [10.23–10.24 บันทึก / error](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=172-34799)

- ☐ แท็บข้อมูลสาขา: ชื่อสาขา + โลโก้ (PNG / SVG สี่เหลี่ยมจัตุรัส ≥ 256 px ≤ 1 MB) + ตัวอย่างการแสดงผล
- ☐ แท็บประเภทช่องจอด:
  - เพิ่ม / แก้ไขชื่อ, ไอคอน, สี, ขนาดตั้งต้น
  - ประเภทตั้งต้นลบไม่ได้
  - ลบได้เฉพาะประเภทที่ไม่มีช่องใช้อยู่ (hover ปุ่มลบแล้วแสดงเหตุผล)
- ☐ แท็บค่าจอด:
  - ราคาต่อชั่วโมง (> 0, ทศนิยมได้ 2 ตำแหน่ง)
  - เวลาออกหลังชำระ (นาที, > 0)
  - ตัวอย่างการคำนวณ
  - error เมื่อกรอกค่าผิด
- ☐ ทุกการบันทึกลง Audit Logs
- ☐ ตกลง schema ประเภทช่องจอดกับริวก่อนเริ่ม (Settings เป็นที่สร้าง ผังเป็นที่นำไปใช้)

### 6.12 Customer Web — ต้น

เฟรม: [17 ค้นหา](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=233-43072) · [17.1 กรอกแล้ว](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=233-43137) · [17.2 ไม่พบ](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=233-43201) · [17.3 รอชำระ](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=233-43270) · [17.4 ชำระแล้ว](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=233-43348) · [17.5 สแกนจ่าย](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=233-43424) · [17.6 ไม่สำเร็จ](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=233-43485) · [17.7 สำเร็จ](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=233-43542)

- ☐ ขั้นตอน ค้นหา → ตรวจสอบ → ชำระ (Step component)
- ☐ ค้นทะเบียน (เว้นวรรคหรือไม่ก็ได้) · ไม่พบ → error ใต้ช่อง + กล่องคำแนะนำ
- ☐ รายละเอียด: ทะเบียน, ประเภทรถ, เวลาเข้า, เวลาจอด, ยอดพร้อมวิธีคิด · ชำระแล้ว → "ไม่มียอดค้างชำระ"
- ☐ หน้า QR:
  - PromptPay QR
  - นับถอยหลัง
  - ปุ่มบันทึกรูป QR
  - หมดอายุหรือไม่สำเร็จ → ปุ่มสร้าง QR ใหม่
- ☐ สำเร็จ: เลขที่ธุรกรรม + เวลาที่ต้องออก
- ☐ `sessionId` ใน URL ต้องเป็นรหัสสุ่ม **ห้ามใช้ทะเบียน**
- ☐ ธีมสว่างเท่านั้น · กว้างสูงสุด 480px

### 6.13 Kiosk ทางเข้า / ทางออก — ต้น

ทางเข้า: [18 รอรถ](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=239-44453) · [18.1 อ่านป้าย](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=239-44618) · [18.2 บันทึกเวลาเข้า](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=239-44790) · [18.3 อ่านไม่สำเร็จ](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=239-44978) · [18.4 ที่จอดเต็ม](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=239-45160)
ทางออก: [16 รอรถ](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=234-43291) · [16.1 อ่านป้าย](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=234-43413) · [16.2 ค่าจอด + QR](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=234-43541) · [16.3 ชำระสำเร็จ](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=234-43684) · [16.4 ชำระทางเว็บแล้ว](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=234-43817) · [16.5 อ่านไม่สำเร็จ](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=234-43950) · [Components · Kiosk](https://www.figma.com/design/AoPiNS1OO38plLtnHvInSz/ParkPlan?node-id=220-42845)

- ☐ โครงจอ: Top Bar 80px · ซ้ายเป็นวิดีโอ CCTV + ผลการอ่านป้ายด้วย AI (ทะเบียน, ความมั่นใจ %, เวลาอ่าน) · ขวาเป็นข้อมูลรถ + การ์ดสถานะ
- ☐ จังหวะ: อ่านป้าย ~1.5 วินาที → แสดงผล → กลับหน้ารอรถหลัง 5 วินาที · อ่านไม่สำเร็จ → ลองใหม่อัตโนมัติหลัง 3 วินาที
- ☐ ทางเข้า: แสดงอัตราค่าจอด + ช่องว่างแยกประเภท · เต็มแล้วไม้กั้นไม่เปิด · บันทึกแล้วแสดง QR ไปหน้าลูกค้า
- ☐ ทางออก:
  - แสดงเวลาเข้า–ออก, เวลาจอดทั้งหมด, ค่าจอด + PromptPay QR
  - จ่ายแล้ว → ไม้กั้นเปิด
  - จ่ายทางเว็บแล้ว → เปิดทันที
- ☐ **ไม่มีปุ่มเรียกพนักงาน** · ไม่มี hover · ธีมสว่างเท่านั้น
- ☐ ช่วงหน้าบ้านล้วน: รองรับ `?state=` เพื่อเปิดแต่ละ state ตรง ๆ ได้ (เช่น `/kiosk/exit?state=fee`)

---

## 7. กติกาการเขียนโค้ด

กติกา UI ทั้งหมดอยู่ใน **[DESIGN-STYLE.md](./DESIGN-STYLE.md)** สรุปข้อที่พลาดบ่อย:

- ใช้ utility ที่อิง token เช่น `bg-surface`, `text-fg-2`, `border-line`, `rounded-xl`, `text-body`
- **ห้าม** ใส่สี hex ในไฟล์ `.tsx` · ห้ามใช้ค่า arbitrary (`text-[15px]`) · ห้ามใช้ `dark:` ใน component
- component จาก TailGrids ต้องแปลง class เป็น token ของเราก่อนใช้ (ตารางแปลงอยู่ใน DESIGN-STYLE.md ข้อ 1)
- ใช้ component กลางเสมอ ไม่สร้างปุ่ม / input / badge ใหม่ในหน้า
- ตัวเลข, เงิน, เวลา ใส่ `tabular-nums` · รูปแบบ: `฿10,080` · `1 ชม. 58 น.` · `ส. 17 ต.ค. 2026` · `21:56`
- สถานะรถมีแค่ **จอดอยู่** และ **ออกแล้ว**
- ชื่อแบรนด์อ่านจาก config ห้าม hard-code

สำหรับ AI coding agent: อ่าน [AGENTS.md](./AGENTS.md) และ DESIGN-STYLE.md ก่อนเขียนโค้ด

---

## 8. Mock data

ช่วงหน้าบ้านล้วน ข้อมูลทั้งหมดอยู่ใน `src/db/*.json`

| ไฟล์ | ข้อมูล | ใช้ที่ |
|---|---|---|
| `user.json` | ผู้ใช้, Role, สิทธิ์ราย page | Login, Users, Account |
| `floors.json` *(เพิ่ม)* | อาคาร, ชั้น, ช่องจอด, วัตถุบนผัง | Parking Layout, Heat Map |
| `slot-types.json` *(เพิ่ม)* | ประเภทช่องจอด | Settings, Parking Layout |
| `sessions.json` *(เพิ่ม)* | รถเข้า–ออก | Activity Log, Dashboard, Customer, Kiosk |
| `payments.json` *(เพิ่ม)* | รายการชำระ | Financial, Dashboard |
| `audit-logs.json` *(เพิ่ม)* | ประวัติการใช้งาน | Audit Logs |
| `settings.json` *(เพิ่ม)* | ข้อมูลสาขา, ราคาต่อชั่วโมง, เวลาออกหลังชำระ | Settings, Customer, Kiosk |

กติกา:
- ใช้ตัวเลขชุดเดียวกับใน Figma (เช่น ทะเบียน `ผบ 9370`, ช่อง `B-07`, รายรับ `฿10,080`) จะเทียบหน้าจอกับเฟรมได้ง่าย
- หน้าห้าม import JSON ตรง ๆ ให้เรียกผ่านฟังก์ชันกลาง วันที่มี backend จะแก้แค่ฟังก์ชันนั้น ส่วนหน้าไม่ต้องแตะ
- ห้ามใส่ข้อมูลจริงของคน (ชื่อ, อีเมล, ทะเบียนจริง) ลงใน mock

---

## 9. Git และ Pull Request

- Branch: `feat/<route>-<เรื่อง>` เช่น `feat/activity-log-filters` · `fix/kiosk-exit-timer`
- 1 PR = 1 เรื่อง · ผู้รีวิวขั้นต่ำ: อ๊อด (PM) + เจ้าของหน้า (ถ้าแก้ของคนอื่น)
- **ในคำอธิบาย PR ต้องมี:**
  - เลขเฟรม Figma ที่ทำ (เช่น `14, 14.1–14.4`)
  - ภาพหน้าจอจริงคู่กับเฟรม
  - state ที่ยังไม่ได้ทำ (ถ้ามี)
- ก่อนเปิด PR: `npm run lint` ผ่าน และเปิดหน้า Admin ทั้งธีมสว่างและมืดแล้วอ่านได้ทุกจุด

---

## 10. เรื่องที่ยังรอตัดสินใจ

PM (อ๊อด) เป็นผู้ตัดสิน ระหว่างนี้ให้ทำตาม Figma ปัจจุบัน

| เรื่อง | กระทบ |
|---|---|
| สถานะ session ใช้ 2 สถานะ (ตาม Figma) หรือ 4 สถานะ (ตามเอกสาร requirement) | Activity Log, Customer, Kiosk |
| เกินเวลาออกหลังจ่าย: จ่ายใหม่ทั้งหมด หรือคิดเฉพาะส่วนที่เกิน + Grace Period (Figma 10.3 กับ 17.7 เขียนไม่ตรงกัน) | Settings, Customer, Kiosk |
| Role: Superadmin / Admin หรือ Staff / Management / Owner | Users, สิทธิ์ทั้งระบบ |
| ชื่อแบรนด์ ParkPlan หรือ AUTO PARKING | ทุกหน้า (แก้ที่ config ที่เดียว) |