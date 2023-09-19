
const form = document.querySelector('.js-form');
form.addEventListener('submit', handleSubmit);
const nextBtn = document.querySelector('.js-next');
const prevBtn = document.querySelector('.js-prev');
let resultStats = document.querySelector('.js-result-stats');
let searchQuery;
let currentPage = 1; // Initialize the current page

function handleSubmit(event) {
    event.preventDefault();
    const inputValue = document.querySelector('.js-search-input').value;
    searchQuery = inputValue.trim();
    currentPage = 1; // Reset the current page to 1
    console.log(searchQuery);
    fetchResults(searchQuery);
}

async function searchUnsplash(searchQuery, page) {
    const accessKey = "-v1wyQ1W0MosxyDdG4VQFn4Us63HrWI_Xdt_EYqfibo";
    const perPage = 12; // Number of images per page
    const endpoint = `https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${accessKey}&page=${page}&per_page=${perPage}`;
    
    const response = await fetch(endpoint);
    if (!response.ok) {
        throw Error(response.statusText);
    }
    
    const json = await response.json();
    return json;
}

async function fetchResults(searchQuery) {
    try {
        const results = await searchUnsplash(searchQuery, currentPage);
        console.log(results);
        displayResults(results);
    } catch (err) {
        console.log(err);
        alert('Failed to search Unsplash');
    }
}

function displayResults(json) {
    const searchResults = document.querySelector('.js-search-results');
    searchResults.textContent = '';
    json.results.forEach(result => {
        const url = result.urls.small;
        const unsplashLink = result.links.html;
        const photographer = result.user.name;
        const photographerPage = result.user.links.html;
        searchResults.insertAdjacentHTML(
            'beforeend',
            `<div>
                <a href="${unsplashLink}" target="_blank">
                    <div class="result-item" style="background-image: url(${url});"></div>
                </a>
                <p class="photographer-name">
                    <a href="${photographerPage}" target="_blank" style="color: black; text-decoration: none;">Photo by ${photographer}</a>
                </p>
            </div>`
        );
    });
    
    totalResults = json.total;
    resultStats.textContent = `About ${totalResults} results found`;
    
    // Update pagination buttons
    if (currentPage > 1) {
        prevBtn.style.display = 'block';
    } else {
        prevBtn.style.display = 'none';
    }

    if (currentPage < json.total_pages) {
        nextBtn.style.display = 'block';
    } else {
        nextBtn.style.display = 'none';
    }
}

nextBtn.addEventListener('click', () => {
    currentPage++;
    fetchResults(searchQuery);
});

prevBtn.addEventListener('click', () => {
    currentPage--;
    fetchResults(searchQuery);
});
