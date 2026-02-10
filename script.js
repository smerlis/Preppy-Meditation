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

    // ---------- Box Breathing Tool ----------
    const breatheStart = document.getElementById('breatheStart');
    const breatheStop = document.getElementById('breatheStop');
    const breatheCircle = document.getElementById('breatheCircle');
    const breathePhase = document.getElementById('breathePhase');
    const breatheCount = document.getElementById('breatheCount');
    const breatheCycleNum = document.getElementById('breatheCycleNum');
    const breatheCycleTotal = document.getElementById('breatheCycleTotal');
    const breatheRingProgress = document.querySelector('.breathe-ring-progress');

    let breatheInterval = null;
    let breatheRunning = false;
    const BREATHE_PHASES = [
        { name: 'Inhale', class: 'inhale', duration: 4 },
        { name: 'Hold', class: 'hold-in', duration: 4 },
        { name: 'Exhale', class: 'exhale', duration: 4 },
        { name: 'Hold', class: 'hold-out', duration: 4 }
    ];
    const TOTAL_CYCLES = 4;
    const CIRCUMFERENCE = 2 * Math.PI * 90; // matches SVG r=90

    function runBreathingCycle() {
        let cycle = 0;
        let phaseIdx = 0;
        let countdown = BREATHE_PHASES[0].duration;

        breatheRunning = true;
        breatheStart.style.display = 'none';
        breatheStop.style.display = 'inline-flex';
        breatheCycleNum.textContent = '1';

        function updateRingProgress() {
            const phase = BREATHE_PHASES[phaseIdx];
            const progress = 1 - (countdown / phase.duration);
            const totalPhasesDone = cycle * 4 + phaseIdx + progress;
            const totalPhases = TOTAL_CYCLES * 4;
            const overallProgress = totalPhasesDone / totalPhases;
            const offset = CIRCUMFERENCE * (1 - overallProgress);
            if (breatheRingProgress) {
                breatheRingProgress.style.strokeDashoffset = offset;
            }
        }

        function tick() {
            if (!breatheRunning) return;

            const phase = BREATHE_PHASES[phaseIdx];

            // Update display
            breatheCircle.className = 'breathe-circle ' + phase.class;
            breathePhase.textContent = phase.name;
            breatheCount.textContent = countdown;
            updateRingProgress();

            if (countdown <= 0) {
                // Next phase
                phaseIdx++;
                if (phaseIdx >= BREATHE_PHASES.length) {
                    phaseIdx = 0;
                    cycle++;
                    breatheCycleNum.textContent = Math.min(cycle + 1, TOTAL_CYCLES);

                    if (cycle >= TOTAL_CYCLES) {
                        // Done
                        stopBreathing();
                        breathePhase.textContent = 'Complete';
                        breatheCount.textContent = '';
                        breatheCircle.className = 'breathe-circle';
                        if (breatheRingProgress) {
                            breatheRingProgress.style.strokeDashoffset = '0';
                        }
                        return;
                    }
                }
                countdown = BREATHE_PHASES[phaseIdx].duration;
                // Immediately show next phase
                const nextPhase = BREATHE_PHASES[phaseIdx];
                breatheCircle.className = 'breathe-circle ' + nextPhase.class;
                breathePhase.textContent = nextPhase.name;
                breatheCount.textContent = countdown;
                updateRingProgress();
            }

            countdown--;
        }

        tick(); // First tick immediately
        breatheInterval = setInterval(tick, 1000);
    }

    function stopBreathing() {
        breatheRunning = false;
        clearInterval(breatheInterval);
        breatheStart.style.display = 'inline-flex';
        breatheStop.style.display = 'none';
        breatheStart.textContent = 'Begin Box Breathing';
    }

    if (breatheStart) {
        breatheStart.addEventListener('click', () => {
            // Reset state
            breatheCycleNum.textContent = '0';
            if (breatheRingProgress) {
                breatheRingProgress.style.strokeDashoffset = CIRCUMFERENCE;
            }
            breatheCircle.className = 'breathe-circle';
            runBreathingCycle();
        });
    }

    if (breatheStop) {
        breatheStop.addEventListener('click', () => {
            stopBreathing();
            breathePhase.textContent = 'Ready';
            breatheCount.textContent = '';
            breatheCycleNum.textContent = '0';
            breatheCircle.className = 'breathe-circle';
            if (breatheRingProgress) {
                breatheRingProgress.style.strokeDashoffset = CIRCUMFERENCE;
            }
        });
    }

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
        '.brain-card, .technique-card, .testimonial-card, .faq-item, .routine-card, .path-quote, .who-category, .myth-card, .anywhere-card, .week-day'
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
