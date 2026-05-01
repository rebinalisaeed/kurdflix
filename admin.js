// پێکهاتەی پۆلەکان
const categoriesConfig = {
    film: [
        { id: "kurdish-film", name: "فیلمی کوردی" },
        { id: "hollywood", name: "هۆلیوود" },
        { id: "bollywood", name: "بۆلیوود" },
        { id: "russian", name: "فیلمی روسی" },
        { id: "korean", name: "فیلمی کۆری" },
        { id: "persian", name: "فیلمی فارسی" },
        { id: "arabic", name: "فیلمی عەرەبی" },
        { id: "turkish-film", name: "فیلمی تورکی" },
        { id: "european", name: "فیلمی بیانی" }
    ],
    series: [
        { id: "kurdish-series", name: "زنجیرەی کوردی" },
        { id: "american-series", name: "زنجیرەی ئەمەریکی" },
        { id: "korean-series", name: "زنجیرەی کۆری" },
        { id: "indian-series", name: "زنجیرەی هیندی" },
        { id: "chinese-series", name: "زنجیرەی چینی" },
        { id: "turkish-series", name: "زنجیرەی تورکی" },
        { id: "persian-series", name: "زنجیرەی فارسی" },
        { id: "arabic-series", name: "زنجیرەی عەرەبی" },
        { id: "anime", name: "ئەنیمی و ئەنیمەیشن" },
        { id: "documentary", name: "دیکۆمێنتاری" }
    ]
};

let currentData = {
    movies: [],
    carousel: []
};

let nextId = 100;

// بارکردنی داتاکان لە data.json
async function loadAdminData() {
    try {
        const response = await fetch('data.json?t=' + Date.now());
        currentData = await response.json();
        
        // دیاریکردنی nextId
        if (currentData.movies.length > 0) {
            nextId = Math.max(...currentData.movies.map(m => m.id)) + 1;
        }
        
        // نمایش پۆلەکان لە فۆرمەکەدا
        renderCategoriesCheckbox();
        
        // نمایش لیستی فیلمەکان
        renderMoviesList();
        
        // نمایش لیستی سلایدەکان
        renderSlidesList();
        
        // پڕکردنەوەی سلاید بۆ هەڵبژاردنی movieId
        updateSlideMovieSelect();
        
        // نمایش ئامارەکان
        renderStats();
        
    } catch (error) {
        console.error("Error loading data:", error);
        currentData = { movies: [], carousel: [] };
        renderCategoriesCheckbox();
        renderMoviesList();
        renderSlidesList();
        renderStats();
    }
}

// نمایش چێکبۆکسەکانی پۆلەکان
function renderCategoriesCheckbox() {
    const container = document.getElementById('categoriesCheckbox');
    if (!container) return;
    
    container.innerHTML = '';
    
    // پۆلەکانی فیلم
    const filmDiv = document.createElement('div');
    filmDiv.innerHTML = '<strong><i class="fas fa-film"></i> پۆلەکانی فیلم:</strong><br>';
    categoriesConfig.film.forEach(cat => {
        filmDiv.innerHTML += `
            <label class="category-checkbox">
                <input type="checkbox" value="${cat.id}"> ${cat.name}
            </label>
        `;
    });
    container.appendChild(filmDiv);
    
    // پۆلەکانی زنجیرە
    const seriesDiv = document.createElement('div');
    seriesDiv.style.marginTop = '1rem';
    seriesDiv.innerHTML = '<strong><i class="fas fa-tv"></i> پۆلەکانی زنجیرە:</strong><br>';
    categoriesConfig.series.forEach(cat => {
        seriesDiv.innerHTML += `
            <label class="category-checkbox">
                <input type="checkbox" value="${cat.id}"> ${cat.name}
            </label>
        `;
    });
    container.appendChild(seriesDiv);
}

// کۆکردنەوەی پۆلە هەڵبژێردراوەکان
function getSelectedCategories() {
    const selected = [];
    document.querySelectorAll('#categoriesCheckbox input[type="checkbox"]:checked').forEach(cb => {
        selected.push(cb.value);
    });
    return selected;
}

// زیادکردنی فیلم/زنجیرەی نوێ
document.getElementById('addMovieForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const type = document.getElementById('movieType').value;
    const title = document.getElementById('movieTitle').value;
    const year = document.getElementById('movieYear').value;
    const poster = document.getElementById('moviePoster').value;
    const videoUrl = document.getElementById('movieVideoUrl').value;
    const trailerUrl = document.getElementById('movieTrailerUrl').value;
    const description = document.getElementById('movieDescription').value;
    const categories = getSelectedCategories();
    
    // زیادکردنی پۆلە سەرەکییەکان
    if (type === 'film') {
        categories.push('all-films');
    } else {
        categories.push('all-series');
    }
    
    const newMovie = {
        id: nextId++,
        title: title,
        year: year,
        poster: poster || 'https://via.placeholder.com/200x300?text=No+Poster',
        type: type,
        categories: categories,
        videoUrl: videoUrl,
        description: description || 'زانیاری زیادە بەم زووانە دەخرێتە ناو سایت',
        trailerUrl: trailerUrl || ''
    };
    
    currentData.movies.push(newMovie);
    
    // ریست کردنی فۆرم
    document.getElementById('addMovieForm').reset();
    document.querySelectorAll('#categoriesCheckbox input[type="checkbox"]').forEach(cb => cb.checked = false);
    
    renderMoviesList();
    updateSlideMovieSelect();
    renderStats();
    showMessage('فیلم/زنجیرە بە سەرکەوتوویی زیاد کرا', 'success');
});

// نمایش لیستی فیلمەکان
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
                <div class="item-meta">${movie.year} | ${movie.type === 'film' ? 'فیلم' : 'زنجیرە'} | ID: ${movie.id}</div>
                <div class="item-meta">پۆلەکان: ${movie.categories.join(', ')}</div>
            </div>
            <div class="item-actions">
                <button class="btn btn-danger delete-movie" data-id="${movie.id}"><i class="fas fa-trash"></i> سڕینەوە</button>
            </div>
        `;
        container.appendChild(div);
    });
    
    // ئیڤێنت بۆ دوگمەکانی سڕینەوە
    document.querySelectorAll('.delete-movie').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const id = parseInt(btn.dataset.id);
            if (confirm('دڵنیای لە سڕینەوەی ئەم فیلم/زنجیرەیە؟')) {
                currentData.movies = currentData.movies.filter(m => m.id !== id);
                // سڕینەوەی سلایدە پەیوەندیدارەکان
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

// زیادی سلاید
document.getElementById('addSlideForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('slideTitle').value;
    const category = document.getElementById('slideCategory').value;
    const poster = document.getElementById('slideImage').value;
    const movieId = parseInt(document.getElementById('slideMovieId').value);
    const description = document.getElementById('slideDescription').value;
    
    const newSlide = {
        id: Date.now(),
        title: title,
        category: category,
        description: description,
        poster: poster || 'https://via.placeholder.com/1200x500?text=Slide',
        movieId: movieId
    };
    
    currentData.carousel.push(newSlide);
    document.getElementById('addSlideForm').reset();
    renderSlidesList();
    renderStats();
    showMessage('سلاید بە سەرکەوتوویی زیاد کرا', 'success');
});

// نمایش لیستی سلایدەکان
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
                <div class="item-meta">${slide.category} | پەیوەندی بە فیلم ID: ${slide.movieId}</div>
                <div class="item-meta">${slide.description.substring(0, 100)}...</div>
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

// Update slide movie select
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

// پاشەکەوتکردنی هەموو داتاکان بۆ data.json
async function saveAllData() {
    try {
        const response = await fetch('save_data.php', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(currentData)
        });
        
        if (response.ok) {
            showMessage('هەموو گۆڕانکارییەکان بە سەرکەوتوویی پاشەکەوت کرا', 'success');
        } else {
            // ئەگەر PHP نەبوو، داتاکە داببەزێنە
            downloadData();
        }
    } catch (error) {
        // ئەگەر server-side save نەبوو، داتاکە وەک فایل داببەزێنە
        downloadData();
    }
}

// دابەزاندنی data.json
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

// هێنانی data.json لە فایل
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
            showMessage('داتاکە بە سەرکەوتوویی هێنرایەوە', 'success');
        } catch (error) {
            showMessage('هەڵە لە خوێندنەوەی فایلەکە', 'error');
        }
    };
    reader.readAsText(file);
});

// نمایش ئامارەکان
function renderStats() {
    const container = document.getElementById('statsInfo');
    if (!container) return;
    
    const filmCount = currentData.movies.filter(m => m.type === 'film').length;
    const seriesCount = currentData.movies.filter(m => m.type === 'series').length;
    const carouselCount = currentData.carousel.length;
    
    container.innerHTML = `
        <div class="form-row">
            <div style="background-color: var(--accent); padding: 1rem; border-radius: 8px; text-align: center;">
                <h3>${currentData.movies.length}</h3>
                <p>کۆی گشتی فیلم و زنجیرە</p>
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

// نمایش پەیام
function showMessage(msg, type) {
    const div = document.createElement('div');
    div.className = type === 'success' ? 'success-msg' : 'error-msg';
    div.innerHTML = msg;
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 3000);
}

// فیلتەر و گەڕان
document.getElementById('searchMovies')?.addEventListener('input', () => renderMoviesList());
document.getElementById('filterType')?.addEventListener('change', () => renderMoviesList());

// تابات
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.tab).classList.add('active');
    });
});

// Save button
document.getElementById('saveAllBtn')?.addEventListener('click', saveAllData);

// Export button
document.getElementById('exportDataBtn')?.addEventListener('click', downloadData);

// Theme
function initAdminTheme() {
    const themeSwitch = document.getElementById('theme-switch');
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        document.body.setAttribute('data-theme', 'light');
        themeSwitch.checked = true;
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

// Load
loadAdminData();
initAdminTheme();
