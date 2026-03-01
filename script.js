// ===== SCROLL REVEAL =====
document.addEventListener('DOMContentLoaded', () => {
    const revealSelectors = '.reveal, .reveal-left, .reveal-right, .reveal-scale';
    const reveals = document.querySelectorAll(revealSelectors);
    const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        },
        { threshold: 0.1, rootMargin: '0px 0px -30px 0px' }
    );
    reveals.forEach((el) => observer.observe(el));

    // ===== NAV SCROLL EFFECT =====
    const nav = document.querySelector('.nav');
    let lastScroll = 0;
    window.addEventListener('scroll', () => {
        const current = window.scrollY;
        if (current > 60) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
        lastScroll = current;
    });

    // ===== TABS =====
    document.querySelectorAll('.tabs').forEach((tabGroup) => {
        const buttons = tabGroup.querySelectorAll('.tab-btn');
        const contentId = tabGroup.dataset.target;
        const contents = document.querySelectorAll(
            `[data-tab-group="${contentId}"] .tab-content`
        );

        buttons.forEach((btn) => {
            btn.addEventListener('click', () => {
                buttons.forEach((b) => b.classList.remove('active'));
                contents.forEach((c) => c.classList.remove('active'));
                btn.classList.add('active');
                const target = document.getElementById(btn.dataset.tab);
                if (target) target.classList.add('active');

                // Update charts when switching tabs
                updateChartsForTab(btn.dataset.tab);
            });
        });
    });

    // ===== COUNT-UP ANIMATION =====
    const counters = document.querySelectorAll('[data-count]');
    const countObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting && !entry.target.dataset.counted) {
                    entry.target.dataset.counted = 'true';
                    animateCount(entry.target);
                }
            });
        },
        { threshold: 0.5 }
    );
    counters.forEach((el) => countObserver.observe(el));

    function animateCount(el) {
        const target = parseInt(el.dataset.count, 10);
        const suffix = el.dataset.suffix || '';
        const prefix = el.dataset.prefix || '';
        const duration = 2200;
        const start = performance.now();

        function update(now) {
            const elapsed = now - start;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 4);
            const current = Math.round(eased * target);
            el.textContent = prefix + current.toLocaleString('ru-RU') + suffix;
            if (progress < 1) requestAnimationFrame(update);
        }
        requestAnimationFrame(update);
    }

    // ===== MOBILE NAV =====
    const burger = document.querySelector('.nav-burger');
    const navLinks = document.querySelector('.nav-links');

    if (burger && navLinks) {
        burger.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            const spans = burger.querySelectorAll('span');
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

        navLinks.querySelectorAll('a').forEach((link) => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                const spans = burger.querySelectorAll('span');
                spans[0].style.transform = '';
                spans[1].style.opacity = '';
                spans[2].style.transform = '';
            });
        });
    }

    // ===== SMOOTH SCROLL =====
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
        });
    });

    // ===== MOUSE-TRACKING GLOW ON CARDS =====
    document.querySelectorAll('.glass-card, .offer-card, .roadmap-card, .risk-card').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            card.style.setProperty('--mouse-x', `${x}px`);
            card.style.setProperty('--mouse-y', `${y}px`);
            card.style.background = `
                radial-gradient(300px circle at ${x}px ${y}px, rgba(212,175,55,0.06), transparent 60%),
                rgba(255,255,255,0.03)
            `;
        });
        card.addEventListener('mouseleave', () => {
            card.style.background = '';
        });
    });

    // ===== HERO PARALLAX =====
    const heroContent = document.querySelector('.hero-content');
    const heroBg = document.querySelector('.hero::before');
    window.addEventListener('scroll', () => {
        const scrollY = window.scrollY;
        if (heroContent && scrollY < window.innerHeight) {
            heroContent.style.transform = `translateY(${scrollY * 0.15}px)`;
            heroContent.style.opacity = 1 - scrollY / (window.innerHeight * 0.8);
        }
    }, { passive: true });

    // ===== FLOATING GOLD PARTICLES =====
    createGoldParticles();

    // ===== STAGGERED REVEALS =====
    document.querySelectorAll('.glass-card, .roadmap-card, .risk-card').forEach((card, i) => {
        card.style.transitionDelay = `${(i % 4) * 0.08}s`;
    });

    // ===== CHARTS (Chart.js) =====
    initCharts();
});

// ===== GOLD FLOATING PARTICLES =====
function createGoldParticles() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    const canvas = document.createElement('canvas');
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;';
    hero.appendChild(canvas);
    const ctx = canvas.getContext('2d');

    let particles = [];
    const count = 35;

    function resize() {
        canvas.width = hero.offsetWidth;
        canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    for (let i = 0; i < count; i++) {
        particles.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            r: Math.random() * 2 + 0.5,
            dx: (Math.random() - 0.5) * 0.3,
            dy: -(Math.random() * 0.4 + 0.1),
            alpha: Math.random() * 0.4 + 0.1,
            pulse: Math.random() * Math.PI * 2,
        });
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.x += p.dx;
            p.y += p.dy;
            p.pulse += 0.02;
            const a = p.alpha * (0.6 + Math.sin(p.pulse) * 0.4);

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${a})`;
            ctx.fill();

            // glow
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
            const grd = ctx.createRadialGradient(p.x, p.y, p.r * 0.5, p.x, p.y, p.r * 3);
            grd.addColorStop(0, `rgba(212, 175, 55, ${a * 0.3})`);
            grd.addColorStop(1, 'rgba(212, 175, 55, 0)');
            ctx.fillStyle = grd;
            ctx.fill();

            if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }
            if (p.x < -10 || p.x > canvas.width + 10) { p.x = Math.random() * canvas.width; }
        });
        requestAnimationFrame(animate);
    }
    animate();
}

// ===== CHART CONFIGURATION =====
const chartColors = {
    accent: 'rgba(212, 175, 55, 1)',
    accentFade: 'rgba(212, 175, 55, 0.18)',
    green: 'rgba(94, 230, 160, 1)',
    greenFade: 'rgba(94, 230, 160, 0.15)',
    red: 'rgba(255, 107, 107, 1)',
    redFade: 'rgba(255, 107, 107, 0.15)',
    blue: 'rgba(110, 168, 254, 1)',
    blueFade: 'rgba(110, 168, 254, 0.15)',
    purple: 'rgba(180, 154, 255, 1)',
    purpleFade: 'rgba(180, 154, 255, 0.15)',
    grid: 'rgba(255, 255, 255, 0.05)',
    text: 'rgba(238, 238, 242, 0.5)',
};

const chartDefaults = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
        legend: {
            labels: {
                color: chartColors.text,
                font: { family: "'DM Sans', sans-serif", size: 12, weight: 500 },
                padding: 16,
                usePointStyle: true,
                pointStyleWidth: 10,
            },
        },
        tooltip: {
            backgroundColor: 'rgba(10, 14, 26, 0.95)',
            titleColor: '#eeeef2',
            bodyColor: 'rgba(238,238,242,0.7)',
            borderColor: 'rgba(199,165,114,0.2)',
            borderWidth: 1,
            cornerRadius: 12,
            padding: 14,
            titleFont: { family: "'DM Sans', sans-serif", weight: 700, size: 13 },
            bodyFont: { family: "'DM Sans', sans-serif", size: 12 },
            callbacks: {
                label: function (ctx) {
                    let val = ctx.parsed.y ?? ctx.parsed;
                    if (typeof val === 'number') {
                        return ctx.dataset.label + ': ' + val.toLocaleString('ru-RU') + ' ₽';
                    }
                    return ctx.dataset.label + ': ' + val;
                },
            },
        },
    },
    scales: {
        x: {
            ticks: { color: chartColors.text, font: { family: "'DM Sans'", size: 11 } },
            grid: { color: chartColors.grid },
            border: { color: chartColors.grid },
        },
        y: {
            ticks: {
                color: chartColors.text,
                font: { family: "'DM Sans'", size: 11 },
                callback: (v) => (v >= 1000 ? (v / 1000000).toFixed(1) + ' млн' : v),
            },
            grid: { color: chartColors.grid },
            border: { color: chartColors.grid },
        },
    },
    animation: {
        duration: 1200,
        easing: 'easeOutQuart',
    },
};

let chartInstances = {};

function initCharts() {
    // 1 — Tour CM by group size
    const tourCtx = document.getElementById('chart-tour-cm');
    if (tourCtx) {
        chartInstances.tourCm = new Chart(tourCtx, {
            type: 'bar',
            data: {
                labels: ['4 чел.', '5 чел.', '6 чел.', '7 чел.', '8 чел.'],
                datasets: [
                    {
                        label: 'COGS',
                        data: [9300, 9550, 9800, 10050, 10300],
                        backgroundColor: chartColors.redFade,
                        borderColor: chartColors.red,
                        borderWidth: 1.5,
                        borderRadius: 6,
                    },
                    {
                        label: 'Прибыль (CM)',
                        data: [7440, 7640, 7840, 8040, 8240],
                        backgroundColor: chartColors.accentFade,
                        borderColor: chartColors.accent,
                        borderWidth: 1.5,
                        borderRadius: 6,
                    },
                ],
            },
            options: {
                ...chartDefaults,
                plugins: {
                    ...chartDefaults.plugins,
                    tooltip: {
                        ...chartDefaults.plugins.tooltip,
                    },
                },
                scales: {
                    ...chartDefaults.scales,
                    y: {
                        ...chartDefaults.scales.y,
                        ticks: {
                            ...chartDefaults.scales.y.ticks,
                            callback: (v) => v.toLocaleString('ru-RU') + ' ₽',
                        },
                    },
                },
            },
        });
    }

    // 2 — Cash Flow 3 scenarios comparison
    const cfCtx = document.getElementById('chart-cashflow');
    if (cfCtx) {
        chartInstances.cashflow = new Chart(cfCtx, {
            type: 'line',
            data: {
                labels: ['Год 1', 'Год 2', 'Год 3'],
                datasets: [
                    {
                        label: 'Пессимист',
                        data: [882875, 1397160, 2022710],
                        borderColor: chartColors.red,
                        backgroundColor: chartColors.redFade,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        borderWidth: 2.5,
                    },
                    {
                        label: 'Умеренный',
                        data: [2606645, 4981280, 9346885],
                        borderColor: chartColors.accent,
                        backgroundColor: chartColors.accentFade,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        borderWidth: 2.5,
                    },
                    {
                        label: 'Оптимист',
                        data: [8531875, 16656850, 32312330],
                        borderColor: chartColors.green,
                        backgroundColor: chartColors.greenFade,
                        fill: true,
                        tension: 0.4,
                        pointRadius: 5,
                        pointHoverRadius: 8,
                        borderWidth: 2.5,
                    },
                ],
            },
            options: {
                ...chartDefaults,
                scales: {
                    ...chartDefaults.scales,
                    y: {
                        ...chartDefaults.scales.y,
                        ticks: {
                            ...chartDefaults.scales.y.ticks,
                            callback: (v) => {
                                if (v >= 1000000) return (v / 1000000).toFixed(1) + ' млн';
                                if (v >= 1000) return (v / 1000).toFixed(0) + 'k';
                                return v;
                            },
                        },
                    },
                },
            },
        });
    }

    // 3 — Revenue breakdown (moderate yr1)
    const revCtx = document.getElementById('chart-revenue-breakdown');
    if (revCtx) {
        chartInstances.revenue = new Chart(revCtx, {
            type: 'doughnut',
            data: {
                labels: ['Туры', 'Прокат', 'Еда-сервис'],
                datasets: [
                    {
                        data: [1100040, 2299500, 57105],
                        backgroundColor: [
                            chartColors.accent,
                            chartColors.blue,
                            chartColors.green,
                        ],
                        borderColor: '#0a0e1a',
                        borderWidth: 3,
                        hoverOffset: 8,
                    },
                ],
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                cutout: '68%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: chartColors.text,
                            font: { family: "'DM Sans'", size: 12, weight: 500 },
                            padding: 20,
                            usePointStyle: true,
                        },
                    },
                    tooltip: {
                        ...chartDefaults.plugins.tooltip,
                        callbacks: {
                            label: function (ctx) {
                                const total = ctx.dataset.data.reduce((a, b) => a + b, 0);
                                const pct = ((ctx.parsed / total) * 100).toFixed(1);
                                return ctx.label + ': ' + ctx.parsed.toLocaleString('ru-RU') + ' ₽ (' + pct + '%)';
                            },
                        },
                    },
                },
                animation: { animateRotate: true, duration: 1400, easing: 'easeOutQuart' },
            },
        });
    }

    // 4 — Rental payback by scenario
    const payCtx = document.getElementById('chart-rental-payback');
    if (payCtx) {
        chartInstances.payback = new Chart(payCtx, {
            type: 'bar',
            data: {
                labels: ['Пессимист', 'Умеренный', 'Оптимист'],
                datasets: [
                    {
                        label: 'Часов до окупаемости',
                        data: [159, 137, 128],
                        backgroundColor: [
                            chartColors.redFade,
                            chartColors.accentFade,
                            chartColors.greenFade,
                        ],
                        borderColor: [chartColors.red, chartColors.accent, chartColors.green],
                        borderWidth: 1.5,
                        borderRadius: 8,
                    },
                ],
            },
            options: {
                ...chartDefaults,
                indexAxis: 'y',
                plugins: {
                    ...chartDefaults.plugins,
                    legend: { display: false },
                    tooltip: {
                        ...chartDefaults.plugins.tooltip,
                        callbacks: {
                            label: (ctx) => ctx.parsed.x + ' часов',
                        },
                    },
                },
                scales: {
                    x: {
                        ...chartDefaults.scales.x,
                        ticks: {
                            ...chartDefaults.scales.x.ticks,
                            callback: (v) => v + ' ч',
                        },
                    },
                    y: {
                        ...chartDefaults.scales.y,
                        ticks: {
                            ...chartDefaults.scales.y.ticks,
                            callback: function (val) {
                                return this.getLabelForValue(val);
                            },
                        },
                    },
                },
            },
        });
    }

    // 5 — Operating profit stacked (moderate scenario)
    const profitCtx = document.getElementById('chart-op-profit');
    if (profitCtx) {
        chartInstances.opProfit = new Chart(profitCtx, {
            type: 'bar',
            data: {
                labels: ['Год 1', 'Год 2', 'Год 3'],
                datasets: [
                    {
                        label: 'Туры CM',
                        data: [1100040, 1334880, 1624440],
                        backgroundColor: chartColors.accent,
                        borderRadius: 4,
                    },
                    {
                        label: 'Прокат CM',
                        data: [2299500, 4599000, 9198000],
                        backgroundColor: chartColors.blue,
                        borderRadius: 4,
                    },
                    {
                        label: 'Еда-сервис',
                        data: [57105, 77400, 104445],
                        backgroundColor: chartColors.green,
                        borderRadius: 4,
                    },
                    {
                        label: 'Фиксы',
                        data: [-480000, -720000, -960000],
                        backgroundColor: chartColors.red,
                        borderRadius: 4,
                    },
                ],
            },
            options: {
                ...chartDefaults,
                plugins: {
                    ...chartDefaults.plugins,
                },
                scales: {
                    ...chartDefaults.scales,
                    x: { ...chartDefaults.scales.x, stacked: true },
                    y: {
                        ...chartDefaults.scales.y,
                        stacked: true,
                        ticks: {
                            ...chartDefaults.scales.y.ticks,
                            callback: (v) => {
                                if (v >= 1000000) return (v / 1000000).toFixed(1) + ' млн';
                                if (v <= -1000000) return (v / 1000000).toFixed(1) + ' млн';
                                if (Math.abs(v) >= 1000) return (v / 1000).toFixed(0) + 'k';
                                return v;
                            },
                        },
                    },
                },
            },
        });
    }

    // 6 — Fleet growth over 3 years (all scenarios)
    const fleetCtx = document.getElementById('chart-fleet');
    if (fleetCtx) {
        chartInstances.fleet = new Chart(fleetCtx, {
            type: 'line',
            data: {
                labels: ['Год 1', 'Год 2', 'Год 3'],
                datasets: [
                    {
                        label: 'Пессимист',
                        data: [1, 1, 2],
                        borderColor: chartColors.red,
                        backgroundColor: chartColors.redFade,
                        fill: false,
                        tension: 0.3,
                        pointRadius: 6,
                        pointHoverRadius: 9,
                        borderWidth: 2,
                        pointStyle: 'circle',
                    },
                    {
                        label: 'Умеренный',
                        data: [1, 2, 4],
                        borderColor: chartColors.accent,
                        backgroundColor: chartColors.accentFade,
                        fill: false,
                        tension: 0.3,
                        pointRadius: 6,
                        pointHoverRadius: 9,
                        borderWidth: 2,
                        pointStyle: 'circle',
                    },
                    {
                        label: 'Оптимист',
                        data: [2, 4, 8],
                        borderColor: chartColors.green,
                        backgroundColor: chartColors.greenFade,
                        fill: false,
                        tension: 0.3,
                        pointRadius: 6,
                        pointHoverRadius: 9,
                        borderWidth: 2,
                        pointStyle: 'circle',
                    },
                ],
            },
            options: {
                ...chartDefaults,
                plugins: {
                    ...chartDefaults.plugins,
                    tooltip: {
                        ...chartDefaults.plugins.tooltip,
                        callbacks: {
                            label: (ctx) => ctx.dataset.label + ': ' + ctx.parsed.y + ' лодок',
                        },
                    },
                },
                scales: {
                    ...chartDefaults.scales,
                    y: {
                        ...chartDefaults.scales.y,
                        min: 0,
                        max: 9,
                        ticks: {
                            ...chartDefaults.scales.y.ticks,
                            stepSize: 1,
                            callback: (v) => v + ' шт.',
                        },
                    },
                },
            },
        });
    }

    // Observe chart containers for animation on scroll
    document.querySelectorAll('.chart-container').forEach((container) => {
        // Initially hide chart data
        const canvas = container.querySelector('canvas');
        if (canvas && canvas.id && chartInstances[getChartKey(canvas.id)]) {
            const chart = chartInstances[getChartKey(canvas.id)];
            // Store original data and set to zero
            chart._originalData = chart.data.datasets.map(ds => [...ds.data]);
            chart.data.datasets.forEach(ds => {
                ds.data = ds.data.map(() => 0);
            });
            chart.options.animation = false;
            chart.update('none');
        }

        const chartObserver = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !entry.target.dataset.animated) {
                        entry.target.dataset.animated = 'true';
                        const canvas = entry.target.querySelector('canvas');
                        if (canvas && canvas.id && chartInstances[getChartKey(canvas.id)]) {
                            const chart = chartInstances[getChartKey(canvas.id)];
                            // Restore original data with animation
                            if (chart._originalData) {
                                chart.data.datasets.forEach((ds, i) => {
                                    ds.data = chart._originalData[i];
                                });
                            }
                            chart.options.animation = {
                                duration: 1800,
                                easing: 'easeOutQuart',
                                delay: (ctx) => {
                                    if (ctx.type === 'data') {
                                        return ctx.dataIndex * 120 + ctx.datasetIndex * 200;
                                    }
                                    return 0;
                                }
                            };
                            chart.update();
                        }
                    }
                });
            },
            { threshold: 0.25 }
        );
        chartObserver.observe(container);
    });
}

function getChartKey(canvasId) {
    const map = {
        'chart-tour-cm': 'tourCm',
        'chart-cashflow': 'cashflow',
        'chart-revenue-breakdown': 'revenue',
        'chart-rental-payback': 'payback',
        'chart-op-profit': 'opProfit',
        'chart-fleet': 'fleet',
    };
    return map[canvasId] || '';
}

function updateChartsForTab(tabId) {
    // Resize charts after tab switch (fixes hidden canvas sizing)
    setTimeout(() => {
        Object.values(chartInstances).forEach((c) => c.resize());
    }, 100);
}
