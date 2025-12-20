// ========== FORMULARIO DE CONTACTO ==========

const contactForm = document.getElementById('contactForm');
const formMessage = document.getElementById('formMessage');

// Función para mostrar mensajes
function showMessage(message, type) {
    formMessage.textContent = message;
    formMessage.className = `form-message ${type}`;
    formMessage.style.display = 'block';
    
    // Scroll suave al mensaje
    formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    
    // Ocultar mensaje después de 5 segundos
    setTimeout(() => {
        formMessage.style.display = 'none';
    }, 5000);
}

// Función para validar email
function validarEmail(email) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

// Función para validar teléfono chileno
function validarTelefono(telefono) {
    if (!telefono) return true; // Es opcional
    const regex = /^(\+?56)?(\s?)(0?9)(\s?)[98765]\d{7}$/;
    return regex.test(telefono.replace(/\s/g, ''));
}

// Event listener del formulario
contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Obtener valores del formulario
    const formData = {
        nombre: document.getElementById('nombre').value.trim(),
        empresa: document.getElementById('empresa').value.trim(),
        email: document.getElementById('email').value.trim(),
        telefono: document.getElementById('telefono').value.trim(),
        servicio: document.getElementById('servicio').value,
        mensaje: document.getElementById('mensaje').value.trim(),
        privacidad: document.getElementById('privacidad').checked
    };
    
    // Validaciones
    if (!formData.nombre || !formData.email || !formData.servicio || !formData.mensaje) {
        showMessage('Por favor completa todos los campos obligatorios', 'error');
        return;
    }
    
    if (!validarEmail(formData.email)) {
        showMessage('Por favor ingresa un email válido', 'error');
        return;
    }
    
    if (formData.telefono && !validarTelefono(formData.telefono)) {
        showMessage('Por favor ingresa un teléfono válido', 'error');
        return;
    }
    
    if (!formData.privacidad) {
        showMessage('Debes aceptar la política de privacidad', 'error');
        return;
    }
    
    // Deshabilitar botón mientras se envía
    const submitButton = contactForm.querySelector('.btn-submit');
    const buttonText = submitButton.querySelector('.btn-text');
    const originalText = buttonText.textContent;
    
    submitButton.disabled = true;
    buttonText.textContent = 'Enviando...';
    submitButton.style.opacity = '0.7';
    submitButton.style.cursor = 'not-allowed';
    
    try {
        // OPCIÓN 1: Envío con FormSubmit (servicio gratuito)
        await enviarConFormSubmit(formData);
        
        // OPCIÓN 2: Si prefieres usar tu propio backend, descomenta esto:
        // await enviarConBackend(formData);
        
        // Mostrar mensaje de éxito
        showMessage('¡Mensaje enviado correctamente! Te contactaremos pronto.', 'success');
        
        // Limpiar formulario
        contactForm.reset();
        
    } catch (error) {
        console.error('Error al enviar:', error);
        showMessage('Hubo un error al enviar el mensaje. Por favor intenta nuevamente.', 'error');
    } finally {
        // Rehabilitar botón
        submitButton.disabled = false;
        buttonText.textContent = originalText;
        submitButton.style.opacity = '1';
        submitButton.style.cursor = 'pointer';
    }
});

// ========== OPCIÓN 1: FORMSUBMIT (Recomendado para empezar) ==========
async function enviarConFormSubmit(formData) {
    const servicioNombre = {
        'desarrollo': 'Desarrollo de Software',
        'diseno': 'Diseño UX/UI',
        'infraestructura': 'Infraestructura IT',
        'consultoria': 'Consultoría Tecnológica',
        'integracion': 'Integración de Sistemas',
        'redes': 'Redes y Conectividad',
        'otro': 'Otro'
    };
    
    const form = new FormData();
    form.append('name', formData.nombre);
    form.append('email', formData.email);
    form.append('Empresa', formData.empresa || 'No especificada');
    form.append('Teléfono', formData.telefono || 'No especificado');
    form.append('Servicio', servicioNombre[formData.servicio] || formData.servicio);
    form.append('message', formData.mensaje);
    
    const response = await fetch('https://formsubmit.co/contacto@mpdm.cl', {
        method: 'POST',
        body: form,
        headers: {
            'Accept': 'application/json'
        }
    });
    
    if (!response.ok) {
        throw new Error('Error en el envío');
    }
    
    return response;
}

// ========== OPCIÓN 2: BACKEND PROPIO (PHP/Node.js) ==========
async function enviarConBackend(formData) {
    const response = await fetch('/api/send-email.php', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
    });
    
    if (!response.ok) {
        throw new Error('Error en el envío');
    }
    
    const result = await response.json();
    return result;
}

// ========== OPCIÓN 3: EMAILJS (Alternativa sin backend) ==========
// Requiere incluir: <script src="https://cdn.emailjs.com/dist/email.min.js"></script>
/*
async function enviarConEmailJS(formData) {
    // Inicializar EmailJS con tu User ID
    emailjs.init("TU_USER_ID");
    
    const templateParams = {
        from_name: formData.nombre,
        from_email: formData.email,
        empresa: formData.empresa,
        telefono: formData.telefono,
        servicio: formData.servicio,
        message: formData.mensaje
    };
    
    return emailjs.send('TU_SERVICE_ID', 'TU_TEMPLATE_ID', templateParams);
}
*/

// ========== ANIMACIONES DE LOS CAMPOS ==========
const inputs = document.querySelectorAll('.form-group input, .form-group select, .form-group textarea');

inputs.forEach(input => {
    // Animación al escribir
    input.addEventListener('input', (e) => {
        if (e.target.value) {
            e.target.style.borderColor = 'var(--primary-color)';
        } else {
            e.target.style.borderColor = 'rgba(0, 212, 255, 0.2)';
        }
    });
    
    // Efecto de focus
    input.addEventListener('focus', (e) => {
        e.target.parentElement.style.transform = 'translateY(-2px)';
    });
    
    input.addEventListener('blur', (e) => {
        e.target.parentElement.style.transform = 'translateY(0)';
    });
});

// ========== VALIDACIÓN EN TIEMPO REAL ==========
const emailInput = document.getElementById('email');
const telefonoInput = document.getElementById('telefono');

emailInput.addEventListener('blur', () => {
    if (emailInput.value && !validarEmail(emailInput.value)) {
        emailInput.style.borderColor = '#ef4444';
        emailInput.setCustomValidity('Email inválido');
    } else {
        emailInput.style.borderColor = '';
        emailInput.setCustomValidity('');
    }
});

telefonoInput.addEventListener('blur', () => {
    if (telefonoInput.value && !validarTelefono(telefonoInput.value)) {
        telefonoInput.style.borderColor = '#ef4444';
    } else {
        telefonoInput.style.borderColor = '';
    }
});

// ========== ANIMACIÓN DE SCROLL ==========
const contactSection = document.querySelector('.contact-section');

const observerOptions = {
    threshold: 0.2
};

const contactObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            
            // Animar las tarjetas de información
            const infoCards = document.querySelectorAll('.info-card');
            infoCards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateX(30px)';
                
                setTimeout(() => {
                    card.style.transition = 'all 0.6s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateX(0)';
                }, index * 100);
            });
        }
    });
}, observerOptions);

if (contactSection) {
    contactObserver.observe(contactSection);
}

// ========== CONTADOR DE CARACTERES PARA TEXTAREA ==========
const mensajeTextarea = document.getElementById('mensaje');
const maxLength = 1000;

if (mensajeTextarea) {
    // Crear contador
    const counter = document.createElement('div');
    counter.style.cssText = `
        text-align: right;
        font-size: 0.85rem;
        color: var(--text-secondary);
        margin-top: 0.25rem;
    `;
    mensajeTextarea.parentElement.appendChild(counter);
    
    // Actualizar contador
    function updateCounter() {
        const remaining = maxLength - mensajeTextarea.value.length;
        counter.textContent = `${mensajeTextarea.value.length} / ${maxLength} caracteres`;
        
        if (remaining < 50) {
            counter.style.color = '#ef4444';
        } else {
            counter.style.color = 'var(--text-secondary)';
        }
    }
    
    mensajeTextarea.addEventListener('input', updateCounter);
    mensajeTextarea.setAttribute('maxlength', maxLength);
    updateCounter();
}

console.log('✅ Formulario de contacto inicializado correctamente');