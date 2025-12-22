// ========== TYPEWRITER EFFECT PARA SERVICIOS ==========

// Array de servicios (2-3 palabras máximo)
const servicios = [
    "Desarrollo Web",
    "Diseño UX/UI",
    "Infraestructura IT",
    "Integración",
    "Consultoría Tech",
    "Redes"
];

let servicioIndex = 0;
let charIndex = 0;
let isDeleting = false;
let isPaused = false;

const typewriterElement = document.getElementById('typewriterText');

// Velocidades (en milisegundos)
const typingSpeed = 100;      // Velocidad al escribir
const deletingSpeed = 50;     // Velocidad al borrar
const pauseAfterComplete = 2000; // Pausa de 2 segundos después de completar

function typeWriter() {
    if (!typewriterElement) return;
    
    const currentService = servicios[servicioIndex];
    
    // Si está en pausa (después de completar una palabra)
    if (isPaused) {
        isPaused = false;
        isDeleting = true;
        setTimeout(typeWriter, pauseAfterComplete);
        return;
    }
    
    // Escribiendo
    if (!isDeleting) {
        if (charIndex < currentService.length) {
            typewriterElement.textContent = currentService.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeWriter, typingSpeed);
        } else {
            // Terminó de escribir, pausar 2 segundos
            isPaused = true;
            setTimeout(typeWriter, 100);
        }
    }
    // Borrando
    else {
        if (charIndex > 0) {
            typewriterElement.textContent = currentService.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(typeWriter, deletingSpeed);
        } else {
            // Terminó de borrar, siguiente servicio
            isDeleting = false;
            servicioIndex = (servicioIndex + 1) % servicios.length;
            setTimeout(typeWriter, 300);
        }
    }
}

// ========== INICIAR TYPEWRITER ==========
window.addEventListener('load', () => {
    // Esperar un poco antes de iniciar la animación
    setTimeout(() => {
        typeWriter();
    }, 1500); // Inicia después de 1.5 segundos
    
    console.log('✅ Typewriter effect inicializado');
});

// ========== OPCIONAL: PAUSAR AL SALIR DE LA VISTA ==========
// Optimización: pausar animación cuando no esté visible
let typewriterTimeout;
let isTypewriterPaused = false;

function pauseTypewriter() {
    isTypewriterPaused = true;
    clearTimeout(typewriterTimeout);
}

function resumeTypewriter() {
    if (isTypewriterPaused) {
        isTypewriterPaused = false;
        typeWriter();
    }
}

// Observer para detectar visibilidad
const observerOptions = {
    root: null,
    threshold: 0.1
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            resumeTypewriter();
        } else {
            pauseTypewriter();
        }
    });
};

const nosotrosSection = document.getElementById('nosotros');
if (nosotrosSection) {
    const observer = new IntersectionObserver(observerCallback, observerOptions);
    observer.observe(nosotrosSection);
}