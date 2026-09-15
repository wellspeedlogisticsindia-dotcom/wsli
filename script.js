/* =========================================
   RM TRANSPORT CO. — MAIN SCRIPT
   Menu · Form · Gallery Lightbox · Auto timestamp
   ========================================= */

document.addEventListener('DOMContentLoaded', () => {

  const OWNER_EMAIL = 'prashantsiet1@gmail.com';
  const OWNER_WHATSAPP = '919323915859';
  const isLocalFile = window.location.protocol === 'file:';

  const form = document.getElementById('enquiryForm');
  const formMessage = document.getElementById('formMessage');
  const submitBtn = document.getElementById('submitBtn');
  const formNextInput = document.getElementById('formNext');
  const navLinks = document.getElementById('navLinks');
  const menuToggle = document.getElementById('menuToggle');
  const submittedAtInput = document.getElementById('submittedAt');

  /* ---------- 0. AUTO-CAPTURE SUBMISSION TIMESTAMP ---------- */
  function updateTimestamp() {
    if (!submittedAtInput) return;
    const now = new Date();
    const options = {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    };
    submittedAtInput.value = now.toLocaleString('en-IN', options) + ' IST';
  }

  updateTimestamp();

  /* ---------- 1. MOBILE MENU ---------- */
  if (menuToggle && navLinks) {
    menuToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      navLinks.classList.toggle('active');
      menuToggle.classList.toggle('active');
      menuToggle.setAttribute('aria-expanded', navLinks.classList.contains('active'));
    });

    navLinks.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth <= 768) {
          navLinks.classList.remove('active');
          menuToggle.classList.remove('active');
          menuToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    document.addEventListener('click', (e) => {
      if (navLinks.classList.contains('active') &&
          !navLinks.contains(e.target) &&
          !menuToggle.contains(e.target)) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  /* ---------- 2. BACK TO TOP ---------- */
  const backToTop = document.getElementById('backToTop');
  if (backToTop) {
    window.addEventListener('scroll', () => {
      backToTop.classList.toggle('visible', window.scrollY > 500);
    });
    backToTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ---------- 3. DYNAMIC YEAR ---------- */
  const yearSpan = document.getElementById('year');
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();

  /* ---------- 4. FORM _next URL ---------- */
  if (formNextInput && !isLocalFile) {
    formNextInput.value = window.location.origin +
      window.location.pathname.replace(/[^/]*$/, '') + 'thank-you.html';
  }

  /* ---------- 5. ENQUIRY FORM ---------- */
  if (form) {
    form.addEventListener('submit', (e) => {
      updateTimestamp();

      const name = form.name.value.trim();
      const email = form.email.value.trim();
      const phone = form.phone.value.trim();
      const message = form.message.value.trim();
      const company = (form.company?.value || '').trim();
      const route = (form.route?.value || '').trim();
      const cargo = (form.cargo?.value || '').trim();
      const weight = (form.weight?.value || '').trim();
      const pickupdate = (form.pickupdate?.value || '').trim();

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      const phoneRegex = /^[0-9+\-\s()]{7,15}$/;

      if (!name || !email || !phone || !message) {
        e.preventDefault();
        formMessage.style.color = '#dc2626';
        formMessage.textContent = 'Please fill in all required fields.';
        return;
      }
      if (!emailRegex.test(email)) {
        e.preventDefault();
        formMessage.style.color = '#dc2626';
        formMessage.textContent = 'Please enter a valid email address.';
        return;
      }
      if (!phoneRegex.test(phone)) {
        e.preventDefault();
        formMessage.style.color = '#dc2626';
        formMessage.textContent = 'Please enter a valid phone number.';
        return;
      }

      // WhatsApp message (plain text with emojis — WhatsApp doesn't support tables)
      const detailsText =
        '🚛 CLIENT ENQUIRY DETAILS — RM TRANSPORT CO.\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n\n' +
        '👤 NAME        : ' + name + '\n' +
        (company ? '🏢 COMPANY     : ' + company + '\n' : '') +
        '📧 EMAIL       : ' + email + '\n' +
        '📞 PHONE       : ' + phone + '\n' +
        (route ? '🛣️  ROUTE       : ' + route + '\n' : '') +
        (cargo ? '📦 CARGO       : ' + cargo + '\n' : '') +
        (weight ? '⚖️  WEIGHT/SIZE : ' + weight + '\n' : '') +
        (pickupdate ? '📅 PICKUP DATE : ' + pickupdate + '\n' : '') +
        '\n💬 MESSAGE:\n' + message + '\n\n' +
        '━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n' +
        '🌐 Source: rmtransportco.in\n' +
        '📅 ' + (submittedAtInput?.value || new Date().toLocaleString('en-IN'));

      if (isLocalFile) {
        e.preventDefault();
        const subject = encodeURIComponent('🚛 New Enquiry — RM Transport Co.');
        const body = encodeURIComponent(detailsText);
        const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${OWNER_EMAIL}&su=${subject}&body=${body}`;
        const mailtoURL = `mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`;
        const win = window.open(gmailURL, '_blank');
        if (!win) window.location.href = mailtoURL;

        setTimeout(() => {
          const waText = encodeURIComponent(detailsText);
          window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${waText}`, '_blank');
        }, 800);

        formMessage.style.color = '#0b1d33';
        formMessage.innerHTML =
          'Opening Gmail + WhatsApp with your enquiry.<br>' +
          'If nothing opens, email <a href="mailto:' + OWNER_EMAIL + '">' + OWNER_EMAIL + '</a>.';
        return;
      }

      formMessage.style.color = '#0b1d33';
      formMessage.textContent = 'Sending...';
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending...';
      }

      // Open WhatsApp with pre-filled details (email goes via FormSubmit as HTML table)
      const waText = encodeURIComponent(detailsText);
      setTimeout(() => {
        window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${waText}`, '_blank');
      }, 300);
    });
  }

  /* ---------- 6. GALLERY LIGHTBOX ---------- */
  const galleryItems = document.querySelectorAll('.gallery-item');

  if (galleryItems.length > 0) {
    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox';
    lightbox.id = 'lightbox';
    lightbox.innerHTML = `
      <button class="lightbox-close" id="lbClose" aria-label="Close">✕</button>
      <button class="lightbox-nav lightbox-prev" id="lbPrev" aria-label="Previous">❮</button>
      <div class="lightbox-img-wrap">
        <img src="" alt="" id="lbImg" />
        <div class="lightbox-caption" id="lbCaption"></div>
      </div>
      <button class="lightbox-nav lightbox-next" id="lbNext" aria-label="Next">❯</button>
      <div class="lightbox-counter" id="lbCounter"></div>
    `;
    document.body.appendChild(lightbox);

    const lbImg = document.getElementById('lbImg');
    const lbCaption = document.getElementById('lbCaption');
    const lbCounter = document.getElementById('lbCounter');
    const lbClose = document.getElementById('lbClose');
    const lbPrev = document.getElementById('lbPrev');
    const lbNext = document.getElementById('lbNext');

    let currentIndex = 0;

    galleryItems.forEach((item, i) => {
      const caption = item.getAttribute('data-caption') || '';
      if (caption && !item.querySelector('.gallery-caption')) {
        const capEl = document.createElement('span');
        capEl.className = 'gallery-caption';
        capEl.textContent = caption;
        item.appendChild(capEl);
      }

      item.addEventListener('click', (e) => {
        e.preventDefault();
        openLightbox(i);
      });
    });

    function openLightbox(index) {
      currentIndex = index;
      updateLightbox();
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeLightbox() {
      lightbox.classList.remove('active');
      document.body.style.overflow = '';
    }

    function updateLightbox() {
      const item = galleryItems[currentIndex];
      const img = item.querySelector('img');
      const fullSrc = item.getAttribute('href') || img.src;
      const caption = item.getAttribute('data-caption') || '';

      lbImg.src = fullSrc;
      lbImg.alt = img.alt || caption;
      lbCaption.textContent = caption;
      lbCounter.textContent = (currentIndex + 1) + ' / ' + galleryItems.length;
    }

    function showNext() {
      currentIndex = (currentIndex + 1) % galleryItems.length;
      updateLightbox();
    }

    function showPrev() {
      currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
      updateLightbox();
    }

    lbClose.addEventListener('click', closeLightbox);
    lbNext.addEventListener('click', showNext);
    lbPrev.addEventListener('click', showPrev);

    lightbox.addEventListener('click', (e) => {
      if (e.target === lightbox) closeLightbox();
    });

    document.addEventListener('keydown', (e) => {
      if (!lightbox.classList.contains('active')) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') showNext();
      if (e.key === 'ArrowLeft') showPrev();
    });

    let lbTouchStartX = 0;
    lightbox.addEventListener('touchstart', (e) => {
      lbTouchStartX = e.changedTouches[0].screenX;
    }, { passive: true });

    lightbox.addEventListener('touchend', (e) => {
      const diff = lbTouchStartX - e.changedTouches[0].screenX;
      if (Math.abs(diff) > 60) {
        if (diff > 0) showNext();
        else showPrev();
      }
    }, { passive: true });
  }

  /* ---------- 7. FADE-IN ON SCROLL ---------- */
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.feature-card, .service-card, .fleet-item, .contact-block, .gallery-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(24px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
  });

    /* ---------- 8. SCROLL REVEAL ANIMATIONS ---------- */
  const revealElements = document.querySelectorAll(
    '.section-head, .about-text, .about-cards, .feature-card, .service-card, ' +
    '.fleet-item, .why-card, .contact-block, .quote-form, .map-wrap, .side-card'
  );

  // Add stagger class to grids
  document.querySelectorAll('.services-grid, .fleet-grid, .why-grid, .about-cards, .gallery-grid').forEach(grid => {
    grid.classList.add('reveal-stagger');
  });

  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -60px 0px'
  });

  revealElements.forEach(el => {
    el.classList.add('reveal');
    revealObserver.observe(el);
  });

  document.querySelectorAll('.reveal-stagger').forEach(grid => {
    revealObserver.observe(grid);
  });

  /* ---------- 9. PAGE LOAD PROGRESS BAR ---------- */
  const loadBar = document.createElement('div');
  loadBar.className = 'page-load-bar';
  document.body.appendChild(loadBar);

  let progress = 0;
  const progressInterval = setInterval(() => {
    progress += Math.random() * 20;
    if (progress >= 90) {
      progress = 90;
      clearInterval(progressInterval);
    }
    loadBar.style.width = progress + '%';
  }, 100);

  window.addEventListener('load', () => {
    clearInterval(progressInterval);
    loadBar.style.width = '100%';
    setTimeout(() => loadBar.classList.add('done'), 300);
    setTimeout(() => loadBar.remove(), 1200);
  });

  /* ---------- 10. IMAGE LAZY LOAD DETECTION ---------- */
  document.querySelectorAll('img[loading="lazy"]').forEach(img => {
    if (img.complete) {
      img.classList.add('loaded');
    } else {
      img.addEventListener('load', () => img.classList.add('loaded'));
    }
  });

  /* ---------- 11. CURSOR GLOW FOLLOWER (desktop only) ---------- */
  if (window.innerWidth > 1024) {
    const hero = document.querySelector('.hero');
    if (hero) {
      const glow = document.createElement('div');
      glow.style.cssText = `
        position: absolute;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(230, 126, 34, 0.12) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 1;
        opacity: 0;
        transition: opacity 0.4s ease;
        transform: translate(-50%, -50%);
      `;
      hero.style.position = 'relative';
      hero.appendChild(glow);

      let mouseX = 0, mouseY = 0;
      let glowX = 0, glowY = 0;

      hero.addEventListener('mouseenter', () => {
        glow.style.opacity = '1';
      });

      hero.addEventListener('mouseleave', () => {
        glow.style.opacity = '0';
      });

      hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      });

      function animateGlow() {
        glowX += (mouseX - glowX) * 0.08;
        glowY += (mouseY - glowY) * 0.08;
        glow.style.left = glowX + 'px';
        glow.style.top = glowY + 'px';
        requestAnimationFrame(animateGlow);
      }
      animateGlow();
    }
  }

  /* ---------- 12. SMOOTH SECTION SCROLL ON NAV CLICK ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      const targetId = this.getAttribute('href');
      if (targetId === '#' || targetId.length < 2) return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      e.preventDefault();

      // Close mobile menu
      if (navLinks && navLinks.classList.contains('active')) {
        navLinks.classList.remove('active');
        menuToggle.classList.remove('active');
        menuToggle.setAttribute('aria-expanded', 'false');
      }

      const headerHeight = document.querySelector('.main-header')?.offsetHeight || 76;
      const targetTop = targetEl.getBoundingClientRect().top + window.pageYOffset - headerHeight - 10;

      window.scrollTo({
        top: Math.max(0, targetTop),
        behavior: 'smooth'
      });
    });
  });

  /* ---------- 13. GALLERY SHINE EFFECT ---------- */
  document.querySelectorAll('.gallery-item').forEach(item => {
    if (!item.querySelector('.gallery-shine')) {
      const shine = document.createElement('div');
      shine.className = 'gallery-shine';
      item.appendChild(shine);
    }
  });

});