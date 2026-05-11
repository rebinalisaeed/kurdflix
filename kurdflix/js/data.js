@font-face {
    font-family: 'NRT-Bold';
    src: url('../fonts/NRT-Bd.ttf') format('truetype');
}
@font-face {
    font-family: 'NRT-Regular';
    src: url('../fonts/NRT-Reg.ttf') format('truetype');
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: 'NRT-Regular', sans-serif;
    background-color: #141414;
    color: #fff;
    direction: rtl;
}

.navbar {
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1000;
    background-color: transparent;
    transition: background-color 0.3s ease;
    padding: 0.8rem 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.navbar.scrolled {
    background-color: #333333;
}

.hero-slider {
    position: relative;
    width: 100%;
    height: 85vh;
    overflow: hidden;
}

.slide {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    transition: opacity 0.6s;
    background-size: cover;
    background-position: center 20%;
}

.slide.active {
    opacity: 1;
    z-index: 1;
}

.slide-content {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-rows: 6fr 3fr 1fr;
    background: linear-gradient(90deg, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.4) 100%);
}

.slide-text {
    grid-row: 2 / 3;
    padding: 2rem;
    max-width: 600px;
}

.section {
    margin: 40px 30px;
}

.movie-row {
    display: flex;
    overflow-x: auto;
    gap: 15px;
    padding-bottom: 10px;
}

.movie-card {
    min-width: 150px;
    cursor: pointer;
    transition: transform 0.2s;
}

.movie-card img {
    width: 100%;
    border-radius: 8px;
}

footer {
    background-color: #111;
    text-align: center;
    padding: 40px 20px;
    margin-top: 50px;
}

@media (max-width: 768px) {
    .movie-card { min-width: 120px; }
    .navbar { padding: 0.5rem 1rem; }
}
