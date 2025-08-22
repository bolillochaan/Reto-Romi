/**
 * Script principal para la gestión de usuarios.
 */
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa el arreglo de usuarios en localStorage si no existe
    if (!localStorage.getItem('users')) {
        localStorage.setItem('users', JSON.stringify([]));
    }

    // Asegura que el usuario admin exista
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

    /**
     * Muestra una alerta Bootstrap en el formulario correspondiente.
     */
    function showAlert(message, type = 'success', form = 'register') {
        // Elimina alertas existentes
        const existingAlerts = document.querySelectorAll('.alert');
        existingAlerts.forEach(alert => alert.remove());

        const alertDiv = document.createElement('div');
        alertDiv.className = `alert alert-${type} alert-dismissible fade show`;
        alertDiv.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;

        // Inserta la alerta en el formulario correspondiente
        if (form === 'register') {
            registerForm.prepend(alertDiv);
        } else {
            loginForm.prepend(alertDiv);
        }

        // Elimina la alerta después de 5 segundos
        setTimeout(() => {
            if (alertDiv.parentNode) {
                alertDiv.remove();
            }
        }, 5000);
    }

    /**
     * Muestra un error usando SweetAlert2.
     */
    function showErrorAlert(message, title = 'Error') {
        Swal.fire({
            icon: 'error',
            title: title,
            text: message,
            confirmButtonText: 'Entendido'
        });
    }

    // Alternar visibilidad de contraseñas en los formularios
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

    /**
     * Verifica la fortaleza de la contraseña.
     */
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

    /**
     * Actualiza los requisitos visuales de la contraseña.
     */
    function updatePasswordRequirements(password) {
        const uppercaseReq = document.getElementById('uppercaseReq');
        const numberReq = document.getElementById('numberReq');
        const specialCharReq = document.getElementById('specialCharReq');
        const lengthReq = document.getElementById('lengthReq');
        if (!uppercaseReq || !numberReq || !specialCharReq || !lengthReq) return false;

        const requirements = checkPasswordStrength(password);

        // Actualiza los estilos de los requisitos
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
    if (passwordInput) {
        passwordInput.addEventListener('input', function() {
            updatePasswordRequirements(this.value);
        });
    }

    // Solo permite letras y espacios en nombres y apellidos
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

    // Maneja el registro de usuarios
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const firstName = document.getElementById('firstName').value.trim();
            const lastName = document.getElementById('lastName').value.trim();
            const email = document.getElementById('email').value.trim();
            const password = document.getElementById('password').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            // Validaciones de campos
            if (firstName === '' || lastName === '') {
                showErrorAlert('Por favor, ingresa tu nombre y apellidos.', 'Campos incompletos');
                return;
            }
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

            // Validación de email
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                showErrorAlert('Por favor, ingresa un correo electrónico válido con el formato: usuario@dominio.com', 'Correo electrónico inválido');
                return;
            }
            // Bloquea cualquier correo con dominio admin.com
            if (/@admin\.com$/i.test(email)) {
                showErrorAlert('No puedes registrar un usuario con el dominio "admin.com".', 'Correo no permitido');
                return;
            }

            // Verifica si el usuario ya existe
            const users = JSON.parse(localStorage.getItem('users'));
            if (users.some(user => user.email === email)) {
                showErrorAlert('Este correo electrónico ya está registrado. Por favor, utiliza otro correo o inicia sesión.', 'Usuario existente');
                return;
            }

            // Añade el nuevo usuario
            users.push({
                firstName,
                lastName,
                fullName: `${firstName} ${lastName}`,
                email,
                password // Nota: en producción, nunca guardar contraseñas en texto plano
            });
            localStorage.setItem('users', JSON.stringify(users));

            // Mensaje de éxito y cambio de pestaña
            Swal.fire({
                icon: 'success',
                title: '¡Registro exitoso!',
                text: 'Ahora puedes iniciar sesión.',
                confirmButtonText: 'Aceptar'
            });
            registerForm.reset();
            updatePasswordRequirements('');
            document.getElementById('login-tab').click();
        });
    }

    /**
     * Muestra u oculta la pestaña de administración.
     */
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

    // Maneja el inicio de sesión
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;

            if (!email || !password) {
                showErrorAlert('Por favor, ingresa tanto el correo electrónico como la contraseña.', 'Campos incompletos');
                return;
            }

            const users = JSON.parse(localStorage.getItem('users'));
            const user = users.find(user => user.email === email && user.password === password);

            if (user) {
                localStorage.setItem('currentUser', JSON.stringify(user));
                // Solo el admin puede ver el panel de administración
                if (email === 'admin@admin.com') {
                    toggleAdminTab(true);
                    renderAdminPanel(users);
                } else {
                    toggleAdminTab(false);
                }
                Swal.fire({
                    icon: 'success',
                    title: '¡Inicio de sesión exitoso!',
                    text: `Bienvenido/a, ${user.firstName}.`,
                    confirmButtonText: 'Aceptar'
                });
            } else {
                const emailExists = users.some(user => user.email === email);
                if (emailExists) {
                    showErrorAlert('La contraseña ingresada es incorrecta. Por favor, verifica tus credenciales.', 'Contraseña incorrecta');
                } else {
                    showErrorAlert('No existe una cuenta asociada a este correo electrónico. Por favor, regístrate primero.', 'Usuario no encontrado');
                }
            }
            loginForm.reset();
        });
    }

    /**
     * Renderiza el panel de administración con la lista de usuarios y el botón de cerrar sesión.
     */
    function renderAdminPanel(users) {
        adminContent.innerHTML = `
            <div class="d-flex justify-content-between align-items-center mb-4">
                <h3>Gestión de Usuarios</h3>
                <div>
                    <button class="btn btn-danger me-2" id="logoutAdmin">
                        <i class="bi bi-box-arrow-right"></i> Cerrar sesión
                    </button>
                    <button class="btn btn-success" id="downloadJson">
                        <i class="bi bi-download"></i> Descargar JSON
                    </button>
                </div>
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

        // Evento para cerrar sesión del admin
        document.getElementById('logoutAdmin').addEventListener('click', function() {
            localStorage.removeItem('currentUser');
            toggleAdminTab(false);
            Swal.fire({
                icon: 'info',
                title: 'Sesión cerrada',
                text: 'Has cerrado sesión como administrador.',
                confirmButtonText: 'Aceptar'
            });
            // Opcional: cambiar a la pestaña de login
            document.getElementById('login-tab').click();
        });

        // Evento para descargar usuarios en JSON
        document.getElementById('downloadJson').addEventListener('click', function() {
            downloadUsersJSON(users);
        });

        // Evento para eliminar usuarios
        document.querySelectorAll('.delete-user').forEach(button => {
            button.addEventListener('click', function() {
                const email = this.getAttribute('data-email');
                deleteUser(email);
            });
        });
    }

    /**
     * Descarga la lista de usuarios en formato JSON.
     */
    function downloadUsersJSON(users) {
        const dataStr = JSON.stringify(users, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
        const exportFileDefaultName = 'usuarios.json';

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();

        Swal.fire({
            icon: 'success',
            title: 'Descarga completada',
            text: 'El archivo JSON se ha descargado correctamente.',
            confirmButtonText: 'Aceptar',
            timer: 3000
        });
    }

    /**
     * Elimina un usuario y actualiza el panel de administración.
     */
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

    // Inicializa los requisitos de contraseña en rojo
    updatePasswordRequirements('');
});