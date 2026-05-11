// loading default data
let movies = JSON.parse(localStorage.getItem('kurdflix_movies')) || [
    {id:1, title:"فیلمی یەکەم", year:"2025", poster:"https://via.placeholder.com/300x450", embedLink:"https://www.youtube.com/embed/dQw4w9WgXcQ"},
    {id:2, title:"فیلمی دووەم", year:"2024", poster:"https://via.placeholder.com/300x450", embedLink:"https://www.youtube.com/embed/dQw4w9WgXcQ"}
];
let slides = JSON.parse(localStorage.getItem('kurdflix_slides')) || [
    {title:"پشووی بەهاری", desc:"کۆمیدیایەکی کوردی", bgImage:"https://via.placeholder.com/1920x500", videoLink:"https://www.youtube.com/embed/dQw4w9WgXcQ"},
    {title:"خەونەکانی کوردستان", desc:"درامای کۆمەڵایەتی", bgImage:"https://via.placeholder.com/1920x500", videoLink:"https://www.youtube.com/embed/dQw4w9WgXcQ"}
];

function saveMovies() {
    localStorage.setItem('kurdflix_movies', JSON.stringify(movies));
    renderMoviesList();
    syncToMainPage();
}
function saveSlides() {
    localStorage.setItem('kurdflix_slides', JSON.stringify(slides));
    renderSlidesList();
    syncToMainPage();
}

function renderMoviesList() {
    const container = document.getElementById('moviesList');
    if(!container) return;
    container.innerHTML = '';
    movies.forEach(m => {
        const div = document.createElement('div');
        div.className = 'admin-item';
        div.innerHTML = `
            <strong>${m.title}</strong> (${m.year})
            <button onclick="editMovie(${m.id})">دەستکاری</button>
            <button onclick="deleteMovie(${m.id})">سڕینەوە</button>
        `;
        container.appendChild(div);
    });
}

function renderSlidesList() {
    const container = document.getElementById('sliderList');
    if(!container) return;
    container.innerHTML = '';
    slides.forEach((s, idx) => {
        const div = document.createElement('div');
        div.className = 'admin-item';
        div.innerHTML = `
            <strong>${s.title}</strong> - ${s.desc}
            <button onclick="editSlide(${idx})">دەستکاری</button>
            <button onclick="deleteSlide(${idx})">سڕینەوە</button>
        `;
        container.appendChild(div);
    });
}

window.editMovie = function(id) {
    const movie = movies.find(m => m.id === id);
    if(movie) {
        document.getElementById('movieId').value = movie.id;
        document.getElementById('movieTitle').value = movie.title;
        document.getElementById('movieYear').value = movie.year;
        document.getElementById('moviePoster').value = movie.poster;
        document.getElementById('movieEmbed').value = movie.embedLink;
    }
}
window.deleteMovie = function(id) {
    movies = movies.filter(m => m.id !== id);
    saveMovies();
}
window.editSlide = function(idx) {
    const slide = slides[idx];
    document.getElementById('sliderIndex').value = idx;
    document.getElementById('sliderTitle').value = slide.title;
    document.getElementById('sliderDesc').value = slide.desc;
    document.getElementById('sliderImage').value = slide.bgImage;
    document.getElementById('sliderVideo').value = slide.videoLink;
}
window.deleteSlide = function(idx) {
    slides.splice(idx, 1);
    saveSlides();
}

document.getElementById('movieForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const id = document.getElementById('movieId').value;
    if(id) {
        const index = movies.findIndex(m => m.id == id);
        if(index !== -1) {
            movies[index] = {
                id: parseInt(id),
                title: document.getElementById('movieTitle').value,
                year: document.getElementById('movieYear').value,
                poster: document.getElementById('moviePoster').value,
                embedLink: document.getElementById('movieEmbed').value
            };
        }
    } else {
        movies.push({
            id: Date.now(),
            title: document.getElementById('movieTitle').value,
            year: document.getElementById('movieYear').value,
            poster: document.getElementById('moviePoster').value,
            embedLink: document.getElementById('movieEmbed').value
        });
    }
    document.getElementById('movieId').value = '';
    this.reset();
    saveMovies();
});

document.getElementById('sliderForm')?.addEventListener('submit', function(e) {
    e.preventDefault();
    const idx = document.getElementById('sliderIndex').value;
    const newSlide = {
        title: document.getElementById('sliderTitle').value,
        desc: document.getElementById('sliderDesc').value,
        bgImage: document.getElementById('sliderImage').value,
        videoLink: document.getElementById('sliderVideo').value
    };
    if(idx !== '') {
        slides[parseInt(idx)] = newSlide;
    } else {
        slides.push(newSlide);
    }
    document.getElementById('sliderIndex').value = '';
    this.reset();
    saveSlides();
});

function syncToMainPage() {
    // ئەمە بۆ پەڕەی سەرەکی دەنووسرێت
    console.log('Sync: movies & slides updated in LocalStorage');
}

// tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.getElementById(`${btn.dataset.tab}Tab`).classList.add('active');
    });
});

renderMoviesList();
renderSlidesList();
