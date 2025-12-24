# Half Year Card - SSOT 索引

## 專案文件

docs:
  - id: doc.spec
    name: 專案規格書 (SSOT)
    ref: SPEC.md
    description: 完整的專案規格，包含技術棧、頁面結構、視覺規格、驗收標準

  - id: doc.claude
    name: Claude 協作指南
    ref: CLAUDE.md
    description: Claude Code 使用規則與 PFC 系統說明

## 主要程式碼

code:
  - id: code.app
    name: 主入口
    ref: src/js/app.js
    description: 應用初始化、模組協調

  - id: code.three
    name: 星空背景
    ref: src/js/three-bg.js
    description: Three.js 星空粒子系統

  - id: code.timeline
    name: 時間線系統
    ref: src/js/timeline.js
    description: 時間線渲染與動畫

  - id: code.rough
    name: 手繪邊框
    ref: src/js/rough-frames.js
    description: Rough.js 手繪效果

  - id: code.vivus
    name: 藤蔓動畫
    ref: src/js/vivus-vine.js
    description: Vivus SVG 繪製動畫

  - id: code.music
    name: 音樂播放器
    ref: src/js/music-player.js
    description: 背景音樂控制

  - id: code.lottie
    name: Lottie 載入器
    ref: src/js/lottie-loader.js
    description: Lottie 動畫載入

  - id: code.utils
    name: 工具函數
    ref: src/js/utils.js
    description: 效能偵測、防抖節流

## 內容數據

content:
  - id: data.story
    name: 故事內容
    ref: src/content/story.json
    description: 時間線節點、網站配置

## 樣式

styles:
  - id: style.main
    name: 主樣式
    ref: src/styles/main.css
    description: Tailwind CSS 入口與自訂樣式

  - id: style.tailwind
    name: Tailwind 配置
    ref: tailwind.config.js
    description: 自訂色彩、字體、動畫
