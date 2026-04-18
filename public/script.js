'use strict';

/* ─── Utilities ─────────────────────────────────────────────── */
const $  = (s, c = document) => c.querySelector(s);
const $$ = (s, c = document) => [...c.querySelectorAll(s)];

/* ════════════════════════════════════════════════════════════
   1. NAVBAR
════════════════════════════════════════════════════════════ */
(function () {
  const nav    = $('.nav');
  const burger = $('.burger');
  const mob    = $('.mob-menu');
  if (!nav) return;

  window.addEventListener('scroll', () => {
    nav.classList.toggle('nav--scrolled', window.scrollY > 40);
  }, { passive: true });

  if (burger && mob) {
    burger.addEventListener('click', () => {
      const open = burger.classList.toggle('open');
      mob.classList.toggle('open', open);
      document.body.style.overflow = open ? 'hidden' : '';
      burger.setAttribute('aria-expanded', open);
    });
    $$('.mob-link', mob).forEach(a => a.addEventListener('click', () => {
      burger.classList.remove('open');
      mob.classList.remove('open');
      document.body.style.overflow = '';
      burger.setAttribute('aria-expanded', 'false');
    }));
  }
})();

/* ════════════════════════════════════════════════════════════
   2. SCROLL REVEAL  (data-reveal attribute system)
════════════════════════════════════════════════════════════ */
(function () {
  const els = $$('[data-reveal]');
  if (!els.length) return;

  // Numeric data-reveal value = stagger index (0..n)
  els.forEach(el => {
    const d = parseFloat(el.dataset.reveal) || 0;
    if (d) el.style.transitionDelay = `${d * 0.12}s`;
  });

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      e.target.classList.add('revealed');
      obs.unobserve(e.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -60px 0px' });

  els.forEach(el => obs.observe(el));
})();

/* ════════════════════════════════════════════════════════════
   3. HERO PARALLAX — subtle bg offset on scroll
════════════════════════════════════════════════════════════ */
(function () {
  const bg      = $('.hero__bg');
  const content = $('.hero__content');
  if (!bg) return;

  window.addEventListener('scroll', () => {
    const y = window.scrollY;
    const h = window.innerHeight;
    if (y > h * 1.2) return;
    const p = y / h;
    // Don't interfere with kenBurns scale — only translate
    bg.style.transform = `translateY(${p * 18}%)`;
    if (content) {
      content.style.opacity   = Math.max(0, 1 - p * 2.2).toString();
      content.style.transform = `translateY(${p * -10}%)`;
    }
  }, { passive: true });
})();

/* ════════════════════════════════════════════════════════════
   4. SMOOTH ANCHOR SCROLL
════════════════════════════════════════════════════════════ */
document.addEventListener('click', e => {
  const a = e.target.closest('a[href^="#"]');
  if (!a) return;
  const id = a.getAttribute('href').slice(1);
  const el = document.getElementById(id);
  if (!el) return;
  e.preventDefault();
  window.scrollTo({
    top: el.getBoundingClientRect().top + window.scrollY - 72,
    behavior: 'smooth'
  });
});

/* ════════════════════════════════════════════════════════════
   5. PRODUCT GALLERY
════════════════════════════════════════════════════════════ */
(function () {
  const main   = $('.gallery__main img');
  const thumbs = $$('.gallery__thumb');
  if (!main || !thumbs.length) return;

  thumbs.forEach(thumb => {
    thumb.addEventListener('click', () => {
      const img = thumb.querySelector('img');
      if (!img) return;

      main.style.opacity   = '0';
      main.style.transform = 'scale(1.75)';

      setTimeout(() => {
        main.src = img.src;
        main.alt = img.alt;
        main.style.opacity   = '1';
        main.style.transform = 'scale(1.8)';
      }, 220);

      thumbs.forEach(t => t.classList.remove('active'));
      thumb.classList.add('active');
    });
  });

  main.style.transition = 'opacity .22s ease, transform .22s ease';
})();

/* ════════════════════════════════════════════════════════════
   6. SIZE SELECTOR
════════════════════════════════════════════════════════════ */
(function () {
  const btns = $$('.sz:not(.oos)');
  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      btns.forEach(b => b.classList.remove('sel'));
      btn.classList.add('sel');
    });
  });
})();

/* ════════════════════════════════════════════════════════════
   7. QUANTITY
════════════════════════════════════════════════════════════ */
(function () {
  const minus = $('.qty-btn--minus');
  const plus  = $('.qty-btn--plus');
  const num   = $('.qty-val');
  if (!num) return;
  let q = 1;
  minus?.addEventListener('click', () => { if (q > 1) num.textContent = --q; });
  plus?.addEventListener('click',  () => { if (q < 10) num.textContent = ++q; });
})();

/* ════════════════════════════════════════════════════════════
   8. ADD TO CART
════════════════════════════════════════════════════════════ */
(function () {
  const btns = $$('.btn-atc');
  if (!btns.length) return;

  const spinStyle = document.createElement('style');
  spinStyle.textContent = `
    @keyframes _spin  { to { transform: rotate(360deg); } }
    @keyframes _shake {
      0%,100% { transform: translateX(0); }
      20%     { transform: translateX(-5px); }
      40%     { transform: translateX(5px); }
      60%     { transform: translateX(-3px); }
      80%     { transform: translateX(3px); }
    }
  `;
  document.head.appendChild(spinStyle);

  btns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (!$('.sz.sel')) {
        const sizesWrap = $('.sizes');
        const sizeRow   = $('.size-row');
        if (sizesWrap) {
          sizesWrap.style.animation = 'none';
          sizesWrap.offsetHeight;
          sizesWrap.style.animation = '_shake .4s ease';
        }
        if (sizeRow) {
          sizeRow.style.color = 'var(--gold)';
          setTimeout(() => (sizeRow.style.color = ''), 1200);
        }
        return;
      }

      const orig = btn.textContent;
      btn.disabled = true;
      btn.style.animation = '_spin .8s linear infinite';

      setTimeout(() => {
        btn.style.animation = '';
        btn.textContent = 'Ajouté ✓';
        btn.style.background  = 'transparent';
        btn.style.borderColor = 'var(--gold)';
        btn.style.color       = 'var(--gold)';

        const dot = $('.cart-dot');
        if (dot) {
          dot.style.display = 'flex';
          dot.textContent   = (parseInt(dot.textContent) || 0) + 1;
        }

        setTimeout(() => {
          btn.textContent   = orig;
          btn.disabled      = false;
          btn.style.background = btn.style.borderColor = btn.style.color = '';
        }, 2600);
      }, 900);
    });
  });
})();

/* ════════════════════════════════════════════════════════════
   9. ACCORDION
════════════════════════════════════════════════════════════ */
(function () {
  $$('.acc__item').forEach(item => {
    const trigger = item.querySelector('.acc__trigger');
    const body    = item.querySelector('.acc__body');
    if (!trigger || !body) return;

    trigger.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');

      // Close all
      $$('.acc__item').forEach(i => {
        i.classList.remove('open');
        const b = i.querySelector('.acc__body');
        if (b) b.classList.remove('open');
      });

      // Open clicked if it was closed
      if (!isOpen) {
        item.classList.add('open');
        body.classList.add('open');
      }
    });
  });
})();

/* ════════════════════════════════════════════════════════════
   10. REVIEW BARS
════════════════════════════════════════════════════════════ */
(function () {
  const bars = $$('.bar-f');
  if (!bars.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      bars.forEach(b => (b.style.width = (b.dataset.w || 0) + '%'));
      obs.disconnect();
    });
  }, { threshold: .3 });

  const section = $('.rv-bars');
  if (section) obs.observe(section);
})();

/* ════════════════════════════════════════════════════════════
   11. SIZE GUIDE MODAL
════════════════════════════════════════════════════════════ */
(function () {
  const modal    = $('#size-modal');
  const modalImg = modal?.querySelector('img');
  const closeBtn = modal?.querySelector('.size-modal__close');
  if (!modal) return;

  $$('[data-size-modal]').forEach(t => {
    t.addEventListener('click', e => {
      e.preventDefault();
      if (modalImg) modalImg.src = t.dataset.sizeModal;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
    });
  });

  const close = () => {
    modal.classList.remove('open');
    document.body.style.overflow = '';
  };

  closeBtn?.addEventListener('click', close);
  modal.addEventListener('click', e => { if (e.target === modal) close(); });
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });
})();

/* ════════════════════════════════════════════════════════════
   12. NEWSLETTER
════════════════════════════════════════════════════════════ */
(function () {
  const form = $('.newsletter-form');
  if (!form) return;

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('button[type="submit"]');
    const msg = $('.newsletter-success');
    if (btn) { btn.textContent = '…'; btn.disabled = true; }

    setTimeout(() => {
      form.style.opacity   = '0';
      form.style.transform = 'translateY(-8px)';
      setTimeout(() => {
        form.style.display = 'none';
        if (msg) {
          msg.style.display = 'flex';
          requestAnimationFrame(() => (msg.style.opacity = '1'));
        }
      }, 320);
    }, 800);
  });
})();

/* ════════════════════════════════════════════════════════════
   13. STICKY BAR (product page)
════════════════════════════════════════════════════════════ */
(function () {
  const bar    = $('.sticky');
  const anchor = document.getElementById('product-anchor');
  if (!bar || !anchor) return;

  window.addEventListener('scroll', () => {
    bar.classList.toggle('on', anchor.getBoundingClientRect().bottom < 0);
  }, { passive: true });
})();
