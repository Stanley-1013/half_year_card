/**
 * music-player.js - 音樂播放器（增強版）
 */

import gsap from 'gsap';

let audio = null;
let isPlaying = false;
let musicBtn = null;
let isAnimating = false;

export function initMusicPlayer(musicConfig = {}) {
  console.log('[Music] Initializing player...');

  musicBtn = document.getElementById('music-btn');
  if (!musicBtn) return;

  // 初始化音頻
  if (musicConfig?.src) {
    audio = new Audio(musicConfig.src);
    audio.loop = true;
    audio.volume = 0.5;

    // 音頻事件監聽
    audio.addEventListener('play', () => updateButtonState(true));
    audio.addEventListener('pause', () => updateButtonState(false));
    audio.addEventListener('error', (e) => {
      console.warn('[Music] Audio error:', e);
      musicBtn.textContent = '音樂載入失敗';
      musicBtn.disabled = true;
    });
  } else {
    musicBtn.textContent = '無音樂檔案';
    musicBtn.classList.add('opacity-50', 'cursor-not-allowed');
    return;
  }

  // 點擊事件
  musicBtn.addEventListener('click', toggleMusic);

  console.log('[Music] Player initialized');
}

/**
 * 增強版音樂切換 - 帶有詳細動畫反饋
 */
function toggleMusic() {
  if (!audio || isAnimating) return;

  isAnimating = true;

  // 點擊壓縮動畫
  gsap.timeline()
    .to(musicBtn, {
      scale: 0.92,
      duration: 0.08,
      ease: 'power2.in'
    })
    .to(musicBtn, {
      scale: 1.05,
      duration: 0.12,
      ease: 'back.out(2)',
      onComplete: () => {
        performToggle();
      }
    })
    .to(musicBtn, {
      scale: 1,
      duration: 0.1,
      ease: 'power2.out',
      onComplete: () => {
        isAnimating = false;
      }
    });
}

function performToggle() {
  if (isPlaying) {
    audio.pause();
  } else {
    audio.play().catch(err => {
      console.warn('[Music] Play failed:', err);
      musicBtn.textContent = '點擊重試';
      isAnimating = false;
    });
  }
}

/**
 * 更新按鈕狀態 - 包含動畫過渡
 */
function updateButtonState(playing) {
  isPlaying = playing;

  if (playing) {
    // 播放狀態：添加脈衝效果和發光
    gsap.to(musicBtn, {
      duration: 0.4,
      ease: 'power2.out',
      overwrite: 'auto'
    });

    // 文字過渡變化
    gsap.to(musicBtn, {
      opacity: 0.8,
      duration: 0.2,
      onComplete: () => {
        musicBtn.innerHTML = '<span class="inline-block animate-pulse">♪</span> 暫停音樂';
        musicBtn.classList.add('shadow-glow-purple');
        gsap.to(musicBtn, {
          opacity: 1,
          duration: 0.2
        });
      }
    });

    // 播放中的持續脈衝光暈效果
    addPlayingPulse();
  } else {
    // 暫停狀態：移除脈衝，恢復靜止外觀
    gsap.killTweensOf(musicBtn);

    gsap.to(musicBtn, {
      opacity: 0.8,
      duration: 0.2,
      onComplete: () => {
        musicBtn.innerHTML = '♪ 開啟音樂';
        musicBtn.classList.remove('shadow-glow-purple');
        gsap.to(musicBtn, {
          opacity: 1,
          duration: 0.2
        });
      }
    });
  }
}

/**
 * 播放狀態下的持續脈衝效果
 */
function addPlayingPulse() {
  // 清除之前的脈衝動畫
  gsap.killTweensOf(musicBtn, 'boxShadow');

  // 柔和無限脈衝
  gsap.to(musicBtn, {
    boxShadow: [
      '0 0 0px 0px rgba(191, 167, 255, 0.5)',
      '0 0 12px 4px rgba(191, 167, 255, 0.3)',
      '0 0 0px 0px rgba(191, 167, 255, 0.5)'
    ],
    duration: 2,
    ease: 'sine.inOut',
    repeat: -1,
    overwrite: 'auto'
  });
}

export function pauseMusic() {
  if (audio && isPlaying) {
    audio.pause();
  }
}

export function setVolume(vol) {
  if (audio) {
    audio.volume = Math.max(0, Math.min(1, vol));
  }
}
