/**
 * ending-effects.js - Ending 區塊動畫效果
 * 包含：打字機效果、星光粒子特效、ScrollTrigger 觸發
 */

import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * TypeWriter 效果類
 */
class TypeWriter {
  constructor(element, options = {}) {
    this.element = element;
    this.fullText = element.textContent || '';
    this.options = {
      speed: options.speed || 50,
      delay: options.delay || 0,
      cursor: options.cursor !== false,
      cursorChar: options.cursorChar || '|',
      onComplete: options.onComplete || null
    };

    this.currentIndex = 0;
    this.timeline = null;
  }

  start() {
    this.element.textContent = '';

    const timeline = gsap.timeline({
      delay: this.options.delay
    });

    // 逐字顯示
    this.fullText.split('').forEach((char, index) => {
      timeline.call(
        () => {
          this.element.textContent += char;
        },
        null,
        index * (this.options.speed / 1000)
      );
    });

    // 完成回調
    if (this.options.onComplete) {
      timeline.call(this.options.onComplete);
    }

    this.timeline = timeline;
    return timeline;
  }

  stop() {
    if (this.timeline) {
      this.timeline.kill();
    }
  }
}

/**
 * 粒子特效類
 */
class ParticleEffect {
  constructor(container, options = {}) {
    this.container = container;
    this.options = {
      count: options.count || 30,
      duration: options.duration || 2,
      type: options.type || 'star', // 'star' or 'heart'
      color: options.color || '#FFD700',
      size: options.size || 8,
      spread: options.spread || 200,
      yOffset: options.yOffset || -100
    };

    this.particles = [];
  }

  create() {
    const containerRect = this.container.getBoundingClientRect();
    const startX = containerRect.left + containerRect.width / 2;
    const startY = containerRect.top + containerRect.height / 2;

    for (let i = 0; i < this.options.count; i++) {
      const particle = document.createElement('div');

      // 根據類型設置樣式
      if (this.options.type === 'star') {
        particle.innerHTML = '✨';
        particle.className = 'text-2xl';
      } else if (this.options.type === 'heart') {
        particle.innerHTML = '💖';
        particle.className = 'text-xl';
      }

      particle.style.position = 'fixed';
      particle.style.left = startX + 'px';
      particle.style.top = startY + 'px';
      particle.style.pointerEvents = 'none';
      particle.style.zIndex = '999';

      document.body.appendChild(particle);

      // 隨機角度和距離
      const angle = (Math.PI * 2 * i) / this.options.count;
      const velocity = this.options.spread / this.options.duration;
      const tx = Math.cos(angle) * this.options.spread;
      const ty = Math.sin(angle) * this.options.spread + this.options.yOffset;

      // 動畫
      gsap.to(particle, {
        x: tx,
        y: ty,
        opacity: 0,
        duration: this.options.duration,
        ease: 'power2.out',
        onComplete: () => {
          particle.remove();
        }
      });

      this.particles.push(particle);
    }
  }
}

/**
 * 初始化 Ending 動畫
 */
export function initEndingEffects(options = {}) {
  const reducedMotion = options.reducedMotion || false;
  const performanceLevel = options.performanceLevel || 'high';

  const endingSection = document.getElementById('ending');
  const endingTitle = document.getElementById('ending-title');
  const endingMessage = document.getElementById('ending-message');

  if (!endingSection) return;

  // 根據效能級別調整粒子數量
  const particleCount = performanceLevel === 'high' ? 30 : performanceLevel === 'medium' ? 20 : 10;

  if (reducedMotion) {
    // 減少動畫模式：簡單淡入
    gsap.to([endingTitle, endingMessage], {
      opacity: 1,
      duration: 0.5,
      scrollTrigger: {
        trigger: endingSection,
        start: 'top center',
        toggleActions: 'play none none reverse'
      }
    });
  } else {
    // 打字機效果
    const typewriter = new TypeWriter(endingMessage, {
      speed: 40,
      delay: 0.5,
      onComplete: () => {
        // 打字完成後觸發粒子特效
        triggerParticleEffect(endingMessage, 'star', particleCount);
      }
    });

    // ScrollTrigger 綁定 - 當滾動到 Ending 區塊時觸發打字機效果
    ScrollTrigger.create({
      trigger: endingSection,
      start: 'top center',
      onEnter: () => {
        typewriter.start();
      },
      once: true
    });

    // Title 淡入動畫
    gsap.from(endingTitle, {
      opacity: 0,
      y: 20,
      duration: 0.8,
      ease: 'power2.out',
      scrollTrigger: {
        trigger: endingSection,
        start: 'top center',
        toggleActions: 'play none none reverse'
      }
    });

    // Message 容器的玻璃卡效果淡入
    const messageCard = endingMessage.closest('.glass-card');
    if (messageCard) {
      gsap.from(messageCard, {
        opacity: 0,
        scale: 0.95,
        duration: 0.6,
        ease: 'back.out(1.5)',
        delay: 0.2,
        scrollTrigger: {
          trigger: endingSection,
          start: 'top center',
          toggleActions: 'play none none reverse'
        }
      });
    }

    // 返回頂部按鈕淡入
    const backBtn = document.getElementById('back-to-top-btn');
    if (backBtn) {
      gsap.from(backBtn, {
        opacity: 0,
        y: 20,
        duration: 0.6,
        delay: 0.4,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: endingSection,
          start: 'top center',
          toggleActions: 'play none none reverse'
        }
      });

      // 返回頂部按鈕的懸停效果
      backBtn.addEventListener('mouseenter', () => {
        if (!gsap.isTweening(backBtn)) {
          gsap.to(backBtn, {
            scale: 1.05,
            duration: 0.3,
            ease: 'power2.out'
          });
        }
      });

      backBtn.addEventListener('mouseleave', () => {
        gsap.to(backBtn, {
          scale: 1,
          duration: 0.3,
          ease: 'power2.out'
        });
      });
    }
  }

  // 背景星光動畫 - 始終啟用
  addBackgroundStarAnimation(endingSection);
}

/**
 * 觸發粒子特效
 */
function triggerParticleEffect(element, type = 'star', count = 30) {
  const effect = new ParticleEffect(element, {
    count,
    duration: 1.8,
    type,
    yOffset: -50
  });
  effect.create();
}

/**
 * 添加背景星光動畫
 */
function addBackgroundStarAnimation(element) {
  // 在 ending section 內創建若干個星光元素
  const starCount = 5;

  for (let i = 0; i < starCount; i++) {
    const star = document.createElement('div');
    star.className = 'absolute text-3xl opacity-0';
    star.textContent = '⭐';

    // 隨機位置
    const randomX = Math.random() * 100;
    const randomY = Math.random() * 100;
    star.style.left = randomX + '%';
    star.style.top = randomY + '%';

    element.appendChild(star);

    // 浮動動畫
    gsap.to(star, {
      opacity: [0, 0.6, 0],
      y: '-=30',
      duration: 3 + Math.random() * 2,
      repeat: -1,
      repeatDelay: 1,
      ease: 'sine.inOut',
      delay: i * 0.5
    });
  }
}

/**
 * 刷新 ScrollTrigger（窗口調整大小時）
 */
export function refreshEndingScrollTriggers() {
  ScrollTrigger.refresh();
}
