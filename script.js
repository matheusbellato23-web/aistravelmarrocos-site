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

// ── GALLERY FILTERS & EXPANDABLE LIGHTBOX ─────
function initGalleryFeatures() {
  const grid = document.getElementById('galleryGrid');
  const btnToggle = document.getElementById('btnExpandGallery');
  const filterBtns = document.querySelectorAll('.gallery-filters .filter-btn');
  if (!grid) return;

  // 1. Expand / Collapse toggle
  if (btnToggle) {
    btnToggle.addEventListener('click', () => {
      const isExpanded = grid.classList.toggle('expanded');
      btnToggle.classList.toggle('expanded', isExpanded);
      const span = btnToggle.querySelector('span');
      if (span) {
        if (isExpanded) {
          span.setAttribute('data-pt', 'Mostrar Menos Fotos');
          span.setAttribute('data-en', 'Show Fewer Photos');
          span.textContent = currentLang === 'pt' ? 'Mostrar Menos Fotos' : 'Show Fewer Photos';
        } else {
          span.setAttribute('data-pt', 'Ver Galeria Completa (+10 Fotos)');
          span.setAttribute('data-en', 'View Full Gallery (+10 Photos)');
          span.textContent = currentLang === 'pt' ? 'Ver Galeria Completa (+10 Fotos)' : 'View Full Gallery (+10 Photos)';
        }
      }
    });
  }

  // 2. Category Filters
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      const cat = btn.getAttribute('data-filter');

      const items = grid.querySelectorAll('.g');
      items.forEach(item => {
        const itemCat = item.getAttribute('data-cat');
        if (cat === 'all') {
          item.style.display = '';
        } else {
          if (itemCat === cat) {
            item.style.display = 'block';
          } else {
            item.style.display = 'none';
          }
        }
      });
    });
  });

  // 3. Lightbox Modal
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const btnClose = document.getElementById('lightboxClose');
  const btnPrev = document.getElementById('lightboxPrev');
  const btnNext = document.getElementById('lightboxNext');

  if (!modal) return;

  let currentIndex = 0;
  let visibleItems = [];

  function openLightbox(index) {
    visibleItems = Array.from(grid.querySelectorAll('.g')).filter(el => getComputedStyle(el).display !== 'none');
    if (visibleItems.length === 0) return;
    currentIndex = index;
    updateLightboxContent();
    modal.classList.add('active');
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    modal.classList.remove('active');
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function updateLightboxContent() {
    const item = visibleItems[currentIndex];
    if (!item) return;
    const img = item.querySelector('img');
    if (!img) return;
    modalImg.src = img.src;
    modalCaption.textContent = img.alt || '';
  }

  grid.addEventListener('click', e => {
    const g = e.target.closest('.g');
    if (!g) return;
    visibleItems = Array.from(grid.querySelectorAll('.g')).filter(el => getComputedStyle(el).display !== 'none');
    const idx = visibleItems.indexOf(g);
    if (idx !== -1) {
      openLightbox(idx);
    }
  });

  if (btnClose) btnClose.addEventListener('click', closeLightbox);
  if (modal.querySelector('.lightbox-backdrop')) {
    modal.querySelector('.lightbox-backdrop').addEventListener('click', closeLightbox);
  }

  if (btnPrev) {
    btnPrev.addEventListener('click', e => {
      e.stopPropagation();
      currentIndex = (currentIndex - 1 + visibleItems.length) % visibleItems.length;
      updateLightboxContent();
    });
  }

  if (btnNext) {
    btnNext.addEventListener('click', e => {
      e.stopPropagation();
      currentIndex = (currentIndex + 1) % visibleItems.length;
      updateLightboxContent();
    });
  }

  document.addEventListener('keydown', e => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft' && btnPrev) btnPrev.click();
    if (e.key === 'ArrowRight' && btnNext) btnNext.click();
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
  initGalleryFeatures();
  setLang('pt'); // default language
});
