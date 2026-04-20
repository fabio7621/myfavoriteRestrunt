# 🍱 myfavoriteRestrunt — 午餐餐廳地圖日記

一個記錄每日午餐的單頁式 Web App。把常光顧的餐廳釘在地圖上，用行事曆記錄每天吃了什麼，再透過標籤雲回顧自己的口味偏好。

> 「今天吃什麼？」的終極解法 — 讓你看到自己最近都在吃什麼，並從地圖上一眼看到附近還有哪些沒試過的店。

---

## ✨ 功能特色

- 🗺️ **餐廳地圖**：用 Leaflet + OpenStreetMap 顯示所有常光顧餐廳的 pin 點，點卡片地圖自動飛過去。
- 📅 **午餐行事曆**：當月日曆檢視，有記錄的日期會顯示標記，點日期即可新增／檢視當天午餐。
- 🏷️ **標籤雲**：自動統計所有標籤的出現次數，越常吃的類型字體越大，點標籤可篩選行事曆。
- 📝 **午餐記錄**：餐廳、地址、標籤、菜單照片、備註一次記錄完整。
- 📍 **自動 Geocoding**：輸入地址自動轉經緯度，失敗時可手動拖曳 pin 點位置。

---

## 🛠️ 技術棧

| 層級 | 技術 |
| --- | --- |
| 前端 | Vue 3（Composition API + `<script setup>`）、Vite、Pinia、Leaflet.js |
| 後端 | Node.js、Express |
| 資料庫 | MongoDB（開發階段用本地 JSON 假資料） |
| Geocoding | [Nominatim](https://nominatim.openstreetmap.org/) 公開 API |
| 測試 | Jest、Supertest |

---

## 📁 專案結構

```
myfavoriteRestrunt/
├── frontend/                    # Vue 3 + Vite
│   └── src/
│       ├── components/          # AppNav, AppHero, RestaurantList, MapView, Calendar, TagCloud, RecordModal...
│       ├── stores/              # Pinia stores（restaurant / record / tag / map）
│       ├── services/api.js      # 所有 API 呼叫集中在此
│       ├── assets/              # 共用 CSS
│       ├── App.vue
│       └── main.js
└── backend/
    ├── mockData/                # 假資料 JSON
    ├── routes/                  # restaurants / records / tags
    ├── __tests__/               # Jest 測試
    └── index.js
```

---

## 🚀 快速開始

### 需求

- Node.js 18+
- npm

### 安裝與啟動

**1. Clone 專案**

```bash
git clone https://github.com/<your-username>/myfavoriteRestrunt.git
cd myfavoriteRestrunt
```

**2. 啟動後端**

```bash
cd backend
npm install
node index.js
# Server running at http://localhost:3000
```

**3. 啟動前端（另開一個 terminal）**

```bash
cd frontend
npm install
npm run dev
# App running at http://localhost:5173
```

開啟瀏覽器進 [http://localhost:5173](http://localhost:5173) 即可開始使用。

---

## 🔌 API 端點

| Method | Path | 用途 |
| ------ | ---- | ---- |
| GET  | `/api/restaurants`           | 餐廳列表 + 地圖 pin 點 |
| POST | `/api/restaurants`           | 新增餐廳 |
| GET  | `/api/records?month=YYYY-MM` | 取得當月記錄 |
| GET  | `/api/records?tag=日式`      | 依標籤篩選記錄 |
| POST | `/api/records`               | 新增記錄 |
| GET  | `/api/tags`                  | 取得所有標籤 + 出現次數 |

---

## 🧭 資料流向

```
restaurantStore ──► RestaurantList.vue（卡片列表）
                └─► MapView.vue（pin 點）

recordStore  ◄── tagStore.activeTag 變化時重新 fetch
             └─► Calendar.vue（日期標記 + 篩選結果）

mapStore ──► RestaurantCard.vue（點卡片 → focusRestaurant）
         └─► MapView.vue（監聽 focusedLocation → 飛過去）
```

所有元件不直接呼叫 API，只跟 Pinia store 溝通；store 才去呼叫 `services/api.js`。

---

## 🧪 測試

```bash
cd backend
npm test
```

---

## 📝 開發規則

- 使用 ES Modules（`import / export`），不用 CommonJS
- Vue 元件統一 Composition API + `<script setup>`
- Pinia 使用 Setup Store 寫法
- 縮排 2 空格、不使用 TypeScript
- 命名：完整描述性，不縮寫；Boolean 加 `is` / `has` / `can` 前綴
- 註解解釋 WHY，不是 WHAT

更多規範請看 [CLAUDE.md](./CLAUDE.md) 與 [plan.md](./plan.md)。

---

## 🗺️ Roadmap

- [ ] 接上真實 MongoDB（目前是 mockData JSON）
- [ ] 菜單照片上傳（目前欄位保留未啟用）
- [ ] 餐廳編輯／刪除
- [ ] 個人化統計報表（最常吃的類型、人均價位）
- [ ] PWA 支援，離線也能查看記錄

---

## 📄 License

MIT
