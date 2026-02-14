(function () {
    const NAV_DELAY = 680;
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    const CLICK_BURST_COUNT = isMobile ? 14 : 22;
    const NAV_BURST_COUNT = isMobile ? 34 : 52;
    const TRAIL_INTERVAL = isMobile ? 70 : 38;
    const TRAIL_SPAWN_CHANCE = isMobile ? 0.62 : 0.86;

    let lastTrailTime = 0;

    function createBurstHeart(x, y, angle, distance, delay) {
        const heart = document.createElement('span');
        heart.className = 'click-heart';

        const driftX = Math.cos(angle) * distance;
        const driftY = Math.sin(angle) * distance - 36;
        const scale = (0.75 + Math.random() * 0.7).toFixed(2);
        const rotation = `${Math.floor(Math.random() * 40 - 20)}deg`;

        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        heart.style.setProperty('--drift-x', `${driftX.toFixed(1)}px`);
        heart.style.setProperty('--drift-y', `${driftY.toFixed(1)}px`);
        heart.style.setProperty('--heart-scale', scale);
        heart.style.setProperty('--heart-rotate', rotation);
        heart.style.animationDelay = `${delay.toFixed(2)}s`;

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1100);
    }

    function burstHeartsFromElement(element, amount) {
        const rect = element.getBoundingClientRect();
        const baseX = rect.left + rect.width / 2;
        const baseY = rect.top + rect.height / 2;

        for (let index = 0; index < amount; index += 1) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 30 + Math.random() * 95;
            const jitterX = (Math.random() - 0.5) * 18;
            const jitterY = (Math.random() - 0.5) * 12;
            const delay = Math.random() * 0.2;

            createBurstHeart(baseX + jitterX, baseY + jitterY, angle, distance, delay);
        }
    }

    function burstHeartsAtPoint(x, y, amount) {
        for (let index = 0; index < amount; index += 1) {
            const angle = Math.random() * Math.PI * 2;
            const distance = 22 + Math.random() * 72;
            const delay = Math.random() * 0.16;

            createBurstHeart(x, y, angle, distance, delay);
        }
    }

    function createTrailHeart(x, y) {
        const heart = document.createElement('span');
        heart.className = 'trail-heart';

        const driftX = (Math.random() - 0.5) * 34;
        const driftY = -28 - Math.random() * 22;
        const scale = (0.65 + Math.random() * 0.45).toFixed(2);

        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        heart.style.setProperty('--trail-x', `${driftX.toFixed(1)}px`);
        heart.style.setProperty('--trail-y', `${driftY.toFixed(1)}px`);
        heart.style.setProperty('--trail-scale', scale);

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 760);
    }

    function navigateWithHearts(url, sourceElement) {
        if (!url) {
            return;
        }

        const element = sourceElement || document.body;
        burstHeartsFromElement(element, NAV_BURST_COUNT);
        document.body.classList.add('page-fade-out');

        setTimeout(() => {
            window.location.href = url;
        }, NAV_DELAY);
    }

    document.querySelectorAll('a.btn[href]').forEach((link) => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            navigateWithHearts(link.getAttribute('href'), link);
        });
    });

    document.addEventListener('click', (event) => {
        if (event.defaultPrevented) {
            return;
        }

        if (event.target.closest('a.btn[href]')) {
            return;
        }

        burstHeartsAtPoint(event.clientX, event.clientY, CLICK_BURST_COUNT);
    });

    document.addEventListener('pointermove', (event) => {
        const now = Date.now();
        if (now - lastTrailTime < TRAIL_INTERVAL) {
            return;
        }

        lastTrailTime = now;
        if (Math.random() <= TRAIL_SPAWN_CHANCE) {
            createTrailHeart(event.clientX, event.clientY);
        }
    });

    window.navigateWithHearts = navigateWithHearts;
    window.burstHeartsAtPoint = burstHeartsAtPoint;
})();
