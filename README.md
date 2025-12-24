# Half Year Card

情侶半週年與聖誕節的互動星光長頁。一個結合 three.js 星空、滾動動畫與 SVG 繪圖的沈浸式網頁體驗。

## 快速開始

```bash
# 安裝依賴
npm install

# 開發模式（熱重載）
npm run dev

# 構建生產版本
npm run build

# 預覽構建結果
npm run preview
```

## 指令說明

| 指令 | 說明 |
|------|------|
| `npm run dev` | 啟動開發伺服器，訪問 `http://localhost:5173` |
| `npm run build` | 構建優化的生產版本至 `dist/` |
| `npm run preview` | 本地預覽構建後的產物 |
| `npm run clean` | 刪除 `dist/` 目錄 |
| `npm run rebuild` | 清潔重建（清除 + 構建） |

## 專案結構

```
src/
├── index.html          # 主 HTML 頁面
├── js/
│   ├── app.js         # 主應用入口
│   ├── three-bg.js    # Three.js 星空背景
│   ├── timeline.js    # 滾動時間軸邏輯
│   ├── vivus-vine.js  # SVG 藤蔓動畫
│   ├── rough-frames.js # 手繪邊框
│   ├── lottie-loader.js # Lottie 動畫
│   ├── music-player.js # 音樂播放器
│   └── utils.js       # 工具函數
├── styles/
│   └── main.css       # Tailwind CSS 樣式
└── content/
    └── story.json     # 故事文案資料
```

## 技術棧

- **構建工具**：Vite 5
- **樣式**：Tailwind CSS + PostCSS
- **動畫**：
  - GSAP + ScrollTrigger（滾動動畫）
  - Lenis（平滑滾動）
  - Lottie（裝飾動畫）
  - Vivus（SVG 描邊）
- **3D 效果**：Three.js（星空背景）
- **繪圖**：Rough.js（手繪風格邊框）

## 部署選項

### GitHub Pages
```bash
npm run build
# 推送 dist/ 到 gh-pages 分支
git subtree push --prefix dist origin gh-pages
```

### Firebase Hosting
```bash
firebase init hosting
npm run build
firebase deploy --only hosting
```

### Netlify
```bash
npm run build
# 將 dist/ 資料夾拖放到 Netlify，或用 CLI：
netlify deploy --prod --dir=dist
```

### 傳統伺服器
構建後上傳 `dist/` 資料夾至任何靜態託管服務。

## 素材與授權

- 本項目使用 MIT 許可証
- 請確認所有圖片、音樂與素材的使用授權
- 線上部署前移除個人相關素材

## 系統要求

- Node.js >= 18.0.0
- npm 或 yarn

## 開發配置

詳見 `vite.config.js` 與 `tailwind.config.js`。
