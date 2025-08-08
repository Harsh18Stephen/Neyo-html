// ===========================================
// CART MANAGEMENT SYSTEM
// Add this to your main.js or create a separate cart.js file
// ===========================================

class CartManager {
  constructor() {
    this.storageKey = "neyoNaturalsCart";
    this.cart = this.loadCart();
    this.updateCartUI();
  }

  // Load cart from localStorage
  loadCart() {
    try {
      const savedCart = localStorage.getItem(this.storageKey);
      return savedCart ? JSON.parse(savedCart) : [];
    } catch (error) {
      console.error("Error loading cart:", error);
      return [];
    }
  }

  // Save cart to localStorage
  saveCart() {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(this.cart));
      this.updateCartUI();
    } catch (error) {
      console.error("Error saving cart:", error);
    }
  }

  // Add item to cart
  addItem(product) {
    const existingItem = this.cart.find((item) => item.id === product.id);

    if (existingItem) {
      existingItem.quantity += product.quantity || 1;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        description: product.description,
        price: product.price,
        quantity: product.quantity || 1,
        image: product.image,
        benefits: product.benefits || [],
      });
    }

    this.saveCart();
    this.showNotification(`${product.name} added to cart!`, "success");
    return true;
  }

  // Remove item from cart
  removeItem(productId) {
    const itemIndex = this.cart.findIndex((item) => item.id === productId);
    if (itemIndex > -1) {
      const removedItem = this.cart[itemIndex];
      this.cart.splice(itemIndex, 1);
      this.saveCart();
      this.showNotification(`${removedItem.name} removed from cart`, "success");
      return true;
    }
    return false;
  }

  // Update item quantity
  updateQuantity(productId, newQuantity) {
    const item = this.cart.find((item) => item.id === productId);
    if (item && newQuantity > 0) {
      item.quantity = newQuantity;
      this.saveCart();
      return true;
    } else if (item && newQuantity <= 0) {
      return this.removeItem(productId);
    }
    return false;
  }

  // Get cart items
  getItems() {
    return this.cart;
  }

  // Get cart count
  getItemCount() {
    return this.cart.reduce((total, item) => total + item.quantity, 0);
  }

  // Get cart total
  getTotal() {
    return this.cart.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    );
  }

  // Clear cart
  clearCart() {
    this.cart = [];
    this.saveCart();
    this.showNotification("Cart cleared", "success");
  }

  // Update cart UI (cart count badge)
  updateCartUI() {
    const cartCountElement = document.querySelector(".cart-count");
    const count = this.getItemCount();

    if (cartCountElement) {
      cartCountElement.textContent = count;

      // Show/hide cart count badge
      if (count === 0) {
        cartCountElement.style.display = "none";
      } else {
        cartCountElement.style.display = "flex";
      }
    }
  }

  // Show notification
  showNotification(message, type = "success") {
    // Try to find existing notification element
    let notification = document.getElementById("cartNotification");

    // Create notification if it doesn't exist
    if (!notification) {
      notification = document.createElement("div");
      notification.id = "cartNotification";
      notification.className = "cart-notification";
      document.body.appendChild(notification);
    }

    // Set notification content and type
    notification.textContent = message;
    notification.className = `cart-notification ${type} show`;

    // Hide notification after 3 seconds
    setTimeout(() => {
      notification.classList.remove("show");
    }, 3000);
  }
}

// Initialize cart manager
const cartManager = new CartManager();

// ===========================================
// PRODUCT PAGE INTEGRATION
// ===========================================

// Function to add item to cart from product page
function addToCart(productData) {
  // Extract product data from button or page
  const product = {
    id: productData.id || generateProductId(productData.name),
    name: productData.name,
    description: productData.description,
    price: productData.price,
    quantity: productData.quantity || 1,
    image: productData.image,
    benefits: productData.benefits || [],
  };

  return cartManager.addItem(product);
}

// Generate product ID if not provided
function generateProductId(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "-")
    .replace(/-+/g, "-");
}

// ===========================================
// BEST SELLERS SECTION INTEGRATION
// Update your existing best-seller.js
// ===========================================

document.addEventListener("DOMContentLoaded", function () {
  // Make cart icon clickable
  const cartIcon = document.querySelector(".cart-icon");
  if (cartIcon) {
    cartIcon.style.cursor = "pointer";
    cartIcon.addEventListener("click", function () {
      window.location.href = "cart.html";
    });
  }

  // Handle add to cart buttons from best sellers section
  const addToCartButtons = document.querySelectorAll(".add-to-cart-btn");

  addToCartButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault();
      e.stopPropagation(); // Prevent card click if it exists

      // Get product data from the soap card
      const soapCard = this.closest(".soap-card");
      const productData = extractProductDataFromCard(soapCard);

      // Add visual feedback
      const originalText = this.innerHTML;
      this.innerHTML = '<i class="fas fa-check"></i> Added!';
      this.classList.add("added");

      // Add to cart
      addToCart(productData);

      // Reset button after 2 seconds
      setTimeout(() => {
        this.innerHTML = originalText;
        this.classList.remove("added");
      }, 2000);
    });
  });
});

// Extract product data from soap card
function extractProductDataFromCard(soapCard) {
  const name = soapCard.querySelector(".soap-name")?.textContent.trim();
  const description = soapCard
    .querySelector(".soap-description")
    ?.textContent.trim();
  const priceText = soapCard.querySelector(".soap-price")?.textContent.trim();
  const price = parseInt(priceText.replace(/[^\d]/g, ""));
  const benefits = Array.from(soapCard.querySelectorAll(".benefit")).map((el) =>
    el.textContent.trim()
  );

  // Determine image class from soap card
  let image = "default";
  if (name.toLowerCase().includes("lemon")) image = "lemon";
  else if (name.toLowerCase().includes("aloe")) image = "aloe-vera";
  else if (name.toLowerCase().includes("rose")) image = "rose";
  else if (name.toLowerCase().includes("multani")) image = "multani-mitti";

  return {
    id: generateProductId(name),
    name,
    description,
    price,
    quantity: 1,
    image,
    benefits,
  };
}

// ===========================================
// UPDATED CART PAGE JAVASCRIPT
// Replace the existing cart page JavaScript with this
// ===========================================

// Cart page specific functions
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
    renderCart();
    updateSummary();

    // Add fade-in animation
    const cartContainer = document.getElementById("cartContainer");
    if (cartContainer) {
      cartContainer.classList.add("fade-in");
    }
  });

  function renderCart() {
    const cartItemsList = document.getElementById("cartItemsList");
    const cartContainer = document.getElementById("cartContainer");
    const cartItems = cartManager.getItems();

    if (cartItems.length === 0) {
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
                        <button class="quantity-btn" onclick="updateCartQuantity('${
                          item.id
                        }', -1)" ${item.quantity <= 1 ? "disabled" : ""}>
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateCartQuantity('${
                          item.id
                        }', 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                    <button class="remove-btn" onclick="removeCartItem('${
                      item.id
                    }')" title="Remove item">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `
      )
      .join("");

    updateItemsCount();
  }

  function updateCartQuantity(itemId, change) {
    const cartItems = cartManager.getItems();
    const item = cartItems.find((item) => item.id === itemId);
    if (item) {
      const newQuantity = item.quantity + change;
      if (newQuantity > 0) {
        cartManager.updateQuantity(itemId, newQuantity);
        renderCart();
        updateSummary();
      }
    }
  }

  function removeCartItem(itemId) {
    cartManager.removeItem(itemId);
    renderCart();
    updateSummary();
  }

  function updateItemsCount() {
    const totalItems = cartManager.getItemCount();
    const itemsCountElement = document.getElementById("itemsCount");
    if (itemsCountElement) {
      itemsCountElement.textContent = `${totalItems} item${
        totalItems !== 1 ? "s" : ""
      } in your cart`;
    }
  }

  function updateSummary() {
    const cartItems = cartManager.getItems();
    const subtotal = cartManager.getTotal();
    const shipping = cartItems.length > 0 ? 50 : 0;
    const tax = Math.round(subtotal * 0.05); // 5% tax

    let discount = 0;
    if (appliedCoupon && coupons[appliedCoupon]) {
      const couponData = coupons[appliedCoupon];
      if (couponData.type === "percentage") {
        discount = Math.round(subtotal * (couponData.discount / 100));
      }
    }

    const total = subtotal + shipping + tax - discount;

    // Update DOM elements
    const subtotalEl = document.getElementById("subtotal");
    const shippingEl = document.getElementById("shipping");
    const taxEl = document.getElementById("tax");
    const totalEl = document.getElementById("total");

    if (subtotalEl) subtotalEl.textContent = `₹${subtotal}`;
    if (shippingEl)
      shippingEl.textContent = cartItems.length > 0 ? `₹${shipping}` : "Free";
    if (taxEl) taxEl.textContent = `₹${tax}`;
    if (totalEl) totalEl.textContent = `₹${total}`;

    // Show/hide discount line
    const discountLine = document.getElementById("discountLine");
    const discountEl = document.getElementById("discount");
    if (discount > 0 && discountEl && discountLine) {
      discountEl.textContent = `-₹${discount}`;
      discountLine.style.display = "flex";
    } else if (discountLine) {
      discountLine.style.display = "none";
    }

    // Update checkout button
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
      if (cartItems.length === 0) {
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

  // Coupon functions (keep existing ones)
  function applyCoupon() {
    const couponCode = document
      .getElementById("couponCode")
      ?.value.trim()
      .toUpperCase();
    if (couponCode) {
      applyCouponCode(couponCode);
    }
  }

  function applyCouponCode(code) {
    const cartItems = cartManager.getItems();
    if (cartItems.length === 0) {
      cartManager.showNotification(
        "Add items to cart before applying coupon",
        "error"
      );
      return;
    }

    if (coupons[code]) {
      appliedCoupon = code;
      const couponInput = document.getElementById("couponCode");
      if (couponInput) {
        couponInput.value = code;
      }
      updateSummary();
      cartManager.showNotification(
        `Coupon ${code} applied successfully! ${coupons[code].discount}% off`,
        "success"
      );
    } else {
      cartManager.showNotification("Invalid coupon code", "error");
    }
  }

  function proceedToCheckout() {
    const cartItems = cartManager.getItems();
    if (cartItems.length === 0) {
      cartManager.showNotification("Your cart is empty", "error");
      return;
    }

    // Add loading state
    const checkoutBtn = document.querySelector(".checkout-btn");
    if (checkoutBtn) {
      const originalText = checkoutBtn.innerHTML;
      checkoutBtn.innerHTML =
        '<i class="fas fa-spinner fa-spin"></i> Processing...';
      checkoutBtn.disabled = true;

      // Simulate checkout process
      setTimeout(() => {
        cartManager.showNotification("Redirecting to checkout...", "success");

        // Reset button after 2 seconds
        setTimeout(() => {
          checkoutBtn.innerHTML = originalText;
          checkoutBtn.disabled = false;
          // In a real app, you would redirect to checkout page here
          // window.location.href = 'checkout.html';
        }, 2000);
      }, 1500);
    }
  }

  // Make functions globally available for onclick handlers
  window.updateCartQuantity = updateCartQuantity;
  window.removeCartItem = removeCartItem;
  window.applyCoupon = applyCoupon;
  window.applyCouponCode = applyCouponCode;
  window.proceedToCheckout = proceedToCheckout;
}
