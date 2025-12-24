/**
 * rough-frames.js - Rough.js 手繪邊框集成系統
 *
 * 功能：
 * - 為時間線卡片添加手繪邊框
 * - 主題感知的邊框顏色（starlight/christmas/memory）
 * - 動態監聽新卡片和 resize 事件
 * - 優化性能的重繪機制
 * - reducedMotion 模式支援（禁用邊框懸停動畫效果）
 */

import rough from 'roughjs';

const frameObserver = new Map();
const themeColors = {
  starlight: {
    stroke: 'rgba(233, 247, 255, 0.3)',
    strokeHover: 'rgba(233, 247, 255, 0.5)'
  },
  christmas: {
    stroke: 'rgba(255, 183, 225, 0.25)',
    strokeHover: 'rgba(255, 183, 225, 0.4)'
  },
  memory: {
    stroke: 'rgba(212, 201, 184, 0.2)',
    strokeHover: 'rgba(212, 201, 184, 0.35)'
  }
};

let isRefreshing = false;
let mutationObserver = null;
let reducedMotionEnabled = false;

export function initRoughFrames(options = {}) {
  const { reducedMotion = false } = options;

  reducedMotionEnabled = reducedMotion;
  console.log('[Rough] Initializing hand-drawn frames...');
  console.log('[Rough] Reduced motion mode:', reducedMotion);

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
    mutationObserver = new MutationObserver((mutations) => {
      mutations.forEach(mutation => {
        mutation.addedNodes.forEach(node => {
          if (node.nodeType === 1 && node.classList?.contains('beat-card')) {
            requestAnimationFrame(() => addRoughBorder(node));
          }
        });
      });
    });

    mutationObserver.observe(beatsContainer, { childList: true, subtree: true });
  }

  // 監聽視窗調整，重繪邊框
  window.addEventListener('resize', debounce(refreshAllFrames, 250));

  // 監聽主題變化，更新邊框顏色
  window.addEventListener('themeChange', handleThemeChange);

  console.log('[Rough] Initialized with theme support and reduced motion awareness');
}

/**
 * 添加手繪邊框到卡片元素
 * @param {HTMLElement} element - 目標卡片元素
 */
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

  // 創建 SVG 容器
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

  // 取得卡片主題
  const theme = element.getAttribute('data-theme') || 'starlight';
  const colors = themeColors[theme] || themeColors.starlight;

  // 使用 Rough.js 繪製邊框
  const rc = rough.svg(svg);
  const padding = 4;
  const node = rc.rectangle(
    padding,
    padding,
    rect.width - padding * 2,
    rect.height - padding * 2,
    {
      stroke: colors.stroke,
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

  // 將 SVG 插入卡片開頭，確保不覆蓋內容
  element.insertBefore(svg, element.firstChild);

  // 儲存參考以便後續更新
  frameObserver.set(element, { svg, theme, colors });

  // 添加懸停效果的 CSS 類（如果沒有啟用 reducedMotion）
  if (!reducedMotionEnabled) {
    addHoverEffect(element, svg, colors);
  }
}

/**
 * 添加邊框懸停效果
 * @param {HTMLElement} element - 卡片元素
 * @param {SVGElement} svg - 邊框 SVG
 * @param {Object} colors - 主題顏色配置
 */
function addHoverEffect(element, svg, colors) {
  // 使用 CSS 變數實現懸停效果，避免重繪
  element.addEventListener('mouseenter', () => {
    updateBorderStroke(svg, colors.strokeHover);
  });

  element.addEventListener('mouseleave', () => {
    updateBorderStroke(svg, colors.stroke);
  });
}

/**
 * 更新邊框筆觸顏色
 * @param {SVGElement} svg - 邊框 SVG
 * @param {string} strokeColor - 新的筆觸顏色
 */
function updateBorderStroke(svg, strokeColor) {
  const path = svg.querySelector('g path, path');
  if (path) {
    path.style.stroke = strokeColor;
    path.style.transition = 'stroke 0.3s ease';
  }
}

/**
 * 刷新所有邊框（用於 resize）
 */
function refreshAllFrames() {
  if (isRefreshing) return;
  isRefreshing = true;

  console.log('[Rough] Refreshing all frames...');

  frameObserver.forEach((data, element) => {
    // 檢查元素是否仍在 DOM 中
    if (document.contains(element)) {
      addRoughBorder(element);
    } else {
      frameObserver.delete(element);
    }
  });

  isRefreshing = false;
}

/**
 * 處理主題變化事件
 * @param {CustomEvent} event - 主題變化事件
 */
function handleThemeChange(event) {
  const { theme } = event.detail;
  console.log('[Rough] Theme changed to:', theme);

  frameObserver.forEach((data, element) => {
    if (document.contains(element)) {
      // 更新卡片主題屬性
      element.setAttribute('data-theme', theme);
      // 重繪邊框以應用新主題顏色
      addRoughBorder(element);
    }
  });
}

/**
 * 防抖函數，避免頻繁重繪
 * @param {Function} func - 要防抖的函數
 * @param {number} wait - 等待時間（毫秒）
 * @returns {Function} 防抖後的函數
 */
function debounce(func, wait) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * 銷毀所有邊框和清理資源
 */
export function destroyRoughFrames() {
  console.log('[Rough] Destroying frames...');

  frameObserver.forEach((data, element) => {
    if (data.svg) {
      data.svg.remove();
    }
  });
  frameObserver.clear();

  // 移除事件監聽器
  if (mutationObserver) {
    mutationObserver.disconnect();
    mutationObserver = null;
  }

  window.removeEventListener('themeChange', handleThemeChange);
}
