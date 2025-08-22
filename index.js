// Función para verificar fortaleza de la contraseña en tiempo real
function checkPasswordStrength(password) {
    const hasUpperCase = /[A-Z]/.test(password);
    const hasNumber = /[0-9]/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    const isLongEnough = password.length >= 8;
    
    return {
        isValid: hasUpperCase && hasNumber && hasSpecialChar && isLongEnough,
        hasUpperCase,
        hasNumber,
        hasSpecialChar,
        isLongEnough
    };
}

// Función para actualizar la visualización de requisitos de contraseña
function updatePasswordRequirements(password) {
    const uppercaseReq = document.getElementById('uppercaseReq');
    const numberReq = document.getElementById('numberReq');
    const specialCharReq = document.getElementById('specialCharReq');
    const lengthReq = document.getElementById('lengthReq');
    
    const requirements = checkPasswordStrength(password);
    
    // Actualizar visualización de requisitos
    uppercaseReq.classList.toggle('text-success', requirements.hasUpperCase);
    uppercaseReq.classList.toggle('text-danger', !requirements.hasUpperCase);
    uppercaseReq.querySelector('i').className = requirements.hasUpperCase ? 'bi bi-check-circle' : 'bi bi-x-circle';
    
    numberReq.classList.toggle('text-success', requirements.hasNumber);
    numberReq.classList.toggle('text-danger', !requirements.hasNumber);
    numberReq.querySelector('i').className = requirements.hasNumber ? 'bi bi-check-circle' : 'bi bi-x-circle';
    
    specialCharReq.classList.toggle('text-success', requirements.hasSpecialChar);
    specialCharReq.classList.toggle('text-danger', !requirements.hasSpecialChar);
    specialCharReq.querySelector('i').className = requirements.hasSpecialChar ? 'bi bi-check-circle' : 'bi bi-x-circle';
    
    lengthReq.classList.toggle('text-success', requirements.isLongEnough);
    lengthReq.classList.toggle('text-danger', !requirements.isLongEnough);
    lengthReq.querySelector('i').className = requirements.isLongEnough ? 'bi bi-check-circle' : 'bi bi-x-circle';
    
    return requirements.isValid;
}

// Validación en tiempo real de la contraseña
document.getElementById('password').addEventListener('input', function() {
    updatePasswordRequirements(this.value);
});

// Modificar la validación en el evento submit del formulario de registro
// Reemplazar la validación actual de contraseña con:
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validaciones básicas
    if (firstName === '' || lastName === '') {
        showAlert('Por favor, ingresa tu nombre y apellidos.', 'danger');
        return;
    }
    
    // Validación de contraseña (REEMPLAZA ESTA PARTE)
    const passwordStrength = checkPasswordStrength(password);
    if (!passwordStrength.isValid) {
        showAlert('La contraseña debe contener al menos una mayúscula, un número, un carácter especial y tener al menos 8 caracteres.', 'danger');
        return;
    }
    
    if (password !== confirmPassword) {
        showAlert('Las contraseñas no coinciden.', 'danger');
        return;
    }
    
    // ... el resto del código del submit ...