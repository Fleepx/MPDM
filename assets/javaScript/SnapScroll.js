// ========== SCROLL SNAP: HERO ↔ SOLUCIONES (CON OFFSET PARA NAVBAR) ==========

document.addEventListener('DOMContentLoaded', () => {
    const heroSection = document.getElementById('hero');
    const solucionesSection = document.getElementById('services'); // Ajusta el ID si es necesario
    
    if (!heroSection || !solucionesSection) {
        console.warn('⚠️ No se encontraron las secciones Hero o Soluciones');
        return;
    }
    
    // ========== CONFIGURACIÓN ==========
    const CONFIG = {
        // Cantidad mínima de scroll para activar el snap (en píxeles)
        scrollThreshold: 50, // ← AJUSTA ESTE VALOR (30-100 recomendado)
        
        // Zona de activación (porcentaje de la altura del Hero)
        triggerZoneStart: 0.02,  // ← Inicio de zona de snap
        triggerZoneEnd: 0.1,     // ← Fin de zona de snap
        
        // ✅ OFFSET PARA NAVBAR (píxeles)
        navbarOffset: 110, // ← AJUSTA: Espacio para el navbar (110px recomendado)
        
        // Duración de la animación de scroll (milisegundos)
        scrollDuration: 1200,
        
        // Tiempo de espera antes de permitir otro snap (milisegundos)
        cooldownTime: 3000,
        
        // Activar en móvil
        enableOnMobile: true
    };
    
    let isSnapping = false;
    let lastScrollTime = 0;
    let accumulatedScroll = 0;
    
    console.log('✅ Scroll snap Hero ↔ Soluciones activado');
    console.log(`   • Umbral de scroll: ${CONFIG.scrollThreshold}px`);
    console.log(`   • Offset navbar: ${CONFIG.navbarOffset}px`);
    console.log(`   • Zona: ${CONFIG.triggerZoneStart * 100}% - ${CONFIG.triggerZoneEnd * 100}%`);
    
    // ========== FUNCIÓN PARA SCROLL SUAVE CON OFFSET ==========
    function smoothScrollTo(targetPosition) {
        isSnapping = true;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
        
        setTimeout(() => {
            isSnapping = false;
            accumulatedScroll = 0;
            lastScrollTime = Date.now();
        }, CONFIG.scrollDuration + 200);
    }
    
    // ========== CALCULAR POSICIÓN DE SOLUCIONES CON OFFSET ==========
    function getSolucionesScrollPosition() {
        // Posición de Soluciones - offset del navbar
        return solucionesSection.offsetTop - CONFIG.navbarOffset;
    }
    
    // ========== DETECTAR SI ESTAMOS EN LA ZONA DE TRANSICIÓN ==========
    function isInTransitionZone() {
        const scrollPosition = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        
        // Zona de transición
        const zoneStart = heroHeight * CONFIG.triggerZoneStart;
        const zoneEnd = heroHeight * CONFIG.triggerZoneEnd;
        
        const inZone = scrollPosition >= zoneStart && scrollPosition <= zoneEnd;
        
        return inZone;
    }
    
    // ========== MANEJAR SCROLL ==========
    let lastScrollY = window.scrollY;
    
    window.addEventListener('scroll', () => {
        if (isSnapping) return;
        
        const now = Date.now();
        if (now - lastScrollTime < CONFIG.cooldownTime) return;
        
        const currentScrollY = window.scrollY;
        const scrollDelta = currentScrollY - lastScrollY;
        
        // Acumular el scroll
        accumulatedScroll += Math.abs(scrollDelta);
        
        // ========== VERIFICAR SI SE ALCANZÓ EL UMBRAL ==========
        if (accumulatedScroll >= CONFIG.scrollThreshold) {
            
            // Solo activar snap si estamos en la zona de transición
            if (isInTransitionZone()) {
                const solucionesPosition = getSolucionesScrollPosition();
                
                // ========== SNAP HACIA ABAJO (Hero → Soluciones) ==========
                if (scrollDelta > 0) {
                    console.log(`⬇️ Snap: Hero → Soluciones (pos: ${solucionesPosition}px)`);
                    smoothScrollTo(solucionesPosition);
                }
                
                // ========== SNAP HACIA ARRIBA (Soluciones → Hero) ==========
                else if (scrollDelta < 0) {
                    console.log('⬆️ Snap: Soluciones → Hero');
                    smoothScrollTo(0);
                }
            }
            
            accumulatedScroll = 0;
        }
        
        lastScrollY = currentScrollY;
    }, { passive: true });
    
    // ========== MANEJAR WHEEL (RUEDA DEL MOUSE) - MÁS PRECISO ==========
    window.addEventListener('wheel', (e) => {
        if (isSnapping) return;
        
        const now = Date.now();
        if (now - lastScrollTime < CONFIG.cooldownTime) return;
        
        // Solo activar en la zona de transición
        if (isInTransitionZone()) {
            const solucionesPosition = getSolucionesScrollPosition();
            
            // Scroll hacia abajo
            if (e.deltaY > 0) {
                e.preventDefault();
                console.log(`🖱️ Wheel ⬇️: Hero → Soluciones (pos: ${solucionesPosition}px)`);
                smoothScrollTo(solucionesPosition);
            }
            
            // Scroll hacia arriba
            else if (e.deltaY < 0) {
                e.preventDefault();
                console.log('🖱️ Wheel ⬆️: Soluciones → Hero');
                smoothScrollTo(0);
            }
        }
    }, { passive: false });
    
    // ========== MANEJAR TOUCH EN MÓVIL ==========
    let touchStartY = 0;
    let touchEndY = 0;
    
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.touches[0].clientY;
    }, { passive: true });
    
    window.addEventListener('touchend', (e) => {
        if (!CONFIG.enableOnMobile) return;
        if (isSnapping) return;
        
        touchEndY = e.changedTouches[0].clientY;
        const touchDelta = touchStartY - touchEndY;
        
        // Si el swipe fue significativo y estamos en la zona
        if (Math.abs(touchDelta) > 50 && isInTransitionZone()) {
            const solucionesPosition = getSolucionesScrollPosition();
            
            // Swipe hacia arriba (scroll down)
            if (touchDelta > 0) {
                console.log(`📱 Touch ⬇️: Hero → Soluciones (pos: ${solucionesPosition}px)`);
                smoothScrollTo(solucionesPosition);
            }
            
            // Swipe hacia abajo (scroll up)
            else if (touchDelta < 0) {
                console.log('📱 Touch ⬆️: Soluciones → Hero');
                smoothScrollTo(0);
            }
        }
    }, { passive: true });
});

// ========== GUÍA DE AJUSTE DEL OFFSET ==========
/*
navbarOffset: Espacio en píxeles que se resta a la posición de Soluciones

Ejemplos:
navbarOffset: 0    → Scroll exactamente al inicio de Soluciones
navbarOffset: 80   → Scroll 80px antes de Soluciones (navbar de 80px)
navbarOffset: 110  → Scroll 110px antes de Soluciones (navbar + padding)
navbarOffset: 150  → Scroll 150px antes de Soluciones (más espacio)

RECOMENDACIÓN:
- Si tu navbar mide 80px → usa navbarOffset: 80
- Si quieres padding extra → usa navbarOffset: 110-120
- Ajusta según tu diseño específico
*/