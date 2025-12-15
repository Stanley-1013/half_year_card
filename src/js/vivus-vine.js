/**
 * vivus-vine.js - Vivus SVG 藤蔓動畫
 */

import Vivus from 'vivus';

let vineAnimation = null;

export function initVineSVG(beatCount = 6) {
  console.log('[Vivus] Initializing vine SVG...');

  const svg = document.getElementById('vine-svg');
  if (!svg) {
    console.log('[Vivus] No vine SVG element found');
    return;
  }

  // 生成藤蔓路徑
  const path = generateVinePath(beatCount);
  svg.innerHTML = path;

  // 設定 SVG viewBox
  svg.setAttribute('viewBox', '0 0 100 1000');

  // 使用 Vivus 動畫
  try {
    vineAnimation = new Vivus(svg, {
      type: 'delayed',
      duration: 200,
      start: 'manual',
      pathTimingFunction: Vivus.EASE_OUT
    });

    // 滾動時觸發繪製
    setupScrollTrigger(vineAnimation);

    console.log('[Vivus] Vine animation ready');
  } catch (error) {
    console.warn('[Vivus] Failed to initialize:', error);
  }
}

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

function setupScrollTrigger(animation) {
  // 簡單的滾動監聽
  let hasPlayed = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !hasPlayed) {
        animation.play();
        hasPlayed = true;
      }
    });
  }, { threshold: 0.1 });

  const container = document.getElementById('timeline-container');
  if (container) {
    observer.observe(container);
  }
}

export function destroyVineSVG() {
  if (vineAnimation) {
    vineAnimation.destroy();
    vineAnimation = null;
  }
}
