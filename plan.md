# myfavoriteRestrunt — 專案規劃文件

## 頁面結構

```
首頁（單頁，無路由切換）
├── 常光顧餐廳一覽
│   ├── 餐廳卡片列表
│   └── 新增餐廳按鈕
├── 地圖（與餐廳列表資料共用）
│   └── pin 點 popup：名稱 + 地址
├── 行事曆
│   ├── 當月日曆，可切換上下月
│   ├── 有記錄的日期顯示標記
│   └── 點日期 → RecordModal
│       ├── 餐廳名稱（必填，從列表選或手動輸入）
│       ├── 地址（必填，選列表自動帶入）
│       ├── 標籤（必填，手動輸入，可多個）
│       ├── 菜單照片（選填）
│       └── 備註（選填）
└── 標籤雲
    ├── 自動統計所有記錄的標籤出現次數
    ├── 出現越多 → 字體越大
    └── 點標籤 → 篩選行事曆，顯示清除篩選按鈕
```

## API 端點

| 方法 | 路徑                         | 用途                    |
| ---- | ---------------------------- | ----------------------- |
| GET  | `/api/restaurants`           | 餐廳列表 + 地圖 pin 點  |
| POST | `/api/restaurants`           | 新增餐廳                |
| GET  | `/api/records?month=YYYY-MM` | 取得當月記錄            |
| GET  | `/api/records?tag=日式`      | 依標籤篩選記錄          |
| POST | `/api/records`               | 新增記錄                |
| GET  | `/api/tags`                  | 取得所有標籤 + 出現次數 |

## MongoDB Schema

**restaurants**

```json
{
  "_id": "ObjectId",
  "name": "string",
  "address": "string",
  "location": { "lat": "number", "lng": "number" },
  "created_at": "Date"
}
```

**lunch_records**

```json
{
  "_id": "ObjectId",
  "date": "YYYY-MM-DD",
  "restaurant_id": "ObjectId | null",
  "restaurant_name": "string",
  "address": "string",
  "tags": ["string"],
  "photos": ["url"],
  "note": "string",
  "created_at": "Date"
}
```

**tags**

```json
{
  "_id": "ObjectId",
  "name": "string",
  "count": "number"
}
```

## Pinia Store 規劃

所有 store 使用 Setup Store（組合式 API）。

**restaurantStore** — 餐廳列表（地圖 + 列表共用）

```js
const restaurantList = ref([])
const isLoading = ref(false)
async function loadRestaurants() { ... }
async function addRestaurant() { ... }
```

**recordStore** — 行事曆記錄

```js
const recordList = ref([])
const currentMonth = ref('')
const isLoading = ref(false)
// { "2026-03-18": [...] } 讓 Calendar 直接用日期查詢
const recordsByDate = computed(() => { ... })
async function loadMonthlyRecords() { ... }
async function saveRecord() { ... }
```

**tagStore** — 標籤雲 + 篩選狀態

```js
const tagList = ref([])
const activeTag = ref(null)
async function loadTags() { ... }
function setActiveTag(tag) { ... }
function clearActiveTag() { ... }
```

**mapStore** — 地圖聚焦

```js
// 點 RestaurantCard → focusRestaurant() → MapView 飛過去
const focusedRestaurantId = ref(null)
const focusedLocation = ref(null)
function focusRestaurant(restaurant) { ... }
function clearFocus() { ... }
```

## 資料流向

```
restaurantStore
  ├── RestaurantList.vue（卡片列表）
  └── MapView.vue（pin 點）

recordStore ← tagStore.activeTag 變化時重新 fetch
  └── Calendar.vue（日期標記 + 篩選結果）

mapStore
  ├── RestaurantCard.vue（點卡片 → focusRestaurant）
  └── MapView.vue（監聽 focusedLocation → 飛過去）
```

## Geocoding — Nominatim 公開 API

地址轉經緯度，直接呼叫公開 web service，不需自架。

**API 查詢**

```
GET https://nominatim.openstreetmap.org/search
  ?q=高雄市三民區建工路1號
  &format=json
  &limit=1
  &countrycodes=tw
```

**注意事項**

- 每個 request 必須帶 `User-Agent: LunchMap/1.0`
- 每秒最多 1 次請求
- 地址用中文輸入，成功率較高
- 查詢結果快取在 restaurantStore，避免重複打同一地址

**新增餐廳流程**

```
使用者輸入地址
    ↓
呼叫 Nominatim 查詢
    ↓
成功 → 地圖飛過去預覽，使用者確認 pin 點位置
失敗 → 提示「找不到地址」，讓使用者手動拖曳 pin 點
    ↓
確認後儲存 { address, lat, lng }
```

**api.js geocodeAddress 範例**

```js
// 將地址文字轉換為經緯度座標
async function geocodeAddress(addressText) {
  const encodedAddress = encodeURIComponent(addressText);
  const response = await fetch(
    `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1&countrycodes=tw`,
    { headers: { "User-Agent": "LunchMap/1.0" } },
  );
  const results = await response.json();

  // 查無結果時回傳 null，由呼叫方處理備案流程
  if (results.length === 0) return null;

  return { lat: parseFloat(results[0].lat), lng: parseFloat(results[0].lon) };
}
```

## 假資料格式（mockData）

**restaurants.json**

```json
[
  {
    "id": "1",
    "name": "飛鳥食堂",
    "address": "高雄市三民區某路1號",
    "location": { "lat": 22.6273, "lng": 120.3014 }
  }
]
```

**lunchRecords.json**

```json
[
  {
    "id": "1",
    "date": "2026-03-18",
    "restaurant_id": "1",
    "restaurant_name": "飛鳥食堂",
    "address": "高雄市三民區某路1號",
    "tags": ["日式", "清淡"],
    "photos": [],
    "note": "湯頭很棒"
  }
]
```

**tags.json**

```json
[
  { "id": "1", "name": "日式", "count": 5 },
  { "id": "2", "name": "清淡", "count": 3 }
]
```
