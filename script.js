"use strict";

/* =========================================================
   RINYMART — COMPLETE SHOPPING ENGINE
   ========================================================= */

const RinyMart = {

  cart: [],
  customer: null,
  products: [],
  toastTimer: null,

  init() {
    this.collectProducts();
    this.loadCustomer();
    this.loadCart();

    this.setupSearch();
    this.setupCart();
    this.setupCustomer();
    this.setupCategories();
    this.setupNavigation();
    this.setupButtons();
    this.setupProductButtons();

    this.generateRealQRCode();
    this.updateCart();
    this.updateLocation();
  },


  /* =======================================================
     PRODUCTS
     ======================================================= */

  collectProducts() {

    this.products = [
      ...document.querySelectorAll(".product-card")
    ].map((card, index) => {

      const name =
        card.querySelector("h3")?.textContent.trim() ||
        `Product ${index + 1}`;

      const priceText =
        card.querySelector(".product-price")
          ?.textContent || "0";

      const price =
        Number(
          priceText
            .replace(/[₹,]/g, "")
            .trim()
        ) || 0;

      const image =
        card.querySelector("img")?.src || "";

      return {
        id: index + 1,
        name,
        price,
        image,
        category:
          card.dataset.category || "Other",
        card
      };

    });

  },


  /* =======================================================
     SEARCH
     ======================================================= */

  setupSearch() {

    const input =
      document.getElementById("searchInput");

    const button =
      document.getElementById("searchButton");

    if (!input) return;

    const search = () => {

      const query =
        input.value.trim().toLowerCase();

      if (!query) {
        this.closeSearch();
        return;
      }

      this.showSearchResults(query);

    };

    input.addEventListener(
      "input",
      () => {

        if (input.value.trim().length >= 2) {
          search();
        }

      }
    );

    input.addEventListener(
      "keydown",
      event => {

        if (event.key === "Enter") {
          search();
        }

        if (event.key === "Escape") {
          this.closeSearch();
        }

      }
    );

    if (button) {
      button.addEventListener(
        "click",
        search
      );
    }

  },


  showSearchResults(query) {

    const panel =
      document.getElementById(
        "searchResults"
      );

    const grid =
      document.getElementById(
        "searchResultsGrid"
      );

    const title =
      document.getElementById(
        "searchTitle"
      );

    if (!panel || !grid) return;

    const results =
      this.products.filter(product =>
        product.name
          .toLowerCase()
          .includes(query) ||
        product.category
          .toLowerCase()
          .includes(query)
      );

    title.textContent =
      `Results for "${query}"`;

    grid.innerHTML = "";

    if (!results.length) {

      grid.innerHTML = `
        <div class="no-results">
          <h3>No products found</h3>
          <p>Try another search.</p>
        </div>
      `;

    } else {

      results.forEach(product => {

        grid.appendChild(
          this.createProductCard(product)
        );

      });

    }

    panel.classList.add("active");

  },


  createProductCard(product) {

    const card =
      document.createElement("article");

    card.className =
      "product-card";

    card.innerHTML = `

      <div class="product-image">

        <img
          src="${this.escapeAttribute(product.image)}"
          alt="${this.escapeHTML(product.name)}"
          loading="lazy"
        >

      </div>

      <div class="product-information">

        <span class="product-category">
          ${this.escapeHTML(product.category)}
        </span>

        <h3>
          ${this.escapeHTML(product.name)}
        </h3>

        <p class="product-size">
          Available now
        </p>

        <div class="product-rating">
          <span>4.8</span>
          <span class="rating-stars">★★★★★</span>
        </div>

        <div class="product-bottom">

          <strong class="product-price">
            ₹${product.price.toLocaleString("en-IN")}
          </strong>

          <button
            class="add-button"
            type="button"
          >
            Add
          </button>

        </div>

      </div>
    `;

    card
      .querySelector(".add-button")
      .addEventListener(
        "click",
        () => {

          this.addToCart(
            product.name,
            product.price,
            product.image
          );

        }
      );

    return card;

  },


  closeSearch() {

    document
      .getElementById("searchResults")
      ?.classList.remove("active");

  },


  /* =======================================================
     PRODUCT BUTTONS
     ======================================================= */

  setupProductButtons() {

    document
      .querySelectorAll(".product-card")
      .forEach(card => {

        const button =
          card.querySelector(".add-button");

        if (!button) return;

        button.addEventListener(
          "click",
          event => {

            event.stopPropagation();

            const product =
              this.products.find(
                item =>
                  item.card === card
              );

            if (!product) return;

            this.addToCart(
              product.name,
              product.price,
              product.image
            );

          }
        );

      });

  },


  /* =======================================================
     CART
     ======================================================= */

  setupCart() {

    document
      .getElementById("cartButton")
      ?.addEventListener(
        "click",
        () => this.openCart()
      );

    document
      .getElementById("closeCart")
      ?.addEventListener(
        "click",
        () => this.closeCart()
      );

  },


  addToCart(
    name,
    price,
    image
  ) {

    const existing =
      this.cart.find(
        item => item.name === name
      );

    if (existing) {

      existing.quantity++;

    } else {

      this.cart.push({
        name,
        price,
        image,
        quantity: 1
      });

    }

    this.saveCart();
    this.updateCart();

    this.showToast(
      "Added to cart",
      `${name} was added to your cart.`
    );

  },


  changeQuantity(
    name,
    amount
  ) {

    const item =
      this.cart.find(
        product =>
          product.name === name
      );

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

      this.cart =
        this.cart.filter(
          product =>
            product.name !== name
        );

    }

    this.saveCart();
    this.updateCart();

  },


  removeFromCart(name) {

    this.cart =
      this.cart.filter(
        item => item.name !== name
      );

    this.saveCart();
    this.updateCart();

  },


  updateCart() {

    const count =
      this.cart.reduce(
        (total, item) =>
          total + item.quantity,
        0
      );

    const subtotal =
      this.cart.reduce(
        (total, item) =>
          total +
          item.price *
          item.quantity,
        0
      );

    const delivery =
      subtotal > 0 ? 29 : 0;

    const total =
      subtotal + delivery;


    const countElement =
      document.getElementById(
        "cartCount"
      );

    if (countElement) {
      countElement.textContent =
        count;
    }


    const subtotalElement =
      document.getElementById(
        "cartSubtotal"
      );

    if (subtotalElement) {
      subtotalElement.textContent =
        subtotal.toLocaleString("en-IN");
    }


    const deliveryElement =
      document.getElementById(
        "cartDelivery"
      );

    if (deliveryElement) {
      deliveryElement.textContent =
        delivery.toLocaleString("en-IN");
    }


    const totalElement =
      document.getElementById(
        "cartGrandTotal"
      );

    if (totalElement) {
      totalElement.textContent =
        total.toLocaleString("en-IN");
    }


    const items =
      document.getElementById(
        "cartItems"
      );

    if (!items) return;


    if (!this.cart.length) {

      items.innerHTML = `
        <div class="empty-cart">

          <div class="empty-cart-icon"></div>

          <h3>
            Your cart is empty
          </h3>

          <p>
            Add something you love
            and it will appear here.
          </p>

        </div>
      `;

      return;

    }


    items.innerHTML = "";


    this.cart.forEach(item => {

      const row =
        document.createElement("div");

      row.className =
        "cart-item";


      row.innerHTML = `

        <img
          src="${this.escapeAttribute(item.image)}"
          alt="${this.escapeHTML(item.name)}"
        >

        <div class="cart-item-info">

          <strong>
            ${this.escapeHTML(item.name)}
          </strong>

          <span>
            ₹${item.price.toLocaleString("en-IN")}
          </span>

          <div class="quantity-controls">

            <button
              type="button"
              class="quantity-button"
              data-minus
            >
              −
            </button>

            <strong>
              ${item.quantity}
            </strong>

            <button
              type="button"
              class="quantity-button"
              data-plus
            >
              +
            </button>

            <button
              type="button"
              class="remove-cart-item"
              data-remove
            >
              Remove
            </button>

          </div>

        </div>
      `;


      row
        .querySelector("[data-minus]")
        .addEventListener(
          "click",
          () =>
            this.changeQuantity(
              item.name,
              -1
            )
        );


      row
        .querySelector("[data-plus]")
        .addEventListener(
          "click",
          () =>
            this.changeQuantity(
              item.name,
              1
            )
        );


      row
        .querySelector("[data-remove]")
        .addEventListener(
          "click",
          () =>
            this.removeFromCart(
              item.name
            )
        );


      items.appendChild(row);

    });

  },


  openCart() {

    document
      .getElementById("cartDrawer")
      ?.classList.add("active");

  },


  closeCart() {

    document
      .getElementById("cartDrawer")
      ?.classList.remove("active");

  },


  /* =======================================================
     CUSTOMER INFORMATION
     ======================================================= */

  setupCustomer() {

    const modal =
      document.getElementById(
        "customerModal"
      );

    const form =
      document.getElementById(
        "customerForm"
      );

    document
      .getElementById("accountButton")
      ?.addEventListener(
        "click",
        () =>
          modal?.classList.add(
            "active"
          )
      );


    document
      .getElementById("locationButton")
      ?.addEventListener(
        "click",
        () =>
          modal?.classList.add(
            "active"
          )
      );


    document
      .getElementById(
        "closeCustomerModal"
      )
      ?.addEventListener(
        "click",
        () =>
          modal?.classList.remove(
            "active"
          )
      );


    modal?.addEventListener(
      "click",
      event => {

        if (event.target === modal) {
          modal.classList.remove(
            "active"
          );
        }

      }
    );


    if (!form) return;


    form.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const name =
          document
            .getElementById(
              "customerName"
            )
            .value.trim();


        const phone =
          document
            .getElementById(
              "customerPhone"
            )
            .value
            .replace(/\D/g, "");


        const address =
          document
            .getElementById(
              "customerAddress"
            )
            .value.trim();


        const city =
          document
            .getElementById(
              "customerCity"
            )
            .value.trim();


        const pin =
          document
            .getElementById(
              "customerPin"
            )
            .value
            .replace(/\D/g, "");


        if (
          !name ||
          !address ||
          !city
        ) {

          this.showToast(
            "Missing information",
            "Please complete all delivery fields."
          );

          return;

        }


        if (
          !/^\d{10}$/.test(phone)
        ) {

          this.showToast(
            "Invalid mobile number",
            "Enter a valid 10-digit number."
          );

          return;

        }


        if (
          !/^\d{6}$/.test(pin)
        ) {

          this.showToast(
            "Invalid PIN code",
            "Enter a valid 6-digit PIN code."
          );

          return;

        }


        this.customer = {
          name,
          phone,
          address,
          city,
          pin
        };


        localStorage.setItem(
          "rinyMartCustomer",
          JSON.stringify(
            this.customer
          )
        );


        modal?.classList.remove(
          "active"
        );


        this.updateLocation();


        this.showToast(
          "Delivery details saved",
          `Ready to deliver to ${city}.`
        );

      }
    );

  },


  loadCustomer() {

    try {

      const saved =
        localStorage.getItem(
          "rinyMartCustomer"
        );

      if (saved) {
        this.customer =
          JSON.parse(saved);
      }

    } catch {
      this.customer = null;
    }

  },


  updateLocation() {

    const element =
      document.getElementById(
        "locationText"
      );

    if (!element) return;

    if (!this.customer) {

      element.textContent =
        "Add your location";

      return;

    }

    element.textContent =
      `${this.customer.city} ${this.customer.pin}`;

  },


  /* =======================================================
     CATEGORIES
     ======================================================= */

  setupCategories() {

    document
      .querySelectorAll(".category-card")
      .forEach(card => {

        card.addEventListener(
          "click",
          () => {

            const category =
              card.dataset.category;

            this.showCategory(
              category
            );

          }
        );

      });

  },


  showCategory(category) {

    const cards =
      document.querySelectorAll(
        "#products .product-card"
      );

    let found = 0;


    cards.forEach(card => {

      const match =
        card.dataset.category ===
        category;

      card.style.display =
        match ? "" : "none";

      if (match) found++;

    });


    document
      .getElementById("products")
      ?.scrollIntoView({
        behavior: "smooth"
      });


    this.showToast(
      category,
      found
        ? `${found} products available.`
        : "More products coming soon."
    );

  },


  /* =======================================================
     NAVIGATION
     ======================================================= */

  setupNavigation() {

    document
      .getElementById("homeButton")
      ?.addEventListener(
        "click",
        event => {

          event.preventDefault();

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });

        }
      );


    document
      .getElementById(
        "closeSearchResults"
      )
      ?.addEventListener(
        "click",
        () => this.closeSearch()
      );

  },


  /* =======================================================
     MAIN BUTTONS
     ======================================================= */

  setupButtons() {

    document
      .getElementById("shopNowButton")
      ?.addEventListener(
        "click",
        () => {

          document
            .getElementById("products")
            ?.scrollIntoView({
              behavior: "smooth"
            });

        }
      );


    document
      .getElementById("exploreButton")
      ?.addEventListener(
        "click",
        () => {

          document
            .getElementById("categories")
            ?.scrollIntoView({
              behavior: "smooth"
            });

        }
      );


    document
      .getElementById(
        "viewCategoriesButton"
      )
      ?.addEventListener(
        "click",
        () => {

          document
            .getElementById("categories")
            ?.scrollIntoView({
              behavior: "smooth"
            });

        }
      );


    /*
       FIXED:
       There is intentionally NO duplicate-ID
       dependency here.

       Both "View all" buttons are handled by
       selecting their class.
    */

    document
      .querySelectorAll(
        ".deals-section .primary-button, .products-section .text-button"
      )
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            document
              .querySelectorAll(
                "#products .product-card"
              )
              .forEach(card => {

                card.style.display = "";

              });


            document
              .getElementById("products")
              ?.scrollIntoView({
                behavior: "smooth"
              });

          }
        );

      });


    document
      .getElementById("checkoutButton")
      ?.addEventListener(
        "click",
        () => {

          if (!this.cart.length) {

            this.showToast(
              "Cart is empty",
              "Add products before checkout."
            );

            return;

          }


          if (!this.customer) {

            document
              .getElementById(
                "customerModal"
              )
              ?.classList.add(
                "active"
              );

            this.showToast(
              "Delivery details needed",
              "Enter your delivery details first."
            );

            return;

          }


          this.showToast(
            "Checkout ready",
            "Your order is ready for the next step."
          );

        }
      );

  },


  /* =======================================================
     REAL QR CODE
     ======================================================= */

  generateRealQRCode() {

    const container =
      document.getElementById(
        "qrCode"
      );

    if (!container) return;


    /*
      IMPORTANT:

      location.href automatically becomes the
      REAL deployed website address.

      Example:

      https://username.github.io/rinymart/

      Therefore the QR does not need a hard-coded
      fake URL.
    */

    const websiteURL =
      window.location.href;


    container.innerHTML = `

      <div class="qr-loading">
        Creating QR...
      </div>

    `;


    const script =
      document.createElement(
        "script"
      );


    script.src =
      "https://cdnjs.cloudflare.com/ajax/libs/qrcodejs/1.0.0/qrcode.min.js";


    script.onload = () => {

      container.innerHTML = "";


      new QRCode(
        container,
        {
          text: websiteURL,
          width: 96,
          height: 96,
          colorDark: "#111111",
          colorLight: "#ffffff",
          correctLevel:
            QRCode.CorrectLevel.H
        }
      );

    };


    script.onerror = () => {

      container.innerHTML = `

        <div class="qr-error">

          QR could not load.

          <button
            type="button"
            onclick="location.reload()"
          >
            Retry
          </button>

        </div>

      `;

    };


    document.head.appendChild(
      script
    );

  },


  /* =======================================================
     STORAGE
     ======================================================= */

  saveCart() {

    localStorage.setItem(
      "rinyMartCart",
      JSON.stringify(
        this.cart
      )
    );

  },


  loadCart() {

    try {

      const saved =
        localStorage.getItem(
          "rinyMartCart"
        );

      this.cart =
        saved
          ? JSON.parse(saved)
          : [];

    } catch {

      this.cart = [];

    }

  },


  /* =======================================================
     TOAST
     ======================================================= */

  showToast(
    title,
    message
  ) {

    const toast =
      document.getElementById(
        "toast"
      );

    if (!toast) return;


    const titleElement =
      document.getElementById(
        "toastTitle"
      );

    const messageElement =
      document.getElementById(
        "toastMessage"
      );


    if (titleElement) {
      titleElement.textContent =
        title;
    }


    if (messageElement) {
      messageElement.textContent =
        message;
    }


    toast.classList.add(
      "show"
    );


    clearTimeout(
      this.toastTimer
    );


    this.toastTimer =
      setTimeout(
        () => {

          toast.classList.remove(
            "show"
          );

        },
        3000
      );

  },


  /* =======================================================
     SAFETY
     ======================================================= */

  escapeHTML(value) {

    return String(value)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");

  },


  escapeAttribute(value) {

    return this.escapeHTML(value);

  }

};


/* =========================================================
   START
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    RinyMart.init();

  }
);
