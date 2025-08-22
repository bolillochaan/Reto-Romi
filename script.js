document.addEventListener('DOMContentLoaded', function() {
    // Inicializar datos si no existen
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    // Asegurar que el usuario admin exista
    let users = JSON.parse(localStorage.getItem('users'));
    if (!users.some(user => user.email === 'admin@admin.com')) {
        users.push({
            firstName: 'Admin',
            lastName: 'Principal',
            fullName: 'Admin Principal',
            email: 'admin@admin.com',
            password: 'Administrador123!'
        });
        localStorage.setItem('users', JSON.stringify(users));
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

    // Función para mostrar errores con SweetAlert
    function showErrorAlert(message, title = 'Error') {
        Swal.fire({
            icon: 'error',
            title: title,
            text: message,
            confirmButtonText: 'Entendido'
        });
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
                showErrorAlert('Por favor, ingresa tu nombre y apellidos.', 'Campos incompletos');
                return;
            }

            // Validar que solo haya letras y espacios
            const nameRegex = /^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/;
            if (!nameRegex.test(firstName) || !nameRegex.test(lastName)) {
                showErrorAlert('El nombre y los apellidos solo pueden contener letras y espacios.', 'Caracteres inválidos');
                return;
            }

            // Validación de contraseña
            const passwordStrength = checkPasswordStrength(password);
            if (!passwordStrength.isValid) {
                let errorMessage = 'La contraseña no cumple con los siguientes requisitos:';
                if (!passwordStrength.hasUpperCase) errorMessage += '\n- Al menos una letra mayúscula';
                if (!passwordStrength.hasNumber) errorMessage += '\n- Al menos un número';
                if (!passwordStrength.hasSpecialChar) errorMessage += '\n- Al menos un carácter especial';
                if (!passwordStrength.isLongEnough) errorMessage += '\n- Mínimo 8 caracteres de longitud';
                
                showErrorAlert(errorMessage, 'Contraseña débil');
                return;
            }

            if (password !== confirmPassword) {
                showErrorAlert('Las contraseñas no coinciden. Por favor, verifica que ambas contraseñas sean idénticas.', 'Contraseñas no coinciden');
                return;
            }

            // Validar formato de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showErrorAlert('Por favor, ingresa un correo electrónico válido con el formato: usuario@dominio.com', 'Correo electrónico inválido');
                return;
            }

            // Bloquear cualquier correo con dominio admin.com
            if (/@admin\.com$/i.test(email)) {
                showErrorAlert('No puedes registrar un usuario con el dominio "admin.com".', 'Correo no permitido');
                return;
            }
            
            // Obtener usuarios existentes
            const users = JSON.parse(localStorage.getItem('users'));
            
            // Verificar si el usuario ya existe
            if (users.some(user => user.email === email)) {
                showErrorAlert('Este correo electrónico ya está registrado. Por favor, utiliza otro correo o inicia sesión.', 'Usuario existente');
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
            
            // Validar que se hayan ingresado credenciales
            if (!email || !password) {
                showErrorAlert('Por favor, ingresa tanto el correo electrónico como la contraseña.', 'Campos incompletos');
                return;
            }
            
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
                
                // Mostrar mensaje de éxito with SweetAlert
                Swal.fire({
                    icon: 'success',
                    title: '¡Inicio de sesión exitoso!',
                    text: `Bienvenido/a, ${user.firstName}.`,
                    confirmButtonText: 'Aceptar'
                });
            } else {
                // Verificar si el correo existe pero la contraseña es incorrecta
                const emailExists = users.some(user => user.email === email);
                
                if (emailExists) {
                    showErrorAlert('La contraseña ingresada es incorrecta. Por favor, verifica tus credenciales.', 'Contraseña incorrecta');
                } else {
                    showErrorAlert('No existe una cuenta asociada a este correo electrónico. Por favor, regístrate primero.', 'Usuario no encontrado');
                }
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
        
        // Mostrar confirmación
        Swal.fire({
            icon: 'success',
            title: 'Descarga completada',
            text: 'El archivo JSON se ha descargado correctamente.',
            confirmButtonText: 'Aceptar',
            timer: 3000
        });
    }

    // Función para eliminar usuario
    function deleteUser(email) {
        Swal.fire({
            title: '¿Estás seguro?',
            text: "Esta acción eliminará permanentemente al usuario. ¡No podrás revertir esto!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#d33',
            cancelButtonColor: '#3085d6',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar'
        }).then((result) => {
            if (result.isConfirmed) {
                let users = JSON.parse(localStorage.getItem('users'));
                users = users.filter(user => user.email !== email);
                localStorage.setItem('users', JSON.stringify(users));
                
                // Volver a renderizar
                renderAdminPanel(users);
                
                Swal.fire(
                    '¡Eliminado!',
                    'El usuario ha sido eliminado correctamente.',
                    'success'
                );
            }
        });
    }

    // Al cargar la página, verifica si hay sesión activa y si es admin
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || 'null');
    if (currentUser && currentUser.email === 'admin@admin.com') {
        const users = JSON.parse(localStorage.getItem('users'));
        toggleAdminTab(true);
        renderAdminPanel(users);
    } else {
        toggleAdminTab(false);
    }

    // Inicializar los requisitos de contraseña en rojo
    updatePasswordRequirements('');
});