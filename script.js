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

  form.addEventListener('submit', e => {
    e.preventDefault();
    const btn = form.querySelector('.btn-submit');
    btn.textContent = '...';
    btn.disabled = true;

    setTimeout(() => {
      btn.textContent = currentLang === 'pt' ? 'Enviar Mensagem →' : 'Send Message →';
      btn.disabled = false;
      success.style.display = 'block';
      form.reset();
      setTimeout(() => { success.style.display = 'none'; }, 5000);
    }, 900);
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

// ── INIT ──────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  initSlider();
  initNavbar();
  initWaFloat();
  initForm();
  initActiveNav();
  initMobileMenu();
  setLang('pt'); // default language
});
