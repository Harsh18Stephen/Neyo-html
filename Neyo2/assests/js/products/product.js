/* Product-shell */
document.addEventListener("DOMContentLoaded", function () {
  // Thumbnail image switching
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImage = document.getElementById("mainProductImage");

  thumbnails.forEach((thumbnail) => {
    thumbnail.addEventListener("click", function () {
      // Remove active class from all thumbnails
      thumbnails.forEach((t) => t.classList.remove("active"));

      // Add active class to clicked thumbnail
      this.classList.add("active");

      // Change main image
      const newImageSrc = this.getAttribute("data-image");
      mainImage.src = newImageSrc;

      // Add loading effect
      mainImage.style.opacity = "0.7";
      setTimeout(() => {
        mainImage.style.opacity = "1";
      }, 200);
    });
  });

  // Size option selection
  const sizeOptions = document.querySelectorAll(".size-option");
  const priceElement = document.getElementById("currentPrice");

  sizeOptions.forEach((option) => {
    option.addEventListener("click", function () {
      // Remove active class from all options
      sizeOptions.forEach((opt) => opt.classList.remove("active"));

      // Add active class to clicked option
      this.classList.add("active");

      // Update price
      const newPrice = this.getAttribute("data-price");
      priceElement.textContent = newPrice;

      // Add animation
      priceElement.style.transform = "scale(1.1)";
      setTimeout(() => {
        priceElement.style.transform = "scale(1)";
      }, 200);
    });
  });

  // Quantity controls
  const decreaseBtn = document.getElementById("decreaseQty");
  const increaseBtn = document.getElementById("increaseQty");
  const quantityInput = document.getElementById("quantity");

  decreaseBtn.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue > 1) {
      quantityInput.value = currentValue - 1;
      animateQuantityChange();
    }
  });

  increaseBtn.addEventListener("click", function () {
    let currentValue = parseInt(quantityInput.value);
    if (currentValue < 10) {
      quantityInput.value = currentValue + 1;
      animateQuantityChange();
    }
  });

  quantityInput.addEventListener("change", function () {
    let value = parseInt(this.value);
    if (value < 1) this.value = 1;
    if (value > 10) this.value = 10;
    animateQuantityChange();
  });

  function animateQuantityChange() {
    quantityInput.style.transform = "scale(1.1)";
    setTimeout(() => {
      quantityInput.style.transform = "scale(1)";
    }, 150);
  }

  // Add to Cart functionality
  const addToCartBtn = document.getElementById("addToCartBtn");
  let cartCount = 0;

  addToCartBtn.addEventListener("click", function () {
    const quantity = parseInt(quantityInput.value);
    const selectedSize = document
      .querySelector(".size-option.active")
      .getAttribute("data-size");
    const price = document.getElementById("currentPrice").textContent;

    cartCount += quantity;

    // Add loading state
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> ADDING...';
    this.disabled = true;

    // Simulate API call
    setTimeout(() => {
      this.innerHTML = '<i class="fas fa-check"></i> ADDED TO CART';

      // Reset button after 2 seconds
      setTimeout(() => {
        this.innerHTML = '<i class="fas fa-shopping-bag"></i> ADD TO CART';
        this.disabled = false;
      }, 2000);

      // Show success message
      showSuccessMessage(
        `${quantity} x Natural Lemon Soap (${selectedSize}) added to cart!`
      );
    }, 1000);
  });

  // Expandable sections
  const expandableHeaders = document.querySelectorAll(".expandable-header");

  expandableHeaders.forEach((header) => {
    header.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const content = document.getElementById(targetId);
      const icon = this.querySelector(".expand-icon");

      // Toggle content
      content.classList.toggle("active");
      icon.classList.toggle("active");

      // Close other sections
      expandableHeaders.forEach((otherHeader) => {
        if (otherHeader !== this) {
          const otherTargetId = otherHeader.getAttribute("data-target");
          const otherContent = document.getElementById(otherTargetId);
          const otherIcon = otherHeader.querySelector(".expand-icon");

          otherContent.classList.remove("active");
          otherIcon.classList.remove("active");
        }
      });
    });
  });

  // Success message function
  function showSuccessMessage(message) {
    const successDiv = document.createElement("div");
    successDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #28a745, #20c997);
            color: white;
            padding: 15px 20px;
            border-radius: 8px;
            font-weight: 500;
            box-shadow: 0 5px 15px rgba(40, 167, 69, 0.3);
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;
    successDiv.textContent = message;

    document.body.appendChild(successDiv);

    setTimeout(() => {
      successDiv.style.animation = "slideOutRight 0.3s ease";
      setTimeout(() => {
        document.body.removeChild(successDiv);
      }, 300);
    }, 3000);
  }

  // Add CSS animations
  const style = document.createElement("style");
  style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        @keyframes slideOutRight {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(100%);
                opacity: 0;
            }
        }
    `;
  document.head.appendChild(style);
});


/* Product-Info */
document.addEventListener("DOMContentLoaded", function () {
  // Expandable sections functionality
  const expandableTriggers = document.querySelectorAll(".expandable-trigger");

  expandableTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function () {
      const targetId = this.getAttribute("data-target");
      const content = document.getElementById(targetId);
      const icon = this.querySelector(".expand-icon");

      // Toggle the content
      content.classList.toggle("active");
      icon.classList.toggle("active");

      // Update icon
      if (content.classList.contains("active")) {
        icon.classList.remove("fa-plus");
        icon.classList.add("fa-minus");
      } else {
        icon.classList.remove("fa-minus");
        icon.classList.add("fa-plus");
      }

      // Add ripple effect
      const ripple = document.createElement("span");
      ripple.classList.add("ripple");
      ripple.style.cssText = `
                        position: absolute;
                        border-radius: 50%;
                        background: rgba(255,255,255,0.3);
                        transform: scale(0);
                        animation: ripple 0.6s linear;
                        pointer-events: none;
                    `;

      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      ripple.style.width = ripple.style.height = size + "px";
      ripple.style.left = event.clientX - rect.left - size / 2 + "px";
      ripple.style.top = event.clientY - rect.top - size / 2 + "px";

      this.style.position = "relative";
      this.appendChild(ripple);

      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });

  // Smooth scroll animation for ingredient items
  const ingredientItems = document.querySelectorAll(".ingredient-item");
  const benefitItems = document.querySelectorAll(".benefit-item");

  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = "slideInLeft 0.6s ease forwards";
      }
    });
  }, observerOptions);

  [...ingredientItems, ...benefitItems].forEach((item) => {
    observer.observe(item);
  });

  // Add CSS for animations
  const style = document.createElement("style");
  style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(4);
                        opacity: 0;
                    }
                }
                
                @keyframes slideInLeft {
                    from {
                        opacity: 0;
                        transform: translateX(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateX(0);
                    }
                }
            `;
  document.head.appendChild(style);

  // Smooth scrolling for better UX
  document.querySelectorAll(".info-card").forEach((card) => {
    card.addEventListener("click", function (e) {
      if (e.target.closest(".expandable-trigger")) {
        setTimeout(() => {
          this.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }, 100);
      }
    });
  });
});