// Utility Functions
const utils = {
    // Debounce function for performance optimization
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Throttle function for scroll events
    throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => (inThrottle = false), limit);
            }
        };
    },

    // Safe DOM query selector
    $(selector) {
        return document.querySelector(selector);
    },

    // Safe DOM query selector all
    $$(selector) {
        return document.querySelectorAll(selector);
    },

    // Check if element is in viewport
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <=
                (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <=
                (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Animate number with easing
    animateNumber(element, start, end, duration, callback) {
        const startTime = performance.now();
        const updateNumber = (currentTime) => {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const easeOutQuart = 1 - Math.pow(1 - progress, 4);
            const current = Math.floor(start + (end - start) * easeOutQuart);

            element.textContent = current + (end >= 10 ? "+" : "");

            if (progress < 1) {
                requestAnimationFrame(updateNumber);
            } else {
                element.textContent = end + (end >= 10 ? "+" : "");
                if (callback) callback();
            }
        };
        requestAnimationFrame(updateNumber);
    },

    // Check if device is mobile
    isMobile() {
        return (
            window.innerWidth <= 768 ||
            /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                navigator.userAgent
            )
        );
    },
};

// Declare lucide variable
const lucide = window.lucide || {};

// Loading Screen Management
class LoadingManager {
    constructor() {
        this.loadingScreen = utils.$("#loading-screen");
        this.init();
    }

    init() {
        window.addEventListener("load", () => {
            setTimeout(() => {
                this.hideLoading();
            }, 1000);
        });
    }

    hideLoading() {
        if (this.loadingScreen) {
            this.loadingScreen.classList.add("hidden");
            setTimeout(() => {
                this.loadingScreen.style.display = "none";
                this.initializeAnimations();
            }, 500);
        }
    }

    initializeAnimations() {
        const heroContent = utils.$("#home .hero-content");
        if (heroContent) {
            heroContent.classList.add("visible");
        }
        animationController.init();
    }
}

// Mobile Menu Controller
class MobileMenuController {
    constructor() {
        this.menuBtn = utils.$("#mobile-menu-btn");
        this.mobileMenu = utils.$("#mobile-menu");
        this.isOpen = false;
        this.init();
    }

    init() {
        if (!this.menuBtn || !this.mobileMenu) return;

        this.menuBtn.addEventListener("click", () => this.toggle());

        // Close menu when clicking outside
        document.addEventListener("click", (e) => {
            if (
                this.isOpen &&
                !this.mobileMenu.contains(e.target) &&
                !this.menuBtn.contains(e.target)
            ) {
                this.close();
            }
        });

        // Close menu on escape key
        document.addEventListener("keydown", (e) => {
            if (e.key === "Escape" && this.isOpen) {
                this.close();
            }
        });
    }

    toggle() {
        this.isOpen ? this.close() : this.open();
    }

    open() {
        this.mobileMenu.classList.remove("hidden");
        this.menuBtn.setAttribute("aria-expanded", "true");
        this.isOpen = true;
    }

    close() {
        this.mobileMenu.classList.add("hidden");
        this.menuBtn.setAttribute("aria-expanded", "false");
        this.isOpen = false;
    }
}

// Smooth Scrolling Controller
class SmoothScrollController {
    constructor() {
        this.init();
    }

    init() {
        utils.$$('a[href^="#"]').forEach((anchor) => {
            anchor.addEventListener("click", (e) =>
                this.handleClick(e, anchor)
            );
        });
    }

    handleClick(e, anchor) {
        e.preventDefault();
        const target = utils.$(anchor.getAttribute("href"));

        if (target) {
            const navHeight = 64;
            const offsetTop = target.offsetTop - navHeight;

            window.scrollTo({
                top: offsetTop,
                behavior: "smooth",
            });

            this.addClickFeedback(anchor);
            mobileMenuController.close();
        }
    }

    addClickFeedback(element) {
        element.style.transform = "scale(0.98)";
        setTimeout(() => {
            element.style.transform = "scale(1)";
        }, 150);
    }
}

// Interactive Art Controller for Hero Section
class HeroArtController {
    constructor() {
        this.init();
    }

    init() {
        this.setupMouseInteraction();
        this.setupScrollInteraction();
        this.createDynamicParticles();
    }

    setupMouseInteraction() {
        const heroSection = utils.$("#home");
        if (!heroSection) return;

        heroSection.addEventListener("mousemove", (e) => {
            const { clientX, clientY } = e;
            const { innerWidth, innerHeight } = window;

            const xPercent = (clientX / innerWidth) * 100;
            const yPercent = (clientY / innerHeight) * 100;

            // Move floating shapes based on mouse position
            const shapes = utils.$$(".floating-shape");
            shapes.forEach((shape, index) => {
                const speed = (index + 1) * 0.5;
                const xOffset = (xPercent - 50) * speed;
                const yOffset = (yPercent - 50) * speed;

                shape.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            });

            // Move orbs with parallax effect
            const orbs = utils.$$(".orb");
            orbs.forEach((orb, index) => {
                const speed = (index + 1) * 0.3;
                const xOffset = (xPercent - 50) * speed * -1;
                const yOffset = (yPercent - 50) * speed * -1;

                orb.style.transform = `translate(${xOffset}px, ${yOffset}px)`;
            });
        });
    }

    setupScrollInteraction() {
        window.addEventListener(
            "scroll",
            utils.throttle(() => {
                const scrollY = window.pageYOffset;
                const windowHeight = window.innerHeight;
                const scrollPercent = Math.min(scrollY / windowHeight, 1);

                // Parallax effect for art elements
                const shapes = utils.$$(".floating-shape");
                shapes.forEach((shape, index) => {
                    const speed = (index + 1) * 20;
                    shape.style.transform = `translateY(${
                        scrollPercent * speed
                    }px)`;
                });

                const particles = utils.$$(".particle");
                particles.forEach((particle, index) => {
                    const speed = (index + 1) * 15;
                    particle.style.transform = `translateY(${
                        scrollPercent * speed
                    }px)`;
                });
            }, 16)
        );
    }

    createDynamicParticles() {
        const particlesContainer = utils.$(".particles");
        if (!particlesContainer) return;

        // Create additional dynamic particles
        for (let i = 0; i < 5; i++) {
            const particle = document.createElement("div");
            particle.className = "particle";
            particle.style.cssText = `
                width: ${Math.random() * 4 + 2}px;
                height: ${Math.random() * 4 + 2}px;
                top: ${Math.random() * 100}%;
                left: ${Math.random() * 100}%;
                animation-delay: ${Math.random() * 10}s;
                animation-duration: ${Math.random() * 8 + 10}s;
            `;
            particlesContainer.appendChild(particle);
        }
    }
}

// Animation Controller
class AnimationController {
    constructor() {
        this.observerOptions = {
            threshold: 0.1,
            rootMargin: "0px 0px -50px 0px",
        };
        this.animatedElements = new Set();
    }

    init() {
        this.setupIntersectionObserver();
        this.observeElements();
    }

    setupIntersectionObserver() {
        this.observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => this.handleIntersection(entry));
        }, this.observerOptions);
    }

    handleIntersection(entry) {
        if (entry.isIntersecting && !this.animatedElements.has(entry.target)) {
            const element = entry.target;
            this.animatedElements.add(element);

            // Handle different animation types
            if (element.classList.contains("counter")) {
                this.animateCounters();
            }

            if (element.classList.contains("animate-on-scroll")) {
                element.classList.add("visible");
            }

            if (element.classList.contains("section-animate")) {
                element.classList.add("visible");
            }

            this.animateCounterElements(element);
            this.observer.unobserve(element);
        }
    }

    animateCounterElements(element) {
        const counterElements = element.querySelectorAll(".counter-animate");
        counterElements.forEach((counter, index) => {
            setTimeout(() => {
                const target = parseInt(counter.getAttribute("data-target"));
                utils.animateNumber(counter, 0, target, 1000);
            }, index * 200);
        });
    }

    animateCounters() {
        const counters = utils.$$(".counter");
        counters.forEach((counter) => {
            const target = parseInt(counter.getAttribute("data-target"));
            utils.animateNumber(counter, 0, target, 2000, () => {
                counter.style.transform = "scale(1.05)";
                counter.style.color = "#fd820e";
                setTimeout(() => {
                    counter.style.transform = "scale(1)";
                    counter.style.color = "";
                }, 200);
            });
        });
    }

    observeElements() {
        const elements = utils.$$(
            ".counter, .animate-on-scroll, .section-animate, .activity-card, .principle-card"
        );
        elements.forEach((element) => this.observer.observe(element));
    }
}

// Executive Council Slider Class
class ExecutiveSlider {
    constructor() {
        this.slider = utils.$("#executive-slider");
        this.cards = this.slider?.querySelectorAll(".executive-card");
        this.prevBtn = utils.$("#executive-prev-btn");
        this.nextBtn = utils.$("#executive-next-btn");
        this.indicatorContainer = utils.$("#executive-indicators");

        if (!this.slider || !this.cards.length) {
            console.warn("Executive slider elements not found");
            return;
        }

        this.currentSlide = 0;
        this.isTransitioning = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;

        // Responsive settings
        this.breakpoints = {
            mobile: 767,
            tablet: 1023,
            desktop: 1279,
        };

        this.init();
    }

    init() {
        this.calculateSlides();
        this.createIndicators();
        this.setupEventListeners();
        this.setupTouchEvents();
        this.setupKeyboardNavigation();
        this.setupIntersectionObserver();
        this.updateSlider();
        this.startAutoPlay();

        console.log(
            `Executive Slider initialized with ${this.cards.length} members, ${this.totalSlides} slides, ${this.cardsPerSlide} cards per slide`
        );
    }

    calculateSlides() {
        const screenWidth = window.innerWidth;

        if (screenWidth <= this.breakpoints.mobile) {
            this.cardsPerSlide = 1;
        } else if (screenWidth <= this.breakpoints.tablet) {
            this.cardsPerSlide = 2;
        } else if (screenWidth <= this.breakpoints.desktop) {
            this.cardsPerSlide = 3;
        } else {
            this.cardsPerSlide = 4;
        }

        this.totalSlides = Math.ceil(this.cards.length / this.cardsPerSlide);
        this.maxSlide = Math.max(0, this.totalSlides - 1);
        this.currentSlide = Math.min(this.currentSlide, this.maxSlide);
        this.updateCardWidths();
    }

    updateCardWidths() {
        const cardWidth = 100 / this.cardsPerSlide;
        this.cards.forEach((card) => {
            card.style.width = `${cardWidth}%`;
            card.style.flex = `0 0 ${cardWidth}%`;
        });
    }

    createIndicators() {
        if (!this.indicatorContainer) return;

        this.indicatorContainer.innerHTML = "";

        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement("div");
            indicator.className = `executive-indicator w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 cursor-pointer ${
                i === 0 ? "bg-accent" : "bg-gray-300"
            }`;
            indicator.setAttribute("data-slide", i);
            indicator.setAttribute("aria-label", `Go to slide ${i + 1}`);
            indicator.setAttribute("role", "button");
            indicator.setAttribute("tabindex", "0");

            indicator.addEventListener("click", () => this.goToSlide(i));
            indicator.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.goToSlide(i);
                }
            });

            this.indicatorContainer.appendChild(indicator);
        }

        this.indicators = this.indicatorContainer.querySelectorAll(
            ".executive-indicator"
        );
    }

    setupEventListeners() {
        this.prevBtn?.addEventListener("click", () => {
            this.prev();
            this.pauseAutoPlay();
            this.resumeAutoPlayDelayed();
        });

        this.nextBtn?.addEventListener("click", () => {
            this.next();
            this.pauseAutoPlay();
            this.resumeAutoPlayDelayed();
        });

        this.cards.forEach((card, index) => {
            card.addEventListener("click", () => {
                this.handleCardClick(card, index);
            });

            card.setAttribute("tabindex", "0");
            card.setAttribute("role", "button");
            card.setAttribute(
                "aria-label",
                `Executive Council Member ${index + 1}`
            );

            card.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.handleCardClick(card, index);
                }
            });
        });

        if (window.innerWidth > this.breakpoints.mobile) {
            this.slider.addEventListener("mouseenter", () =>
                this.pauseAutoPlay()
            );
            this.slider.addEventListener("mouseleave", () =>
                this.startAutoPlay()
            );
        }

        window.addEventListener(
            "resize",
            utils.debounce(() => {
                this.handleResize();
            }, 250)
        );
    }

    setupTouchEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        const threshold = 50;

        this.slider.addEventListener(
            "touchstart",
            (e) => {
                if (this.isTransitioning) return;
                startX = e.touches[0].clientX;
                isDragging = true;
                this.pauseAutoPlay();
            },
            { passive: true }
        );

        this.slider.addEventListener(
            "touchmove",
            (e) => {
                if (!isDragging || this.isTransitioning) return;
                currentX = e.touches[0].clientX;
                const diff = Math.abs(startX - currentX);
                if (diff > 10) {
                    e.preventDefault();
                }
            },
            { passive: false }
        );

        this.slider.addEventListener("touchend", () => {
            if (!isDragging || this.isTransitioning) return;
            const diff = startX - currentX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }

            isDragging = false;
            this.resumeAutoPlayDelayed();
        });
    }

    setupKeyboardNavigation() {
        this.slider.setAttribute("tabindex", "0");
        this.slider.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    e.preventDefault();
                    this.prev();
                    this.pauseAutoPlay();
                    this.resumeAutoPlayDelayed();
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    this.next();
                    this.pauseAutoPlay();
                    this.resumeAutoPlayDelayed();
                    break;
                case "Home":
                    e.preventDefault();
                    this.goToSlide(0);
                    this.pauseAutoPlay();
                    this.resumeAutoPlayDelayed();
                    break;
                case "End":
                    e.preventDefault();
                    this.goToSlide(this.maxSlide);
                    this.pauseAutoPlay();
                    this.resumeAutoPlayDelayed();
                    break;
            }
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.startAutoPlay();
                    } else {
                        this.pauseAutoPlay();
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(this.slider);
    }

    updateSlider() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;

        const translatePercentage = -(this.currentSlide * 100);
        this.slider.style.transform = `translateX(${translatePercentage}%)`;

        if (this.indicators) {
            this.indicators.forEach((indicator, index) => {
                const isActive = index === this.currentSlide;
                indicator.classList.toggle("active", isActive);
                indicator.style.background = isActive ? "#fd820e" : "#d1d5db";
                indicator.setAttribute("aria-selected", isActive);
            });
        }

        this.addEntranceAnimations();

        setTimeout(() => {
            this.isTransitioning = false;
        }, 700);

        this.announceSlideChange();
    }

    addEntranceAnimations() {
        const startIndex = this.currentSlide * this.cardsPerSlide;
        const endIndex = Math.min(
            startIndex + this.cardsPerSlide,
            this.cards.length
        );

        for (let i = startIndex; i < endIndex; i++) {
            const card = this.cards[i];
            if (card) {
                card.classList.remove("slide-in-left", "slide-in-right");
                setTimeout(() => {
                    card.classList.add(
                        i % 2 === 0 ? "slide-in-left" : "slide-in-right"
                    );
                }, (i - startIndex) * 100);
            }
        }
    }

    next() {
        if (this.isTransitioning) return;
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
        this.addButtonFeedback(this.nextBtn);
    }

    prev() {
        if (this.isTransitioning) return;
        this.currentSlide =
            this.currentSlide === 0 ? this.maxSlide : this.currentSlide - 1;
        this.updateSlider();
        this.addButtonFeedback(this.prevBtn);
    }

    goToSlide(index) {
        if (
            this.isTransitioning ||
            index === this.currentSlide ||
            index < 0 ||
            index >= this.totalSlides
        )
            return;
        this.currentSlide = index;
        this.updateSlider();
    }

    addButtonFeedback(button) {
        if (!button) return;
        button.style.transform = "scale(0.95)";
        setTimeout(() => {
            button.style.transform = "scale(1)";
        }, 150);
    }

    handleCardClick(card, index) {
        card.style.transform = "scale(0.98)";
        setTimeout(() => {
            card.style.transform = "";
        }, 150);

        console.log(`Clicked on Executive Member ${index + 1}`);
        this.showMemberDetails(index);
    }

    showMemberDetails(index) {
        const memberName = `Executive Council Member ${index + 1}`;
        this.showNotification(`Viewing profile of ${memberName}`);
    }

    showNotification(message) {
        const notification = document.createElement("div");
        notification.className =
            "fixed top-4 right-4 bg-white border border-gray-200 rounded-lg shadow-lg p-4 max-w-sm z-50 transform translate-x-full transition-transform duration-300";
        notification.innerHTML = `
            <div class="flex items-start">
                <div class="flex-shrink-0">
                    <i data-lucide="user" class="w-5 h-5 text-accent"></i>
                </div>
                <div class="ml-3">
                    <p class="text-sm text-gray-700">${message}</p>
                </div>
                <button class="ml-4 flex-shrink-0 text-gray-400 hover:text-gray-600">
                    <i data-lucide="x" class="w-4 h-4"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }

        setTimeout(() => {
            notification.style.transform = "translateX(0)";
        }, 100);

        const closeBtn = notification.querySelector("button");
        closeBtn.addEventListener("click", () => {
            this.closeNotification(notification);
        });

        setTimeout(() => {
            this.closeNotification(notification);
        }, 4000);
    }

    closeNotification(notification) {
        notification.style.transform = "translateX(100%)";
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }

    startAutoPlay() {
        if (this.autoPlayInterval || this.totalSlides <= 1) return;
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.autoPlayDelay);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resumeAutoPlayDelayed() {
        setTimeout(() => {
            this.startAutoPlay();
        }, 3000);
    }

    handleResize() {
        const oldCardsPerSlide = this.cardsPerSlide;
        const oldTotalSlides = this.totalSlides;

        this.calculateSlides();

        if (
            oldCardsPerSlide !== this.cardsPerSlide ||
            oldTotalSlides !== this.totalSlides
        ) {
            const currentMemberIndex = this.currentSlide * oldCardsPerSlide;
            this.currentSlide = Math.floor(
                currentMemberIndex / this.cardsPerSlide
            );
            this.currentSlide = Math.min(this.currentSlide, this.maxSlide);
            this.createIndicators();
        }

        this.updateSlider();
    }

    announceSlideChange() {
        const startIndex = this.currentSlide * this.cardsPerSlide + 1;
        const endIndex = Math.min(
            startIndex + this.cardsPerSlide - 1,
            this.cards.length
        );
        const announcement = `Showing executive members ${startIndex} to ${endIndex} of ${this.cards.length}`;

        let liveRegion = document.getElementById("executive-live-region");
        if (!liveRegion) {
            liveRegion = document.createElement("div");
            liveRegion.id = "executive-live-region";
            liveRegion.setAttribute("aria-live", "polite");
            liveRegion.setAttribute("aria-atomic", "true");
            liveRegion.className = "sr-only";
            document.body.appendChild(liveRegion);
        }

        liveRegion.textContent = announcement;
    }

    destroy() {
        this.pauseAutoPlay();
        const liveRegion = document.getElementById("executive-live-region");
        if (liveRegion) {
            liveRegion.remove();
        }
        console.log("Executive Slider destroyed");
    }
}

// Enhanced Slider Class with Fixed Mobile Issues
class EnhancedSlider {
    constructor(sliderId, options = {}) {
        this.slider = utils.$(`#${sliderId}`);
        if (!this.slider) return;

        this.slides = this.slider.querySelectorAll(
            ".programs-slider-card, .slider-card, .team-card"
        );
        this.currentSlide = 0;
        this.cardsPerView = options.cardsPerView || this.getCardsPerView();
        this.maxSlide = Math.max(0, this.slides.length - this.cardsPerView);
        this.autoPlay = options.autoPlay || false;
        this.autoPlayInterval = options.autoPlayInterval || 4000;
        this.autoPlayTimer = null;
        this.isDragging = false;
        this.startX = 0;
        this.currentX = 0;
        this.threshold = 50;
        this.isTransitioning = false;
        this.isMobile = utils.isMobile();

        this.init();
    }

    getCardsPerView() {
        if (this.slider.id === "programs-slider") {
            return window.innerWidth >= 1024 ? 2 : 1;
        }
        return window.innerWidth >= 1024 ? 3 : window.innerWidth >= 768 ? 2 : 1;
    }

    init() {
        this.setupEventListeners();
        this.updateSlider();
        this.addKeyboardNavigation();
        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }

    setupEventListeners() {
        // Touch events for mobile
        this.slider.addEventListener(
            "touchstart",
            this.handleTouchStart.bind(this),
            { passive: true }
        );
        this.slider.addEventListener(
            "touchmove",
            this.handleTouchMove.bind(this),
            { passive: false }
        );
        this.slider.addEventListener(
            "touchend",
            this.handleTouchEnd.bind(this)
        );

        // Mouse events for desktop
        if (!this.isMobile) {
            this.slider.addEventListener(
                "mousedown",
                this.handleMouseDown.bind(this)
            );
            this.slider.addEventListener(
                "mousemove",
                this.handleMouseMove.bind(this)
            );
            this.slider.addEventListener(
                "mouseup",
                this.handleMouseUp.bind(this)
            );
            this.slider.addEventListener(
                "mouseleave",
                this.handleMouseUp.bind(this)
            );
        }

        // Prevent default drag behavior
        this.slider.addEventListener("dragstart", (e) => e.preventDefault());

        // Resize handler with debouncing
        window.addEventListener(
            "resize",
            utils.debounce(() => {
                this.handleResize();
            }, 250)
        );

        // Auto-play pause on hover (desktop only)
        if (this.autoPlay && !this.isMobile) {
            this.slider.addEventListener("mouseenter", () =>
                this.pauseAutoPlay()
            );
            this.slider.addEventListener("mouseleave", () =>
                this.startAutoPlay()
            );
        }
    }

    addKeyboardNavigation() {
        this.slider.setAttribute("tabindex", "0");
        this.slider.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    e.preventDefault();
                    this.prev();
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    this.next();
                    break;
                case "Home":
                    e.preventDefault();
                    this.goToSlide(0);
                    break;
                case "End":
                    e.preventDefault();
                    this.goToSlide(this.maxSlide);
                    break;
            }
        });
    }

    handleTouchStart(e) {
        if (this.isTransitioning) return;
        this.startX = e.touches[0].clientX;
        this.isDragging = true;
        this.pauseAutoPlay();
    }

    handleTouchMove(e) {
        if (!this.isDragging || this.isTransitioning) return;
        this.currentX = e.touches[0].clientX;
        const diff = this.startX - this.currentX;
        if (Math.abs(diff) > 10) {
            e.preventDefault();
        }
    }

    handleTouchEnd() {
        if (!this.isDragging || this.isTransitioning) return;
        const diff = this.startX - this.currentX;
        if (Math.abs(diff) > this.threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
        this.isDragging = false;
        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }

    handleMouseDown(e) {
        if (this.isTransitioning) return;
        this.startX = e.clientX;
        this.isDragging = true;
        this.slider.style.cursor = "grabbing";
        this.pauseAutoPlay();
        e.preventDefault();
    }

    handleMouseMove(e) {
        if (!this.isDragging || this.isTransitioning) return;
        this.currentX = e.clientX;
        e.preventDefault();
    }

    handleMouseUp() {
        if (!this.isDragging || this.isTransitioning) return;
        const diff = this.startX - this.currentX;
        if (Math.abs(diff) > this.threshold) {
            if (diff > 0) {
                this.next();
            } else {
                this.prev();
            }
        }
        this.isDragging = false;
        this.slider.style.cursor = "grab";
        if (this.autoPlay) {
            this.startAutoPlay();
        }
    }

    handleResize() {
        const newCardsPerView = this.getCardsPerView();
        if (newCardsPerView !== this.cardsPerView) {
            this.cardsPerView = newCardsPerView;
            this.maxSlide = Math.max(0, this.slides.length - this.cardsPerView);
            this.currentSlide = Math.min(this.currentSlide, this.maxSlide);
            this.updateSlider();
        }
        this.isMobile = utils.isMobile();
    }

    updateSlider() {
        if (this.slides.length === 0) return;
        this.isTransitioning = true;

        // Get actual margin-right from computed style
        const slideStyle = getComputedStyle(this.slides[0]);
        const marginRight = Number.parseInt(slideStyle.marginRight, 10) || 0;
        const slideWidth = this.slides[0].offsetWidth + marginRight;
        const translateX = -this.currentSlide * slideWidth;

        this.slider.style.transform = `translateX(${translateX}px)`;

        // Update indicators for programs slider
        if (this.slider.id === "programs-slider") {
            this.updateIndicators();
        }

        // Reset transition flag after animation
        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    updateIndicators() {
        const indicators = utils.$$(".programs-indicator");
        indicators.forEach((indicator, index) => {
            const isActive = index === this.currentSlide;
            indicator.classList.toggle("bg-accent", isActive);
            indicator.classList.toggle("bg-gray-300", !isActive);
            indicator.setAttribute("aria-selected", isActive);
        });
    }

    next() {
        if (this.isTransitioning) return;
        this.currentSlide =
            this.currentSlide >= this.maxSlide ? 0 : this.currentSlide + 1;
        this.updateSlider();
    }

    prev() {
        if (this.isTransitioning) return;
        this.currentSlide =
            this.currentSlide <= 0 ? this.maxSlide : this.currentSlide - 1;
        this.updateSlider();
    }

    goToSlide(slideIndex) {
        if (this.isTransitioning || slideIndex === this.currentSlide) return;
        this.currentSlide = Math.max(0, Math.min(slideIndex, this.maxSlide));
        this.updateSlider();
    }

    startAutoPlay() {
        if (!this.autoPlay || this.isDragging) return;
        this.pauseAutoPlay();
        this.autoPlayTimer = setInterval(() => {
            this.next();
        }, this.autoPlayInterval);
    }

    pauseAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }
}
// Enhanced Past Events Slider Class
class PastEventsSlider {
    constructor() {
        this.slider = utils.$("#past-events-slider");
        this.slides = this.slider?.querySelectorAll(".past-event-card");
        this.indicators = utils.$$(".past-events-indicator");
        this.prevBtn = utils.$("#past-events-prev-btn");
        this.nextBtn = utils.$("#past-events-next-btn");

        if (!this.slider || !this.slides.length) {
            console.warn("Past events slider elements not found");
            return;
        }

        this.currentSlide = 0;
        this.maxSlide = this.slides.length - 1;
        this.isTransitioning = false;
        this.isMobile = utils.isMobile();
        this.autoPlayInterval = null;
        this.autoPlayDelay = 8000;

        this.init();
    }

    init() {
        this.updateSlider();
        this.setupEventListeners();
        this.setupKeyboardNavigation();
        this.setupTouchEvents();
        this.setupIntersectionObserver();
        this.startAutoPlay();

        if (this.slides[0]) {
            this.slides[0].classList.add("active");
        }

        console.log(
            `Past Events Slider initialized with ${this.slides.length} slides`
        );
    }

    setupEventListeners() {
        this.prevBtn?.addEventListener("click", () => {
            this.prev();
            this.pauseAutoPlay();
            this.resumeAutoPlayDelayed();
        });

        this.nextBtn?.addEventListener("click", () => {
            this.next();
            this.pauseAutoPlay();
            this.resumeAutoPlayDelayed();
        });

        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener("click", () => {
                if (index !== this.currentSlide) {
                    this.goToSlide(index);
                    this.pauseAutoPlay();
                    this.resumeAutoPlayDelayed();
                }
            });
        });

        if (!this.isMobile) {
            this.slider.addEventListener("mouseenter", () =>
                this.pauseAutoPlay()
            );
            this.slider.addEventListener("mouseleave", () =>
                this.startAutoPlay()
            );
        }

        window.addEventListener(
            "resize",
            utils.debounce(() => {
                this.handleResize();
            }, 250)
        );
    }

    setupTouchEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        const threshold = 50;

        this.slider.addEventListener(
            "touchstart",
            (e) => {
                if (this.isTransitioning) return;
                startX = e.touches[0].clientX;
                isDragging = true;
                this.pauseAutoPlay();
            },
            { passive: true }
        );

        this.slider.addEventListener(
            "touchmove",
            (e) => {
                if (!isDragging || this.isTransitioning) return;
                currentX = e.touches[0].clientX;
                const diff = Math.abs(startX - currentX);
                if (diff > 10) {
                    e.preventDefault();
                }
            },
            { passive: false }
        );

        this.slider.addEventListener("touchend", () => {
            if (!isDragging || this.isTransitioning) return;
            const diff = startX - currentX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }

            isDragging = false;
            this.resumeAutoPlayDelayed();
        });
    }

    setupKeyboardNavigation() {
        this.slider.setAttribute("tabindex", "0");
        this.slider.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    e.preventDefault();
                    this.prev();
                    this.pauseAutoPlay();
                    this.resumeAutoPlayDelayed();
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    this.next();
                    this.pauseAutoPlay();
                    this.resumeAutoPlayDelayed();
                    break;
                case "Home":
                    e.preventDefault();
                    this.goToSlide(0);
                    this.pauseAutoPlay();
                    this.resumeAutoPlayDelayed();
                    break;
                case "End":
                    e.preventDefault();
                    this.goToSlide(this.maxSlide);
                    this.pauseAutoPlay();
                    this.resumeAutoPlayDelayed();
                    break;
            }
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.startAutoPlay();
                    } else {
                        this.pauseAutoPlay();
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(this.slider);
    }

    updateSlider() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;

        const translateX = -this.currentSlide * 100;
        this.slider.style.transform = `translateX(${translateX}%)`;

        this.slides.forEach((slide, index) => {
            slide.classList.toggle("active", index === this.currentSlide);
        });

        this.indicators.forEach((indicator, index) => {
            const isActive = index === this.currentSlide;
            indicator.classList.toggle("active", isActive);
            indicator.style.background = isActive ? "#fd820e" : "#d1d5db";
            indicator.setAttribute("aria-selected", isActive);
        });

        const currentSlideElement = this.slides[this.currentSlide];
        if (currentSlideElement) {
            const img = currentSlideElement.querySelector("img");
            if (img) {
                img.style.animation = "fadeIn 0.8s ease-out";
                setTimeout(() => {
                    img.style.animation = "";
                }, 800);
            }
        }

        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);

        this.announceSlideChange();
    }

    next() {
        if (this.isTransitioning) return;
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
        this.addButtonFeedback(this.nextBtn);
    }

    prev() {
        if (this.isTransitioning) return;
        this.currentSlide =
            this.currentSlide === 0 ? this.maxSlide : this.currentSlide - 1;
        this.updateSlider();
        this.addButtonFeedback(this.prevBtn);
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        this.currentSlide = Math.max(0, Math.min(index, this.maxSlide));
        this.updateSlider();
    }

    addButtonFeedback(button) {
        if (!button) return;
        button.style.transform = "scale(0.95)";
        setTimeout(() => {
            button.style.transform = "scale(1)";
        }, 150);
    }

    startAutoPlay() {
        if (this.autoPlayInterval) return;
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.autoPlayDelay);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resumeAutoPlayDelayed() {
        setTimeout(() => {
            this.startAutoPlay();
        }, 3000);
    }

    handleResize() {
        this.isMobile = utils.isMobile();
        this.updateSlider();
    }

    announceSlideChange() {
        const currentSlideElement = this.slides[this.currentSlide];
        const title = currentSlideElement.querySelector("h3")?.textContent;
        const date =
            currentSlideElement.querySelector(".text-accent span")?.textContent;

        if (title && date) {
            const announcement = `Slide ${this.currentSlide + 1} of ${
                this.slides.length
            }: ${title}, ${date}`;

            let liveRegion = document.getElementById("slider-live-region");
            if (!liveRegion) {
                liveRegion = document.createElement("div");
                liveRegion.id = "slider-live-region";
                liveRegion.setAttribute("aria-live", "polite");
                liveRegion.setAttribute("aria-atomic", "true");
                liveRegion.className = "sr-only";
                document.body.appendChild(liveRegion);
            }

            liveRegion.textContent = announcement;
        }
    }

    destroy() {
        this.pauseAutoPlay();
        const liveRegion = document.getElementById("slider-live-region");
        if (liveRegion) {
            liveRegion.remove();
        }
        console.log("Past Events Slider destroyed");
    }
}

// Testimonials Slider Class
class TestimonialsSlider {
    constructor() {
        this.slider = utils.$("#testimonials-slider");
        this.slides = this.slider?.querySelectorAll(".testimonial-card");
        this.indicators = utils.$$(".testimonial-indicator");
        this.prevBtn = utils.$("#testimonials-prev-btn");
        this.nextBtn = utils.$("#testimonials-next-btn");

        if (!this.slider || !this.slides.length) return;

        this.currentSlide = 0;
        this.autoPlayInterval = 6000;
        this.autoPlayTimer = null;
        this.isTransitioning = false;
        this.isMobile = utils.isMobile();

        this.init();
    }

    init() {
        this.updateSlider();
        this.setupEventListeners();
        this.startAutoPlay();

        if (this.slides[0]) {
            this.slides[0].classList.add("active");
        }
    }

    setupEventListeners() {
        this.prevBtn?.addEventListener("click", () => {
            this.prev();
            this.pauseAutoPlay();
            this.startAutoPlayDelayed();
        });

        this.nextBtn?.addEventListener("click", () => {
            this.next();
            this.pauseAutoPlay();
            this.startAutoPlayDelayed();
        });

        this.indicators.forEach((indicator, index) => {
            indicator.addEventListener("click", () => {
                if (index !== this.currentSlide) {
                    this.goToSlide(index);
                    this.pauseAutoPlay();
                    this.startAutoPlayDelayed();
                }
            });
        });

        if (!this.isMobile) {
            this.slider.addEventListener("mouseenter", () =>
                this.pauseAutoPlay()
            );
            this.slider.addEventListener("mouseleave", () =>
                this.startAutoPlay()
            );
        }

        this.setupTouchEvents();
    }

    setupTouchEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;

        this.slider.addEventListener(
            "touchstart",
            (e) => {
                startX = e.touches[0].clientX;
                isDragging = true;
                this.pauseAutoPlay();
            },
            { passive: true }
        );

        this.slider.addEventListener(
            "touchmove",
            (e) => {
                if (!isDragging) return;
                currentX = e.touches[0].clientX;
            },
            { passive: true }
        );

        this.slider.addEventListener("touchend", () => {
            if (!isDragging) return;
            const diff = startX - currentX;
            const threshold = 50;
            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }
            isDragging = false;
            this.startAutoPlayDelayed();
        });
    }

    updateSlider() {
        if (this.isTransitioning) return;
        this.isTransitioning = true;

        const translateX = -this.currentSlide * 100;
        this.slider.style.transform = `translateX(${translateX}%)`;

        this.slides.forEach((slide, index) => {
            slide.classList.toggle("active", index === this.currentSlide);
        });

        this.indicators.forEach((indicator, index) => {
            const isActive = index === this.currentSlide;
            indicator.classList.toggle("active", isActive);
            indicator.style.background = isActive
                ? "#fd820e"
                : "rgba(255, 255, 255, 0.3)";
            indicator.setAttribute("aria-selected", isActive);
        });

        setTimeout(() => {
            this.isTransitioning = false;
        }, 600);
    }

    next() {
        if (this.isTransitioning) return;
        this.currentSlide = (this.currentSlide + 1) % this.slides.length;
        this.updateSlider();
    }

    prev() {
        if (this.isTransitioning) return;
        this.currentSlide =
            this.currentSlide === 0
                ? this.slides.length - 1
                : this.currentSlide - 1;
        this.updateSlider();
    }

    goToSlide(index) {
        if (this.isTransitioning || index === this.currentSlide) return;
        this.currentSlide = index;
        this.updateSlider();
    }

    startAutoPlay() {
        this.pauseAutoPlay();
        this.autoPlayTimer = setInterval(() => {
            this.next();
        }, this.autoPlayInterval);
    }

    pauseAutoPlay() {
        if (this.autoPlayTimer) {
            clearInterval(this.autoPlayTimer);
            this.autoPlayTimer = null;
        }
    }

    startAutoPlayDelayed() {
        setTimeout(() => {
            this.startAutoPlay();
        }, 3000);
    }
}

// Click to Top Controller
class ClickToTopController {
    constructor() {
        this.button = utils.$("#click-to-top");
        this.init();
    }

    init() {
        if (!this.button) return;

        this.button.addEventListener("click", (e) => this.handleClick(e));
        window.addEventListener(
            "scroll",
            utils.throttle(() => this.toggleVisibility(), 100)
        );
    }

    handleClick(e) {
        e.preventDefault();

        this.button.style.transform = "scale(0.9)";
        setTimeout(() => {
            this.button.style.transform = "";
        }, 200);

        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    }

    toggleVisibility() {
        const scrollTop =
            window.pageYOffset || document.documentElement.scrollTop;
        const documentHeight = document.documentElement.scrollHeight;
        const windowHeight = window.innerHeight;

        if (scrollTop > documentHeight * 0.3) {
            this.button.classList.add("visible");
        } else {
            this.button.classList.remove("visible");
        }
    }
}

// Navbar Controller
class NavbarController {
    constructor() {
        this.navbar = utils.$(".nav-bar");
        this.init();
    }

    init() {
        if (!this.navbar) return;
        window.addEventListener(
            "scroll",
            utils.throttle(() => this.updateOnScroll(), 100)
        );
    }

    updateOnScroll() {
        const scrollTop = window.pageYOffset;
        if (scrollTop > 100) {
            this.navbar.classList.add("scrolled");
        } else {
            this.navbar.classList.remove("scrolled");
        }
    }
}

// Contact Form Controller
class ContactFormController {
    constructor() {
        this.form = utils.$("#contact-form");
        this.init();
    }

    init() {
        if (!this.form) return;

        this.form.addEventListener("submit", (e) => this.handleSubmit(e));
        this.setupRealTimeValidation();
    }

    handleSubmit(e) {
        e.preventDefault();

        const submitBtn = this.form.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;

        submitBtn.textContent = "Sending...";
        submitBtn.disabled = true;
        submitBtn.style.opacity = "0.7";

        const formData = new FormData(this.form);
        const data = Object.fromEntries(formData);

        const isValid = this.validateForm(data);

        setTimeout(() => {
            if (isValid) {
                this.showSuccess(submitBtn, originalText);
            } else {
                this.showError(submitBtn, originalText);
            }
        }, 1500);
    }

    validateForm(data) {
        const requiredFields = ["firstName", "lastName", "email", "message"];
        let isValid = true;

        requiredFields.forEach((field) => {
            const input = this.form.querySelector(`[name="${field}"]`);
            const errorElement = utils.$(`#${field}-error`);

            if (!data[field] || data[field].trim() === "") {
                this.showFieldError(
                    input,
                    errorElement,
                    "This field is required"
                );
                isValid = false;
            } else {
                this.showFieldSuccess(input, errorElement);
            }
        });

        const emailInput = this.form.querySelector('[name="email"]');
        const emailError = utils.$("#email-error");
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (data.email && !emailRegex.test(data.email)) {
            this.showFieldError(
                emailInput,
                emailError,
                "Please enter a valid email address"
            );
            isValid = false;
        }

        return isValid;
    }

    showFieldError(input, errorElement, message) {
        input.classList.add("error");
        input.classList.remove("success");
        if (errorElement) {
            errorElement.textContent = message;
            errorElement.classList.remove("hidden");
        }
        input.style.animation = "shake 0.5s ease-in-out";
    }

    showFieldSuccess(input, errorElement) {
        input.classList.add("success");
        input.classList.remove("error");
        if (errorElement) {
            errorElement.classList.add("hidden");
        }
        input.style.animation = "";
    }

    showSuccess(submitBtn, originalText) {
        submitBtn.textContent = "✓ Message Sent!";
        submitBtn.style.background = "#10b981";

        const successMsg = document.createElement("div");
        successMsg.className = "success-message";
        successMsg.innerHTML = `
            <div class="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mt-4 animate-fade-in-up">
                <strong>Thank you!</strong> Your message has been sent successfully. We'll get back to you soon.
            </div>
        `;
        this.form.appendChild(successMsg);

        setTimeout(() => {
            this.resetForm(submitBtn, originalText, successMsg);
        }, 3000);
    }

    showError(submitBtn, originalText) {
        submitBtn.textContent = "Please fix errors";
        submitBtn.style.background = "#ef4444";

        setTimeout(() => {
            submitBtn.textContent = originalText;
            submitBtn.style.background = "";
            submitBtn.disabled = false;
            submitBtn.style.opacity = "1";
        }, 2000);
    }

    resetForm(submitBtn, originalText, successMsg) {
        this.form.reset();
        submitBtn.textContent = originalText;
        submitBtn.style.background = "";
        submitBtn.disabled = false;
        submitBtn.style.opacity = "1";
        successMsg.remove();

        this.form.querySelectorAll("input, textarea").forEach((input) => {
            input.classList.remove("error", "success");
        });
    }

    setupRealTimeValidation() {
        this.form.querySelectorAll("input, textarea").forEach((input) => {
            input.addEventListener("blur", () => this.validateField(input));
            input.addEventListener("focus", () =>
                this.clearFieldValidation(input)
            );
        });
    }

    validateField(input) {
        const value = input.value.trim();
        const isRequired = input.hasAttribute("required");
        const isEmail = input.type === "email";

        if (isRequired && !value) {
            input.classList.add("error");
            input.classList.remove("success");
        } else if (isEmail && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (emailRegex.test(value)) {
                input.classList.add("success");
                input.classList.remove("error");
            } else {
                input.classList.add("error");
                input.classList.remove("success");
            }
        } else if (value) {
            input.classList.add("success");
            input.classList.remove("error");
        }
    }

    clearFieldValidation(input) {
        input.style.animation = "";
        const errorElement = utils.$(`#${input.name}-error`);
        if (errorElement) {
            errorElement.classList.add("hidden");
        }
    }
}

// Newsletter Controller
class NewsletterController {
    constructor() {
        this.form = utils.$(".newsletter-form");
        this.init();
    }

    init() {
        if (!this.form) return;

        const emailInput = this.form.querySelector('input[type="email"]');
        const submitButton = this.form.querySelector("button");

        submitButton.addEventListener("click", (e) => {
            e.preventDefault();
            this.handleSubmit(emailInput, submitButton);
        });

        emailInput.addEventListener("focus", () =>
            this.clearValidation(emailInput)
        );
    }

    handleSubmit(emailInput, submitButton) {
        const email = emailInput.value.trim();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!email) {
            this.showError(emailInput, "Please enter your email");
            return;
        }

        if (!emailRegex.test(email)) {
            this.showError(emailInput, "Please enter a valid email");
            return;
        }

        this.showSuccess(emailInput, submitButton);
    }

    showError(emailInput, message) {
        emailInput.style.borderColor = "#ef4444";
        emailInput.placeholder = message;
        emailInput.style.animation = "shake 0.5s ease-in-out";
    }

    showSuccess(emailInput, submitButton) {
        emailInput.style.borderColor = "#10b981";
        submitButton.innerHTML = '<i data-lucide="check" class="w-5 h-5"></i>';
        submitButton.style.background = "#10b981";

        setTimeout(() => {
            emailInput.value = "";
            emailInput.style.borderColor = "";
            emailInput.placeholder = "Your email";
            submitButton.innerHTML =
                '<i data-lucide="send" class="w-5 h-5"></i>';
            submitButton.style.background = "";

            try {
                if (typeof lucide !== "undefined") {
                    lucide.createIcons();
                }
            } catch (error) {
                console.warn("Failed to reinitialize icons:", error);
            }
        }, 2000);
    }

    clearValidation(emailInput) {
        emailInput.style.borderColor = "#fd820e";
        emailInput.style.animation = "";
    }
}

// Team Slider Class
class TeamSlider {
    constructor() {
        this.slider = utils.$("#team-slider");
        this.cards = this.slider?.querySelectorAll(".team-card");
        this.prevBtn = utils.$("#team-prev-btn");
        this.nextBtn = utils.$("#team-next-btn");
        this.indicatorContainer = utils.$("#team-indicators");

        if (!this.slider || !this.cards.length) {
            console.warn("Team slider elements not found");
            return;
        }

        this.currentSlide = 0;
        this.isTransitioning = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 4000;

        // Responsive settings
        this.breakpoints = {
            mobile: 767,
            tablet: 1023,
            desktop: 1279,
        };

        this.init();
    }

    init() {
        this.calculateSlides();
        this.createIndicators();
        this.setupEventListeners();
        this.setupTouchEvents();
        this.setupKeyboardNavigation();
        this.setupIntersectionObserver();
        this.updateSlider();
        this.startAutoPlay();

        console.log(
            `Team Slider initialized with ${this.cards.length} members, ${this.totalSlides} slides, ${this.cardsPerSlide} cards per slide`
        );
    }

    calculateSlides() {
        const screenWidth = window.innerWidth;

        if (screenWidth <= this.breakpoints.mobile) {
            this.cardsPerSlide = 1;
        } else if (screenWidth <= this.breakpoints.tablet) {
            this.cardsPerSlide = 2;
        } else if (screenWidth <= this.breakpoints.desktop) {
            this.cardsPerSlide = 3;
        } else {
            this.cardsPerSlide = 4;
        }

        this.totalSlides = Math.ceil(this.cards.length / this.cardsPerSlide);
        this.maxSlide = Math.max(0, this.totalSlides - 1);
        this.currentSlide = Math.min(this.currentSlide, this.maxSlide);
        this.updateCardWidths();
    }

    updateCardWidths() {
        const cardWidth = 100 / this.cardsPerSlide;
        this.cards.forEach((card) => {
            card.style.width = `${cardWidth}%`;
            card.style.flex = `0 0 ${cardWidth}%`;
        });
    }

    createIndicators() {
        if (!this.indicatorContainer) return;

        this.indicatorContainer.innerHTML = "";

        for (let i = 0; i < this.totalSlides; i++) {
            const indicator = document.createElement("div");
            indicator.className = `team-indicator w-3 h-3 rounded-full transition-all duration-300 hover:scale-125 cursor-pointer ${
                i === 0 ? "bg-accent" : "bg-gray-300"
            }`;
            indicator.setAttribute("data-slide", i);
            indicator.setAttribute("aria-label", `Go to slide ${i + 1}`);
            indicator.setAttribute("role", "button");
            indicator.setAttribute("tabindex", "0");

            indicator.addEventListener("click", () => this.goToSlide(i));
            indicator.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.goToSlide(i);
                }
            });

            this.indicatorContainer.appendChild(indicator);
        }

        this.indicators =
            this.indicatorContainer.querySelectorAll(".team-indicator");
    }

    setupEventListeners() {
        this.prevBtn?.addEventListener("click", () => {
            this.prev();
            this.pauseAutoPlay();
            this.resumeAutoPlayDelayed();
        });

        this.nextBtn?.addEventListener("click", () => {
            this.next();
            this.pauseAutoPlay();
            this.resumeAutoPlayDelayed();
        });

        this.cards.forEach((card, index) => {
            card.addEventListener("click", () => {
                this.handleCardClick(card, index);
            });

            card.setAttribute("tabindex", "0");
            card.setAttribute("role", "button");
            card.setAttribute("aria-label", `Team Member ${index + 1}`);

            card.addEventListener("keydown", (e) => {
                if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    this.handleCardClick(card, index);
                }
            });
        });

        if (window.innerWidth > this.breakpoints.mobile) {
            this.slider.addEventListener("mouseenter", () =>
                this.pauseAutoPlay()
            );
            this.slider.addEventListener("mouseleave", () =>
                this.startAutoPlay()
            );
        }

        window.addEventListener(
            "resize",
            utils.debounce(() => {
                this.handleResize();
            }, 250)
        );
    }

    setupTouchEvents() {
        let startX = 0;
        let currentX = 0;
        let isDragging = false;
        const threshold = 50;

        this.slider.addEventListener(
            "touchstart",
            (e) => {
                if (this.isTransitioning) return;
                startX = e.touches[0].clientX;
                isDragging = true;
                this.pauseAutoPlay();
            },
            { passive: true }
        );

        this.slider.addEventListener(
            "touchmove",
            (e) => {
                if (!isDragging || this.isTransitioning) return;
                currentX = e.touches[0].clientX;
                const diff = Math.abs(startX - currentX);
                if (diff > 10) {
                    e.preventDefault();
                }
            },
            { passive: false }
        );

        this.slider.addEventListener("touchend", () => {
            if (!isDragging || this.isTransitioning) return;
            const diff = startX - currentX;

            if (Math.abs(diff) > threshold) {
                if (diff > 0) {
                    this.next();
                } else {
                    this.prev();
                }
            }

            isDragging = false;
            this.resumeAutoPlayDelayed();
        });
    }

    setupKeyboardNavigation() {
        this.slider.setAttribute("tabindex", "0");
        this.slider.addEventListener("keydown", (e) => {
            switch (e.key) {
                case "ArrowLeft":
                    e.preventDefault();
                    this.prev();
                    this.pauseAutoPlay();
                    this.resumeAutoPlayDelayed();
                    break;
                case "ArrowRight":
                    e.preventDefault();
                    this.next();
                    this.pauseAutoPlay();
                    this.resumeAutoPlayDelayed();
                    break;
                case "Home":
                    e.preventDefault();
                    this.goToSlide(0);
                    this.pauseAutoPlay();
                    this.resumeAutoPlayDelayed();
                    break;
                case "End":
                    e.preventDefault();
                    this.goToSlide(this.maxSlide);
                    this.pauseAutoPlay();
                    this.resumeAutoPlayDelayed();
                    break;
            }
        });
    }

    setupIntersectionObserver() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        this.startAutoPlay();
                    } else {
                        this.pauseAutoPlay();
                    }
                });
            },
            { threshold: 0.5 }
        );

        observer.observe(this.slider);
    }

    updateSlider() {
        if (this.isTransitioning) return;

        this.isTransitioning = true;

        const translatePercentage = -(this.currentSlide * 100);
        this.slider.style.transform = `translateX(${translatePercentage}%)`;

        if (this.indicators) {
            this.indicators.forEach((indicator, index) => {
                const isActive = index === this.currentSlide;
                indicator.classList.toggle("active", isActive);
                indicator.style.background = isActive ? "#fd820e" : "#d1d5db";
                indicator.setAttribute("aria-selected", isActive);
            });
        }

        this.addEntranceAnimations();

        setTimeout(() => {
            this.isTransitioning = false;
        }, 700);

        this.announceSlideChange();
    }

    addEntranceAnimations() {
        const startIndex = this.currentSlide * this.cardsPerSlide;
        const endIndex = Math.min(
            startIndex + this.cardsPerSlide,
            this.cards.length
        );

        for (let i = startIndex; i < endIndex; i++) {
            const card = this.cards[i];
            if (card) {
                card.style.opacity = "0";
                card.style.transform = "translateY(20px)";
                setTimeout(() => {
                    card.style.transition = "all 0.6s ease-out";
                    card.style.opacity = "1";
                    card.style.transform = "translateY(0)";
                }, (i - startIndex) * 100);
            }
        }
    }

    next() {
        if (this.isTransitioning) return;
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
        this.addButtonFeedback(this.nextBtn);
    }

    prev() {
        if (this.isTransitioning) return;
        this.currentSlide =
            this.currentSlide === 0 ? this.maxSlide : this.currentSlide - 1;
        this.updateSlider();
        this.addButtonFeedback(this.prevBtn);
    }

    goToSlide(index) {
        if (
            this.isTransitioning ||
            index === this.currentSlide ||
            index < 0 ||
            index >= this.totalSlides
        )
            return;
        this.currentSlide = index;
        this.updateSlider();
    }

    addButtonFeedback(button) {
        if (!button) return;
        button.style.transform = "scale(0.95)";
        setTimeout(() => {
            button.style.transform = "scale(1)";
        }, 150);
    }

    handleCardClick(card, index) {
        card.style.transform = "scale(0.98)";
        setTimeout(() => {
            card.style.transform = "";
        }, 150);

        console.log(`Clicked on Team Member ${index + 1}`);
    }

    startAutoPlay() {
        if (this.autoPlayInterval || this.totalSlides <= 1) return;
        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, this.autoPlayDelay);
    }

    pauseAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }

    resumeAutoPlayDelayed() {
        setTimeout(() => {
            this.startAutoPlay();
        }, 3000);
    }

    handleResize() {
        const oldCardsPerSlide = this.cardsPerSlide;
        const oldTotalSlides = this.totalSlides;

        this.calculateSlides();

        if (
            oldCardsPerSlide !== this.cardsPerSlide ||
            oldTotalSlides !== this.totalSlides
        ) {
            const currentMemberIndex = this.currentSlide * oldCardsPerSlide;
            this.currentSlide = Math.floor(
                currentMemberIndex / this.cardsPerSlide
            );
            this.currentSlide = Math.min(this.currentSlide, this.maxSlide);
            this.createIndicators();
        }

        this.updateSlider();
    }

    announceSlideChange() {
        const startIndex = this.currentSlide * this.cardsPerSlide + 1;
        const endIndex = Math.min(
            startIndex + this.cardsPerSlide - 1,
            this.cards.length
        );
        const announcement = `Showing team members ${startIndex} to ${endIndex} of ${this.cards.length}`;

        let liveRegion = document.getElementById("team-live-region");
        if (!liveRegion) {
            liveRegion = document.createElement("div");
            liveRegion.id = "team-live-region";
            liveRegion.setAttribute("aria-live", "polite");
            liveRegion.setAttribute("aria-atomic", "true");
            liveRegion.className = "sr-only";
            document.body.appendChild(liveRegion);
        }

        liveRegion.textContent = announcement;
    }

    destroy() {
        this.pauseAutoPlay();
        const liveRegion = document.getElementById("team-live-region");
        if (liveRegion) {
            liveRegion.remove();
        }
        console.log("Team Slider destroyed");
    }
}

// Initialize all controllers
let loadingManager,
    mobileMenuController,
    smoothScrollController,
    animationController;
let clickToTopController,
    navbarController,
    contactFormController,
    newsletterController;
let pastEventsSlider, testimonialsSlider, executiveSlider, teamSlider;

// DOM Content Loaded Event
document.addEventListener("DOMContentLoaded", () => {
    try {
        // Initialize Lucide icons
        if (typeof lucide !== "undefined") {
            lucide.createIcons();
        }

        // Initialize all controllers
        loadingManager = new LoadingManager();
        mobileMenuController = new MobileMenuController();
        smoothScrollController = new SmoothScrollController();
        animationController = new AnimationController();
        clickToTopController = new ClickToTopController();
        navbarController = new NavbarController();
        contactFormController = new ContactFormController();
        newsletterController = new NewsletterController();
        pastEventsSlider = new PastEventsSlider();
        const heroArtController = new HeroArtController();
        executiveSlider = new ExecutiveSlider();
        testimonialsSlider = new TestimonialsSlider();
        teamSlider = new TeamSlider();

        // Mark body as loaded
        setTimeout(() => {
            document.body.classList.add("loaded");
        }, 100);

        console.log(
            "🚀 Intellectium website loaded successfully with enhanced performance and responsiveness!"
        );
    } catch (error) {
        console.error("Error initializing website:", error);
    }
});

// Error handling for unhandled promise rejections
window.addEventListener("unhandledrejection", (event) => {
    console.error("Unhandled promise rejection:", event.reason);
    event.preventDefault();
});

// Error handling for general errors
window.addEventListener("error", (event) => {
    console.error("JavaScript error:", event.error);
});

// Add CSS for fadeIn animation
const fadeInCSS = `
@keyframes fadeIn {
    from {
        opacity: 0;
        transform: scale(1.02);
    }
    to {
        opacity: 1;
        transform: scale(1);
    }
}

.sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
}
`;

// Add the CSS to the document
const styleElement = document.createElement("style");
styleElement.textContent = fadeInCSS;
document.head.appendChild(styleElement);
