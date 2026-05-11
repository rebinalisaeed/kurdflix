// داتای سلایدەر (پێویستە لە Admin--ەوە نوێ بکرێتەوە)
let sliderData = [
    {
        title: "پشووی بەهاری",
        desc: "کۆمیدیایەکی کوردی خۆش",
        bgImage: "https://via.placeholder.com/1920x500?text=Kurdflix+Slide+1",
        videoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        title: "خەونەکانی کوردستان",
        desc: "درامایەکی کۆمەڵایەتی",
        bgImage: "https://via.placeholder.com/1920x500?text=Kurdflix+Slide+2",
        videoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
];

// داتای فیلمەکان
let moviesData = [
    {
        id: 1,
        title: "فیلمی یەکەم",
        year: "2025",
        poster: "https://via.placeholder.com/300x450?text=Film+1",
        embedLink: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    },
    {
        id: 2,
        title: "فیلمی دووەم",
        year: "2024",
        poster: "https://via.placeholder.com/300x450?text=Film+2",
        embedLink: "https://www.youtube.com/embed/dQw4w9WgXcQ"
    }
];

// سلایدەر بنیات بنێ
let currentSlide = 0;
const sliderContainer = document.getElementById('sliderContainer');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('sliderDots');

function buildSlider() {
    sliderContainer.innerHTML = '';
    dotsContainer.innerHTML = '';
    sliderData.forEach((slide, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'slide';
        slideDiv.style.backgroundImage = `linear-gradient(0deg, rgba(0,0,0,0.6), rgba(0,0,0,0.3)), url('${slide.bgImage}')`;
        slideDiv.innerHTML = `
            <div class="slide-content">
                <h2 class="slide-title">${slide.title}</h2>
                <p class="slide-desc">${slide.desc}</p>
                <button class="watch-btn" data-video="${slide.videoLink}">بینەرە</button>
            </div>
        `;
        sliderContainer.appendChild(slideDiv);
        
        const dot = document.createElement('div');
        dot.className = 'dot';
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });
    updateDots();
    attachWatchButtons();
}

function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, i) => {
        if(i === currentSlide) dot.classList.add('active');
        else dot.classList.remove('active');
    });
    sliderContainer.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function goToSlide(index) {
    currentSlide = index;
    updateDots();
}

function nextSlide() {
    currentSlide = (currentSlide + 1) % sliderData.length;
    updateDots();
}

function prevSlide() {
    currentSlide = (currentSlide - 1 + sliderData.length) % sliderData.length;
    updateDots();
}

if(prevBtn && nextBtn) {
    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);
}

// فیلمەکان نمایش بکە
function renderMovies() {
    const grid = document.getElementById('moviesGrid');
    if(!grid) return;
    grid.innerHTML = '';
    moviesData.forEach(movie => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.innerHTML = `
            <img src="${movie.poster}" alt="${movie.title}" class="movie-poster">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <p class="movie-year">${movie.year}</p>
            </div>
        `;
        card.addEventListener('click', () => {
            openVideoModal(movie.embedLink, movie.title);
        });
        grid.appendChild(card);
    });
}

// Modal بۆ بینینی ڤیدیۆ
function openVideoModal(videoUrl, title) {
    const modal = document.createElement('div');
    modal.style.position = 'fixed';
    modal.style.top = '0';
    modal.style.left = '0';
    modal.style.width = '100%';
    modal.style.height = '100%';
    modal.style.backgroundColor = 'rgba(0,0,0,0.95)';
    modal.style.zIndex = '2000';
    modal.style.display = 'flex';
    modal.style.flexDirection = 'column';
    modal.style.justifyContent = 'center';
    modal.style.alignItems = 'center';
    modal.innerHTML = `
        <button style="position:absolute;top:20px;right:20px;background:#E50914;border:none;color:white;font-size:1.5rem;padding:0.5rem 1rem;cursor:pointer;border-radius:5px;">× داخستن</button>
        <h3 style="color:white;margin-bottom:1rem;">${title}</h3>
        <div style="width:90%;max-width:1000px;aspect-ratio:16/9;">
            <iframe src="${videoUrl}" style="width:100%;height:100%;border:none;" allowfullscreen></iframe>
        </div>
    `;
    modal.querySelector('button').addEventListener('click', () => modal.remove());
    document.body.appendChild(modal);
}

function attachWatchButtons() {
    document.querySelectorAll('.watch-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const video = btn.getAttribute('data-video');
            const title = btn.closest('.slide').querySelector('.slide-title').innerText;
            openVideoModal(video, title);
        });
    });
}

// مێنیووی مۆبایل
const mobileBtn = document.getElementById('mobileMenuBtn');
const nav = document.querySelector('.nav');
if(mobileBtn) {
    mobileBtn.addEventListener('click', () => {
        nav.classList.toggle('active');
    });
}

// گەڕان
const searchInput = document.getElementById('searchInput');
if(searchInput) {
    searchInput.addEventListener('input', (e) => {
        const term = e.target.value.toLowerCase();
        const filtered = moviesData.filter(m => m.title.toLowerCase().includes(term));
        const grid = document.getElementById('moviesGrid');
        if(grid) {
            grid.innerHTML = '';
            filtered.forEach(movie => {
                // هەمان کارتی سەرەوە زیاد بکە
                const card = document.createElement('div');
                card.className = 'movie-card';
                card.innerHTML = `<img src="${movie.poster}" class="movie-poster"><div class="movie-info"><h3>${movie.title}</h3><p>${movie.year}</p></div>`;
                card.addEventListener('click', () => openVideoModal(movie.embedLink, movie.title));
                grid.appendChild(card);
            });
        }
    });
}

// Load کردن
buildSlider();
renderMovies();
setInterval(nextSlide, 5000);
