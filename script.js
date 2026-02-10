var PROJECT_ID = "8lc7ipc2"; 
var DATASET = "production";
var REQ_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=*[_type == "product"]{title, price, description, "imageUrl": image.asset->url}`;

var cart = JSON.parse(localStorage.getItem('glowup_cart')) || [];


window.addToCart = function(name, price) {
    cart.push({ name, price });
    localStorage.setItem('glowup_cart', JSON.stringify(cart));
    updateCartUI();
    if(event && event.target) {
        let b = event.target;
        let t = b.innerText;
        b.innerText = "Dodato ✓";
        setTimeout(() => b.innerText = t, 800);
    }
};

window.removeFromCart = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('glowup_cart', JSON.stringify(cart));
    updateCartUI();
};

function updateCartUI() {
    var count = document.getElementById('cart-count');
    var itemsDiv = document.getElementById('cart-items');
    var totalSpan = document.getElementById('total-price');
    if (count) count.innerText = cart.length;
    if (itemsDiv) {
        itemsDiv.innerHTML = cart.length === 0 ? `<p style="text-align:center; padding:20px; color:#888;">Korpa je prazna</p>` :
            cart.map((item, index) => `
                <div style="display:flex; justify-content:space-between; align-items:center; border-bottom:1px solid #333; padding:10px 0; color:white;">
                    <div><b>${item.name}</b><br><small style="color:#d4af37;">${item.price} RSD</small></div>
                    <button onclick="removeFromCart(${index})" style="background:none; border:none; color:red; font-size:24px; cursor:pointer; padding:0 10px;">&times;</button>
                </div>
            `).join('');
    }
    var total = cart.reduce((sum, item) => sum + item.price, 0);
    if (totalSpan) totalSpan.innerText = total.toLocaleString();
}


document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('cart-modal');
    var icon = document.getElementById('cart-icon');
    var close = document.querySelector('.close-modal');
    if (icon) icon.onclick = (e) => { e.preventDefault(); modal.style.display = "block"; updateCartUI(); };
    if (close) close.onclick = () => modal.style.display = "none";

    fetch(REQ_URL)
        .then(res => res.json())
        .then(({ result }) => {
            const bestsellerGrid = document.querySelector('.bestsellers-grid'); 
            const allProductsGrid = document.querySelector('.product-grid');    

            if (result) {
                
                if (bestsellerGrid) {
                    const bestsellers = result.filter(p => p.title.includes('*'));
                    bestsellerGrid.innerHTML = bestsellers.map(p => createHTML(p)).join('');
                }
                
                if (allProductsGrid) {
                    allProductsGrid.innerHTML = result.map(p => createHTML(p)).join('');
                }
            }
            updateCartUI();
        });
});

function createHTML(p) {

    var cleanTitle = p.title.replace('*', '').trim();
    return `
        <div class="product-card">
            <div class="product-image">
                <img src="${p.imageUrl || 'https://via.placeholder.com/400'}" alt="${cleanTitle}">
            </div>
            <div class="product-info">
                <h3>${cleanTitle}</h3>
                <span class="price">${p.price} RSD</span>
                <p class="product-description">${p.description || 'Premium formula.'}</p>
                <button class="buy-btn" onclick="addToCart('${cleanTitle}', ${p.price})">Dodaj u korpu</button>
            </div>
        </div>`;
}