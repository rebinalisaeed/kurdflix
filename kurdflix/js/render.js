function renderSections() {
    const sections = [
        { name: "نوێترین بەرهەمەکان", filter: (m) => m, limit:20 },
        { name: "نوێترین فیلمەکان", filter: (m) => m.category === "فیلم", limit:20 },
        { name: "نوێترین زنجیرەکان", filter: (m) => m.category === "زنجیرە", limit:20 },
        { name: "نوێترین بەرهەمی کوردی", filter: (m) => m.category === "کوردی", limit:20 },
        { name: "نوێترین بەرهەمی تورکی", filter: (m) => m.category === "تورکی", limit:20 },
        { name: "نوێترین بەرهەمی عەرەبی", filter: (m) => m.category === "عەرەبی", limit:20 }
    ];

    const main = document.getElementById('mainContent');
    if(!main) return;
    
    main.innerHTML = sections.map(section => {
        const filtered = movies.filter(section.filter).reverse().slice(0, section.limit);
        if(filtered.length === 0) return '';
        return `
            <div class="section">
                <h2>${section.name}</h2>
                <div class="movie-row">
                    ${filtered.map(m => `
                        <div class="movie-card" onclick="playVideo('${m.videoLink}')">
                            <img src="${m.poster}" alt="${m.title}">
                            <p>${m.title} (${m.year})</p>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }).join('');
}

window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if(window.scrollY > 50) navbar.classList.add('scrolled');
    else navbar.classList.remove('scrolled');
});

document.getElementById('menuBtn')?.addEventListener('click', () => {
    document.getElementById('sideMenu')?.classList.toggle('open');
});

loadMovies();
