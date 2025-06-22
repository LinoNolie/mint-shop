document.querySelectorAll('.product-gallery').forEach(gallery => {
    const mainImage = gallery.querySelector('.main-image img');
    const magnifier = gallery.querySelector('.magnifier');
    const thumbnails = gallery.querySelectorAll('.thumbnail');

    // Thumbnail click handling
    thumbnails.forEach(thumb => {
        thumb.addEventListener('click', () => {
            mainImage.src = thumb.src;
            thumbnails.forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
        });
    });

    // Magnifier functionality
    mainImage.addEventListener('mousemove', (e) => {
        const bounds = mainImage.getBoundingClientRect();
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        const xPercent = Math.round(100 / bounds.width * x);
        const yPercent = Math.round(100 / bounds.height * y);

        magnifier.style.display = 'block';
        magnifier.style.left = e.pageX - 75 + 'px';
        magnifier.style.top = e.pageY - 75 + 'px';
        magnifier.style.backgroundImage = `url(${mainImage.src})`;
        magnifier.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
        magnifier.style.backgroundSize = `${bounds.width * 2}px ${bounds.height * 2}px`;
    });

    mainImage.addEventListener('mouseleave', () => {
        magnifier.style.display = 'none';
    });
});