/* ==========================================================================
   Kanha Mittal - Developer Portfolio Logic & Interactions
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ----------------------------------------------------------------------
       1. Canvas Background Animation (Floating Particles & Connections)
       ---------------------------------------------------------------------- */
    const canvas = document.getElementById('bg-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width = canvas.width = window.innerWidth;
        let height = canvas.height = window.innerHeight;

        window.addEventListener('resize', () => {
            width = canvas.width = window.innerWidth;
            height = canvas.height = window.innerHeight;
        });

        const particles = [];
        const particleCount = Math.min(Math.floor(width / 20), 60);

        class Particle {
            constructor() {
                this.x = Math.random() * width;
                this.y = Math.random() * height;
                this.vx = (Math.random() - 0.5) * 0.6;
                this.vy = (Math.random() - 0.5) * 0.6;
                this.radius = Math.random() * 2 + 1;
            }

            update() {
                this.x += this.vx;
                this.y += this.vy;

                if (this.x < 0 || this.x > width) this.vx *= -1;
                if (this.y < 0 || this.y > height) this.vy *= -1;
            }

            draw() {
                const isLight = document.body.classList.contains('light-theme');
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                ctx.fillStyle = isLight ? 'rgba(139, 92, 246, 0.4)' : 'rgba(139, 92, 246, 0.6)';
                ctx.fill();
            }
        }

        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }

        function animateCanvas() {
            ctx.clearRect(0, 0, width, height);
            const isLight = document.body.classList.contains('light-theme');
            const lineColor = isLight ? '139, 92, 246' : '6, 182, 212';

            for (let i = 0; i < particles.length; i++) {
                particles[i].update();
                particles[i].draw();

                for (let j = i + 1; j < particles.length; j++) {
                    const dx = particles[i].x - particles[j].x;
                    const dy = particles[i].y - particles[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);

                    if (dist < 130) {
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.strokeStyle = `rgba(${lineColor}, ${1 - dist / 130 * 0.75})`;
                        ctx.lineWidth = 0.6;
                        ctx.stroke();
                    }
                }
            }
            requestAnimationFrame(animateCanvas);
        }
        animateCanvas();
    }

    /* ----------------------------------------------------------------------
       2. Dynamic Typing Text Effect
       ---------------------------------------------------------------------- */
    const typingElement = document.getElementById('typing-text');
    if (typingElement) {
        const roles = [
            "Full-Stack Developer",
            "Software Engineer",
            "UI/UX Craftsman",
            "Open Source Enthusiast"
        ];
        let roleIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typingSpeed = 100;

        function typeEffect() {
            const currentRole = roles[roleIndex];

            if (isDeleting) {
                typingElement.textContent = currentRole.substring(0, charIndex - 1);
                charIndex--;
                typingSpeed = 50;
            } else {
                typingElement.textContent = currentRole.substring(0, charIndex + 1);
                charIndex++;
                typingSpeed = 100;
            }

            if (!isDeleting && charIndex === currentRole.length) {
                isDeleting = true;
                typingSpeed = 1800; // Pause at end
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                typingSpeed = 400; // Pause before typing next
            }

            setTimeout(typeEffect, typingSpeed);
        }
        typeEffect();
    }

    /* ----------------------------------------------------------------------
       3. Theme Switcher (Dark / Light Mode)
       ---------------------------------------------------------------------- */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeIcon) {
            themeIcon.classList.remove('fa-moon');
            themeIcon.classList.add('fa-sun');
        }
    }

    if (themeToggleBtn) {
        themeToggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');

            if (themeIcon) {
                if (isLight) {
                    themeIcon.classList.remove('fa-moon');
                    themeIcon.classList.add('fa-sun');
                } else {
                    themeIcon.classList.remove('fa-sun');
                    themeIcon.classList.add('fa-moon');
                }
            }
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        });
    }

    /* ----------------------------------------------------------------------
       4. Navbar Scroll & Active Section Highlight
       ---------------------------------------------------------------------- */
    const navbar = document.getElementById('navbar');
    const backToTopBtn = document.getElementById('back-to-top');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Navbar blur style on scroll
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Back to top button visibility
        if (window.scrollY > 400) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }

        // Active link highlighting
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    /* ----------------------------------------------------------------------
       5. Mobile Hamburger Navigation Menu
       ---------------------------------------------------------------------- */
    const hamburgerBtn = document.getElementById('hamburger-btn');
    const navMenu = document.getElementById('nav-menu');

    if (hamburgerBtn && navMenu) {
        hamburgerBtn.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            hamburgerBtn.classList.toggle('open');
        });

        // Close menu on link click
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
            });
        });
    }

    /* ----------------------------------------------------------------------
       6. Project Category Filter
       ---------------------------------------------------------------------- */
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });

    /* ----------------------------------------------------------------------
       7. Animated Stat Counter
       ---------------------------------------------------------------------- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let hasAnimatedStats = false;

    function animateStats() {
        const statsSection = document.getElementById('hero-stats-box');
        if (!statsSection || hasAnimatedStats) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top <= window.innerHeight && rect.bottom >= 0) {
            hasAnimatedStats = true;
            statNumbers.forEach(stat => {
                const target = parseInt(stat.getAttribute('data-target'));
                let count = 0;
                const speed = 40;
                const increment = Math.ceil(target / speed);

                const updateCount = () => {
                    count += increment;
                    if (count >= target) {
                        stat.textContent = target + (stat.textContent.includes('%') ? '%' : '+');
                    } else {
                        stat.textContent = count + (stat.textContent.includes('%') ? '%' : '+');
                        setTimeout(updateCount, 30);
                    }
                };
                updateCount();
            });
        }
    }
    window.addEventListener('scroll', animateStats);
    animateStats(); // Initial check

    /* ----------------------------------------------------------------------
       8. Copy Code Snippet Button
       ---------------------------------------------------------------------- */
    const copyCodeBtn = document.getElementById('copy-code-btn');
    const codeSnippet = document.getElementById('code-snippet');

    if (copyCodeBtn && codeSnippet) {
        copyCodeBtn.addEventListener('click', () => {
            const textToCopy = codeSnippet.textContent;
            navigator.clipboard.writeText(textToCopy).then(() => {
                copyCodeBtn.classList.remove('fa-copy');
                copyCodeBtn.classList.add('fa-check');
                copyCodeBtn.style.color = '#10b981';

                setTimeout(() => {
                    copyCodeBtn.classList.remove('fa-check');
                    copyCodeBtn.classList.add('fa-copy');
                    copyCodeBtn.style.color = '';
                }, 2000);
            });
        });
    }

    /* ----------------------------------------------------------------------
       9. Contact Form Handling
       ---------------------------------------------------------------------- */
    const contactForm = document.getElementById('contact-form');
    const formToast = document.getElementById('form-toast');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const submitBtn = document.getElementById('submit-contact-btn');
            
            if (submitBtn) {
                submitBtn.innerHTML = '<span>Sending...</span> <i class="fa-solid fa-spinner fa-spin"></i>';
                submitBtn.disabled = true;
            }

            setTimeout(() => {
                if (submitBtn) {
                    submitBtn.innerHTML = '<span>Message Sent!</span> <i class="fa-solid fa-check"></i>';
                }

                if (formToast) {
                    formToast.classList.add('success');
                    formToast.textContent = 'Thank you! Your message has been sent successfully to Kanha Mittal.';
                }

                contactForm.reset();

                setTimeout(() => {
                    if (submitBtn) {
                        submitBtn.innerHTML = '<span>Send Message</span> <i class="fa-solid fa-paper-plane"></i>';
                        submitBtn.disabled = false;
                    }
                    if (formToast) {
                        formToast.classList.remove('success');
                    }
                }, 4000);
            }, 1200);
        });
    }
});
