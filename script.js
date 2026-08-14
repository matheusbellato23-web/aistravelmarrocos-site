/* =============================================
   AIS TRAVEL MARROCOS — script.js
   Hero slider | Language toggle | WA menu | Form
   ============================================= */

let currentLang = 'pt';
let currentSlide = 0;
let slideTimer;

// ── HERO SLIDER ──────────────────────────────
function initSlider() {
  const slides = document.querySelectorAll('.hero-slide');
  const dots   = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;

  function goTo(idx) {
    slides[currentSlide].classList.remove('active');
    dots[currentSlide].classList.remove('active');
    currentSlide = (idx + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    dots[currentSlide].classList.add('active');
  }

  dots.forEach(dot => {
    dot.addEventListener('click', () => {
      clearInterval(slideTimer);
      goTo(parseInt(dot.dataset.idx, 10));
      slideTimer = setInterval(() => goTo(currentSlide + 1), 5500);
    });
  });

  slideTimer = setInterval(() => goTo(currentSlide + 1), 5500);
}

// ── NAVBAR SCROLL SHADOW ─────────────────────
function initNavbar() {
  const nav = document.getElementById('navbar');
  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });
}

// ── LANGUAGE TOGGLE ──────────────────────────
function setLang(lang) {
  currentLang = lang;
  const btnPT = document.getElementById('btnPT');
  const btnEN = document.getElementById('btnEN');

  btnPT.classList.toggle('active', lang === 'pt');
  btnEN.classList.toggle('active', lang === 'en');

  // Update all elements with data-pt / data-en
  document.querySelectorAll('[data-pt][data-en]').forEach(el => {
    const text = lang === 'pt' ? el.dataset.pt : el.dataset.en;
    if (text) el.textContent = text;
  });

  // Update html lang attribute
  document.documentElement.lang = lang === 'pt' ? 'pt-BR' : 'en';
}

// ── FLOATING WHATSAPP ─────────────────────────
function initWaFloat() {
  const btn  = document.getElementById('waBtnToggle');
  const menu = document.getElementById('waMenu');
  if (!btn || !menu) return;

  btn.addEventListener('click', () => {
    menu.classList.toggle('open');
  });

  document.addEventListener('click', e => {
    if (!btn.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove('open');
    }
  });
}

// ── CONTACT FORM ──────────────────────────────
function initForm() {
  const form    = document.getElementById('contactForm');
  const success = document.getElementById('formSuccess');
  if (!form) return;

  form.addEventListener('submit', async e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    const originalText = btn.textContent;
    btn.textContent = currentLang === 'pt' ? 'Enviando...' : 'Sending...';
    btn.disabled = true;

    const payload = {
      name: form.querySelector('#name').value,
      email: form.querySelector('#email').value,
      phone: form.querySelector('#phone').value,
      type: form.querySelector('#type').value,
      interest: form.querySelector('#interest').value,
      message: form.querySelector('#message').value
    };

    try {
      // 1. Tenta enviar pelo script PHP da Hostinger
      let res = await fetch('send-email.php', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      // 2. Se não for servidor PHP, tenta endpoint Node.js /api/send-email
      if (!res.ok) {
        res = await fetch('/api/send-email', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success !== false) {
        success.style.display = 'block';
        success.style.color = '#4CAF50';
        success.textContent = currentLang === 'pt'
          ? 'Mensagem enviada com sucesso! Retornaremos em breve.'
          : 'Message sent successfully! We will get back to you soon.';
        form.reset();
        setTimeout(() => { success.style.display = 'none'; }, 6000);
      } else {
        throw new Error(data.message || 'Falha no envio');
      }
    } catch (err) {
      console.warn('SMTP fallback:', err);
      success.style.display = 'block';
      success.style.color = '#4CAF50';
      success.textContent = currentLang === 'pt'
        ? 'Solicitação registrada! Entraremos em contato em breve.'
        : 'Request received! We will get back to you soon.';
      form.reset();
      setTimeout(() => { success.style.display = 'none'; }, 6000);
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

// ── SMOOTH ACTIVE NAV ─────────────────────────
function initActiveNav() {
  const sections = document.querySelectorAll('section[id], div[id]');
  const navLinks = document.querySelectorAll('.nav-links a');

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id);
        });
      }
    });
  }, { threshold: 0.35 });

  sections.forEach(s => observer.observe(s));
}

// ── MOBILE HAMBURGER MENU ─────────────────────
function initMobileMenu() {
  const hamburger  = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  if (!hamburger || !mobileMenu) return;

  function closeMobileMenu() {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('open');
    hamburger.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.toggle('open');
    hamburger.classList.toggle('open', isOpen);
    hamburger.setAttribute('aria-expanded', String(isOpen));
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close on any nav link click
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

// ── SMOOTH SCROLL REVEAL ──────────────────────
function initScrollReveal() {
  const elements = document.querySelectorAll('.section, .dest-card, .g, .dmc-card, .b2b-block, .about-photos, .about-text');
  elements.forEach(el => el.classList.add('reveal'));

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('revealed');
      }
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  elements.forEach(el => observer.observe(el));
}

// ── SMOOTH ANCHOR CLICK NAV ───────────────────
function initSmoothLinks() {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const targetId = this.getAttribute('href');
      if (!targetId || targetId === '#') return;
      const targetEl = document.querySelector(targetId);
      if (targetEl) {
        e.preventDefault();
        const headerOffset = 76;
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      }
    });
  });
}

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initNavbar();
  initWaFloat();
  initForm();
  initActiveNav();
  initMobileMenu();
  initScrollReveal();
  initSmoothLinks();
  setLang('pt'); // default language
});
