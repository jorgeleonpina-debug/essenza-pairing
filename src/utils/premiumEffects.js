// ─── 1. CURSOR DORADO ────────────────────────────────────────────────────────
export function initCursor() {
  try {
    if (window.matchMedia('(pointer: coarse)').matches) return; // no mobile

    const el = document.createElement('div');
    el.id = 'custom-cursor';
    Object.assign(el.style, {
      position: 'fixed',
      width: '12px',
      height: '12px',
      background: '#c9a84c',
      borderRadius: '50%',
      pointerEvents: 'none',
      zIndex: '9999',
      mixBlendMode: 'difference',
      transform: 'translate(-50%, -50%) scale(1)',
      transition: 'transform 0.15s ease',
      top: '-20px',
      left: '-20px',
      willChange: 'left, top',
    });
    document.body.appendChild(el);
    document.body.style.cursor = 'none';

    let x = -100, y = -100, rafId;

    document.addEventListener('mousemove', (e) => { x = e.clientX; y = e.clientY; }, { passive: true });

    const tick = () => {
      el.style.left = x + 'px';
      el.style.top  = y + 'px';
      rafId = requestAnimationFrame(tick);
    };
    tick();

    const grow   = (e) => { if (e.target.closest('button, a, [role="button"], input, select')) el.style.transform = 'translate(-50%, -50%) scale(2.5)'; };
    const shrink = (e) => { if (e.target.closest('button, a, [role="button"], input, select')) el.style.transform = 'translate(-50%, -50%) scale(1)'; };

    document.addEventListener('mouseover', grow);
    document.addEventListener('mouseout',  shrink);

    return () => {
      cancelAnimationFrame(rafId);
      el.remove();
      document.body.style.cursor = '';
    };
  } catch (err) {
    console.warn('[premiumEffects] cursor:', err);
  }
}

// ─── 2. PARALLAX HERO ────────────────────────────────────────────────────────
export function initParallax() {
  try {
    if (window.matchMedia('(pointer: coarse)').matches) return; // no mobile

    let ticking = false;

    const update = () => {
      const bg = document.querySelector('.hero-bg');
      if (bg) bg.style.transform = `scale(1.08) translateY(${window.scrollY * 0.4}px)`;
      ticking = false;
    };

    window.addEventListener('scroll', () => {
      if (!ticking) { requestAnimationFrame(update); ticking = true; }
    }, { passive: true });
  } catch (err) {
    console.warn('[premiumEffects] parallax:', err);
  }
}

// ─── 3. SCROLL REVEAL ────────────────────────────────────────────────────────
export function initScrollReveal() {
  try {
    const style = document.createElement('style');
    style.textContent = `
      .reveal {
        opacity: 0;
        transform: translateY(40px);
        transition: opacity 0.7s ease, transform 0.7s ease;
      }
      .reveal.revealed {
        opacity: 1;
        transform: translateY(0);
      }
    `;
    document.head.appendChild(style);

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });

    const observe = () => {
      document.querySelectorAll('.reveal:not([data-rev])').forEach((el) => {
        el.dataset.rev = '1';
        const group = el.closest('[data-reveal-group]');
        if (group) {
          const peers = Array.from(group.querySelectorAll('.reveal'));
          el.style.transitionDelay = `${peers.indexOf(el) * 120}ms`;
        }
        io.observe(el);
      });
    };

    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    // safety: force-reveal anything still hidden after 6s
    setTimeout(() => {
      document.querySelectorAll('.reveal:not(.revealed)').forEach((el) => el.classList.add('revealed'));
    }, 6000);

    return () => { mo.disconnect(); io.disconnect(); };
  } catch (err) {
    console.warn('[premiumEffects] scrollReveal:', err);
  }
}

// ─── 4. TYPE REVEAL ──────────────────────────────────────────────────────────
export function initTypeReveal() {
  try {
    const typeEl = (el) => {
      const words = el.textContent.trim().split(/\s+/);
      el.textContent = '';
      words.forEach((word, i) => {
        const span = document.createElement('span');
        span.textContent = word;
        span.style.cssText = [
          'display:inline-block',
          'white-space:nowrap',
          'opacity:0',
          'transform:translateY(20px)',
          `transition:opacity 0.35s ease ${i * 80}ms,transform 0.35s ease ${i * 80}ms`,
        ].join(';');
        el.appendChild(span);
        if (i < words.length - 1) el.appendChild(document.createTextNode(' '));
        // double RAF ensures layout before transition
        requestAnimationFrame(() => requestAnimationFrame(() => {
          span.style.opacity = '1';
          span.style.transform = 'translateY(0)';
        }));
      });
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && !entry.target.dataset.typed) {
          entry.target.dataset.typed = '1';
          typeEl(entry.target);
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    const observe = () => {
      document.querySelectorAll('.type-reveal:not([data-type-obs])').forEach((el) => {
        el.dataset.typeObs = '1';
        io.observe(el);
      });
    };

    observe();
    const mo = new MutationObserver(observe);
    mo.observe(document.body, { childList: true, subtree: true });

    return () => { mo.disconnect(); io.disconnect(); };
  } catch (err) {
    console.warn('[premiumEffects] typeReveal:', err);
  }
}
