# 素材自訂指南 (CUSTOMIZATION GUIDE)

這份指南會幫助你將網站的預設素材替換成自己的內容。無論是照片、文字、音樂還是貼圖，都可以輕鬆自訂。

---

## 1. 替換照片

### 位置
所有照片放在：`/public/assets/photos/`

### 需求規格
- **比例**：9:16（直幅） ← 最重要，手機優先
- **格式**：JPG（推薦）或 PNG
- **大小**：建議 < 350KB（用於手機載入速度）
- **解析度**：至少 1080×1920px（手機高清）

### 如何替換

#### 步驟 1：準備照片
1. 選擇要用的照片（最多 6 張 for S1~S6）
2. 用圖片編輯工具（如 Adobe Lightroom、Pixlr、Free Online Photo Editor）裁剪成 9:16 的直幅
3. 壓縮檔案大小到 350KB 以下

#### 步驟 2：上傳到專案
複製照片到 `/public/assets/photos/` 目錄，命名規則：
```
placeholder-01.jpg
placeholder-02.jpg
placeholder-03.jpg
...
```

#### 步驟 3：修改 story.json
編輯 `src/content/story.json`，在 `beats` 陣列中修改照片路徑：

```json
{
  "beats": [
    {
      "id": "B01",
      "timeLabel": "第一個瞬間",
      "title": "我們的開始",
      "type": "photo",
      "photo": "/assets/photos/placeholder-01.jpg",  // ← 改成你的檔案名
      "caption": "在這裡寫下你想說的話...",
      "theme": "starlight",
      "lottieAnimation": "sparkle"
    },
    {
      "id": "B02",
      "timeLabel": "美好時光",
      "title": "一起的日子",
      "type": "photo",
      "photo": "/assets/photos/placeholder-02.jpg",  // ← 改成你的檔案名
      "caption": "每一天都因為有你而特別...",
      "theme": "starlight",
      "lottieAnimation": "snowflake"
    }
    // 按照需要新增更多 beats...
  ]
}
```

### 壓縮技巧（可選但推薦）
如果照片超過 350KB，可用以下工具壓縮：
- **線上工具**：[TinyJPG](https://tinyjpg.com)、[Squoosh](https://squoosh.app)
- **命令列**（Mac/Linux）：
  ```bash
  # 用 ImageMagick 壓縮
  convert original.jpg -quality 85 -resize 1080x1920 placeholder-01.jpg
  ```

---

## 2. 修改文字

### 主要文字欄位
編輯 `src/content/story.json` 檔案：

```json
{
  "site": {
    "title": "Half-Year & Christmas",          // ← 首頁大標題
    "subtitle": "給秈瑀的一封星光長信",        // ← 首頁副標題
    "from": "李傳漢",                          // ← 寄件者（第一行署名）
    "to": "林秈瑀",                            // ← 收件者
    "music": {
      "src": "/assets/music/track.mp3",
      "credit": "Pixabay Music"                // ← 音樂創作者/版權標註
    }
  },
  "beats": [
    {
      "id": "B01",
      "timeLabel": "第一個瞬間",                // ← 時間標籤（左側）
      "title": "我們的開始",                    // ← 段落標題
      "caption": "在這裡寫下你想說的話...",    // ← 照片下方描述文字
      "lottieAnimation": "sparkle"              // ← 動畫類型（見下方）
    }
  ],
  "ending": {
    "title": "半週年快樂 & 聖誕快樂",          // ← 結尾標題
    "message": "謝謝你這半年來的陪伴，願..."   // ← 結尾祝福文字
  }
}
```

### 支援的動畫類型
在 `lottieAnimation` 欄位可用：
- `sparkle` - 星星閃爍
- `snowflake` - 飄落雪花
- `float` - 溫和漂浮
- `pulse` - 脈衝光暈

### 新增更多段落
在 `beats` 陣列中新增物件：

```json
{
  "beats": [
    // 既有的 B01, B02...
    {
      "id": "B03",                             // 唯一 ID（建議 B03, B04...）
      "timeLabel": "第三個時刻",               // 自訂時間標籤
      "title": "新的回憶",                     // 段落標題
      "type": "photo",
      "photo": "/assets/photos/placeholder-03.jpg",  // 照片路徑
      "caption": "你的故事描述...",
      "theme": "starlight",
      "lottieAnimation": "snowflake"
    }
  ]
}
```

---

## 3. 替換音樂

### 位置
音樂檔案放在：`/public/assets/music/`

### 需求規格
- **格式**：MP3（推薦）或 OGG、WAV
- **大小**：建議 < 10MB（用於行動網路）
- **長度**：3~5 分鐘（整頁捲動時間）
- **音量**：-3dB ~ 0dB（音樂播放器預設音量需清晰但不刺耳）

### 如何替換

#### 步驟 1：準備音樂
1. 選擇無版權或已授權的音樂
2. 下載 MP3 格式
3. 確認檔案大小 < 10MB

**推薦免版稅音樂來源**：
- [Pixabay Music](https://pixabay.com/music/) - 可商用、免授權
- [Free Music Archive](https://freemusicarchive.org/) - 檢查 CC 授權
- [Epidemic Sound](https://www.epidemicsound.com/) - 有償訂閱但音質優秀

#### 步驟 2：上傳到專案
複製音樂檔案到 `/public/assets/music/`，建議命名：
```
track.mp3
```

#### 步驟 3：修改 story.json
編輯 `src/content/story.json` 中的音樂欄位：

```json
{
  "site": {
    "music": {
      "src": "/assets/music/track.mp3",        // ← 改成你的檔案名
      "credit": "Artist Name or Creator"       // ← 音樂創作者/授權商
    }
  }
}
```

### 音樂授權提醒 ⚠️
- **重要**：使用音樂前，務必確認你有以下其中之一：
  - 該音樂標註為可商用/CC0
  - 你擁有購買授權
  - 你是創作者本人
  - 已取得明確的使用許可

- **建議做法**：在 `credit` 欄位清楚標註來源，例如：
  ```json
  "credit": "Background Music by [Artist] from Pixabay Music"
  ```

---

## 4. 替換貼圖

### 位置
貼圖放在：`/public/assets/stickers/`

### 需求規格
- **格式**：PNG（支援透明背景）
- **尺寸**：建議 256×256px ~ 512×512px（網頁上顯示 96×96px）
- **檔案大小**：< 100KB
- **背景**：必須透明（PNG with alpha channel）

### 貼圖位置說明
網站有兩個貼圖位置：
- **左下貼圖** (`sticker-left`) - 首頁左下角
- **右下貼圖** (`sticker-right`) - 首頁右下角

### 如何替換

#### 步驟 1：準備貼圖
1. 選擇兩個角色或元素貼圖
2. 用圖片編輯工具（如 Photoshop、GIMP、Canva）製作：
   - 背景設為透明
   - 導出為 PNG 格式
   - 解析度 256×256px 或以上

#### 步驟 2：上傳到專案
複製貼圖到 `/public/assets/stickers/`，命名：
```
nick.png     (左下貼圖)
judy.png     (右下貼圖)
```

#### 步驟 3：修改 story.json
編輯 `src/content/story.json` 中的貼圖欄位：

```json
{
  "site": {
    "stickers": {
      "left": "/assets/stickers/nick.png",     // ← 左貼圖
      "right": "/assets/stickers/judy.png"     // ← 右貼圖
    }
  }
}
```

### 貼圖版權提醒 ⚠️
- **重要**：確保你有以下其中之一：
  - 使用官方授權購買的貼圖
  - 自己繪製的貼圖
  - 可商用的 CC0/CC-BY 素材
  - 已取得版權持有者的許可

- **常見來源**：
  - [Freepik](https://www.freepik.com/) - 部分免費素材
  - [Pixabay](https://pixabay.com/) - CC0 素材
  - [Pexels](https://www.pexels.com/) - CC0 素材
  - 自繪或委外製作

---

## 5. 色彩調整（進階）

網站的配色由 Tailwind CSS 配置控制。如果你想自訂整體色調，編輯 `tailwind.config.js`：

### 核心色彩系統

```javascript
// tailwind.config.js
theme: {
  extend: {
    colors: {
      'night': {
        50: '#E9F7FF',    // 最亮
        100: '#BFA7FF',
        200: '#7EE7FF',
        300: '#FFB7E1',
        700: '#0B1026',
        800: '#080C1A',
        900: '#050614',   // 最深（背景）
      },
      'starlight': '#E9F7FF',         // 星光白（主文字色）
      'galaxy-purple': '#BFA7FF',     // 銀河紫
      'galaxy-cyan': '#7EE7FF',       // 銀河青
      'galaxy-pink': '#FFB7E1',       // 銀河粉
    },
  },
}
```

### 常見調整案例

#### 改變背景色（深色主題）
```javascript
'night': {
  900: '#0a0a1a',  // 從 #050614 改為更深的藍黑
}
```

#### 改變主文字色（從冷白改為暖白）
```javascript
'starlight': '#FFF5E6',  // 改成暖白色
```

#### 改變銀河漸層（從紫色改為紅色系）
```javascript
'galaxy-purple': '#FF6B9D',   // 改成紅紫色
'galaxy-pink': '#FF1493',     // 改成深粉紅
```

### 調整後的驗證
修改後執行：
```bash
npm run dev
```
在開發伺服器中檢視色彩效果。

### 色彩值說明

| 欄位 | 用途 | 建議色系 |
|------|------|----------|
| `night.900` | 頁面背景（最黑） | 深藍黑 |
| `starlight` | 主文字、標題 | 明亮冷白或暖白 |
| `galaxy-purple` | 標題漸層、光暈 | 紫色系 |
| `galaxy-cyan` | 漸層點綴、高亮 | 青藍系 |
| `galaxy-pink` | 漸層點綴、氛圍 | 粉紅系 |

### 快速色彩產生器
使用免費工具產生調和色彩：
- [Coolors.co](https://coolors.co/) - 色彩搭配建議
- [Adobe Color](https://color.adobe.com/) - 專業色彩輪
- [Colordot](https://color.hailpixel.com/) - 直觀選色

---

## 6. 快速檢查清單

在部署前，確認以下項目：

- [ ] **照片**：所有照片已上傳到 `/public/assets/photos/`
- [ ] **照片規格**：9:16 比例、< 350KB、JPG 格式
- [ ] **story.json 照片路徑**：所有 `photo` 欄位正確指向檔案
- [ ] **文字**：所有 title、caption、message 已修改
- [ ] **音樂**：檔案已上傳到 `/public/assets/music/`
- [ ] **音樂授權**：確認使用授權，`credit` 欄位已填寫
- [ ] **貼圖**：两個 PNG 貼圖已上傳到 `/public/assets/stickers/`
- [ ] **貼圖授權**：確認使用授權
- [ ] **story.json 貼圖路徑**：`stickers.left` 和 `stickers.right` 正確
- [ ] **測試**：執行 `npm run dev`，所有內容在本機正確顯示

---

## 7. 故障排除

### 照片沒有顯示
**可能原因**：
1. 檔案路徑錯誤（檢查 story.json 中的 `photo` 欄位）
2. 檔案未放到 `/public/assets/photos/` 目錄
3. 檔案名稱大小寫錯誤

**解決**：
- 檢查檔案瀏覽器中的實際檔案名
- 確認 story.json 中的路徑完全匹配

### 音樂不播放
**可能原因**：
1. 檔案路徑錯誤
2. 瀏覽器安全策略禁止自動播放（正常）
3. 音樂格式不支援

**解決**：
- 確認檔案在 `/public/assets/music/`
- 確認點擊了「開啟音樂」按鈕（首頁提示點音樂按鈕開啟）
- 改用 MP3 格式重新上傳

### 貼圖背景不透明
**可能原因**：
- 上傳的是 JPG 而不是 PNG
- PNG 檔案沒有透明通道

**解決**：
- 用圖片編輯工具重新導出為 PNG with Alpha
- 確保背景是透明的（工具中應顯示棋盤紋樣）

### 頁面載入很慢
**可能原因**：
- 照片檔案太大
- 音樂檔案太大

**解決**：
- 用 TinyJPG 或 Squoosh 壓縮照片到 < 350KB
- 用音樂編輯軟體（如 Audacity）重新編碼音樂為低位元率 MP3

---

## 8. 進階：新增更多內容

### 新增更多時間線段落 (beats)

編輯 story.json 的 `beats` 陣列，新增物件：

```json
{
  "id": "B07",
  "timeLabel": "第七個時刻",
  "title": "未來的約定",
  "type": "photo",
  "photo": "/assets/photos/placeholder-07.jpg",
  "caption": "我們的故事還在繼續...",
  "theme": "starlight",
  "lottieAnimation": "sparkle"
}
```

**重點**：
- `id` 必須唯一（建議 B01, B02, ... B99）
- `lottieAnimation` 可選值：`sparkle`, `snowflake`, `float`, `pulse`

### 新增自訂 Lottie 動畫

如果想用自訂的 Lottie 動畫（JSON 格式）：

1. 下載或製作 Lottie 動畫檔案（`.json`）
2. 放到 `/public/assets/lottie/`
3. 在 story.json 中改用完整路徑：
   ```json
   "lottieAnimation": "/assets/lottie/custom-animation.json"
   ```

---

## 9. 相關檔案快速參考

| 檔案 | 說明 |
|------|------|
| `src/content/story.json` | 所有文字、照片、貼圖、音樂的配置中樞 |
| `/public/assets/photos/` | 照片儲存位置 |
| `/public/assets/stickers/` | 貼圖儲存位置 |
| `/public/assets/music/` | 音樂儲存位置 |
| `/public/assets/lottie/` | Lottie 動畫儲存位置（可選） |
| `tailwind.config.js` | 色彩、字體、動畫配置（進階） |
| `index.html` | 網頁結構（一般不需修改） |

---

## 10. 本地測試與部署

### 本地測試
```bash
# 安裝依賴（首次執行）
npm install

# 啟動開發伺服器
npm run dev

# 在瀏覽器打開 http://localhost:5173
```

### 測試檢查清單
- [ ] 首頁標題和副標題正確
- [ ] 貼圖在首頁左右顯示
- [ ] 可以點擊「開啟音樂」按鈕
- [ ] 向下滑動看到所有照片和文字
- [ ] 每個段落的標題、描述、照片對應正確
- [ ] 結尾祝福文字正確
- [ ] 手機上（或模擬器）呈現正常

### 建置部署
```bash
# 產生正式版
npm run build

# 產出檔案在 dist/ 目錄，可部署到網服務器
```

---

**祝你製作出完美的半週年 + 聖誕祝福頁面！** 🌟

有任何問題，請參考本指南的「故障排除」章節，或檢查 story.json 和檔案路徑。
