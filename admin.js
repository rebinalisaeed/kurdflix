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
        if (currentData.movies.length > 0) {
            nextId = Math.max(...currentData.movies.map(m => m.id)) + 1;
        }
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

// ========== چەشنەکان ==========
function renderGenresCheckbox() {
    const container = document.getElementById('genresCheckbox');
    if (!container) return;
    container.innerHTML = GENRES_LIST.map(genre => `
        <label class="checkbox-item"><input type="checkbox" value="${genre}"> ${genre}</label>
    `).join('');
    
    // بۆ سلایدەکان
    const slideGenresSelect = document.getElementById('slideGenres');
    if (slideGenresSelect) {
        slideGenresSelect.innerHTML = GENRES_LIST.map(genre => `<option value="${genre}">${genre}</option>`).join('');
    }
}

function getSelectedGenres() {
    const selected = [];
    document.querySelectorAll('#genresCheckbox input[type="checkbox"]:checked').forEach(cb => {
        selected.push(cb.value);
    });
    return selected;
}

function getSelectedCategories() {
    const selected = [];
    document.querySelectorAll('#categoriesCheckbox input[type="checkbox"]:checked').forEach(cb => {
        selected.push(cb.value);
    });
    return selected;
}

// ========== زیادکردنی فیلم ==========
document.getElementById('addMovieForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const newMovie = {
        id: nextId++,
        title: document.getElementById('movieTitle').value,
        year: document.getElementById('movieYear').value,
        poster: document.getElementById('moviePoster').value || 'https://picsum.photos/200/300',
        type: document.getElementById('movieType').value,
        lang: document.getElementById('movieLang').value,
        videoUrl: document.getElementById('movieVideoUrl').value,
        trailerUrl: document.getElementById('movieTrailerUrl').value,
        description: document.getElementById('movieDescription').value || 'زانیاری زیادە بەم زووانە دەخرێتە ناو سایت',
        genres: getSelectedGenres(),
        categories: getSelectedCategories()
    };
    
    currentData.movies.push(newMovie);
    document.getElementById('addMovieForm').reset();
    document.querySelectorAll('#genresCheckbox input').forEach(cb => cb.checked = false);
    document.querySelectorAll('#categoriesCheckbox input').forEach(cb => cb.checked = false);
    
    renderMoviesList();
    updateSlideMovieSelect();
    renderStats();
    showMessage('فیلم/زنجیرە بە سەرکەوتوویی زیاد کرا', 'success');
});

function renderMoviesList() {
    const container = document.getElementById('moviesList');
    const searchTerm = document.getElementById('searchMovies')?.value.toLowerCase() || '';
    const filterType = document.getElementById('filterType')?.value || 'all';
    
    let filtered = currentData.movies.filter(movie => {
        const matchSearch = movie.title.toLowerCase().includes(searchTerm);
        const matchType = filterType === 'all' || movie.type === filterType;
        return matchSearch && matchType;
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
                <div class="item-title">${movie.title}</div>
                <div class="item-meta">${movie.year} | ${movie.type === 'film' ? 'فیلم' : 'زنجیرە'} | ${movie.lang} | ID: ${movie.id}</div>
                <div class="item-meta">چەشنەکان: ${movie.genres?.join(', ') || '---'}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger delete-movie" data-id="${movie.id}"><i class="fas fa-trash"></i> سڕینەوە</button>
            </div>
        `;
        container.appendChild(div);
    });
    
    document.querySelectorAll('.delete-movie').forEach(btn => {
        btn.addEventListener('click', (e) => {
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
}

// ========== سلایدەکان ==========
document.getElementById('addSlideForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const slideGenresSelect = document.getElementById('slideGenres');
    const selectedGenres = slideGenresSelect ? Array.from(slideGenresSelect.selectedOptions).map(opt => opt.value) : [];
    
    const newSlide = {
        id: Date.now(),
        title: document.getElementById('slideTitle').value,
        category: document.getElementById('slideCategory').value,
        year: document.getElementById('slideYear').value,
        description: document.getElementById('slideDescription').value,
        poster: document.getElementById('slideImage').value || 'https://picsum.photos/1080/1920',
        movieId: parseInt(document.getElementById('slideMovieId').value),
        genres: selectedGenres
    };
    
    currentData.carousel.push(newSlide);
    document.getElementById('addSlideForm').reset();
    renderSlidesList();
    renderStats();
    showMessage('سلاید بە سەرکەوتوویی زیاد کرا', 'success');
});

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
                <div class="item-title">${slide.title}</div>
                <div class="item-meta">${slide.category} | ${slide.year || ''} | پەیوەندی بە فیلم ID: ${slide.movieId}</div>
                <div class="item-meta">چەشنەکان: ${slide.genres?.join(', ') || '---'}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger delete-slide" data-id="${slide.id}"><i class="fas fa-trash"></i> سڕینەوە</button>
            </div>
        `;
        container.appendChild(div);
    });
    
    document.querySelectorAll('.delete-slide').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            if (confirm('دڵنیای لە سڕینەوەی ئەم سلایدە؟')) {
                currentData.carousel = currentData.carousel.filter(s => s.id !== id);
                renderSlidesList();
                renderStats();
                showMessage('سلاید سڕایەوە', 'success');
            }
        });
    });
}

function updateSlideMovieSelect() {
    const select = document.getElementById('slideMovieId');
    if (!select) return;
    select.innerHTML = '<option value="">-- هەڵبژێرە --</option>';
    currentData.movies.forEach(movie => {
        const option = document.createElement('option');
        option.value = movie.id;
        option.textContent = `${movie.title} (${movie.type === 'film' ? 'فیلم' : 'زنجیرە'})`;
        select.appendChild(option);
    });
}

// ========== داتای سایت (فووتەر) ==========
function loadSiteDataToForm() {
    const aboutTextarea = document.getElementById('aboutTextEdit');
    const copyrightInput = document.getElementById('copyrightTextEdit');
    const itemsPerPageInput = document.getElementById('itemsPerPage');
    
    if (aboutTextarea) aboutTextarea.value = currentData.siteData?.aboutText || '';
    if (copyrightInput) copyrightInput.value = currentData.siteData?.copyrightText || 'kurdflix.com 2026 ©';
    if (itemsPerPageInput) itemsPerPageInput.value = currentData.siteData?.itemsPerPage || 20;
}

function saveSiteData() {
    const aboutTextarea = document.getElementById('aboutTextEdit');
    const copyrightInput = document.getElementById('copyrightTextEdit');
    const itemsPerPageInput = document.getElementById('itemsPerPage');
    
    if (!currentData.siteData) currentData.siteData = {};
    currentData.siteData.aboutText = aboutTextarea?.value || '';
    currentData.siteData.copyrightText = copyrightInput?.value || 'kurdflix.com 2026 ©';
    currentData.siteData.itemsPerPage = parseInt(itemsPerPageInput?.value) || 20;
}

// ========== پاشەکەوتکردن ==========
async function saveAllData() {
    saveSiteData();
    
    try {
        const response = await fetch('save_data.php', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(currentData)
        });
        if (response.ok) {
            showMessage('هەموو گۆڕانکارییەکان بە سەرکەوتوویی پاشەکەوت کرا', 'success');
        } else {
            downloadData();
        }
    } catch (error) {
        downloadData();
    }
}

function downloadData() {
    const dataStr = JSON.stringify(currentData, null, 4);
    const blob = new Blob([dataStr], {type: 'application/json'});
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
        } catch (error) {
            showMessage('هەڵە لە خوێندنەوەی فایلەکە', 'error');
        }
    };
    reader.readAsText(file);
});

function renderStats() {
    const container = document.getElementById('statsInfo');
    if (!container) return;
    const filmCount = currentData.movies.filter(m => m.type === 'film').length;
    const seriesCount = currentData.movies.filter(m => m.type === 'series').length;
    const carouselCount = currentData.carousel.length;
    container.innerHTML = `
        <div class="form-row-3">
            <div style="background-color: var(--accent); padding: 1rem; border-radius: 8px; text-align: center;">
                <h3>${currentData.movies.length}</h3>
                <p>کۆی گشتی</p>
            </div>
            <div style="background-color: var(--accent); padding: 1rem; border-radius: 8px; text-align: center;">
                <h3>${filmCount}</h3>
                <p>فیلم</p>
            </div>
            <div style="background-color: var(--accent); padding: 1rem; border-radius: 8px; text-align: center;">
                <h3>${seriesCount}</h3>
                <p>زنجیرە</p>
            </div>
            <div style="background-color: var(--accent); padding: 1rem; border-radius: 8px; text-align: center;">
                <h3>${carouselCount}</h3>
                <p>سلاید</p>
            </div>
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

// ========== فیلتەر ==========
document.getElementById('searchMovies')?.addEventListener('input', () => renderMoviesList());
document.getElementById('filterType')?.addEventListener('change', () => renderMoviesList());

// ========== تابات ==========
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// ========== دوگمەکان ==========
document.getElementById('saveAllBtn')?.addEventListener('click', saveAllData);
document.getElementById('exportDataBtn')?.addEventListener('click', downloadData);

// ========== Theme ==========
function initAdminTheme() {
    const themeSwitch = document.getElementById('theme-switch');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        if (themeSwitch) themeSwitch.checked = true;
    }
    themeSwitch?.addEventListener('change', (e) => {
        if (e.target.checked) {
            document.body.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            document.body.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
        }
    });
}

// ========== Initialize ==========
initAdminAuth();
loadAdminData();
initAdminTheme();
