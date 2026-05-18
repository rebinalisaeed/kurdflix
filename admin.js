// ========== ناوی بەکارهێنەر و پاسیۆرد ==========
const ADMIN_USERNAME = "1234";
const ADMIN_PASSWORD = "1234";

// ========== لیستی چەشنەکان ==========
const GENRES_LIST = [
    "تاوانکاری", "زانستی خەیاڵی", "سەرکێشی", "ئاکشن", "کۆمیدی",
    "ئەنیمەیشن", "موزیکی", "بایۆگرافی", "دۆکیۆمێنتاری", "ڕۆژئاوایی",
    "وەرزشی", "سایکۆلۆژیی", "کۆمەڵایەتی", "دراما", "هەستبزوێن",
    "نهێنی ئامێز", "خەیاڵی", "خێزانی", "ڕۆمانسی", "مێژوویی",
    "ترسناک", "جەنگ", "پزیشکی", "کورتە", "تراژیدی"
];

// ========== داتاکان ==========
let currentData = { movies: [], carousel: [], siteData: { aboutText: "", copyrightText: "", itemsPerPage: 20 } };
let nextId = 100;
let editingMovieId = null;
let editingSlideId = null;

// ========== پشتڕاستکردنەوەی چوونەژوورەوە ==========
function checkAdminAuth() {
    const savedAuth = localStorage.getItem('admin_authenticated');
    const savedTime = localStorage.getItem('admin_auth_time');
    if (savedAuth === 'true' && savedTime && new Date().getTime() < parseInt(savedTime)) {
        document.getElementById('adminAuth').style.display = 'none';
        document.getElementById('adminContent').style.display = 'block';
        return true;
    }
    return false;
}

function initAdminAuth() {
    if (!checkAdminAuth()) {
        document.getElementById('adminAuth').style.display = 'flex';
        document.getElementById('adminContent').style.display = 'none';
        document.getElementById('authSubmitBtn').addEventListener('click', () => {
            const username = document.getElementById('adminUsername').value;
            const password = document.getElementById('adminPassword').value;
            if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
                const expiryTime = new Date().getTime() + (7 * 24 * 60 * 60 * 1000);
                localStorage.setItem('admin_authenticated', 'true');
                localStorage.setItem('admin_auth_time', expiryTime);
                location.reload();
            } else {
                const errorEl = document.getElementById('authError');
                errorEl.style.display = 'block';
                setTimeout(() => errorEl.style.display = 'none', 2000);
            }
        });
    }
}

// ========== بارکردنی داتاکان ==========
async function loadAdminData() {
    try {
        const response = await fetch('data.json?t=' + Date.now());
        const data = await response.json();
        currentData = data;
        if (!currentData.siteData) {
            currentData.siteData = { aboutText: "", copyrightText: "", itemsPerPage: 20 };
        }
        if (currentData.movies && currentData.movies.length > 0) {
            nextId = Math.max(...currentData.movies.map(m => m.id)) + 1;
        } else {
            currentData.movies = [];
        }
        if (!currentData.carousel) currentData.carousel = [];
        
        renderGenresCheckbox();
        renderMoviesList();
        renderSlidesList();
        updateSlideMovieSelect();
        renderStats();
        loadSiteDataToForm();
    } catch (error) {
        currentData = { movies: [], carousel: [], siteData: { aboutText: "", copyrightText: "", itemsPerPage: 20 } };
        renderGenresCheckbox();
        renderMoviesList();
        renderSlidesList();
        renderStats();
    }
}

function renderGenresCheckbox() {
    const container = document.getElementById('genresCheckbox');
    if (container) {
        container.innerHTML = GENRES_LIST.map(genre => `<label class="checkbox-item"><input type="checkbox" value="${genre}"> ${genre}</label>`).join('');
    }
}

function getSelectedGenres() {
    const selected = [];
    document.querySelectorAll('#genresCheckbox input[type="checkbox"]:checked').forEach(cb => selected.push(cb.value));
    return selected;
}

function setSelectedGenres(genres) {
    document.querySelectorAll('#genresCheckbox input[type="checkbox"]').forEach(cb => {
        cb.checked = genres && genres.includes(cb.value);
    });
}

function getSelectedCategories() {
    const selected = [];
    document.querySelectorAll('#categoriesCheckbox input[type="checkbox"]:checked').forEach(cb => selected.push(cb.value));
    return selected;
}

function setSelectedCategories(categories) {
    document.querySelectorAll('#categoriesCheckbox input[type="checkbox"]').forEach(cb => {
        cb.checked = categories && categories.includes(cb.value);
    });
}

// ========== زیادکردن و دەستکاری فیلم ==========
document.getElementById('addMovieForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const movieData = {
        title: document.getElementById('movieTitle').value,
        year: document.getElementById('movieYear').value,
        poster: document.getElementById('moviePoster').value || 'https://picsum.photos/200/300',
        type: document.getElementById('movieType').value,
        lang: document.getElementById('movieLang').value,
        videoUrl: document.getElementById('movieVideoUrl').value,
        description: document.getElementById('movieDescription').value || 'زانیاری زیادە بەم زووانە دەخرێتە ناو سایت',
        genres: getSelectedGenres(),
        categories: getSelectedCategories()
    };
    
    if (editingMovieId) {
        const index = currentData.movies.findIndex(m => m.id === editingMovieId);
        if (index !== -1) {
            currentData.movies[index] = { ...currentData.movies[index], ...movieData, id: editingMovieId };
            showMessage('بەرهەم بە سەرکەوتوویی دەستکاری کرا', 'success');
            editingMovieId = null;
            document.querySelector('#addMovieForm button[type="submit"]').innerHTML = '<i class="fas fa-plus"></i> زیادکردن';
        }
    } else {
        const newMovie = { id: nextId++, ...movieData };
        currentData.movies.push(newMovie);
        showMessage('فیلم/زنجیرە بە سەرکەوتوویی زیاد کرا', 'success');
    }
    
    document.getElementById('addMovieForm').reset();
    document.querySelectorAll('#genresCheckbox input').forEach(cb => cb.checked = false);
    document.querySelectorAll('#categoriesCheckbox input').forEach(cb => cb.checked = false);
    renderMoviesList();
    updateSlideMovieSelect();
    renderStats();
});

function editMovie(movie) {
    editingMovieId = movie.id;
    document.getElementById('movieTitle').value = movie.title;
    document.getElementById('movieYear').value = movie.year;
    document.getElementById('moviePoster').value = movie.poster || '';
    document.getElementById('movieType').value = movie.type;
    document.getElementById('movieLang').value = movie.lang || 'other';
    document.getElementById('movieVideoUrl').value = movie.videoUrl || '';
    document.getElementById('movieDescription').value = movie.description || '';
    setSelectedGenres(movie.genres);
    setSelectedCategories(movie.categories);
    document.querySelector('#addMovieForm button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> پاشەکەوتکردنی گۆڕانکارییەکان';
    document.getElementById('movies-tab').scrollIntoView({ behavior: 'smooth' });
}

function renderMoviesList() {
    const container = document.getElementById('moviesList');
    const searchTerm = document.getElementById('searchMovies')?.value.toLowerCase() || '';
    const filterType = document.getElementById('filterType')?.value || 'all';
    let filtered = (currentData.movies || []).filter(movie => {
        return movie.title.toLowerCase().includes(searchTerm) && (filterType === 'all' || movie.type === filterType);
    });
    if (filtered.length === 0) {
        container.innerHTML = '<p style="text-align:center;">هیچ فیلم/زنجیرەیەک نەدۆزرایەوە</p>';
        return;
    }
    container.innerHTML = '';
    filtered.forEach(movie => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div class="item-info">
                <div class="item-title">${escapeHtml(movie.title)}</div>
                <div class="item-meta">${movie.year} | ${movie.type === 'film' ? 'فیلم' : 'زنجیرە'} | ${movie.lang || '---'} | ID: ${movie.id}</div>
                <div class="item-meta">چەشنەکان: ${movie.genres?.join(', ') || '---'}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-warning edit-movie" data-id="${movie.id}"><i class="fas fa-edit"></i> دەستکاری</button>
                <button class="btn btn-danger delete-movie" data-id="${movie.id}"><i class="fas fa-trash"></i> سڕینەوە</button>
            </div>
        `;
        container.appendChild(div);
    });
    
    document.querySelectorAll('.delete-movie').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            if (confirm('دڵنیای لە سڕینەوەی ئەم فیلم/زنجیرەیە؟')) {
                currentData.movies = currentData.movies.filter(m => m.id !== id);
                currentData.carousel = currentData.carousel.filter(s => s.movieId !== id);
                renderMoviesList();
                renderSlidesList();
                updateSlideMovieSelect();
                renderStats();
                showMessage('فیلم/زنجیرە سڕایەوە', 'success');
            }
        });
    });
    document.querySelectorAll('.edit-movie').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const movie = currentData.movies.find(m => m.id === id);
            if (movie) editMovie(movie);
        });
    });
}

// ========== سلایدەکان ==========
document.getElementById('addSlideForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const slideData = {
        title: document.getElementById('slideTitle').value,
        year: document.getElementById('slideYear').value,
        description: document.getElementById('slideDescription').value,
        images: {
            mobile: document.getElementById('slideImageMobile').value,
            tablet: document.getElementById('slideImageTablet').value,
            desktop: document.getElementById('slideImageDesktop').value
        },
        movieId: parseInt(document.getElementById('slideMovieId').value)
    };
    
    if (editingSlideId) {
        const index = currentData.carousel.findIndex(s => s.id === editingSlideId);
        if (index !== -1) {
            currentData.carousel[index] = { ...currentData.carousel[index], ...slideData };
            showMessage('سلاید بە سەرکەوتوویی دەستکاری کرا', 'success');
            editingSlideId = null;
            document.querySelector('#addSlideForm button[type="submit"]').innerHTML = '<i class="fas fa-plus"></i> زیادکردنی سلاید';
        }
    } else {
        const newSlide = { id: Date.now(), ...slideData };
        currentData.carousel.push(newSlide);
        showMessage('سلاید بە سەرکەوتوویی زیاد کرا', 'success');
    }
    document.getElementById('addSlideForm').reset();
    renderSlidesList();
    renderStats();
});

function editSlide(slide) {
    editingSlideId = slide.id;
    document.getElementById('slideTitle').value = slide.title;
    document.getElementById('slideYear').value = slide.year || '';
    document.getElementById('slideDescription').value = slide.description || '';
    document.getElementById('slideImageMobile').value = slide.images?.mobile || '';
    document.getElementById('slideImageTablet').value = slide.images?.tablet || '';
    document.getElementById('slideImageDesktop').value = slide.images?.desktop || '';
    document.getElementById('slideMovieId').value = slide.movieId || '';
    document.querySelector('#addSlideForm button[type="submit"]').innerHTML = '<i class="fas fa-save"></i> پاشەکەوتکردنی گۆڕانکارییەکان';
    document.getElementById('carousel-tab').scrollIntoView({ behavior: 'smooth' });
}

function renderSlidesList() {
    const container = document.getElementById('slidesList');
    if (!container) return;
    if (currentData.carousel.length === 0) {
        container.innerHTML = '<p style="text-align:center;">هیچ سلایدێک نەدۆزرایەوە</p>';
        return;
    }
    container.innerHTML = '';
    currentData.carousel.forEach(slide => {
        const div = document.createElement('div');
        div.className = 'item-card';
        div.innerHTML = `
            <div class="item-info">
                <div class="item-title">${escapeHtml(slide.title)}</div>
                <div class="item-meta">${slide.year || ''} | ID فیلم: ${slide.movieId}</div>
                <div class="item-meta">وێنەکان: ${slide.images?.mobile ? '✓' : '✗'} | ${slide.images?.tablet ? '✓' : '✗'} | ${slide.images?.desktop ? '✓' : '✗'}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-warning edit-slide" data-id="${slide.id}"><i class="fas fa-edit"></i> دەستکاری</button>
                <button class="btn btn-danger delete-slide" data-id="${slide.id}"><i class="fas fa-trash"></i> سڕینەوە</button>
            </div>
        `;
        container.appendChild(div);
    });
    document.querySelectorAll('.delete-slide').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            if (confirm('دڵنیای لە سڕینەوەی ئەم سلایدە؟')) {
                currentData.carousel = currentData.carousel.filter(s => s.id !== id);
                renderSlidesList();
                renderStats();
                showMessage('سلاید سڕایەوە', 'success');
            }
        });
    });
    document.querySelectorAll('.edit-slide').forEach(btn => {
        btn.addEventListener('click', () => {
            const id = parseInt(btn.dataset.id);
            const slide = currentData.carousel.find(s => s.id === id);
            if (slide) editSlide(slide);
        });
    });
}

function updateSlideMovieSelect() {
    const select = document.getElementById('slideMovieId');
    if (!select) return;
    select.innerHTML = '<option value="">-- هەڵبژێرە --</option>';
    (currentData.movies || []).forEach(movie => {
        const option = document.createElement('option');
        option.value = movie.id;
        option.textContent = `${movie.title} (${movie.type === 'film' ? 'فیلم' : 'زنجیرە'})`;
        select.appendChild(option);
    });
}

// ========== داتای سایت ==========
function loadSiteDataToForm() {
    document.getElementById('aboutTextEdit').value = currentData.siteData?.aboutText || '';
    document.getElementById('copyrightTextEdit').value = currentData.siteData?.copyrightText || 'kurdflix.com 2026 ©';
    document.getElementById('itemsPerPage').value = currentData.siteData?.itemsPerPage || 20;
}

function saveSiteData() {
    if (!currentData.siteData) currentData.siteData = {};
    currentData.siteData.aboutText = document.getElementById('aboutTextEdit')?.value || '';
    currentData.siteData.copyrightText = document.getElementById('copyrightTextEdit')?.value || 'kurdflix.com 2026 ©';
    currentData.siteData.itemsPerPage = parseInt(document.getElementById('itemsPerPage')?.value) || 20;
}

// ========== پاشەکەوتکردن ==========
async function saveAllData() {
    saveSiteData();
    try {
        const response = await fetch('save_data.php', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(currentData) });
        if (response.ok) showMessage('هەموو گۆڕانکارییەکان بە سەرکەوتوویی پاشەکەوت کرا', 'success');
        else downloadData();
    } catch (error) { downloadData(); }
}

function downloadData() {
    const dataStr = JSON.stringify(currentData, null, 4);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'data.json';
    a.click();
    URL.revokeObjectURL(url);
    showMessage('داتاکە دابەزێنرا، تکایە بە دەست data.json لەگەڵ فایلەکانی تردا ڕێکبخەرەوە', 'success');
}

document.getElementById('importFile')?.addEventListener('change', (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
        try {
            const importedData = JSON.parse(event.target.result);
            currentData = importedData;
            renderMoviesList();
            renderSlidesList();
            updateSlideMovieSelect();
            renderStats();
            loadSiteDataToForm();
            showMessage('داتاکە بە سەرکەوتوویی هێنرایەوە', 'success');
        } catch (error) { showMessage('هەڵە لە خوێندنەوەی فایلەکە', 'error'); }
    };
    reader.readAsText(file);
});

function renderStats() {
    const container = document.getElementById('statsInfo');
    if (!container) return;
    const filmCount = (currentData.movies || []).filter(m => m.type === 'film').length;
    const seriesCount = (currentData.movies || []).filter(m => m.type === 'series').length;
    container.innerHTML = `
        <div class="form-row-3">
            <div style="background-color: var(--accent); padding: 1rem; border-radius: 8px; text-align: center;"><h3>${(currentData.movies || []).length}</h3><p>کۆی گشتی</p></div>
            <div style="background-color: var(--accent); padding: 1rem; border-radius: 8px; text-align: center;"><h3>${filmCount}</h3><p>فیلم</p></div>
            <div style="background-color: var(--accent); padding: 1rem; border-radius: 8px; text-align: center;"><h3>${seriesCount}</h3><p>زنجیرە</p></div>
            <div style="background-color: var(--accent); padding: 1rem; border-radius: 8px; text-align: center;"><h3>${currentData.carousel?.length || 0}</h3><p>سلاید</p></div>
        </div>
    `;
}

function showMessage(msg, type) {
    const div = document.createElement('div');
    div.className = type === 'success' ? 'success-msg' : 'error-msg';
    div.innerHTML = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/[&<>]/g, function(m) {
        if (m === '&') return '&amp;';
        if (m === '<') return '&lt;';
        if (m === '>') return '&gt;';
        return m;
    });
}

document.getElementById('searchMovies')?.addEventListener('input', () => renderMoviesList());
document.getElementById('filterType')?.addEventListener('change', () => renderMoviesList());

document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
        if (editingMovieId) cancelEdit();
        if (editingSlideId) cancelEditSlide();
    });
});

function cancelEdit() {
    editingMovieId = null;
    document.getElementById('addMovieForm').reset();
    document.querySelectorAll('#genresCheckbox input').forEach(cb => cb.checked = false);
    document.querySelector('#addMovieForm button[type="submit"]').innerHTML = '<i class="fas fa-plus"></i> زیادکردن';
}

function cancelEditSlide() {
    editingSlideId = null;
    document.getElementById('addSlideForm').reset();
    document.querySelector('#addSlideForm button[type="submit"]').innerHTML = '<i class="fas fa-plus"></i> زیادکردنی سلاید';
}

document.getElementById('saveAllBtn')?.addEventListener('click', saveAllData);
document.getElementById('exportDataBtn')?.addEventListener('click', downloadData);

initAdminAuth();
loadAdminData();
