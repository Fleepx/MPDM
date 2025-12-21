// ========== ANIMACIÓN AL HACER SCROLL (OPCIONAL) ==========
// Si quieres que las animaciones se activen solo cuando la sección sea visible

function initNosotrosScrollAnimation() {
    const nosotrosSection = document.getElementById('nosotros');
    
    if (!nosotrosSection) return;
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.3 // Se activa cuando el 30% de la sección es visible
    };
    
    const observerCallback = (entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    };
    
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(nosotrosSection);
}

// Inicializar al cargar la página
window.addEventListener('load', () => {
    initNosotrosScrollAnimation();
    console.log('✅ Animaciones de Nosotros inicializadas');
});

// ========== NOTA ==========
// Si NO quieres que las animaciones dependan del scroll,
// simplemente NO incluyas este archivo JavaScript.
// Las animaciones se ejecutarán automáticamente al cargar la página.