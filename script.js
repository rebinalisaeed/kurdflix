// ========== داتاکان ==========
let allMovies = [];
let carouselSlides = [];
let currentCarouselIndex = 0;
let carouselInterval;

// ========== بارکردنی داتاکان لە data.json ==========
async function loadData() {
    try {
        const response = await fetch('data.json?t=' + Date.now());
        const data = await response.json();
        allMovies = data.movies || [];
        carouselSlides = data.carousel || [];
        
        renderCarousel();
        startCarouselAutoPlay();
        renderAllSections();
        populateSearchIndex();
        
        // نوسینی فووتەر لە داتاکان
        if (data.siteData) {
            const aboutP = document.getElementById('aboutText');
            const copyrightP = document.getElementById('copyrightText');
            if (aboutP && data.siteData.aboutText) aboutP.textContent = data.siteData.aboutText;
            if (copyrightP && data.siteData.copyrightText) copyrightP.textContent = data.siteData.copyrightText;
        }
    } catch (error) {
        console.error("Error loading data:", error);
        loadSampleData();
    }
}

// ========== داتای نموونەیی بۆ یەکەمجار ==========
function loadSampleData() {
    allMovies = [
        { id: 1, title: "ئەفسانەی کوێستان", year: "2024", poster: "https://picsum.photos/200/300?random=1", type: "film", lang: "kurdish", categories: ["kurdish-film"], description: "فیلمێکی کوردی", genres: ["دراما", "ئاکشن"], videoUrl: "https://vidmoly.com/e/example1" },
        { id: 2, title: "قەڵای خەونەکان", year: "2023", poster: "https://picsum.photos/200/300?random=2", type: "series", lang: "turkish", categories: ["turkish-series"], description: "زنجیرەیەکی درامایی", genres: ["دراما", "ڕۆمانسی"], videoUrl: "https://streamsb.com/e/example2" }
    ];
    carouselSlides = [
        { id: 1, title: "ئەفسانەی کوێستان", category: "فیلمی کوردی", year: "2024", description: "فیلمێکی کوردی", images: { mobile: "https://picsum.photos/1080/1920?random=1", tablet: "https://picsum.photos/1080/1920?random=1", desktop: "https://picsum.photos/1080/1920?random=1" }, movieId: 1, genres: ["دراما", "ئاکشن"] }
    ];
    renderCarousel();
    startCarouselAutoPlay();
    renderAllSections();
    populateSearchIndex();
}

// ========== هەڵبژاردنی وێنەی گونجاو بە پێی قەبارەی شاشە ==========
function getResponsiveImage(slide) {
    const width = window.innerWidth;
    if (slide.images) {
        if (width <= 768) {
            return slide.images.mobile || slide.images.desktop;
        } else if (width <= 1024) {
            return slide.images.tablet || slide.images.mobile || slide.images.desktop;
        } else {
            return slide.images.desktop || slide.images.mobile;
        }
    }
    return slide.poster || "https://picsum.photos/1080/1920";
}

// ========== سلایدەکان ==========
function renderCarousel() {
    const container = document.getElementById('carouselContainer');
    const dotsContainer = document.getElementById('carouselDots');
    if (!container) return;
    
    container.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    carouselSlides.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = `carousel-slide ${index === 0 ? 'active' : ''}`;
        const imageUrl = getResponsiveImage(slide);
        slideDiv.style.backgroundImage = `url('${imageUrl}')`;
        
        const genresHtml = slide.genres && slide.genres.length > 0 
            ? `<div class="carousel-genres">${slide.genres.slice(0, 3).map(g => `<span class="genre-tag">${g}</span>`).join('')}</div>` 
            : '';
        
        slideDiv.innerHTML = `
            <div class="carousel-content">
                ${slide.category ? `<span class="carousel-category">${slide.category}</span>` : ''}
                ${slide.year ? `<span class="carousel-year">${slide.year}</span>` : ''}
                ${genresHtml}
                <p class="carousel-desc">${slide.description || ''}</p>
                <div class="carousel-buttons">
                    <button class="carousel-btn trailer" data-id="${slide.movieId}">🎬 سەیرکردن</button>
                    <button class="carousel-btn info" data-id="${slide.movieId}">ℹ️ زانیاری زیاتر</button>
                </div>
            </div>
        `;
        container.appendChild(slideDiv);
        
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    document.querySelectorAll('.carousel-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const movieId = parseInt(btn.dataset.id);
            window.location.href = `movie.html?id=${movieId}`;
        });
    });
}

// گۆڕینی وێنەی سلاید کاتێک شاشە قەبارەی گۆڕا
window.addEventListener('resize', () => {
    if (carouselSlides.length > 0) {
        const slides = document.querySelectorAll('.carousel-slide');
        slides.forEach((slide, index) => {
            const slideData = carouselSlides[index];
            if (slideData) {
                const imageUrl = getResponsiveImage(slideData);
                slide.style.backgroundImage = `url('${imageUrl}')`;
            }
        });
    }
});

function goToSlide(index) {
    if (index < 0) index = carouselSlides.length - 1;
    if (index >= carouselSlides.length) index = 0;
    
    const slides = document.querySelectorAll('.carousel-slide');
    const dots = document.querySelectorAll('.dot');
    
    slides.forEach((slide, i) => {
        slide.classList.toggle('active', i === index);
    });
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === index);
    });
    
    currentCarouselIndex = index;
}

function startCarouselAutoPlay() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
        goToSlide(currentCarouselIndex + 1);
    }, 6000);
}

// ========== هەموو بەشەکانی سلایدەر ==========
function renderSlider(containerId, movies) {
    const slider = document.getElementById(containerId);
    if (!slider) return;
    
    if (movies.length === 0) {
        slider.innerHTML = '<div style="padding: 2rem; text-align: center;">هیچ بەرهەمێک نەدۆزرایەوە</div>';
        return;
    }
    
    slider.innerHTML = movies.map(movie => `
        <div class="movie-card" onclick="location.href='movie.html?id=${movie.id}'">
            <img src="${movie.poster}" class="movie-poster" onerror="this.src='https://picsum.photos/200/300?random=1'">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
            </div>
        </div>
    `).join('');
}

function renderAllSections() {
    const latest = [...allMovies].reverse().slice(0, 20);
    renderSlider('latestMoviesSlider', latest);
    renderSlider('filmsSlider', allMovies.filter(m => m.type === 'film').slice(0, 20));
    renderSlider('seriesSlider', allMovies.filter(m => m.type === 'series').slice(0, 20));
    renderSlider('kidsSlider', allMovies.filter(m => m.categories && m.categories.includes('kids')).slice(0, 20));
    renderSlider('kurdishSlider', allMovies.filter(m => m.lang === 'kurdish').slice(0, 20));
    renderSlider('persianSlider', allMovies.filter(m => m.lang === 'persian').slice(0, 20));
    renderSlider('arabicSlider', allMovies.filter(m => m.lang === 'arabic').slice(0, 20));
    renderSlider('turkishSlider', allMovies.filter(m => m.lang === 'turkish').slice(0, 20));
}

// ========== گەڕان ==========
let searchIndex = [];
function populateSearchIndex() {
    searchIndex = allMovies.map(m => ({ id: m.id, title: m.title, type: m.type }));
}

function searchMovies(query) {
    if (!query.trim()) return [];
    return searchIndex.filter(item => item.title.toLowerCase().includes(query.toLowerCase()));
}

function displaySearchResults(results) {
    const resultsDiv = document.getElementById('searchResults');
    if (!resultsDiv) return;
    if (results.length === 0) {
        resultsDiv.innerHTML = '<div class="search-item">هیچ ئەنجامێک نەدۆزرایەوە</div>';
        return;
    }
    resultsDiv.innerHTML = '';
    results.forEach(result => {
        const item = document.createElement('div');
        item.className = 'search-item';
        item.textContent = `${result.title} (${result.type === 'film' ? 'فیلم' : 'زنجیرە'})`;
        item.onclick = () => window.location.href = `movie.html?id=${result.id}`;
        resultsDiv.appendChild(item);
    });
}

// ========== Initialize Functions ==========
function initCategoryFilters() {
    document.querySelectorAll('.dropdown-menu a, .mobile-dropdown-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            if (category) window.location.href = `all-movies.html?category=${category}`;
        });
    });
}

function initSliderControls() {
    document.querySelectorAll('.slider-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const sliderId = btn.dataset.slider;
            const slider = document.querySelector(`#${sliderId} .movies-slider`);
            if (slider) {
                const scrollAmount = btn.classList.contains('next-btn') ? 300 : -300;
                slider.scrollBy({ left: scrollAmount, behavior: 'smooth' });
            }
        });
    });
}

function initTheme() {
    const themeSwitch = document.getElementById('theme-switch');
    const mobileThemeSwitch = document.getElementById('mobile-theme-switch');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        if (themeSwitch) themeSwitch.checked = true;
        if (mobileThemeSwitch) mobileThemeSwitch.checked = true;
    } else {
        document.body.setAttribute('data-theme', 'dark');
        if (themeSwitch) themeSwitch.checked = false;
        if (mobileThemeSwitch) mobileThemeSwitch.checked = false;
    }
    if (themeSwitch) {
        themeSwitch.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                if (mobileThemeSwitch) mobileThemeSwitch.checked = true;
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if (mobileThemeSwitch) mobileThemeSwitch.checked = false;
            }
        });
    }
    if (mobileThemeSwitch) {
        mobileThemeSwitch.addEventListener('change', (e) => {
            if (e.target.checked) {
                document.body.setAttribute('data-theme', 'light');
                localStorage.setItem('theme', 'light');
                if (themeSwitch) themeSwitch.checked = true;
            } else {
                document.body.setAttribute('data-theme', 'dark');
                localStorage.setItem('theme', 'dark');
                if (themeSwitch) themeSwitch.checked = false;
            }
        });
    }
}

function initHamburger() {
    const hamburger = document.getElementById('hamburgerBtn');
    const closeBtn = document.getElementById('closeMenuBtn');
    const mobileMenu = document.getElementById('mobileMenu');
    const overlay = document.getElementById('mobileMenuOverlay');
    if (!hamburger || !mobileMenu || !overlay) return;
    function openMenu() {
        mobileMenu.classList.add('active');
        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden';
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        }
    }
    function closeMenu() {
        mobileMenu.classList.remove('active');
        overlay.style.display = 'none';
        document.body.style.overflow = '';
        const icon = hamburger.querySelector('i');
        if (icon) {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    }
    hamburger.addEventListener('click', openMenu);
    if (closeBtn) closeBtn.addEventListener('click', closeMenu);
    overlay.addEventListener('click', closeMenu);
}

function initMobileDropdowns() {
    const toggles = document.querySelectorAll('.mobile-dropdown-toggle');
    toggles.forEach(toggle => {
        toggle.addEventListener('click', (e) => {
            e.preventDefault();
            const parent = toggle.parentElement;
            const menu = parent.querySelector('.mobile-dropdown-menu');
            if (menu) {
                menu.classList.toggle('active');
                const icon = toggle.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-chevron-down');
                    icon.classList.toggle('fa-chevron-up');
                }
            }
        });
    });
}

function initSearch() {
    const searchIcon = document.getElementById('searchIcon');
    const mobileSearchIcon = document.getElementById('mobileSearchIcon');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    const openSearch = () => {
        searchForm.style.display = searchForm.style.display === 'none' ? 'block' : 'none';
        if (searchForm.style.display === 'block' && searchInput) searchInput.focus();
    };
    if (searchIcon) searchIcon.addEventListener('click', openSearch);
    if (mobileSearchIcon) mobileSearchIcon.addEventListener('click', openSearch);
    if (searchClose) {
        searchClose.addEventListener('click', () => {
            searchForm.style.display = 'none';
            document.getElementById('searchResults').innerHTML = '';
        });
    }
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const results = searchMovies(e.target.value);
            displaySearchResults(results);
        });
    }
}

function initModals() {
    const loginIcons = document.querySelectorAll('#loginIcon, #mobileLoginIcon');
    const vipBtns = document.querySelectorAll('#vipBtn, #mobileVipBtn');
    const loginModal = document.getElementById('loginModal');
    const vipModal = document.getElementById('vipModal');
    const closeModals = document.querySelectorAll('.close-modal');
    loginIcons.forEach(icon => {
        icon.addEventListener('click', () => { if (loginModal) loginModal.style.display = 'flex'; });
    });
    vipBtns.forEach(btn => {
        btn.addEventListener('click', () => { if (vipModal) vipModal.style.display = 'flex'; });
    });
    closeModals.forEach(close => {
        close.addEventListener('click', () => {
            if (loginModal) loginModal.style.display = 'none';
            if (vipModal) vipModal.style.display = 'none';
        });
    });
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.style.display = 'none';
        if (e.target === vipModal) vipModal.style.display = 'none';
    });
}

function initNavbarScroll() {
    const navbar = document.querySelector('.navbar');
    if (!navbar) return;
    if (window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) navbar.classList.add('scrolled');
        else navbar.classList.remove('scrolled');
    });
}

// ========== DOM Content Loaded ==========
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initSliderControls();
    initTheme();
    initHamburger();
    initMobileDropdowns();
    initSearch();
    initModals();
    initNavbarScroll();
});
