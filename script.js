document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Guest Name
    const params = new URLSearchParams(window.location.search);
    if (params.get('to')) document.getElementById('guest-name').innerText = decodeURIComponent(params.get('to'));

    // 2. Initialize AOS
    AOS.init({ duration: 1200, once: true, offset: 50 });

    // 3. Initialize Swiper for Digital Album (EffectCards)
    const swiper = new Swiper(".mySwiper", {
        effect: "cards",
        grabCursor: true,
        cardsEffect: {
            slideShadows: true,
            perSlideRotate: 4,
            perSlideOffset: 10,
        },
        loop: true,
        autoplay: {
            delay: 2500,
            disableOnInteraction: false,
        },
        pagination: {
            el: ".swiper-pagination",
            dynamicBullets: true,
            clickable: true,
        }
    });

    // 4. Opening GSAP Animation
    gsap.from("#opening-content", { y: 30, opacity: 0, duration: 2, ease: "power3.out" });

    // Audio Elements
    const bgMusic = document.getElementById('bg-music');
    const musicCtrl = document.getElementById('music-control');
    const musicIcon = musicCtrl.querySelector('i');
    let isPlaying = false;

    // Buka Undangan Click
    document.getElementById('btn-open').addEventListener('click', () => {
        document.body.classList.remove('no-scroll');
        document.getElementById('main-content').classList.remove('hidden');
        
        // Play music
        bgMusic.play().then(() => {
            isPlaying = true;
            musicCtrl.classList.remove('hidden');
        }).catch(console.error);
        
        // GSAP Timeline for smooth transitions
        const tl = gsap.timeline();
        tl.to('#opening-screen', { y: "-100%", duration: 1.4, ease: "power4.inOut", onComplete: () => {
            document.getElementById('opening-screen').style.display = 'none';
        }})
        .to('#main-content', { opacity: 1, duration: 0.8 }, "-=0.4")
        .from("#hero-subtitle", { y: 20, opacity: 0, duration: 1, ease: "power2.out" }, "-=0.6")
        .from("#hero-title", { scale: 0.9, opacity: 0, duration: 2, ease: "elastic.out(1, 0.7)" }, "-=0.8")
        .from("#hero-date", { y: -20, opacity: 0, duration: 1, ease: "power2.out" }, "-=1.5");
    });

    // Music control toggle
    musicCtrl.addEventListener('click', () => {
        if (isPlaying) {
            bgMusic.pause();
            musicIcon.className = 'fas fa-play';
        } else {
            bgMusic.play();
            musicIcon.className = 'fas fa-music animate-pulse';
        }
        isPlaying = !isPlaying;
    });

    // Countdown Timer (20 Dec 2026 08:00:00)
    const target = new Date(2026, 11, 20, 8, 0, 0).getTime();
    setInterval(() => {
        const dist = target - new Date().getTime();
        if (dist < 0) return;
        
        const pad = (num) => num < 10 ? '0' + num : num;
        document.getElementById('days').innerText = pad(Math.floor(dist / (1000 * 60 * 60 * 24)));
        document.getElementById('hours').innerText = pad(Math.floor((dist % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
        document.getElementById('minutes').innerText = pad(Math.floor((dist % (1000 * 60 * 60)) / (1000 * 60)));
        document.getElementById('seconds').innerText = pad(Math.floor((dist % (1000 * 60)) / 1000));
    }, 1000);

    // Form RSVP Simulation
    document.getElementById('rsvp-form').addEventListener('submit', (e) => {
        e.preventDefault();
        const btn = e.target.querySelector('button');
        const txt = btn.innerText;
        btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Mengirim...'; 
        btn.disabled = true;
        
        setTimeout(() => {
            btn.innerText = txt; 
            btn.disabled = false;
            document.getElementById('rsvp-alert').classList.remove('hidden');
            e.target.reset();
            setTimeout(() => document.getElementById('rsvp-alert').classList.add('hidden'), 5000);
        }, 1500);
    });

    // Falling particles for elegant touch
    setInterval(() => {
        if (document.body.classList.contains('no-scroll')) return;
        const p = document.createElement('div');
        p.className = 'particle';
        const s = Math.random() * 4 + 2; // smaller particles for elegance
        p.style.width = p.style.height = `${s}px`;
        p.style.left = `${Math.random() * 100}vw`;
        document.getElementById('particles').appendChild(p);
        gsap.to(p, {
            y: window.innerHeight + 50,
            x: `+=${Math.random() * 100 - 50}`,
            duration: Math.random() * 6 + 6,
            ease: "none",
            onComplete: () => p.remove()
        });
    }, 400);
});

// Global function to copy text (Rekening/Dana)
window.copyText = function(text, btnElement) {
    navigator.clipboard.writeText(text).then(() => {
        const originalHtml = btnElement.innerHTML;
        btnElement.innerHTML = '<i class="fas fa-check mr-2"></i> Tersalin';
        btnElement.classList.add('bg-green-500', 'text-white');
        btnElement.classList.remove('bg-gray-100', 'text-dark', 'hover:bg-gold', 'hover:bg-blue-500');
        
        setTimeout(() => {
            btnElement.innerHTML = originalHtml;
            btnElement.className = "w-full py-3 bg-gray-100 hover:bg-gold hover:text-white text-dark rounded-xl text-xs font-bold tracking-widest uppercase transition-colors duration-300";
            if (text.startsWith("08")) {
                btnElement.className = "w-full py-3 bg-gray-100 hover:bg-blue-500 hover:text-white text-dark rounded-xl text-xs font-bold tracking-widest uppercase transition-colors duration-300";
            }
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy: ', err);
    });
};
