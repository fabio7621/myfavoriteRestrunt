# 如何啟動專案

午餐餐廳地圖日記 — 本地開發環境啟動步驟。

## 前置需求

- Node.js 20+
- npm

## 第一次啟動(安裝依賴)

### 1. 安裝後端依賴

```bash
cd backend
npm install
```

### 2. 安裝前端依賴

```bash
cd frontend
npm install
```

## 日常啟動(開兩個終端機)

### 終端機 A — 啟動後端

```bash
cd backend
node index.js
```

預設跑在 http://localhost:3000

驗證是否正常:

```bash
curl http://localhost:3000/api/restaurants
```

### 終端機 B — 啟動前端

```bash
cd frontend
npm run dev
```

預設跑在 http://localhost:5173(若被佔用 Vite 會自動換成 5174 / 5175…)

瀏覽器打開終端機顯示的 `Local:` 網址即可。

## 常見問題

### Port 3000 已被佔用

代表後端已在背景運行。先檢查:

```bash
lsof -i :3000 -P -n
```

若要關掉舊的:

```bash
kill <PID>
```

### Port 5173 已被佔用

Vite 會自動往後找(5174、5175…),看終端機輸出的網址即可。

### 後端熱重載

改用 `npm run dev`(等同 `node --watch index.js`),檔案變動會自動重啟。

## 執行測試

### 後端測試

```bash
cd backend
npm test
```

## 專案結構速查

- [CLAUDE.md](CLAUDE.md) — Claude Code 指令與專案規則
- [plan.md](plan.md) — 頁面結構、API、資料模型規劃
- [frontend/](frontend/) — Vue 3 + Vite + Pinia + Leaflet
- [backend/](backend/) — Express + mockData(本地 JSON)

## API 端點一覽

| 方法 | 路徑                         | 用途             |
| ---- | ---------------------------- | ---------------- |
| GET  | `/api/restaurants`           | 餐廳列表         |
| POST | `/api/restaurants`           | 新增餐廳         |
| GET  | `/api/records?month=YYYY-MM` | 當月記錄         |
| GET  | `/api/records?tag=日式`      | 依標籤篩選記錄   |
| POST | `/api/records`               | 新增記錄         |
| GET  | `/api/tags`                  | 所有標籤 + 次數  |
