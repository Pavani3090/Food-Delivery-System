// Swiper
var swiper = new Swiper(".mySwiper", {
    loop: true,
    slidesPerView: 1,
    spaceBetween: 20,
    navigation: {
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
    },
});

// CART TOGGLE
const cartIcon = document.querySelector(".cart-icon");
const cartTab = document.querySelector(".cart-tab");
const closeBtn = document.querySelector(".close-btn");
const cardList = document.querySelector(".card-list");
const cartList = document.querySelector(".cart-list");
const cartTotal = document.querySelector(".cart-total");
const cartValue = document.querySelector(".cart-value");

// GLOBAL ARRAYS
let productList = [];
let cart = [];

// LOAD CART FROM LOCAL STORAGE
function loadCart() {
    const saved = localStorage.getItem("cart");
    if (saved) {
        cart = JSON.parse(saved);
        updateCartUI();
    }
}

function saveCart() {
    localStorage.setItem("cart", JSON.stringify(cart));
}

// ------------------------- PRODUCT CARDS -------------------------
function showCards() {
    cardList.innerHTML = "";

    productList.forEach(product => {
        const elem = document.createElement("div");
        elem.className = "order-card";

        elem.innerHTML = `
            <div class="card-image">
                <img src="${product.image}">
            </div>

            <h4>${product.name}</h4>
            <h4 class="price">$${product.price}</h4>

            <a href="#" class="btn add-btn">Add to Cart</a>
        `;

        elem.querySelector(".add-btn").addEventListener("click", (e) => {
            e.preventDefault();
            addToCart(product);
        });

        cardList.appendChild(elem);
    });
}

// ------------------------- CART FUNCTIONS -------------------------
function addToCart(product) {
    let item = cart.find(x => x.id === product.id);

    if (item) {
        item.qty++;
    } else {
        cart.push({ ...product, qty: 1 });
    }

    saveCart();
    updateCartUI();
}

function changeQty(id, amount) {
    let item = cart.find(x => x.id === id);

    if (!item) return;

    item.qty += amount;

    if (item.qty <= 0) {
        cart = cart.filter(x => x.id !== id);
    }

    saveCart();
    updateCartUI();
}

function updateCartUI() {
    cartList.innerHTML = "";
    let total = 0;
    let count = 0;

    cart.forEach(item => {
        total += item.qty * item.price;
        count += item.qty;

        const row = document.createElement("div");
        row.className = "item";

        row.innerHTML = `
            <div class="item-image">
                <img src="${item.image}">
            </div>

            <div class="detail">
                <h4>${item.name}</h4>
                <h4 class="item-total">$${item.price * item.qty}</h4>
            </div>

            <div class="flex">
                <button class="quantity-btn minus">-</button>
                <h4 class="quantity-value">${item.qty}</h4>
                <button class="quantity-btn plus">+</button>
            </div>
        `;

        row.querySelector(".minus").addEventListener("click", () => changeQty(item.id, -1));
        row.querySelector(".plus").addEventListener("click", () => changeQty(item.id, +1));

        cartList.appendChild(row);
    });

    cartTotal.textContent = "$" + total.toFixed(2);
    cartValue.textContent = count;
}

// ------------------------- INIT -------------------------
function initApp() {
    loadCart();

    fetch("products.json")
        .then(res => res.json())
        .then(data => {
            productList = data;
            showCards();
        });
}

initApp();

// CART OPEN/CLOSE
cartIcon.addEventListener("click", () => cartTab.classList.add("cart-tab-active"));
closeBtn.addEventListener("click", () => cartTab.classList.remove("cart-tab-active"));
