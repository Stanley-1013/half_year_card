/**
 * timeline.js - 時間線渲染與動畫
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export function initTimeline(storyData, options = {}) {
  const { reducedMotion = false } = options;

  console.log('[Timeline] Initializing...');

  const container = document.getElementById('beats-container');
  if (!container || !storyData.beats?.length) {
    console.log('[Timeline] No beats to render');
    return;
  }

  // 渲染節點
  storyData.beats.forEach((beat, index) => {
    const beatElement = createBeatElement(beat, index);
    container.appendChild(beatElement);
  });

  // 設置動畫
  if (!reducedMotion) {
    setupScrollAnimations();
  }

  console.log('[Timeline] Rendered', storyData.beats.length, 'beats');
}

function createBeatElement(beat, index) {
  const isLeft = index % 2 === 0;

  const element = document.createElement('div');
  element.className = `beat-card mx-6 md:mx-auto max-w-sm p-6 ${isLeft ? 'md:mr-auto md:ml-24' : 'md:ml-auto md:mr-24'}`;
  element.setAttribute('data-beat-id', beat.id);

  element.innerHTML = `
    ${beat.photo ? `
      <div class="photo-container mb-4">
        <img src="${beat.photo}" alt="${beat.title || ''}" loading="lazy">
      </div>
    ` : ''}
    ${beat.timeLabel ? `<p class="text-sm text-galaxy-cyan mb-2">${beat.timeLabel}</p>` : ''}
    ${beat.title ? `<h3 class="font-title text-xl mb-3 text-gradient">${beat.title}</h3>` : ''}
    ${beat.caption ? `<p class="text-starlight/80 leading-relaxed">${beat.caption}</p>` : ''}
  `;

  return element;
}

function setupScrollAnimations() {
  gsap.utils.toArray('.beat-card').forEach((card) => {
    gsap.fromTo(card,
      { opacity: 0, y: 50 },
      {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: card,
          start: 'top 80%',
          end: 'top 50%',
          toggleActions: 'play none none reverse'
        }
      }
    );
  });
}
