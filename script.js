// ==================== داتا (ئەمە لە Admin Panel--ەوە بەڕێوە دەچێت) ====================

let allContent = JSON.parse(localStorage.getItem('kurdflix_content')) || [
    {
        id: 1,
        title: "ئاگرەکانی باکوور",
        genre: "دراما",
        year: "2025",
        description: "چیرۆکی خێزانێکی کوردی لە کاتی قەیراندا",
        poster: "https://via.placeholder.com/300x450?text=Agarekani+Bakur",
        embedLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "film",
        language: "kurdish",
        dateAdded: "2026-05-01",
        isSeries: false
    },
    {
        id: 2,
        title: "خەونەکانی مەهاباد",
        genre: "سەرکێشی",
        year: "2024",
        description: "گەشتێک بۆ ڕابردوو",
        poster: "https://via.placeholder.com/300x450?text=Xewnekani+Mehabad",
        embedLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "series",
        language: "kurdish",
        dateAdded: "2026-05-05",
        isSeries: true
    },
    {
        id: 3,
        title: "Diriliş Ertuğrul",
        genre: "مێژوویی",
        year: "2020",
        description: "درامایەکی مێژوویی تورکی",
        poster: "https://via.placeholder.com/300x450?text=Ertugrul",
        embedLink: "https://www.youtube.com/embed/dQw4w9WgXcQ",
        type: "series",
        language: "turkish",
        dateAdded: "2026-05-03",
        isSeries: true
    }
];

// سلایدەر داتا
let sliderItems = JSON.parse(localStorage.getItem('kurdflix_slider')) || [
    {
        title: "ئاگرەکانی باکوور",
        genre: "دراما",
        year: "2025",
        description: "چیرۆکی خێزانێکی کوردی لە کاتی قەیراندا",
        bgImage: "https://via.placeholder.com/1920x800?text=Slider+1",
        videoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        title: "Diriliş Ertuğrul",
        genre: "مێژوویی",
        year: "2020",
        description: "درامایەکی مێژوویی تورکی",
        bgImage: "https://via.placeholder.com/1920x800?text=Slider+2",
        videoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
];

function saveToLocal() {
    localStorage.setItem('kurdflix_content', JSON.stringify(allContent));
    localStorage.setItem('kurdflix_slider', JSON.stringify(sliderItems));
}

// ==================== هاوکارەکان ====================
function openVideoModal(url, title) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoIframe');
    const titleEl = document.getElementById('videoTitle');
    iframe.src = url;
    titleEl.innerText = title;
    modal.classList.add('active');
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoIframe');
    iframe.src = '';
    modal.classList.remove('active');
}

// کارتی فیلم دروست بکە
function createMovieCard(item) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
        <img src="${item.poster}" alt="${item.title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
        <div class="movie-info">
            <h3 class="movie-title">${item.title}</h3>
            <p class="movie-year">${item.year}</p>
        </div>
    `;
    card.addEventListener('click', () => openVideoModal(item.embedLink, item.title));
    return card;
}

// بەپێی پۆلێن فلتەر بکە
function filterByType(items, type) { // type: 'film', 'series'
    return items.filter(i => i.type === type);
}

function filterByLanguage(items, lang) {
    return items.filter(i => i.language === lang);
}

// ڕیزکردن بەپێی بەروار (نوێترین یەکەم)
function sortByDate(items) {
    return [...items].sort((a,b) => new Date(b.dateAdded) - new Date(a.dateAdded));
}

// ==================== ڕێندرکردنی بەشەکان ====================
function renderAllSections() {
    const sorted = sortByDate(allContent);
    const latest20 = sorted.slice(0,20);
    const films = filterByType(sorted, 'film');
    const series = filterByType(sorted, 'series');
    
    // 1. نوێترین بەرهەمەکان
    renderGrid('latestAllGrid', latest20.slice(0,20));
    // 2. نوێترین فیلمەکان
    renderGrid('latestMoviesGrid', sortByDate(films).slice(0,20));
    // 3. نوێترین زنجیرەکان
    renderGrid('latestSeriesGrid', sortByDate(series).slice(0,20));
    
    // بەشەکانی زمان
    renderGrid('kurdishGrid', sortByDate(filterByLanguage(sorted, 'kurdish')).slice(0,20));
    renderGrid('turkishGrid', sortByDate(filterByLanguage(sorted, 'turkish')).slice(0,20));
    renderGrid('arabicGrid', sortByDate(filterByLanguage(sorted, 'arabic')).slice(0,20));
    renderGrid('persianGrid', sortByDate(filterByLanguage(sorted, 'persian')).slice(0,20));
    renderGrid('koreanGrid', sortByDate(filterByLanguage(sorted, 'korean')).slice(0,20));
    renderGrid('indianGrid', sortByDate(filterByLanguage(sorted, 'indian')).slice(0,20));
    renderGrid('kidsGrid', sortByDate(filterByLanguage(sorted, 'kids')).slice(0,20));
}

function renderGrid(elementId, items) {
    const grid = document.getElementById(elementId);
    if(!grid) return;
    grid.innerHTML = '';
    items.forEach(item => {
        grid.appendChild(createMovieCard(item));
    });
}

// ==================== سلایدەر ====================
let currentSlide = 0;
const sliderContainer = document.getElementById('sliderContainer');
const dotsContainer = document.getElementById('sliderDots');

function buildSlider() {
    if(!sliderContainer) return;
    sliderContainer.innerHTML = '';
    dotsContainer.innerHTML = '';
    sliderItems.forEach((slide, idx) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide';
        slideDiv.style.backgroundImage = `url('${slide.bgImage}')`;
        slideDiv.innerHTML = `
            <div class="slide-content">
                <div class="slide-genre">${slide.genre}</div>
                <div class="slide-year">${slide.year}</div>
                <h2 class="slide-title">${slide.title}</h2>
                <p class="slide-desc">${slide.description}</p>
                <div class="slide-buttons">
                    <button class="watch-btn" data-video="${slide.videoLink}" data-title="${slide.title}">▶ سەیر کردن</button>
                    <button class="watchlist-btn">❤️ + لیستی دڵخواز</button>
                </div>
            </div>
        `;
        sliderContainer.appendChild(slideDiv);
        
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.addEventListener('click', () => goToSlide(idx));
        dotsContainer.appendChild(dot);
    });
    attachSliderEvents();
    updateSliderDots();
    startAutoSlide();
}

function attachSliderEvents() {
    document.querySelectorAll('.slide .watch-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const video = btn.getAttribute('data-video');
            const title = btn.getAttribute('data-title');
            openVideoModal(video, title);
        });
    });
    document.querySelectorAll('.slide .watchlist-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            alert('زیادکرا بۆ لیستی دڵخواز (ئەمە لە وەشانی داهاتوودا کاردەکات)');
        });
    });
}

function updateSliderDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        if(i === currentSlide) dot.classList.add('active');
        else dot.classList.remove('active');
    });
    if(sliderContainer) {
        sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
}

function goToSlide(index) {
    currentSlide = index;
    updateSliderDots();
}

function nextSlide() {
    if(sliderItems.length === 0) return;
    currentSlide = (currentSlide + 1) % sliderItems.length;
    updateSliderDots();
}

let autoInterval;
function startAutoSlide() {
    if(autoInterval) clearInterval(autoInterval);
    autoInterval = setInterval(nextSlide, 6000);
}

// ==================== هێدەری گۆڕاو ====================
window.addEventListener('scroll', () => {
    const header = document.getElementById('mainHeader');
    if(window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
});

// ==================== مێنوی مۆبایل ====================
const menuIcon = document.getElementById('menuIcon');
const menuPanel = document.getElementById('mobileMenuPanel');
const menuOverlay = document.getElementById('menuOverlay');
const closeMenu = document.getElementById('closeMenu');

function openMenu() {
    menuPanel.classList.add('open');
    menuOverlay.classList.add('active');
}

function closeMenuPanel() {
    menuPanel.classList.remove('open');
    menuOverlay.classList.remove('active');
}

if(menuIcon) menuIcon.addEventListener('click', openMenu);
if(closeMenu) closeMenu.addEventListener('click', closeMenuPanel);
if(menuOverlay) menuOverlay.addEventListener('click', closeMenuPanel);

// ==================== مۆدالی گەڕان ====================
const searchIcon = document.getElementById('searchIcon');
const searchModal = document.getElementById('searchModal');
const closeSearch = document.getElementById('closeSearch');
const globalSearchInput = document.getElementById('globalSearchInput');
const searchResultsDiv = document.getElementById('searchResults');

function openSearchModal() {
    searchModal.classList.add('active');
    globalSearchInput.focus();
}
function closeSearchModal() {
    searchModal.classList.remove('active');
    searchResultsDiv.innerHTML = '';
    globalSearchInput.value = '';
}

if(searchIcon) searchIcon.addEventListener('click', openSearchModal);
if(closeSearch) closeSearch.addEventListener('click', closeSearchModal);

globalSearchInput.addEventListener('input', (e) => {
    const term = e.target.value.toLowerCase();
    if(term.length < 2) {
        searchResultsDiv.innerHTML = '';
        return;
    }
    const filtered = allContent.filter(item => 
        item.title.toLowerCase().includes(term) || 
        item.genre.toLowerCase().includes(term)
    );
    searchResultsDiv.innerHTML = '';
    filtered.slice(0,15).forEach(item => {
        const div = document.createElement('div');
        div.className = 'search-result-item';
        div.innerHTML = `${item.title} (${item.year}) - ${item.genre}`;
        div.addEventListener('click', () => {
            closeSearchModal();
            openVideoModal(item.embedLink, item.title);
        });
        searchResultsDiv.appendChild(div);
    });
});

// بینینی هەموو
document.querySelectorAll('.view-all').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const category = link.getAttribute('data-category');
        alert(`پەڕەی تەواوی ${category} لە وەشانی داهاتوودا کاردەکات`);
    });
});

// داخستنی مۆدالی ڤیدیۆ
const closeVideoBtn = document.getElementById('closeVideoModal');
if(closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideoModal);
document.getElementById('videoModal')?.addEventListener('click', (e) => {
    if(e.target === document.getElementById('videoModal')) closeVideoModal();
});

// ==================== Load ====================
buildSlider();
renderAllSections();
