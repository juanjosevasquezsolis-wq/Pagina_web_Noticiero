document.addEventListener("DOMContentLoaded", function() {
    
    // ==========================================
    // 1. RELOJ/FECHA AUTOMÁTICA Y ESTADO DE SESIÓN
    // ==========================================
    const topBarFecha = document.getElementById('fecha-hoy');
    const userLogueado = localStorage.getItem('usuario_logueado');
    const btnSuscribete = document.querySelector('.btn-suscribete');

    // Si el usuario ya inició sesión, OCULTAMOS el botón de suscribirse
    if (userLogueado && btnSuscribete) {
        btnSuscribete.classList.add('oculto');
    }

    // Mostrar fecha y nombre
    if (topBarFecha) {
        const opciones = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
        const hoy = new Date();
        let fechaTexto = hoy.toLocaleDateString('es-ES', opciones);
        fechaTexto = fechaTexto.charAt(0).toUpperCase() + fechaTexto.slice(1);
        
        if (userLogueado) {
            topBarFecha.innerHTML = `${fechaTexto} | Bienvenido: <strong>${userLogueado}</strong>`;
        } else {
            topBarFecha.textContent = fechaTexto;
        }
    }

    // ==========================================
    // 2. LÓGICA DEL MODAL DE SUSCRIPCIÓN
    // ==========================================
    const modal = document.getElementById('modalSuscripcion');
    const btnCerrar = document.getElementById('cerrarModal');
    const formSusc = document.getElementById('formSuscripcion');

    // Abrir modal
    if (btnSuscribete && modal) {
        btnSuscribete.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
        });
    }

    // Cerrar modal con la "X"
    if (btnCerrar && modal) {
        btnCerrar.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Cerrar modal haciendo clic fuera
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Procesar el formulario de suscripción
    if (formSusc) {
        formSusc.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombre = document.getElementById('nombreSusc').value;
            const correo = document.getElementById('correoSusc').value;
            
            let suscriptores = JSON.parse(localStorage.getItem('bd_suscriptores')) || [];
            
            // Buscamos si el correo ya está registrado
            const usuarioExistente = suscriptores.find(s => s.correo === correo);

            if (usuarioExistente) {
                // SI YA EXISTE: No muestra error, lo loguea directamente
                localStorage.setItem('usuario_logueado', usuarioExistente.nombre);
                alert(`¡Hola de nuevo, ${usuarioExistente.nombre}! Tu sesión ha sido restaurada.`);
                formSusc.reset();
                modal.style.display = 'none';
                location.reload(); // Recarga para actualizar la barra superior
                return;
            }

            // SI ES NUEVO: Lo guarda en el array y lo loguea
            suscriptores.push({ nombre: nombre, correo: correo });
            localStorage.setItem('bd_suscriptores', JSON.stringify(suscriptores));
            localStorage.setItem('usuario_logueado', nombre);
            
            alert(`¡Gracias ${nombre}! Te has suscrito correctamente.`);
            formSusc.reset();
            modal.style.display = 'none';
            location.reload(); 
        });
    }

    // ==========================================
    // 3. LÓGICA DEL LOGIN (PÁGINA login.html)
    // ==========================================
    const formLogin = document.getElementById('formLogin');
    if (formLogin) {
        // Usuarios permitidos
        const usuarios = [
            { user: "juan", pass: "123456", nombre: "Juan (Admin)" },
            { user: "carlos", pass: "123456", nombre: "Carlos" }
        ];

        formLogin.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const userInput = document.getElementById('usuario').value.trim();
            const passInput = document.getElementById('contrasena').value.trim();
            const errorMsg = document.getElementById('loginError');

            const validUser = usuarios.find(u => u.user === userInput && u.pass === passInput);

            if (validUser) {
                localStorage.setItem('usuario_logueado', validUser.nombre);
                alert(`¡Bienvenido ${validUser.nombre}!`);
                window.location.href = 'index.html'; 
            } else {
                errorMsg.style.display = 'block';
            }
        });
    }
});