(function () {
    const NAV_DELAY = 680;
    const isMobile = window.matchMedia('(max-width: 600px)').matches;
    const CLICK_BURST_COUNT = isMobile ? 14 : 22;
    const NAV_BURST_COUNT = isMobile ? 34 : 52;
    const TRAIL_INTERVAL = isMobile ? 70 : 38;
    const TRAIL_SPAWN_CHANCE = isMobile ? 0.62 : 0.86;
    const GIF_HEART_INTERVAL = isMobile ? 520 : 320;
    const EDGE_WORDS_COUNT = isMobile ? 12 : 24;
    const EDGE_WORD_POOL = [
        'любовь',
        'нежность',
        'обнимашки',
        'поцелуй',
        'счастье',
        'тепло',
        'улыбка',
        'милая',
        'сердце',
        'вдохновение',
        'романтика',
        'чудо'
    ];

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

    function createGifHeart(x, y) {
        const heart = document.createElement('span');
        heart.className = 'gif-heart';

        const driftX = (Math.random() - 0.5) * 56;
        const driftY = -42 - Math.random() * 36;
        const scale = (0.75 + Math.random() * 0.55).toFixed(2);
        const delay = (Math.random() * 0.12).toFixed(2);

        heart.style.left = `${x}px`;
        heart.style.top = `${y}px`;
        heart.style.setProperty('--gif-heart-x', `${driftX.toFixed(1)}px`);
        heart.style.setProperty('--gif-heart-y', `${driftY.toFixed(1)}px`);
        heart.style.setProperty('--gif-heart-scale', scale);
        heart.style.animationDelay = `${delay}s`;

        document.body.appendChild(heart);
        setTimeout(() => heart.remove(), 1250);
    }

    function getImageSidePoint(rect, side) {
        if (side === 'left') {
            return {
                x: rect.left + Math.random() * (rect.width * 0.15),
                y: rect.top + Math.random() * rect.height
            };
        }

        if (side === 'right') {
            return {
                x: rect.right - Math.random() * (rect.width * 0.15),
                y: rect.top + Math.random() * rect.height
            };
        }

        if (side === 'bottom') {
            return {
                x: rect.left + Math.random() * rect.width,
                y: rect.bottom - Math.random() * (rect.height * 0.15)
            };
        }

        return {
            x: rect.left + Math.random() * rect.width,
            y: rect.top + Math.random() * (rect.height * 0.15)
        };
    }

    function startGifHeartEmitter() {
        const loveGifs = Array.from(document.querySelectorAll('.love-gif'));
        if (!loveGifs.length) {
            return;
        }

        const sides = ['top', 'left', 'right', 'bottom'];

        const emit = () => {
            loveGifs.forEach((loveGif) => {
                const rect = loveGif.getBoundingClientRect();
                if (!rect.width || !rect.height) {
                    return;
                }

                const heartsPerTick = isMobile ? 2 : 5;
                for (let i = 0; i < heartsPerTick; i += 1) {
                    const side = sides[Math.floor(Math.random() * sides.length)];
                    const point = getImageSidePoint(rect, side);
                    createGifHeart(
                        point.x + (Math.random() - 0.5) * 16,
                        point.y + (Math.random() - 0.5) * 16
                    );
                }
            });
        };

        emit();
        setInterval(emit, GIF_HEART_INTERVAL);
    }

    function randomEdgeWord(excludedWord) {
        const candidates = EDGE_WORD_POOL.filter((word) => word !== excludedWord);
        const source = candidates.length ? candidates : EDGE_WORD_POOL;
        return source[Math.floor(Math.random() * source.length)];
    }

    function getBlockedRects() {
        return Array.from(document.querySelectorAll('.card, .wish')).map((element) => element.getBoundingClientRect());
    }

    function rectsOverlap(rectA, rectB, padding) {
        return !(
            rectA.right + padding < rectB.left
            || rectA.left - padding > rectB.right
            || rectA.bottom + padding < rectB.top
            || rectA.top - padding > rectB.bottom
        );
    }

    function collidesWithAny(candidateRect, blockedRects, occupiedRects, padding) {
        const inBlocked = blockedRects.some((rect) => rectsOverlap(candidateRect, rect, padding));
        if (inBlocked) {
            return true;
        }

        return occupiedRects.some((rect) => rectsOverlap(candidateRect, rect, padding));
    }

    function placeEdgeWordRandomly(wordElement) {
        const blockedRects = getBlockedRects();
        const width = window.innerWidth;
        const height = window.innerHeight;
        const margin = isMobile ? 18 : 26;
        const padding = isMobile ? 8 : 12;
        const occupiedRects = Array.from(document.querySelectorAll('.edge-word'))
            .filter((element) => element !== wordElement && !element.classList.contains('is-dropping'))
            .map((element) => element.getBoundingClientRect());

        const currentRect = wordElement.getBoundingClientRect();
        const wordWidth = Math.max(currentRect.width || 0, isMobile ? 108 : 128);
        const wordHeight = Math.max(currentRect.height || 0, isMobile ? 34 : 38);

        let chosenX = margin;
        let chosenY = margin;

        for (let attempt = 0; attempt < 140; attempt += 1) {
            const x = margin + Math.random() * Math.max(1, width - wordWidth - margin * 2);
            const y = margin + Math.random() * Math.max(1, height - wordHeight - margin * 2);
            const candidateRect = {
                left: x,
                top: y,
                right: x + wordWidth,
                bottom: y + wordHeight
            };

            if (!collidesWithAny(candidateRect, blockedRects, occupiedRects, padding)) {
                chosenX = x;
                chosenY = y;
                break;
            }
        }

        wordElement.style.left = `${chosenX}px`;
        wordElement.style.top = `${chosenY}px`;
    }

    function createEdgeWordElement() {
        const wordElement = document.createElement('button');
        wordElement.type = 'button';
        wordElement.className = 'edge-word';
        wordElement.textContent = randomEdgeWord('');
        wordElement.style.setProperty('--sway-duration', `${(4.6 + Math.random() * 2.4).toFixed(2)}s`);
        wordElement.style.setProperty('--drop-rotate', `${Math.floor(Math.random() * 30 - 15)}deg`);

        wordElement.addEventListener('click', () => {
            if (wordElement.classList.contains('is-dropping')) {
                return;
            }

            const rect = wordElement.getBoundingClientRect();
            burstHeartsAtPoint(rect.left + rect.width / 2, rect.top + rect.height / 2, isMobile ? 6 : 10);

            wordElement.classList.add('is-dropping');

            setTimeout(() => {
                const currentWord = wordElement.textContent;
                wordElement.textContent = randomEdgeWord(currentWord);
                wordElement.style.setProperty('--sway-duration', `${(4.6 + Math.random() * 2.4).toFixed(2)}s`);
                wordElement.style.setProperty('--drop-rotate', `${Math.floor(Math.random() * 30 - 15)}deg`);
                wordElement.classList.remove('is-dropping');
                placeEdgeWordRandomly(wordElement);
            }, 1500);
        });

        return wordElement;
    }

    function startEdgeWords() {
        const layer = document.createElement('div');
        layer.className = 'edge-words-layer';
        document.body.appendChild(layer);

        for (let index = 0; index < EDGE_WORDS_COUNT; index += 1) {
            const wordElement = createEdgeWordElement();
            layer.appendChild(wordElement);
            placeEdgeWordRandomly(wordElement);
        }

        window.addEventListener('resize', () => {
            Array.from(document.querySelectorAll('.edge-word')).forEach((wordElement) => {
                if (!wordElement.classList.contains('is-dropping')) {
                    placeEdgeWordRandomly(wordElement);
                }
            });
        });
    }

    function startWishesSequentialReveal() {
        const wishesGrid = document.querySelector('.wishes-grid');
        if (!wishesGrid) {
            return;
        }

        const wishCards = Array.from(wishesGrid.querySelectorAll('.wish-card'));
        if (!wishCards.length) {
            return;
        }

        wishesGrid.classList.add('is-sequenced');

        wishCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('is-visible');
            }, 130 + index * 130);
        });
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

    startGifHeartEmitter();
    startEdgeWords();
    startWishesSequentialReveal();
})();
