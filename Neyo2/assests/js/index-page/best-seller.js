document.addEventListener("DOMContentLoaded", function () {
  /* const addToCartButtons = document.querySelectorAll(".add-to-cart-btn"); */

  // Soap data for reference
  const soapData = {
    lavender: {
      name: "Lavender Bliss",
      price: 299,
      benefits: ["Relaxing", "Moisturizing"],
    },
    "tea-tree": {
      name: "Tea Tree Refresh",
      price: 329,
      benefits: ["Purifying", "Acne-Fighting"],
    },
    "honey-oat": {
      name: "Honey Oat Glow",
      price: 349,
      benefits: ["Exfoliating", "Brightening"],
    },
    charcoal: {
      name: "Activated Charcoal",
      price: 379,
      benefits: ["Detoxifying", "Deep Clean"],
    },
  };

  // Add to cart functionality
  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function () {
      const soapType = this.getAttribute("data-soap");
      const soap = soapData[soapType];

      // Button animation and feedback
      this.style.transform = "scale(0.95)";
      this.textContent = "Adding...";
      this.disabled = true;

      setTimeout(() => {
        this.style.transform = "scale(1)";
        this.textContent = "✓ Added to Cart";
        this.classList.add("added");

        // Reset after 2 seconds
        setTimeout(() => {
          this.textContent = "Add to Cart";
          this.classList.remove("added");
          this.disabled = false;
        }, 2000);
      }, 500);

      // Show notification
      showNotification(`${soap.name} added to cart!`);
    });
  });

  // Notification system
  function showNotification(message) {
    // Remove existing notifications
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    // Create notification
    const notification = document.createElement("div");
    notification.className = "notification";
    notification.textContent = message;

    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
      notification.classList.add("show");
    }, 100);

    // Remove after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }

  // Soap card hover effects
  const soapCards = document.querySelectorAll(".soap-card");

  soapCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      const soapImage = this.querySelector(".soap-placeholder");
      if (soapImage) {
        soapImage.style.transform = "scale(1.05)";
        soapImage.style.transition = "transform 0.3s ease";
      }
    });

    card.addEventListener("mouseleave", function () {
      const soapImage = this.querySelector(".soap-placeholder");
      if (soapImage) {
        soapImage.style.transform = "scale(1)";
      }
    });
  });

  // Intersection Observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const soapCards = entry.target.querySelectorAll(".soap-card");
        soapCards.forEach((card, index) => {
          setTimeout(() => {
            card.style.opacity = "1";
            card.style.transform = "translateY(0)";
          }, index * 200);
        });
      }
    });
  }, observerOptions);

  const bestSellersSection = document.querySelector(".best-sellers");
  if (bestSellersSection) {
    // Initially hide cards for animation
    const soapCards = bestSellersSection.querySelectorAll(".soap-card");
    soapCards.forEach((card) => {
      card.style.opacity = "0";
      card.style.transform = "translateY(30px)";
      card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    });

    observer.observe(bestSellersSection);
  }
});
