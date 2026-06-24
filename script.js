/* ==========================================================================
   Muhammad Syamir Bin Junaidi - Portfolio Interactivity
   Cybersecurity, Networking & Graphic Design Theme
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================
       1. HTML5 Canvas Network Background
       ========================================== */
    const canvas = document.getElementById('particle-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let particles = [];
        let mouse = { x: null, y: null, radius: 130 };

        // Particle Blueprint
        class Particle {
            constructor(x, y, dx, dy, size) {
                this.x = x;
                this.y = y;
                this.dx = dx;
                this.dy = dy;
                this.size = size;
            }

            draw() {
                ctx.beginPath();
                ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
                ctx.fillStyle = '#ff6f00';
                ctx.shadowBlur = 4;
                ctx.shadowColor = '#ff6f00';
                ctx.fill();
                ctx.shadowBlur = 0; // Reset shadow for line calculations
            }

            update() {
                // Bounce off canvas boundaries
                if (this.x > canvas.width || this.x < 0) this.dx = -this.dx;
                if (this.y > canvas.height || this.y < 0) this.dy = -this.dy;

                // Move
                this.x += this.dx;
                this.y += this.dy;

                // Mouse interaction (push away slightly)
                if (mouse.x !== null && mouse.y !== null) {
                    let distanceX = this.x - mouse.x;
                    let distanceY = this.y - mouse.y;
                    let distance = Math.hypot(distanceX, distanceY);
                    
                    if (distance < mouse.radius) {
                        let force = (mouse.radius - distance) / mouse.radius;
                        let directionX = distanceX / distance;
                        let directionY = distanceY / distance;
                        this.x += directionX * force * 3;
                        this.y += directionY * force * 3;
                    }
                }

                this.draw();
            }
        }

        // Initialize particle array based on viewport size
        function initParticles() {
            particles = [];
            let count = Math.floor((canvas.width * canvas.height) / 9500);
            count = Math.min(count, 130); // Cap at 130 for performance

            for (let i = 0; i < count; i++) {
                let size = Math.random() * 2 + 1.2;
                let x = Math.random() * (canvas.width - size * 2) + size;
                let y = Math.random() * (canvas.height - size * 2) + size;
                let dx = (Math.random() - 0.5) * 0.4;
                let dy = (Math.random() - 0.5) * 0.4;
                particles.push(new Particle(x, y, dx, dy, size));
            }
        }

        // Handle resizing
        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
            initParticles();
        };

        window.addEventListener('resize', resizeCanvas);
        resizeCanvas();

        // Track Mouse
        window.addEventListener('mousemove', (e) => {
            mouse.x = e.clientX;
            mouse.y = e.clientY;
        });

        window.addEventListener('mouseleave', () => {
            mouse.x = null;
            mouse.y = null;
        });

        // Connecting lines calculation
        function connectParticles() {
            let maxDistance = 115;
            for (let i = 0; i < particles.length; i++) {
                for (let j = i; j < particles.length; j++) {
                    let dist = Math.hypot(particles[i].x - particles[j].x, particles[i].y - particles[j].y);

                    if (dist < maxDistance) {
                        let opacity = 1 - (dist / maxDistance);
                        ctx.strokeStyle = `rgba(255, 111, 0, ${opacity * 0.16})`;
                        ctx.lineWidth = 1;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(particles[j].x, particles[j].y);
                        ctx.stroke();
                    }
                }

                // Node-to-Mouse lines
                if (mouse.x !== null && mouse.y !== null) {
                    let distToMouse = Math.hypot(particles[i].x - mouse.x, particles[i].y - mouse.y);
                    if (distToMouse < mouse.radius) {
                        let opacity = 1 - (distToMouse / mouse.radius);
                        ctx.strokeStyle = `rgba(255, 111, 0, ${opacity * 0.28})`;
                        ctx.lineWidth = 1.2;
                        ctx.beginPath();
                        ctx.moveTo(particles[i].x, particles[i].y);
                        ctx.lineTo(mouse.x, mouse.y);
                        ctx.stroke();
                    }
                }
            }
        }

        // Animation Loop
        function animate() {
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            particles.forEach(p => p.update());
            connectParticles();
            requestAnimationFrame(animate);
        }

        animate();
    }


    /* ==========================================
       2. Typewriter Effect (Hero Subtitle)
       ========================================== */
    const typedTextSpan = document.getElementById('typed-text');
    const roles = ["Cybersecurity Student", "Networking Enthusiast", "Graphic Designer"];
    const typingSpeed = 100;
    const erasingSpeed = 60;
    const delayBetweenRoles = 2000;
    let roleIndex = 0;
    let charIndex = 0;

    function type() {
        if (typedTextSpan) {
            if (charIndex < roles[roleIndex].length) {
                typedTextSpan.textContent += roles[roleIndex].charAt(charIndex);
                charIndex++;
                setTimeout(type, typingSpeed);
            } else {
                setTimeout(erase, delayBetweenRoles);
            }
        }
    }

    function erase() {
        if (typedTextSpan) {
            if (charIndex > 0) {
                typedTextSpan.textContent = roles[roleIndex].substring(0, charIndex - 1);
                charIndex--;
                setTimeout(erase, erasingSpeed);
            } else {
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(type, typingSpeed + 300);
            }
        }
    }

    setTimeout(type, 1000);


    /* ==========================================
       3. Scroll Effects & Header Scrolled State
       ========================================== */
    const header = document.getElementById('header');
    const backToTopBtn = document.getElementById('back-to-top');

    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        if (window.scrollY > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });


    /* ==========================================
       4. Navigation Active Highlights on Scroll
       ========================================== */
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-item');

    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === `#${current}`) {
                item.classList.add('active');
            }
        });
    });


    /* ==========================================
       5. Mobile Hamburger Navigation Toggle
       ========================================== */
    const mobileNavToggle = document.getElementById('mobile-nav-toggle');
    const navLinks = document.getElementById('nav-links');

    if (mobileNavToggle && navLinks) {
        mobileNavToggle.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            mobileNavToggle.classList.toggle('open');
        });

        // Close mobile nav when clicking a link
        document.querySelectorAll('.nav-links a').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                mobileNavToggle.classList.remove('open');
            });
        });
    }


    /* ==========================================
       6. Skill Bar & Language Circle Animators
       ========================================== */
    const skillBars = document.querySelectorAll('.skill-bar-fill');
    const langCircles = document.querySelectorAll('.radial-progress-fill');

    const animateSkills = () => {
        // Skill bars fill width
        skillBars.forEach(bar => {
            const targetWidth = bar.getAttribute('data-width');
            bar.style.width = targetWidth;
        });

        // Language circles stroke animate
        langCircles.forEach(circle => {
            const pct = parseInt(circle.getAttribute('data-pct'), 10);
            const radius = circle.r.baseVal.value;
            const circumference = 2 * Math.PI * radius;
            const offset = circumference - (pct / 100) * circumference;
            circle.style.strokeDashoffset = offset;
        });
    };

    // Trigger skills animation when section is in viewport
    const skillsSection = document.getElementById('skills');
    if (skillsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateSkills();
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.25 });

        observer.observe(skillsSection);
    }


    /* ==========================================
       7. Timeline Entrance Animations
       ========================================== */
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const timelineObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    // Once animated, no need to watch again
                    timelineObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.15 });

        timelineItems.forEach(item => {
            timelineObserver.observe(item);
        });
    }


    /* ==========================================
       8. Client-Side Project Cards Filter
       ========================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active state and add to current
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Add soft transition
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(10px)';

                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hide');
                        setTimeout(() => {
                            card.style.opacity = '1';
                            card.style.transform = 'scale(1) translateY(0)';
                        }, 50);
                    } else {
                        card.classList.add('hide');
                    }
                }, 300);
            });
        });
    });


    /* ==========================================
       9. Achievements Tab Selector Switch
       ========================================== */
    const tabNavButtons = document.querySelectorAll('.tab-nav-btn');
    const tabPanels = document.querySelectorAll('.tab-panel');

    tabNavButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            tabNavButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetTab = btn.getAttribute('data-tab');

            tabPanels.forEach(panel => {
                panel.classList.remove('active');
                if (panel.getAttribute('id') === targetTab) {
                    panel.classList.add('active');
                }
            });
        });
    });


    /* ==========================================
       10. Contact Form Cyber validation
       ========================================== */
    const contactForm = document.getElementById('contact-form');
    const statusMsg = document.getElementById('form-status');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('form-name').value.trim();
            const email = document.getElementById('form-email').value.trim();
            const subject = document.getElementById('form-subject').value.trim();
            const message = document.getElementById('form-message').value.trim();

            // Clear previous statuses
            statusMsg.className = 'form-status';
            statusMsg.textContent = '';

            // Simple validation check
            if (!name || !email || !subject || !message) {
                statusMsg.classList.add('error');
                statusMsg.textContent = '[!] System Error: All credentials fields must be complete.';
                return;
            }

            // Simple email validation regex
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailPattern.test(email)) {
                statusMsg.classList.add('error');
                statusMsg.textContent = '[!] System Error: Invalid email routing address.';
                return;
            }

            // Show transmission progress
            statusMsg.style.display = 'block';
            statusMsg.className = 'form-status';
            statusMsg.textContent = '[...] Initializing uplink. Encrypting and transmitting packet...';

            // Send actual email via FormSubmit AJAX endpoint
            fetch("https://formsubmit.co/ajax/syamirjunaidi05@gmail.com", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept": "application/json"
                },
                body: JSON.stringify({
                    Name: name,
                    Email: email,
                    Subject: subject,
                    Message: message
                })
            })
            .then(response => {
                if (response.ok) {
                    statusMsg.className = 'form-status success';
                    statusMsg.textContent = '[✔] Secure connection established. Message encrypted and transmitted successfully!';
                    contactForm.reset();
                } else {
                    throw new Error("Uplink failure response code: " + response.status);
                }
            })
            .catch(error => {
                console.error("Transmission Error:", error);
                statusMsg.className = 'form-status error';
                statusMsg.textContent = '[!] System Error: Connection lost. Transmission failed. Please try again.';
            })
            .finally(() => {
                // Clear status after 8 seconds
                setTimeout(() => {
                    statusMsg.style.display = 'none';
                    statusMsg.className = 'form-status';
                    statusMsg.textContent = '';
                }, 8000);
            });
        });
    }

    /* ==========================================
       11. Set Current Footer Year
       ========================================== */
    const yearSpan = document.getElementById('current-year');
    if (yearSpan) {
        yearSpan.textContent = new Date().getFullYear();
    }

});

/* ==========================================
   12. Copy to Clipboard Utility
   ========================================== */
window.copyText = function(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        btnElement.classList.add('active');
        setTimeout(() => {
            btnElement.classList.remove('active');
        }, 1500);
    }).catch(err => {
        console.error('Failed to copy credentials: ', err);
    });
};
