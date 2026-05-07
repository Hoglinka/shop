const categories = [
    "2026г Новинки", "Браслеты, кулоны, бусы", "Брелоки", "Веера", "Весовая ракушка", 
    "Звезды, лангусты", "Зеркала", "Изделия из дерева", "Изделия из ракушек", 
    "Календари, карты", "Колокольчики", "Кружки, бокалы", "Магниты", "Наборы", 
    "Парусники, яхты", "Ракушки", "Сувениры", "Тарелки, пепельницы", 
    "Товары Анапа, Сочи", "Часы", "Прочие товары"
];

const products = [
    { id: 1, name: "Змея W24-20", cat: "2026г Новинки", price: 110, img: "https://thumb.cloud.mail.ru/weblink/thumb/xw1/J3MD/8PuhWxscH/2026%D0%B3%20%D0%9D%D0%BE%D0%B2%D0%B8%D0%BD%D0%BA%D0%B8/W%2024-20%20%D0%97%D0%BC%D0%B5%D1%8F.jpg" },
    { id: 2, name: "Браслет Морской", cat: "Браслеты, кулоны, бусы", price: 250, img: "https://thumb.cloud.mail.ru/weblink/thumb/xw1/J3MD/8PuhWxscH/2026%D0%B3%20%D0%9D%D0%BE%D0%B2%D0%B8%D0%BD%D0%BA%D0%B8/%D0%91%D1%80%D0%B0%D1%81%D0%BB%D0%B5%D1%82%20BR9.jpg" },
    { id: 3, name: "Часы Штурвал", cat: "Часы", price: 1200, img: "https://thumb.cloud.mail.ru/weblink/thumb/xw1/J3MD/8PuhWxscH/2026%D0%B3%20%D0%9D%D0%BE%D0%B2%D0%B8%D0%BD%D0%BA%D0%B8/W%2023-10%20%D0%9F%D0%B5%D1%81%D0%BE%D1%87%D0%BD%D1%8B%D0%B5%20%D1%87%D0%B0%D1%81%D1%8B.jpg" },
    { id: 4, name: "Сувенирный Якорь", cat: "Сувениры", price: 350, img: "https://via.placeholder.com/300?text=Anchor" }
];

let cart = [];
let selectedCategories = []; // Массив для выбранных категорий

function initCategories() {
    const bar = document.getElementById('category-bar');
    bar.innerHTML = '';
    categories.forEach(cat => {
        const label = document.createElement('label');
        label.className = 'category-item';
        label.innerHTML = `
            <input type="checkbox" value="${cat}" onchange="toggleCategory('${cat}', this)">
            <span>${cat}</span>
        `;
        bar.appendChild(label);
    });
}

function toggleCategory(cat, checkbox) {
    if (checkbox.checked) {
        selectedCategories.push(cat);
        checkbox.parentElement.classList.add('active');
    } else {
        selectedCategories = selectedCategories.filter(c => c !== cat);
        checkbox.parentElement.classList.remove('active');
    }
    renderProducts();
}

function resetFilters() {
    selectedCategories = [];
    document.querySelectorAll('.category-item input').forEach(i => i.checked = false);
    document.querySelectorAll('.category-item').forEach(i => i.classList.remove('active'));
    renderProducts();
}

function renderProducts() {
    const list = document.getElementById('product-list');
    
    // Если ничего не выбрано — показываем ВСЁ, если выбрано — фильтруем
    const filtered = selectedCategories.length === 0 
        ? products 
        : products.filter(p => selectedCategories.includes(p.cat));

    list.innerHTML = filtered.map(p => `
        <div class="product-card">
            <div class="img-container" onclick="openModal('${p.img}')">
                <img src="${p.img}" alt="${p.name}">
            </div>
            <div style="padding: 15px;">
                <h4 style="margin:0 0 5px 0;">${p.name}</h4>
                <p style="color:var(--primary-blue); font-weight:bold; margin-bottom:10px;">${p.price} ₽</p>
                <div style="display:flex; gap:5px;">
                    <input type="number" value="1" min="1" id="qty-${p.id}" style="width:40px; border:1px solid #ddd; border-radius:4px;">
                    <button class="btn blue-btn" onclick="addToCart(${p.id})">Добавить</button>
                </div>
            </div>
        </div>
    `).join('');
    
    if(!filtered.length) list.innerHTML = '<p style="grid-column:1/-1; text-align:center; padding:50px; color:#999;">Ничего не найдено.</p>';
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const quantity = parseInt(document.getElementById(`qty-${productId}`).value) || 1;
    const existing = cart.find(item => item.id === productId);

    if (existing) existing.quantity += quantity;
    else cart.push({ ...product, quantity });

    updateCartUI();
}

function updateCartUI() {
    const cartList = document.getElementById('cart-items-list');
    const cartCount = document.getElementById('cart-count');
    const cartTotal = document.getElementById('cart-total');

    if (!cart.length) {
        cartList.innerHTML = '<p class="empty-msg">Корзина пуста</p>';
    } else {
        cartList.innerHTML = cart.map(item => `
            <div class="cart-item">
                <img src="${item.img}">
                <div class="cart-item-info"><b>${item.name}</b><br>${item.quantity} шт. x ${item.price} ₽</div>
                <div style="font-weight:bold;">${item.quantity * item.price} ₽</div>
            </div>
        `).join('');
    }
    cartTotal.innerText = cart.reduce((s, i) => s + (i.price * i.quantity), 0).toLocaleString();
    cartCount.innerText = cart.reduce((s, i) => s + i.quantity, 0);
}

function toggleCartDisplay() { document.getElementById('cart-dropdown').classList.toggle('active'); }
function openModal(src) { document.getElementById('photo-modal').style.display = "flex"; document.getElementById('full-img').src = src; }
function closeModal() { document.getElementById('photo-modal').style.display = "none"; }

document.addEventListener('DOMContentLoaded', () => {
    initCategories();
    renderProducts();
});
