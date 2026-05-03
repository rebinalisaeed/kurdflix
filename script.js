// ========== داتاکان ==========
let allMovies = [];
let carouselSlides = [];
let currentCategory = "all";
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
        renderMoviesByCategory("all");
        populateSearchIndex();
    } catch (error) {
        console.error("Error loading data:", error);
        loadSampleData();
    }
}

// ========== داتای نموونەیی بۆ یەکەمجار ==========
function loadSampleData() {
    allMovies = [
        { id: 1, title: "ئەفسانەی کوێستان", year: "2024", poster: "https://via.placeholder.com/200x300?text=Poster1", type: "film", categories: ["kurdish-film", "all-films"], videoUrl: "https://vidmoly.com/e/example1", description: "چیرۆکی شەڕ و خۆشەویستی", trailerUrl: "" },
        { id: 2, title: "دڵی باڵکان", year: "2024", poster: "https://via.placeholder.com/200x300?text=Poster2", type: "series", categories: ["turkish-series", "all-series"], videoUrl: "https://streamsb.com/e/example2", description: "زنجیرەیەکی درامایی", trailerUrl: "" },
        { id: 3, title: "تاڵانی پارە", year: "2025", poster: "https://via.placeholder.com/200x300?text=Poster3", type: "film", categories: ["turkish-film", "all-films"], videoUrl: "https://vidmoly.com/e/example3", description: "فیلمێکی ئەکشنی تورکی", trailerUrl: "" }
    ];
    carouselSlides = [
        { id: 1, title: "ئەفسانەی کوێستان", category: "فیلمی کوردی", description: "چیرۆکی شەڕ و خۆشەویستی لە دڵی چیاکاندا", poster: "https://via.placeholder.com/1200x600?text=Slide1", movieId: 1 },
        { id: 2, title: "دڵی باڵکان", category: "زنجیرەی تورکی", description: "زنجیرەیەکی درامایی سەرنجڕاکێش", poster: "https://via.placeholder.com/1200x600?text=Slide2", movieId: 2 },
        { id: 3, title: "تاڵانی پارە", category: "فیلمی تورکی", description: "فیلمێکی ئەکشنی خێرا و پڕ لە سەرکێشی", poster: "https://via.placeholder.com/1200x600?text=Slide3", movieId: 3 }
    ];
    renderCarousel();
    startCarouselAutoPlay();
    renderMoviesByCategory("all");
    populateSearchIndex();
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
        slideDiv.style.backgroundImage = `url('${slide.poster}')`;
        slideDiv.innerHTML = `
            <div class="carousel-overlay">
                <h2 class="carousel-title">${slide.title}</h2>
                <span class="carousel-category">${slide.category}</span>
                <p class="carousel-description">${slide.description}</p>
                <div class="carousel-buttons">
                    <button class="carousel-btn trailer" data-id="${slide.movieId}">🎬 ترایلەر</button>
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
    
    document.querySelectorAll('.carousel-btn.trailer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const movieId = parseInt(btn.dataset.id);
            window.location.href = `movie.html?id=${movieId}`;
        });
    });
    
    document.querySelectorAll('.carousel-btn.info').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const movieId = parseInt(btn.dataset.id);
            window.location.href = `movie.html?id=${movieId}`;
        });
    });
}

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

// ========== نمایش فیلم و زنجیرەکان ==========
function renderMoviesByCategory(category) {
    const grid = document.getElementById('moviesGrid');
    const titleEl = document.getElementById('currentCategoryTitle');
    if (!grid) return;
    
    let filtered = [];
    
    if (category === 'all') {
        filtered = allMovies;
        if (titleEl) titleEl.textContent = 'هەموو فیلم و زنجیرەکان';
    } else if (category === 'all-films') {
        filtered = allMovies.filter(m => m.type === 'film');
        if (titleEl) titleEl.textContent = 'هەموو فیلمەکان';
    } else if (category === 'all-series') {
        filtered = allMovies.filter(m => m.type === 'series');
        if (titleEl) titleEl.textContent = 'هەموو زنجیرەکان';
    } else {
        filtered = allMovies.filter(m => m.categories && m.categories.includes(category));
        const categoryNames = {
            'kurdish-film': 'فیلمی کوردی', 'hollywood': 'هۆلیوود',
            'bollywood': 'بۆلیوود', 'russian': 'فیلمی روسی',
            'korean': 'فیلمی کۆری', 'persian': 'فیلمی فارسی',
            'arabic': 'فیلمی عەرەبی', 'turkish-film': 'فیلمی تورکی',
            'european': 'فیلمی بیانی', 'kurdish-series': 'زنجیرەی کوردی',
            'american-series': 'زنجیرەی ئەمەریکی', 'korean-series': 'زنجیرەی کۆری',
            'indian-series': 'زنجیرەی هیندی', 'chinese-series': 'زنجیرەی چینی',
            'turkish-series': 'زنجیرەی تورکی', 'persian-series': 'زنجیرەی فارسی',
            'arabic-series': 'زنجیرەی عەرەبی', 'anime': 'ئەنیمی و ئەنیمەیشن',
            'documentary': 'دیکۆمێنتاری'
        };
        if (titleEl) titleEl.textContent = categoryNames[category] || category;
    }
    
    if (filtered.length === 0) {
        grid.innerHTML = '<p style="text-align:center;">هیچ فیلمێک نەدۆزرایەوە لەم بەشەدا</p>';
        return;
    }
    
    grid.innerHTML = '';
    filtered.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.onclick = () => {
            window.location.href = `movie.html?id=${movie.id}`;
        };
        card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/200x300?text=No+Poster'">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-year">${movie.year} | ${movie.type === 'film' ? 'فیلم' : 'زنجیرە'}</p>
            </div>
        `;
        grid.appendChild(card);
    });
}

// ========== گەڕان ==========
let searchIndex = [];
function populateSearchIndex() {
    searchIndex = allMovies.map(m => ({
        id: m.id,
        title: m.title,
        type: m.type
    }));
}

function searchMovies(query) {
    if (!query.trim()) return [];
    return searchIndex.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );
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
        item.onclick = () => {
            window.location.href = `movie.html?id=${result.id}`;
        };
        resultsDiv.appendChild(item);
    });
}

// ========== Initialize Functions (Desktop & Tablet) ==========
function initCategoryFilters() {
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            if (category) {
                currentCategory = category;
                renderMoviesByCategory(category);
            }
        });
    });
    
    // بۆ مۆبایل - مێنیوی درۆپ داون
    document.querySelectorAll('.mobile-dropdown-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            if (category) {
                currentCategory = category;
                renderMoviesByCategory(category);
                // داخستنی مێنیوی مۆبایل
                const mobileMenu = document.getElementById('mobileMenu');
                const overlay = document.getElementById('mobileMenuOverlay');
                if (mobileMenu) mobileMenu.classList.remove('active');
                if (overlay) overlay.style.display = 'none';
                document.body.style.overflow = '';
                // گۆڕینی ئایکۆنی hamburger بۆ bars
                const hamburger = document.getElementById('hamburgerBtn');
                if (hamburger) {
                    const icon = hamburger.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
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

function initSearch() {
    const searchIcon = document.getElementById('searchIcon');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    
    if (searchIcon && searchForm) {
        searchIcon.addEventListener('click', () => {
            searchForm.style.display = searchForm.style.display === 'none' ? 'block' : 'none';
            if (searchForm.style.display === 'block') {
                searchInput.focus();
            }
        });
        
        if (searchClose) {
            searchClose.addEventListener('click', () => {
                searchForm.style.display = 'none';
                document.getElementById('searchResults').innerHTML = '';
            });
        }
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const results = searchMovies(e.target.value);
            displaySearchResults(results);
        });
    }
}

function initModals() {
    const loginIcon = document.getElementById('loginIcon');
    const vipBtn = document.getElementById('vipBtn');
    const loginModal = document.getElementById('loginModal');
    const vipModal = document.getElementById('vipModal');
    const closeModals = document.querySelectorAll('.close-modal');
    
    if (loginIcon && loginModal) {
        loginIcon.addEventListener('click', () => {
            loginModal.style.display = 'flex';
        });
    }
    
    if (vipBtn && vipModal) {
        vipBtn.addEventListener('click', () => {
            vipModal.style.display = 'flex';
        });
    }
    
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
    
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
    
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });
}

// ========== فەنکشنەکانی مۆبایل ==========
function initMobileMenu() {
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

function initMobileSearch() {
    const mobileSearchIcon = document.getElementById('mobileSearchIcon');
    const searchForm = document.getElementById('searchForm');
    const searchInput = document.getElementById('searchInput');
    const searchClose = document.getElementById('searchClose');
    
    if (mobileSearchIcon && searchForm) {
        mobileSearchIcon.addEventListener('click', () => {
            searchForm.style.display = searchForm.style.display === 'none' ? 'block' : 'none';
            if (searchForm.style.display === 'block' && searchInput) {
                searchInput.focus();
            }
        });
        
        if (searchClose) {
            searchClose.addEventListener('click', () => {
                searchForm.style.display = 'none';
                document.getElementById('searchResults').innerHTML = '';
            });
        }
    }
    
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const results = searchMovies(e.target.value);
            displaySearchResults(results);
        });
    }
}

function initMobileModals() {
    const mobileLoginIcon = document.getElementById('mobileLoginIcon');
    const mobileVipBtn = document.getElementById('mobileVipBtn');
    const loginModal = document.getElementById('loginModal');
    const vipModal = document.getElementById('vipModal');
    const closeModals = document.querySelectorAll('.close-modal');
    
    if (mobileLoginIcon && loginModal) {
        mobileLoginIcon.addEventListener('click', () => {
            loginModal.style.display = 'flex';
            // داخستنی مێنیوی مۆبایل
            const mobileMenu = document.getElementById('mobileMenu');
            const overlay = document.getElementById('mobileMenuOverlay');
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (overlay) overlay.style.display = 'none';
            document.body.style.overflow = '';
            const hamburger = document.getElementById('hamburgerBtn');
            if (hamburger) {
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
    if (mobileVipBtn && vipModal) {
        mobileVipBtn.addEventListener('click', () => {
            vipModal.style.display = 'flex';
            const mobileMenu = document.getElementById('mobileMenu');
            const overlay = document.getElementById('mobileMenuOverlay');
            if (mobileMenu) mobileMenu.classList.remove('active');
            if (overlay) overlay.style.display = 'none';
            document.body.style.overflow = '';
            const hamburger = document.getElementById('hamburgerBtn');
            if (hamburger) {
                const icon = hamburger.querySelector('i');
                if (icon) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    }
    
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

// ========== DOM Content Loaded ==========
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initCategoryFilters();
    initTheme();
    initSearch();
    initModals();
    initNavbarScroll();
    
    // فەنکشنەکانی مۆبایل
    initMobileMenu();
    initMobileDropdowns();
    initMobileSearch();
    initMobileModals();
});
