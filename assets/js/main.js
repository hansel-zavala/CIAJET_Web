document.addEventListener('DOMContentLoaded', function () {
     const mobileMenuButton = document.getElementById('mobile-menu-button');
     const mobileMenu = document.getElementById('mobile-menu');
     const mobileMenuBackdrop = document.getElementById('mobile-menu-backdrop');
     const header = document.querySelector('header');
     const navLinks = document.querySelectorAll('.nav-link');
     const sections = document.querySelectorAll('section');

     // Variables para el comportamiento del header
     let lastScrollTop = 0;
     let scrollThrottle;
     let isHeaderVisible = true;

     // Inicializar el estado del header
     header.classList.add('translate-y-0');

     // Lógica para el menú móvil
     mobileMenuButton.addEventListener('click', () => {
         mobileMenu.classList.toggle('hidden');
         mobileMenuBackdrop.classList.toggle('hidden');

         if (!mobileMenu.classList.contains('hidden')) {
             mobileMenu.classList.add('show');
             // Mostrar header cuando se abre el menú móvil
             header.classList.remove('-translate-y-full');
             header.classList.add('translate-y-0');
             isHeaderVisible = true;
             // Bloquear el scroll del body cuando el menú está abierto
             document.body.style.overflow = 'hidden';
         } else {
             mobileMenu.classList.remove('show');
             // Restaurar el comportamiento del header cuando se cierra el menú
             // El header mantendrá su posición actual pero podrá ocultarse nuevamente con el scroll
             document.body.style.overflow = '';
         }
     });

     // Cerrar menú móvil al hacer clic en el backdrop
     mobileMenuBackdrop.addEventListener('click', () => {
         mobileMenu.classList.add('hidden');
         mobileMenuBackdrop.classList.add('hidden');
         mobileMenu.classList.remove('show');
         document.body.style.overflow = '';
     });

     // Cerrar menú móvil al hacer clic fuera del área del menú
     mobileMenu.addEventListener('click', (e) => {
         if (e.target === mobileMenu) {
             mobileMenu.classList.add('hidden');
             mobileMenuBackdrop.classList.add('hidden');
             mobileMenu.classList.remove('show');
             document.body.style.overflow = '';
         }
     });

    // Cerrar menú móvil al hacer clic en un enlace
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Suavizar el scroll
            e.preventDefault();
            const targetId = link.getAttribute('href');
            document.querySelector(targetId).scrollIntoView({
                behavior: 'smooth'
            });

            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuBackdrop.classList.add('hidden');
                mobileMenu.classList.remove('show');
                // Asegurar que el header esté visible cuando se cierra el menú
                header.classList.remove('-translate-y-full');
                header.classList.add('translate-y-0');
                isHeaderVisible = true;
                document.body.style.overflow = '';
            }
        });
    });

    // Lógica para resaltar el enlace activo al hacer scroll
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.4
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const id = entry.target.getAttribute('id');
                // Quitar clase activa de todos
                document.querySelectorAll('.nav-link').forEach(link => {
                   link.classList.remove('nav-link-active');
                });
                
                // Añadir clase activa al enlace correspondiente
                const activeLinks = document.querySelectorAll(`.nav-link[href="#${id}"]`);
                activeLinks.forEach(activeLink => {
                    if (activeLink) {
                        activeLink.classList.add('nav-link-active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Función para controlar el comportamiento del header con el scroll
    function handleHeaderScroll() {
        const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

        // Si el menú móvil está abierto, no hacer nada
        if (!mobileMenu.classList.contains('hidden')) {
            return;
        }

        // Si está en la parte superior (menos de 50px), siempre mostrar header
        if (scrollTop < 50) {
            header.classList.remove('-translate-y-full');
            header.classList.add('translate-y-0');
            isHeaderVisible = true;
            lastScrollTop = scrollTop;
            return;
        }

        // Si hay scroll hacia abajo y el usuario ha bajado más de 100px
        if (scrollTop > lastScrollTop && scrollTop > 100) {
            // Ocultar header solo si está visible
            if (isHeaderVisible) {
                header.classList.remove('translate-y-0');
                header.classList.add('-translate-y-full');
                isHeaderVisible = false;
            }
        } else if (scrollTop < lastScrollTop && scrollTop > 50) {
            // Mostrar header cuando hay scroll hacia arriba
            if (!isHeaderVisible) {
                header.classList.remove('-translate-y-full');
                header.classList.add('translate-y-0');
                isHeaderVisible = true;
            }
        }

        lastScrollTop = scrollTop <= 0 ? 0 : scrollTop; // Para móvil o negativo
    }

    // Event listener para el scroll con throttling
    window.addEventListener('scroll', function() {
        if (scrollThrottle) {
            clearTimeout(scrollThrottle);
        }
        scrollThrottle = setTimeout(handleHeaderScroll, 10);
    });
});
