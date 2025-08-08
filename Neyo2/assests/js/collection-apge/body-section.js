document.addEventListener("DOMContentLoaded", function () {
  // Get soap section add to cart buttons and product cards
  const soapAddToCartButtons = document.querySelectorAll(
    ".soap-section .add-to-cart"
  );
  const productCards = document.querySelectorAll(".soap-section .product-card");
  const cartCount = document.querySelector(".cart-count"); // Assuming cart count exists in header

  // Body care product page URLs - Update these with your actual webpage URLs
  const productUrls = {
    "Lavender Shower Gel": "shower-gel1.html",
    "Vanilla Shower Gel": "shower-gel2.html",
    "Shea Butter Body Lotion": "body-lotion1.html",
    "Coconut Body Lotion": "body-lotion2.html",
  };

  // Add click functionality to product cards for navigation
  productCards.forEach((card) => {
    card.addEventListener("click", function (e) {
      // Don't navigate if the add to cart button was clicked
      if (
        e.target.classList.contains("add-to-cart") ||
        e.target.closest(".add-to-cart")
      ) {
        return;
      }

      const productName = this.querySelector(".product-name").textContent;
      const productUrl = productUrls[productName];

      if (productUrl) {
        // Option 1: Navigate to the product page in same tab
        window.location.href = productUrl;

        // Option 2: Open in new tab (uncomment if preferred)
        // window.open(productUrl, '_blank');
      } else {
        console.warn(`No URL found for product: ${productName}`);
      }
    });

    // Add hover effect to indicate clickability
    card.style.cursor = "pointer";
  });

  // Add to cart functionality for body care products
  soapAddToCartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      // Prevent the card click event from firing
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

  // Optional: Add visual feedback for hovering over clickable cards
  productCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.cursor = "pointer";
      // Optional: Add subtle scale effect on hover (in addition to existing hover effects)
      this.style.transform = "translateY(-10px) scale(1.02)";
    });

    card.addEventListener("mouseleave", function () {
      // Reset to the original hover state
      this.style.transform = "translateY(0) scale(1)";
    });
  });
});
