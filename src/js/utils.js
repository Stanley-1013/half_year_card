/**
 * utils.js - 通用工具函數
 */

/**
 * 偵測裝置效能等級
 */
export function detectPerformance() {
  const canvas = document.createElement('canvas');
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');

  if (!gl) return 'low';

  const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
  if (debugInfo) {
    const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
    if (renderer.includes('Intel') || renderer.includes('Mesa')) {
      return 'medium';
    }
  }

  // 檢查記憶體
  if (navigator.deviceMemory && navigator.deviceMemory < 4) {
    return 'low';
  }

  // 檢查核心數
  if (navigator.hardwareConcurrency && navigator.hardwareConcurrency < 4) {
    return 'medium';
  }

  return 'high';
}

/**
 * 檢查使用者是否偏好減少動畫
 */
export function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

/**
 * 防抖函數
 */
export function debounce(func, wait = 100) {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

/**
 * 節流函數
 */
export function throttle(func, limit = 100) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}
