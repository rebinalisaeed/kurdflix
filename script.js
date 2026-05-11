// ==================== داتا ====================
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
        dateAdded: new Date().toISOString().split('T')[0],
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
        dateAdded: new Date().toISOString().split('T')[0],
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
        dateAdded: new Date().toISOString().split('T')[0],
        isSeries: true
    }
];

let sliderItems = JSON.parse(localStorage.getItem('kurdflix_slider')) || [
    {
        title: "ئاگرەکانی باکوور",
        genre: "دراما",
        year: "2025",
        description: "چیرۆکی خێزانێکی کوردی لە کاتی قەیراندا",
        bgImage: "https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=1920&h=800",
        videoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        title: "Diriliş Ertuğrul",
        genre: "مێژوویی",
        year: "2020",
        description: "درامایەکی مێژوویی تورکی",
        bgImage: "https://images.unsplash.com/photo-1500462918059-b1a0cb512f1d?w=1920&h=800",
        videoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
];

// ==================== فەنکشنە یارمەتیدەرەکان ====================
function saveToLocal() {
    localStorage.setItem('kurdflix_content', JSON.stringify(allContent));
    localStorage.setItem('kurdflix_slider', JSON.stringify(sliderItems));
}

function openVideoModal(url, title) {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoIframe');
    const titleEl = document.getElementById('videoTitle');
    if(!modal || !iframe || !titleEl) return;
    iframe.src = url;
    titleEl.innerText = title;
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeVideoModal() {
    const modal = document.getElementById('videoModal');
    const iframe = document.getElementById('videoIframe');
    if(!modal || !iframe) return;
    iframe.src = '';
    modal.classList.remove('active');
    document.body.style.overflow = '';
}

function createMovieCard(item) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.innerHTML = `
        <img src="${item.poster}" alt="${item.title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/300x450?text=No+Image'">
        <div class="movie-info">
            <h3 class="movie-title">${item.title.substring(0, 30)}</h3>
            <p class="movie-year">${item.year}</p>
        </div>
    `;
    card.addEventListener('click', () => openVideoModal(item.embedLink, item.title));
    return card;
}

function filterByType(items, type) {
    return items.filter(i => i.type === type);
}

function filterByLanguage(items, lang) {
    return items.filter(i => i.language === lang);
}

function sortByDate(items) {
    return [...items].sort((a, b) => new Date(b.dateAdded) - new Date(a.dateAdded));
}

// ==================== ڕێندرکردنی تۆڕەکان ====================
function renderGrid(elementId, items) {
    const grid = document.getElementById(elementId);
    if(!grid) return;
    grid.innerHTML = '';
    const itemsToShow = items.slice(0, 20);
    if(itemsToShow.length === 0) {
        grid.innerHTML = '<div style="text-align:center; padding:2rem; color:#666;">هیچ بەرهەمێک نییە</div>';
        return;
    }
    itemsToShow.forEach(item => {
        grid.appendChild(createMovieCard(item));
    });
}

function renderAllSections() {
    const sorted = sortByDate(allContent);
    const films = filterByType(sorted, 'film');
    const series = filterByType(sorted, 'series');
    
    renderGrid('latestAllGrid', sorted);
    renderGrid('latestMoviesGrid', films);
    renderGrid('latestSeriesGrid', series);
    renderGrid('kurdishGrid', filterByLanguage(sorted, 'kurdish'));
    renderGrid('turkishGrid', filterByLanguage(sorted, 'turkish'));
    renderGrid('arabicGrid', filterByLanguage(sorted, 'arabic'));
    renderGrid('persianGrid', filterByLanguage(sorted, 'persian'));
    renderGrid('koreanGrid', filterByLanguage(sorted, 'korean'));
    renderGrid('indianGrid', filterByLanguage(sorted, 'indian'));
    renderGrid('kidsGrid', filterByLanguage(sorted, 'kids'));
}

// ==================== سلایدەر ====================
let currentSlide = 0;
let autoInterval;
const sliderContainer = document.getElementById('sliderContainer');
const dotsContainer = document.getElementById('sliderDots');

function buildSlider() {
    if(!sliderContainer || !dotsContainer) {
        console.log("sliderContainer یان dotsContainer نەدۆزرایەوە");
        return;
    }
    
    sliderContainer.innerHTML = '';
    dotsContainer.innerHTML = '';
    
    if(!sliderItems || sliderItems.length === 0) {
        sliderContainer.innerHTML = '<div class="slide" style="background:#333; display:flex; align-items:center; justify-content:center;"><div class="slide-content"><h2>هیچ سلایدێک نییە</h2></div></div>';
        return;
    }
    
    sliderItems.forEach((slide, idx) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide';
        
        // چارەسەری وێنە
        let bgImageUrl = slide.bgImage;
        if(!bgImageUrl || bgImageUrl === "") {
            bgImageUrl = "https://via.placeholder.com/1920x800?text=No+Image";
        }
        
        slideDiv.style.backgroundImage = `url('${bgImageUrl}')`;
        slideDiv.style.backgroundSize = "cover";
        slideDiv.style.backgroundPosition = "center 30%";
        slideDiv.style.backgroundRepeat = "no-repeat";
        
        slideDiv.innerHTML = `
            <div class="slide-content">
                <div class="slide-genre">${slide.genre || "دراما"}</div>
                <div class="slide-year">${slide.year || "2025"}</div>
                <h2 class="slide-title">${slide.title || "بێ ناونیشان"}</h2>
                <p class="slide-desc">${slide.description || "زانیاری نییە"}</p>
                <div class="slide-buttons">
                    <button class="watch-btn" data-video="${slide.videoLink || ""}" data-title="${slide.title || ""}">▶ سەیر کردن</button>
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
    const watchBtns = document.querySelectorAll('.slide .watch-btn');
    watchBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const video = btn.getAttribute('data-video');
            const title = btn.getAttribute('data-title');
            if(video && video !== "") {
                openVideoModal(video, title);
            } else {
                alert("لینکی ڤیدیۆ بۆ ئەم سلایدە دیاری نەکراوە");
            }
        });
    });
    
    const watchlistBtns = document.querySelectorAll('.slide .watchlist-btn');
    watchlistBtns.forEach(btn => {
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
    if(index >= 0 && index < sliderItems.length) {
        currentSlide = index;
        updateSliderDots();
    }
}

function nextSlide() {
    if(sliderItems.length === 0) return;
    currentSlide = (currentSlide + 1) % sliderItems.length;
    updateSliderDots();
}

function startAutoSlide() {
    if(autoInterval) clearInterval(autoInterval);
    autoInterval = setInterval(nextSlide, 6000);
}

// ==================== سوایپ بە پەنجە بۆ سلایدەر ====================
let touchStartX = 0;
let touchEndX = 0;

function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
}

function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchEndX - touchStartX;
    if(Math.abs(diff) > 50) {
        if(diff > 0) {
            // swipe right -> previous slide
            currentSlide = (currentSlide - 1 + sliderItems.length) % sliderItems.length;
        } else {
            // swipe left -> next slide
            currentSlide = (currentSlide + 1) % sliderItems.length;
        }
        updateSliderDots();
    }
}

if(sliderContainer) {
    sliderContainer.addEventListener('touchstart', handleTouchStart);
    sliderContainer.addEventListener('touchend', handleTouchEnd);
}

// ==================== هێدەری گۆڕاو ====================
window.addEventListener('scroll', () => {
    const header = document.getElementById('mainHeader');
    if(!header) return;
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
    if(menuPanel) menuPanel.classList.add('open');
    if(menuOverlay) menuOverlay.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeMenuPanel() {
    if(menuPanel) menuPanel.classList.remove('open');
    if(menuOverlay) menuOverlay.classList.remove('active');
    document.body.style.overflow = '';
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
    if(searchModal) {
        searchModal.classList.add('active');
        if(globalSearchInput) globalSearchInput.focus();
        document.body.style.overflow = 'hidden';
    }
}

function closeSearchModal() {
    if(searchModal) searchModal.classList.remove('active');
    if(searchResultsDiv) searchResultsDiv.innerHTML = '';
    if(globalSearchInput) globalSearchInput.value = '';
    document.body.style.overflow = '';
}

if(searchIcon) searchIcon.addEventListener('click', openSearchModal);
if(closeSearch) closeSearch.addEventListener('click', closeSearchModal);

if(globalSearchInput) {
    globalSearchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        if(term.length < 2) {
            if(searchResultsDiv) searchResultsDiv.innerHTML = '';
            return;
        }
        const filtered = allContent.filter(item => 
            item.title.toLowerCase().includes(term) || 
            item.genre.toLowerCase().includes(term)
        );
        if(searchResultsDiv) {
            searchResultsDiv.innerHTML = '';
            filtered.slice(0, 15).forEach(item => {
                const div = document.createElement('div');
                div.className = 'search-result-item';
                div.innerHTML = `${item.title} (${item.year}) - ${item.genre}`;
                div.addEventListener('click', () => {
                    closeSearchModal();
                    openVideoModal(item.embedLink, item.title);
                });
                searchResultsDiv.appendChild(div);
            });
        }
    });
}

// ==================== بینینی هەموو ====================
document.querySelectorAll('.view-all').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const href = link.getAttribute('href');
        if(href && href !== "#") {
            window.location.href = href;
        }
    });
});

// ==================== داخستنی مۆدالی ڤیدیۆ ====================
const closeVideoBtn = document.getElementById('closeVideoModal');
if(closeVideoBtn) closeVideoBtn.addEventListener('click', closeVideoModal);

const videoModal = document.getElementById('videoModal');
if(videoModal) {
    videoModal.addEventListener('click', (e) => {
        if(e.target === videoModal) closeVideoModal();
    });
}

// ==================== دەستپێکردن ====================
function init() {
    buildSlider();
    renderAllSections();
}

// چاوەڕوانی DOM تا تەواو باربێت
if(document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
} else {
    init();
}
