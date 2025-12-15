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
import { initTimeline } from './timeline.js';
import { initRoughFrames } from './rough-frames.js';
import { initMusicPlayer } from './music-player.js';
import { initLottie } from './lottie-loader.js';
import { initVineSVG } from './vivus-vine.js';
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

    // 初始化 Ending
    initEnding(storyData);

    // 初始化 Lottie 動畫
    initLottie();

    // 初始化藤蔓 SVG
    initVineSVG(storyData.beats?.length || 6);

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

function initWelcomeAnimations(storyData, reducedMotion) {
  const { site } = storyData;

  if (site?.title) {
    document.getElementById('main-title').textContent = site.title;
  }
  if (site?.subtitle) {
    document.getElementById('subtitle').textContent = site.subtitle;
  }

  const tl = gsap.timeline({ delay: 0.5 });

  if (reducedMotion) {
    tl.to(['#main-title', '#subtitle', '#music-btn', '#scroll-hint'], {
      opacity: 1,
      duration: 0.3
    });
  } else {
    tl.to('#main-title', { opacity: 1, y: 0, duration: 1, ease: 'power2.out' })
      .to('#subtitle', { opacity: 1, y: 0, duration: 0.8, ease: 'power2.out' }, '-=0.5')
      .to(['#sticker-left', '#sticker-right'], { opacity: 1, y: 0, duration: 0.8, ease: 'back.out(1.2)', stagger: 0.2 }, '-=0.6')
      .to('#music-btn', { opacity: 1, scale: 1, duration: 0.6, ease: 'back.out(1.5)' }, '-=0.4')
      .to('#scroll-hint', { opacity: 1, duration: 0.6 }, '-=0.3');
  }
}

function initEnding(storyData) {
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
