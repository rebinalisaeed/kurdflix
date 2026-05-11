function renderSlider() {
    const sliderDiv = document.getElementById('heroSlider');
    const latestMovies = [...movies].reverse().slice(0, 5);
    if(!sliderDiv) return;
    
    sliderDiv.innerHTML = latestMovies.map((m, idx) => `
        <div class="slide ${idx === 0 ? 'active' : ''}" style="background-image: url('${m.poster}')">
            <div class="slide-content">
                <div class="slide-text">
                    <h2>${m.title}</h2>
                    <p>${m.desc?.substring(0, 100) || ''}</p>
                    <button class="btn-play" onclick="playVideo('${m.videoLink}')">سەیر کردن</button>
                </div>
                <div class="empty-bottom"></div>
            </div>
        </div>
    `).join('');
}

window.playVideo = (link) => {
    if(link && link !== '#') window.open(link, '_blank');
    else alert("لینکی ڤیدیۆ دانەنراوە");
};
