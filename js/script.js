async function fetchData(){

    try{
        const response = await fetch ("https://japceibal.github.io/japflix_api/movies-data.json");

        if (!response.ok){
            throw new Error("Could not fetch resource");
        }

        const data = await response.json();
        movieData= data; //Almacena los datos sin mostrarlos al usuario
            console.log("Datos cargados pero no mostrados", movieData); //Solo los muesra en consola
        
    } catch(error){
    console.log (error);
    }  
}

window.onload = fetchData

const searchInput = document.getElementById('inputBuscar');

document.getElementById('btnBuscar').addEventListener('click', function(){
    const searchValue = searchInput.value.toLowerCase();
    if (searchValue) {
        const filteredMovies=movieData.filter(movie => {
            return (
                movie.title.toLowerCase().includes(searchValue) || 
                movie.genres.some(genre => genre.name.toLowerCase().includes(searchValue)) ||
                movie.tagline.toLowerCase().includes(searchValue) ||
                movie.overview.toLowerCase().includes(searchValue)
            );
        });

        //Mostrar resultados en id="lista"
        const resultsContainer = document.getElementById('lista');
        resultsContainer.innerHTML= '';

        filteredMovies.forEach(movie =>{
            const movieItem=document.createElement('li');
            movieItem.classList.add('list-group-item', 'cursor-pointer');

            movieItem.innerHTML = `
            <h3>${movie.title}</h3>
            <p>${movie.tagline}</p>
            <div class="stars">${getStars(movie.vote_average)}</div>

            `;

            movieItem.addEventListener('click', ()=>{
                const offcanvasTitle=document.getElementById('offcanvasTitle');
                const offcanvasOverview=document.getElementById('offcanvasOverview');
                const offcanvasGenre=document.getElementById('offcanvasGenre');

                offcanvasTitle.textContent = movie.title;
                offcanvasOverview.textContent = movie.overview;
                offcanvasGenre.textContent = movie.genres.map(genre => genre.name).join(', ');
                
                const offcanvas = new bootstrap.Offcanvas(document.getElementById('offcanvasTop'));
    offcanvas.show();
            });

            document.getElementById('More').addEventListener('click', function(){
                const dropdownYear=document.getElementById('dropdownYear');
                const dropdownRuntime=document.getElementById('dropdownRuntime');
                const dropdownBudget=document.getElementById('dropdownBudget');
                const dropdownRevenue=document.getElementById('dropdownRevenue');
                const year = movie.release_date.split('-')[0];

                dropdownYear.textContent = year;
                dropdownRuntime.textContent = movie.runtime + 'mins';
                dropdownBudget.textContent = '$'+ movie.budget;
                dropdownRevenue.textContent = '$'+ movie.revenue;
                
            })

            resultsContainer.appendChild(movieItem);

        });
    }
});

function getStars (vote_average) {
    const maxStars= Math.round(vote_average/2);
    let stars='';

    for (let i=0; i<maxStars; i++) {
    stars += '<span class="fa fa-star checked"></span>';
    }

    for(let i=maxStars; i<5; i++) {
    stars += '<span class="fa fa-star"></span>';
    }

    return stars
}
