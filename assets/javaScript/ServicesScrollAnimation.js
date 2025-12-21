// ========== ANIMACIÓN DE SCROLL PARA TARJETAS MÓVILES ==========

// Función para animar las tarjetas cuando entran en viewport
function initScrollAnimations() {
    const cards = document.querySelectorAll('.service-card');
    
    // Configuración del Intersection Observer
    const observerOptions = {
        root: null, // viewport
        rootMargin: '0px',
        threshold: 0.15 // 15% visible para activar
    };
    
    // Callback cuando una tarjeta entra/sale del viewport
    const observerCallback = (entries, observer) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Añadir un pequeño delay entre tarjetas para efecto escalonado
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, index * 100); // 100ms de delay entre cada tarjeta
            }
        });
    };
    
    // Crear el observer
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    
    // Observar cada tarjeta
    cards.forEach(card => {
        observer.observe(card);
    });
}

// ========== DETECTAR CAMBIO DE TAMAÑO DE PANTALLA ==========
function checkScreenSize() {
    const isMobile = window.innerWidth <= 640;
    const desktopCircle = document.querySelector('.desktop-only');
    const mobileCards = document.querySelector('.mobile-cards');
    
    if (isMobile) {
        // Modo móvil
        if (desktopCircle) desktopCircle.style.display = 'none';
        if (mobileCards) mobileCards.style.display = 'flex';
        
        // Inicializar animaciones de scroll
        initScrollAnimations();
    } else {
        // Modo desktop
        if (desktopCircle) desktopCircle.style.display = 'flex';
        if (mobileCards) mobileCards.style.display = 'none';
    }
}

// ========== EJECUTAR AL CARGAR Y AL REDIMENSIONAR ==========
window.addEventListener('load', () => {
    checkScreenSize();
});

window.addEventListener('resize', () => {
    checkScreenSize();
});

// ========== SMOOTH SCROLL OPCIONAL ==========
// Si quieres que las tarjetas tengan un efecto de aparición más suave

// Agregar variaciones en el delay de aparición
document.addEventListener('DOMContentLoaded', () => {
    const cards = document.querySelectorAll('.service-card');
    
    cards.forEach((card, index) => {
        // Añadir delay personalizado a cada tarjeta
        card.style.transitionDelay = `${index * 0.1}s`;
    });
});

// ========== ANIMACIÓN ADICIONAL AL HACER SCROLL ==========
// Opcional: Efecto parallax suave en las tarjetas

let ticking = false;

function updateCardsOnScroll() {
    const cards = document.querySelectorAll('.service-card.visible');
    const scrollY = window.scrollY;
    
    cards.forEach((card, index) => {
        const cardTop = card.getBoundingClientRect().top;
        const cardCenter = cardTop + (card.offsetHeight / 2);
        const viewportCenter = window.innerHeight / 2;
        
        // Calcular distancia del centro
        const distance = Math.abs(cardCenter - viewportCenter);
        const maxDistance = window.innerHeight / 2;
        
        // Calcular escala (las tarjetas más cercanas al centro son ligeramente más grandes)
        const scale = 1 + (0.02 * (1 - distance / maxDistance));
        
        // Aplicar transformación sutil
        card.style.transform = `translateY(0) scale(${Math.min(scale, 1.02)})`;
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking && window.innerWidth <= 640) {
        window.requestAnimationFrame(updateCardsOnScroll);
        ticking = true;
    }
});

console.log('✅ Animaciones de scroll para tarjetas móviles cargadas');