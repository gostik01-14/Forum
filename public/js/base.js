// Шапка: тень при прокрутке
const header = document.querySelector('.header');
const onScroll = () => header && header.classList.toggle('scrolled', window.scrollY > 10);
window.addEventListener('scroll', onScroll, { passive: true });
onScroll();

document.addEventListener('DOMContentLoaded', () => {
  // Плавное появление блоков при прокрутке
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); io.unobserve(e.target); } });
  }, { threshold: 0.12 });
  document.querySelectorAll('.about-section, .stat-card, .team-member, .post, .topic-header, .answer-form')
    .forEach((el, i) => { el.classList.add('reveal'); el.style.transitionDelay = (i % 4) * 70 + 'ms'; io.observe(el); });

  // Подсветка карточек за курсором
  document.querySelectorAll('.topic-card, .post, .stat-card, .team-member, .topic-header').forEach(card => {
    card.classList.add('glow');
    card.addEventListener('mousemove', e => {
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
      card.style.setProperty('--my', (e.clientY - r.top) + 'px');
    });
  });

  // Счётчики на странице «О нас»
  document.querySelectorAll('.stat-number').forEach(el => {
    const m = el.textContent.match(/^([\d,]+)(\+?)$/);
    if (!m) return;
    const target = parseInt(m[1].replace(/,/g, ''), 10);
    const start = performance.now();
    const step = now => {
      const p = Math.min((now - start) / 1500, 1);
      el.textContent = Math.round(target * (1 - Math.pow(1 - p, 3))).toLocaleString('en-US') + m[2];
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  });
});

