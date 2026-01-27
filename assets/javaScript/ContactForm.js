// ========== FORMULARIO DE CONTACTO - VERSIÓN CORREGIDA SIN SERVICIO ==========

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    // Si no existe el formulario, salir
    if (!contactForm) {
        console.warn('Formulario de contacto no encontrado en esta página');
        return;
    }
    
    console.log('Formulario de contacto encontrado, inicializando...');

    // Función para mostrar mensajes
    function showMessage(message, type) {
        console.log(`📢 Mostrando mensaje: ${type} - ${message}`);
        
        // Alert nativo (siempre visible)
        if (type === 'success') {
            alert(' ' + message);
        } else if (type === 'error') {
            alert('❌ ' + message);
        }
        
        // Mensaje en el formulario (si existe)
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type} show`;
            formMessage.style.display = 'block';
            formMessage.style.opacity = '1';
            
            // Scroll suave al mensaje
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            // Ocultar después de 8 segundos
            setTimeout(() => {
                formMessage.style.opacity = '0';
                setTimeout(() => {
                    formMessage.style.display = 'none';
                    formMessage.classList.remove('show');
                }, 300);
            }, 8000);
        }
    }

    // Función para validar email
    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    // Función para validar teléfono chileno (opcional)
    function validarTelefono(telefono) {
        if (!telefono) return true;
        const regex = /^(\+?56)?(\s?)(0?9)(\s?)[98765]\d{7}$/;
        return regex.test(telefono.replace(/\s/g, ''));
    }

    // Event listener del formulario
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('📝 Formulario enviado, procesando...');
        
        // Obtener elementos del formulario
        const nombreEl = document.getElementById('nombre');
        const empresaEl = document.getElementById('empresa');
        const emailEl = document.getElementById('email');
        const telefonoEl = document.getElementById('telefono');
        const mensajeEl = document.getElementById('mensaje');
        
        // Verificar que los elementos obligatorios existen
        if (!nombreEl || !emailEl || !mensajeEl) {
            const error = 'Error: Faltan elementos del formulario';
            console.error('❌', error);
            showMessage(error, 'error');
            return;
        }
        
        // Obtener valores del formulario
        const formData = {
            nombre: nombreEl.value.trim(),
            empresa: empresaEl ? empresaEl.value.trim() : '',
            email: emailEl.value.trim(),
            telefono: telefonoEl ? telefonoEl.value.trim() : '',
            mensaje: mensajeEl.value.trim()
        };
        
        console.log('📋 Datos del formulario:', formData);
        
        // Validaciones
        if (!formData.nombre || !formData.email || !formData.mensaje) {
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
        
        // Deshabilitar botón mientras se envía
        const submitButton = contactForm.querySelector('.btn-submit');
        const buttonText = submitButton ? submitButton.querySelector('.btn-text') : null;
        const originalText = buttonText ? buttonText.textContent : 'Enviar Mensaje';
        
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.style.opacity = '0.7';
            submitButton.style.cursor = 'not-allowed';
        }
        
        if (buttonText) {
            buttonText.textContent = 'Enviando...';
        }
        
        console.log('📤 Enviando a FormSubmit...');
        
        try {
            // Envío con FormSubmit
            await enviarConFormSubmit(formData);
            
            console.log('✅ Envío exitoso');
            
            // Mostrar mensaje de éxito
            showMessage('¡Mensaje enviado correctamente!', 'success');
            
            // Limpiar formulario
            contactForm.reset();
            
        } catch (error) {
            console.error('❌ Error al enviar:', error);
            showMessage('Hubo un error al enviar el mensaje. Por favor intenta nuevamente o escríbenos a contacto@mpdm.cl', 'error');
        } finally {
            // Rehabilitar botón
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
                submitButton.style.cursor = 'pointer';
            }
            
            if (buttonText) {
                buttonText.textContent = originalText;
            }
        }
    });

    // ========== ENVÍO CON FORMSUBMIT ==========
    async function enviarConFormSubmit(formData) {
        const form = new FormData();
        form.append('name', formData.nombre);
        form.append('email', formData.email);
        form.append('Empresa', formData.empresa || 'No especificada');
        form.append('Teléfono', formData.telefono || 'No especificado');
        form.append('message', formData.mensaje);
        
        const response = await fetch('https://formsubmit.co/contacto@mpdm.cl', {
            method: 'POST',
            body: form,
            headers: {
                'Accept': 'application/json'
            }
        });
        
        console.log('📬 Respuesta de FormSubmit:', response.status, response.statusText);
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}: ${response.statusText}`);
        }
        
        return response;
    }

    // ========== ANIMACIONES DE LOS CAMPOS ==========
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');

    inputs.forEach(input => {
        if (!input) return;
        
        input.addEventListener('input', (e) => {
            if (e.target.value) {
                e.target.style.borderColor = 'var(--azulPrincipal, #5234a5)';
            } else {
                e.target.style.borderColor = 'rgba(0, 212, 255, 0.2)';
            }
        });
        
        input.addEventListener('focus', (e) => {
            if (e.target.parentElement) {
                e.target.parentElement.style.transform = 'translateY(-2px)';
            }
        });
        
        input.addEventListener('blur', (e) => {
            if (e.target.parentElement) {
                e.target.parentElement.style.transform = 'translateY(0)';
            }
        });
    });

    // ========== VALIDACIÓN EN TIEMPO REAL ==========
    const emailInput = document.getElementById('email');
    const telefonoInput = document.getElementById('telefono');

    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (emailInput.value && !validarEmail(emailInput.value)) {
                emailInput.style.borderColor = '#ef4444';
            } else {
                emailInput.style.borderColor = '';
            }
        });
    }

    if (telefonoInput) {
        telefonoInput.addEventListener('blur', () => {
            if (telefonoInput.value && !validarTelefono(telefonoInput.value)) {
                telefonoInput.style.borderColor = '#ef4444';
            } else {
                telefonoInput.style.borderColor = '';
            }
        });
    }

    // ========== CONTADOR DE CARACTERES (EVITAR DUPLICACIÓN) ==========
    const mensajeTextarea = document.getElementById('mensaje');
    const maxLength = 1000;

    if (mensajeTextarea) {
        // Verificar si ya existe un contador
        const existingCounter = mensajeTextarea.parentElement.querySelector('.character-counter');
        
        if (!existingCounter) {
            // Crear contador solo si no existe
            const counter = document.createElement('div');
            counter.className = 'character-counter'; // Clase para identificarlo
            counter.style.cssText = `
                text-align: right;
                font-size: 0.85rem;
                color: #999;
                margin-top: 0.25rem;
            `;
            
            if (mensajeTextarea.parentElement) {
                mensajeTextarea.parentElement.appendChild(counter);
            }
            
            function updateCounter() {
                counter.textContent = `${mensajeTextarea.value.length} / ${maxLength} caracteres`;
                
                if (mensajeTextarea.value.length > 950) {
                    counter.style.color = '#ef4444';
                } else {
                    counter.style.color = '#999';
                }
            }
            
            mensajeTextarea.addEventListener('input', updateCounter);
            mensajeTextarea.setAttribute('maxlength', maxLength);
            updateCounter();
            
            console.log('✅ Contador de caracteres inicializado');
        } else {
            console.log('ℹ️ Contador de caracteres ya existe');
        }
    }

    console.log('✅ Formulario de contacto inicializado correctamente');
    console.log('📧 Los mensajes se enviarán a: contacto@mpdm.cl');
});
