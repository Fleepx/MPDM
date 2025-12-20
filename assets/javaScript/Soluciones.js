// ========== CONFIGURACIÓN DE SERVICIOS ==========
const servicios = {
    'icono-1': {
        titulo: 'Desarrollo de Software',
        descripcion: 'Creamos aplicaciones web y móviles personalizadas utilizando las últimas tecnologías. Desarrollo de APIs, microservicios y soluciones escalables para tu negocio.'
    },
    'icono-2': {
        titulo: 'Diseño UX/UI',
        descripcion: 'Diseñamos experiencias digitales intuitivas y atractivas que conectan con tus usuarios. Interfaces modernas, prototipado interactivo y diseño centrado en el usuario.'
    },
    'icono-3': {
        titulo: 'Infraestructura IT',
        descripcion: 'Implementamos y gestionamos infraestructuras tecnológicas robustas y escalables. Cloud computing, DevOps, CI/CD y seguridad de sistemas.'
    },
    'icono-4': {
        titulo: 'Consultoría Tecnológica',
        descripcion: 'Te asesoramos en la toma de decisiones tecnológicas estratégicas. Auditoría tecnológica, roadmap de innovación y transformación digital.'
    },
    'icono-5': {
        titulo: 'Integración de Sistemas',
        descripcion: 'Conectamos tus sistemas existentes para optimizar procesos. APIs REST, GraphQL, integración ERP/CRM y automatización de flujos de trabajo.'
    },
    'icono-6': {
        titulo: 'Redes y Conectividad',
        descripcion: 'Diseñamos e implementamos infraestructuras de red seguras y eficientes. Configuración de redes, VPN, firewall y monitoreo de conectividad.'
    }
};

// ========== VARIABLES GLOBALES ==========
let iconoActivo = null; // Guarda el último icono en el que se hizo click
let hoverActivo = false; // Indica si hay un hover activo
let enClick = false; // Nueva variable para detectar cuando estamos en medio de un click

// Elementos del DOM
const iconos = document.querySelectorAll('.icono');
const tituloCirculo = document.getElementById('title-circle');
const descripcionCirculo = document.getElementById('description-circle');

// Guardar el contenido inicial
const contenidoInicial = {
    titulo: tituloCirculo.textContent,
    descripcion: descripcionCirculo.textContent
};

// ========== FUNCIÓN PARA CAMBIAR CONTENIDO ==========
function cambiarContenido(clase, conAnimacion = true) {
    const claseIcono = Array.from(clase).find(c => c.startsWith('icono-'));
    
    if (claseIcono && servicios[claseIcono]) {
        if (conAnimacion) {
            // CON animación (solo para hover)
            tituloCirculo.style.opacity = '0';
            descripcionCirculo.style.opacity = '0';
            
            setTimeout(() => {
                tituloCirculo.textContent = servicios[claseIcono].titulo;
                descripcionCirculo.textContent = servicios[claseIcono].descripcion;
                
                tituloCirculo.style.opacity = '1';
                descripcionCirculo.style.opacity = '1';
            }, 200);
        } else {
            // SIN animación (para click)
            tituloCirculo.textContent = servicios[claseIcono].titulo;
            descripcionCirculo.textContent = servicios[claseIcono].descripcion;
        }
    }
}

// ========== FUNCIÓN PARA RESTAURAR CONTENIDO ==========
function restaurarContenido() {
    if (iconoActivo) {
        // Restaurar al activo sin animación
        tituloCirculo.textContent = servicios[iconoActivo].titulo;
        descripcionCirculo.textContent = servicios[iconoActivo].descripcion;
    } else {
        // Restaurar al inicial sin animación
        tituloCirculo.textContent = contenidoInicial.titulo;
        descripcionCirculo.textContent = contenidoInicial.descripcion;
    }
}

// ========== EVENT LISTENERS ==========
iconos.forEach(icono => {
    // Agregar transición suave al título y descripción
    tituloCirculo.style.transition = 'opacity 0.3s ease';
    descripcionCirculo.style.transition = 'opacity 0.3s ease';
    
    // MOUSEDOWN - Se dispara ANTES del click
    icono.addEventListener('mousedown', () => {
        enClick = true;
    });
    
    // CLICK - Cuando se hace click
    icono.addEventListener('click', () => {
        // Remover clase 'active' de todos los iconos
        iconos.forEach(i => {
            i.classList.remove('active');
            // Restaurar tamaño normal de todos los iconos
            i.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5)';
            i.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        });
        
        // Agregar clase 'active' al icono clickeado
        icono.classList.add('active');
        
        // Guardar como icono activo
        const claseIcono = Array.from(icono.classList).find(c => c.startsWith('icono-'));
        iconoActivo = claseIcono;
        
        // Cambiar contenido SIN animación
        cambiarContenido(icono.classList, false);
        
        // Efecto visual de click (escala pequeña y luego grande)
        icono.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5) scale(0.95)';
        setTimeout(() => {
            icono.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5) scale(1.15)';
            // Resetear el flag de click después de un momento
            setTimeout(() => {
                enClick = false;
            }, 50);
        }, 100);
    });
    
    // HOVER - Cuando el mouse entra
    icono.addEventListener('mouseenter', () => {
        // NO hacer nada si estamos en medio de un click
        if (enClick) return;
        
        hoverActivo = true;
        
        // Cambiar contenido CON animación (solo si NO estamos haciendo click)
        cambiarContenido(icono.classList, true);
        
        // Agregar efecto visual al icono
        icono.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5) scale(1.15)';
        icono.style.boxShadow = '0 4px 15px rgba(82, 52, 165, 0.5)';
    });
    
    // HOVER - Cuando el mouse sale
    icono.addEventListener('mouseleave', () => {
        hoverActivo = false;
        
        // Pequeño delay para evitar parpadeo
        setTimeout(() => {
            // Solo restaurar si no hay otro hover activo
            if (!hoverActivo && !enClick) {
                restaurarContenido();
            }
        }, 100);
        
        // Restaurar efecto visual del icono (si no está activo)
        if (!icono.classList.contains('active')) {
            icono.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5)';
            icono.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        }
    });
    
    // Agregar cursor pointer
    icono.style.cursor = 'pointer';
    
    // Mejorar la transición del icono
    icono.style.transition = 'all 0.3s ease';
});

// ========== ESTILO PARA ICONO ACTIVO ==========
const style = document.createElement('style');
style.textContent = `
    .icono.active {
        background-color: rgb(13, 13, 104) !important;
        box-shadow: 0 4px 20px rgba(82, 52, 165, 0.7) !important;
    }
    
    .icono.active::after {
        content: '';
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        border: 3px solid rgba(255, 255, 255, 0.5);
        animation: pulse 1.5s infinite;
    }
    
    @keyframes pulse {
        0% {
            transform: scale(1);
            opacity: 1;
        }
        100% {
            transform: scale(1.3);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========== ANIMACIÓN DE ENTRADA INICIAL ==========
window.addEventListener('load', () => {
    // Animar la aparición de los iconos
    iconos.forEach((icono, index) => {
        icono.style.opacity = '0';
        icono.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5) scale(0)';
        
        setTimeout(() => {
            icono.style.opacity = '1';
            icono.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5)';
        }, 100 * (index + 1));
    });
});

// ========== ACCESIBILIDAD - NAVEGACIÓN POR TECLADO ==========
iconos.forEach((icono, index) => {
    // Hacer los iconos navegables por teclado
    icono.setAttribute('tabindex', '0');
    icono.setAttribute('role', 'button');
    icono.setAttribute('aria-label', `Servicio ${index + 1}`);
    
    // Permitir activación con Enter o Espacio
    icono.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            enClick = true; // Marcar como click
            icono.click();
            setTimeout(() => {
                enClick = false;
            }, 200);
        }
    });
    
    // Efecto de hover al recibir focus
    icono.addEventListener('focus', () => {
        if (enClick) return; // No animar si viene de un click por teclado
        
        hoverActivo = true;
        cambiarContenido(icono.classList, true);
        icono.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5) scale(1.15)';
        icono.style.boxShadow = '0 4px 15px rgba(82, 52, 165, 0.5)';
    });
    
    icono.addEventListener('blur', () => {
        hoverActivo = false;
        setTimeout(() => {
            if (!hoverActivo && !enClick) {
                restaurarContenido();
            }
        }, 100);
        
        // Solo restaurar si no está activo
        if (!icono.classList.contains('active')) {
            icono.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5)';
            icono.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        }
    });
});

console.log('✅ Sistema de círculo interactivo cargado correctamente');
console.log(`📊 ${iconos.length} servicios disponibles`);