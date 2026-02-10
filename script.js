// ==========================================================================
// Stillpoint — Interactive Features
// ==========================================================================

document.addEventListener('DOMContentLoaded', () => {

    // ---------- Navigation scroll effect ----------
    const nav = document.getElementById('nav');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = scrollY;
    });

    // ---------- Mobile menu toggle ----------
    const navToggle = document.getElementById('navToggle');
    const navLinks = document.getElementById('navLinks');

    navToggle.addEventListener('click', () => {
        navLinks.classList.toggle('open');
        const spans = navToggle.querySelectorAll('span');
        if (navLinks.classList.contains('open')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
        } else {
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        }
    });

    // Close mobile menu when a link is clicked
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('open');
            const spans = navToggle.querySelectorAll('span');
            spans[0].style.transform = '';
            spans[1].style.opacity = '';
            spans[2].style.transform = '';
        });
    });

    // ---------- Animated stat counters ----------
    const statNumbers = document.querySelectorAll('.stat-number[data-target]');
    let statsAnimated = false;

    function animateStats() {
        if (statsAnimated) return;
        const statsSection = document.querySelector('.hero-stats');
        if (!statsSection) return;

        const rect = statsSection.getBoundingClientRect();
        if (rect.top < window.innerHeight * 0.85) {
            statsAnimated = true;
            statNumbers.forEach(el => {
                const target = parseInt(el.getAttribute('data-target'));
                const duration = 2000;
                const start = performance.now();

                function update(now) {
                    const elapsed = now - start;
                    const progress = Math.min(elapsed / duration, 1);
                    // Ease out cubic
                    const eased = 1 - Math.pow(1 - progress, 3);
                    el.textContent = Math.round(target * eased);
                    if (progress < 1) {
                        requestAnimationFrame(update);
                    }
                }
                requestAnimationFrame(update);
            });
        }
    }

    window.addEventListener('scroll', animateStats);
    animateStats(); // Check on load

    // ---------- Path tabs ----------
    const pathTabs = document.querySelectorAll('.path-tab');
    const pathContents = document.querySelectorAll('.path-content');

    pathTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const pathId = tab.getAttribute('data-path');

            pathTabs.forEach(t => t.classList.remove('active'));
            tab.classList.add('active');

            pathContents.forEach(content => {
                content.classList.remove('active');
            });
            document.getElementById(`path-${pathId}`).classList.add('active');
        });
    });

    // ---------- Technique card expand ----------
    const techniqueCards = document.querySelectorAll('.technique-card');

    techniqueCards.forEach(card => {
        card.addEventListener('click', () => {
            const wasExpanded = card.classList.contains('expanded');

            // Close all
            techniqueCards.forEach(c => c.classList.remove('expanded'));

            // Toggle clicked
            if (!wasExpanded) {
                card.classList.add('expanded');
                // Scroll into view
                setTimeout(() => {
                    card.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }, 100);
            }
        });
    });

    // ---------- FAQ accordion ----------
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const question = item.querySelector('.faq-question');
        question.addEventListener('click', () => {
            const wasOpen = item.classList.contains('open');

            // Close all
            faqItems.forEach(i => i.classList.remove('open'));

            // Toggle
            if (!wasOpen) {
                item.classList.add('open');
            }
        });
    });

    // ---------- Meditation Timer ----------
    const timerMinutes = document.getElementById('timer-minutes');
    const timerSeconds = document.getElementById('timer-seconds');
    const timerStart = document.getElementById('timerStart');
    const timerReset = document.getElementById('timerReset');
    const timerInstruction = document.getElementById('timerInstruction');
    let timerInterval = null;
    let totalSeconds = 300; // 5 minutes
    let isRunning = false;

    function updateTimerDisplay() {
        const m = Math.floor(totalSeconds / 60);
        const s = totalSeconds % 60;
        timerMinutes.textContent = String(m).padStart(2, '0');
        timerSeconds.textContent = String(s).padStart(2, '0');
    }

    timerStart.addEventListener('click', () => {
        if (!isRunning) {
            // Start
            isRunning = true;
            timerStart.textContent = 'Pause';
            timerReset.style.display = 'inline-flex';
            timerInstruction.textContent = 'Session active. Focus on your breath. You\'re doing the work right now.';
            timerInstruction.classList.add('active-session');

            timerInterval = setInterval(() => {
                if (totalSeconds <= 0) {
                    clearInterval(timerInterval);
                    isRunning = false;
                    timerStart.textContent = 'Start 5-Minute Session';
                    timerInstruction.textContent = 'Session complete. Notice how you feel right now compared to 5 minutes ago.';
                    timerInstruction.classList.remove('active-session');

                    // Gentle pulse effect
                    document.querySelector('.timer-display').style.animation = 'pulse 1s ease 3';
                    return;
                }
                totalSeconds--;
                updateTimerDisplay();
            }, 1000);
        } else {
            // Pause
            clearInterval(timerInterval);
            isRunning = false;
            timerStart.textContent = 'Resume';
            timerInstruction.textContent = 'Paused. Take your time.';
            timerInstruction.classList.remove('active-session');
        }
    });

    timerReset.addEventListener('click', () => {
        clearInterval(timerInterval);
        isRunning = false;
        totalSeconds = 300;
        updateTimerDisplay();
        timerStart.textContent = 'Start 5-Minute Session';
        timerReset.style.display = 'none';
        timerInstruction.textContent = 'Press start, close your eyes, and focus on your breath. When your mind wanders, bring it back. That\'s the whole thing.';
        timerInstruction.classList.remove('active-session');
    });

    // ---------- Scroll reveal animations ----------
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add fade-in class to elements
    const animateElements = document.querySelectorAll(
        '.brain-card, .technique-card, .testimonial-card, .faq-item, .routine-card, .path-quote'
    );

    animateElements.forEach((el, i) => {
        el.classList.add('fade-in');
        el.style.transitionDelay = `${(i % 4) * 0.1}s`;
        observer.observe(el);
    });

    // ---------- Smooth scroll for anchor links ----------
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (target) {
                e.preventDefault();
                const offset = 80; // Nav height
                const top = target.getBoundingClientRect().top + window.scrollY - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

});
