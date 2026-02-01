// Elementos que se moverán al hacer clic
const movingElements = document.querySelectorAll('.moving-element');
const section = document.querySelector('.inicio-section');

// Función para mover elementos al clic
section.addEventListener('click', function(event) {
    const x = event.clientX;
    const y = event.clientY;

    movingElements.forEach((element, index) => {
        // Añadir un retraso a cada elemento para efecto cascada
        setTimeout(() => {
            // Calcular la distancia y dirección del clic
            const rect = element.getBoundingClientRect();
            const elementCenterX = rect.left + rect.width / 2;
            const elementCenterY = rect.top + rect.height / 2;

            const distX = x - elementCenterX;
            const distY = y - elementCenterY;
            const distance = Math.sqrt(distX * distX + distY * distY);

            // Mover el elemento hacia el punto de clic
            const maxDistance = 150;
            const moveStrength = Math.min(maxDistance, distance / 5);

            const direction = Math.atan2(distY, distX);
            const moveX = Math.cos(direction) * moveStrength;
            const moveY = Math.sin(direction) * moveStrength;

            // Aplicar la transformación
            const currentTransform = window.getComputedStyle(element).transform;
            element.style.transform = `translate(${moveX}px, ${moveY}px)`;

            // Volver a la posición original después de 1 segundo
            setTimeout(() => {
                element.style.transform = 'translate(0, 0)';
            }, 1000);
        }, index * 100);
    });
});

// Actualizar navlinks activos al hacer scroll
const navLinks = document.querySelectorAll('.nav-link');
const sections = document.querySelectorAll('.section');

window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (pageYOffset >= sectionTop - 200) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href').slice(1) === current) {
            link.classList.add('active');
        }
    });
});

// Funcionalidad del formulario de contacto
const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        alert('¡Gracias por tu mensaje! Se enviará y te contactaremos pronto.');
        // Marcar como enviado para evitar bucles y luego enviar realmente el formulario
        this.dataset.submitted = 'true';
        this.submit();
    });
}

// Efecto de clic visual
section.addEventListener('click', function(event) {
    const ripple = document.createElement('div');
    ripple.style.position = 'fixed';
    ripple.style.left = event.clientX + 'px';
    ripple.style.top = event.clientY + 'px';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.5)';
    ripple.style.pointerEvents = 'none';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.animation = 'rippleEffect 0.6s ease-out forwards';
    ripple.style.zIndex = '999';

    document.body.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
});

// Añadir animación de ripple al CSS
const style = document.createElement('style');
style.innerHTML = `
    @keyframes rippleEffect {
        0% {
            width: 20px;
            height: 20px;
            opacity: 1;
        }
        100% {
            width: 100px;
            height: 100px;
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log('✅ Script cargado correctamente');

// ============================================
// SISTEMA DE AUTENTICACIÓN Y LOGIN
// ============================================

// Verificar si hay usuario logueado al cargar la página
window.addEventListener('DOMContentLoaded', () => {
    checkUserLogged();
});

// Función para verificar si hay usuario logueado
function checkUserLogged() {
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        showUserLogged(currentUser);
    } else {
        showNotLogged();
    }
}

// Mostrar botones de login/register
function showNotLogged() {
    document.getElementById('no-logged').classList.remove('hidden');
    document.getElementById('logged').classList.remove('active');
}

// Mostrar nombre de usuario y botón de logout
function showUserLogged(username) {
    document.getElementById('no-logged').classList.add('hidden');
    document.getElementById('logged').classList.add('active');
    document.getElementById('user-display').textContent = username;
}

// Toggle modal de login
function toggleLoginForm() {
    const modal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    modal.classList.toggle('active');
    registerModal.classList.remove('active');
}

// Cerrar modal de login
function closeLoginForm() {
    document.getElementById('login-modal').classList.remove('active');
}

// Toggle modal de registro
function toggleRegisterForm() {
    const modal = document.getElementById('register-modal');
    const loginModal = document.getElementById('login-modal');
    modal.classList.toggle('active');
    loginModal.classList.remove('active');
}

// Cerrar modal de registro
function closeRegisterForm() {
    document.getElementById('register-modal').classList.remove('active');
}

// Cambiar a formulario de login
function switchToLogin() {
    document.getElementById('register-modal').classList.remove('active');
    document.getElementById('login-modal').classList.add('active');
}

// Cambiar a formulario de registro
function switchToRegister() {
    document.getElementById('login-modal').classList.remove('active');
    document.getElementById('register-modal').classList.add('active');
}

// Manejar registro
function handleRegister(event) {
    event.preventDefault();
    
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const passwordConfirm = document.getElementById('register-password-confirm').value;
    
    // Validar que las contraseñas coincidan
    if (password !== passwordConfirm) {
        alert('Las contraseñas no coinciden');
        return;
    }
    
    // Validar que el email no esté registrado
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    if (users.some(user => user.email === email)) {
        alert('Este correo ya está registrado');
        return;
    }
    
    // Guardar nuevo usuario
    users.push({
        username: username,
        email: email,
        password: password
    });
    
    localStorage.setItem('users', JSON.stringify(users));
    alert('¡Registro exitoso! Ahora puedes iniciar sesión');
    
    // Limpiar formulario y cambiar a login
    document.getElementById('register-form').reset();
    switchToLogin();
}

// Manejar login
function handleLogin(event) {
    event.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    // Buscar usuario
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        // Guardar usuario actual
        localStorage.setItem('currentUser', user.username);
        localStorage.setItem('currentEmail', user.email);
        
        alert('¡Bienvenido ' + user.username + '!');
        
        // Cerrar modal y actualizar UI
        document.getElementById('login-modal').classList.remove('active');
        document.getElementById('login-form').reset();
        showUserLogged(user.username);
    } else {
        alert('Correo o contraseña incorrectos');
    }
}

// Logout
function logout() {
    const username = localStorage.getItem('currentUser');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('currentEmail');
    alert('Sesión cerrada. ¡Hasta luego ' + username + '!');
    showNotLogged();
}

// Cerrar modal al hacer clic afuera
window.addEventListener('click', (event) => {
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    
    if (event.target === loginModal) {
        loginModal.classList.remove('active');
    }
    if (event.target === registerModal) {
        registerModal.classList.remove('active');
    }
});

