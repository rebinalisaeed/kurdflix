// ==================== بارکردنی داتا ====================
let allContent = JSON.parse(localStorage.getItem('kurdflix_content')) || [];
let sliderItems = JSON.parse(localStorage.getItem('kurdflix_slider')) || [];

// ئەگەر داتا بەتاڵ بوو، نموونە زیاد بکە
if(allContent.length === 0) {
    allContent = [
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
}

if(sliderItems.length === 0) {
    sliderItems = [
        {
            title: "ئاگرەکانی باکوور",
            genre: "دراما",
            year: "2025",
            description: "چیرۆکی خێزانێکی کوردی لە کاتی قەیراندا",
            bgImage: "https://via.placeholder.com/1920x800?text=Kurdflix+Slide+1",
            videoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        },
        {
            title: "Diriliş Ertuğrul",
            genre: "مێژوویی",
            year: "2020",
            description: "درامایەکی مێژوویی تورکی",
            bgImage: "https://via.placeholder.com/1920x800?text=Kurdflix+Slide+2",
            videoLink: "https://www.youtube.com/embed/dQw4w9WgXcQ"
        }
    ];
}

// ==================== پاشەکەوتکردن ====================
function saveAll() {
    localStorage.setItem('kurdflix_content', JSON.stringify(allContent));
    localStorage.setItem('kurdflix_slider', JSON.stringify(sliderItems));
    renderContentList();
    renderSliderListAdmin();
}

// ==================== ڕێندرکردنی لیستی بەرهەمەکان ====================
function renderContentList() {
    const container = document.getElementById('contentList');
    if(!container) return;
    container.innerHTML = '';
    
    if(allContent.length === 0) {
        container.innerHTML = '<div class="empty-message">هیچ بەرهەمێک نییە. تکایە بەرهەمێک زیاد بکە.</div>';
        return;
    }
    
    allContent.forEach(c => {
        const div = document.createElement('div');
        div.className = 'admin-item';
        div.innerHTML = `
            <div class="item-info">
                <strong>${c.title}</strong>
                <span class="item-badge">${c.type === 'film' ? '🎬 فیلم' : '📺 زنجیرە'}</span>
                <span class="item-badge lang">${c.language}</span>
                <span class="item-year">${c.year}</span>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editContent(${c.id})">✏️ دەستکاری</button>
                <button class="delete-btn" onclick="deleteContent(${c.id})">🗑 سڕینەوە</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// ==================== ڕێندرکردنی لیستی سلایدەر ====================
function renderSliderListAdmin() {
    const container = document.getElementById('sliderListAdmin');
    if(!container) return;
    container.innerHTML = '';
    
    if(sliderItems.length === 0) {
        container.innerHTML = '<div class="empty-message">هیچ سلایدێک نییە. تکایە سلایدێک زیاد بکە.</div>';
        return;
    }
    
    sliderItems.forEach((s, i) => {
        const div = document.createElement('div');
        div.className = 'admin-item';
        div.innerHTML = `
            <div class="item-info">
                <strong>${s.title}</strong>
                <span class="item-badge">${s.genre}</span>
                <span class="item-year">${s.year}</span>
            </div>
            <div class="item-actions">
                <button class="edit-btn" onclick="editSliderAdmin(${i})">✏️ دەستکاری</button>
                <button class="delete-btn" onclick="deleteSliderAdmin(${i})">🗑 سڕینەوە</button>
            </div>
        `;
        container.appendChild(div);
    });
}

// ==================== فەنکشنەکانی دەستکاری و سڕینەوە ====================
window.editContent = function(id) {
    const item = allContent.find(c => c.id === id);
    if(!item) return;
    
    document.getElementById('contentId').value = item.id;
    document.getElementById('contentTitle').value = item.title;
    document.getElementById('contentGenre').value = item.genre;
    document.getElementById('contentYear').value = item.year;
    document.getElementById('contentDesc').value = item.description;
    document.getElementById('contentPoster').value = item.poster;
    document.getElementById('contentEmbed').value = item.embedLink;
    document.getElementById('contentType').value = item.type;
    document.getElementById('contentLanguage').value = item.language;
    document.getElementById('contentDate').value = item.dateAdded;
    
    // scroll to form
    document.querySelector('.admin-form').scrollIntoView({ behavior: 'smooth' });
};

window.deleteContent = function(id) {
    if(confirm('دڵنیای لە سڕینەوەی ئەم بەرهەمە؟')) {
        allContent = allContent.filter(c => c.id !== id);
        saveAll();
    }
};

window.editSliderAdmin = function(idx) {
    const s = sliderItems[idx];
    if(!s) return;
    
    document.getElementById('sliderIndex').value = idx;
    document.getElementById('sliderTitle').value = s.title;
    document.getElementById('sliderGenre').value = s.genre;
    document.getElementById('sliderYear').value = s.year;
    document.getElementById('sliderDesc').value = s.description;
    document.getElementById('sliderImage').value = s.bgImage;
    document.getElementById('sliderVideo').value = s.videoLink;
    
    document.querySelector('#sliderTab .admin-form').scrollIntoView({ behavior: 'smooth' });
};

window.deleteSliderAdmin = function(idx) {
    if(confirm('دڵنیای لە سڕینەوەی ئەم سلایدە؟')) {
        sliderItems.splice(idx, 1);
        saveAll();
    }
};

// ==================== سڕینەوەی هەموو ====================
document.getElementById('clearAllContent')?.addEventListener('click', () => {
    if(confirm('ئاگادار! دەتەوێت هەموو بەرهەمەکان بسڕیتەوە؟ ئەم کارە ناگەڕێتەوە.')) {
        allContent = [];
        saveAll();
    }
});

document.getElementById('clearAllSliders')?.addEventListener('click', () => {
    if(confirm('ئاگادار! دەتەوێت هەموو سلایدەکان بسڕیتەوە؟')) {
        sliderItems = [];
        saveAll();
    }
});

// ==================== زیادکردن/نوێکردنەوەی بەرهەم ====================
document.getElementById('contentForm')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const id = document.getElementById('contentId').value;
    const newItem = {
        id: id ? parseInt(id) : Date.now(),
        title: document.getElementById('contentTitle').value,
        genre: document.getElementById('contentGenre').value,
        year: document.getElementById('contentYear').value,
        description: document.getElementById('contentDesc').value,
        poster: document.getElementById('contentPoster').value,
        embedLink: document.getElementById('contentEmbed').value,
        type: document.getElementById('contentType').value,
        language: document.getElementById('contentLanguage').value,
        dateAdded: document.getElementById('contentDate').value || new Date().toISOString().split('T')[0],
        isSeries: document.getElementById('contentType').value === 'series'
    };
    
    if(id) {
        const index = allContent.findIndex(c => c.id == id);
        if(index !== -1) allContent[index] = newItem;
    } else {
        allContent.push(newItem);
    }
    
    document.getElementById('contentId').value = '';
    e.target.reset();
    saveAll();
});

// ==================== زیادکردن/نوێکردنەوەی سلاید ====================
document.getElementById('sliderFormAdmin')?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const idx = document.getElementById('sliderIndex').value;
    const newSlide = {
        title: document.getElementById('sliderTitle').value,
        genre: document.getElementById('sliderGenre').value,
        year: document.getElementById('sliderYear').value,
        description: document.getElementById('sliderDesc').value,
        bgImage: document.getElementById('sliderImage').value,
        videoLink: document.getElementById('sliderVideo').value
    };
    
    if(idx !== '') {
        sliderItems[parseInt(idx)] = newSlide;
    } else {
        sliderItems.push(newSlide);
    }
    
    document.getElementById('sliderIndex').value = '';
    e.target.reset();
    saveAll();
});

// ==================== تاپس (تب) گۆڕین ====================
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
        document.getElementById(`${btn.dataset.tab}Tab`).classList.add('active');
    });
});

// ==================== Load ====================
renderContentList();
renderSliderListAdmin();
