/* =========================================================
   RINYMART — COMPLETE SHOPPING APP ENGINE
   ========================================================= */

const RinyMart = {
  products: [
    {
      id: 1,
      name: "Fresh Farm Milk",
      category: "Groceries",
      description: "1 litre full cream milk",
      price: 68,
      rating: 4.8,
      badge: "Fresh",
      visual: "milk"
    },
    {
      id: 2,
      name: "Classic Choco Cookies",
      category: "Snacks",
      description: "Crunchy chocolate chip cookies",
      price: 99,
      rating: 4.9,
      badge: "Popular",
      visual: "cookie"
    },
    {
      id: 3,
      name: "Stackable Storage Boxes",
      category: "Home",
      description: "Set of 3 multipurpose boxes",
      price: 299,
      rating: 4.7,
      badge: "Deal",
      visual: "storage"
    },
    {
      id: 4,
      name: "Creative Building Blocks",
      category: "Kids",
      description: "Colourful construction set",
      price: 449,
      rating: 4.8,
      badge: "Kids Pick",
      visual: "blocks"
    },
    {
      id: 5,
      name: "Fridge Magnet Collection",
      category: "Magnets",
      description: "Set of 6 decorative magnets",
      price: 149,
      rating: 4.6,
      badge: "New",
      visual: "magnets"
    },
    {
      id: 6,
      name: "Wireless Headphones",
      category: "Electronics",
      description: "Comfortable everyday headphones",
      price: 899,
      rating: 4.5,
      badge: "Top Rated",
      visual: "headphones"
    },
    {
      id: 7,
      name: "Premium Notebook Set",
      category: "Stationery",
      description: "3 ruled notebooks",
      price: 179,
      rating: 4.7,
      badge: "Value",
      visual: "stationery"
    },
    {
      id: 8,
      name: "Surprise Gift Box",
      category: "Gifts",
      description: "Beautiful ready-to-gift box",
      price: 399,
      rating: 4.8,
      badge: "Gift Pick",
      visual: "gift"
    },
    {
      id: 9,
      name: "Farm Fresh Apples",
      category: "Groceries",
      description: "1 kg premium apples",
      price: 159,
      rating: 4.8,
      badge: "Fresh",
      visual: "apples"
    },
    {
      id: 10,
      name: "Potato Chips",
      category: "Snacks",
      description: "Classic salted crispy chips",
      price: 45,
      rating: 4.6,
      badge: "Popular",
      visual: "chips"
    },
    {
      id: 11,
      name: "Soft Cotton Towels",
      category: "Home",
      description: "Set of 2 absorbent towels",
      price: 299,
      rating: 4.5,
      badge: "Value",
      visual: "towels"
    },
    {
      id: 12,
      name: "Colour Art Kit",
      category: "Kids",
      description: "Colours, pencils and drawing book",
      price: 249,
      rating: 4.8,
      badge: "Kids Pick",
      visual: "art"
    },
    {
      id: 13,
      name: "Travel Fridge Magnets",
      category: "Magnets",
      description: "Set of 5 travel-style magnets",
      price: 199,
      rating: 4.7,
      badge: "New",
      visual: "travelMagnets"
    },
    {
      id: 14,
      name: "Portable Bluetooth Speaker",
      category: "Electronics",
      description: "Compact wireless speaker",
      price: 699,
      rating: 4.6,
      badge: "Trending",
      visual: "speaker"
    },
    {
      id: 15,
      name: "Gel Pen Collection",
      category: "Stationery",
      description: "Pack of 10 smooth gel pens",
      price: 129,
      rating: 4.7,
      badge: "Popular",
      visual: "pens"
    },
    {
      id: 16,
      name: "Birthday Gift Pack",
      category: "Gifts",
      description: "Ready-to-gift birthday collection",
      price: 549,
      rating: 4.9,
      badge: "Best Seller",
      visual: "birthday"
    }
  ],

  cart: [],
  customer: null,
  selectedCategory: "All"
};


/* =========================================================
   DOM HELPERS
   ========================================================= */

const $ = (selector, parent = document) =>
  parent.querySelector(selector);

const $$ = (selector, parent = document) =>
  [...parent.querySelectorAll(selector)];


/* =========================================================
   STORAGE
   ========================================================= */

function loadData() {
  try {
    const savedCart = localStorage.getItem("rinyMartCart");
    const savedCustomer = localStorage.getItem("rinyMartCustomer");

    if (savedCart) {
      RinyMart.cart = JSON.parse(savedCart);
    }

    if (savedCustomer) {
      RinyMart.customer = JSON.parse(savedCustomer);
    }
  } catch (error) {
    console.warn("RinyMart storage could not be loaded.");
  }
}

function saveCart() {
  localStorage.setItem(
    "rinyMartCart",
    JSON.stringify(RinyMart.cart)
  );
}

function saveCustomer() {
  localStorage.setItem(
    "rinyMartCustomer",
    JSON.stringify(RinyMart.customer)
  );
}


/* =========================================================
   PRODUCT VISUALS
   ========================================================= */

function productVisual(type) {

  const visuals = {

    milk: `
      <div class="product-visual milk-visual">
        <div class="milk-bottle">
          <div class="milk-cap"></div>
          <div class="milk-label">FRESH<br>MILK</div>
        </div>
      </div>
    `,

    cookie: `
      <div class="product-visual cookie-visual">
        <div class="big-cookie"></div>
      </div>
    `,

    storage: `
      <div class="product-visual storage-visual">
        <div class="storage-box box-one"></div>
        <div class="storage-box box-two"></div>
        <div class="storage-box box-three"></div>
      </div>
    `,

    blocks: `
      <div class="product-visual blocks-visual">
        <div class="block block-one"></div>
        <div class="block block-two"></div>
        <div class="block block-three"></div>
        <div class="block block-four"></div>
      </div>
    `,

    magnets: `
      <div class="product-visual magnets-visual">
        <div class="mini-magnet">R</div>
        <div class="mini-magnet">+</div>
        <div class="mini-magnet">★</div>
        <div class="mini-magnet">M</div>
      </div>
    `,

    headphones: `
      <div class="product-visual headphones-visual">
        <div class="headphone-band"></div>
        <div class="headphone-left"></div>
        <div class="headphone-right"></div>
      </div>
    `,

    stationery: `
      <div class="product-visual stationery-visual">
        <div class="notebook"></div>
        <div class="pencil"></div>
      </div>
    `,

    gift: `
      <div class="product-visual gift-visual">
        <div class="gift"></div>
      </div>
    `,

    apples: `
      <div class="product-visual" style="background:#e4eddc;">
        <div class="category-object vegetable-one"></div>
        <div class="category-object vegetable-two"></div>
        <div class="category-object vegetable-four"></div>
      </div>
    `,

    chips: `
      <div class="product-visual" style="background:#f5dfbd;">
        <div class="snack-shape snack-one"></div>
        <div class="snack-shape snack-two"></div>
        <div class="snack-shape snack-three"></div>
      </div>
    `,

    towels: `
      <div class="product-visual" style="background:#e4ddd7;">
        <div style="
          width:125px;
          height:90px;
          border-radius:18px;
          background:#d9a477;
          box-shadow:0 14px 20px rgba(0,0,0,.12);
        "></div>
        <div style="
          position:absolute;
          width:125px;
          height:90px;
          border-radius:18px;
          background:#8da5a2;
          transform:translate(35px,35px);
          box-shadow:0 14px 20px rgba(0,0,0,.12);
        "></div>
      </div>
    `,

    art: `
      <div class="product-visual" style="background:#e7e2f1;">
        <div style="
          width:120px;
          height:150px;
          background:#fff;
          border-radius:12px;
          box-shadow:0 14px 20px rgba(0,0,0,.12);
          position:relative;
        ">
          <div style="
            position:absolute;
            width:28px;
            height:28px;
            border-radius:50%;
            background:#e2755e;
            left:18px;
            top:22px;
          "></div>
          <div style="
            position:absolute;
            width:28px;
            height:28px;
            border-radius:50%;
            background:#6d8fc2;
            left:56px;
            top:50px;
          "></div>
          <div style="
            position:absolute;
            width:28px;
            height:28px;
            border-radius:50%;
            background:#efc650;
            left:30px;
            top:90px;
          "></div>
        </div>
      </div>
    `,

    travelMagnets: `
      <div class="product-visual" style="background:#dfe8e8;">
        <div class="mini-magnet" style="left:30px;top:50px;color:#d76c58;">M</div>
        <div class="mini-magnet" style="left:100px;top:30px;color:#6586a1;">+</div>
        <div class="mini-magnet" style="left:165px;top:70px;color:#6c956b;">R</div>
      </div>
    `,

    speaker: `
      <div class="product-visual" style="background:#dce6e7;">
        <div style="
          width:150px;
          height:82px;
          border-radius:24px;
          background:#3d464b;
          box-shadow:0 15px 25px rgba(0,0,0,.18);
          position:relative;
        ">
          <div style="
            position:absolute;
            width:48px;
            height:48px;
            border-radius:50%;
            background:#69767a;
            left:19px;
            top:17px;
          "></div>
          <div style="
            position:absolute;
            width:48px;
            height:48px;
            border-radius:50%;
            background:#69767a;
            right:19px;
            top:17px;
          "></div>
        </div>
      </div>
    `,

    pens: `
      <div class="product-visual" style="background:#e9e2d8;">
        <div style="
          display:flex;
          gap:5px;
          align-items:flex-end;
          transform:rotate(-8deg);
        ">
          <i style="width:12px;height:120px;background:#e57559;border-radius:8px;"></i>
          <i style="width:12px;height:105px;background:#6689bd;border-radius:8px;"></i>
          <i style="width:12px;height:130px;background:#e9bd4e;border-radius:8px;"></i>
          <i style="width:12px;height:112px;background:#72946a;border-radius:8px;"></i>
          <i style="width:12px;height:122px;background:#9b70a3;border-radius:8px;"></i>
        </div>
      </div>
    `,

    birthday: `
      <div class="product-visual" style="background:#f1d9da;">
        <div class="gift"></div>
        <div style="
          position:absolute;
          width:80px;
          height:80px;
          border-radius:50%;
          background:#efc54f;
          top:27px;
          left:55px;
          opacity:.9;
        "></div>
      </div>
    `
  };

  return visuals[type] || `
    <div class="product-visual" style="background:#eee;">
      <div style="font-weight:900;">RINY</div>
    </div>
  `;
}


/* =========================================================
   PRODUCT CARD
   ========================================================= */

function createProductCard(product) {

  return `
    <article class="product-card" data-product-id="${product.id}">

      <div class="product-image">

        <span class="product-badge">
          ${product.badge}
        </span>

        ${productVisual(product.visual)}

      </div>

      <div class="product-details">

        <span class="product-category">
          ${product.category}
        </span>

        <h3>
          ${product.name}
        </h3>

        <p>
          ${product.description}
        </p>

        <div class="rating">
          <span>★★★★★</span>
          <strong>${product.rating}</strong>
        </div>

        <div class="product-footer">

          <strong class="product-price">
            ₹${product.price.toLocaleString("en-IN")}
          </strong>

          <button
            class="add-button"
            onclick="addToCart(${product.id})"
          >
            ADD
          </button>

        </div>

      </div>

    </article>
  `;
}


/* =========================================================
   RENDER PRODUCTS
   ========================================================= */

function renderProducts(products = RinyMart.products) {

  const grids = $$(".product-grid");

  grids.forEach(grid => {

    grid.innerHTML = products
      .map(createProductCard)
      .join("");

  });
}


/* =========================================================
   CART
   ========================================================= */

function addToCart(productId) {

  const product = RinyMart.products.find(
    item => item.id === productId
  );

  if (!product) return;

  const existing = RinyMart.cart.find(
    item => item.id === productId
  );

  if (existing) {
    existing.quantity += 1;
  } else {
    RinyMart.cart.push({
      id: product.id,
      quantity: 1
    });
  }

  saveCart();
  updateCartUI();

  showToast(
    "Added to cart",
    `${product.name} is now in your cart.`
  );
}


function removeFromCart(productId) {

  RinyMart.cart =
    RinyMart.cart.filter(item => item.id !== productId);

  saveCart();
  updateCartUI();
}


function changeQuantity(productId, amount) {

  const item = RinyMart.cart.find(
    cartItem => cartItem.id === productId
  );

  if (!item) return;

  item.quantity += amount;

  if (item.quantity <= 0) {
    removeFromCart(productId);
    return;
  }

  saveCart();
  updateCartUI();
}


function getCartProducts() {

  return RinyMart.cart.map(item => {

    const product = RinyMart.products.find(
      product => product.id === item.id
    );

    if (!product) return null;

    return {
      ...product,
      quantity: item.quantity
    };

  }).filter(Boolean);

}


function getCartCount() {

  return RinyMart.cart.reduce(
    (total, item) => total + item.quantity,
    0
  );
}


function getCartSubtotal() {

  return getCartProducts().reduce(
    (total, product) =>
      total + product.price * product.quantity,
    0
  );
}


function updateCartUI() {

  const count = getCartCount();
  const subtotal = getCartSubtotal();

  const cartCount = $(".cart-icon i");

  if (cartCount) {
    cartCount.textContent = count;
    cartCount.style.display = count > 0 ? "grid" : "none";
  }

  const cartItems = $(".cart-items");

  if (!cartItems) return;

  const products = getCartProducts();

  if (products.length === 0) {

    cartItems.innerHTML = `
      <div class="empty-cart">

        <div class="empty-cart-circle"></div>

        <h3>Your cart is empty</h3>

        <p>
          Add something you like and it will appear here.
        </p>

      </div>
    `;

  } else {

    cartItems.innerHTML = products.map(product => `

      <div class="cart-item">

        <div
          style="
            width:72px;
            height:72px;
            border-radius:13px;
            overflow:hidden;
            flex:0 0 72px;
          "
        >
          ${productVisual(product.visual)}
        </div>

        <div class="cart-item-info">

          <strong>
            ${product.name}
          </strong>

          <span>
            ₹${product.price.toLocaleString("en-IN")}
          </span>

          <div class="quantity-controls">

            <button
              class="quantity-button"
              onclick="changeQuantity(${product.id}, -1)"
            >
              −
            </button>

            <strong>
              ${product.quantity}
            </strong>

            <button
              class="quantity-button"
              onclick="changeQuantity(${product.id}, 1)"
            >
              +
            </button>

            <button
              class="remove-cart-item"
              onclick="removeFromCart(${product.id})"
            >
              REMOVE
            </button>

          </div>

        </div>

      </div>

    `).join("");

  }

  const subtotalElement = $("#cartSubtotal");
  const deliveryElement = $("#cartDelivery");
  const totalElement = $("#cartTotal");

  if (subtotalElement) {
    subtotalElement.textContent =
      `₹${subtotal.toLocaleString("en-IN")}`;
  }

  const delivery =
    subtotal === 0
      ? 0
      : subtotal >= 499
        ? 0
        : 39;

  if (deliveryElement) {
    deliveryElement.textContent =
      delivery === 0
        ? "FREE"
        : `₹${delivery}`;
  }

  if (totalElement) {
    totalElement.textContent =
      `₹${(subtotal + delivery).toLocaleString("en-IN")}`;
  }
}


/* =========================================================
   CART OPEN/CLOSE
   ========================================================= */

function openCart() {

  const drawer = $(".cart-drawer");

  if (drawer) {
    drawer.classList.add("active");
  }
}


function closeCart() {

  const drawer = $(".cart-drawer");

  if (drawer) {
    drawer.classList.remove("active");
  }
}


/* =========================================================
   CUSTOMER FORM
   ========================================================= */

function openCustomerForm() {

  const modal = $("#customerModal");

  if (!modal) return;

  modal.classList.add("active");

  const form = $("#customerForm");

  if (!form || !RinyMart.customer) return;

  Object.entries(RinyMart.customer).forEach(
    ([key, value]) => {

      const field = form.elements[key];

      if (field) {
        field.value = value;
      }

    }
  );
}


function closeCustomerForm() {

  const modal = $("#customerModal");

  if (modal) {
    modal.classList.remove("active");
  }
}


function handleCustomerSubmit(event) {

  event.preventDefault();

  const form = event.target;
  const data = new FormData(form);

  const customer = {
    name: data.get("name")?.trim() || "",
    phone: data.get("phone")?.trim() || "",
    email: data.get("email")?.trim() || "",
    address: data.get("address")?.trim() || "",
    city: data.get("city")?.trim() || "",
    pincode: data.get("pincode")?.trim() || ""
  };

  if (!customer.name ||
      !customer.phone ||
      !customer.address ||
      !customer.city ||
      !customer.pincode) {

    showToast(
      "Details needed",
      "Please complete the required delivery details."
    );

    return;
  }

  RinyMart.customer = customer;

  saveCustomer();

  closeCustomerForm();

  showToast(
    "Delivery details saved",
    `Ready for delivery to ${customer.city}.`
  );
}


/* =========================================================
   CHECKOUT
   ========================================================= */

function checkout() {

  const cart = getCartProducts();

  if (cart.length === 0) {

    showToast(
      "Your cart is empty",
      "Add some products before checking out."
    );

    return;
  }

  if (!RinyMart.customer) {

    closeCart();
    openCustomerForm();

    showToast(
      "Delivery details needed",
      "Enter your details before placing the order."
    );

    return;
  }

  const total =
    getCartSubtotal() +
    (getCartSubtotal() >= 499 ? 0 : 39);

  const orderNumber =
    "RINY-" +
    Math.floor(100000 + Math.random() * 900000);

  RinyMart.cart = [];

  saveCart();
  updateCartUI();
  closeCart();

  showToast(
    "Order ready",
    `${orderNumber} — total ₹${total.toLocaleString("en-IN")}`
  );
}


/* =========================================================
   SEARCH
   ========================================================= */

function searchProducts(query) {

  const clean = query
    .trim()
    .toLowerCase();

  if (!clean) {

    closeSearchResults();
    return;

  }

  const results = RinyMart.products.filter(product => {

    const searchable = [
      product.name,
      product.category,
      product.description,
      product.badge
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(clean);
  });

  renderSearchResults(results, query);
}


function renderSearchResults(results, query) {

  const overlay = $(".search-results");

  if (!overlay) return;

  overlay.classList.add("active");

  const title = $("#searchResultTitle");

  if (title) {
    title.textContent =
      `Results for "${query}"`;
  }

  const grid = $(".search-results-grid");

  if (!grid) return;

  if (results.length === 0) {

    grid.innerHTML = `
      <div class="no-results">

        <h3>No products found</h3>

        <p>
          Try another search such as cookies, magnets,
          stationery, gifts or electronics.
        </p>

      </div>
    `;

    return;
  }

  grid.innerHTML =
    results.map(createProductCard).join("");
}


function closeSearchResults() {

  const overlay = $(".search-results");

  if (overlay) {
    overlay.classList.remove("active");
  }
}


/* =========================================================
   CATEGORIES
   ========================================================= */

function filterCategory(category) {

  RinyMart.selectedCategory = category;

  if (category === "All") {

    renderProducts();

  } else {

    const filtered =
      RinyMart.products.filter(
        product =>
          product.category.toLowerCase() ===
          category.toLowerCase()
      );

    renderProducts(filtered);
  }

  const productSection = $("#products");

  if (productSection) {
    productSection.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });
  }
}


/* =========================================================
   TOAST
   ========================================================= */

let toastTimer;

function showToast(title, message) {

  const toast = $(".toast");

  if (!toast) return;

  const toastTitle = $(".toast strong", toast);
  const toastMessage = $(".toast span", toast);

  if (toastTitle) {
    toastTitle.textContent = title;
  }

  if (toastMessage) {
    toastMessage.textContent = message;
  }

  toast.classList.add("show");

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.classList.remove("show");
  }, 3500);
}


/* =========================================================
   CATEGORY BUTTONS
   ========================================================= */

function setupCategoryButtons() {

  $$(".category-card").forEach(button => {

    button.addEventListener("click", () => {

      const category =
        button.dataset.category ||
        button.querySelector("strong")?.textContent ||
        "All";

      filterCategory(category);

    });

  });
}


/* =========================================================
   HEADER ACTIONS
   ========================================================= */

function setupHeader() {

  const cartButton =
    document.querySelector('[data-action="cart"]');

  if (cartButton) {
    cartButton.addEventListener(
      "click",
      openCart
    );
  }

  const accountButton =
    document.querySelector('[data-action="account"]');

  if (accountButton) {
    accountButton.addEventListener(
      "click",
      openCustomerForm
    );
  }

  const deliveryButton =
    document.querySelector('[data-action="delivery"]');

  if (deliveryButton) {
    deliveryButton.addEventListener(
      "click",
      openCustomerForm
    );
  }
}


/* =========================================================
   SEARCH SETUP
   ========================================================= */

function setupSearch() {

  const form = $(".search-box");

  const input =
    $(".search-box input");

  if (!input) return;

  let timer;

  input.addEventListener("input", () => {

    clearTimeout(timer);

    timer = setTimeout(() => {

      searchProducts(input.value);

    }, 180);

  });

  if (form) {

    form.addEventListener("submit", event => {

      event.preventDefault();

      searchProducts(input.value);

    });

  }

  document.addEventListener("keydown", event => {

    if (
      event.key === "/" &&
      document.activeElement !== input
    ) {

      event.preventDefault();
      input.focus();

    }

    if (event.key === "Escape") {
      closeSearchResults();
      closeCart();
      closeCustomerForm();
    }

  });
}


/* =========================================================
   SMOOTH NAVIGATION
   ========================================================= */

function setupNavigation() {

  $$("[data-scroll]").forEach(button => {

    button.addEventListener("click", () => {

      const target =
        document.getElementById(
          button.dataset.scroll
        );

      if (target) {

        target.scrollIntoView({
          behavior: "smooth"
        });

      }

    });

  });

  $$("a[href^='#']").forEach(link => {

    link.addEventListener("click", event => {

      const id =
        link.getAttribute("href");

      if (!id || id === "#") return;

      const target =
        document.querySelector(id);

      if (!target) return;

      event.preventDefault();

      target.scrollIntoView({
        behavior: "smooth"
      });

    });

  });
}


/* =========================================================
   MODALS / CART EVENTS
   ========================================================= */

function setupOverlays() {

  const closeCartButton =
    $("#closeCart");

  if (closeCartButton) {
    closeCartButton.addEventListener(
      "click",
      closeCart
    );
  }

  const closeCustomerButton =
    $("#closeCustomerModal");

  if (closeCustomerButton) {
    closeCustomerButton.addEventListener(
      "click",
      closeCustomerForm
    );
  }

  const customerForm =
    $("#customerForm");

  if (customerForm) {

    customerForm.addEventListener(
      "submit",
      handleCustomerSubmit
    );

  }

  const checkoutButton =
    $("#checkoutButton");

  if (checkoutButton) {
    checkoutButton.addEventListener(
      "click",
      checkout
    );
  }

  const cartOverlay =
    $("#cartOverlay");

  if (cartOverlay) {

    cartOverlay.addEventListener(
      "click",
      closeCart
    );

  }

  const customerModal =
    $("#customerModal");

  if (customerModal) {

    customerModal.addEventListener(
      "click",
      event => {

        if (
          event.target === customerModal
        ) {
          closeCustomerForm();
        }

      }
    );

  }
}


/* =========================================================
   QR CODE
   ========================================================= */

function createQRCode() {

  const container =
    $("#qrCode");

  if (!container) return;

  const currentURL =
    window.location.href;

  /*
    QR generation uses a public QR image service.

    The encoded data is the actual current website URL,
    so scanning it opens this exact page.
  */

  const encoded =
    encodeURIComponent(currentURL);

  const image =
    document.createElement("img");

  image.alt =
    "Scan to open RinyMart";

  image.width = 96;
  image.height = 96;

  image.src =
    `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encoded}`;

  image.onload = () => {

    container.innerHTML = "";

    container.appendChild(image);

  };

  image.onerror = () => {

    container.innerHTML = `
      <div class="qr-loading">
        QR unavailable offline
      </div>
    `;

  };

  container.innerHTML = `
    <div class="qr-loading">
      Creating QR...
    </div>
  `;
}


/* =========================================================
   DELIVERY LOCATION
   ========================================================= */

function updateDeliveryDisplay() {

  const location =
    $(".delivery-location");

  if (!location) return;

  const city =
    location.querySelector(
      "[data-city]"
    );

  if (
    city &&
    RinyMart.customer &&
    RinyMart.customer.city
  ) {

    city.textContent =
      RinyMart.customer.city;

  }
}


/* =========================================================
   WELCOME STATE
   ========================================================= */

function showFirstVisitMessage() {

  const welcomed =
    localStorage.getItem(
      "rinyMartWelcomed"
    );

  if (welcomed) return;

  setTimeout(() => {

    showToast(
      "Welcome to RinyMart",
      "Fresh products, useful finds and gifts in one place."
    );

    localStorage.setItem(
      "rinyMartWelcomed",
      "true"
    );

  }, 1200);
}


/* =========================================================
   IMAGE-LIKE PRODUCT DETAILS
   ========================================================= */

function addDynamicProductStyles() {

  const style =
    document.createElement("style");

  style.textContent = `

    .product-visual {
      width:100%;
      height:100%;
    }

    .product-visual > * {
      box-sizing:border-box;
    }

    .cart-item .product-visual {
      min-width:72px;
      min-height:72px;
    }

    .cart-item .product-visual .big-cookie {
      width:48px;
      height:48px;
    }

    .cart-item .product-visual .milk-bottle {
      width:35px;
      height:55px;
    }

    .cart-item .product-visual .milk-cap {
      width:18px;
      height:7px;
      left:8px;
      top:-5px;
    }

    .cart-item .product-visual .milk-label {
      left:4px;
      right:4px;
      top:21px;
      padding:4px 1px;
      font-size:5px;
    }

    .cart-item .gift {
      transform:scale(.45);
    }

  `;

  document.head.appendChild(style);
}


/* =========================================================
   GLOBAL CLICK HANDLING
   ========================================================= */

function setupGlobalClicks() {

  document.addEventListener(
    "click",
    event => {

      const closeButton =
        event.target.closest(
          "[data-close-search]"
        );

      if (closeButton) {
        closeSearchResults();
      }

    }
  );
}


/* =========================================================
   INITIALIZE
   ========================================================= */

function initRinyMart() {

  loadData();

  addDynamicProductStyles();

  renderProducts();

  updateCartUI();

  setupCategoryButtons();

  setupHeader();

  setupSearch();

  setupNavigation();

  setupOverlays();

  setupGlobalClicks();

  updateDeliveryDisplay();

  createQRCode();

  showFirstVisitMessage();

  console.log(
    "RinyMart loaded successfully."
  );
}


/* =========================================================
   START
   ========================================================= */

if (
  document.readyState === "loading"
) {

  document.addEventListener(
    "DOMContentLoaded",
    initRinyMart
  );

} else {

  initRinyMart();

}


/* =========================================================
   PUBLIC API
   ========================================================= */

window.RinyMart = RinyMart;

window.addToCart = addToCart;
window.removeFromCart = removeFromCart;
window.changeQuantity = changeQuantity;
window.openCart = openCart;
window.closeCart = closeCart;
window.openCustomerForm = openCustomerForm;
window.closeCustomerForm = closeCustomerForm;
window.checkout = checkout;
window.searchProducts = searchProducts;
window.filterCategory = filterCategory;
window.showToast = showToast;
