/**
 * vivus-vine.js - Vivus SVG 藤蔓進階動畫
 *
 * 功能：
 * - 藤蔓隨滾動進度「畫出來」（ScrollTrigger + setFrameProgress）
 * - 支援往回滾動重繪
 * - 與 Lenis 平滑滾動同步
 * - 效能優化（duration: 250ms, pathTimingFunction: EASE_OUT）
 */

import Vivus from 'vivus';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import gsap from 'gsap';

let vineAnimation = null;
let vineSVGElement = null;
let vineScrollTrigger = null;

export function initVineSVG(beatCount = 6) {
  console.log('[Vivus] Initializing vine SVG...');

  const svg = document.getElementById('vine-svg');
  if (!svg) {
    console.log('[Vivus] No vine SVG element found');
    return;
  }

  vineSVGElement = svg;

  // 生成藤蔓路徑
  const path = generateVinePath(beatCount);
  svg.innerHTML = path;

  // 設定 SVG viewBox
  svg.setAttribute('viewBox', '0 0 100 1000');

  // 使用 Vivus 動畫
  try {
    vineAnimation = new Vivus(svg, {
      type: 'delayed',
      duration: 250,          // 250ms 繪製時間
      start: 'manual',        // 手動控制進度
      pathTimingFunction: Vivus.EASE_OUT  // 緩和曲線
    });

    // 設置 ScrollTrigger 滾動綁定
    setupVineScrollTrigger(vineAnimation);

    console.log('[Vivus] Vine animation initialized with scroll binding');
  } catch (error) {
    console.warn('[Vivus] Failed to initialize:', error);
  }
}

/**
 * 生成藤蔓路徑
 * @param {number} beatCount - Beat 數量，決定藤蔓長度
 * @returns {string} SVG 路徑 HTML
 */
function generateVinePath(beatCount) {
  // 生成曲線路徑
  const height = beatCount * 150;
  let pathD = 'M50,0 ';

  for (let i = 0; i < beatCount; i++) {
    const y = i * 150 + 75;
    const isLeft = i % 2 === 0;
    const controlX = isLeft ? 20 : 80;
    const endX = isLeft ? 30 : 70;

    // 主幹曲線
    pathD += `Q${controlX},${y - 30} 50,${y} `;

    // 分支
    if (i < beatCount) {
      pathD += `M50,${y} Q${controlX},${y + 10} ${endX},${y + 20} `;
      pathD += `M50,${y} `;
    }
  }

  return `
    <path
      d="${pathD}"
      fill="none"
      stroke="rgba(191, 167, 255, 0.4)"
      stroke-width="2"
      stroke-linecap="round"
    />
  `;
}

/**
 * 設置 ScrollTrigger 滾動綁定
 * 藤蔓隨滾動進度「畫出來」
 *
 * @param {Vivus} animation - Vivus 動畫實例
 */
function setupVineScrollTrigger(animation) {
  const container = document.getElementById('timeline-container');
  if (!container) {
    console.warn('[Vivus] Timeline container not found');
    return;
  }

  // 銷毀舊的 ScrollTrigger（如果存在）
  if (vineScrollTrigger) {
    vineScrollTrigger.kill();
  }

  // 創建 ScrollTrigger，綁定藤蔓繪製進度到滾動位置
  vineScrollTrigger = ScrollTrigger.create({
    trigger: container,
    start: 'top center',     // 容器頂部進入視口中心時開始
    end: 'bottom center',    // 容器底部離開視口中心時結束

    // onUpdate 會在滾動時持續呼叫
    onUpdate: (self) => {
      // self.progress: 0 ~ 1 的滾動進度
      // 使用 setFrameProgress 控制 Vivus 的繪製進度
      if (animation && animation.setFrameProgress) {
        animation.setFrameProgress(self.progress);
      }
    },

    // 支援窗口調整大小時重新計算
    invalidateOnRefresh: true,

    // 不顯示調試標記（生產環境）
    markers: false
  });

  console.log('[Vivus] ScrollTrigger binding established');
}

/**
 * 刷新藤蔓 ScrollTrigger（用於窗口調整大小）
 */
export function refreshVineScroll() {
  if (vineScrollTrigger) {
    vineScrollTrigger.refresh();
    console.log('[Vivus] ScrollTrigger refreshed');
  }
}

/**
 * 銷毀藤蔓動畫和 ScrollTrigger
 */
export function destroyVineSVG() {
  if (vineScrollTrigger) {
    vineScrollTrigger.kill();
    vineScrollTrigger = null;
  }

  if (vineAnimation) {
    vineAnimation.destroy();
    vineAnimation = null;
  }

  vineSVGElement = null;
  console.log('[Vivus] Vine animation destroyed');
}

/**
 * 重新初始化藤蔓動畫（用於動態內容更新）
 * @param {number} beatCount - 新的 Beat 數量
 */
export function reinitializeVineSVG(beatCount = 6) {
  destroyVineSVG();
  initVineSVG(beatCount);
}
