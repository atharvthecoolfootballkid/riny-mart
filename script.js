"use strict";

/* =========================================================
   RINYMART
   Main Application
   ========================================================= */

const RinyMart = {

  cart: [],
  customer: null,

  products: [],

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

    this.generateQRCode();

    this.updateCart();

  },


  /* =======================================================
     PRODUCT DATA
     ======================================================= */

  collectProducts() {

    const cards = document.querySelectorAll(".product-card");

    this.products = Array.from(cards).map((card, index) => {

      const image =
        card.querySelector("img")?.src || "";

      const name =
        card.querySelector("h3")?.textContent.trim() ||
        "Product";

      const category =
        card.dataset.category ||
        "General";

      const priceElement =
        card.querySelector(".product-price");

      const price =
        Number(
          priceElement?.textContent
            .replace(/[₹,]/g, "")
            .trim()
        ) || 0;

      return {
        id: index + 1,
        name,
        category,
        price,
        image
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

    if (!input || !button) return;

    const performSearch = () => {

      const query =
        input.value.trim().toLowerCase();

      if (!query) {

        this.showToast(
          "Search",
          "Type something to search."
        );

        return;
      }

      this.showSearchResults(query);

    };

    button.addEventListener(
      "click",
      performSearch
    );

    input.addEventListener(
      "keydown",
      event => {

        if (event.key === "Enter") {
          performSearch();
        }

      }
    );

  },


  showSearchResults(query) {

    const panel =
      document.getElementById("searchResults");

    const grid =
      document.getElementById("searchResultsGrid");

    const title =
      document.getElementById("searchTitle");

    if (!panel || !grid) return;

    const results =
      this.products.filter(product => {

        return (
          product.name
            .toLowerCase()
            .includes(query) ||

          product.category
            .toLowerCase()
            .includes(query)
        );

      });

    if (title) {

      title.textContent =
        `Results for "${query}"`;

    }

    grid.innerHTML = "";

    if (!results.length) {

      grid.innerHTML = `

        <div style="
          grid-column:1/-1;
          text-align:center;
          padding:80px 20px;
        ">

          <h3 style="font-size:22px;">
            No products found
          </h3>

          <p style="
            margin-top:8px;
            color:#806f62;
            font-size:12px;
          ">
            Try another search.
          </p>

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
          src="${product.image}"
          alt="${this.escapeHTML(product.name)}"
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

          <span>4.7</span>

          <span class="rating-stars">
            ★★★★★
          </span>

        </div>

        <div class="product-bottom">

          <strong class="product-price">
            ₹${product.price.toLocaleString("en-IN")}
          </strong>

          <button
            class="add-button"
            data-product="${this.escapeAttribute(product.name)}"
            data-price="${product.price}"
          >
            Add
          </button>

        </div>

      </div>

    `;

    const addButton =
      card.querySelector(".add-button");

    addButton.addEventListener(
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


  /* =======================================================
     CART
     ======================================================= */

  setupCart() {

    document
      .querySelectorAll(".add-button")
      .forEach(button => {

        button.addEventListener(
          "click",
          () => {

            const name =
              button.dataset.product;

            const price =
              Number(button.dataset.price);

            const product =
              this.products.find(
                item => item.name === name
              );

            this.addToCart(
              name,
              price,
              product?.image || ""
            );

          }
        );

      });


    const cartButton =
      document.getElementById("cartButton");

    const closeCart =
      document.getElementById("closeCart");

    if (cartButton) {

      cartButton.addEventListener(
        "click",
        () => this.openCart()
      );

    }

    if (closeCart) {

      closeCart.addEventListener(
        "click",
        () => this.closeCart()
      );

    }

  },


  addToCart(name, price, image) {

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
      `${name} was added successfully.`
    );

  },


  removeFromCart(name) {

    this.cart =
      this.cart.filter(
        item => item.name !== name
      );

    this.saveCart();
    this.updateCart();

  },


  changeQuantity(name, amount) {

    const item =
      this.cart.find(
        product => product.name === name
      );

    if (!item) return;

    item.quantity += amount;

    if (item.quantity <= 0) {

      this.removeFromCart(name);
      return;

    }

    this.saveCart();
    this.updateCart();

  },


  updateCart() {

    const countElement =
      document.getElementById("cartCount");

    const totalElement =
      document.getElementById("cartTotal");

    const subtotalElement =
      document.getElementById("cartSubtotal");

    const grandTotalElement =
      document.getElementById("cartGrandTotal");

    const itemsElement =
      document.getElementById("cartItems");

    const totalQuantity =
      this.cart.reduce(
        (sum, item) =>
          sum + item.quantity,
        0
      );

    const subtotal =
      this.cart.reduce(
        (sum, item) =>
          sum + item.price * item.quantity,
        0
      );

    const delivery =
      subtotal > 0 ? 29 : 0;

    const grandTotal =
      subtotal + delivery;


    if (countElement) {

      countElement.textContent =
        totalQuantity;

    }

    if (totalElement) {

      totalElement.textContent =
        subtotal.toLocaleString("en-IN");

    }

    if (subtotalElement) {

      subtotalElement.textContent =
        subtotal.toLocaleString("en-IN");

    }

    if (grandTotalElement) {

      grandTotalElement.textContent =
        grandTotal.toLocaleString("en-IN");

    }


    if (!itemsElement) return;


    if (!this.cart.length) {

      itemsElement.innerHTML = `

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


    itemsElement.innerHTML = "";

    this.cart.forEach(item => {

      const row =
        document.createElement("div");

      row.style.cssText = `
        display:grid;
        grid-template-columns:64px 1fr;
        gap:12px;
        padding:13px 0;
        border-bottom:1px solid #eadfd3;
      `;

      row.innerHTML = `

        <img
          src="${item.image}"
          alt="${this.escapeHTML(item.name)}"
          style="
            width:64px;
            height:64px;
            object-fit:cover;
            border-radius:12px;
            background:#f5eee6;
          "
        >

        <div>

          <strong style="
            display:block;
            font-size:12px;
            line-height:1.4;
          ">
            ${this.escapeHTML(item.name)}
          </strong>

          <span style="
            display:block;
            margin-top:4px;
            font-size:12px;
            color:#e87524;
            font-weight:800;
          ">
            ₹${item.price.toLocaleString("en-IN")}
          </span>

          <div style="
            display:flex;
            align-items:center;
            gap:8px;
            margin-top:9px;
          ">

            <button
              class="quantity-button"
              data-action="minus"
              style="
                width:25px;
                height:25px;
                border-radius:7px;
                background:#f6eee7;
                font-weight:800;
              "
            >
              −
            </button>

            <strong style="
              min-width:15px;
              text-align:center;
              font-size:11px;
            ">
              ${item.quantity}
            </strong>

            <button
              class="quantity-button"
              data-action="plus"
              style="
                width:25px;
                height:25px;
                border-radius:7px;
                background:#f6eee7;
                font-weight:800;
              "
            >
              +
            </button>

            <button
              data-action="remove"
              style="
                margin-left:auto;
                background:transparent;
                color:#a25a32;
                font-size:10px;
                font-weight:700;
              "
            >
              Remove
            </button>

          </div>

        </div>

      `;


      row.querySelector(
        '[data-action="minus"]'
      ).addEventListener(
        "click",
        () =>
          this.changeQuantity(
            item.name,
            -1
          )
      );


      row.querySelector(
        '[data-action="plus"]'
      ).addEventListener(
        "click",
        () =>
          this.changeQuantity(
            item.name,
            1
          )
      );


      row.querySelector(
        '[data-action="remove"]'
      ).addEventListener(
        "click",
        () =>
          this.removeFromCart(
            item.name
          )
      );


      itemsElement.appendChild(row);

    });

  },


  openCart() {

    const drawer =
      document.getElementById("cartDrawer");

    if (drawer) {

      drawer.classList.add("active");

    }

  },


  closeCart() {

    const drawer =
      document.getElementById("cartDrawer");

    if (drawer) {

      drawer.classList.remove("active");

    }

  },


  /* =======================================================
     CUSTOMER DETAILS
     ======================================================= */

  setupCustomer() {

    const accountButton =
      document.getElementById("accountButton");

    const locationButton =
      document.getElementById("locationButton");

    const modal =
      document.getElementById("customerModal");

    const close =
      document.getElementById(
        "closeCustomerModal"
      );

    const form =
      document.getElementById(
        "customerForm"
      );


    const openModal = () => {

      if (modal) {

        modal.classList.add("active");

      }

    };


    if (accountButton) {

      accountButton.addEventListener(
        "click",
        openModal
      );

    }


    if (locationButton) {

      locationButton.addEventListener(
        "click",
        openModal
      );

    }


    if (close) {

      close.addEventListener(
        "click",
        () => {

          modal.classList.remove(
            "active"
          );

        }
      );

    }


    if (modal) {

      modal.addEventListener(
        "click",
        event => {

          if (
            event.target === modal
          ) {

            modal.classList.remove(
              "active"
            );

          }

        }
      );

    }


    if (!form) return;


    form.addEventListener(
      "submit",
      event => {

        event.preventDefault();


        const name =
          document.getElementById(
            "customerName"
          ).value.trim();

        const phone =
          document.getElementById(
            "customerPhone"
          ).value.trim();

        const address =
          document.getElementById(
            "customerAddress"
          ).value.trim();

        const city =
          document.getElementById(
            "customerCity"
          ).value.trim();

        const pin =
          document.getElementById(
            "customerPin"
          ).value.trim();


        if (!/^\d{10}$/.test(phone)) {

          this.showToast(
            "Check your number",
            "Enter a valid 10-digit mobile number."
          );

          return;

        }


        if (!/^\d{6}$/.test(pin)) {

          this.showToast(
            "Check your PIN code",
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


        this.updateLocation();


        modal.classList.remove(
          "active"
        );


        this.showToast(
          "Address saved",
          `We'll deliver to ${city}.`
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

        this.updateLocation();

      }

    } catch (error) {

      console.warn(
        "Could not load customer details."
      );

    }

  },


  updateLocation() {

    const element =
      document.getElementById(
        "locationText"
      );

    if (!element || !this.customer) {
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

            this.filterProducts(
              category
            );

          }
        );

      });

  },


  filterProducts(category) {

    const cards =
      document.querySelectorAll(
        ".product-card"
      );

    let found = 0;

    cards.forEach(card => {

      const matches =
        card.dataset.category ===
        category;

      card.style.display =
        matches ? "" : "none";

      if (matches) found++;

    });


    const productsSection =
      document.getElementById(
        "products"
      );

    if (productsSection) {

      productsSection.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });

    }


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

    const homeButton =
      document.getElementById(
        "homeButton"
      );

    if (homeButton) {

      homeButton.addEventListener(
        "click",
        event => {

          event.preventDefault();

          window.scrollTo({
            top: 0,
            behavior: "smooth"
          });

        }
      );

    }


    const closeSearch =
      document.getElementById(
        "closeSearchResults"
      );

    if (closeSearch) {

      closeSearch.addEventListener(
        "click",
        () => {

          document
            .getElementById(
              "searchResults"
            )
            .classList.remove(
              "active"
            );

        }
      );

    }

  },


  /* =======================================================
     BUTTONS
     ======================================================= */

  setupButtons() {

    const shopNow =
      document.getElementById(
        "shopNowButton"
      );

    const explore =
      document.getElementById(
        "exploreButton"
      );

    const viewCategories =
      document.getElementById(
        "viewCategoriesButton"
      );

    const viewProducts =
      document.getElementById(
        "viewAllProducts"
      );

    const checkout =
      document.getElementById(
        "checkoutButton"
      );


    if (shopNow) {

      shopNow.addEventListener(
        "click",
        () => {

          document
            .getElementById(
              "products"
            )
            ?.scrollIntoView({
              behavior: "smooth"
            });

        }
      );

    }


    if (explore) {

      explore.addEventListener(
        "click",
        () => {

          document
            .getElementById(
              "categories"
            )
            ?.scrollIntoView({
              behavior: "smooth"
            });

        }
      );

    }


    if (viewCategories) {

      viewCategories.addEventListener(
        "click",
        () => {

          document
            .getElementById(
              "categories"
            )
            ?.scrollIntoView({
              behavior: "smooth"
            });

        }
      );

    }


    if (viewProducts) {

      viewProducts.addEventListener(
        "click",
        () => {

          document
            .querySelectorAll(
              ".product-card"
            )
            .forEach(
              card =>
                card.style.display = ""
            );

          document
            .getElementById(
              "products"
            )
            ?.scrollIntoView({
              behavior: "smooth"
            });

        }
      );

    }


    if (checkout) {

      checkout.addEventListener(
        "click",
        () => {

          if (!this.cart.length) {

            this.showToast(
              "Your cart is empty",
              "Add products before checking out."
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
              "Add your delivery information first."
            );

            return;

          }


          this.showToast(
            "Checkout ready",
            "Your order details are ready."
          );

        }
      );

    }

  },


  /* =======================================================
     QR CODE
     ======================================================= */

  generateQRCode() {

    const container =
      document.getElementById(
        "qrCode"
      );

    if (!container) return;


    /*
      We create a visual QR-style pattern here.

      For a production deployment, replace this with
      a QR library that encodes the actual GitHub Pages URL.
    */

    const placeholder =
      container.querySelector(
        ".qr-placeholder"
      );

    if (!placeholder) return;


    placeholder.innerHTML = "";


    const canvas =
      document.createElement(
        "canvas"
      );

    canvas.width = 70;
    canvas.height = 70;

    const context =
      canvas.getContext("2d");


    context.fillStyle = "#ffffff";

    context.fillRect(
      0,
      0,
      70,
      70
    );


    context.fillStyle = "#111111";


    const size = 4;


    for (
      let y = 0;
      y < 17;
      y++
    ) {

      for (
        let x = 0;
        x < 17;
        x++
      ) {

        const random =
          Math.random();

        if (random > 0.53) {

          context.fillRect(
            x * size,
            y * size,
            size,
            size
          );

        }

      }

    }


    this.drawQRCorner(
      context,
      0,
      0
    );

    this.drawQRCorner(
      context,
      48,
      0
    );

    this.drawQRCorner(
      context,
      0,
      48
    );


    placeholder.appendChild(
      canvas
    );

  },


  drawQRCorner(
    context,
    x,
    y
  ) {

    context.fillStyle =
      "#111111";

    context.fillRect(
      x,
      y,
      20,
      20
    );

    context.fillStyle =
      "#ffffff";

    context.fillRect(
      x + 4,
      y + 4,
      12,
      12
    );

    context.fillStyle =
      "#111111";

    context.fillRect(
      x + 7,
      y + 7,
      6,
      6
    );

  },


  /* =======================================================
     STORAGE
     ======================================================= */

  saveCart() {

    try {

      localStorage.setItem(
        "rinyMartCart",
        JSON.stringify(
          this.cart
        )
      );

    } catch (error) {

      console.warn(
        "Could not save cart."
      );

    }

  },


  loadCart() {

    try {

      const saved =
        localStorage.getItem(
          "rinyMartCart"
        );

      if (saved) {

        this.cart =
          JSON.parse(saved);

      }

    } catch (error) {

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

    const toastTitle =
      document.getElementById(
        "toastTitle"
      );

    const toastMessage =
      document.getElementById(
        "toastMessage"
      );


    if (!toast) return;


    if (toastTitle) {

      toastTitle.textContent =
        title;

    }


    if (toastMessage) {

      toastMessage.textContent =
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
     SECURITY HELPERS
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

    return this.escapeHTML(
      value
    );

  }

};


/* =========================================================
   START APP
   ========================================================= */

document.addEventListener(
  "DOMContentLoaded",
  () => {

    RinyMart.init();

  }
);
