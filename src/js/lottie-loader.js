/**
 * lottie-loader.js - Lottie 動畫載入器
 */

import lottie from 'lottie-web';

let arrowAnimation = null;

export function initLottie() {
  console.log('[Lottie] Initializing...');

  // 向下箭頭動畫
  const arrowContainer = document.getElementById('arrow-lottie');
  if (arrowContainer) {
    // 檢查是否有 Lottie JSON 檔案
    fetch('/assets/lottie/arrow-down.json')
      .then(response => {
        if (response.ok) {
          arrowAnimation = lottie.loadAnimation({
            container: arrowContainer,
            renderer: 'svg',
            loop: true,
            autoplay: true,
            path: '/assets/lottie/arrow-down.json'
          });
          console.log('[Lottie] Arrow animation loaded');
        } else {
          // 如果沒有 Lottie 檔案，使用 CSS 動畫替代
          createFallbackArrow(arrowContainer);
        }
      })
      .catch(() => {
        createFallbackArrow(arrowContainer);
      });
  }

  console.log('[Lottie] Initialized');
}

function createFallbackArrow(container) {
  console.log('[Lottie] Using fallback arrow');
  container.innerHTML = `
    <svg class="w-full h-full animate-bounce" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 5v14M19 12l-7 7-7-7"/>
    </svg>
  `;
}

export function destroyLottie() {
  if (arrowAnimation) {
    arrowAnimation.destroy();
    arrowAnimation = null;
  }
}
