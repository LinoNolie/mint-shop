document.querySelectorAll('.product-card button').forEach(button => {
    button.addEventListener('click', () => {
        const product = button.parentElement;
        const productName = product.querySelector('h3').textContent;
        alert(`Added ${productName} to cart!`);
    });
});
