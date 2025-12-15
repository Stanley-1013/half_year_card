# 1) 專案概述

**目的**：用一個「只靠滑動（捲動）」的手機版長頁，慶祝「情侶半週年 + 聖誕節」。整體以 **線性時間敘事（由上到下，早→晚）** 呈現：每滑到一個節點，照片/句子/貼圖以漸層淡入淡出、微漂浮、星光閃爍等效果帶出情緒。

- 送禮者：李傳漢
- 收禮者：林秈瑀
- 風格關鍵字：**夜空 / 銀河 / 星星閃爍 / 夢幻 / Starlight Fantasy / Dreamscape**
- 內容素材：你自行放入專案（JPG 照片、貼圖、SVG/JSON 動畫、音樂）

> ⚠️ 版權提醒：你提到要使用《動物方程式》尼克/茱蒂等貼圖。這些通常屬於版權素材；本 spec 會以「插槽/占位」規劃版面，但請你自行使用**你已取得授權**或可合法使用的素材（例如官方購買貼圖/自繪/可商用 CC0 替代）。

---

# 2) 技術棧與成熟素材庫選型（以美感為主）

## 2.1 核心技術（符合你的要求）
- **HTML + Vanilla JS**（資料驅動渲染，避免手刻一堆 DOM）
- **Tailwind CSS**（快速迭代視覺；建議用 Vite 建置）
- **three.js**：固定背景的星空/星塵粒子層（WebGL Canvas） citeturn1search2turn1search6turn1search18

## 2.2 互動/動畫（成熟庫，不硬刻）
- **GSAP + ScrollTrigger**：最穩的捲動驅動動畫（淡入淡出、釘選、scrub、parallax） citeturn3search0
- **Lenis**：高質感平滑滾動（保留原生滾動概念、適合搭配 WebGL/Parallax） citeturn2search1turn2search6
- **Vivus**：讓 SVG「像手繪一樣被畫出來」→ 用在「樹枝/藤蔓時間線」 citeturn3search2turn3search6
- **Rough.js**：卡片/相框/對話框做「手繪漫畫邊框」 citeturn0search2turn0search12
- **Lottie-web / dotLottie**：用現成動畫素材（星星閃、漂浮小物、雪花、心心） citeturn1search1turn1search21

## 2.3 元件庫（Tailwind + Vanilla）
- **Flowbite**：Tailwind + vanilla JS 的成熟元件庫（按鈕、Modal、Tooltip、Navbar 等），可少寫互動行為 citeturn1search0turn1search12

## 2.4 音樂素材（開源/免版稅）
- 建議來源：**Pixabay Music**（標榜免版稅、可商用、通常不需標註；仍建議你在下載頁面確認每首的授權條款） citeturn1search3turn1search7

> 手機瀏覽器普遍限制「自動播放音樂」，通常需要使用者在首頁點一下「開啟音樂」才可播放（spec 會把這設計成首頁的一個精美按鈕/提示）。

---

# 3) 使用者體驗（UX）與敘事節奏

## 3.1 唯一互動
- **只有捲動/滑動**。
- 允許「回到頂部」的浮動按鈕（仍屬捲動，不是複雜互動）。

## 3.2 敘事節奏（建議）
- **S0 歡迎頁**：建立氛圍 + 提示音樂 + 角色貼圖左右站位。
- **S1~S6 時間線節點**：每一節點是一個「記憶片段」：照片 + 旁白句 + 小裝飾（星/葉/雪）。
- **S7 結尾祝福**：半週年 + 聖誕祝福 + 未來願望（最後收束）。

## 3.3 視覺層級
- 最底層：three.js 星空（固定不動或慢速漂移）。
- 中層：銀河漸層雲（CSS gradient + 低透明度）。
- 上層：內容卡片（手繪邊框）+ 樹枝藤蔓時間線（SVG）。
- 最上層：零星 Lottie 動畫（星星閃、雪花、漂浮小物）。

---

# 4) 資訊架構與區塊定義（含 ASCII 版面圖 + 編號）

## 4.1 首屏 Welcome（S0）— Mobile Layout

```
┌──────────────────────────────┐
│ [H01] THREE 星空 Canvas(固定) │
│ [H02] 銀河漸層雲(柔光)         │
│                              │
│ [H05] 貼圖: Nick  (左下漂浮)  │
│                              │
│          [H03] 標題文字        │
│       「Half-Year & Xmas」     │
│          [H04] 副標/一句話      │
│       (你填：浪漫旁白)          │
│                              │
│ [H06] 貼圖: Judy  (右下漂浮)  │
│                              │
│  [H07] 按鈕: 開啟音樂/進入      │
│  [H08] 提示: 向下滑動 ↓         │
└──────────────────────────────┘
```

- **H01**：three.js 星空（fixed full-screen canvas）
- **H02**：CSS Galaxy mist（多層 radial-gradient + blur）
- **H03/H04**：主標、副標（可套 Glow/Gradient text）
- **H05/H06**：貼圖插槽（你放 Nick/Judy 或替代素材）
- **H07**：Flowbite Button（點一下才開音樂，並淡出提示）
- **H08**：下滑提示（Lottie：小箭頭/星星）

## 4.2 時間線（S1~S6）— 藤蔓/樹枝承載卡片

```
┌──────────────────────────────┐
│ [T00] 背景層：星空+銀河         │
│                              │
│        [T01] 藤蔓主幹(SVG)      │
│        │\                     │
│ [T10]  │ \──[T11] 卡片A(照片)  │
│ 貼圖/  │                      │
│ 空白   │    ┌──────────────┐  │
│ 區     │    │[T11-1] 照片   │  │
│        │    │[T11-2] 日期   │  │
│        │    │[T11-3] 旁白句 │  │
│        │    └──────────────┘  │
│        │                      │
│        │\                     │
│        │ \──[T21] 卡片B(文字)  │
│        │                      │
│   [T20] 貼圖插槽(角色/裝飾)     │
│                              │
│ ...（重複節點，早→晚）...       │
└──────────────────────────────┘
```

- **T01**：SVG Vine（主幹 + 分枝）
  - 用 Vivus 做「畫出來」的效果（入場時/或跟著捲動進度）。 citeturn3search2
- **T11/T21...**：每個節點卡片用 Rough.js 產生手繪邊框 citeturn0search2
- **T10/T20...**：空白處的貼圖/裝飾插槽（可放動物方程式角色、星星、禮物盒等）

## 4.3 結尾（S7）— 收束 + 祝福

```
┌──────────────────────────────┐
│ [F01] 柔和星雲背景加亮           │
│ [F02] 大字祝福(半週年+聖誕)      │
│ [F03] 一段長旁白/承諾/願望        │
│ [F04] 合照/代表照(可選)           │
│ [F05] 貼圖/星光特效(小)           │
│ [F06] Button: 回到頂部 ↑          │
└──────────────────────────────┘
```

---

# 5) 內容模型（你只要填資料，就能生成整條時間線）

建議用 `src/content/story.json`（或 `story.js`）維護「單一真實來源」，渲染時依序生成。

## 5.1 Story Schema（草案）
```json
{
  "site": {
    "title": "Half-Year & Christmas",
    "subtitle": "給秈瑀的一封星光長信",
    "from": "李傳漢",
    "to": "林秈瑀",
    "music": {
      "src": "/assets/music/track.mp3",
      "credit": "Pixabay Music - <你填>"
    }
  },
  "beats": [
    {
      "id": "B01",
      "timeLabel": "早上 09:12",
      "title": "我們的第一個小瞬間",
      "type": "photo",
      "photo": "/assets/photos/01.jpg",
      "caption": "（你填一句話）",
      "stickerLeft": "/assets/stickers/nick.png",
      "stickerRight": "",
      "lottie": "/assets/lottie/twinkle.json",
      "theme": "starlight"
    }
  ]
}
```

- `type`：`photo | text | collage`（擴充）
- `theme`：`starlight | christmas | memory`（用來切換銀河/雪花/亮度）
- `stickerLeft/Right`：你放貼圖路徑（可空）
- `lottie`：每節可插一個小動畫（星星閃、雪花、漂浮葉子）

---

# 6) 動畫與滾動行為規格（不手刻，用庫拼起來）

## 6.1 Smooth Scroll
- 啟用 Lenis 給「滑順但不失控」的手感（特別適合浪漫長頁）。 citeturn2search1
- 需要跟 GSAP ScrollTrigger 做同步更新（Lenis scroll event → `ScrollTrigger.update()`）。

## 6.2 進場/離場動畫（每個 Beat）
- 進場：opacity 0 → 1、y +16 → 0、blur 8px → 0
- 停留：微漂浮（2~4px）
- 離場：opacity 1 → 0、y 0 → -16（或輕微縮小）
- 觸發：用 ScrollTrigger 定義 start/end（例如 `top 70%` ~ `bottom 30%`），並用 scrub 讓淡入淡出跟捲動綁定。 citeturn3search0

## 6.3 藤蔓時間線（SVG）
- SVG 藤蔓在第一次進入時間線區塊時，用 Vivus「畫出來」。 citeturn3search2
- 節點葉片可做：輕微搖晃（CSS + Motion One/GSAP）

## 6.4 星空背景（three.js）
- 固定 full-screen canvas（z-index 最底）
- 星點：Points + 隨機分布 + 慢速漂移/閃爍（不要太搶戲）
- 在「christmas theme」區段：整體色溫略偏冷、亮度稍升。

## 6.5 裝飾動畫（Lottie）
- Welcome：星星閃 + 向下提示箭頭
- 中段：小星塵漂浮
- 聖誕段：雪花/小禮物

Lottie 用現成 JSON（或 .lottie），避免手刻。 citeturn1search1turn1search21

---

# 7) 視覺規格（Design Tokens）

## 7.1 色彩
- 背景：#050614 ~ #0B1026（深夜藍）
- 星光：#E9F7FF（偏冷白）
- 銀河點綴：#BFA7FF、#7EE7FF、#FFB7E1（低飽和）
- 卡片底：rgba(10, 12, 28, 0.55) + backdrop blur

## 7.2 字體
- 標題：襯線/夢幻（例如 Cinzel / Playfair Display）
- 內文：乾淨（例如 Inter / Noto Sans TC）

## 7.3 卡片（照片/文字）
- 玻璃擬態：`backdrop-blur` + `bg-white/5` + 柔和陰影
- **手繪邊框**：Rough.js 生成 SVG 疊在卡片外框（粗細 2~3px） citeturn0search2

---

# 8) 非功能性需求（NFR）

## 8.1 效能（美感優先但不能卡）
- 首屏（不含大圖）：**< 1.5MB**
- 主要照片：建議每張 **< 350KB**（JPG 壓縮 70~82%），超過就會影響浪漫感（等待=出戲）。
- 只預載：首屏背景 + 第一個節點照片；其他 `loading="lazy"`。

## 8.2 相容性
- 目標：iOS Safari / Android Chrome 的近兩年版本。
- 對於低階機：
  - 降低 three.js 星點數量
  - 關閉部分 Lottie

## 8.3 可存取性
- 支援 `prefers-reduced-motion`：使用者若偏好減少動畫，則：
  - 關閉 Lenis
  - 停用大幅度進出場（改成單純淡入）

## 8.4 隱私
- 不收集資料、不用 Cookie 追蹤（這是情書頁）。

---

# 9) 專案結構（建議用 Vite + Tailwind，方便 deploy）

> Tailwind 官方也提供 Vite 安裝指引，整合最順。 citeturn2search0

```
project/
  public/
    assets/
      photos/        # 你的 JPG
      stickers/      # 你的貼圖 PNG/WebP
      lottie/        # lottie json/.lottie
      music/         # mp3
  src/
    content/
      story.json
    styles/
      main.css
    js/
      app.js         # 渲染 + 初始化（GSAP/Lenis/Vivus/Three/Lottie）
      three-bg.js
      timeline.js
      rough-frames.js
  index.html
  vite.config.js
```

---

# 10) 部署規格

## 10.1 Firebase Hosting（推薦：最省心、CDN 快）
- Firebase Hosting 提供快速安全的靜態網站部署（全球 CDN）。 citeturn2search4turn2search7
- 流程（高層級）：
  1) `firebase init hosting`（選 `dist` 當 public）
  2) `npm run build`
  3) `firebase deploy`

## 10.2 GitHub Pages（最簡單、但要注意 build）
- 可從指定 branch/folder 發佈，或用 GitHub Actions 自動 build 後發佈。 citeturn2search5turn2search8
- 如果你發佈的是 build 後純靜態檔，通常用 Actions 比較穩。

---

# 11) 驗收標準（Acceptance Criteria）

1. 手機打開首屏就「很美」：星空 + 銀河 + 左右貼圖 + 標題。
2. 點「開啟音樂」後開始播放背景音樂（不中斷、可靜音）。
3. 向下滑，每個節點卡片都會：淡入 → 停留 → 淡出（視覺連貫）。
4. 中央藤蔓時間線有「被畫出來」的效果，且每節點對應一段內容。
5. 每個卡片都有手繪漫畫邊框，不會在不同手機尺寸破版。
6. 圖片不會一次全載入導致卡頓；滑到才載入。
7. 最後一屏是收束祝福，且有「回到頂部」按鈕。

---

# 12) 你接下來只要提供的素材清單（最小集合）

- `photos/`：6~10 張 JPG（建議 9:16 或接近直幅）
- `stickers/`：Nick/Judy/其他角色貼圖（或替代素材）
- `music/track.mp3`：柔和輕快（可用 Pixabay Music 下載） citeturn1search3
- `lottie/`：至少 2 個（星星閃、向下箭頭）

---

# 13) 參考風格（網路上類似「scrollytelling」風格）

你找靈感時可用關鍵字：**scrollytelling / scroll story / timeline scroll**。Scrollytelling 的設計模式就是靠捲動觸發多媒體變化。 citeturn0search0turn0search1

（如果你願意，我也可以再幫你把「beats 節點」直接擬一份完整 8~10 段故事模板，並把每段要用的照片/旁白/貼圖插槽都編好 B01~B10，讓你只要填空。）

