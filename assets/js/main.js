/* ===================================================
   Circuit Background Animation
   Navbar Toggle
   Typed Text Effect
   Tag Filtering
   =================================================== */

document.addEventListener('DOMContentLoaded', function () {

    // --- Circuit Background Canvas ---
    const canvas = document.getElementById('circuitCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let w, h;

        function resize() {
            w = canvas.width = window.innerWidth;
            h = canvas.height = window.innerHeight;
        }
        resize();
        window.addEventListener('resize', resize);

        // Draw a simple grid of circuit-like lines
        function drawCircuit() {
            ctx.clearRect(0, 0, w, h);
            ctx.strokeStyle = '#f0a500';
            ctx.lineWidth = 1;

            const spacing = 60;
            const time = Date.now() * 0.0003;

            for (let x = 0; x < w; x += spacing) {
                for (let y = 0; y < h; y += spacing) {
                    const offsetX = Math.sin(time + x * 0.01) * 2;
                    const offsetY = Math.cos(time + y * 0.01) * 2;

                    ctx.beginPath();
                    // Horizontal trace
                    if (Math.random() > 0.5) {
                        ctx.moveTo(x + offsetX, y + offsetY);
                        ctx.lineTo(x + spacing * 0.6 + offsetX, y + offsetY);
                    }
                    // Vertical trace
                    if (Math.random() > 0.6) {
                        ctx.moveTo(x + offsetX, y + offsetY);
                        ctx.lineTo(x + offsetX, y + spacing * 0.5 + offsetY);
                    }
                    // Node dot
                    if (Math.random() > 0.75) {
                        ctx.moveTo(x + offsetX + 2, y + offsetY);
                        ctx.arc(x + offsetX, y + offsetY, 2, 0, Math.PI * 2);
                    }
                    ctx.stroke();
                }
            }
        }

        // Don't animate heavily, just draw once and redraw on resize
        drawCircuit();
        window.addEventListener('resize', function () {
            resize();
            drawCircuit();
        });
    }

    // --- Navbar Toggle ---
    const navToggle = document.querySelector('.nav-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (navToggle && navLinks) {
        navToggle.addEventListener('click', function () {
            navLinks.classList.toggle('open');
        });
    }

    // --- Typed Text Effect ---
    const typedEl = document.getElementById('typedText');
    if (typedEl) {
        const phrases = [
            'digital circuits in Verilog',
            'autonomous robots',
            'FPGA-based systems',
            'embedded firmware',
            'side-channel attacks',
            'CPU architectures',
            'analog computers'
        ];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typeSpeed = 80;

        function typeLoop() {
            const current = phrases[phraseIndex];

            if (isDeleting) {
                typedEl.textContent = current.substring(0, charIndex - 1);
                charIndex--;
                typeSpeed = 40;
            } else {
                typedEl.textContent = current.substring(0, charIndex + 1);
                charIndex++;
                typeSpeed = 80;
            }

            if (!isDeleting && charIndex === current.length) {
                typeSpeed = 2000; // pause at end
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500; // pause before next
            }

            setTimeout(typeLoop, typeSpeed);
        }
        typeLoop();
    }

    // --- Tag Filtering ---
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card[data-tags]');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(function (btn) {
            btn.addEventListener('click', function () {
                const filter = this.getAttribute('data-filter');

                filterBtns.forEach(function (b) { b.classList.remove('active'); });
                this.classList.add('active');

                projectCards.forEach(function (card) {
                    const tags = card.getAttribute('data-tags');
                    if (filter === 'all' || tags.includes(filter)) {
                        card.style.display = '';
                        card.style.animation = 'fadeIn 0.3s ease';
                    } else {
                        card.style.display = 'none';
                    }
                });
            });
        });
    }

    // --- Scroll animations (Intersection Observer) ---
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card, .skill-group, .stat').forEach(function (el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        observer.observe(el);
    });

});

// Fade-in keyframe
const style = document.createElement('style');
style.textContent = '@keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }';
document.head.appendChild(style);
