var PROJECT_ID = "8lc7ipc2"; 
var DATASET = "production";
var REQ_URL = `https://${PROJECT_ID}.api.sanity.io/v2021-10-21/data/query/${DATASET}?query=*[_type == "product"]{title, price, "imageUrl": image.asset->url}`;

// Inicijalizacija korpe
var cart = JSON.parse(localStorage.getItem('glowup_cart')) || [];

// Funkcija za dodavanje u korpu
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

// Funkcija za brisanje iz korpe
window.removeFromCart = function(index) {
    cart.splice(index, 1);
    localStorage.setItem('glowup_cart', JSON.stringify(cart));
    updateCartUI();
};

// Ažuriranje izgleda korpe
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

// Glavne kontrole kada se stranica učita
document.addEventListener('DOMContentLoaded', function() {
    var modal = document.getElementById('cart-modal');
    var icon = document.getElementById('cart-icon');
    var close = document.querySelector('.close-modal');

    // OTVARANJE KORPE I SKRIVANJE GRIDA
    if (icon) {
        icon.onclick = function(e) {
            e.preventDefault();
            if (modal) {
                modal.style.display = "block";
                document.body.classList.add('cart-open'); // Ključno za nestajanje grida
                updateCartUI();
            }
        }
    }

    // ZATVARANJE KORPE I VRAĆANJE GRIDA
    if (close) {
        close.onclick = function() {
            if (modal) modal.style.display = "none";
            document.body.classList.remove('cart-open'); // Vraća grid
        }
    }

    // Zatvaranje klikom van modala
    window.onclick = function(e) {
        if (e.target == modal) {
            modal.style.display = "none";
            document.body.classList.remove('cart-open');
        }
    };

    // UČITAVANJE PROIZVODA IZ SANITY-JA
    fetch(REQ_URL).then(res => res.json()).then(({result}) => {
        // Tražimo bilo koji grid (products-grid ili product-grid)
        var container = document.querySelector('.product-grid') || document.querySelector('.products-grid');
        if(container) {
            container.innerHTML = result.map(p => `
                <div class="product-card">
                    <img src="${p.imageUrl || 'https://via.placeholder.com/150'}" style="width:100%; height:200px; object-fit:cover; border-radius:8px;">
                    <h3>${p.title}</h3>
                    <p style="color:#d4af37; font-weight:bold;">${p.price} RSD</p>
                    <button class="buy-btn" onclick="addToCart('${p.title}', ${p.price})">Dodaj u korpu</button>
                </div>
            `).join('');
        }
    });

    updateCartUI();
});