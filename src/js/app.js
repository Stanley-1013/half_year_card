/**
 * app.js - 主應用入口
 */

import '../styles/main.css';

// 動畫與滾動庫
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

// 模組
import { initStarfield } from './three-bg.js';
import { initTimeline, refreshTimelineAnimations } from './timeline.js';
import { initRoughFrames } from './rough-frames.js';
import { initMusicPlayer } from './music-player.js';
import { initLottie } from './lottie-loader.js';
import { initVineSVG, refreshVineScroll } from './vivus-vine.js';
import { initEndingEffects, refreshEndingScrollTriggers } from './ending-effects.js';
import { detectPerformance, prefersReducedMotion } from './utils.js';

// 註冊 GSAP 插件
gsap.registerPlugin(ScrollTrigger);

/**
 * 主初始化函數
 */
async function init() {
  try {
    console.log('[App] Initializing Half Year Card...');

    const performanceLevel = detectPerformance();
    const reducedMotion = prefersReducedMotion();

    console.log('[App] Performance level:', performanceLevel);
    console.log('[App] Reduced motion:', reducedMotion);

    // 載入故事數據
    const storyData = await loadStoryData();

    // 初始化平滑滾動
    let lenis = null;
    if (!reducedMotion) {
      lenis = initSmoothScroll();
    }

    // 初始化各模組
    initStarfield({ performanceLevel, reducedMotion });
    initTimeline(storyData, { performanceLevel, reducedMotion });
    initRoughFrames({ reducedMotion });
    initMusicPlayer(storyData.site?.music);

    // 初始化 Welcome 動畫
    initWelcomeAnimations(storyData, reducedMotion);

    // 初始化 Ending 動畫與特效
    initEnding(storyData, { performanceLevel, reducedMotion });

    // 初始化 Lottie 動畫
    initLottie();

    // 初始化藤蔓 SVG
    initVineSVG(storyData.beats?.length || 6);

    // 設置窗口調整大小監聽器
    setupResizeListener();

    // 移除 Loading Screen
    hideLoadingScreen();

    console.log('[App] Initialization complete!');

  } catch (error) {
    console.error('[App] Initialization failed:', error);
    showErrorMessage('載入失敗，請重新整理頁面');
  }
}

async function loadStoryData() {
  try {
    const response = await fetch('/src/content/story.json');
    if (!response.ok) throw new Error('Failed to load story.json');
    return await response.json();
  } catch (error) {
    console.warn('[App] Using default story data');
    return {
      site: {
        title: 'Half-Year & Christmas',
        subtitle: '給秈瑀的一封星光長信',
        music: { src: '/assets/music/track.mp3' }
      },
      beats: [],
      ending: { message: '' }
    };
  }
}

function initSmoothScroll() {
  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    orientation: 'vertical',
    smoothWheel: true
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  return lenis;
}

/**
 * 優化的 Welcome 動畫 - 增強貼圖進場、音樂按鈕互動、標題漸變
 */
function initWelcomeAnimations(storyData, reducedMotion) {
  const { site } = storyData;

  if (site?.title) {
    document.getElementById('main-title').textContent = site.title;
  }
  if (site?.subtitle) {
    document.getElementById('subtitle').textContent = site.subtitle;
  }

  // 載入貼圖
  if (storyData.site?.stickers) {
    const leftSticker = document.getElementById('sticker-left');
    const rightSticker = document.getElementById('sticker-right');

    if (leftSticker && storyData.site.stickers.left) {
      const imgLeft = document.createElement('img');
      imgLeft.src = storyData.site.stickers.left;
      imgLeft.alt = 'Left sticker';
      imgLeft.className = 'w-full h-full object-contain';
      imgLeft.setAttribute('loading', 'lazy');
      imgLeft.onerror = () => console.warn('[App] Left sticker load failed');
      leftSticker.appendChild(imgLeft);
    }

    if (rightSticker && storyData.site.stickers.right) {
      const imgRight = document.createElement('img');
      imgRight.src = storyData.site.stickers.right;
      imgRight.alt = 'Right sticker';
      imgRight.className = 'w-full h-full object-contain';
      imgRight.setAttribute('loading', 'lazy');
      imgRight.onerror = () => console.warn('[App] Right sticker load failed');
      rightSticker.appendChild(imgRight);
    }
  }

  const tl = gsap.timeline({ delay: 0.5 });

  if (reducedMotion) {
    // Reduced Motion: 簡化動畫
    tl.to(['#main-title', '#subtitle', '#music-btn', '#scroll-hint'], {
      opacity: 1,
      duration: 0.3
    });
  } else {
    // 完整動畫序列
    // 1. 標題動畫 - 漸變進場
    tl.to('#main-title', {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power2.out'
    }, 0)
      // 2. 副標題動畫 - 跟隨進場
      .to('#subtitle', {
        opacity: 1,
        y: 0,
        duration: 0.9,
        ease: 'power2.out'
      }, '-=0.7')
      // 3. 貼圖動畫 - 淡入 + 彈跳組合
      .to('#sticker-left', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'back.out(1.3)',
        onComplete: () => {
          // 貼圖進場完成後，立即開始漂浮動畫
          addStickerFloatingAnimation('#sticker-left', 0);
        }
      }, '-=0.5')
      .to('#sticker-right', {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'back.out(1.3)',
        onComplete: () => {
          addStickerFloatingAnimation('#sticker-right', 0.3);
        }
      }, '-=0.5')
      // 4. 音樂按鈕動畫 - 彈跳進場 + 脈衝效果
      .to('#music-btn', {
        opacity: 1,
        scale: 1,
        duration: 0.6,
        ease: 'elastic.out(1.2, 0.5)',
        onComplete: () => {
          addMusicButtonPulse('#music-btn');
        }
      }, '-=0.4')
      // 5. 向下提示動畫 - 淡入
      .to('#scroll-hint', {
        opacity: 1,
        duration: 0.6
      }, '-=0.3')
      // 6. 標題發光動畫啟動
      .call(() => {
        const mainTitle = document.getElementById('main-title');
        if (mainTitle) {
          mainTitle.classList.add('text-gradient-glow');
        }
      });
  }
}

/**
 * 貼圖漂浮動畫 - 柔和無限循環
 */
function addStickerFloatingAnimation(selector, delay = 0) {
  gsap.to(selector, {
    y: '-=8',
    duration: 2.8,
    ease: 'sine.inOut',
    repeat: -1,
    yoyo: true,
    delay: delay
  });
}

/**
 * 音樂按鈕脈衝效果 - 進場後的呼吸動畫
 */
function addMusicButtonPulse(selector) {
  gsap.to(selector, {
    boxShadow: [
      '0 0 0 0 rgba(126, 231, 255, 0.7)',
      '0 0 0 12px rgba(126, 231, 255, 0)',
      '0 0 0 0 rgba(126, 231, 255, 0)'
    ],
    duration: 1.5,
    ease: 'power2.out',
    repeat: 2,
    repeatDelay: 0.5
  });

  // 第一輪脈衝後，添加懸停交互反饋
  const musicBtn = document.querySelector(selector);
  if (musicBtn) {
    // 移除預先的互動樣式，使用 GSAP 管理
    musicBtn.addEventListener('mouseenter', () => {
      gsap.to(selector, {
        boxShadow: '0 0 20px rgba(126, 231, 255, 0.6)',
        duration: 0.3,
        overwrite: 'auto'
      });
    });

    musicBtn.addEventListener('mouseleave', () => {
      gsap.to(selector, {
        boxShadow: '0 0 0 0 rgba(126, 231, 255, 0)',
        duration: 0.3,
        overwrite: 'auto'
      });
    });
  }
}

function initEnding(storyData, options = {}) {
  const endingMessage = document.getElementById('ending-message');
  if (endingMessage && storyData.ending?.message) {
    endingMessage.textContent = storyData.ending.message;
  }

  const backToTopBtn = document.getElementById('back-to-top-btn');
  if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // 初始化 Ending 動畫特效
  initEndingEffects({
    reducedMotion: options.reducedMotion || false,
    performanceLevel: options.performanceLevel || 'high'
  });
}

/**
 * 設置窗口調整大小監聽器
 * 在窗口調整大小時刷新所有滾動綁定動畫
 */
function setupResizeListener() {
  let resizeTimeout;

  window.addEventListener('resize', () => {
    // 防止頻繁觸發
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
      console.log('[App] Window resized, refreshing animations...');

      // 刷新時間線動畫
      refreshTimelineAnimations();

      // 刷新藤蔓 ScrollTrigger
      refreshVineScroll();

      // 刷新 Ending ScrollTrigger
      refreshEndingScrollTriggers();

      // 刷新 ScrollTrigger
      ScrollTrigger.refresh();
    }, 250);
  });
}

function hideLoadingScreen() {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    gsap.to(loadingScreen, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => loadingScreen.style.display = 'none'
    });
  }
}

function showErrorMessage(message) {
  const loadingScreen = document.getElementById('loading-screen');
  if (loadingScreen) {
    loadingScreen.innerHTML = `
      <div class="text-center">
        <p class="text-xl text-red-400 mb-4">${message}</p>
        <button onclick="location.reload()" class="glass-card px-6 py-3 rounded-full text-starlight">重新載入</button>
      </div>
    `;
  }
}

// DOM Ready 執行
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
