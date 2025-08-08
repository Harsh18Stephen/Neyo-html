document.addEventListener("DOMContentLoaded", function () {
  const categoryCards = document.querySelectorAll(".category-card");
  const loadingOverlay = document.getElementById("loadingOverlay");
  const loadingText = document.getElementById("loadingText");

  // Category names for loading text
  const categoryNames = {
    soaps: "Natural Soaps",
    "facial-care": "Facial Care",
    "body-care": "Body Care",
    "hair-care": "Hair Care",
  };

  // Add click functionality to category cards
  categoryCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Create ripple effect
      createRipple(e, this);

      // Get category data
      const page = this.getAttribute("data-page");
      const category = this.getAttribute("data-category");

      if (page) {
        // Update loading text
        const categoryName = categoryNames[category] || "Products";
        loadingText.textContent = `Loading ${categoryName}...`;

        // Show loading overlay
        loadingOverlay.classList.add("active");

        // Navigate after delay
        setTimeout(() => {
          const url = category ? `${page}?category=${category}` : page;
          window.location.href = url;
        }, 1000);
      }
    });
  });

  // Create ripple effect
  function createRipple(event, element) {
    const ripple = document.createElement("span");
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.5;
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.width = ripple.style.height = size + "px";
    ripple.style.left = x + "px";
    ripple.style.top = y + "px";
    ripple.classList.add("ripple");

    element.appendChild(ripple);

    // Remove ripple after animation
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.remove();
      }
    }, 800);
  }

  // Animate cards on scroll
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("animate");
        }, index * 100);
      }
    });
  }, observerOptions);

  // Observe all category cards
  categoryCards.forEach((card) => {
    observer.observe(card);
  });

  // Remove loading overlay if clicked outside
  loadingOverlay.addEventListener("click", function (e) {
    if (e.target === this) {
      this.classList.remove("active");
    }
  });
});


// Simple Product Page Navigation
document.addEventListener("DOMContentLoaded", function () {
    // Get all soap cards with product URLs
    const soapCards = document.querySelectorAll('.soap-card[data-product-url]');
    
    soapCards.forEach(card => {
        card.addEventListener('click', function(e) {
            // Don't navigate if clicking the "Add to Cart" button
            if (e.target.classList.contains('add-to-cart-btn')) {
                return;
            }
            
            // Get the product URL
            const productUrl = this.getAttribute('data-product-url');
            
            if (productUrl) {
                // Add loading effect
                this.style.transform = 'scale(0.98)';
                this.style.opacity = '0.8';
                
                // Navigate to product page after short delay
                setTimeout(() => {
                    window.location.href = productUrl;
                }, 150);
            }
        });
        
        // Add visual feedback on hover
        card.addEventListener('mouseenter', function() {
            this.style.cursor = 'pointer';
        });
    });
    
    /* // Keep existing Add to Cart functionality
    const addToCartBtns = document.querySelectorAll('.add-to-cart-btn');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.stopPropagation(); // Prevent card click
            
            // Your existing add to cart code here
            console.log('Added to cart:', this.getAttribute('data-soap'));
            
            // Update cart count if needed
            const cartCount = document.querySelector('.cart-count');
            if (cartCount) {
                let count = parseInt(cartCount.textContent) || 0;
                cartCount.textContent = count + 1;
            }
        });
    }); */
});