// بارکردنی داتاکان لە data.json
let allMovies = []; // هەموو فیلم و زنجیرەکان
let carouselSlides = []; // سلایدەکان
let currentCategory = "all";
let currentCarouselIndex = 0;
let carouselInterval;

// بارکردنی داتاکان
async function loadData() {
    try {
        const response = await fetch('data.json');
        const data = await response.json();
        allMovies = data.movies;
        carouselSlides = data.carousel;
        
        // نمایش سلایدەکان
        renderCarousel();
        startCarouselAutoPlay();
        
        // نمایش فیلمەکان
        renderMoviesByCategory("all");
        
        // پڕکردنەوەی لیستی گەڕان
        populateSearchIndex();
    } catch (error) {
        console.error("Error loading data:", error);
        // data.json نەبوو، بە داتای نموونەیی کاربکە
        loadSampleData();
    }
}

// داتای نموونەیی بۆ یەکەمجار (ئەگەر data.json نەبوو)
function loadSampleData() {
    allMovies = sampleMovies;
    carouselSlides = sampleCarousel;
    renderCarousel();
    startCarouselAutoPlay();
    renderMoviesByCategory("all");
    populateSearchIndex();
}

// سلایدەکان نمایش بکە
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
        
        // دۆتەکان
        const dot = document.createElement('div');
        dot.className = `dot ${index === 0 ? 'active' : ''}`;
        dot.dataset.index = index;
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    
    // ئیڤێنت بۆ دوگمەکانی سلاید
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

// گۆڕینی سلاید بە دەست
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

function nextSlide() {
    goToSlide(currentCarouselIndex + 1);
}

function prevSlide() {
    goToSlide(currentCarouselIndex - 1);
}

function startCarouselAutoPlay() {
    if (carouselInterval) clearInterval(carouselInterval);
    carouselInterval = setInterval(() => {
        nextSlide();
    }, 6000);
}

// نمایش فیلم و زنجیرەکان بە پێی پۆل
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
        // ناونیشان بۆ کاتێگۆریەکە
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

// پڕکردنەوەی لیستی گەڕان
let searchIndex = [];
function populateSearchIndex() {
    searchIndex = allMovies.map(m => ({
        id: m.id,
        title: m.title,
        type: m.type
    }));
}

// گەڕان
function searchMovies(query) {
    if (!query.trim()) return [];
    const results = searchIndex.filter(item =>
        item.title.toLowerCase().includes(query.toLowerCase())
    );
    return results;
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

// Initialize Dropdown clicks for mobile
function initMobileDropdowns() {
    const dropdowns = document.querySelectorAll('.dropdown > a');
    dropdowns.forEach(dropdown => {
        dropdown.addEventListener('click', (e) => {
            if (window.innerWidth <= 768) {
                e.preventDefault();
                const parent = dropdown.parentElement;
                parent.classList.toggle('active');
            }
        });
    });
}

// Initialize category filters
function initCategoryFilters() {
    document.querySelectorAll('.dropdown-menu a').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const category = link.dataset.category;
            if (category) {
                currentCategory = category;
                renderMoviesByCategory(category);
                // بستن مینیو لە مۆبایلدا
                if (window.innerWidth <= 768) {
                    document.getElementById('nav-menu').classList.remove('active');
                }
            }
        });
    });
}

// Dark/Light Mode
function initTheme() {
    const themeSwitch = document.getElementById('theme-switch');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        themeSwitch.checked = true;
    } else {
        document.body.setAttribute('data-theme', 'dark');
        themeSwitch.checked = false;
    }
    
    themeSwitch.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// Hamburger menu for mobile
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', () => {
            navMenu.classList.toggle('active');
        });
        
        // داخستنی مینیو کاتێک لینکێک کرتە دەکرێت
        document.querySelectorAll('.nav-menu a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                }
            });
        });
    }
}

// Search functionality
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
        
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                const results = searchMovies(e.target.value);
                displaySearchResults(results);
            });
        }
    }
}

// Modals
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
            loginModal.style.display = 'none';
            vipModal.style.display = 'none';
        });
    });
    
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.style.display = 'none';
        if (e.target === vipModal) vipModal.style.display = 'none';
    });
}

// Carousel buttons
function initCarouselControls() {
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    if (prevBtn) prevBtn.addEventListener('click', prevSlide);
    if (nextBtn) nextBtn.addEventListener('click', nextSlide);
}

// کاتێک پەڕە بار بوو
document.addEventListener('DOMContentLoaded', () => {
    loadData();
    initMobileDropdowns();
    initCategoryFilters();
    initTheme();
    initHamburger();
    initSearch();
    initModals();
    initCarouselControls();
});

// داتای نموونەیی بۆ یەکەمجار
const sampleMovies = [
    { id: 1, title: "ئەفسانەی کوێستان", year: "2024", poster: "assets/poster1.jpg", type: "film", categories: ["kurdish-film", "all-films"], videoUrl: "https://vidmoly.com/e/example1" },
    { id: 2, title: "قەڵای خەونەکان", year: "2023", poster: "assets/poster2.jpg", type: "series", categories: ["turkish-series", "all-series"], videoUrl: "https://streamsb.com/e/example2" },
    { id: 3, title: "ڕۆژی دوایین", year: "2025", poster: "assets/poster3.jpg", type: "film", categories: ["hollywood", "all-films"], videoUrl: "https://vidmoly.com/e/example3" }
];

const sampleCarousel = [
    { id: 1, title: "ئەفسانەی کوێستان", category: "فیلمی کوردی", description: "چیرۆکی شەڕ و خۆشەویستی لە دڵی چیاکاندا", poster: "assets/poster1.jpg", movieId: 1 },
    { id: 2, title: "قەڵای خەونەکان", category: "زنجیرەی تورکی", description: "زنجیرەیەکی درامایی و سەرنجڕاکێش", poster: "assets/poster2.jpg", movieId: 2 }
];
