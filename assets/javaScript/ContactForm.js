// ========== FORMULARIO DE CONTACTO - CONFIGURADO PARA PHP BACKEND ==========

document.addEventListener('DOMContentLoaded', () => {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');
    
    if (!contactForm) {
        console.warn('⚠️ Formulario de contacto no encontrado');
        return;
    }
    
    console.log('✅ Formulario de contacto inicializado');

    // ========== CONFIGURACIÓN ==========
    const USE_PHP_BACKEND = true;
    
    function showMessage(message, type) {
        console.log(`📢 ${type}: ${message}`);
        
        // Alert nativo
        if (type === 'success') {
            alert('✅ ' + message);
        } else if (type === 'error') {
            alert('❌ ' + message);
        }
        
        // Mensaje visual
        if (formMessage) {
            formMessage.textContent = message;
            formMessage.className = `form-message ${type} show`;
            formMessage.style.display = 'block';
            formMessage.style.opacity = '1';
            
            formMessage.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            
            setTimeout(() => {
                formMessage.style.opacity = '0';
                setTimeout(() => {
                    formMessage.style.display = 'none';
                }, 300);
            }, 8000);
        }
    }

    function validarEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }

    function validarTelefono(telefono) {
        if (!telefono) return true;
        const regex = /^(\+?56)?(\s?)(0?9)(\s?)[98765]\d{7}$/;
        return regex.test(telefono.replace(/\s/g, ''));
    }

    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        console.log('📝 Procesando formulario...');
        
        const nombreEl = document.getElementById('nombre');
        const empresaEl = document.getElementById('empresa');
        const emailEl = document.getElementById('email');
        const telefonoEl = document.getElementById('telefono');
        const mensajeEl = document.getElementById('mensaje');
        
        if (!nombreEl || !emailEl || !mensajeEl) {
            showMessage('Error en la configuración del formulario', 'error');
            return;
        }
        
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
        
        // Deshabilitar botón
        const submitButton = contactForm.querySelector('.btn-submit');
        const buttonText = submitButton?.querySelector('.btn-text');
        const originalText = buttonText?.textContent || 'Enviar Mensaje';
        
        if (submitButton) {
            submitButton.disabled = true;
            submitButton.style.opacity = '0.7';
        }
        
        if (buttonText) {
            buttonText.textContent = 'Enviando...';
        }
        
        try {
            if (USE_PHP_BACKEND) {
                console.log('📤 Enviando con PHP backend...');
                await enviarConPHP(formData);
            } else {
                console.log('📤 Enviando con FormSubmit...');
                await enviarConFormSubmit(formData);
            }
            
            console.log('✅ Envío exitoso');
            showMessage('¡Mensaje enviado correctamente! Recibirás una confirmación en tu email.', 'success');
            contactForm.reset();
            
        } catch (error) {
            console.error('❌ Error:', error);
            showMessage('Hubo un error al enviar el mensaje. Por favor intenta nuevamente o escríbenos a contacto@mpdm.cl', 'error');
        } finally {
            if (submitButton) {
                submitButton.disabled = false;
                submitButton.style.opacity = '1';
            }
            if (buttonText) {
                buttonText.textContent = originalText;
            }
        }
    });

    // ========== ENVÍO CON PHP BACKEND ==========
    async function enviarConPHP(formData) {
        const response = await fetch('./send-email.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            },
            body: JSON.stringify(formData)
        });
        
        console.log('📬 Respuesta del servidor:', response.status, response.statusText);
        
        const result = await response.json();
        
        console.log('📄 Resultado:', result);
        
        if (!response.ok || !result.success) {
            throw new Error(result.message || 'Error al enviar');
        }
        
        return result;
    }

    // ========== ENVÍO CON FORMSUBMIT (BACKUP) ==========
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
            headers: { 'Accept': 'application/json' }
        });
        
        if (!response.ok) {
            throw new Error(`Error ${response.status}`);
        }
        
        return response;
    }

    // ========== ANIMACIONES Y VALIDACIONES ==========
    const inputs = document.querySelectorAll('.form-group input, .form-group textarea');

    inputs.forEach(input => {
        if (!input) return;
        
        input.addEventListener('input', (e) => {
            e.target.style.borderColor = e.target.value ? 'var(--azulPrincipal, #5234a5)' : 'rgba(0, 212, 255, 0.2)';
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

    // Validación email en tiempo real
    const emailInput = document.getElementById('email');
    if (emailInput) {
        emailInput.addEventListener('blur', () => {
            if (emailInput.value && !validarEmail(emailInput.value)) {
                emailInput.style.borderColor = '#ef4444';
            } else {
                emailInput.style.borderColor = '';
            }
        });
    }

    // Validación teléfono en tiempo real
    const telefonoInput = document.getElementById('telefono');
    if (telefonoInput) {
        telefonoInput.addEventListener('blur', () => {
            if (telefonoInput.value && !validarTelefono(telefonoInput.value)) {
                telefonoInput.style.borderColor = '#ef4444';
            } else {
                telefonoInput.style.borderColor = '';
            }
        });
    }

    // Contador de caracteres
    const mensajeTextarea = document.getElementById('mensaje');
    const maxLength = 1000;

    if (mensajeTextarea) {
        const existingCounter = mensajeTextarea.parentElement.querySelector('.character-counter');
        
        if (!existingCounter) {
            const counter = document.createElement('div');
            counter.className = 'character-counter';
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
                counter.style.color = mensajeTextarea.value.length > 950 ? '#ef4444' : '#999';
            }
            
            mensajeTextarea.addEventListener('input', updateCounter);
            mensajeTextarea.setAttribute('maxlength', maxLength);
            updateCounter();
        }
    }

    console.log('✅ Formulario configurado correctamente');
    console.log('📧 Método: PHP Backend');
    console.log('📍 Endpoint: ./send-email.php (ruta relativa)');
});