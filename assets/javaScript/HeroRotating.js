// ========== HERO: ANIMACIONES EN JS + VIDEO RESTART FIX ==========

document.addEventListener('DOMContentLoaded', () => {
    const videos = document.querySelectorAll('.hero-video');
    const textSlides = document.querySelectorAll('.hero-text-slide');
    
    if (videos.length === 0 || textSlides.length === 0) {
        console.warn('⚠️ No se encontraron videos o slides de texto');
        return;
    }
    
    let currentIndex = 0;
    const totalSlides = Math.min(videos.length, textSlides.length);
    const displayDuration = 4000; // 4 segundos por slide
    
    console.log(`✅ Hero inicializado: ${totalSlides} slides`);
    
    // ========== FUNCIÓN PARA ANIMAR TEXTOS ==========
    function animateTextSlide(slideElement) {
        const topText = slideElement.querySelector('.hero-text-top');
        const bottomText = slideElement.querySelector('.hero-text-bottom');
        
        if (!topText || !bottomText) return;
        
        // Resetear posición inicial
        topText.style.transform = 'translateY(-3rem)';
        topText.style.opacity = '0';
        bottomText.style.transform = 'translateY(1rem)';
        bottomText.style.opacity = '0';
        
        // Animar texto superior: izquierda → derecha
        setTimeout(() => {
            topText.style.transition = 'transform 0.8s ease-out, opacity 0.9s ease-out';
            topText.style.transform = 'translateX(0)';
            topText.style.opacity = '1';
        }, 50);
        
        // Animar texto inferior: derecha → izquierda (con delay)
        setTimeout(() => {
            bottomText.style.transition = 'transform 0.7s ease-out, opacity 0.8s ease-out';
            bottomText.style.transform = 'translateX(0)';
            bottomText.style.opacity = '1';
        }, 250); // 200ms de delay
    }
    
    // ========== FUNCIÓN PARA RESETEAR ANIMACIONES ==========
    function resetTextSlide(slideElement) {
        const topText = slideElement.querySelector('.hero-text-top');
        const bottomText = slideElement.querySelector('.hero-text-bottom');
        
        if (topText) {
            topText.style.transition = 'none';
            topText.style.transform = 'translateX(-100%)';
            topText.style.opacity = '0';
        }
        
        if (bottomText) {
            bottomText.style.transition = 'none';
            bottomText.style.transform = 'translateX(100%)';
            bottomText.style.opacity = '0';
        }
    }
    
    // ========== FUNCIÓN PARA CAMBIAR DE SLIDE ==========
    function showNextSlide() {
        // Remover active del slide actual
        videos[currentIndex].classList.remove('active');
        textSlides[currentIndex].classList.remove('active');
        
        // ✅ IMPORTANTE: Pausar y reiniciar video desde el inicio
        videos[currentIndex].pause();
        videos[currentIndex].currentTime = 0; // ← Resetear al inicio
        
        // Resetear animaciones del texto actual
        resetTextSlide(textSlides[currentIndex]);
        
        // Calcular siguiente índice
        currentIndex = (currentIndex + 1) % totalSlides;
        
        // ✅ IMPORTANTE: Reiniciar video desde el inicio
        videos[currentIndex].currentTime = 0; // ← Resetear al inicio
        
        // Agregar active al siguiente slide
        videos[currentIndex].classList.add('active');
        textSlides[currentIndex].classList.add('active');
        
        // Reproducir video desde el inicio
        videos[currentIndex].play().catch(err => {
            console.warn('Error al reproducir video:', err);
        });
        
        // Animar textos
        animateTextSlide(textSlides[currentIndex]);
        
        console.log(`🎬 Slide ${currentIndex + 1}/${totalSlides} - Video desde inicio`);
    }
    
    // ========== PRECARGAR VIDEOS ==========
    videos.forEach((video, index) => {
        video.load();
        
        video.addEventListener('loadeddata', () => {
            console.log(`✅ Video ${index + 1} cargado (${video.duration.toFixed(1)}s)`);
        });
        
        video.addEventListener('error', (e) => {
            console.error(`❌ Error al cargar video ${index + 1}:`, e);
        });
        
        // ✅ Cuando el video termina, reiniciar al inicio (para el loop)
        video.addEventListener('ended', () => {
            video.currentTime = 0;
            video.play();
        });
    });
    
    // ========== INICIALIZAR PRIMER SLIDE ==========
    videos[0].classList.add('active');
    textSlides[0].classList.add('active');
    
    // ✅ Asegurar que empiece desde el inicio
    videos[0].currentTime = 0;
    
    // Reproducir primer video
    videos[0].play().catch(err => {
        console.warn('Error al reproducir primer video:', err);
        // Intentar reproducir con interacción del usuario
        document.addEventListener('click', () => {
            videos[0].currentTime = 0;
            videos[0].play();
        }, { once: true });
    });
    
    // Animar textos del primer slide
    setTimeout(() => {
        animateTextSlide(textSlides[0]);
    }, 100);
    
    // ========== INICIAR ROTACIÓN AUTOMÁTICA ==========
    let rotationInterval = setInterval(showNextSlide, displayDuration);
    
    // ========== PAUSAR AL CAMBIAR DE PESTAÑA ==========
    document.addEventListener('visibilitychange', () => {
        const activeVideo = document.querySelector('.hero-video.active');
        
        if (document.hidden) {
            // Pausar cuando la pestaña no está visible
            if (activeVideo) activeVideo.pause();
            if (rotationInterval) clearInterval(rotationInterval);
            console.log('⏸️ Hero pausado');
        } else {
            // Reanudar cuando vuelve a estar visible
            if (activeVideo) {
                activeVideo.currentTime = 0; // Reiniciar desde el inicio
                activeVideo.play().catch(err => console.warn(err));
            }
            rotationInterval = setInterval(showNextSlide, displayDuration);
            console.log('▶️ Hero reanudado');
        }
    });
});

// ========== CONFIGURACIÓN ==========

const HERO_CONFIG = {
    // Duración por slide (milisegundos)
    displayDuration: 4000,
    
    // Duración de animación de entrada (milisegundos)
    slideInDuration: 800,
    
    // Delay entre línea superior e inferior (milisegundos)
    lineDelay: 200,
    
    // Auto-reiniciar videos desde el inicio
    restartVideos: true, // ← Siempre true
    
    // Textos (para referencia)
    texts: [
        { top: 'Texto 1 arriba', bottom: 'Texto 1 abajo' },
        { top: 'Texto 2 arriba', bottom: 'Texto 2 abajo' },
        { top: 'Texto 3 arriba', bottom: 'Texto 3 abajo' },
        { top: 'Texto 4 arriba', bottom: 'Texto 4 abajo' }
    ]
};

console.log('📋 Configuración:');
console.log(`   • Slides: ${HERO_CONFIG.texts.length}`);
console.log(`   • Duración: ${HERO_CONFIG.displayDuration / 1000}s`);
console.log(`   • Videos reinician: ${HERO_CONFIG.restartVideos ? 'SÍ' : 'NO'}`);