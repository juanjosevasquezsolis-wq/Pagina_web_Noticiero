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

    if (btnSuscribete && modal) {
        btnSuscribete.addEventListener('click', function(e) {
            e.preventDefault();
            modal.style.display = 'block';
        });
    }

    if (btnCerrar && modal) {
        btnCerrar.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    if (formSusc) {
        formSusc.addEventListener('submit', function(e) {
            e.preventDefault();
            const nombre = document.getElementById('nombreSusc').value;
            const correo = document.getElementById('correoSusc').value;
            
            let suscriptores = JSON.parse(localStorage.getItem('bd_suscriptores')) || [];
            const usuarioExistente = suscriptores.find(s => s.correo === correo);

            if (usuarioExistente) {
                // Si ya existe, lo loguea directamente
                localStorage.setItem('usuario_logueado', usuarioExistente.nombre);
                alert(`¡Hola de nuevo, ${usuarioExistente.nombre}! Tu sesión ha sido restaurada.`);
                formSusc.reset();
                modal.style.display = 'none';
                location.reload(); 
                return;
            }

            // Si es nuevo, lo guarda
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

    // ==========================================
    // 4. LÓGICA DEL CARRUSEL (Solo en index.html)
    // ==========================================
    const slides = document.querySelectorAll('.hero');
    if (slides.length > 0) {
        const btnPrev = document.querySelector('.hero-prev') || document.getElementById('prevBtn');
        const btnNext = document.querySelector('.hero-next') || document.getElementById('nextBtn');
        let currentSlide = 0;
        let autoPlayInterval;

        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('activo'));
            if (index >= slides.length) currentSlide = 0;
            else if (index < 0) currentSlide = slides.length - 1;
            else currentSlide = index;
            slides[currentSlide].classList.add('activo');
        }

        if (btnNext && btnPrev) {
            btnNext.addEventListener('click', () => { showSlide(currentSlide + 1); resetAutoPlay(); });
            btnPrev.addEventListener('click', () => { showSlide(currentSlide - 1); resetAutoPlay(); });
        }

        function startAutoPlay() {
            autoPlayInterval = setInterval(() => { showSlide(currentSlide + 1); }, 6000); // 6 segundos
        }
        function resetAutoPlay() {
            clearInterval(autoPlayInterval);
            startAutoPlay();
        }
        startAutoPlay();
    }
});