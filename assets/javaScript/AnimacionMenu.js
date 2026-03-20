// ========== MENÚ ACTIVO - VERSIÓN MEJORADA CON MAPEO EXPLÍCITO ==========

window.addEventListener('scroll', function() {
    var header = document.querySelector("header");
    header.classList.toggle("scrolled", scrollY > 0);
    updateActiveMenu();
});

function updateActiveMenu() {
    const navLinks = document.querySelectorAll('.nav-link');
    const navbarHeight = 110; // Altura del navbar
    const scrollPosition = window.scrollY;
    
    // ✅ MAPEO EXPLÍCITO: href → section ID
    const sectionMap = {
        '#top': 'hero',           // Inicio → Hero
        '#services': 'services',  // Soluciones → Services
        '#us': 'us',             // Nosotros → Us
        '#contacto': 'contacto'   // Contacto → Contacto
    };
    
    let currentSection = '';
    
    // Detectar sección actual basada en scroll
    if (scrollPosition < 100) {
        // Muy arriba = Hero/Inicio
        currentSection = 'top';
    } else {
        // Revisar cada sección
        Object.entries(sectionMap).forEach(([href, sectionId]) => {
            const section = document.getElementById(sectionId);
            
            if (section) {
                const sectionTop = section.offsetTop - navbarHeight - 50;
                const sectionBottom = sectionTop + section.clientHeight;
                
                // Si el scroll está dentro de esta sección
                if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                    currentSection = href.replace('#', '');
                    console.log(`📍 Sección detectada: ${currentSection} (${sectionId})`);
                }
            }
        });
    }
    
    // Actualizar clases active
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        
        if (href === '#' + currentSection) {
            link.classList.add('active');
            console.log(`✅ Menú activo: ${href}`);
        }
    });
}

document.addEventListener('DOMContentLoaded', function() {
    const navLinks = document.querySelectorAll('.nav-link');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            // Remover active de todos
            navLinks.forEach(l => l.classList.remove('active'));
            
            // Agregar active al clickeado
            this.classList.add('active');
            
            // Cerrar menú móvil
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                bsCollapse.hide();
            }
        });
    });
    
    // Inicializar
    updateActiveMenu();
});

// ========== INFORMACIÓN DE SECCIONES ==========
console.log('📋 Mapeo de secciones:');
console.log('   • #top → hero');
console.log('   • #services → services');
console.log('   • #us → us');
console.log('   • #contacto → contacto');