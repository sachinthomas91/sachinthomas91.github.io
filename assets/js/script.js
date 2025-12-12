document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const mobileToggle = document.querySelector('.mobile-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (mobileToggle) {
        mobileToggle.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            const icon = mobileToggle.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }


    // Theme Toggle Logic
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = document.getElementById('theme-icon');

    const darkIconImg = `<img src="assets/images/icons/dark-theme-icon.png" alt="Dark Mode" style="width: 24px; height: 24px; vertical-align: middle;">`;
    const lightIconEmoji = '🔆';

    // Check saved theme or default
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        document.documentElement.setAttribute('data-theme', savedTheme);
        if (savedTheme === 'dark') {
            themeIcon.innerHTML = lightIconEmoji;
        }
    }

    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        if (newTheme === 'dark') {
            themeIcon.innerHTML = lightIconEmoji;
        } else {
            themeIcon.innerHTML = darkIconImg;
        }
    });

    // Smooth Scrolling for Anchor Links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                const icon = mobileToggle.querySelector('i');
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Centered scroll for Home, Expertise, Projects
                if (['#hero', '#expertise', '#projects'].includes(targetId)) {
                    const rect = targetElement.getBoundingClientRect();
                    const elementHeight = rect.height;
                    const windowHeight = window.innerHeight;
                    const navHeight = document.querySelector('.navbar').offsetHeight;

                    // If element fits comfortably in viewport, center it.
                    // Otherwise, top-align it to avoid cutting off the header.
                    if (elementHeight < (windowHeight - navHeight - 40)) {
                        let centerPos = targetElement.getBoundingClientRect().top + window.pageYOffset - (windowHeight / 2) + (elementHeight / 2);

                        // Visual Adjustment: Pull Expertise higher
                        if (targetId === '#expertise') {
                            centerPos += 120;
                        }

                        window.scrollTo({
                            top: centerPos,
                            behavior: 'smooth'
                        });
                    } else {
                        // Fallback to top alignment with nav offset
                        let topPos = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                        // If Expertise is tall, we still want to eat into that 8rem padding a bit
                        if (targetId === '#expertise') {
                            topPos += 80;
                        }

                        window.scrollTo({
                            top: topPos,
                            behavior: 'smooth'
                        });
                    }
                } else {
                    // Default Logic (e.g. for Contact)
                    const navHeight = document.querySelector('.navbar').offsetHeight;
                    const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset - navHeight;

                    window.scrollTo({
                        top: targetPosition,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Intersection Observer for Fade-in Animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Add animation classes to elements
    const animatedElements = document.querySelectorAll('.section-title, .card, .about-content, .about-image-wrapper, .hero-text');
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        observer.observe(el);
    });

    // Custom Animation Handler
    document.addEventListener('scroll', () => {
        // Disable parallax on mobile to prevent overlap
        if (window.innerWidth <= 768) return;

        const scrolled = window.scrollY;
        const heroVisual = document.querySelector('.hero-visual');
        if (heroVisual) {
            heroVisual.style.transform = `translateY(${scrolled * 0.2}px)`;
        }
    });

    // Add class for visible state
    const styleSheet = document.createElement("style");
    styleSheet.innerText = `
        .fade-in-up {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
    `;
    document.head.appendChild(styleSheet);

    // --- Carousel Logic (Robust) ---
    const track = document.querySelector('.carousel-track');
    // If we have no track (e.g. on other pages), skip
    if (track) {
        const slides = Array.from(track.children);
        const nextButton = document.querySelector('.next-arrow');
        const prevButton = document.querySelector('.prev-arrow');
        const dotsNav = document.querySelector('.carousel-nav');
        const dots = Array.from(dotsNav.children);

        const updateSlide = (currentSlide, targetSlide) => {
            currentSlide.classList.remove('current-slide');
            targetSlide.classList.add('current-slide');
        };

        const updateDots = (currentDot, targetDot) => {
            currentDot.classList.remove('current-slide');
            targetDot.classList.add('current-slide');
        };

        // Next Button
        nextButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            let nextSlide = currentSlide.nextElementSibling;

            // Loop back to start
            if (!nextSlide) nextSlide = slides[0];

            const currentDot = dotsNav.querySelector('.current-slide');
            const nextIndex = slides.findIndex(slide => slide === nextSlide);
            const nextDot = dots[nextIndex];

            updateSlide(currentSlide, nextSlide);
            updateDots(currentDot, nextDot);
        });

        // Prev Button
        prevButton.addEventListener('click', e => {
            const currentSlide = track.querySelector('.current-slide');
            let prevSlide = currentSlide.previousElementSibling;

            // Loop to end
            if (!prevSlide) prevSlide = slides[slides.length - 1];

            const currentDot = dotsNav.querySelector('.current-slide');
            const prevIndex = slides.findIndex(slide => slide === prevSlide);
            const prevDot = dots[prevIndex];

            updateSlide(currentSlide, prevSlide);
            updateDots(currentDot, prevDot);
        });

        // Dots
        dotsNav.addEventListener('click', e => {
            const targetDot = e.target.closest('button');
            if (!targetDot) return;

            const currentSlide = track.querySelector('.current-slide');
            const currentDot = dotsNav.querySelector('.current-slide');
            const targetIndex = dots.findIndex(dot => dot === targetDot);
            const targetSlide = slides[targetIndex];

            updateSlide(currentSlide, targetSlide);
            updateDots(currentDot, targetDot);
        });
    }

    // --- Clone & Expand Logic (Ask Your Data) ---
    const askDataContent = {
        title: "Ask Your Data 🤖",
        subtitle: "Local RAG Assistant with SQL Generation",
        videoSrc: "assets/videos/ask_your_data.mp4",
        githubUrl: "https://github.com/sachinthomas91/ask-your-data",
        features: [
            { icon: "fas fa-brain", text: "<strong>Natural Language Understanding</strong>: Ask questions about your data models in plain English." },
            { icon: "fas fa-database", text: "<strong>Automatic SQL Generation</strong>: Get ready-to-use SQL queries based on your questions directly from schema." },
            { icon: "fas fa-chart-pie", text: "<strong>Smart Visualization</strong>: Automatically visualize your data with intelligent chart selection based on query results." },
            { icon: "fas fa-lock", text: "<strong>100% Local Processing</strong>: All AI processing runs on your machine using Ollama. No data leaves your environment." }
        ],
        tags: [
            { name: "PostgreSQL", path: "assets/images/badges/PostgresSQL.svg" },
            { name: "dbt", path: "assets/images/badges/dbt.png" },
            { name: "Ollama", path: "assets/images/badges/ollama.svg" },
            { name: "Streamlit", path: "assets/images/badges/Streamlit.svg" },
            { name: "Docker", path: "assets/images/badges/docker.svg" },
            { name: "Python", path: "assets/images/badges/python-logo-only.svg" }
        ]
    };

    function createOverlay() {
        // Prevent multiple opens
        if (document.querySelector('.project-overlay')) return;

        // Overlay Structure
        const overlay = document.createElement('div');
        overlay.classList.add('project-overlay');

        overlay.innerHTML = `
            <div class="overlay-content">
                <button class="close-overlay-btn"><i class="fas fa-times"></i></button>
                <div class="overlay-header">
                    <video class="overlay-video" controls autoplay muted loop playsinline>
                        <source src="${askDataContent.videoSrc}" type="video/mp4">
                        Your browser does not support video.
                    </video>
                </div>
                <div class="overlay-body">
                    <h2 class="overlay-title">${askDataContent.title}</h2>
                    <p class="overlay-subtitle">${askDataContent.subtitle}</p>
                    
                    <div class="overlay-grid">
                        <div class="feature-list">
                            <h4>Key Features</h4>
                            <ul>
                                ${askDataContent.features.map(f => `<li><i class="${f.icon}"></i> <span>${f.text}</span></li>`).join('')}
                            </ul>
                        </div>
                        <div class="overlay-sidebar">
                            <h5 class="tech-stack-title">Tech Stack</h5>
                            <div class="overlay-tags">
                                ${askDataContent.tags.map(t => `<img src="${t.path}" alt="${t.name}" title="${t.name}">`).join('')}
                            </div>
                            <a href="${askDataContent.githubUrl}" target="_blank" class="btn-primary w-100" style="width: 100%; text-align: center;">
                                View on GitHub <i class="fab fa-github"></i>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);

        // Force reflow
        void overlay.offsetWidth;
        overlay.classList.add('active');

        // Close Handlers
        const closeBtn = overlay.querySelector('.close-overlay-btn');
        const closeOverlay = () => {
            overlay.classList.remove('active');
            setTimeout(() => overlay.remove(), 400); // Wait for transition
        };

        closeBtn.addEventListener('click', closeOverlay);
        overlay.addEventListener('click', (e) => {
            if (e.target === overlay) closeOverlay();
        });
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                closeOverlay();
                document.removeEventListener('keydown', escHandler);
            }
        });
    }

    // Attach to triggers using event delegation
    const container = document.querySelector('.carousel-container');
    if (container) {
        container.addEventListener('click', (e) => {
            // Check if clicked element is a trigger for Ask Your Data
            const slide = e.target.closest('.carousel-slide');
            const isVisual = e.target.closest('.slide-visual');
            const isBtn = e.target.closest('#trigger-ask-data');

            // Check if it's the "Ask Your Data" slide (Title check or Index 0)
            if (slide && slide.querySelector('.slide-title').innerText.includes('Ask Your Data')) {
                if (isVisual || isBtn) {
                    createOverlay();
                }
            }
        });
    }
});
