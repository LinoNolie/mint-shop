document.addEventListener('DOMContentLoaded', async () => {
    // Load products
    try {
        const response = await fetch('products/product-data.json');
        const data = await response.json();
        renderProducts(data.products);
    } catch (error) {
        console.error('Error loading products:', error);
    }

    function renderProducts(products) {
        const productGrid = document.querySelector('.product-grid');
        productGrid.innerHTML = products.map(product => `
            <div class="product-card" data-category="${product.category}">
                <div class="product-gallery">
                    <div class="main-image">
                        <img src="./products/${product.images.main}" alt="${product.name}" class="magnifiable">
                        <div class="magnifier"></div>
                    </div>
                    <div class="thumbnail-container">
                        <img src="./products/${product.images.main}" alt="Front view" class="thumbnail active">
                        <img src="./products/${product.images.side}" alt="Side view" class="thumbnail">
                        <img src="./products/${product.images.angle}" alt="Angle view" class="thumbnail">
                    </div>
                </div>
                <div class="product-info">
                    <h3>${product.name}</h3>
                    <p class="price">€${product.price}</p>
                    <button class="add-to-cart">Add to Cart</button>
                </div>
            </div>
        `).join('');
    }

    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const products = document.querySelectorAll('.product-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            const filter = button.dataset.filter;
            
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            products.forEach(product => {
                if (filter === 'all' || product.dataset.category === filter) {
                    product.style.display = 'block';
                } else {
                    product.style.display = 'none';
                }
            });
        });
    });

    // Cart functionality
    const cartItems = [];
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', () => {
            const card = button.closest('.product-card');
            const name = card.querySelector('h3').textContent;
            const price = card.querySelector('.price').textContent;
            
            cartItems.push({ name, price });
            alert(`Added ${name} to cart`);
        });
    });
});