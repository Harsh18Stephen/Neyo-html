/* Header */

document.addEventListener("DOMContentLoaded", function () {
  const cartIcon = document.querySelector(".cart-icon");
  const cartCount = document.querySelector(".cart-count");
  const navLinks = document.querySelectorAll(".nav-link");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  const mobileMenuToggle = document.querySelector(".mobile-menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");

  /* // Cart functionality
  let itemCount = 0;

  cartIcon.addEventListener("click", function () {
    itemCount++;
    cartCount.textContent = itemCount;

    // Add animation
    cartIcon.style.transform = "scale(1.2)";
    setTimeout(() => {
      cartIcon.style.transform = "scale(1)";
    }, 200);
  });
 */
  // Product URL mappings for dropdown navigation
  const productUrls = {
    // Soap products
    "natural-bar-soap": "lemon.html",
    "exfoliating-soap": "rose.html",
    "moisturizing-soap": "aloe-vera.html",
    "antibacterial-soap": "multani-matti.html",

    // Facial care products
    "daily-cleanser": "gentle-face-wash.html",
    "face-serum": "oily-skin-face-wash.html",
    moisturizer: "face-moisturizer.html",
    "face-mask": "face-scrub.html",

    // Body care products
    "body-lotion": "shower-gel1.html",
    "body-scrub": "shower-gel2.html",
    "body-oil": "body-lotion1.html",
    "body-butter": "body-lotion2.html",

    // Hair care products
    "natural-shampoo": "shampoo1.html",
    conditioner: "shampoo2.html",
    "hair-oil": "conditioner1.html",
    "hair-mask": "conditioner2.html",
  };

  // Navigation redirect functionality
  function navigateToPage(pageName) {
    // Add loading animation
    document.body.classList.add("loading");

    // Show loading state
    const loadingOverlay = document.createElement("div");
    loadingOverlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(160, 97, 106, 0.1);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-color: #8b4d56;
                    font-size: 18px;
                    font-weight: 500;
                `;
    loadingOverlay.innerHTML = '<div style="color: #8b4d56;">Loading...</div>';
    document.body.appendChild(loadingOverlay);

    // Navigate after short delay for smooth transition
    setTimeout(() => {
      window.location.href = pageName;
    }, 300);
  }

  // Desktop dropdown product card click handlers
  const dropdownProductCards = document.querySelectorAll(
    ".dropdown .product-card"
  );
  dropdownProductCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const productId = this.getAttribute("data-product");
      const productUrl = productUrls[productId];

      if (productUrl) {
        // Add click animation
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";
          navigateToPage(productUrl);
        }, 150);
      } else {
        console.warn(`No URL found for product: ${productId}`);
      }
    });
  });

  // Mobile dropdown product card click handlers
  const mobileProductCards = document.querySelectorAll(".mobile-product-card");
  mobileProductCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const productId = this.getAttribute("data-product");
      const productUrl = productUrls[productId];

      if (productUrl) {
        // Close mobile menu first
        mobileMenu.classList.remove("active");
        const icon = mobileMenuToggle.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");

        // Add click animation
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";
          navigateToPage(productUrl);
        }, 150);
      } else {
        console.warn(`No URL found for product: ${productId}`);
      }
    });
  });

  // Desktop navigation click handlers (for main nav items)
  navLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const pageName = this.getAttribute("data-page");
      if (pageName) {
        // Add click animation
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";
          navigateToPage(pageName);
        }, 150);
      }
    });
  });

  // Mobile navigation click handlers (for main nav items)
  mobileNavLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      const pageName = this.getAttribute("data-page");
      if (pageName) {
        // Close mobile menu first
        mobileMenu.classList.remove("active");
        const icon = mobileMenuToggle.querySelector("i");
        icon.classList.remove("fa-times");
        icon.classList.add("fa-bars");

        // Add click animation and navigate
        this.style.transform = "scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";
          navigateToPage(pageName);
        }, 150);
      }
    });
  });

  // Mobile menu toggle
  mobileMenuToggle.addEventListener("click", function () {
    mobileMenu.classList.toggle("active");
    const icon = mobileMenuToggle.querySelector("i");

    if (mobileMenu.classList.contains("active")) {
      icon.classList.remove("fa-bars");
      icon.classList.add("fa-times");
    } else {
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });

  // Close mobile menu when clicking outside
  document.addEventListener("click", function (e) {
    if (
      !mobileMenuToggle.contains(e.target) &&
      !mobileMenu.contains(e.target)
    ) {
      mobileMenu.classList.remove("active");
      const icon = mobileMenuToggle.querySelector("i");
      icon.classList.remove("fa-times");
      icon.classList.add("fa-bars");
    }
  });

  // Header scroll effect
  let lastScrollTop = 0;
  const header = document.querySelector(".header");

  window.addEventListener("scroll", function () {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header.style.transform = "translateY(-100%)";
    } else {
      // Scrolling up
      header.style.transform = "translateY(0)";
    }

    lastScrollTop = scrollTop;
  });

  // Logo click handler
  const logoImage = document.querySelector(".logo-image");
  if (logoImage) {
    logoImage.addEventListener("click", function (e) {
      e.preventDefault();
      navigateToPage("index.html");
    });
  }
});

/* Cart Icon */
document.addEventListener("DOMContentLoaded", function () {
  const cartIcon = document.querySelector(".cart-icon");

  if (cartIcon) {
    // Make it clickable
    cartIcon.style.cursor = "pointer";
    cartIcon.style.transition = "transform 0.2s ease";

    // Add click event
    cartIcon.addEventListener("click", function () {
      // Add click animation
      cartIcon.style.transform = "scale(0.95)";

      setTimeout(() => {
        cartIcon.style.transform = "scale(1.1)";

        setTimeout(() => {
          window.location.href = "cart.html";
        }, 100);
      }, 100);
    });

    // Add hover effect
    cartIcon.addEventListener("mouseenter", function () {
      cartIcon.style.transform = "scale(1.1)";
    });

    cartIcon.addEventListener("mouseleave", function () {
      cartIcon.style.transform = "scale(1)";
    });
  }
});

/* Footer */

document.addEventListener("DOMContentLoaded", function () {
  // Navigation functionality for footer links
  function navigateToPage(pageName) {
    // Add loading animation
    document.body.classList.add("loading");

    // Show loading state
    const loadingOverlay = document.createElement("div");
    loadingOverlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(160, 97, 106, 0.1);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #8b4d56;
                    font-size: 18px;
                    font-weight: 500;
                `;
    loadingOverlay.innerHTML = "<div>Loading...</div>";
    document.body.appendChild(loadingOverlay);

    // Navigate after short delay for smooth transition
    setTimeout(() => {
      window.location.href = pageName;
    }, 300);
  }

  // Footer links click handlers
  const footerLinks = document.querySelectorAll(".footer-section a[data-page]");
  footerLinks.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault();

      const pageName = this.getAttribute("data-page");
      if (pageName) {
        // Add click animation
        this.style.transform = "translateX(10px) scale(0.95)";
        setTimeout(() => {
          this.style.transform = "";
          navigateToPage(pageName);
        }, 150);
      }
    });
  });

  // Logo click handler
  const logoBox = document.querySelector(".logo-box");
  if (logoBox) {
    logoBox.addEventListener("click", function () {
      navigateToPage("index.html");
    });
  }

  // Contact info click handlers
  const phoneNumber = document.querySelector(".contact-info p:first-child");
  const email = document.querySelector(".contact-info p:nth-child(2)");

  if (phoneNumber) {
    phoneNumber.addEventListener("click", function () {
      window.location.href = "tel:8866110762";
    });
  }

  if (email) {
    email.addEventListener("click", function () {
      window.location.href = "mailto:info@neyonaturals.com";
    });
  }

  // Social media analytics tracking (optional)
  const socialIcons = document.querySelectorAll(".social-icon");
  socialIcons.forEach((icon) => {
    icon.addEventListener("click", function () {
      const platform = this.querySelector("i").classList[1].split("-")[1];
      console.log(`Social click: ${platform}`);

      // Add click animation
      this.style.transform = "translateY(-8px) scale(1.15)";
      setTimeout(() => {
        this.style.transform = "";
      }, 200);
    });
  });

  // Smooth scroll to top functionality (optional)
  const footerLogo = document.querySelector(".footer-logo");
  if (footerLogo) {
    footerLogo.addEventListener("dblclick", function () {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // Newsletter signup functionality (if you want to add it later)
  function initNewsletterSignup() {
    // This can be expanded for newsletter functionality
    console.log("Newsletter signup initialized");
  }

  // Initialize all functionality
  initNewsletterSignup();
});
