/**
 * music-player.js - 音樂播放器
 */

let audio = null;
let isPlaying = false;

export function initMusicPlayer(musicConfig = {}) {
  console.log('[Music] Initializing player...');

  const musicBtn = document.getElementById('music-btn');
  if (!musicBtn) return;

  if (musicConfig?.src) {
    audio = new Audio(musicConfig.src);
    audio.loop = true;
    audio.volume = 0.5;
  }

  musicBtn.addEventListener('click', toggleMusic);

  console.log('[Music] Player initialized');
}

function toggleMusic() {
  const musicBtn = document.getElementById('music-btn');

  if (!audio) {
    musicBtn.textContent = '無音樂檔案';
    return;
  }

  if (isPlaying) {
    audio.pause();
    musicBtn.textContent = '開啟音樂';
  } else {
    audio.play().catch(err => {
      console.warn('[Music] Play failed:', err);
    });
    musicBtn.textContent = '暫停音樂';
  }

  isPlaying = !isPlaying;
}
