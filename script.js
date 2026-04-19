// Global helper to open messenger deep-links with sane prefilled text
window.openMessenger = function(type, text){
  try {
    if(type === 'telegram'){
      const t = text || '/start';
      const url = 'https://t.me/italian_home_bot?text=' + encodeURIComponent(t);
      window.open(url, '_blank');
      return;
    }
    if(type === 'whatsapp'){
      const t = text || 'Здравствуйте! Меня зовут [имя]. Интересует покупка/аренда в Турине. Бюджет: ___, район: ___. Спасибо!';
      const url = 'https://wa.me/972507006020?text=' + encodeURIComponent(t);
      window.open(url, '_blank');
      return;
    }
    // fallback: open Telegram
    window.open('https://t.me/italian_home_bot?text=' + encodeURIComponent(text || '/start'), '_blank');
  } catch (e) { console.warn('openMessenger failed', e); }
};

document.addEventListener('DOMContentLoaded',()=>{
    // DEV PASSWORD PROTECT (remove for production)
    const DEV_PASSWORD = 'italia2026';
    const overlay = document.getElementById('dev-protect-overlay');
    const formDevProtect = document.getElementById('devProtectForm');
    const input = document.getElementById('devProtectInput');
    if (overlay && formDevProtect && input) {
      function unlock() {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
      }
      function lock() {
        overlay.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        input.value = '';
        input.focus();
      }
      // Check sessionStorage
      if (window.sessionStorage.getItem('devUnlocked') !== DEV_PASSWORD) {
        lock();
      }
      formDevProtect.addEventListener('submit', e => {
        e.preventDefault();
        if (input.value === DEV_PASSWORD) {
          window.sessionStorage.setItem('devUnlocked', DEV_PASSWORD);
          unlock();
        } else {
          input.value = '';
          input.placeholder = 'Неверный пароль';
          input.classList.add('shake');
          setTimeout(()=>input.classList.remove('shake'), 500);
        }
      });
    }
  const navToggle=document.getElementById('navToggle');
  const nav=document.getElementById('nav');
  navToggle&&navToggle.addEventListener('click',()=>{
    nav.classList.toggle('open');
  });
  // close mobile nav on link click
  nav&&nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>nav.classList.remove('open')));

  const telBtn=document.getElementById('telBtn');
  telBtn&&telBtn.addEventListener('click',()=>{
    window.open('https://t.me/vladislavssssss','_blank')
  })

  const formContact = document.getElementById('contactForm');
  if (formContact) {
    formContact.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = (formContact.elements['name'].value || '').trim();
      const message = (formContact.elements['message'].value || '').trim();
      let full = `Здравствуйте! Меня зовут ${name || '[имя]'}.`;
      if (message) full += `\nТекст сообщения: ${message}`;
      window.openMessenger('whatsapp', full);
    });
  }

  // Scroll reveal
  const revealEls = document.querySelectorAll('.section-hero, .card, .split-img, .split-text, .docs-grid figure, .contact-overlay, .review, .faq-item, .map-wrap, .stat');
  revealEls.forEach(el => el.classList.add('reveal'));
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); observer.unobserve(e.target); } });
  }, { threshold: 0.15 });
  revealEls.forEach(el => observer.observe(el));

  // Counter animation
  const counters = document.querySelectorAll('.stat-num');
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const target = +el.dataset.target;
      let current = 0;
      const step = Math.max(1, Math.floor(target / 40));
      const timer = setInterval(() => {
        current += step;
        if (current >= target) { current = target; clearInterval(timer); }
        el.textContent = current;
      }, 30);
      countObserver.unobserve(el);
    });
  }, { threshold: 0.5 });
  counters.forEach(el => countObserver.observe(el));

  // Reviews carousel (paged grid)
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel .review'));
  const dotsWrap = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevReview');
  const nextBtn = document.getElementById('nextReview');
  if (track && slides.length) {
    let perView = window.innerWidth > 800 ? 6 : 2;
    let idx = 0;

    function getTotal() { return Math.ceil(slides.length / perView); }

    function showPage() {
      const start = idx * perView;
      slides.forEach((s, i) => {
        s.style.display = (i >= start && i < start + perView) ? '' : 'none';
      });
      dotsWrap.querySelectorAll('.carousel-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
      // Hide nav if only one page
      const nav = track.parentElement.querySelector('.carousel-nav');
      if (nav) nav.style.display = getTotal() > 1 ? '' : 'none';
    }

    function buildDots() {
      dotsWrap.innerHTML = '';
      for (let i = 0; i < getTotal(); i++) {
        const d = document.createElement('button');
        d.className = 'carousel-dot' + (i === idx ? ' active' : '');
        d.addEventListener('click', () => { idx = i; showPage(); });
        dotsWrap.appendChild(d);
      }
    }

    prevBtn.addEventListener('click', () => { idx = (idx - 1 + getTotal()) % getTotal(); showPage(); });
    nextBtn.addEventListener('click', () => { idx = (idx + 1) % getTotal(); showPage(); });
    buildDots();
    showPage();

    // Auto-play
    let auto = setInterval(() => { idx = (idx + 1) % getTotal(); showPage(); }, 5000);
    track.parentElement.addEventListener('mouseenter', () => clearInterval(auto));
    track.parentElement.addEventListener('mouseleave', () => { auto = setInterval(() => { idx = (idx + 1) % getTotal(); showPage(); }, 5000); });

    // Resize
    window.addEventListener('resize', () => {
      const newPer = window.innerWidth > 800 ? 6 : 2;
      if (newPer !== perView) { perView = newPer; idx = 0; buildDots(); showPage(); }
    });
  }
});
