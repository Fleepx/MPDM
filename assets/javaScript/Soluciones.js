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
let iconoActivo = null;
let hoverActivo = false;
let enClick = false;
let autoRotateInterval = null;
let autoRotateEnabled = true;
let currentAutoIndex = 0;

// Elementos del DOM
const iconos = document.querySelectorAll('.icono');
const tituloCirculo = document.getElementById('title-circle');
const descripcionCirculo = document.getElementById('description-circle');

// Guardar el contenido inicial
const contenidoInicial = {
    titulo: servicios['icono-1'].titulo,
    descripcion: servicios['icono-1'].descripcion
};

// ========== FUNCIÓN PARA CAMBIAR CONTENIDO ==========
function cambiarContenido(clase, conAnimacion = true) {
    const claseIcono = Array.from(clase).find(c => c.startsWith('icono-'));
    
    if (claseIcono && servicios[claseIcono]) {
        if (conAnimacion) {
            tituloCirculo.style.opacity = '0';
            descripcionCirculo.style.opacity = '0';
            
            setTimeout(() => {
                tituloCirculo.textContent = servicios[claseIcono].titulo;
                descripcionCirculo.textContent = servicios[claseIcono].descripcion;
                
                tituloCirculo.style.opacity = '1';
                descripcionCirculo.style.opacity = '1';
            }, 200);
        } else {
            tituloCirculo.textContent = servicios[claseIcono].titulo;
            descripcionCirculo.textContent = servicios[claseIcono].descripcion;
        }
    }
}

// ========== FUNCIÓN PARA RESTAURAR CONTENIDO ==========
function restaurarContenido() {
    if (iconoActivo) {
        tituloCirculo.textContent = servicios[iconoActivo].titulo;
        descripcionCirculo.textContent = servicios[iconoActivo].descripcion;
    } else {
        tituloCirculo.textContent = contenidoInicial.titulo;
        descripcionCirculo.textContent = contenidoInicial.descripcion;
    }
}

// ========== AUTO-ROTACIÓN ==========
function startAutoRotate() {
    if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
    }
    
    autoRotateInterval = setInterval(() => {
        // Solo rotar si no hay hover activo y no hay click reciente
        if (!hoverActivo && autoRotateEnabled) {
            const iconosArray = Array.from(iconos);
            
            // Remover active de todos
            iconosArray.forEach(i => {
                i.classList.remove('active');
                i.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5)';
                i.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            });
            
            // Siguiente icono
            currentAutoIndex = (currentAutoIndex + 1) % iconosArray.length;
            const currentIcono = iconosArray[currentAutoIndex];
            
            // Activar el icono actual
            currentIcono.classList.add('active');
            currentIcono.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5) scale(1.15)';
            currentIcono.style.boxShadow = '0 4px 20px rgba(82, 52, 165, 0.7)';
            
            // Cambiar contenido
            const claseIcono = Array.from(currentIcono.classList).find(c => c.startsWith('icono-'));
            iconoActivo = claseIcono;
            cambiarContenido(currentIcono.classList, true);
        }
    }, 2000); // Cada 2 segundos
}

function stopAutoRotate() {
    if (autoRotateInterval) {
        clearInterval(autoRotateInterval);
        autoRotateInterval = null;
    }
}

function pauseAutoRotate() {
    autoRotateEnabled = false;
}

function resumeAutoRotate() {
    autoRotateEnabled = true;
}

// ========== EVENT LISTENERS ==========
iconos.forEach(icono => {
    tituloCirculo.style.transition = 'opacity 0.3s ease';
    descripcionCirculo.style.transition = 'opacity 0.3s ease';
    
    // MOUSEDOWN
    icono.addEventListener('mousedown', () => {
        enClick = true;
    });
    
    // CLICK
    icono.addEventListener('click', () => {
        // Pausar auto-rotación por 6 segundos después del click
        pauseAutoRotate();
        
        // Remover clase 'active' de todos los iconos
        iconos.forEach(i => {
            i.classList.remove('active');
            i.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5)';
            i.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        });
        
        // Agregar clase 'active' al icono clickeado
        icono.classList.add('active');
        
        // Guardar como icono activo
        const claseIcono = Array.from(icono.classList).find(c => c.startsWith('icono-'));
        iconoActivo = claseIcono;
        
        // Actualizar el índice de auto-rotación
        currentAutoIndex = Array.from(iconos).indexOf(icono);
        
        // Cambiar contenido SIN animación
        cambiarContenido(icono.classList, false);
        
        // Efecto visual de click
        icono.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5) scale(0.95)';
        setTimeout(() => {
            icono.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5) scale(1.15)';
            setTimeout(() => {
                enClick = false;
            }, 50);
        }, 100);
        
        // Reanudar auto-rotación después de 6 segundos
        setTimeout(() => {
            resumeAutoRotate();
        }, 6000);
    });
    
    // HOVER - Cuando el mouse entra
    icono.addEventListener('mouseenter', () => {
        if (enClick) return;
        
        hoverActivo = true;
        
        // Pausar auto-rotación temporalmente durante hover
        pauseAutoRotate();
        
        // Cambiar contenido CON animación
        cambiarContenido(icono.classList, true);
        
        // Efecto visual al icono
        icono.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5) scale(1.15)';
        icono.style.boxShadow = '0 4px 15px rgba(82, 52, 165, 0.5)';
    });
    
    // HOVER - Cuando el mouse sale
    icono.addEventListener('mouseleave', () => {
        hoverActivo = false;
        
        setTimeout(() => {
            if (!hoverActivo && !enClick) {
                restaurarContenido();
                
                // Reanudar auto-rotación después de salir del hover
                resumeAutoRotate();
            }
        }, 100);
        
        // Restaurar efecto visual del icono (si no está activo)
        if (!icono.classList.contains('active')) {
            icono.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5)';
            icono.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        }
    });
    
    icono.style.cursor = 'pointer';
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
    
    // Activar el primer icono después de que aparezcan todos
    setTimeout(() => {
        const primerIcono = iconos[0];
        primerIcono.classList.add('active');
        primerIcono.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5) scale(1.15)';
        primerIcono.style.boxShadow = '0 4px 20px rgba(82, 52, 165, 0.7)';
        
        const claseIcono = Array.from(primerIcono.classList).find(c => c.startsWith('icono-'));
        iconoActivo = claseIcono;
        cambiarContenido(primerIcono.classList, true);
        
        // Iniciar auto-rotación después de mostrar el primero
        setTimeout(() => {
            startAutoRotate();
        }, 2000);
    }, 100 * iconos.length + 500);
});

// ========== ACCESIBILIDAD - NAVEGACIÓN POR TECLADO ==========
iconos.forEach((icono, index) => {
    icono.setAttribute('tabindex', '0');
    icono.setAttribute('role', 'button');
    icono.setAttribute('aria-label', `Servicio ${index + 1}`);
    
    icono.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            enClick = true;
            icono.click();
            setTimeout(() => {
                enClick = false;
            }, 200);
        }
    });
    
    icono.addEventListener('focus', () => {
        if (enClick) return;
        
        hoverActivo = true;
        pauseAutoRotate();
        cambiarContenido(icono.classList, true);
        icono.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5) scale(1.15)';
        icono.style.boxShadow = '0 4px 15px rgba(82, 52, 165, 0.5)';
    });
    
    icono.addEventListener('blur', () => {
        hoverActivo = false;
        setTimeout(() => {
            if (!hoverActivo && !enClick) {
                restaurarContenido();
                resumeAutoRotate();
            }
        }, 100);
        
        if (!icono.classList.contains('active')) {
            icono.style.transform = 'matrix(1, 0, 0, 1, -42.5, -42.5)';
            icono.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        }
    });
});

console.log('✅ Sistema de círculo interactivo con auto-rotación cargado');
console.log(`📊 ${iconos.length} servicios disponibles`);