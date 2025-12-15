/**
 * three-bg.js - Three.js 星空背景（增強版）
 *
 * 功能：
 * - 三層粒子系統（遠/中/近）產生深度感
 * - 星星顏色漸變（白/藍/紫/粉）
 * - 閃爍效果
 * - 滾動視差
 * - 效能自適應
 */

import * as THREE from 'three';

// 全域變數
let scene, camera, renderer;
let starLayers = { far: null, mid: null, near: null };
let twinkleData = { phases: [], frequencies: [], baseOpacities: [] };
let scrollY = 0;
let animationId = null;
let isReducedMotion = false;
let currentTheme = 'starlight';

// 星層配置
const LAYER_CONFIGS = {
  high: {
    far: { count: 800, size: 0.015, baseOpacity: 0.4, zRange: [-15, -8], drift: 0.00005 },
    mid: { count: 600, size: 0.02, baseOpacity: 0.7, zRange: [-8, -3], drift: 0.0001 },
    near: { count: 400, size: 0.03, baseOpacity: 0.9, zRange: [-3, 2], drift: 0.0002 }
  },
  medium: {
    far: { count: 500, size: 0.015, baseOpacity: 0.4, zRange: [-15, -8], drift: 0.00005 },
    mid: { count: 400, size: 0.02, baseOpacity: 0.7, zRange: [-8, -3], drift: 0.0001 },
    near: { count: 300, size: 0.03, baseOpacity: 0.9, zRange: [-3, 2], drift: 0.0002 }
  },
  low: {
    far: { count: 300, size: 0.02, baseOpacity: 0.5, zRange: [-15, -8], drift: 0 },
    mid: { count: 200, size: 0.025, baseOpacity: 0.7, zRange: [-8, -3], drift: 0 },
    near: { count: 100, size: 0.035, baseOpacity: 0.9, zRange: [-3, 2], drift: 0 }
  }
};

// 星星調色盤
const STAR_PALETTES = {
  starlight: [
    new THREE.Color(0xE9F7FF), // 冷白
    new THREE.Color(0xBFA7FF), // 淡紫
    new THREE.Color(0x7EE7FF), // 淡藍
    new THREE.Color(0xFFFFFF)  // 純白
  ],
  christmas: [
    new THREE.Color(0xE9F7FF), // 冷白
    new THREE.Color(0x7EE7FF), // 淡藍
    new THREE.Color(0xFFB7E1), // 淡粉
    new THREE.Color(0xADFFE5)  // 淡綠
  ]
};

/**
 * 初始化星空
 */
export function initStarfield(options = {}) {
  const { performanceLevel = 'high', reducedMotion = false } = options;
  isReducedMotion = reducedMotion;

  console.log('[Three] Initializing starfield...', { performanceLevel, reducedMotion });

  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) {
    console.warn('[Three] Canvas not found');
    return;
  }

  // 檢查 WebGL 支援
  if (!isWebGLSupported()) {
    console.warn('[Three] WebGL not supported, using fallback');
    canvas.style.background = 'radial-gradient(ellipse at center, #0B1026 0%, #050614 100%)';
    return;
  }

  // 初始化場景
  setupScene(canvas);

  // 取得對應效能等級的配置
  const configs = LAYER_CONFIGS[performanceLevel] || LAYER_CONFIGS.medium;

  // 建立三層星空
  starLayers.far = createStarLayer('far', configs.far);
  starLayers.mid = createStarLayer('mid', configs.mid);
  starLayers.near = createStarLayer('near', configs.near);

  // 初始化閃爍資料
  initTwinkleData();

  // 視窗調整
  window.addEventListener('resize', onResize);

  // 啟動動畫或靜態渲染
  if (!reducedMotion) {
    enableParallax();
    animate(0);
    console.log('[Three] Animation started');
  } else {
    renderer.render(scene, camera);
    console.log('[Three] Static render (reduced motion)');
  }

  const totalStars = configs.far.count + configs.mid.count + configs.near.count;
  console.log('[Three] Starfield initialized with', totalStars, 'stars');
}

/**
 * 檢查 WebGL 支援
 */
function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas');
    return !!(window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
  } catch (e) {
    return false;
  }
}

/**
 * 設置場景
 */
function setupScene(canvas) {
  scene = new THREE.Scene();

  camera = new THREE.PerspectiveCamera(
    60,
    window.innerWidth / window.innerHeight,
    0.1,
    100
  );
  camera.position.z = 5;

  renderer = new THREE.WebGLRenderer({
    canvas,
    alpha: true,
    antialias: false,
    powerPreference: 'high-performance'
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setClearColor(0x000000, 0);
}

/**
 * 建立星星層
 */
function createStarLayer(name, config) {
  const { count, size, baseOpacity, zRange } = config;
  const palette = STAR_PALETTES[currentTheme];

  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const colors = new Float32Array(count * 3);
  const opacities = new Float32Array(count);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    const i3 = i * 3;

    // 位置（球形分佈）
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    const r = 8 + Math.random() * 12;

    positions[i3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i3 + 1] = r * Math.sin(phi) * Math.sin(theta);
    positions[i3 + 2] = zRange[0] + Math.random() * (zRange[1] - zRange[0]);

    // 顏色（從調色盤隨機選取）
    const color = palette[Math.floor(Math.random() * palette.length)];
    colors[i3] = color.r;
    colors[i3 + 1] = color.g;
    colors[i3 + 2] = color.b;

    // 透明度
    opacities[i] = baseOpacity * (0.5 + Math.random() * 0.5);

    // 大小變化
    sizes[i] = size * (0.5 + Math.random() * 1.0);
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute('aOpacity', new THREE.BufferAttribute(opacities, 1));
  geometry.setAttribute('aSize', new THREE.BufferAttribute(sizes, 1));

  const material = new THREE.PointsMaterial({
    size,
    transparent: true,
    opacity: baseOpacity,
    vertexColors: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false,
    sizeAttenuation: true
  });

  const points = new THREE.Points(geometry, material);
  scene.add(points);

  return { mesh: points, config, geometry, material };
}

/**
 * 初始化閃爍資料
 */
function initTwinkleData() {
  const totalStars = getTotalStarCount();

  twinkleData.phases = new Float32Array(totalStars);
  twinkleData.frequencies = new Float32Array(totalStars);
  twinkleData.baseOpacities = new Float32Array(totalStars);

  for (let i = 0; i < totalStars; i++) {
    twinkleData.phases[i] = Math.random() * Math.PI * 2;
    twinkleData.frequencies[i] = 0.0005 + Math.random() * 0.002;
    twinkleData.baseOpacities[i] = 0.3 + Math.random() * 0.7;
  }
}

/**
 * 取得總星星數
 */
function getTotalStarCount() {
  let total = 0;
  Object.values(starLayers).forEach(layer => {
    if (layer) total += layer.config.count;
  });
  return total;
}

/**
 * 啟用視差效果
 */
function enableParallax() {
  window.addEventListener('scroll', () => {
    scrollY = window.scrollY;
  }, { passive: true });
}

/**
 * 更新閃爍效果
 */
function updateTwinkle(time) {
  let starIndex = 0;

  Object.entries(starLayers).forEach(([name, layer]) => {
    if (!layer) return;

    const opacityAttr = layer.geometry.getAttribute('aOpacity');
    if (!opacityAttr) return;

    const count = layer.config.count;

    for (let i = 0; i < count; i++) {
      const phase = twinkleData.phases[starIndex];
      const freq = twinkleData.frequencies[starIndex];
      const baseOp = twinkleData.baseOpacities[starIndex];

      // 使用 sin 函數產生閃爍
      const twinkle = Math.sin(time * freq + phase) * 0.3 + 0.7;
      opacityAttr.array[i] = baseOp * twinkle * layer.config.baseOpacity;

      starIndex++;
    }

    opacityAttr.needsUpdate = true;

    // 更新材質整體透明度（簡化版閃爍）
    const avgTwinkle = Math.sin(time * 0.001) * 0.1 + 0.9;
    layer.material.opacity = layer.config.baseOpacity * avgTwinkle;
  });
}

/**
 * 更新漂移效果
 */
function updateDrift(time) {
  Object.values(starLayers).forEach(layer => {
    if (!layer || layer.config.drift === 0) return;

    const drift = layer.config.drift;
    layer.mesh.rotation.y = time * drift;
    layer.mesh.rotation.x = time * drift * 0.5;
  });
}

/**
 * 應用視差效果
 */
export function applyParallax(scrollYOverride, mouseX = 0, mouseY = 0) {
  const scroll = scrollYOverride !== undefined ? scrollYOverride : scrollY;
  const scrollFactor = scroll * 0.00008;
  const mouseFactor = 0.0001;

  if (starLayers.far?.mesh) {
    starLayers.far.mesh.position.y = -scrollFactor * 0.3;
    starLayers.far.mesh.position.x = mouseX * mouseFactor * 0.2;
  }
  if (starLayers.mid?.mesh) {
    starLayers.mid.mesh.position.y = -scrollFactor * 0.6;
    starLayers.mid.mesh.position.x = mouseX * mouseFactor * 0.4;
  }
  if (starLayers.near?.mesh) {
    starLayers.near.mesh.position.y = -scrollFactor * 1.0;
    starLayers.near.mesh.position.x = mouseX * mouseFactor * 0.6;
  }
}

/**
 * 動畫循環
 */
let lastTime = 0;
const targetFPS = 60;
const frameInterval = 1000 / targetFPS;

function animate(currentTime) {
  animationId = requestAnimationFrame(animate);

  const deltaTime = currentTime - lastTime;

  // 限制幀率
  if (deltaTime < frameInterval) return;

  lastTime = currentTime - (deltaTime % frameInterval);

  // 更新效果
  updateTwinkle(currentTime * 0.001);
  updateDrift(currentTime * 0.001);
  applyParallax();

  renderer.render(scene, camera);
}

/**
 * 視窗調整
 */
function onResize() {
  if (!camera || !renderer) return;

  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

/**
 * 切換主題
 */
export function setStarTheme(theme) {
  if (!STAR_PALETTES[theme]) {
    console.warn('[Three] Unknown theme:', theme);
    return;
  }

  currentTheme = theme;
  const palette = STAR_PALETTES[theme];

  Object.values(starLayers).forEach(layer => {
    if (!layer) return;

    const colorAttr = layer.geometry.getAttribute('color');
    const count = layer.config.count;

    for (let i = 0; i < count; i++) {
      const color = palette[Math.floor(Math.random() * palette.length)];
      const i3 = i * 3;
      colorAttr.array[i3] = color.r;
      colorAttr.array[i3 + 1] = color.g;
      colorAttr.array[i3 + 2] = color.b;
    }

    colorAttr.needsUpdate = true;
  });

  console.log('[Three] Theme changed to:', theme);
}

/**
 * 清理資源
 */
export function cleanup() {
  // 停止動畫
  if (animationId) {
    cancelAnimationFrame(animationId);
    animationId = null;
  }

  // 清理星層
  Object.values(starLayers).forEach(layer => {
    if (layer) {
      layer.geometry.dispose();
      layer.material.dispose();
      scene.remove(layer.mesh);
    }
  });

  starLayers = { far: null, mid: null, near: null };

  // 清理渲染器
  if (renderer) {
    renderer.dispose();
    renderer = null;
  }

  // 移除事件監聽
  window.removeEventListener('resize', onResize);

  console.log('[Three] Cleanup complete');
}
