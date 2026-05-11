// بارکردنی داتاکان لە JSON یان LocalStorage
let adminMovies = [];

function loadAdminMovies() {
    const stored = localStorage.getItem('kurdflix_movies');
    if(stored) {
        adminMovies = JSON.parse(stored);
    } else {
        // هەوڵبدە لە JSON-file بخوێنە
        fetch('../data/movies.json')
            .then(res => res.json())
            .then(data => {
                adminMovies = data;
                localStorage.setItem('kurdflix_movies', JSON.stringify(adminMovies));
                renderMovieList();
            })
            .catch(() => {
                adminMovies = [];
                renderMovieList();
            });
        return;
    }
    renderMovieList();
}

// نیشاندانی لیستی بەرهەمەکان لە ئەدمین پەنێلدا
function renderMovieList() {
    const listDiv = document.getElementById('movieListAdmin');
    if(!listDiv) return;
    
    if(adminMovies.length === 0) {
        listDiv.innerHTML = '<p>هیچ بەرهەمێک دانەنراوە</p>';
        return;
    }
    
    listDiv.innerHTML = `
        <h3>📋 لیستی بەرهەمەکان (${adminMovies.length})</h3>
        <div style="display:grid; gap:10px; margin-top:15px;">
            ${adminMovies.map((movie, index) => `
                <div style="background:#2a2a2a; padding:12px; border-radius:8px; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <strong>${movie.title}</strong> - ${movie.category} (${movie.year})
                        <br><small>${movie.desc?.substring(0, 50)}...</small>
                    </div>
                    <div>
                        <button onclick="editMovie(${movie.id})" style="background:#ffc107; margin-left:5px;">✏️</button>
                        <button onclick="deleteMovie(${movie.id})" style="background:#dc3545;">🗑️</button>
                    </div>
                </div>
            `).join('')}
        </div>
    `;
}

// زیادکردنی بەرهەمی نوێ
function addMovie(event) {
    event.preventDefault();
    
    const newMovie = {
        id: Date.now(),
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        genre: document.getElementById('genre')?.value || 'دراما',
        year: document.getElementById('year').value,
        desc: document.getElementById('desc').value,
        poster: document.getElementById('poster').value,
        videoLink: document.getElementById('videoLink').value,
        type: document.getElementById('type')?.value || 'movie'
    };
    
    // ڕاستکردنەوەی داتا
    if(!newMovie.title || !newMovie.poster) {
        alert('تکایە ناونیشان و پۆستەر پڕ بکەرەوە');
        return;
    }
    
    adminMovies.unshift(newMovie);
    localStorage.setItem('kurdflix_movies', JSON.stringify(adminMovies));
    
    // ڕستکردنەوەی فۆڕم
    document.getElementById('adminForm').reset();
    renderMovieList();
    alert(`✅ "${newMovie.title}" بە سەرکەوتوویی زیاد کرا!`);
}

// سڕینەوەی بەرهەم
window.deleteMovie = function(id) {
    if(confirm('دڵنیایت لە سڕینەوەی ئەم بەرهەمە؟')) {
        adminMovies = adminMovies.filter(m => m.id !== id);
        localStorage.setItem('kurdflix_movies', JSON.stringify(adminMovies));
        renderMovieList();
        alert('بەرهەمەکە سڕایەوە');
    }
};

// دەستکاریکردنی بەرهەم
window.editMovie = function(id) {
    const movie = adminMovies.find(m => m.id === id);
    if(!movie) return;
    
    const newTitle = prompt('ناوی نوێ:', movie.title);
    if(newTitle) movie.title = newTitle;
    
    const newPoster = prompt('لینکی پۆستەری نوێ:', movie.poster);
    if(newPoster) movie.poster = newPoster;
    
    localStorage.setItem('kurdflix_movies', JSON.stringify(adminMovies));
    renderMovieList();
    alert('بەرهەمەکە نوێ کرایەوە');
};

// کردنەوەی دەرچوون (Export) بە JSON
function exportToJSON() {
    const dataStr = JSON.stringify(adminMovies, null, 2);
    const blob = new Blob([dataStr], {type: 'application/json'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'kurdflix_backup.json';
    a.click();
    URL.revokeObjectURL(url);
}

// هاوردەکردنی JSON بۆ پشتیوانی
function importFromJSON(event) {
    const file = event.target.files[0];
    if(!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const imported = JSON.parse(e.target.result);
            if(Array.isArray(imported)) {
                adminMovies = imported;
                localStorage.setItem('kurdflix_movies', JSON.stringify(adminMovies));
                renderMovieList();
                alert('داتاکان بە سەرکەوتوویی هاوردە کرا!');
            } else {
                alert('فایلەکە JSONی دروست نییە');
            }
        } catch(err) {
            alert('هەڵە لە خوێندنەوەی فایلەکەدا');
        }
    };
    reader.readAsText(file);
}

// ڕووداوەکان دوای بارکردنی پەڕە
document.addEventListener('DOMContentLoaded', () => {
    loadAdminMovies();
    
    const form = document.getElementById('adminForm');
    if(form) form.addEventListener('submit', addMovie);
    
    const exportBtn = document.getElementById('exportBtn');
    if(exportBtn) exportBtn.addEventListener('click', exportToJSON);
    
    const importInput = document.getElementById('importInput');
    if(importInput) importInput.addEventListener('change', importFromJSON);
});
