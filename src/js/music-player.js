/**
 * music-player.js - 音樂播放器（增強版）
 */

import gsap from 'gsap';

let audio = null;
let isPlaying = false;
let musicBtn = null;

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

function toggleMusic() {
  if (!audio) return;

  // 點擊動畫反饋
  gsap.to(musicBtn, {
    scale: 0.95,
    duration: 0.1,
    ease: 'power2.out',
    onComplete: () => {
      gsap.to(musicBtn, {
        scale: 1,
        duration: 0.2,
        ease: 'back.out(2)'
      });
    }
  });

  if (isPlaying) {
    audio.pause();
  } else {
    audio.play().catch(err => {
      console.warn('[Music] Play failed:', err);
      musicBtn.textContent = '點擊重試';
    });
  }
}

function updateButtonState(playing) {
  isPlaying = playing;

  if (playing) {
    musicBtn.innerHTML = '<span class="inline-block animate-pulse">♪</span> 暫停音樂';
    musicBtn.classList.add('shadow-glow-purple');
  } else {
    musicBtn.innerHTML = '♪ 開啟音樂';
    musicBtn.classList.remove('shadow-glow-purple');
  }
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
