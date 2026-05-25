
const products = [

    { id: 1, name: "Эфиопский кофе", price: 890, category: "coffee", image: "image/Gemini_Generated_Image_n4fjdin4fjdin4fj.png", link: "item1.html" },
    { id: 2, name: "Раф кофе", price: 250, category: "coffee", image: "image/1raf-kofe-raf.jpg", link: "item2.html" },
    { id: 3, name: "Капучино", price: 220, category: "coffee", image: "image/capuchino.jpg", link: "item3.html" },
    { id: 4, name: "Латте", price: 240, category: "coffee", image: "image/latte.jpg", link: "item4.html" },

    { id: 5, name: "Круассан с миндалем", price: 190, category: "pastry", image: "image/круасансминдалем.jpg", link: "item5.html" },
    { id: 6, name: "Шоколадный маффин", price: 160, category: "pastry", image: "image/maffinshokolad.jpg", link: "item6.html" },
    { id: 7, name: "Сырник с ягодами", price: 180, category: "pastry", image: "image/sirniksyagodami.jpg", link: "item7.html" }
];


let cart = [];
let currentCategory = "all";




const STORAGE_KEY = "cuptea_cart";


const saveCartToLocalStorage = () => {
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    console.log("Корзина сохранена в LocalStorage");
};


const loadCartFromLocalStorage = () => {
    const savedCart = localStorage.getItem(STORAGE_KEY);
    
    if (savedCart) {
        
        cart = JSON.parse(savedCart);
        console.log("Корзина загружена из LocalStorage", cart);
        
        renderCart();
    } else {
        console.log("Нет сохраненной корзины, начинаем с пустой");
        cart = [];
    }
};


const productsContainer = document.getElementById("products-container");
const cartItemsContainer = document.getElementById("cart-items");
const cartTotalElement = document.getElementById("cart-total");
const clearCartBtn = document.getElementById("clear-cart");
const checkoutBtn = document.getElementById("checkout");
const filterBtns = document.querySelectorAll(".filter-btn");




const addToCart = (product) => {
    cart.push(product);
    saveCartToLocalStorage(); 
    renderCart();
    console.log(`${product.name} добавлен в корзину!`);
};


const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId);
    saveCartToLocalStorage();  
    renderCart();
};


const calculateTotal = () => {
    return cart.reduce((total, item) => total + item.price, 0);
};


const renderCart = () => {
    cartItemsContainer.innerHTML = "";
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        cartTotalElement.textContent = "Итого: 0 ₽";
        return;
    }
    
    cart.forEach(item => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
            <div class="cart-item-info">
                <div class="cart-item-name">${item.name}</div>
                <div class="cart-item-price">${item.price} ₽</div>
            </div>
            <button class="remove-btn" data-id="${item.id}">Удалить</button>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    document.querySelectorAll(".remove-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const id = parseInt(btn.dataset.id);
            removeFromCart(id);
        });
    });
    
    const total = calculateTotal();
    cartTotalElement.textContent = `Итого: ${total} ₽`;
};


const clearCart = () => {
    if (cart.length === 0) {
        alert("Корзина уже пуста!");
        return;
    }
    cart = [];
    saveCartToLocalStorage();  
    renderCart();
    alert("Корзина очищена");
};


const checkout = () => {
    if (cart.length === 0) {
        alert("Корзина пуста! Добавьте товары перед оплатой.");
        return;
    }
    
    const total = calculateTotal();
    alert(`Покупка прошла успешно! Сумма: ${total} ₽. Спасибо за заказ!`);
    cart = [];
    saveCartToLocalStorage(); 
    renderCart();
};


const renderProducts = () => {
    productsContainer.innerHTML = "";
    
    const filteredProducts = currentCategory === "all" 
        ? products 
        : products.filter(product => product.category === currentCategory);
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<div style="text-align: center; width: 100%; padding: 50px;">Нет товаров в этой категории</div>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.className = "product-card";
        productCard.style.width = "calc(33.333% - 14px)";
        productCard.style.minWidth = "250px";
        productCard.style.textAlign = "center";
        productCard.innerHTML = `
            <a href="${product.link}">
                <img src="${product.image}" alt="${product.name}" width="200" height="150">
            </a>
            <h4>${product.name}</h4>
            <div class="price">${product.price} ₽</div>
            <button class="add-to-cart-btn" data-id="${product.id}">Добавить в корзину</button>
        `;
        productsContainer.appendChild(productCard);
    });
    
    document.querySelectorAll(".add-to-cart-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const productId = parseInt(btn.dataset.id);
            const productToAdd = products.find(p => p.id === productId);
            if (productToAdd) {
                addToCart(productToAdd);
            }
        });
    });
};


clearCartBtn.addEventListener("click", clearCart);
checkoutBtn.addEventListener("click", checkout);

filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");
        currentCategory = btn.dataset.category;
        renderProducts();
    });
});

loadCartFromLocalStorage();

renderProducts();