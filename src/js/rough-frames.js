/**
 * rough-frames.js - Rough.js 手繪邊框
 */

import rough from 'roughjs';

const frameObserver = new Map();

export function initRoughFrames(options = {}) {
  console.log('[Rough] Initializing hand-drawn frames...');

  // 使用 MutationObserver 監聽新增的卡片
  const beatsContainer = document.getElementById('beats-container');

  if (beatsContainer) {
    // 處理已存在的卡片（延遲執行確保渲染完成）
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        const existingCards = beatsContainer.querySelectorAll('.beat-card');
        existingCards.forEach(card => addRoughBorder(card));
        console.log('[Rough] Added frames to', existingCards.length, 'existing cards');
      });
    });

    // 監聽新增的卡片
    const observer = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && node.classList?.contains('beat-card')) {
            requestAnimationFrame(() => addRoughBorder(node));
          }
        });
      });
    });

    observer.observe(beatsContainer, { childList: true, subtree: true });
  }

  // 監聽視窗調整，重繪邊框
  window.addEventListener('resize', debounce(refreshAllFrames, 250));

  console.log('[Rough] Initialized');
}

function addRoughBorder(element) {
  // 如果已經有邊框，先移除
  const existingSvg = element.querySelector('.rough-border');
  if (existingSvg) {
    existingSvg.remove();
  }

  const rect = element.getBoundingClientRect();

  // 確保有有效尺寸
  if (rect.width === 0 || rect.height === 0) {
    console.warn('[Rough] Element has no size, skipping');
    return;
  }

  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
  svg.classList.add('rough-border');
  svg.setAttribute('width', '100%');
  svg.setAttribute('height', '100%');
  svg.style.cssText = `
    position: absolute;
    top: 0;
    left: 0;
    pointer-events: none;
    overflow: visible;
  `;

  const rc = rough.svg(svg);
  const padding = 4;
  const node = rc.rectangle(
    padding,
    padding,
    rect.width - padding * 2,
    rect.height - padding * 2,
    {
      stroke: 'rgba(233, 247, 255, 0.3)',
      strokeWidth: 1.5,
      roughness: 1.5,
      bowing: 1,
      fill: 'none'
    }
  );

  svg.appendChild(node);

  // 確保元素有 position relative
  const computedStyle = window.getComputedStyle(element);
  if (computedStyle.position === 'static') {
    element.style.position = 'relative';
  }

  element.appendChild(svg);

  // 儲存參考以便後續更新
  frameObserver.set(element, svg);
}

function refreshAllFrames() {
  console.log('[Rough] Refreshing all frames...');
  frameObserver.forEach((svg, element) => {
    addRoughBorder(element);
  });
}

function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function destroyRoughFrames() {
  frameObserver.forEach((svg, element) => {
    svg.remove();
  });
  frameObserver.clear();
}
