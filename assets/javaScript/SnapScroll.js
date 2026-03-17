// ========== SCROLL SNAP: HERO ↔ SOLUCIONES (ZONAS MEJORADAS) ==========

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
        // 0.8 = Se activa cuando estás al 80% del Hero hacia abajo
        triggerZoneStart: 0.5,  // ← AJUSTA: Inicio de zona de snap (70% del Hero)
        triggerZoneEnd: 1.0,    // ← AJUSTA: Fin de zona de snap (30% dentro de Soluciones)
        
        // Duración de la animación de scroll (milisegundos)
        scrollDuration: 800,
        
        // Tiempo de espera antes de permitir otro snap (milisegundos)
        cooldownTime: 1000,
        
        // Activar en móvil
        enableOnMobile: true
    };
    
    let isSnapping = false;
    let lastScrollTime = 0;
    let accumulatedScroll = 0;
    
    console.log('✅ Scroll snap Hero ↔ Soluciones activado');
    console.log(`   • Umbral de scroll: ${CONFIG.scrollThreshold}px`);
    console.log(`   • Zona de activación: ${CONFIG.triggerZoneStart * 100}% - ${CONFIG.triggerZoneEnd * 100}% del Hero`);
    
    // ========== FUNCIÓN PARA SCROLL SUAVE ==========
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
    
    // ========== DETECTAR SI ESTAMOS EN LA ZONA DE TRANSICIÓN ==========
    function isInTransitionZone() {
        const scrollPosition = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        
        // Zona de transición: desde 70% del Hero hasta 30% de Soluciones
        const zoneStart = heroHeight * CONFIG.triggerZoneStart;
        const zoneEnd = heroHeight * CONFIG.triggerZoneEnd;
        
        const inZone = scrollPosition >= zoneStart && scrollPosition <= zoneEnd;
        
        if (inZone) {
            console.log(`📍 En zona de transición (scroll: ${scrollPosition.toFixed(0)}px, zona: ${zoneStart.toFixed(0)}-${zoneEnd.toFixed(0)}px)`);
        }
        
        return inZone;
    }
    
    // ========== DETERMINAR DIRECCIÓN DEL SNAP ==========
    function getSnapDirection() {
        const scrollPosition = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        
        // Si estamos más cerca del Hero (en la mitad superior de la zona)
        if (scrollPosition < heroHeight) {
            return 'to-hero';
        } else {
            return 'to-soluciones';
        }
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
                const solucionesTop = solucionesSection.offsetTop;
                
                // ========== SNAP HACIA ABAJO (Hero → Soluciones) ==========
                if (scrollDelta > 0) {
                    console.log('⬇️ Snap: Hero → Soluciones');
                    smoothScrollTo(solucionesTop);
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
            const solucionesTop = solucionesSection.offsetTop;
            
            // Scroll hacia abajo
            if (e.deltaY > 0) {
                e.preventDefault();
                console.log('🖱️ Wheel ⬇️: Hero → Soluciones');
                smoothScrollTo(solucionesTop);
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
            const solucionesTop = solucionesSection.offsetTop;
            
            // Swipe hacia arriba (scroll down)
            if (touchDelta > 0) {
                console.log('📱 Touch ⬇️: Hero → Soluciones');
                smoothScrollTo(solucionesTop);
            }
            
            // Swipe hacia abajo (scroll up)
            else if (touchDelta < 0) {
                console.log('📱 Touch ⬆️: Soluciones → Hero');
                smoothScrollTo(0);
            }
        }
    }, { passive: true });
    
    // ========== DEBUG: Mostrar zona actual ==========
    // Descomenta esto para ver en qué zona estás mientras haces scroll
    /*
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        const heroHeight = heroSection.offsetHeight;
        const percentage = (scrollY / heroHeight * 100).toFixed(0);
        
        console.log(`Scroll: ${scrollY.toFixed(0)}px (${percentage}% del Hero) - En zona: ${isInTransitionZone() ? 'SÍ' : 'NO'}`);
    });
    */
});

// ========== GUÍA DE AJUSTE DE ZONAS ==========
/*
triggerZoneStart y triggerZoneEnd definen dónde se activa el snap:

triggerZoneStart: 0.7 (70% del Hero)
triggerZoneEnd: 1.3 (130% del Hero = 30% dentro de Soluciones)

Ejemplo con Hero de 1000px de alto:
- 0.7 = Se activa desde los 700px de scroll (falta 30% para terminar Hero)
- 1.3 = Se activa hasta los 1300px de scroll (30% dentro de Soluciones)

AJUSTES RECOMENDADOS:

Zona más amplia (más fácil de activar):
triggerZoneStart: 0.5  (50% del Hero)
triggerZoneEnd: 1.5    (50% dentro de Soluciones)

Zona más estrecha (justo en la frontera):
triggerZoneStart: 0.8  (80% del Hero)
triggerZoneEnd: 1.2    (20% dentro de Soluciones)

Zona solo al final del Hero:
triggerZoneStart: 0.9  (90% del Hero)
triggerZoneEnd: 1.1    (10% dentro de Soluciones)
*/