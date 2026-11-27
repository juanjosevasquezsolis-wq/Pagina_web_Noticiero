document.addEventListener("DOMContentLoaded", function() {

    // ==========================================
    // 1. RELOJ/FECHA AUTOMÁTICA Y ESTADO DE SESIÓN
    // ==========================================
    const topBarFecha = document.getElementById('fecha-hoy');
    const userLogueado = localStorage.getItem('usuario_logueado');
    const btnSuscribete = document.querySelector('.btn-suscribete');

    if (userLogueado && btnSuscribete) {
        btnSuscribete.classList.add('oculto');
    }

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
                localStorage.setItem('usuario_logueado', usuarioExistente.nombre);
                alert(`¡Hola de nuevo, ${usuarioExistente.nombre}! Tu sesión ha sido restaurada.`);
                formSusc.reset();
                modal.style.display = 'none';
                location.reload();
                return;
            }

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
    // 4. ROTADOR DE NOTICIA PRINCIPAL
    // ==========================================
    const hero = document.getElementById("hero");
    if (hero) {
        const noticias = [
            {
                imagen: "images/papa-leon-xiv-llegada.jpg",
                exclusiva: true,
                etiqueta: "Cultura",
                titulo: "El papa León XIV llega a Perú, su patria adoptiva",
                resumen: "El pontífice aterrizó en el Callao para iniciar su primera visita apostólica al país donde vivió más de veinte años y fue obispo de Chiclayo.",
                nombre: "Redacción",
                cargo: "Equipo de Cultura",
                enlace: "cultura.html"
            },
            {
                imagen: "images/nvidia-huang-regresa.jpg",
                exclusiva: false,
                etiqueta: "Tecnología",
                titulo: "Nvidia vuelve a nombrar a Jensen Huang como CEO",
                resumen: "Las acciones subieron con fuerza once días después de su renuncia, aunque siguen abiertas las dudas sobre el presunto espionaje.",
                nombre: "Redacción",
                cargo: "Equipo de Tecnología",
                enlace: "tecnologia.html"
            },
            {
                imagen: "images/keiko-cade-2026.jpg",
                exclusiva: false,
                etiqueta: "Política",
                titulo: "Keiko Fujimori cierra CADE Ejecutivos 2026 en Cusco",
                resumen: "La presidenta cuestionó a los gobiernos anteriores y afirmó que el Perú puede volver a crecer por encima del 5%.",
                nombre: "Redacción",
                cargo: "Equipo de Política",
                enlace: "politica.html"
            },
            {
                imagen: "images/presupuesto-2027.jpg",
                exclusiva: false,
                etiqueta: "Economía",
                titulo: "Aprueban la ley de presupuesto 2027 diez días antes del plazo",
                resumen: "El Gobierno destacó que la norma fue aprobada el 20 de noviembre.",
                nombre: "Redacción",
                cargo: "Equipo de Economía",
                enlace: "economia.html"
            },
            {
                imagen: "images/mineros-reinfo.jpg",
                exclusiva: false,
                etiqueta: "Economía",
                titulo: "Mineros artesanales marchan para exigir ampliar el Reinfo",
                resumen: "Convocaron una movilización nacional el 23 de noviembre para pedir más plazo en el registro de formalización.",
                nombre: "Redacción",
                cargo: "Equipo de Economía",
                enlace: "economia.html"
            }
        ];

        const TIEMPO = 6000; // 6 segundos (si lo cambias, cambia también 6s en el CSS)
        let indice = 0;
        let intervalo;
        let cambiando = false;

        const contPuntos = document.getElementById("hero-puntos");
        const barra = document.getElementById("hero-barra-progreso");

        noticias.forEach((_, i) => {
            const punto = document.createElement("button");
            punto.className = "hero-punto" + (i === 0 ? " activo" : "");
            punto.setAttribute("aria-label", "Ir a la noticia " + (i + 1));
            punto.addEventListener("click", () => irA(i));
            contPuntos.appendChild(punto);
        });
        const puntos = contPuntos.querySelectorAll(".hero-punto");

        function mostrar(i) {
            const n = noticias[i];
            document.getElementById("hero-imagen").style.backgroundImage = `url('${n.imagen}')`;
            document.getElementById("hero-badge").style.display = n.exclusiva ? "inline-block" : "none";
            document.getElementById("hero-etiqueta").textContent = n.etiqueta;
            document.getElementById("hero-titulo").textContent = n.titulo;
            document.getElementById("hero-resumen").textContent = n.resumen;
            document.getElementById("hero-nombre").textContent = n.nombre;
            document.getElementById("hero-cargo").textContent = n.cargo;
            document.getElementById("hero-enlace").href = n.enlace;
            puntos.forEach((p, k) => p.classList.toggle("activo", k === i));
        }

        function reiniciarBarra() {
            barra.classList.remove("correr");
            void barra.offsetWidth;
            barra.classList.add("correr");
        }

        function irA(i) {
            if (cambiando || i === indice) return;
            cambiando = true;
            hero.classList.add("hero-fade");
            setTimeout(() => {
                indice = (i + noticias.length) % noticias.length;
                mostrar(indice);
                hero.classList.remove("hero-fade");
                cambiando = false;
            }, 500);
            reiniciarTemporizador();
        }

        function siguiente() { irA((indice + 1) % noticias.length); }
        function anterior()  { irA((indice - 1 + noticias.length) % noticias.length); }

        function reiniciarTemporizador() {
            clearInterval(intervalo);
            intervalo = setInterval(siguiente, TIEMPO);
            reiniciarBarra();
        }

        function pausar() { clearInterval(intervalo); }

        document.getElementById("hero-next").addEventListener("click", siguiente);
        document.getElementById("hero-prev").addEventListener("click", anterior);

        hero.addEventListener("mouseenter", pausar);
        hero.addEventListener("mouseleave", reiniciarTemporizador);

        reiniciarTemporizador();
    }

});