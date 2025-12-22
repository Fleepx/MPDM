// ========== TYPEWRITER EFFECT PARA SERVICIOS ==========

// Array de servicios para el typewriter (2-3 palabras máximo)
const serviciosTypewriter = [
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

function typeWriter() {
    const typewriterElement = document.getElementById('typewriterText');
    
    if (!typewriterElement) {
        console.error('❌ No se encuentra el elemento #typewriterText');
        return;
    }
    
    const currentService = serviciosTypewriter[servicioIndex];
    
    // Escribiendo
    if (!isDeleting) {
        if (charIndex < currentService.length) {
            typewriterElement.textContent = currentService.substring(0, charIndex + 1);
            charIndex++;
            setTimeout(typeWriter, 100); // Velocidad al escribir
        } else {
            // Terminó de escribir, esperar 2 segundos antes de borrar
            setTimeout(() => {
                isDeleting = true;
                typeWriter();
            }, 2000);
        }
    }
    // Borrando
    else {
        if (charIndex > 0) {
            typewriterElement.textContent = currentService.substring(0, charIndex - 1);
            charIndex--;
            setTimeout(typeWriter, 50); // Velocidad al borrar
        } else {
            // Terminó de borrar, pasar al siguiente servicio
            isDeleting = false;
            servicioIndex = (servicioIndex + 1) % serviciosTypewriter.length;
            setTimeout(typeWriter, 300); // Pequeña pausa antes de escribir el siguiente
        }
    }
}

// ========== INICIAR CUANDO EL DOM ESTÉ LISTO ==========
document.addEventListener('DOMContentLoaded', () => {
    console.log('✅ Typewriter: DOM cargado');
    
    const typewriterElement = document.getElementById('typewriterText');
    
    if (typewriterElement) {
        console.log('✅ Typewriter: Elemento encontrado, iniciando...');
        setTimeout(() => {
            typeWriter();
        }, 1000);
    } else {
        console.error('❌ Typewriter: No se encuentra #typewriterText');
    }
});