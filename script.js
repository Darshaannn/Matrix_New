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

// Manual check to refresh after short delay (letting DOM settle)
window.addEventListener("load", () => {
    setTimeout(() => {
        locoScroll.update();
        ScrollTrigger.refresh();
    }, 500);
});

// --- Cursor Logic ---
const cursor = document.querySelector("#cursor");

window.addEventListener("mousemove", (e) => {
    // We adjust x and y to align center of cursor
    gsap.to(cursor, {
        x: e.clientX - cursor.offsetWidth / 2,
        y: e.clientY - cursor.offsetHeight / 2,
        duration: 0.1,
        ease: "power2.out"
    });
});

// Hover scale effect for links and buttons
const interactables = document.querySelectorAll("a, .btn, .icon, .hero-inline-image, .hero-img-box, .read-more-btn, .image-content, .card-btn, .tag");
interactables.forEach(item => {
    item.addEventListener("mouseenter", () => {
        cursor.classList.add("active");
    });
    item.addEventListener("mouseleave", () => {
        cursor.classList.remove("active");
    });
});

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

// --- Entry Animations ---
function loaderAnimation() {
    const tl = gsap.timeline();

    // Animate the image width in the hero
    tl.to(".hero-inline-image", {
        width: "9vw",
        duration: 1,
        ease: "power4.out",
        delay: 0.2
    }, "start");

    // Text reveal
    tl.from(".hero-line h1", {
        y: "100%",
        opacity: 0,
        duration: 1,
        ease: "power4.out",
        stagger: 0.1
    }, "start");

    tl.to(".hero-img-box", {
        scale: 1,
        opacity: 1,
        duration: 0.8,
        ease: "back.out(1.7)",
        stagger: 0.05
    }, "start+=0.3");

    tl.from(".hero-footer", {
        y: 50,
        opacity: 0,
        duration: 1,
        ease: "power3.out",
        delay: 0.2
    }, "start");
}

window.addEventListener("load", () => {
    loaderAnimation();
    setTimeout(() => {
        locoScroll.update();
        ScrollTrigger.refresh();
        console.log("LocoScroll & ScrollTrigger Refreshed");
    }, 1000);
});

// --- Universal Scroll To Reveal Logic ---
// 1. Massive Slide-up explicitly for "WE ARE OCHI" section (Scroll-driven)
gsap.from(".marque-text", {
    scrollTrigger: {
        trigger: "#marquee",
        scroller: "#main",
        start: "top 95%",
        end: "top 45%",
        scrub: 2 // 2-second smoothing tied directly to the scroll position
    },
    y: 150,
    opacity: 0,
    ease: "none" // Let the scrolling dictate the easing
});

const revealElements = [
    ".about-top h2",
    ".about-middle .column",
    ".about-bottom .text-content",
    ".about-bottom .image-content",
    ".projects-header h2",
    ".reviews-header h2",
    ".review-row",
    ".why-header h1",
    ".why-item",
    ".ready-text h1",
    ".ready-btn-container",
    ".footer-left h1",
    ".footer-right h1",
    ".footer-info",
    ".footer-bottom",
    "#barter-city .map-header h2",
    "#barter-city .map-container"
];

revealElements.forEach(selector => {
    gsap.utils.toArray(selector).forEach(elem => {
        gsap.from(elem, {
            scrollTrigger: {
                trigger: elem,
                scroller: "#main",
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power3.out"
        });
    });
});

// Staggered reveal for Cards (Projects and bottom cards)
gsap.from(".card-wrapper", {
    scrollTrigger: {
        trigger: ".cards-container",
        scroller: "#main",
        start: "top 80%"
    },
    y: 100,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
});

gsap.from(".card-large, .card-small", {
    scrollTrigger: {
        trigger: "#cards",
        scroller: "#main",
        start: "top 70%"
    },
    y: 50,
    opacity: 0,
    duration: 1,
    stagger: 0.2,
    ease: "power3.out"
});

// --- Barter City Map Logic ---
const industriesData = [
    {
        id: "automobile",
        title: "Automobile",
        description: "Automobile brands leverage barter to maximize visibility and expand market reach without heavy cash expenditure. Through strategic media exchange, brands promote vehicles and accessories across high-impact platforms.",
        barterIncludes: ["Two-wheelers and bicycles", "Batteries and accessories", "Auto components"],
        mediaUtilized: ["Print", "Outdoor", "Television", "Digital"]
    },
    {
        id: "fmcg",
        title: "FMCG",
        description: "Fast-moving consumer goods companies use barter to rapidly scale brand awareness and penetrate new markets by exchanging products for targeted advertising solutions.",
        barterIncludes: ["Food and beverages", "Personal care products", "Household essentials"],
        mediaUtilized: ["Print", "Radio", "Digital", "Outdoor"]
    },
    {
        id: "lifestyle",
        title: "Lifestyle & Clothing",
        description: "Fashion and lifestyle brands benefit from barter by showcasing their collections through premium media placements, increasing brand recall while optimizing marketing spend.",
        barterIncludes: ["Apparel", "Footwear", "Accessories"],
        mediaUtilized: ["Print", "Digital", "Outdoor"]
    },
    {
        id: "consumer-durables",
        title: "Consumer Durables",
        description: "Consumer durable brands exchange high-value products for advertising inventory, ensuring sustained brand visibility across mass media platforms.",
        barterIncludes: ["Electronics", "Home appliances", "Gadgets"],
        mediaUtilized: ["Print", "Television", "Digital", "Outdoor"]
    },
    {
        id: "media",
        title: "Media Networks",
        description: "Media houses collaborate through barter by exchanging advertising inventory with brands, optimizing unsold space and increasing cross-promotional opportunities.",
        barterIncludes: ["Ad slots", "Print inventory", "Outdoor media"],
        mediaUtilized: ["Television", "Print", "Digital"]
    },
    {
        id: "hospitality",
        title: "Hospitality & Gaming",
        description: "Hospitality and gaming brands use barter partnerships to enhance brand presence by trading services and experiences for extensive promotional exposure.",
        barterIncludes: ["Hotel stays", "Food & beverages", "Gaming services"],
        mediaUtilized: ["Print", "Digital", "Outdoor"]
    }
];

function initMapInteractivity() {
    const pins = document.querySelectorAll('.pin');

    pins.forEach(pin => {
        pin.addEventListener('click', (e) => {
            const industryId = pin.getAttribute('data-industry');
            const data = industriesData.find(i => i.id === industryId);
            showIndustryCard(data);
        });
    });
}

function showIndustryCard(data) {
    const container = document.querySelector('#industry-card-container');

    // Clear existing card
    container.innerHTML = '';

    const card = document.createElement('div');
    card.className = 'industry-card';
    card.innerHTML = `
        <div class="close-card"><i class="ri-close-line"></i></div>
        <h3>${data.title}</h3>
        <p>${data.description}</p>
        <div class="card-section">
            <h4>Barter Includes</h4>
            <ul>${data.barterIncludes.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>
        <div class="card-section">
            <h4>Media Utilized</h4>
            <ul>${data.mediaUtilized.map(item => `<li>${item}</li>`).join('')}</ul>
        </div>
    `;

    container.appendChild(card);

    // Animate card in
    gsap.from(card, {
        scale: 0.8,
        opacity: 0,
        duration: 0.5,
        ease: "back.out(1.7)"
    });

    card.querySelector('.close-card').addEventListener('click', () => {
        gsap.to(card, {
            scale: 0.8,
            opacity: 0,
            duration: 0.3,
            onComplete: () => card.remove()
        });
    });
}

// Initialize on load
window.addEventListener('load', () => {
    initMapInteractivity();
});
