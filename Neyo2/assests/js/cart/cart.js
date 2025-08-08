// Simple Cart Functions
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("neyoCart") || "[]");
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("neyoCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElement = document.querySelector(".cart-count");

  if (cartCountElement) {
    cartCountElement.textContent = count;
    if (count === 0) {
      cartCountElement.style.display = "none";
    } else {
      cartCountElement.style.display = "flex";
    }
  }
}

function addToCart(productData) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === productData.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productData.id,
      name: productData.name,
      description: productData.description || "",
      price: productData.price,
      quantity: 1,
      image: productData.image || "default",
      benefits: productData.benefits || [],
    });
  }

  saveCart(cart);
  showNotification(`${productData.name} added to cart!`);
}

function showNotification(message) {
  // Remove existing notification
  const existingNotification = document.querySelector(".cart-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create new notification
  const notification = document.createElement("div");
  notification.className = "cart-notification show";
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60, #229954);
        color: #fff;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        font-size: 14px;
        font-weight: bold;
        transform: translateX(0);
        transition: transform 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(300px)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===================================================
// STEP 2: Update your best-seller.js or add to main.js
// ===================================================

document.addEventListener("DOMContentLoaded", function () {
  // Update cart count on page load
  updateCartCount();

  // Make cart icon clickable
  const cartIcon = document.querySelector(".cart-icon");
  if (cartIcon) {
    cartIcon.style.cursor = "pointer";
    cartIcon.addEventListener("click", function () {
      window.location.href = "cart.html";
    });
  }

  // Handle add to cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Get product data from the soap card
      const soapCard = this.closest(".soap-card");
      if (!soapCard) return;

      const name = soapCard.querySelector(".soap-name")?.textContent.trim();
      const description = soapCard
        .querySelector(".soap-description")
        ?.textContent.trim();
      const priceText = soapCard
        .querySelector(".soap-price")
        ?.textContent.trim();
      const price = parseInt(priceText.replace(/[^\d]/g, ""));
      const benefits = Array.from(soapCard.querySelectorAll(".benefit")).map(
        (el) => el.textContent.trim()
      );

      // Determine image class
      let image = "default";
      if (name && name.toLowerCase().includes("lemon")) image = "lemon";
      else if (name && name.toLowerCase().includes("aloe")) image = "aloe-vera";
      else if (name && name.toLowerCase().includes("rose")) image = "rose";
      else if (name && name.toLowerCase().includes("multani"))
        image = "multani-mitti";

      const productData = {
        id: name ? name.toLowerCase().replace(/[^a-z0-9]/g, "-") : "unknown",
        name: name || "Unknown Product",
        description: description || "",
        price: price || 0,
        image: image,
        benefits: benefits,
      };

      console.log("Adding to cart:", productData); // Debug log

      // Add visual feedback
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i> Added!';
      this.style.background = "#27ae60";

      // Add to cart
      addToCart(productData);

      // Reset button after 2 seconds
      setTimeout(() => {
        this.innerHTML = originalText;
        this.style.background = "";
      }, 2000);
    });
  });
});

// ===================================================
// STEP 3: UPDATED CART PAGE JAVASCRIPT
// Replace your cart.html <script> section with this
// ===================================================

// Cart Page Functions
if (
  window.location.pathname.includes("cart.html") ||
  document.getElementById("cartContainer")
) {
  let appliedCoupon = null;
  const coupons = {
    SAVE10: { discount: 10, type: "percentage" },
    FIRST20: { discount: 20, type: "percentage" },
    NATURAL15: { discount: 15, type: "percentage" },
  };

  document.addEventListener("DOMContentLoaded", function () {
    console.log("Cart page loaded"); // Debug log
    renderCartPage();
    updateCartSummary();
  });

  function renderCartPage() {
    const cartItems = getCart();
    const cartItemsList = document.getElementById("cartItemsList");
    const cartContainer = document.getElementById("cartContainer");

    console.log("Cart items:", cartItems); // Debug log

    if (!cartItems || cartItems.length === 0) {
      cartContainer.innerHTML = `
                <div class="empty-cart fade-in">
                    <div class="empty-cart-icon">
                        <i class="fas fa-shopping-bag"></i>
                    </div>
                    <h2>Your cart is empty</h2>
                    <p>Looks like you haven't added any natural beauty products yet.</p>
                    <a href="index.html" class="continue-shopping-btn">
                        <i class="fas fa-leaf"></i> Start Shopping
                    </a>
                </div>
            `;
      return;
    }

    if (cartItemsList) {
      cartItemsList.innerHTML = cartItems
        .map(
          (item) => `
                <div class="cart-item fade-in" data-item-id="${item.id}">
                    <div class="item-image ${item.image}">
                        <i class="fas fa-seedling"></i>
                    </div>
                    <div class="item-details">
                        <h3 class="item-name">${item.name}</h3>
                        <p class="item-description">${item.description}</p>
                        <div class="item-benefits">
                            ${item.benefits
                              .map(
                                (benefit) =>
                                  `<span class="benefit">${benefit}</span>`
                              )
                              .join("")}
                        </div>
                    </div>
                    <div class="item-controls">
                        <div class="item-price">₹${item.price}</div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="changeQuantity('${
                              item.id
                            }', -1)" ${item.quantity <= 1 ? "disabled" : ""}>
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="changeQuantity('${
                              item.id
                            }', 1)">
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                        <button class="remove-btn" onclick="removeFromCart('${
                          item.id
                        }')" title="Remove item">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            `
        )
        .join("");
    }

    updateItemsCount();
  }

  function changeQuantity(itemId, change) {
    const cart = getCart();
    const item = cart.find((item) => item.id === itemId);

    if (item) {
      item.quantity += change;
      if (item.quantity <= 0) {
        removeFromCart(itemId);
        return;
      }
      saveCart(cart);
      renderCartPage();
      updateCartSummary();
      showNotification(`Quantity updated`);
    }
  }

  function removeFromCart(itemId) {
    let cart = getCart();
    const item = cart.find((item) => item.id === itemId);
    cart = cart.filter((item) => item.id !== itemId);
    saveCart(cart);
    renderCartPage();
    updateCartSummary();
    if (item) {
      showNotification(`${item.name} removed from cart`);
    }
  }

  function updateItemsCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const itemsCountElement = document.getElementById("itemsCount");
    if (itemsCountElement) {
      itemsCountElement.textContent = `${totalItems} item${
        totalItems !== 1 ? "s" : ""
      } in your cart`;
    }
  }

  function updateCartSummary() {
    const cart = getCart();
    const subtotal = cart.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0
    );
    const shipping = cart.length > 0 ? 50 : 0;
    const tax = Math.round(subtotal * 0.05);

    let discount = 0;
    if (appliedCoupon && coupons[appliedCoupon]) {
      discount = Math.round(subtotal * (coupons[appliedCoupon].discount / 100));
    }

    const total = subtotal + shipping + tax - discount;

    // Update elements if they exist
    const subtotalEl = document.getElementById("subtotal");
    const shippingEl = document.getElementById("shipping");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");
    const discountLine = document.getElementById("discountLine");
    const discountEl = document.getElementById("discount");

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (shippingEl)
      shippingEl.textContent = cart.length > 0 ? `₹${shipping}` : "Free";
    if (taxEl) taxEl.textContent = `₹${tax}`;
    if (totalEl) totalEl.textContent = `₹${total}`;

    if (discount > 0 && discountEl && discountLine) {
      discountEl.textContent = `-₹${discount}`;
      discountLine.style.display = "flex";
    } else if (discountLine) {
      discountLine.style.display = "none";
    }

    // Update checkout button
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
      if (cart.length === 0) {
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML =
          '<i class="fas fa-shopping-bag"></i> Cart is Empty';
      } else {
        checkoutBtn.disabled = false;
        checkoutBtn.innerHTML =
          '<i class="fas fa-lock"></i> Proceed to Checkout';
      }
    }
  }

  function applyCoupon() {
    const couponInput = document.getElementById("couponCode");
    if (couponInput) {
      const code = couponInput.value.trim().toUpperCase();
      applyCouponCode(code);
    }
  }

  function applyCouponCode(code) {
    const cart = getCart();
    if (cart.length === 0) {
      showNotification("Add items to cart before applying coupon");
      return;
    }

    if (coupons[code]) {
      appliedCoupon = code;
      const couponInput = document.getElementById("couponCode");
      if (couponInput) couponInput.value = code;
      updateCartSummary();
      showNotification(
        `Coupon ${code} applied! ${coupons[code].discount}% off`
      );
    } else {
      showNotification("Invalid coupon code");
    }
  }

  function proceedToCheckout() {
    const cart = getCart();
    if (cart.length === 0) {
      showNotification("Your cart is empty");
      return;
    }

    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
      const originalText = checkoutBtn.innerHTML;
      checkoutBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Processing...';
      checkoutBtn.disabled = true;

      setTimeout(() => {
        showNotification("Redirecting to checkout...");
        setTimeout(() => {
          checkoutBtn.innerHTML = originalText;
          checkoutBtn.disabled = false;
          // window.location.href = 'checkout.html';
        }, 2000);
      }, 1500);
    }
  }

  // Make functions available globally
  window.changeQuantity = changeQuantity;
  window.removeFromCart = removeFromCart;
  window.applyCoupon = applyCoupon;
  window.applyCouponCode = applyCouponCode;
  window.proceedToCheckout = proceedToCheckout;
} // ===================================================
// STEP 1: Add this to your main.js or create cart.js
// ===================================================

// Simple Cart Functions
function getCart() {
  try {
    return JSON.parse(localStorage.getItem("neyoCart") || "[]");
  } catch (e) {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem("neyoCart", JSON.stringify(cart));
  updateCartCount();
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);
  const cartCountElement = document.querySelector(".cart-count");

  if (cartCountElement) {
    cartCountElement.textContent = count;
    if (count === 0) {
      cartCountElement.style.display = "none";
    } else {
      cartCountElement.style.display = "flex";
    }
  }
}

function addToCart(productData) {
  const cart = getCart();
  const existingItem = cart.find((item) => item.id === productData.id);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({
      id: productData.id,
      name: productData.name,
      description: productData.description || "",
      price: productData.price,
      quantity: 1,
      image: productData.image || "default",
      benefits: productData.benefits || [],
    });
  }

  saveCart(cart);
  showNotification(`${productData.name} added to cart!`);
}

function showNotification(message) {
  // Remove existing notification
  const existingNotification = document.querySelector(".cart-notification");
  if (existingNotification) {
    existingNotification.remove();
  }

  // Create new notification
  const notification = document.createElement("div");
  notification.className = "cart-notification show";
  notification.textContent = message;
  notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: linear-gradient(135deg, #27ae60, #229954);
        color: #fff;
        padding: 15px 20px;
        border-radius: 10px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.2);
        z-index: 9999;
        font-size: 14px;
        font-weight: bold;
        transform: translateX(0);
        transition: transform 0.3s ease;
    `;

  document.body.appendChild(notification);

  // Remove after 3 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(300px)";
    setTimeout(() => notification.remove(), 300);
  }, 3000);
}

// ===================================================
// STEP 2: Update your best-seller.js or add to main.js
// ===================================================

document.addEventListener("DOMContentLoaded", function () {
  // Update cart count on page load
  updateCartCount();

  // Make cart icon clickable
  const cartIcon = document.querySelector(".cart-icon");
  if (cartIcon) {
    cartIcon.style.cursor = "pointer";
    cartIcon.addEventListener("click", function () {
      window.location.href = "cart.html";
    });
  }

  // Handle add to cart buttons
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation();

      // Get product data from the soap card
      const soapCard = this.closest(".soap-card");
      if (!soapCard) return;

      const name = soapCard.querySelector(".soap-name")?.textContent.trim();
      const description = soapCard
        .querySelector(".soap-description")
        ?.textContent.trim();
      const priceText = soapCard
        .querySelector(".soap-price")
        ?.textContent.trim();
      const price = parseInt(priceText.replace(/[^\d]/g, ""));
      const benefits = Array.from(soapCard.querySelectorAll(".benefit")).map(
        (el) => el.textContent.trim()
      );

      // Determine image class
      let image = "default";
      if (name && name.toLowerCase().includes("lemon")) image = "lemon";
      else if (name && name.toLowerCase().includes("aloe")) image = "aloe-vera";
      else if (name && name.toLowerCase().includes("rose")) image = "rose";
      else if (name && name.toLowerCase().includes("multani"))
        image = "multani-mitti";

      const productData = {
        id: name ? name.toLowerCase().replace(/[^a-z0-9]/g, "-") : "unknown",
        name: name || "Unknown Product",
        description: description || "",
        price: price || 0,
        image: image,
        benefits: benefits,
      };

      console.log("Adding to cart:", productData); // Debug log

      // Add visual feedback
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i> Added!';
      this.style.background = "#27ae60";

      // Add to cart
      addToCart(productData);

      // Reset button after 2 seconds
      setTimeout(() => {
        this.innerHTML = originalText;
        this.style.background = "";
      }, 2000);
    });
  });
});
