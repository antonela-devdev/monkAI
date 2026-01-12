document.addEventListener('DOMContentLoaded', function () {

    // --- Scroll Animations (Intersection Observer) ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target); // Only animate once
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.animate-up, .animate-left, .animate-right, .animate-fade');
    animatedElements.forEach(el => observer.observe(el));


    // --- Hero Parallax Effect ---
    const heroSection = document.getElementById('home');
    const shapes = document.querySelectorAll('.shape');
    // const orbWrappers = document.querySelectorAll('.orb-wrapper'); // Removed

    if (heroSection && shapes.length > 0) {
        heroSection.addEventListener('mousemove', (e) => {
            const x = e.clientX / window.innerWidth;
            const y = e.clientY / window.innerHeight;

            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 20; // Different speed for each shape
                const xOffset = (window.innerWidth / 2 - e.clientX) / speed;
                const yOffset = (window.innerHeight / 2 - e.clientY) / speed;

                shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            });
        });
    }

    // --- Dynamic Tech Orbs (JS-Driven) ---
    const orbContainer = document.getElementById('orb-container');
    if (orbContainer) {
        const orbCount = 30;
        const sizes = ['orb-sm', 'orb-md', 'orb-lg', 'orb-xl', 'orb-xxl'];
        const colors = ['orb-orange', 'orb-yellow'];

        for (let i = 0; i < orbCount; i++) {
            const orb = document.createElement('div');

            // Random Classes
            const sizeClass = sizes[Math.floor(Math.random() * sizes.length)];
            const colorClass = colors[Math.floor(Math.random() * colors.length)];
            orb.classList.add('tech-orb', sizeClass, colorClass, 'dynamic-enter');

            // Final Position (Random within container)
            // Using 5-95% to avoid clipping
            const finalXPercent = 5 + Math.random() * 90;
            const finalYPercent = 5 + Math.random() * 90;
            orb.style.left = `${finalXPercent}%`;
            orb.style.top = `${finalYPercent}%`;

            // Calculate Start Position (Off-screen)
            const side = Math.floor(Math.random() * 4); // 0:Top, 1:Right, 2:Bottom, 3:Left
            let startX, startY;
            const viewportW = window.innerWidth;
            const viewportH = window.innerHeight;

            // Convert Final % to pixels for calculation
            const finalX = (finalXPercent / 100) * viewportW;
            const finalY = (finalYPercent / 100) * viewportH;

            switch (side) {
                case 0: // Top
                    startX = Math.random() * viewportW;
                    startY = -150; // Above viewport
                    break;
                case 1: // Right
                    startX = viewportW + 150;
                    startY = Math.random() * viewportH;
                    break;
                case 2: // Bottom
                    startX = Math.random() * viewportW;
                    startY = viewportH + 150;
                    break;
                case 3: // Left
                    startX = -150;
                    startY = Math.random() * viewportH;
                    break;
            }

            // Calculate Deltas (Start - Final)
            // We want translate(tx, ty) to put it at startX, startY
            // relative to its final position at finalX, finalY.
            const tx = startX - finalX;
            const ty = startY - finalY;

            // Calculate Midpoint (Arc)
            // We want a point "higher" (visually) or "outward" to create a curve.
            // Simple heuristic: Midpoint is half-way + an offset perpendicular to the path?
            // Or just simple offsets based on side.
            let mx = tx * 0.5;
            let my = ty * 0.5;

            if (side === 2) { // From Bottom, arc UP (negative Y relative to path)
                my -= 200;
            } else if (side === 0) { // From Top, arc DOWN (positive Y relative to path - deep drop)
                my += 100;
            } else { // Sides, arc UP/Over
                my -= 150;
            }

            // Set CSS Variables
            orb.style.setProperty('--tx', `${tx}px`);
            orb.style.setProperty('--ty', `${ty}px`);
            orb.style.setProperty('--mx', `${mx}px`);
            orb.style.setProperty('--my', `${my}px`);

            // Random Opacity & Delay
            const opacity = 0.2 + Math.random() * 0.6;
            orb.style.setProperty('--final-opacity', opacity);

            const delay = Math.random() * 1.5; // 0 to 1.5s delay
            orb.style.animationDelay = `${delay}s`;

            orbContainer.appendChild(orb);
        }
    }

    // --- High Density Parallax Scroll REMOVED ---
    // Static distribution requested.

    // --- Back to Top Button Logic ---
    const backToTopBtn = document.getElementById('backToTop');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('show');
        } else {
            backToTopBtn.classList.remove('show');
        }
    });

    // Smooth scroll for Back to Top
    backToTopBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // Smooth scroll for Navigation Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });

                // Close mobile menu if open
                const navbarCollapse = document.getElementById('navbarNav');
                if (navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse);
                    bsCollapse.hide();
                }
            }
        });
    });

    // --- Read More Button Logic ---
    const readMoreBtn = document.getElementById('read-more-btn');
    const readMoreTextSpan = readMoreBtn ? readMoreBtn.querySelector('span') : null;

    if (readMoreBtn && readMoreTextSpan) {
        readMoreBtn.addEventListener('click', function () {
            const isExpanded = readMoreBtn.getAttribute('aria-expanded') === 'true';
            // The click happens BEFORE the bootstrap collapse toggles the state fully, 
            // but aria-expanded is toggled by bootstrap. 
            // Wait a tick or check current state. 
            // Actually, we can just check the current text to decide the next text.

            if (readMoreTextSpan.textContent.trim() === 'Leer más') {
                readMoreTextSpan.textContent = 'Leer menos';
            } else {
                readMoreTextSpan.textContent = 'Leer más';
            }
        });
    }

    // --- Theme Toggle Logic ---
    const themeToggleBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    const body = document.body;

    // Check for saved user preference
    const currentTheme = localStorage.getItem('theme');
    if (currentTheme === 'dark') {
        body.classList.add('dark-mode');
        themeIcon.classList.remove('bi-moon-fill');
        themeIcon.classList.add('bi-sun-fill');
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            body.classList.toggle('dark-mode');

            if (body.classList.contains('dark-mode')) {
                themeIcon.classList.remove('bi-moon-fill');
                themeIcon.classList.add('bi-sun-fill');
                localStorage.setItem('theme', 'dark');
            } else {
                themeIcon.classList.remove('bi-sun-fill');
                themeIcon.classList.add('bi-moon-fill');
                localStorage.setItem('theme', 'light');
            }
        });
    }

});
