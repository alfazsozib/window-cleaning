/**
 * ClearView Pro - Interactive JavaScript Components
 * - Sticky Header
 * - Mobile Navigation
 * - Contact Form validation & feedback
 * - Interactive Before/After Split Slider & Job Switcher
 * - Review Testimonial Carousel with Arrows & Dots
 * - FAQ Accordion
 * - Quick Estimate Modal & Toast notifications
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroScrollEngine();
  initStickyHeader();
  initMobileNav();
  initTikTokReelsHover();
  initReviewCarousel();
  initFaqAccordion();
  initWhyChooseAccordion();
  initLeadForm();
  initModalAndToasts();
  initMobileCtaBar();
});

/* ==========================================================================
   HERO SCROLL-DRIVEN WINDOW CLEANING TRANSFORMATION ENGINE
   - Pinned Hero track (220vh)
   - Sweeps dirty window layer off left-to-right on scroll to reveal clean glass
   - 100% pixel-perfect same image transformation
   ========================================================================== */
function initHeroScrollEngine() {
  const heroTrack = document.getElementById('heroTrack');
  const heroSection = document.getElementById('hero');

  if (!heroSection) return;

  function updateHeroScroll() {
    const track = heroTrack || heroSection;
    const trackRect = track.getBoundingClientRect();
    const trackHeight = track.offsetHeight;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
    const scrollableDistance = Math.max(trackHeight - viewportHeight, 1);

    // Progress scrolled through sticky track (0 to 1)
    const scrolled = -trackRect.top;
    const progress = Math.min(Math.max(scrolled / scrollableDistance, 0), 1);

    // Left-to-Right Dirty-to-Clean Sweep (0% to 100%)
    const cleanPercent = progress * 100;
    document.documentElement.style.setProperty('--hero-clean-pos', `${cleanPercent.toFixed(2)}%`);
    document.documentElement.style.setProperty(
      '--hero-sheen-opacity',
      progress > 0.005 && progress < 0.98 ? '1' : '0'
    );

    requestAnimationFrame(updateHeroScroll);
  }

  requestAnimationFrame(updateHeroScroll);
}

/* ==========================================================================
   1. STICKY HEADER
   ========================================================================== */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });
}

/* ==========================================================================
   2. MOBILE NAVIGATION
   ========================================================================== */
function initMobileNav() {
  const toggleBtn = document.querySelector('.btn-mobile-toggle');
  const closeBtn = document.querySelector('.drawer-close-btn');
  const mainNav = document.querySelector('.main-nav');
  const dropdownTrigger = document.querySelector('.nav-item-dropdown > .nav-link');
  const dropdownItem = document.querySelector('.nav-item-dropdown');

  // Create backdrop overlay if not present
  let backdrop = document.querySelector('.nav-backdrop');
  if (!backdrop) {
    backdrop = document.createElement('div');
    backdrop.className = 'nav-backdrop';
    document.body.appendChild(backdrop);
  }

  function closeMobileNav() {
    if (mainNav) mainNav.classList.remove('active');
    if (backdrop) backdrop.classList.remove('active');
    document.body.classList.remove('nav-open');
  }

  if (toggleBtn && mainNav) {
    toggleBtn.addEventListener('click', () => {
      mainNav.classList.toggle('active');
      const isOpen = mainNav.classList.contains('active');
      if (backdrop) backdrop.classList.toggle('active', isOpen);
      document.body.classList.toggle('nav-open', isOpen);
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener('click', closeMobileNav);
  }

  if (backdrop) {
    backdrop.addEventListener('click', closeMobileNav);
  }

  if (dropdownTrigger && dropdownItem) {
    dropdownTrigger.addEventListener('click', (e) => {
      if (window.innerWidth <= 992) {
        e.preventDefault();
        dropdownItem.classList.toggle('active');
      }
    });
  }

  // Close nav on click outside or on nav links
  document.querySelectorAll('.nav-link:not(.dropdown-trigger), .dropdown-link, .nav-drawer-btn').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 992) {
        closeMobileNav();
      }
    });
  });
}


/* ==========================================================================
   3. TIKTOK REELS INTERACTION
   ========================================================================== */
function initTikTokReelsHover() {
  const reelCards = document.querySelectorAll('[data-tiktok-card]');
  if (!reelCards.length) return;
}

/* ==========================================================================
   5. REVIEW CAROUSEL (WITH TOUCH SWIPE FOR MOBILE)
   ========================================================================== */
function initReviewCarousel() {
  const slider = document.querySelector('.reviews-slider');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const nextBtn = document.querySelector('.carousel-btn-next');
  const dotsContainer = document.querySelector('.carousel-dots');
  const cards = document.querySelectorAll('.review-card');

  if (!slider || !cards.length) return;

  let currentIndex = 0;
  
  function getVisibleCardsCount() {
    if (window.innerWidth <= 640) return 1;
    if (window.innerWidth <= 992) return 2;
    if (window.innerWidth <= 1200) return 3;
    return 4;
  }

  function getMaxIndex() {
    return Math.max(0, cards.length - getVisibleCardsCount());
  }

  function renderDots() {
    if (!dotsContainer) return;
    dotsContainer.innerHTML = '';
    const totalDots = getMaxIndex() + 1;
    for (let i = 0; i < totalDots; i++) {
      const dot = document.createElement('button');
      dot.className = `carousel-dot ${i === currentIndex ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Go to review slide ${i + 1}`);
      dot.addEventListener('click', () => {
        currentIndex = i;
        updateSlider();
      });
      dotsContainer.appendChild(dot);
    }
  }

  function updateSlider() {
    const maxIdx = getMaxIndex();
    if (currentIndex > maxIdx) currentIndex = maxIdx;
    if (currentIndex < 0) currentIndex = 0;

    const firstCard = cards[0];
    if (firstCard && slider) {
      const cardWidth = firstCard.getBoundingClientRect().width;
      const gap = 28;
      const moveDistance = (cardWidth + gap) * currentIndex;
      slider.style.transform = `translateX(-${moveDistance}px)`;
    }

    const dots = document.querySelectorAll('.carousel-dot');
    dots.forEach((dot, idx) => {
      dot.classList.toggle('active', idx === currentIndex);
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = getMaxIndex();
      }
      updateSlider();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (currentIndex < getMaxIndex()) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateSlider();
    });
  }

  // Touch Swipe Gesture for Mobile Testimonial Cards
  let touchStartX = 0;
  let touchEndX = 0;

  slider.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  slider.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }, { passive: true });

  function handleSwipe() {
    const swipeThreshold = 40;
    if (touchStartX - touchEndX > swipeThreshold) {
      // Swiped Left -> Next
      if (currentIndex < getMaxIndex()) {
        currentIndex++;
      } else {
        currentIndex = 0;
      }
      updateSlider();
    } else if (touchEndX - touchStartX > swipeThreshold) {
      // Swiped Right -> Prev
      if (currentIndex > 0) {
        currentIndex--;
      } else {
        currentIndex = getMaxIndex();
      }
      updateSlider();
    }
  }

  window.addEventListener('resize', () => {
    renderDots();
    updateSlider();
  });

  renderDots();
  setTimeout(updateSlider, 100);
}

/* ==========================================================================
   9. MOBILE STICKY CTA BAR VISIBILITY CONTROLLER
   ========================================================================== */
function initMobileCtaBar() {
  const ctaBar = document.getElementById('mobileCtaBar');
  const contactSection = document.getElementById('contact');
  if (!ctaBar) return;

  function updateCtaVisibility() {
    if (window.innerWidth > 768) {
      ctaBar.classList.remove('show');
      return;
    }

    const scrollY = window.scrollY || window.pageYOffset;
    
    // Check if user is inside contact form section
    let inContactForm = false;
    if (contactSection) {
      const rect = contactSection.getBoundingClientRect();
      const windowHeight = window.innerHeight || document.documentElement.clientHeight;
      if (rect.top <= windowHeight * 0.7 && rect.bottom >= windowHeight * 0.2) {
        inContactForm = true;
      }
    }

    if (scrollY > 160 && !inContactForm) {
      ctaBar.classList.add('show');
    } else {
      ctaBar.classList.remove('show');
    }
  }

  window.addEventListener('scroll', updateCtaVisibility, { passive: true });
  window.addEventListener('resize', updateCtaVisibility, { passive: true });
  updateCtaVisibility();
}

/* ==========================================================================
   6. FAQ ACCORDION
   ========================================================================== */
function initFaqAccordion() {
  const faqRows = document.querySelectorAll('.faq-row');
  if (!faqRows.length) return;

  faqRows.forEach(row => {
    const trigger = row.querySelector('.faq-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = row.classList.contains('active');
      
      // Close other rows
      faqRows.forEach(r => r.classList.remove('active'));

      // Toggle clicked row
      if (!isActive) {
        row.classList.add('active');
      }
    });
  });
}

/* ==========================================================================
   6b. WHY CHOOSE US ACCORDION
   ========================================================================== */
function initWhyChooseAccordion() {
  const items = document.querySelectorAll('.why-accordion-item');
  if (!items.length) return;

  items.forEach(item => {
    const trigger = item.querySelector('.why-accordion-trigger');
    if (!trigger) return;

    trigger.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      items.forEach(i => {
        i.classList.remove('active');
        const trig = i.querySelector('.why-accordion-trigger');
        if (trig) trig.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* ==========================================================================
   7. FLOATING LEAD FORM & ESTIMATE HANDLERS
   ========================================================================== */
function initLeadForm() {
  const forms = document.querySelectorAll('.lead-form-interactive');
  
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = form.querySelector('button[type="submit"]');
      const origText = submitBtn ? submitBtn.innerHTML : 'Submit';
      
      // Basic validation
      const nameInput = form.querySelector('input[name="fullName"]');
      const phoneInput = form.querySelector('input[name="phone"]');
      
      if (nameInput && !nameInput.value.trim()) {
        showToast('Please enter your full name.', 'error');
        nameInput.focus();
        return;
      }

      if (phoneInput && !phoneInput.value.trim()) {
        showToast('Please enter your contact phone number.', 'error');
        phoneInput.focus();
        return;
      }

      // Simulate loading state
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = `
          <svg class="spinner" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" style="animation: spin 0.8s linear infinite;">
            <circle cx="12" cy="12" r="10" stroke-opacity="0.25"></circle>
            <path d="M12 2a10 10 0 0 1 10 10" stroke-linecap="round"></path>
          </svg>
          Processing...
        `;
      }

      setTimeout(() => {
        if (submitBtn) {
          submitBtn.disabled = false;
          submitBtn.innerHTML = origText;
        }
        
        // Show success modal
        openEstimateModal(nameInput ? nameInput.value : 'Neighbor');
        form.reset();
        showToast('Estimate request sent! We will contact you within 30 minutes.');
      }, 900);
    });
  });
}

/* ==========================================================================
   8. MODALS & TOAST NOTIFICATIONS
   ========================================================================== */
function initModalAndToasts() {
  const modal = document.getElementById('estimateModal');
  const promoModal = document.getElementById('promoModal');
  const closeBtns = document.querySelectorAll('.modal-close-btn, .modal-close-trigger');
  
  closeBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      if (modal) modal.classList.remove('active');
      if (promoModal) promoModal.classList.remove('active');
    });
  });

  // Close on outside click
  window.addEventListener('click', (e) => {
    if (modal && e.target === modal) modal.classList.remove('active');
    if (promoModal && e.target === promoModal) promoModal.classList.remove('active');
  });

  // Announcement bar learn more click
  const promoLink = document.querySelector('.top-bar .learn-more-link');
  if (promoLink && promoModal) {
    promoLink.addEventListener('click', (e) => {
      e.preventDefault();
      promoModal.classList.add('active');
    });
  }

  // Quote CTA buttons trigger scroll to contact form
  document.querySelectorAll('a[href="#contact"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.getElementById('contact');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth', block: 'center' });
        const nameField = target.querySelector('input[name="fullName"], #contactFullName');
        if (nameField) setTimeout(() => nameField.focus(), 500);
      }
    });
  });
}

function openEstimateModal(userName) {
  const modal = document.getElementById('estimateModal');
  if (!modal) return;
  
  const nameDisplay = modal.querySelector('.modal-user-name');
  if (nameDisplay) nameDisplay.textContent = userName;
  modal.classList.add('active');
}

function showToast(message) {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
      <polyline points="22 4 12 14.01 9 11.01"></polyline>
    </svg>
    <span>${message}</span>
  `;

  container.appendChild(toast);
  setTimeout(() => toast.classList.add('show'), 50);

  setTimeout(() => {
    toast.classList.remove('show');
    setTimeout(() => toast.remove(), 350);
  }, 4500);
}

// Keyframe animation for spinner
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
