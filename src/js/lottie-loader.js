/**
 * lottie-loader.js - Lottie 動畫載入器
 *
 * 功能：
 * - 加載 Welcome 向下箭頭動畫
 * - 加載 Beat 卡片中的 Lottie 動畫
 * - 支援延遲載入（IntersectionObserver）
 * - 提供 Fallback 視覺效果
 * - 性能最佳化（自動銷毀、暫停/恢復）
 */

// lottie-web import 已移除（目前全部使用 CSS fallback）
// import lottie from 'lottie-web';

let arrowAnimation = null;
const beatAnimations = new Map(); // 存儲 beat 卡片中的動畫引用
const loadedContainers = new Set(); // 追蹤已載入的容器

// Lottie 動畫清單及其 Fallback
const animationRegistry = {
  sparkle: {
    path: '/assets/lottie/sparkle.json',
    fallback: 'sparkle-fallback'
  },
  snowflake: {
    path: '/assets/lottie/snowflake.json',
    fallback: 'snowflake-fallback'
  },
  'heart-beat': {
    path: '/assets/lottie/heart-beat.json',
    fallback: 'heart-fallback'
  }
};

export function initLottie() {
  console.log('[Lottie] Initializing...');

  // 向下箭頭動畫
  initArrowAnimation();

  // Beat 卡片中的 Lottie 容器
  initBeatLottieAnimations();

  console.log('[Lottie] Initialized');
}

/**
 * 初始化 Welcome 向下箭頭動畫
 * 直接使用 CSS fallback（避免 Lottie JSON 載入錯誤）
 */
function initArrowAnimation() {
  const arrowContainer = document.getElementById('arrow-lottie');
  if (arrowContainer) {
    // 直接使用 CSS 動畫（無需 Lottie JSON 檔案）
    createFallbackArrow(arrowContainer);
    console.log('[Lottie] Arrow animation loaded (CSS fallback)');
  }
}

/**
 * 初始化 Beat 卡片中的 Lottie 動畫
 * 容器選擇器：.lottie-container[data-lottie-id]
 *
 * 特性：
 * - 延遲載入：使用 IntersectionObserver 只在卡片進入視口時載入
 * - Fallback 支援：如果動畫載入失敗，自動使用視覺 fallback
 * - 互動控制：卡片懸停時播放動畫
 */
function initBeatLottieAnimations() {
  const lottieContainers = document.querySelectorAll('.lottie-container[data-lottie-id]');

  lottieContainers.forEach(container => {
    const lottieId = container.getAttribute('data-lottie-id');
    if (!lottieId || lottieId === 'null') {
      return; // 跳過未設置的容器
    }

    // 獲取動畫配置
    const animationConfig = animationRegistry[lottieId];
    const animationPath = animationConfig?.path || `/assets/lottie/${lottieId}.json`;

    // 用 IntersectionObserver 優化：只在卡片進入視口時加載
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          // 如果還未加載則加載動畫
          if (!loadedContainers.has(container)) {
            loadBeatAnimation(container, animationPath, lottieId, animationConfig?.fallback);
            observer.unobserve(container); // 加載後停止監聽
            loadedContainers.add(container);
          }
        }
      });
    }, {
      threshold: 0.3  // 容器進入視口 30% 時觸發
    });

    observer.observe(container);
  });
}

/**
 * 加載單個 Beat 卡片的 Lottie 動畫
 *
 * @param {HTMLElement} container - Lottie 容器元素
 * @param {string} path - 動畫 JSON 檔案路徑
 * @param {string} lottieId - 動畫 ID (用於識別)
 * @param {string} fallbackType - Fallback 類型 (可選)
 */
function loadBeatAnimation(container, path, lottieId, fallbackType) {
  // 先清空容器
  container.innerHTML = '';

  // 直接使用 CSS fallback 動畫（避免無效的 lottie JSON 請求）
  // 如果需要使用 Lottie JSON，請將 .json 檔案放入 public/assets/lottie/ 並取消下方註解
  createFallbackAnimation(container, fallbackType, lottieId);
  return;

  /*
  // 原本的 Lottie 載入邏輯（需要 .json 檔案時啟用）
  fetch(path)
    .then(response => {
      if (response.ok) {
        const animation = lottie.loadAnimation({
          container: container,
          renderer: 'svg',
          loop: true,
          autoplay: false,
          path: path
        });

        beatAnimations.set(container, animation);
        console.log(`[Lottie] Loaded animation for beat: ${lottieId}`);

        const card = container.closest('.beat-card');
        if (card) {
          card.addEventListener('mouseenter', () => {
            animation.play();
          });
          card.addEventListener('mouseleave', () => {
            animation.pause();
            animation.goToAndStop(0, true);
          });
        }

        container.setAttribute('data-loaded', 'true');
      } else {
        createFallbackAnimation(container, fallbackType, lottieId);
      }
    })
    .catch(error => {
      createFallbackAnimation(container, fallbackType, lottieId);
    });
  */
}

/**
 * 建立 Fallback 動畫（當 Lottie 載入失敗時）
 *
 * @param {HTMLElement} container - Lottie 容器元素
 * @param {string} fallbackType - Fallback 類型
 * @param {string} lottieId - 動畫 ID
 */
function createFallbackAnimation(container, fallbackType, lottieId) {
  console.log(`[Lottie] Creating fallback animation for ${lottieId} (type: ${fallbackType})`);

  // 清空容器
  container.innerHTML = '';
  container.setAttribute('data-fallback', 'true');

  // 根據動畫類型建立不同的 Fallback
  switch (fallbackType) {
    case 'sparkle-fallback':
      createSparkleAnimation(container);
      break;
    case 'snowflake-fallback':
      createSnowflakeAnimation(container);
      break;
    case 'heart-fallback':
      createHeartAnimation(container);
      break;
    default:
      // 預設 fallback：簡單的脈動動畫
      createPulseAnimation(container);
  }

  // 添加載入失敗狀態
  container.setAttribute('data-loaded', 'true');
}

/**
 * Fallback 1: 星光閃爍動畫 (CSS)
 */
function createSparkleAnimation(container) {
  container.innerHTML = `
    <svg class="w-full h-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        @keyframes sparkle {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 1; }
        }
        .sparkle-point {
          animation: sparkle 1.5s ease-in-out infinite;
        }
      </style>
      <!-- 中心星星 -->
      <circle class="sparkle-point" cx="24" cy="24" r="3" fill="currentColor" style="--delay: 0s;"/>
      <!-- 周圍的小星星 -->
      <circle class="sparkle-point" cx="12" cy="12" r="1.5" fill="currentColor" style="--delay: 0.3s; animation-delay: 0.3s;"/>
      <circle class="sparkle-point" cx="36" cy="12" r="1.5" fill="currentColor" style="--delay: 0.6s; animation-delay: 0.6s;"/>
      <circle class="sparkle-point" cx="12" cy="36" r="1.5" fill="currentColor" style="--delay: 0.45s; animation-delay: 0.45s;"/>
      <circle class="sparkle-point" cx="36" cy="36" r="1.5" fill="currentColor" style="--delay: 0.15s; animation-delay: 0.15s;"/>
    </svg>
  `;
}

/**
 * Fallback 2: 雪花飄落動畫 (CSS)
 */
function createSnowflakeAnimation(container) {
  container.innerHTML = `
    <svg class="w-full h-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        @keyframes snowfall {
          0% { transform: translateY(-100%) rotateZ(0deg); opacity: 1; }
          100% { transform: translateY(100%) rotateZ(360deg); opacity: 0.3; }
        }
        .snowflake {
          animation: snowfall 2s ease-in-out infinite;
        }
      </style>
      <!-- 雪花圖案 -->
      <g class="snowflake" style="animation-delay: 0s;">
        <line x1="24" y1="2" x2="24" y2="46" stroke="currentColor" stroke-width="2"/>
        <line x1="2" y1="24" x2="46" y2="24" stroke="currentColor" stroke-width="2"/>
        <line x1="8" y1="8" x2="40" y2="40" stroke="currentColor" stroke-width="2"/>
        <line x1="40" y1="8" x2="8" y2="40" stroke="currentColor" stroke-width="2"/>
      </g>
    </svg>
  `;
}

/**
 * Fallback 3: 心跳動畫 (CSS)
 */
function createHeartAnimation(container) {
  container.innerHTML = `
    <svg class="w-full h-full" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <style>
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.1); }
          50% { transform: scale(1); }
        }
        .heart {
          animation: heartbeat 1s ease-in-out infinite;
          transform-origin: center;
        }
      </style>
      <path class="heart" d="M24 40L8 28C4 24 2 20 2 16C2 10 6 6 10 6C14 6 18 10 24 16C30 10 34 6 38 6C42 6 46 10 46 16C46 20 44 24 40 28L24 40Z" fill="currentColor"/>
    </svg>
  `;
}

/**
 * Fallback 4: 預設脈動動畫 (CSS)
 */
function createPulseAnimation(container) {
  container.innerHTML = `
    <div class="w-full h-full flex items-center justify-center">
      <style>
        @keyframes pulse-anim {
          0%, 100% { opacity: 0.6; transform: scale(0.95); }
          50% { opacity: 1; transform: scale(1); }
        }
        .pulse-dot {
          animation: pulse-anim 2s ease-in-out infinite;
        }
      </style>
      <div class="pulse-dot w-2 h-2 rounded-full bg-current"></div>
    </div>
  `;
}

/**
 * 箭頭動畫的 CSS 備用方案
 */
function createFallbackArrow(container) {
  console.log('[Lottie] Using fallback arrow');
  container.innerHTML = `
    <svg class="w-full h-full animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 5v14M19 12l-7 7-7-7"/>
    </svg>
  `;
}

/**
 * 銷毀所有 Lottie 動畫（清理）
 */
export function destroyLottie() {
  // 銷毀箭頭動畫
  if (arrowAnimation) {
    arrowAnimation.destroy();
    arrowAnimation = null;
  }

  // 銷毀所有 Beat 動畫
  beatAnimations.forEach((animation, container) => {
    animation.destroy();
  });
  beatAnimations.clear();
  loadedContainers.clear();

  console.log('[Lottie] All animations destroyed');
}

/**
 * 暫停所有 Beat 動畫（當頁面失焦時）
 */
export function pauseAllBeatAnimations() {
  beatAnimations.forEach(animation => {
    animation.pause();
  });
}

/**
 * 恢復所有 Beat 動畫（當頁面獲得焦點時）
 */
export function resumeAllBeatAnimations() {
  beatAnimations.forEach(animation => {
    // 只恢復懸停中的動畫（由 mouseenter 控制）
    // 不自動播放，保持原狀態
  });
}

/**
 * 檢查 Lottie 動畫載入狀態
 * 用於除錯和性能監測
 *
 * @returns {Object} 載入狀態統計
 */
export function getLottieStats() {
  const containers = document.querySelectorAll('.lottie-container[data-lottie-id]');
  const stats = {
    total: containers.length,
    loaded: 0,
    failed: 0,
    pending: 0
  };

  containers.forEach(container => {
    const lottieId = container.getAttribute('data-lottie-id');
    if (!lottieId || lottieId === 'null') return;

    if (container.getAttribute('data-loaded') === 'true') {
      stats.loaded++;
    } else if (container.getAttribute('data-fallback') === 'true') {
      stats.failed++;
    } else {
      stats.pending++;
    }
  });

  return stats;
}
