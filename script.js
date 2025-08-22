document.addEventListener('DOMContentLoaded', function() {
    // Inicializar datos si no existen
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    // Referencias a elementos del DOM
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const togglePassword = document.getElementById('togglePassword');
    const toggleConfirmPassword = document.getElementById('toggleConfirmPassword');
    const toggleLoginPassword = document.getElementById('toggleLoginPassword');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const loginPasswordInput = document.getElementById('loginPassword');
    const adminContent = document.getElementById('adminContent');

    // Función para mostrar notificaciones
    function showAlert(message, type = 'success', form = 'register') {
        // Eliminar alertas existentes primero
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());
        
        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        // Insertar la alerta al principio del formulario correspondiente
        if (form === 'register') {
            registerForm.prepend(alertDiv);
        } else {
            loginForm.prepend(alertDiv);
        }
        
        // Eliminar la alerta después de 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    // Alternar visibilidad de contraseña
    if (togglePassword) {
        togglePassword.addEventListener('click', function() {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('bi-eye');
            this.querySelector('i').classList.toggle('bi-eye-slash');
        });
    }

    if (toggleConfirmPassword) {
        toggleConfirmPassword.addEventListener('click', function() {
            const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            confirmPasswordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('bi-eye');
            this.querySelector('i').classList.toggle('bi-eye-slash');
        });
    }

    if (toggleLoginPassword) {
        toggleLoginPassword.addEventListener('click', function() {
            const type = loginPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            loginPasswordInput.setAttribute('type', type);
            this.querySelector('i').classList.toggle('bi-eye');
            this.querySelector('i').classList.toggle('bi-eye-slash');
        });
    }

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
        
        // Si los elementos no existen, salir de la función
        if (!uppercaseReq || !numberReq || !specialCharReq || !lengthReq) {
            return false;
        }
        
        const requirements = checkPasswordStrength(password);
        
        // Actualizar mayúsculas
        uppercaseReq.classList.toggle('text-success', requirements.hasUpperCase);
        uppercaseReq.classList.toggle('text-danger', !requirements.hasUpperCase);
        uppercaseReq.querySelector('i').className = requirements.hasUpperCase ? 'bi bi-check-circle' : 'bi bi-x-circle';
        
        // Actualizar números
        numberReq.classList.toggle('text-success', requirements.hasNumber);
        numberReq.classList.toggle('text-danger', !requirements.hasNumber);
        numberReq.querySelector('i').className = requirements.hasNumber ? 'bi bi-check-circle' : 'bi bi-x-circle';
        
        // Actualizar caracteres especiales
        specialCharReq.classList.toggle('text-success', requirements.hasSpecialChar);
        specialCharReq.classList.toggle('text-danger', !requirements.hasSpecialChar);
        specialCharReq.querySelector('i').className = requirements.hasSpecialChar ? 'bi bi-check-circle' : 'bi bi-x-circle';
        
        // Actualizar longitud
        lengthReq.classList.toggle('text-success', requirements.isLongEnough);
        lengthReq.classList.toggle('text-danger', !requirements.isLongEnough);
        lengthReq.querySelector('i').className = requirements.isLongEnough ? 'bi bi-check-circle' : 'bi bi-x-circle';
        
        return requirements.isValid;
    }

    // Validación en tiempo real de la contraseña
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            updatePasswordRequirements(this.value);
        });
    }

    // Validación en tiempo real para nombres y apellidos
    const firstNameInput = document.getElementById('firstName');
    const lastNameInput = document.getElementById('lastName');
    const onlyLetters = /[^A-Za-zÁÉÍÓÚáéíóúÑñ\s]/g;

    if (firstNameInput) {
        firstNameInput.addEventListener('input', function() {
            this.value = this.value.replace(onlyLetters, '');
        });
    }
    if (lastNameInput) {
        lastNameInput.addEventListener('input', function() {
            this.value = this.value.replace(onlyLetters, '');
        });
    }

    // Manejar el registro de usuarios
    if (registerForm) {
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

            // Validar que solo haya letras y espacios
            const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
            if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
                showAlert('El nombre y los apellidos solo pueden contener letras y espacios.', 'danger');
                return;
            }

            // Validación de contraseña
            const passwordStrength = checkPasswordStrength(password);
            if (!passwordStrength.isValid) {
                showAlert('La contraseña debe contener al menos una mayúscula, un número, un carácter especial y tener al menos 8 caracteres.', 'danger');
                return;
            }

            if (password !== confirmPassword) {
                showAlert('Las contraseñas no coinciden.', 'danger');
                return;
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showAlert('Por favor, ingresa un correo electrónico válido.', 'danger');
                return;
            }
            
            // Obtener usuarios existentes
            const users = JSON.parse(localStorage.getItem('users'));
            
            // Verificar si el usuario ya existe
            if (users.some(user => user.email === email)) {
                showAlert('Este correo electrónico ya está registrado.', 'danger');
                return;
            }
            
            // Añadir nuevo usuario
            users.push({
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`,
                email,
                password // En una aplicación real, esto debería estar encriptado
            });
            
            // Guardar en localStorage
            localStorage.setItem('users', JSON.stringify(users));
            
            // Mostrar mensaje de éxito con SweetAlert
            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Ahora puedes iniciar sesión.',
                confirmButtonText: 'Aceptar'
            });
            
            // Limpiar formulario
            registerForm.reset();
            
            // Resetear los indicadores de contraseña
            updatePasswordRequirements('');
            
            // Cambiar a la pestaña de login
            document.getElementById('login-tab').click();
        });
    }

    // Función para mostrar/ocultar la pestaña y sección de administración
    function toggleAdminTab(show) {
        const adminTabItem = document.getElementById('admin-tab-item');
        const adminTabPane = document.getElementById('admin');
        if (adminTabItem && adminTabPane) {
            if (show) {
                adminTabItem.classList.remove('d-none');
                adminTabPane.classList.remove('d-none');
            } else {
                adminTabItem.classList.add('d-none');
                adminTabPane.classList.add('d-none');
            }
        }
    }

    // Manejar el inicio de sesión
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            
            // Obtener usuarios
            const users = JSON.parse(localStorage.getItem('users'));
            
            // Buscar usuario
            const user = users.find(user => user.email === email && user.password === password);
            
            if (user) {
                // Guardar sesión
                localStorage.setItem('currentUser', JSON.stringify(user));
                
                // Mostrar contenido de administración si es el correo específico
                if (email === 'admin@example.com') {
                    toggleAdminTab(true);
                    renderAdminPanel(users);
                } else {
                    toggleAdminTab(false);
                }
                
                // Mostrar mensaje de éxito con SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: '¡Inicio de sesión exitoso!',
                    text: 'Bienvenido.',
                    confirmButtonText: 'Aceptar'
                });
            } else {
                showAlert('Credenciales incorrectas. Inténtalo de nuevo.', 'danger', 'login');
            }
            
            // Limpiar formulario
            loginForm.reset();
        });
    }

    // Función para renderizar el panel de administración
    function renderAdminPanel(users) {
        adminContent.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Gestión de Usuarios</h3>
                <button class="btn btn-success" id="downloadJson">
                    <i class="bi bi-download"></i> Descargar JSON
                </button>
            </div>
            <div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Apellidos</th>
                            <th>Correo Electrónico</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${users.map(user => `
                            <tr>
                                <td>${user.firstName}</td>
                                <td>${user.lastName}</td>
                                <td>${user.email}</td>
                                <td>
                                    <button class="btn btn-sm btn-danger delete-user" data-email="${user.email}">
                                        <i class="bi bi-trash"></i> Eliminar
                                    </button>
                                </td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>
        `;

        // Agregar evento para descargar JSON
        document.getElementById('downloadJson').addEventListener('click', function() {
            downloadUsersJSON(users);
        });

        // Agregar eventos para eliminar usuarios
        document.querySelectorAll('.delete-user').forEach(button => {
            button.addEventListener('click', function() {
                const email = this.getAttribute('data-email');
                deleteUser(email);
            });
        });
    }

    // Función para descargar usuarios en formato JSON
    function downloadUsersJSON(users) {
        const dataStr = JSON.stringify(users, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);
        
        const exportFileDefaultName = 'usuarios.json';
        
        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    }

    // Función para eliminar usuario
    function deleteUser(email) {
        let users = JSON.parse(localStorage.getItem('users'));
        users = users.filter(user => user.email !== email);
        localStorage.setItem('users', JSON.stringify(users));
        
        // Volver a renderizar
        renderAdminPanel(users);
    }

    // Al cargar la página, verifica si hay sesión activa y si es admin
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser && currentUser.email === 'admin@example.com') {
        const users = JSON.parse(localStorage.getItem('users'));
        toggleAdminTab(true);
        renderAdminPanel(users);
    } else {
        toggleAdminTab(false);
    }

    // Inicializar los requisitos de contraseña (mostrar todos en rojo)
    updatePasswordRequirements('');
});