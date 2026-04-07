document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const header = document.querySelector(".site-header");
  const mobileToggle = document.querySelector(".mobile-menu-toggle");
  const nav = document.querySelector(".main-nav");
  const navLinks = document.querySelectorAll(".main-nav a");
  const sections = document.querySelectorAll("section[id]");
  const revealElements = document.querySelectorAll(".reveal");
  const heroImage = document.querySelector(".hero-media img");
  const bookingForm = document.querySelector(".booking-form");
  const backToTop = document.querySelector(".back-to-top");
  const scrollIndicator = document.querySelector(".scroll-indicator");

  /* =========================
     HEADER SCROLL EFFECT
  ========================= */
  const handleHeaderScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  };

  handleHeaderScroll();
  window.addEventListener("scroll", handleHeaderScroll);

  /* =========================
     MOBILE MENU
  ========================= */
  if (mobileToggle && nav) {
    const mobilePanel = document.createElement("div");
    mobilePanel.className = "mobile-nav-panel";
    mobilePanel.innerHTML = `
      <div class="mobile-nav-inner">
        <a href="#about">About</a>
        <a href="#stay">Stay</a>
        <a href="#gallery">Gallery</a>
        <a href="#experience">Experience</a>
        <a href="#location">Location</a>
        <a href="#contact">Contact</a>
        <div class="mobile-nav-actions">
          <a class="mobile-btn mobile-btn-outline" href="tel:+212661935025">Call Now</a>
          <a class="mobile-btn mobile-btn-dark" href="https://wa.me/212661935025" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </div>
    `;
    body.appendChild(mobilePanel);

    const mobileLinks = mobilePanel.querySelectorAll("a");

    const closeMobileMenu = () => {
      mobilePanel.classList.remove("active");
      mobileToggle.classList.remove("active");
      body.classList.remove("menu-open");
    };

    const openMobileMenu = () => {
      mobilePanel.classList.add("active");
      mobileToggle.classList.add("active");
      body.classList.add("menu-open");
    };

    mobileToggle.addEventListener("click", () => {
      if (mobilePanel.classList.contains("active")) {
        closeMobileMenu();
      } else {
        openMobileMenu();
      }
    });

    mobileLinks.forEach(link => {
      link.addEventListener("click", () => {
        closeMobileMenu();
      });
    });

    document.addEventListener("click", (e) => {
      if (
        mobilePanel.classList.contains("active") &&
        !mobilePanel.contains(e.target) &&
        !mobileToggle.contains(e.target)
      ) {
        closeMobileMenu();
      }
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 992) {
        closeMobileMenu();
      }
    });
  }

  /* =========================
     ACTIVE NAV LINK ON SCROLL
  ========================= */
  const setActiveNavLink = () => {
    let currentId = "";

    sections.forEach(section => {
      const sectionTop = section.offsetTop - 140;
      const sectionHeight = section.offsetHeight;

      if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
        currentId = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active-link");
      const href = link.getAttribute("href");
      if (href === `#${currentId}`) {
        link.classList.add("active-link");
      }
    });
  };

  setActiveNavLink();
  window.addEventListener("scroll", setActiveNavLink);

  /* =========================
     REVEAL ON SCROLL
  ========================= */
  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("revealed");
          revealObserver.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.14
    }
  );

  revealElements.forEach(el => {
    revealObserver.observe(el);
  });

  /* =========================
     HERO PARALLAX
  ========================= */
  const handleHeroParallax = () => {
    if (!heroImage) return;

    const scrollY = window.scrollY;
    const scale = 1.06 + Math.min(scrollY * 0.00008, 0.08);
    const translate = scrollY * 0.18;

    heroImage.style.transform = `scale(${scale}) translateY(${translate}px)`;
  };

  handleHeroParallax();
  window.addEventListener("scroll", handleHeroParallax);

  /* =========================
     IMAGE HOVER GLOW
  ========================= */
  const imageCards = document.querySelectorAll(
    ".stay-card, .gallery-item, .section-media, .map-card, .intro-strip-grid article, .highlight-card"
  );

  imageCards.forEach(card => {
    card.addEventListener("mousemove", (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      card.style.setProperty("--mouse-x", `${x}px`);
      card.style.setProperty("--mouse-y", `${y}px`);
    });
  });

  /* =========================
     SMOOTH SCROLL OFFSET
  ========================= */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const href = this.getAttribute("href");
      if (!href || href === "#") return;

      const target = document.querySelector(href);
      if (!target) return;

      e.preventDefault();

      const headerOffset = 110;
      const targetTop =
        target.getBoundingClientRect().top + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: targetTop,
        behavior: "smooth"
      });
    });
  });

  /* =========================
     BOOKING FORM
  ========================= */
  if (bookingForm) {
    const inputs = bookingForm.querySelectorAll("input, textarea, select");

    inputs.forEach(input => {
      input.addEventListener("focus", () => {
        input.parentElement.classList.add("is-focused");
      });

      input.addEventListener("blur", () => {
        input.parentElement.classList.remove("is-focused");
      });
    });

    bookingForm.addEventListener("submit", (e) => {
      e.preventDefault();

      const name = bookingForm.querySelector("#name")?.value.trim();
      const email = bookingForm.querySelector("#email")?.value.trim();
      const checkin = bookingForm.querySelector("#checkin")?.value;
      const checkout = bookingForm.querySelector("#checkout")?.value;
      const guests = bookingForm.querySelector("#guests")?.value;
      const room = bookingForm.querySelector("#room")?.value;
      const message = bookingForm.querySelector("#message")?.value.trim();

      if (!name || !email) {
        showLuxuryToast("Please fill in your full name and email address.");
        return;
      }

      const emailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
      if (!emailValid) {
        showLuxuryToast("Please enter a valid email address.");
        return;
      }

      if (checkin && checkout && new Date(checkout) <= new Date(checkin)) {
        showLuxuryToast("Check-out date must be after check-in date.");
        return;
      }

      const roomMap = {
        classic: "Classic Double Room",
        family: "Family Room",
        scenic: "Scenic Kasbah Room"
      };

      const whatsappMessage =
        `Hello, I would like to request availability at Kasbah Safari Rose.%0A%0A` +
        `Full Name: ${encodeURIComponent(name)}%0A` +
        `Email: ${encodeURIComponent(email)}%0A` +
        `Check-in: ${encodeURIComponent(checkin || "Not specified")}%0A` +
        `Check-out: ${encodeURIComponent(checkout || "Not specified")}%0A` +
        `Guests: ${encodeURIComponent(guests || "Not specified")}%0A` +
        `Room Type: ${encodeURIComponent(roomMap[room] || room)}%0A` +
        `Message: ${encodeURIComponent(message || "No additional message")}`;

      showLuxuryToast("Your request is ready. Redirecting to WhatsApp...");

      setTimeout(() => {
        window.open(`https://wa.me/212661935025?text=${whatsappMessage}`, "_blank");
      }, 1200);
    });
  }

  /* =========================
     LUXURY TOAST
  ========================= */
  const showLuxuryToast = (message) => {
    let toast = document.querySelector(".luxury-toast");

    if (!toast) {
      toast = document.createElement("div");
      toast.className = "luxury-toast";
      body.appendChild(toast);
    }

    toast.textContent = message;
    toast.classList.add("show");

    clearTimeout(toast.hideTimeout);
    toast.hideTimeout = setTimeout(() => {
      toast.classList.remove("show");
    }, 3200);
  };

  /* =========================
     BACK TO TOP
  ========================= */
  if (backToTop) {
    backToTop.addEventListener("click", (e) => {
      e.preventDefault();
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* =========================
     SCROLL INDICATOR CLICK
  ========================= */
  if (scrollIndicator) {
    scrollIndicator.addEventListener("click", (e) => {
      e.preventDefault();
      const aboutSection = document.querySelector("#about");
      if (aboutSection) {
        const offset = 100;
        const top =
          aboutSection.getBoundingClientRect().top + window.pageYOffset - offset;

        window.scrollTo({
          top,
          behavior: "smooth"
        });
      }
    });
  }

  /* =========================
     COUNTER-LIKE SOFT ENTRANCE
  ========================= */
  const heroDetails = document.querySelectorAll(".hero-detail");

  const heroDetailsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.transitionDelay = `${index * 120}ms`;
          entry.target.classList.add("hero-detail-visible");
        }
      });
    },
    { threshold: 0.35 }
  );

  heroDetails.forEach(item => heroDetailsObserver.observe(item));

  /* =========================
     SMALL POLISH FOR FAQ
  ========================= */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    item.addEventListener("toggle", () => {
      if (item.open) {
        faqItems.forEach(other => {
          if (other !== item) {
            other.removeAttribute("open");
          }
        });
      }
    });
  });

  /* =========================
     INJECT EXTRA STYLES FROM JS
  ========================= */
  const extraStyles = document.createElement("style");
  extraStyles.textContent = `
    body.menu-open {
      overflow: hidden;
    }

    .main-nav a.active-link {
      color: var(--gold-soft) !important;
    }

    .main-nav a.active-link::after {
      width: 100%;
    }

    .mobile-menu-toggle.active span:nth-child(1) {
      transform: translateY(3.8px) rotate(45deg);
    }

    .mobile-menu-toggle.active span:nth-child(2) {
      transform: translateY(-3.8px) rotate(-45deg);
    }

    .mobile-menu-toggle span {
      transition: transform 0.3s ease;
    }

    .mobile-nav-panel {
      position: fixed;
      inset: 0;
      z-index: 999;
      background: rgba(14, 11, 9, 0.58);
      opacity: 0;
      pointer-events: none;
      transition: opacity 0.35s ease;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      padding: 100px 16px 24px;
    }

    .mobile-nav-panel.active {
      opacity: 1;
      pointer-events: auto;
    }

    .mobile-nav-inner {
      width: min(100%, 520px);
      margin: 0 auto;
      background:
        linear-gradient(180deg, rgba(255,255,255,0.95), rgba(250,246,240,0.95));
      border: 1px solid rgba(70, 50, 35, 0.08);
      border-radius: 28px;
      padding: 24px;
      box-shadow: 0 28px 70px rgba(17,17,17,0.22);
      display: flex;
      flex-direction: column;
      gap: 8px;
      transform: translateY(30px) scale(0.98);
      transition: transform 0.35s ease;
    }

    .mobile-nav-panel.active .mobile-nav-inner {
      transform: translateY(0) scale(1);
    }

    .mobile-nav-inner a {
      padding: 14px 14px;
      border-radius: 16px;
      font-size: 1rem;
      font-weight: 600;
      color: var(--text);
      transition: background 0.3s ease, transform 0.3s ease, color 0.3s ease;
    }

    .mobile-nav-inner a:hover {
      background: rgba(184, 144, 83, 0.10);
      color: var(--gold-deep);
      transform: translateX(3px);
    }

    .mobile-nav-actions {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 12px;
      margin-top: 12px;
      padding-top: 10px;
    }

    .mobile-btn {
      min-height: 48px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 999px;
      font-size: 0.92rem;
      font-weight: 700;
    }

    .mobile-btn-dark {
      background: linear-gradient(135deg, #221a14, #111111);
      color: #fff !important;
    }

    .mobile-btn-outline {
      border: 1px solid rgba(60, 45, 32, 0.12);
      background: rgba(17,17,17,0.03);
      color: var(--text) !important;
    }

    .reveal {
      opacity: 0;
      transform: translateY(28px);
      transition:
        opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
      animation: none !important;
    }

    .reveal.revealed {
      opacity: 1;
      transform: translateY(0);
    }

    .hero-detail {
      opacity: 0;
      transform: translateY(18px);
      transition:
        opacity 0.8s cubic-bezier(0.22, 1, 0.36, 1),
        transform 0.8s cubic-bezier(0.22, 1, 0.36, 1),
        background 0.35s ease;
    }

    .hero-detail-visible {
      opacity: 1;
      transform: translateY(0);
    }

    .stay-card,
    .gallery-item,
    .section-media,
    .map-card,
    .intro-strip-grid article,
    .highlight-card {
      position: relative;
      overflow: hidden;
    }

    .stay-card::before,
    .gallery-item::before,
    .section-media::before,
    .map-card::before,
    .intro-strip-grid article::before,
    .highlight-card::before {
      content: "";
      position: absolute;
      inset: 0;
      background: radial-gradient(
        320px circle at var(--mouse-x, 50%) var(--mouse-y, 50%),
        rgba(255, 255, 255, 0.16),
        transparent 40%
      );
      opacity: 0;
      transition: opacity 0.35s ease;
      pointer-events: none;
      z-index: 2;
    }

    .stay-card:hover::before,
    .gallery-item:hover::before,
    .section-media:hover::before,
    .map-card:hover::before,
    .intro-strip-grid article:hover::before,
    .highlight-card:hover::before {
      opacity: 1;
    }

    .luxury-toast {
      position: fixed;
      left: 50%;
      bottom: 24px;
      transform: translateX(-50%) translateY(20px);
      background:
        linear-gradient(135deg, rgba(31, 24, 19, 0.96), rgba(17, 17, 17, 0.98));
      color: #fff;
      padding: 16px 22px;
      border-radius: 999px;
      font-size: 0.95rem;
      font-weight: 500;
      box-shadow: 0 20px 50px rgba(17,17,17,0.28);
      opacity: 0;
      pointer-events: none;
      transition: all 0.35s ease;
      z-index: 2000;
      max-width: calc(100% - 24px);
      text-align: center;
      border: 1px solid rgba(255,255,255,0.08);
    }

    .luxury-toast.show {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }

    .form-row.is-focused label {
      color: var(--gold-deep);
    }

    @media (max-width: 640px) {
      .mobile-nav-actions {
        grid-template-columns: 1fr;
      }

      .luxury-toast {
        border-radius: 22px;
        padding: 14px 18px;
        font-size: 0.9rem;
      }
    }
  `;
  document.head.appendChild(extraStyles);
});
