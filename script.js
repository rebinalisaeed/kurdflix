// داتای فیلمەکان (بۆ نموونە، دواتر لە movies.json دەیخوێنیتەوە)
const moviesData = {
    slider1: [
        { id: 1, title: "فیلمی ئەفسانە", year: "2024", poster: "assets/poster1.jpg", videoUrl: "https://vidmoly.com/e/example1", type: "vidmoly" },
        { id: 2, title: "دژی ڕێگا", year: "2023", poster: "assets/poster2.jpg", videoUrl: "https://streamsb.com/e/example2", type: "streamsb" },
        { id: 3, title: "ڕۆژی دوایین", year: "2025", poster: "assets/poster3.jpg", videoUrl: "https://vidmoly.com/e/example3", type: "vidmoly" },
        { id: 4, title: "بەندیخانە", year: "2024", poster: "assets/poster4.jpg", videoUrl: "https://streamwish.com/e/example4", type: "streamwish" },
        { id: 5, title: "خەونی پڕۆ", year: "2023", poster: "assets/poster5.jpg", videoUrl: "https://vidmoly.com/e/example5", type: "vidmoly" }
    ],
    slider2: [
        { id: 6, title: "گەرمی دڵ", year: "2024", poster: "assets/poster6.jpg", videoUrl: "https://streamsb.com/e/example6", type: "streamsb" },
        { id: 7, title: "باڵندەکان", year: "2023", poster: "assets/poster7.jpg", videoUrl: "https://vidmoly.com/e/example7", type: "vidmoly" },
        { id: 8, title: "سەردەمی زێڕین", year: "2025", poster: "assets/poster8.jpg", videoUrl: "https://streamsb.com/e/example8", type: "streamsb" }
    ],
    slider3: [
        { id: 9, title: "قیزیل ئەلما", year: "2024", poster: "assets/poster9.jpg", videoUrl: "https://vidmoly.com/e/example9", type: "vidmoly" },
        { id: 10, title: "کوروگلو", year: "2023", poster: "assets/poster10.jpg", videoUrl: "https://streamsb.com/e/example10", type: "streamsb" }
    ]
};

// بارکردنی کارتەکان بۆ هەر سلایدێک
function loadMovies() {
    for (let sliderId in moviesData) {
        const sliderContainer = document.querySelector(`#${sliderId} .movies-slider`);
        if (!sliderContainer) continue;
        
        sliderContainer.innerHTML = "";
        moviesData[sliderId].forEach(movie => {
            const card = document.createElement("div");
            card.className = "movie-card";
            card.onclick = () => openPlayer(movie.videoUrl, movie.title);
            card.innerHTML = `
                <img src="${movie.poster}" alt="${movie.title}" class="movie-poster" onerror="this.src='https://via.placeholder.com/200x300?text=No+Poster'">
                <div class="movie-info">
                    <h3 class="movie-title">${movie.title}</h3>
                    <p class="movie-year">${movie.year}</p>
                </div>
            `;
            sliderContainer.appendChild(card);
        });
    }
}

// کردنەوەی پلەیر
function openPlayer(videoUrl, title) {
    let embedUrl = videoUrl;
    if (videoUrl.includes("vidmoly")) {
        embedUrl = videoUrl.replace("/e/", "/embed/");
    } else if (videoUrl.includes("streamsb")) {
        embedUrl = videoUrl.replace("/e/", "/embed-4/");
    } else if (videoUrl.includes("streamwish")) {
        embedUrl = videoUrl.replace("/e/", "/embed/");
    }
    
    const playerHTML = `
        <div id="playerModal" style="position:fixed; top:0; left:0; width:100%; height:100%; background:rgba(0,0,0,0.95); z-index:9999; display:flex; align-items:center; justify-content:center; flex-direction:column;">
            <div style="background:var(--bg-secondary); width:90%; max-width:1000px; border-radius:12px; overflow:hidden;">
                <div style="display:flex; justify-content:space-between; padding:1rem; border-bottom:1px solid var(--border);">
                    <h3>${title}</h3>
                    <button id="closePlayer" style="background:none; border:none; color:var(--text-primary); font-size:1.8rem; cursor:pointer;">&times;</button>
                </div>
                <div style="position:relative; padding-bottom:56.25%; height:0;">
                    <iframe src="${embedUrl}" frameborder="0" allowfullscreen style="position:absolute; top:0; left:0; width:100%; height:100%;"></iframe>
                </div>
            </div>
        </div>
    `;
    document.body.insertAdjacentHTML("beforeend", playerHTML);
    document.getElementById("closePlayer").onclick = () => {
        document.getElementById("playerModal").remove();
    };
}

// کارکردنی سلایدەکان (دوگمەی ڕاست و چەپ)
function initSliders() {
    const sliders = document.querySelectorAll('.slider-container');
    sliders.forEach(container => {
        const sliderId = container.id;
        const prevBtn = document.querySelector(`.prev-btn[data-slider="${sliderId}"]`);
        const nextBtn = document.querySelector(`.next-btn[data-slider="${sliderId}"]`);
        const slider = container.querySelector('.movies-slider');
        
        if (prevBtn && nextBtn && slider) {
            prevBtn.onclick = () => {
                slider.scrollBy({ left: -300, behavior: 'smooth' });
            };
            nextBtn.onclick = () => {
                slider.scrollBy({ left: 300, behavior: 'smooth' });
            };
        }
    });
}

// Dark/Light mode
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

// مینیوی هەمبەرگەر
function initHamburger() {
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.getElementById('nav-menu');
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
    // داخستنی مینیو کاتێک لینکێک کرتە دەکرێت
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
}

// کاتێک پەڕە بار بوو
document.addEventListener('DOMContentLoaded', () => {
    loadMovies();
    initSliders();
    initTheme();
    initHamburger();
});
