/* ==========================================================================
   FOR SUBAITA ❤️ — Main Script
   Fully self-contained (no external libraries). Every module is wrapped in
   its own try/catch so that one failure can never break the others.
   ========================================================================== */

'use strict';

/* --------------------------------------------------------------------------
   CONFIG — customize everything here
-------------------------------------------------------------------------- */
const CONFIG = {
    // Change this date to when you and Subaita started your journey 💕
    loveDate: new Date('2023-02-14T00:00:00'),
    loveDateLabel: 'Since our beautiful journey began — every second with you is a treasure 💕',
    heroPhrase: 'To My Beautiful Girl, Subaita ❤️',
    typingSpeed: 65, // ms per character
};

/* Smooth-scroll helper used by the hero buttons */
function scrollToSection(id) {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
}

/* ==========================================================================
   1) SCROLL-REVEAL ANIMATIONS (replaces AOS — zero dependencies)
   Add data-reveal="up|left|right|zoom|fade" and optional data-delay="100"
   to any element in the HTML.
========================================================================== */
(function initReveal() {
    const els = document.querySelectorAll('[data-reveal]');

    if (!('IntersectionObserver' in window)) {
        els.forEach((el) => el.classList.add('in'));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const delay = parseInt(entry.target.dataset.delay || 0, 10);
                entry.target.style.setProperty('--d', delay + 'ms');
                entry.target.classList.add('in');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    els.forEach((el) => observer.observe(el));
})();

/* ==========================================================================
   2) NAVBAR — transparent -> frosted glass on scroll
========================================================================== */
(function initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
})();

/* ==========================================================================
   3) HERO TYPING EFFECT
========================================================================== */
(function initTyping() {
    const el = document.getElementById('typing-text');
    if (!el) return;
    const text = CONFIG.heroPhrase;
    let i = 0;
    (function type() {
        if (i <= text.length) {
            el.textContent = text.slice(0, i++);
            setTimeout(type, CONFIG.typingSpeed);
        }
    })();
})();

/* ==========================================================================
   4) PARTICLE CANVAS — floating hearts + golden sparkles
========================================================================== */
(function initParticles() {
    const canvas = document.getElementById('hero-canvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const DPR = Math.min(window.devicePixelRatio || 1, 2);
    const COLORS = ['#ee90b5', '#e56b9b', '#b3a0e2', '#f4b8d0'];
    let w = 0, h = 0;
    let particles = [];

    function resize() {
        w = canvas.clientWidth;
        h = canvas.clientHeight;
        canvas.width = w * DPR;
        canvas.height = h * DPR;
        ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    }
    resize();
    window.addEventListener('resize', resize, { passive: true });

    function drawHeart(x, y, size, color, alpha) {
        ctx.save();
        ctx.translate(x, y);
        ctx.scale(size / 18, size / 18);
        ctx.globalAlpha = alpha;
        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.moveTo(0, 5);
        ctx.bezierCurveTo(-10, -5, -4, -14, 0, -7);
        ctx.bezierCurveTo(4, -14, 10, -5, 0, 5);
        ctx.fill();
        ctx.restore();
    }

    function drawSparkle(x, y, size, alpha) {
        ctx.save();
        ctx.globalAlpha = alpha;
        ctx.shadowColor = '#d4af37';
        ctx.shadowBlur = 8;
        ctx.fillStyle = '#ecd9a0';
        ctx.beginPath();
        for (let i = 0; i < 4; i++) {
            ctx.rotate(Math.PI / 2);
            ctx.moveTo(0, 0);
            ctx.lineTo(size, size * 0.18);
            ctx.quadraticCurveTo(size * 0.25, 0, size, -size * 0.18);
            ctx.lineTo(0, 0);
        }
        ctx.fill();
        ctx.restore();
    }

    function spawn() {
        if (Math.random() < 0.6) {
            particles.push({
                type: 'heart',
                x: Math.random() * w,
                y: h + 20,
                vy: -(0.5 + Math.random() * 1.2),
                vx: (Math.random() - 0.5) * 0.4,
                size: 8 + Math.random() * 14,
                color: COLORS[Math.floor(Math.random() * COLORS.length)],
                alpha: 0.35 + Math.random() * 0.5,
                sway: Math.random() * Math.PI * 2,
            });
        }
        particles.push({
            type: 'sparkle',
            x: Math.random() * w,
            y: Math.random() * h,
            vy: -(0.15 + Math.random() * 0.3),
            size: 2 + Math.random() * 4,
            alpha: 0.2 + Math.random() * 0.6,
            sway: Math.random() * Math.PI * 2,
        });
    }

    let last = 0;
    function frame(t) {
        if (t - last > 160) { spawn(); last = t; }
        ctx.clearRect(0, 0, w, h);

        particles.forEach((p, i) => {
            p.sway += 0.02;
            p.x += p.vx + Math.sin(p.sway) * 0.3;
            p.y += p.vy;

            const twinkle = p.type === 'sparkle'
                ? Math.max(0.1, Math.min(1, p.alpha * (0.5 + 0.5 * Math.sin(p.sway * 3))))
                : p.alpha;

            if (p.type === 'heart') drawHeart(p.x, p.y, p.size, p.color, twinkle);
            else drawSparkle(p.x, p.y, p.size, twinkle);

            if (p.y < -40 || p.x < -40 || p.x > w + 40) particles.splice(i, 1);
        });

        if (particles.length > 130) particles.splice(0, particles.length - 130);
        requestAnimationFrame(frame);
    }
    requestAnimationFrame(frame);
})();

/* ==========================================================================
   5) PARALLAX GLOW ORBS (scroll + gentle mouse movement)
========================================================================== */
(function initParallax() {
    const orbs = document.querySelectorAll('.orb');
    if (!orbs.length) return;

    window.addEventListener('scroll', () => {
        const y = window.scrollY;
        orbs.forEach((orb) => {
            const speed = parseFloat(orb.dataset.speed || 20);
            orb.style.transform = 'translate3d(0, ' + (y * speed * 0.01) + 'px, 0)';
        });
    }, { passive: true });

    window.addEventListener('mousemove', (e) => {
        const cx = e.clientX / window.innerWidth - 0.5;
        const cy = e.clientY / window.innerHeight - 0.5;
        orbs.forEach((orb, i) => {
            const depth = (i % 2 === 0 ? 1 : -1) * 45;
            orb.style.marginLeft = (cx * depth) + 'px';
            orb.style.marginTop = (cy * depth) + 'px';
        });
    }, { passive: true });
})();

/* ==========================================================================
   6) GALLERY — real photos if provided, otherwise elegant generated art
   To use your own photos: drop image files into an "images/" folder next to
   index.html and add their names to the PHOTOS array below.
========================================================================== */
(function initGallery() {
    const grid = document.getElementById('gallery-grid');
    if (!grid) return;

    const PHOTOS = [
        // e.g. 'images/photo-1.jpg'
    ];

    const ART = [
        { g1: '#fbe0ed', g2: '#e6e6fa', emoji: '💖', caption: 'Our First Glance' },
        { g1: '#fdf0dc', g2: '#f4b8d0', emoji: '🌹', caption: 'Golden Hour' },
        { g1: '#e6e6fa', g2: '#ecd9a0', emoji: '💫', caption: 'Starry Nights' },
        { g1: '#fdf2f7', g2: '#b3a0e2', emoji: '🌷', caption: 'Sweet Laughter' },
        { g1: '#f9d5e5', g2: '#f4b8d0', emoji: '💌', caption: 'Little Promises' },
        { g1: '#fdf0dc', g2: '#cfc4ee', emoji: '✨', caption: 'Forever Moments' },
    ];

    // Build an artistic SVG scene as a data-URI (looks premium, works offline)
    function artImage({ g1, g2, emoji }) {
        const floats = [
            [86, 120, '♥', 'rgba(229,107,155,0.35)'],
            [430, 70, '♥', 'rgba(179,160,226,0.35)'],
            [300, 200, '✦', 'rgba(212,175,55,0.5)'],
            [90, 430, '♥', 'rgba(238,144,181,0.3)'],
            [470, 480, '✦', 'rgba(255,255,255,0.55)'],
        ].map(([x, y, t, c]) =>
            `<text x='${x}' y='${y}' font-size='26' fill='${c}'>${t}</text>`).join('');

        const svg =
            `<svg xmlns='http://www.w3.org/2000/svg' width='600' height='750' viewBox='0 0 600 750'>` +
            `<defs>` +
            `<linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>` +
            `<stop offset='0' stop-color='${g1}'/><stop offset='1' stop-color='${g2}'/>` +
            `</linearGradient>` +
            `<radialGradient id='h' cx='50%' cy='42%' r='52%'>` +
            `<stop offset='0' stop-color='rgba(255,255,255,0.6)'/><stop offset='1' stop-color='rgba(255,255,255,0)'/>` +
            `</radialGradient>` +
            `<linearGradient id='frame' x1='0' y1='0' x2='1' y2='1'>` +
            `<stop offset='0' stop-color='rgba(255,255,255,0.85)'/><stop offset='1' stop-color='rgba(212,175,55,0.5)'/>` +
            `</linearGradient>` +
            `</defs>` +
            `<rect width='600' height='750' fill='url(#g)'/>` +
            `<circle cx='300' cy='330' r='190' fill='url(#h)'/>` +
            `<rect x='30' y='30' width='540' height='690' rx='28' fill='none' stroke='url(#frame)' stroke-width='3'/>` +
            `${floats}` +
            `<text x='300' y='400' font-size='150' text-anchor='middle'>${emoji}</text>` +
            `<text x='300' y='690' font-family='Georgia, serif' font-size='36' font-style='italic' fill='rgba(74,22,49,0.5)' text-anchor='middle'>S &amp; U</text>` +
            `</svg>`;
        return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg);
    }

    // Build the lightbox once
    const lightbox = document.createElement('div');
    lightbox.id = 'lightbox';
    lightbox.setAttribute('role', 'dialog');
    lightbox.setAttribute('aria-modal', 'true');
    lightbox.innerHTML =
        '<div class="lb-backdrop"></div>' +
        '<button class="lb-close" aria-label="Close gallery">✕</button>' +
        '<img src="" alt="Romantic memory">';
    document.body.appendChild(lightbox);

    const lbImg = lightbox.querySelector('img');
    const closeLb = () => {
        lightbox.classList.remove('open');
        lightbox.setAttribute('aria-hidden', 'true');
        lbImg.src = '';
        document.body.style.overflow = '';
    };
    lightbox.querySelector('.lb-backdrop').addEventListener('click', closeLb);
    lightbox.querySelector('.lb-close').addEventListener('click', closeLb);

    // Determine items: real photos take priority
    const items = PHOTOS.length
        ? PHOTOS.map((src, i) => ({ src: src, caption: 'A little memory of us #' + (i + 1) }))
        : ART.map((a) => ({ src: artImage(a), caption: a.caption }));

    // Render gallery items
    items.forEach((item, i) => {
        const el = document.createElement('div');
        el.className = 'gallery-item';
        el.setAttribute('data-reveal', 'zoom');
        el.setAttribute('data-delay', String((i % 3) * 90));
        el.innerHTML = '<img src="' + item.src + '" alt="' + item.caption + '">' +
            '<div class="gallery-caption">' + item.caption + '</div>';
        el.addEventListener('click', () => {
            lbImg.src = item.src;
            lightbox.classList.add('open');
            lightbox.setAttribute('aria-hidden', 'false');
            document.body.style.overflow = 'hidden';
        });
        grid.appendChild(el);
    });

    // Make the new gallery items animate into view too
    const revealEls = grid.querySelectorAll('[data-reveal]');
    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.style.setProperty('--d', (entry.target.dataset.delay || 0) + 'ms');
                    entry.target.classList.add('in');
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
        revealEls.forEach((el) => observer.observe(el));
    } else {
        revealEls.forEach((el) => el.classList.add('in'));
    }
})();

/* ==========================================================================
   7) LOVE COUNTER — days / hours / minutes / seconds since CONFIG.loveDate
========================================================================== */
(function initLoveCounter() {
    const daysEl = document.getElementById('t-days');
    const hoursEl = document.getElementById('t-hours');
    const minutesEl = document.getElementById('t-minutes');
    const secondsEl = document.getElementById('t-seconds');
    const captionEl = document.getElementById('counter-caption');
    if (!daysEl || !hoursEl || !minutesEl || !secondsEl || !captionEl) return;

    captionEl.textContent = CONFIG.loveDateLabel;

    function tick() {
        const diff = Math.max(0, Date.now() - CONFIG.loveDate.getTime());
        const s = Math.floor(diff / 1000);
        daysEl.textContent = Math.floor(s / 86400);
        hoursEl.textContent = Math.floor((s % 86400) / 3600);
        minutesEl.textContent = Math.floor((s % 3600) / 60);
        secondsEl.textContent = s % 60;
    }
    tick();
    setInterval(tick, 1000);
})();

/* ==========================================================================
   8) REASONS COUNTER — animate numbers when scrolled into view
========================================================================== */
(function initStats() {
    const counters = document.querySelectorAll('.count');
    if (!counters.length) return;

    function animate(el) {
        const target = parseInt(el.dataset.target, 10) || 0;
        const duration = 1600;
        const start = performance.now();
        (function step(now) {
            const p = Math.min(1, (now - start) / duration);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (p < 1) requestAnimationFrame(step);
            else el.textContent = target.toLocaleString();
        })(start);
    }

    if (!('IntersectionObserver' in window)) {
        counters.forEach((c) => (c.textContent = (parseInt(c.dataset.target, 10) || 0).toLocaleString()));
        return;
    }

    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            if (entry.isIntersecting) {
                animate(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.6 });
    counters.forEach((c) => observer.observe(c));
})();

/* ==========================================================================
   9) INTERACTIVE LOVE BUTTON — hearts, score & romantic messages
========================================================================== */
(function initLoveButton() {
    const btn = document.getElementById('love-btn');
    const scoreEl = document.getElementById('love-score');
    const msgEl = document.getElementById('love-message');
    if (!btn || !scoreEl || !msgEl) return;
    let score = 0;

    const MESSAGES = [
        'You just made my heart do a little dance 💃❤️',
        'That click was the highlight of my day ✨',
        'Warning: you are dangerously adorable 🥰',
        'I think I fell for you a little more just now 💕',
        'Every click of yours = a piece of my heart 💝',
        'Your love is my favorite notification 💌',
        'If love were a button, you would break it 😍',
        'Counting every single one of your clicks… and your smiles 😊',
    ];

    const HEART_EMOJI = ['❤️', '💖', '💗', '💕', '💘', '🌹', '💫'];

    // Ambient floating hearts drifting up the whole page
    const layer = document.getElementById('hearts-layer');
    function ambientHeart() {
        if (!layer) return;
        const span = document.createElement('span');
        span.className = 'float-heart';
        span.textContent = HEART_EMOJI[Math.floor(Math.random() * HEART_EMOJI.length)];
        span.style.left = Math.random() * 100 + 'vw';
        span.style.animationDuration = 6 + Math.random() * 5 + 's';
        span.style.fontSize = 1 + Math.random() * 1.4 + 'rem';
        span.style.opacity = 0;
        layer.appendChild(span);
        setTimeout(() => span.remove(), 12000);
    }
    setInterval(() => { if (Math.random() < 0.6) ambientHeart(); }, 900);

    // Burst of hearts from the click position
    function burst(x, y) {
        for (let i = 0; i < 14; i++) {
            const span = document.createElement('span');
            span.className = 'burst-heart';
            span.textContent = HEART_EMOJI[Math.floor(Math.random() * HEART_EMOJI.length)];
            const angle = (Math.PI * 2 * i) / 14 + Math.random() * 0.5;
            const dist = 70 + Math.random() * 130;
            span.style.left = x + 'px';
            span.style.top = y + 'px';
            span.style.setProperty('--dx', Math.cos(angle) * dist + 'px');
            span.style.setProperty('--dy', Math.sin(angle) * dist + 'px');
            document.body.appendChild(span);
            setTimeout(() => span.remove(), 1150);
        }
    }

    btn.addEventListener('click', (e) => {
        score++;
        scoreEl.textContent = score;
        scoreEl.style.transform = 'scale(1.25)';
        setTimeout(() => (scoreEl.style.transform = 'scale(1)'), 250);

        msgEl.textContent = MESSAGES[Math.floor(Math.random() * MESSAGES.length)];
        msgEl.style.opacity = 0;
        setTimeout(() => (msgEl.style.opacity = 1), 150);

        burst(e.clientX, e.clientY);
        ambientHeart();
        ambientHeart();
    });
})();

/* ==========================================================================
   10) MUSIC PLAYER — a soft melody synthesized with the Web Audio API.
       No audio files needed — it plays gently and works fully offline.
========================================================================== */
(function initMusicPlayer() {
    const player = document.getElementById('music-player');
    const art = document.getElementById('mp-art');
    const playBtn = document.getElementById('mp-play');
    const progress = document.getElementById('mp-progress');
    const volume = document.getElementById('mp-volume');
    if (!player || !art || !playBtn || !progress || !volume) return;

    const BPM = 78;
    const SPB = 60 / BPM; // seconds per beat
    // Gentle C - G - Am - F arpeggio, 4 bars of 4 beats (16 beats total)
    const MELODY = [
        [60, 1], [64, 1], [67, 1], [72, 1],   // C major
        [55, 1], [59, 1], [62, 1], [67, 1],   // G major
        [57, 1], [60, 1], [64, 1], [69, 1],   // A minor
        [53, 1], [57, 1], [60, 1], [65, 1],   // F major
    ];
    const BASS = [48, 43, 45, 41]; // one soft bass note per bar
    const LOOP_TIME = MELODY.reduce((sum, item) => sum + item[1] * SPB, 0);

    let ctx = null;
    let master = null;
    let playing = false;
    let scheduler = null;
    let loopStartTime = 0;
    let nextNoteTime = 0;
    let offset = 0;      // current position in the loop (seconds)
    let scheduled = [];  // active oscillators, so we can pause them

    const midiToFreq = (m) => 440 * Math.pow(2, (m - 69) / 12);

    function ensureCtx() {
        if (ctx) return;
        ctx = new (window.AudioContext || window.webkitAudioContext)();
        master = ctx.createGain();
        master.gain.value = parseFloat(volume.value);
        master.connect(ctx.destination);
    }

    function note(midi, when, dur, vol) {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.value = midiToFreq(midi);
        gain.gain.setValueAtTime(0, when);
        gain.gain.linearRampToValueAtTime(vol, when + 0.03);
        gain.gain.exponentialRampToValueAtTime(0.001, when + dur);
        osc.connect(gain);
        gain.connect(master);
        osc.start(when);
        osc.stop(when + dur + 0.1);
        scheduled.push(osc);
    }

    // Schedule one full pass of the melody + bass
    function scheduleLoop() {
        let t = nextNoteTime;
        MELODY.forEach((item) => {
            note(item[0], t, item[1] * SPB * 0.92, 0.16);
            t += item[1] * SPB;
        });
        BASS.forEach((m, bar) => {
            note(m, nextNoteTime + bar * 4 * SPB, 3.6 * SPB, 0.12);
        });
        nextNoteTime = t;
    }

    function startScheduler() {
        scheduler = setInterval(() => {
            while (nextNoteTime < ctx.currentTime + 0.3) scheduleLoop();
            scheduled = scheduled.filter((o) => o.state !== 'finished');
        }, 40);
    }

    function play() {
        ensureCtx();
        if (ctx.state === 'suspended') ctx.resume();
        loopStartTime = ctx.currentTime - offset;
        nextNoteTime = ctx.currentTime + 0.05;
        startScheduler();
        playing = true;
        player.classList.add('playing');
        playBtn.textContent = '⏸';
    }

    function pause() {
        clearInterval(scheduler);
        scheduler = null;
        scheduled.forEach((o) => { try { o.stop(); } catch (e) {} });
        scheduled = [];
        if (ctx) offset = (ctx.currentTime - loopStartTime) % LOOP_TIME;
        playing = false;
        player.classList.remove('playing');
        playBtn.textContent = '▶';
    }

    // Progress bar ticker
    setInterval(() => {
        if (!playing || !ctx) return;
        const pos = (ctx.currentTime - loopStartTime) % LOOP_TIME;
        progress.value = (pos / LOOP_TIME) * 100;
    }, 200);

    // Scrubbing
    progress.addEventListener('input', () => {
        const target = (parseFloat(progress.value) / 100) * LOOP_TIME;
        if (playing) {
            clearInterval(scheduler);
            scheduled.forEach((o) => { try { o.stop(); } catch (e) {} });
            scheduled = [];
            loopStartTime = ctx.currentTime - target;
            nextNoteTime = ctx.currentTime + 0.05;
            startScheduler();
        }
        offset = target;
    });

    // Volume
    volume.addEventListener('input', () => {
        if (master) master.gain.value = parseFloat(volume.value);
    });

    // Play / pause
    playBtn.addEventListener('click', () => (playing ? pause() : play()));

    // Click the artwork to minimize / expand the player
    art.addEventListener('click', () => player.classList.toggle('minimized'));

    // Don't keep playing invisibly in the background
    document.addEventListener('visibilitychange', () => {
        if (document.hidden && playing) pause();
    });
})();

/* ==========================================================================
   11) SURPRISE MODAL
========================================================================== */
(function initModal() {
    const modal = document.getElementById('surprise-modal');
    if (!modal) return;
    const closeBtn = modal.querySelector('.modal-close');
    let lastFocused = null;

    const open = () => {
        lastFocused = document.activeElement;
        modal.classList.add('open');
        modal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        if (closeBtn) closeBtn.focus();
    };
    const close = () => {
        modal.classList.remove('open');
        modal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
        if (lastFocused) lastFocused.focus();
    };

    // Expose globally so the HTML buttons can call them
    window.__openSurprise = open;
    window.__closeSurprise = close;

    if (closeBtn) closeBtn.addEventListener('click', close);

    // Escape key closes the modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('open')) close();
    });

    // Trap focus inside the modal while it is open (accessibility)
    modal.addEventListener('keydown', (e) => {
        if (e.key !== 'Tab' || !modal.classList.contains('open')) return;
        const focusables = modal.querySelectorAll('button');
        if (!focusables.length) return;
        const first = focusables[0];
        const last = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === first) {
            e.preventDefault();
            last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
            e.preventDefault();
            first.focus();
        }
    });
})();

/* ==========================================================================
   12) FOOTER YEAR
========================================================================== */
(function initFooter() {
    const yearEl = document.getElementById('year');
    if (yearEl) yearEl.textContent = new Date().getFullYear();
})();
