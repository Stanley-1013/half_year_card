/**
 * three-bg.js - Three.js 星空背景
 */

import * as THREE from 'three';

let scene, camera, renderer, stars;

export function initStarfield(options = {}) {
  const { performanceLevel = 'high', reducedMotion = false } = options;

  console.log('[Three] Initializing starfield...');

  const canvas = document.getElementById('starfield-canvas');
  if (!canvas) return;

  // 場景設置
  scene = new THREE.Scene();

  // 相機
  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
  camera.position.z = 5;

  // 渲染器
  renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  // 星星數量根據效能調整
  const starCount = performanceLevel === 'low' ? 500 : performanceLevel === 'medium' ? 1000 : 2000;

  // 建立星星
  const geometry = new THREE.BufferGeometry();
  const positions = new Float32Array(starCount * 3);

  for (let i = 0; i < starCount * 3; i += 3) {
    positions[i] = (Math.random() - 0.5) * 20;
    positions[i + 1] = (Math.random() - 0.5) * 20;
    positions[i + 2] = (Math.random() - 0.5) * 20;
  }

  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

  const material = new THREE.PointsMaterial({
    color: 0xE9F7FF,
    size: 0.02,
    transparent: true,
    opacity: 0.8
  });

  stars = new THREE.Points(geometry, material);
  scene.add(stars);

  // 動畫循環
  if (!reducedMotion) {
    animate();
  } else {
    renderer.render(scene, camera);
  }

  // 視窗調整
  window.addEventListener('resize', onResize);

  console.log('[Three] Starfield initialized with', starCount, 'stars');
}

function animate() {
  requestAnimationFrame(animate);

  if (stars) {
    stars.rotation.x += 0.0001;
    stars.rotation.y += 0.0002;
  }

  renderer.render(scene, camera);
}

function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
