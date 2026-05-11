// داتاکان لە JSON دەخوێنرێتەوە
let movies = [];

async function loadMovies() {
    try {
        const response = await fetch('data/movies.json');
        movies = await response.json();
        renderSlider();
        renderSections();
    } catch(e) {
        console.log("JSON دانەنراوە، بەکاری دیتای دیفۆڵت دەهێنم");
        movies = [
            { id:1, title:"تەپەڕۆ", category:"فیلم", genre:"ئاکشن", year:"2023", desc:"فیلمێکی ئاکشنی کوردی", poster:"https://via.placeholder.com/300x450", videoLink:"#" }
        ];
        renderSlider();
        renderSections();
    }
}
