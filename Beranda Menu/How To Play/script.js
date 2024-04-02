document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('.contoh-gambar-2');
    // console.log(images);
    images.forEach(img => img.classList.add('animated'));
});

const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            observer.unobserve(entry.target); // Berhenti memantau setelah animasi dipicu
        }
    });
});

document.addEventListener('DOMContentLoaded', function() {
    const img = document.querySelector('.contoh-gambar');
    observer.observe(img);
});
