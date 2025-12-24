/**
 * timeline.js - 時間線渲染與動畫 + 主題切換
 *
 * 功能：
 * - 左右交錯佈局（桌面版）
 * - 玻璃擬態卡片設計
 * - 進場/離場動畫（scroll-linked）
 * - 微漂浮循環動畫
 * - 貼圖插槽與 Lottie 容器
 * - 主題自動切換系統（starlight/christmas/memory）
 * - 視差效果（背景與卡片）
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// 確保 ScrollTrigger 已註冊（防止重複註冊警告）
if (!gsap.plugins.ScrollTrigger) {
  gsap.registerPlugin(ScrollTrigger);
}

// ===== 主題切換系統 =====
/**
 * 主題配置：定義三種主題的樣式變數
 */
const themeConfig = {
  starlight: {
    name: 'starlight',
    label: 'Starlight',
    colors: {
      primary: '#E9F7FF',      // 星光藍白
      secondary: '#BFA7FF',     // 紫色調
      accent: '#7EE7FF',        // 青色調
      background: 'rgba(10, 12, 28, 0.55)',
      border: 'rgba(233, 247, 255, 0.12)',
      borderHover: 'rgba(233, 247, 255, 0.18)',
      glow: 'rgba(233, 247, 255, 0.15)',
      glowHover: 'rgba(233, 247, 255, 0.12)'
    },
    backgroundFilter: 'brightness(1) hue-rotate(0deg)',
    transition: 'all 1.5s cubic-bezier(0.4, 0.0, 0.2, 1)'
  },
  christmas: {
    name: 'christmas',
    label: 'Christmas',
    colors: {
      primary: '#FFB7E1',       // 聖誕粉紅
      secondary: '#FF6B9D',      // 深粉紅
      accent: '#FFC0CB',        // 淺粉紅
      background: 'rgba(20, 12, 16, 0.60)',
      border: 'rgba(255, 183, 225, 0.15)',
      borderHover: 'rgba(255, 183, 225, 0.25)',
      glow: 'rgba(255, 183, 225, 0.1)',
      glowHover: 'rgba(255, 183, 225, 0.08)'
    },
    backgroundFilter: 'brightness(1.15) hue-rotate(-10deg) saturate(1.2)',
    transition: 'all 1.5s cubic-bezier(0.4, 0.0, 0.2, 1)'
  },
  memory: {
    name: 'memory',
    label: 'Memory',
    colors: {
      primary: '#D4C9B8',       // 米黃
      secondary: '#A89880',      // 棕褐色
      accent: '#E8DCC8',        // 淡米黃
      background: 'rgba(25, 20, 15, 0.58)',
      border: 'rgba(212, 201, 184, 0.12)',
      borderHover: 'rgba(212, 201, 184, 0.18)',
      glow: 'rgba(212, 201, 184, 0.08)',
      glowHover: 'rgba(212, 201, 184, 0.06)'
    },
    backgroundFilter: 'brightness(0.95) sepia(0.25) hue-rotate(25deg)',
    transition: 'all 1.5s cubic-bezier(0.4, 0.0, 0.2, 1)'
  }
};

/**
 * 主題管理器
 */
class ThemeManager {
  constructor() {
    this.currentTheme = 'starlight';
    this.root = document.documentElement;
    this.observers = [];

    // 初始化樣式根變數
    this.initializeRootVariables();
    this.setTheme('starlight');
  }

  /**
   * 初始化 CSS 自訂屬性（變數）
   */
  initializeRootVariables() {
    // 重新整理所有主題變數到根元素
    const cssVars = {};

    Object.entries(themeConfig).forEach(([themeName, config]) => {
      Object.entries(config.colors).forEach(([colorName, colorValue]) => {
        const varName = `--theme-${themeName}-${colorName}`;
        cssVars[varName] = colorValue;
      });

      const filterVarName = `--theme-${themeName}-filter`;
      cssVars[filterVarName] = config.backgroundFilter;
    });

    // 應用所有 CSS 變數
    Object.entries(cssVars).forEach(([key, value]) => {
      this.root.style.setProperty(key, value);
    });
  }

  /**
   * 切換主題
   * @param {string} themeName - 主題名稱 (starlight/christmas/memory)
   */
  setTheme(themeName) {
    if (!themeConfig[themeName]) {
      console.warn(`[Theme] Unknown theme: ${themeName}`);
      return;
    }

    const config = themeConfig[themeName];
    this.currentTheme = themeName;

    // 更新根元素樣式變數
    Object.entries(config.colors).forEach(([colorName, colorValue]) => {
      this.root.style.setProperty(`--theme-current-${colorName}`, colorValue);
    });

    this.root.style.setProperty('--theme-current-filter', config.backgroundFilter);
    this.root.style.setProperty('--theme-transition', config.transition);

    // 更新文檔主題屬性
    this.root.setAttribute('data-theme', themeName);

    // 觸發主題變化事件，讓所有監聽器更新
    window.dispatchEvent(new CustomEvent('themeChange', { detail: { theme: themeName, config } }));

    console.log(`[Theme] Switched to ${themeName}`);
  }

  /**
   * 取得當前主題設定
   */
  getCurrentConfig() {
    return themeConfig[this.currentTheme];
  }

  /**
   * 訂閱主題變化
   */
  onChange(callback) {
    window.addEventListener('themeChange', (event) => {
      callback(event.detail.theme, event.detail.config);
    });
  }
}

// 全局主題管理器實例
const themeManager = new ThemeManager();

/**
 * 主題觀察器：監控滾動位置，自動切換主題
 */
class ThemeObserver {
  constructor() {
    this.themeRanges = [];
    this.currentThemeIndex = -1;
  }

  /**
   * 從 beats 資料建立主題範圍
   */
  setBeatThemes(beats) {
    this.themeRanges = [];

    beats.forEach((beat, index) => {
      const theme = beat.theme || 'starlight';
      const beatElement = document.querySelector(`[data-beat-id="${beat.id}"]`);

      if (beatElement) {
        this.themeRanges.push({
          index,
          beatId: beat.id,
          theme,
          element: beatElement,
          rect: beatElement.getBoundingClientRect()
        });
      }
    });

    console.log(`[ThemeObserver] Set up ${this.themeRanges.length} theme ranges`);
  }

  /**
   * 根據視口位置檢查應使用的主題
   * 返回應該啟用的主題 (最接近視口中心的 beat)
   */
  detectTheme(viewportCenter) {
    if (this.themeRanges.length === 0) return null;

    let closestIndex = -1;
    let minDistance = Infinity;

    for (let i = 0; i < this.themeRanges.length; i++) {
      const range = this.themeRanges[i];
      const beatRect = range.element.getBoundingClientRect();
      const beatCenter = beatRect.top + beatRect.height / 2;

      const distance = Math.abs(beatCenter - viewportCenter);

      if (distance < minDistance) {
        minDistance = distance;
        closestIndex = i;
      }
    }

    return closestIndex >= 0 ? this.themeRanges[closestIndex].theme : null;
  }
}

const themeObserver = new ThemeObserver();

/**
 * 初始化滾動監聽器以實現主題自動切換
 */
function setupThemeSwitchTriggers() {
  // 使用 ScrollTrigger 為每個 beat 建立主題切換觸發器
  const beats = gsap.utils.toArray('.beat-card');
  const viewportCenter = window.innerHeight / 2;

  beats.forEach((card) => {
    ScrollTrigger.create({
      trigger: card,
      start: 'top 50%',      // beat 進入視口中心時
      end: 'bottom 50%',
      onToggle: (self) => {
        if (self.isActive) {
          const theme = card.getAttribute('data-theme') || 'starlight';
          themeManager.setTheme(theme);
        }
      },
      invalidateOnRefresh: true
    });
  });

  // 同時監聽滾動事件，動態偵測最接近視口的主題
  window.addEventListener('scroll', () => {
    const detectedTheme = themeObserver.detectTheme(viewportCenter);
    if (detectedTheme && detectedTheme !== themeManager.currentTheme) {
      themeManager.setTheme(detectedTheme);
    }
  }, { passive: true });

  console.log('[Timeline] Theme switch triggers set up');
}

/**
 * 視差效果設置
 *
 * 功能：
 * - 星空背景位移：progress × 80px
 * - 銀河雲層視差：progress × 20px × 0.5
 * - ScrollTrigger scrub: 0.8 實現平滑跟隨
 * - 低效能設備自動降級
 *
 * @param {string} performanceLevel - 效能等級 (low/medium/high)
 */
function setupBackgroundParallax(performanceLevel) {
  // 低效能設備禁用視差效果
  if (performanceLevel === 'low') {
    console.log('[Parallax] Disabled for low-end devices');
    return;
  }

  console.log('[Parallax] Setting up parallax effects...');

  // 取得背景元素
  const starfieldCanvas = document.getElementById('starfield-canvas');
  const galaxyMist = document.getElementById('galaxy-mist');

  if (!starfieldCanvas || !galaxyMist) {
    console.warn('[Parallax] Background elements not found');
    return;
  }

  // ===== 星空背景視差（全屏滾動） =====
  // 使用全頁滾動范圍作為觸發器
  const starfieldTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,              // 0.8 秒延遲跟隨滾動
      markers: false,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // 直接從 ScrollTrigger 的 progress 計算位移
        // progress 範圍 0-1，轉換為 0-80px 的位移
        const offset = self.progress * 80;
        gsap.set(starfieldCanvas, {
          y: offset,
          force3D: true  // 確保使用 GPU 加速
        });
      }
    }
  });

  // ===== 銀河雲層視差（較小位移） =====
  // 銀河雲層的視差強度為星空的 0.5 倍
  const galaxyTimeline = gsap.timeline({
    scrollTrigger: {
      trigger: 'body',
      start: 'top top',
      end: 'bottom bottom',
      scrub: 0.8,
      markers: false,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        // progress × 20px × 0.5 = progress × 10px
        const offset = self.progress * 10;
        gsap.set(galaxyMist, {
          y: offset,
          force3D: true
        });
      }
    }
  });

  // ===== Beat 卡片視差（可選層次視差） =====
  // 為 beat 卡片添加微妙的視差深度感
  if (performanceLevel === 'high') {
    const beatCards = gsap.utils.toArray('.beat-card');

    beatCards.forEach((card, index) => {
      // 根據卡片位置計算視差強度（上方卡片位移更多）
      const parallaxStrength = 5 + (index % 2) * 2;  // 5-7px 的位移

      ScrollTrigger.create({
        trigger: card,
        start: 'top 80%',
        end: 'bottom 20%',
        onUpdate: (self) => {
          // 只在卡片進入視口時應用視差
          if (self.isActive) {
            const cardOffset = (1 - self.progress) * parallaxStrength;
            gsap.set(card, {
              y: cardOffset,
              force3D: true
            });
          }
        },
        invalidateOnRefresh: true
      });
    });
  }

  console.log('[Parallax] Background parallax effects initialized');
}

export function initTimeline(storyData, options = {}) {
  const { reducedMotion = false, performanceLevel = 'normal' } = options;

  console.log('[Timeline] Initializing enhanced timeline with theme system...');

  const container = document.getElementById('beats-container');
  if (!container || !storyData.beats?.length) {
    console.log('[Timeline] No beats to render');
    return;
  }

  // 追蹤修改的檔案（被動建圖）
  const filesModified = ['src/js/timeline.js', 'src/styles/main.css'];

  // 渲染節點
  storyData.beats.forEach((beat, index) => {
    const beatElement = createBeatElement(beat, index, performanceLevel);
    container.appendChild(beatElement);
  });

  // 設置主題觀察器
  themeObserver.setBeatThemes(storyData.beats);

  // 設置動畫
  if (!reducedMotion) {
    setupScrollAnimations(performanceLevel);
    setupThemeSwitchTriggers();

    // 設置視差效果
    setupBackgroundParallax(performanceLevel);
  } else {
    // reducedMotion 模式下直接顯示
    gsap.set('.beat-card', { opacity: 1, y: 0, filter: 'blur(0)' });
  }

  console.log('[Timeline] Rendered', storyData.beats.length, 'beats with theme system and parallax');
}

/**
 * 創建單個 beat 卡片元素
 *
 * 結構：
 * .beat-card
 *   ├── .sticker-slot-left (貼圖插槽)
 *   ├── .card-content
 *   │   ├── .photo-container
 *   │   ├── .timeLabel
 *   │   ├── .title
 *   │   └── .caption
 *   ├── .sticker-slot-right (貼圖插槽)
 *   └── .lottie-container (Lottie 動畫)
 */
function createBeatElement(beat, index, performanceLevel) {
  const isLeft = index % 2 === 0;
  const theme = beat.theme || 'starlight';

  // 建立主卡片
  const element = document.createElement('div');
  element.className = `beat-card mx-6 md:mx-auto max-w-sm p-6 ${
    isLeft ? 'md:mr-auto md:ml-24' : 'md:ml-auto md:mr-24'
  }`;
  element.setAttribute('data-beat-id', beat.id);
  element.setAttribute('data-beat-index', index);
  element.setAttribute('data-theme', theme);
  element.style.position = 'relative';

  // 玻璃擬態卡片樣式（增強）
  element.classList.add('glass-card-enhanced');

  // ===== 左貼圖插槽（位置錯開，不被照片擋住）=====
  // 根據 index 變換位置增加活潑感
  const leftPositions = [
    '-left-8 -top-8',           // 左上角外側
    '-left-10 bottom-4',        // 左下角外側
    '-left-6 top-1/3',          // 左側偏上
    '-left-12 bottom-1/4',      // 左側偏下
  ];
  const leftPos = leftPositions[index % leftPositions.length];

  const stickerLeftDiv = document.createElement('div');
  stickerLeftDiv.className = `sticker-slot-left absolute ${leftPos} w-14 h-14 md:w-16 md:h-16 pointer-events-none opacity-0 z-20`;
  stickerLeftDiv.setAttribute('data-slot', 'left');

  if (beat.stickerLeft) {
    const imgLeft = document.createElement('img');
    imgLeft.src = beat.stickerLeft;
    imgLeft.alt = `Left sticker for ${beat.title}`;
    imgLeft.className = 'w-full h-full object-contain drop-shadow-lg';
    imgLeft.setAttribute('loading', 'lazy');
    imgLeft.onerror = () => console.warn(`[Timeline] Failed to load left sticker: ${beat.stickerLeft}`);
    stickerLeftDiv.appendChild(imgLeft);
  }

  // ===== 卡片內容區 =====
  const cardContent = document.createElement('div');
  cardContent.className = 'card-content space-y-3';

  // 照片容器
  if (beat.photo) {
    const photoContainer = document.createElement('div');
    photoContainer.className = 'photo-container mb-4';

    const img = document.createElement('img');
    img.src = beat.photo;
    img.alt = beat.title || 'Beat photo';
    img.className = 'w-full h-full object-cover';
    img.setAttribute('loading', 'lazy');
    img.onerror = () => console.warn(`[Timeline] Failed to load photo: ${beat.photo}`);

    photoContainer.appendChild(img);
    cardContent.appendChild(photoContainer);
  }

  // 時間標籤（使用主題顏色變數）
  if (beat.timeLabel) {
    const timeLabel = document.createElement('p');
    timeLabel.className = 'text-sm font-medium theme-primary-text mb-2';
    timeLabel.textContent = beat.timeLabel;
    cardContent.appendChild(timeLabel);
  }

  // 標題（使用主題漸變）
  if (beat.title) {
    const title = document.createElement('h3');
    title.className = 'font-title text-xl font-bold theme-text-gradient';
    title.textContent = beat.title;
    cardContent.appendChild(title);
  }

  // 描述
  if (beat.caption) {
    const caption = document.createElement('p');
    caption.className = 'text-sm md:text-base leading-relaxed theme-secondary-text';
    caption.textContent = beat.caption;
    cardContent.appendChild(caption);
  }

  // ===== 右貼圖插槽（位置錯開，不被照片擋住）=====
  // 根據 index 變換位置增加活潑感（與左側錯開）
  const rightPositions = [
    '-right-8 bottom-8',        // 右下角外側
    '-right-10 -top-6',         // 右上角外側
    '-right-6 bottom-1/3',      // 右側偏下
    '-right-12 top-1/4',        // 右側偏上
  ];
  const rightPos = rightPositions[index % rightPositions.length];

  const stickerRightDiv = document.createElement('div');
  stickerRightDiv.className = `sticker-slot-right absolute ${rightPos} w-14 h-14 md:w-16 md:h-16 pointer-events-none opacity-0 z-20`;
  stickerRightDiv.setAttribute('data-slot', 'right');

  if (beat.stickerRight) {
    const imgRight = document.createElement('img');
    imgRight.src = beat.stickerRight;
    imgRight.alt = `Right sticker for ${beat.title}`;
    imgRight.className = 'w-full h-full object-contain drop-shadow-lg';
    imgRight.setAttribute('loading', 'lazy');
    imgRight.onerror = () => console.warn(`[Timeline] Failed to load right sticker: ${beat.stickerRight}`);
    stickerRightDiv.appendChild(imgRight);
  }

  // ===== Lottie 容器 =====
  const lottieContainer = document.createElement('div');
  lottieContainer.className = 'lottie-container absolute bottom-4 right-4 w-12 h-12 pointer-events-none';
  lottieContainer.setAttribute('data-lottie-id', beat.lottieAnimation || null);

  if (beat.lottieAnimation) {
    // 子容器將由 lottie-loader.js 填充
  }

  // 組合所有元素
  element.appendChild(stickerLeftDiv);
  element.appendChild(cardContent);
  element.appendChild(stickerRightDiv);
  element.appendChild(lottieContainer);

  return element;
}

/**
 * 設置滾動綁定的進場/離場動畫
 *
 * 動畫流程：
 * 1. 進場：opacity 0→1, y 16→0, blur 8→0 (scroll-linked)
 * 2. 停留：微漂浮循環 (y: ±3)
 * 3. 離場：opacity 1→0, y 0→-16, scale 1→0.95 (scroll-linked)
 */
function setupScrollAnimations(performanceLevel) {
  const cards = gsap.utils.toArray('.beat-card');

  cards.forEach((card, index) => {
    const isLeft = index % 2 === 0;

    // ===== 進場動畫 (ScrollTrigger + scrub) =====
    // 初始狀態：不可見、向下偏移、模糊
    gsap.set(card, {
      opacity: 0,
      y: 16,
      filter: 'blur(8px)'
    });

    // 進場動畫時間軸
    const entryTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'top 95%',      // 更早開始（卡片剛進入視口）
        end: 'top 60%',        // 更早完成進場
        scrub: 0.5,            // 更快速的跟隨
        markers: false,
        invalidateOnRefresh: true
      }
    });

    // 進場：不可見 → 可見，向下 → 原位，模糊 → 清晰
    entryTimeline.to(card, {
      opacity: 1,
      y: 0,
      filter: 'blur(0)',
      duration: 1,
      ease: 'power2.out'
    }, 0);

    // 貼圖進場（淡入）- 更高透明度
    entryTimeline.to(
      card.querySelectorAll('[data-slot]'),
      {
        opacity: 0.85,
        duration: 0.8,
        ease: 'power1.out',
        stagger: 0.1
      },
      0.1
    );

    // ===== 停留時微漂浮動畫（使用 transform 避免干擾 y 位置）=====
    // 使用 CSS transform 而非直接改變 y，避免與 ScrollTrigger 動畫衝突
    gsap.to(card, {
      '--float-y': 3,
      duration: 2,
      ease: 'sine.inOut',
      repeat: -1,           // 無限循環
      yoyo: true,           // 反向播放
      paused: true,
      id: `float-${index}`
    });

    // 設置 CSS 變數初始值
    card.style.setProperty('--float-y', '0');

    // 當卡片完全進入視口時啟動漂浮
    ScrollTrigger.create({
      trigger: card,
      start: 'top 50%',
      end: 'top 15%',       // 在離場前停止漂浮
      onEnter: () => {
        gsap.getById(`float-${index}`)?.play();
      },
      onLeave: () => {
        // 離場時停止漂浮，避免與離場動畫衝突
        gsap.getById(`float-${index}`)?.pause();
      },
      onLeaveBack: () => {
        gsap.getById(`float-${index}`)?.pause();
      },
      onEnterBack: () => {
        gsap.getById(`float-${index}`)?.play();
      }
    });

    // ===== 離場動畫 (ScrollTrigger + scrub) =====
    // 使用 bottom 作為觸發基準，確保每張卡片的離場時機一致
    const exitTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: card,
        start: 'bottom 25%',    // 卡片底部到達視口 25% 位置時開始離場
        end: 'bottom -10%',     // 卡片底部完全離開視口時完成離場
        scrub: 0.3,             // 更快的跟隨，減少延遲差異
        markers: false,
        invalidateOnRefresh: true
      }
    });

    // 離場：可見 → 不可見，原位 → 向上，輕微縮小
    exitTimeline.to(card, {
      opacity: 0,
      y: -16,
      scale: 0.98,              // 縮小幅度減小
      duration: 1,
      ease: 'power2.in'
    }, 0);

    // 貼圖淡出
    exitTimeline.to(
      card.querySelectorAll('[data-slot]'),
      {
        opacity: 0,
        duration: 0.6,
        ease: 'power1.in'
      },
      0
    );

    // ===== 視覺增強：陰影隨 opacity 變化 =====
    // 進場時逐漸增強陰影以提升景深感
    entryTimeline.to(card, {
      boxShadow: '0 12px 48px var(--theme-current-glow)',
      duration: 1,
      ease: 'power1.out'
    }, 0);

    // 離場時陰影淡出
    exitTimeline.to(card, {
      boxShadow: '0 4px 16px rgba(5, 6, 20, 0.3)',
      duration: 1,
      ease: 'power1.in'
    }, 0);

    // ===== 左右視差（可選，效能考量） =====
    if (performanceLevel !== 'low') {
      // 左卡片向左移，右卡片向右移，營造動感
      const parallaxX = isLeft ? -8 : 8;

      entryTimeline.to(card, {
        x: parallaxX,
        duration: 1,
        ease: 'power2.out'
      }, 0);

      exitTimeline.to(card, {
        x: -parallaxX,
        duration: 1,
        ease: 'power2.in'
      }, 0);
    }
  });

  console.log('[Timeline] Scroll animations setup complete');
}

/**
 * 調用此函數重新整理動畫（窗口調整大小時）
 */
export function refreshTimelineAnimations() {
  console.log('[Timeline] Refreshing animations...');
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.trigger?.classList?.contains('beat-card')) {
      trigger.refresh();
    }
  });
}

/**
 * 調用此函數銷毀所有時間軸和 ScrollTriggers（清理）
 */
export function destroyTimeline() {
  console.log('[Timeline] Destroying timeline animations...');
  const cards = gsap.utils.toArray('.beat-card');

  cards.forEach((card, index) => {
    // 停止漂浮動畫
    const floatTween = gsap.getById(`float-${index}`);
    if (floatTween) {
      floatTween.kill();
    }
  });

  // 清理所有與 beat-card 相關的 ScrollTriggers
  ScrollTrigger.getAll().forEach(trigger => {
    if (trigger.vars.trigger?.classList?.contains('beat-card')) {
      trigger.kill();
    }
  });

  console.log('[Timeline] Timeline destroyed');
}

/**
 * 實用函數：取得特定 beat 的卡片元素
 */
export function getBeatCard(beatId) {
  return document.querySelector(`[data-beat-id="${beatId}"]`);
}

/**
 * 實用函數：手動觸發特定卡片的進場動畫（用於動態加載）
 */
export function animateCardEntry(card) {
  if (!card) return;

  gsap.set(card, { opacity: 0, y: 16, filter: 'blur(8px)' });
  gsap.to(card, {
    opacity: 1,
    y: 0,
    filter: 'blur(0)',
    duration: 0.8,
    ease: 'power2.out'
  });

  // 貼圖淡入
  gsap.to(card.querySelectorAll('[data-slot]'), {
    opacity: 0.6,
    duration: 0.6,
    ease: 'power1.out',
    stagger: 0.1
  }, 0.1);
}

/**
 * 匯出主題管理器供外部使用
 */
export { themeManager };
