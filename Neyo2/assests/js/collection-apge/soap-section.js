// Updated JavaScript for soap section with navigation
document.addEventListener("DOMContentLoaded", function () {
  // Get soap section elements
  const soapAddToCartButtons = document.querySelectorAll(
    ".soap-section .add-to-cart"
  );
  const soapProductCards = document.querySelectorAll(
    ".soap-section .product-card"
  );
  const cartCount = document.querySelector(".cart-count"); // Assuming cart count exists in header

  // Product URLs mapping - you can customize these URLs
  const productUrls = {
    "Lemon Soap": "lemon.html", // or 'https://yoursite.com/lemon-soap'
    "Aloe Vera Soap": "aloe-vera.html", // or 'https://yoursite.com/aloe-vera-soap'
    "Rose Soap": "rose.html", // or 'https://yoursite.com/rose-soap'
    "Multani Mitti Soap": "multani-matti.html", // or 'https://yoursite.com/multani-mitti-soap'
  };

  // Add click navigation to product cards
  soapProductCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Don't navigate if add to cart button was clicked
      if (e.target.closest(".add-to-cart")) {
        return;
      }

      const productName = this.querySelector(".product-name").textContent;
      const url = productUrls[productName];

      if (url) {
        // Add loading animation
        this.style.transform = "scale(0.98)";
        this.style.opacity = "0.8";

        // Show loading state
        const loadingOverlay = document.createElement("div");
        loadingOverlay.style.cssText = `
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background: rgba(139, 77, 86, 0.1);
                    z-index: 9999;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: #8b4d56;
                    font-size: 18px;
                    font-weight: 500;
                `;
        loadingOverlay.innerHTML = "<div>Loading product...</div>";
        document.body.appendChild(loadingOverlay);

        // Navigate after short delay for smooth transition
        setTimeout(() => {
          // For external URLs, use:
          // window.open(url, '_blank'); // Opens in new tab
          // window.location.href = url; // Opens in same tab

          // For internal pages:
          window.location.href = url;
        }, 300);
      }
    });

    // Add hover effect for better UX
    card.addEventListener("mouseenter", function () {
      this.style.cursor = "pointer";
    });
  });

  // Add to cart functionality (prevent navigation when clicked)
  soapAddToCartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Stop event from bubbling up to card click
      e.stopPropagation();

      const productName =
        this.closest(".product-card").querySelector(
          ".product-name"
        ).textContent;

      // Update cart count if it exists
      if (cartCount) {
        let currentCount = parseInt(cartCount.textContent) || 0;
        cartCount.textContent = currentCount + 1;

        // Cart icon animation
        const cartIcon = document.querySelector(".cart-icon");
        if (cartIcon) {
          cartIcon.style.transform = "scale(1.2)";
          setTimeout(() => {
            cartIcon.style.transform = "scale(1)";
          }, 200);
        }
      }

      // Button feedback
      const originalText = this.textContent;
      this.textContent = "Added!";
      this.style.background =
        "linear-gradient(135deg, #28a745 0%, #20c997 100%)";

      setTimeout(() => {
        this.textContent = originalText;
        this.style.background =
          "linear-gradient(135deg, #8b4d56 0%, #a0616a 100%)";
      }, 1500);

      console.log(`Added ${productName} to cart`);
    });
  });
});
