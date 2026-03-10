// Initialize Locomotive Scroll & GSAP ScrollTrigger
gsap.registerPlugin(ScrollTrigger);

const locoScroll = new LocomotiveScroll({
    el: document.querySelector("#main"),
    smooth: true,
    multiplier: 0.15, // Incredible buttery smoothness (very heavy)
    lerp: 0.05,
    smartphone: {
        smooth: true,
        multiplier: 0.3
    },
    tablet: {
        smooth: true,
        multiplier: 0.3
    }
});

// Sync Locomotive Scroll with GSAP ScrollTrigger
locoScroll.on("scroll", ScrollTrigger.update);

ScrollTrigger.scrollerProxy("#main", {
    scrollTop(value) {
        return arguments.length ? locoScroll.scrollTo(value, 0, 0) : locoScroll.scroll.instance.scroll.y;
    },
    getBoundingClientRect() {
        return { top: 0, left: 0, width: window.innerWidth, height: window.innerHeight };
    },
    pinType: document.querySelector("#main").style.transform ? "transform" : "fixed"
});

ScrollTrigger.addEventListener("refresh", () => locoScroll.update());

// --- Navbar Color Toggle Logic ---
ScrollTrigger.create({
    trigger: "#barter-services",
    endTrigger: "#ready",
    start: "top 5%",
    end: "bottom 5%",
    scroller: "#main",
    toggleClass: { targets: "#nav", className: "dark-nav" },
});


// --- Cursor Logic ---
function initCursor() {
    const cursor = document.querySelector("#cursor");

    // Auto-center cursor element accurately using GSAP so it handles width transitions safely
    gsap.set(cursor, { xPercent: -50, yPercent: -50 });

    window.addEventListener("mousemove", (e) => {
        gsap.to(cursor, {
            x: e.clientX,
            y: e.clientY,
            duration: 0.1,
            ease: "power2.out"
        });
    });

    // Hover scale effect for links and buttons to show 'View'
    const interactables = document.querySelectorAll("a, button, .btn, .icon, .read-more-btn, .card-btn, .tag, .map-pin");
    interactables.forEach(item => {
        item.addEventListener("mouseenter", () => {
            const isNav = item.closest("#nav");

            if (isNav) {
                cursor.classList.add("active"); // Just a standard small expansion, no text
            } else {
                cursor.classList.add("view-active"); // Custom class for view scaling
                const textEl = cursor.querySelector(".cursor-text");
                if (textEl) textEl.textContent = "VIEW";
            }
        });

        item.addEventListener("mouseleave", () => {
            cursor.classList.remove("active", "view-active");
            const textEl = cursor.querySelector(".cursor-text");
            if (textEl) textEl.textContent = "";
        });
    });
}

// Advanced cursor for Project Cards
const projectCards = document.querySelectorAll(".card");
const cursorText = document.querySelector(".cursor-text");

projectCards.forEach(card => {
    card.addEventListener("mouseenter", () => {
        cursor.classList.add("view-active");
        cursorText.textContent = "VIEW";
    });
    card.addEventListener("mouseleave", () => {
        cursor.classList.remove("view-active");
        cursorText.textContent = "";
    });
});

// --- Marquee Animation ---
gsap.to(".marque-text h1", {
    x: "-100%",
    repeat: -1,
    duration: 15, // Slowed down from 5s for better readability
    ease: "none",
});

function loaderAnimation() {
    const tl = gsap.timeline();

    tl.from(".hero-title", {
        y: 100,
        opacity: 0,
        duration: 1.2,
        ease: "power4.out",
        delay: 0.5
    });

    tl.from(".hero-description", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out"
    }, "-=0.8");

    tl.from(".stat-badge", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        stagger: 0.1,
        ease: "back.out(1.7)"
    }, "-=0.6");

    tl.from(".hero-btns", {
        y: 30,
        opacity: 0,
        duration: 0.8,
        ease: "power4.out"
    }, "-=0.5");
}

// --- Hero Slider Logic ---
function initHeroSlider() {
    const slides = document.querySelectorAll(".hero-slide");
    if (slides.length === 0) return;

    let currentSlide = 0;

    function nextSlide() {
        slides[currentSlide].classList.remove("active");
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add("active");
    }

    setInterval(nextSlide, 5000);
}

// --- Industry City Interactions ---
function initIndustryCity() {
    document.querySelectorAll('.map-pin').forEach(pin => {
        // Handle Redirects when clicking the button
        const btn = pin.querySelector('.learn-more');
        if (btn) {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                window.location.href = pin.dataset.link;
            });
        }

        // Mobile Tap Support
        pin.addEventListener('touchstart', function (e) {
            const allPins = document.querySelectorAll('.map-pin');
            allPins.forEach(p => {
                if (p !== pin) p.classList.remove('active');
            });
            pin.classList.toggle('active');
        }, { passive: true });
    });
}

// --- Eye Tracking Logic ---
function initEyeTracking() {
    window.addEventListener("mousemove", (e) => {
        let mouseX = e.clientX;
        let mouseY = e.clientY;

        document.querySelectorAll(".eye .line").forEach(line => {
            // Get eye center to be more precise
            const rect = line.closest('.eye').getBoundingClientRect();
            const eyeX = rect.left + rect.width / 2;
            const eyeY = rect.top + rect.height / 2;

            const dX = mouseX - eyeX;
            const dY = mouseY - eyeY;
            const eyeAngle = Math.atan2(dY, dX) * (180 / Math.PI);

            gsap.to(line, {
                rotate: eyeAngle - 180,
                duration: 0.2,
                ease: "power2.out"
            });
        });
    });
}

// --- Navigation Scroll Logic ---
function initNavScroll() {
    document.querySelectorAll('#nav .links a').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');

            // Allow default behavior for external links or if not anchor
            if (!targetId.startsWith('#')) return;

            e.preventDefault();

            if (targetId !== '#') {
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    locoScroll.scrollTo(targetElement, {
                        offset: -50, // Slight offset for nav bar space
                        duration: 1000,
                        easing: [0.25, 0.0, 0.35, 1.0]
                    });
                }
            } else {
                // Scroll to top if href is just '#'
                locoScroll.scrollTo(0, {
                    duration: 1000,
                    easing: [0.25, 0.0, 0.35, 1.0]
                });
            }
        });
    });
}

// --- Global Initialize ---
window.addEventListener("load", function () {
    // Refresh Locomotive and ScrollTrigger first
    setTimeout(() => {
        locoScroll.update();
        ScrollTrigger.refresh();
        console.log("LocoScroll & ScrollTrigger Refreshed");
    }, 500);

    loaderAnimation();
    initCursor();
    initIndustryCity();
    initEyeTracking();
    initHeroSlider();
    initNavScroll();
});
