import { elements } from './base';

// func to return search value
export const getInput = () => elements.searchInput.value;

// clear input func / here we don't return anything, so use { }
export const clearInput = () => {
    elements.searchInput.value = ''
};

export const clearResults = () => {
    elements.searchResList.innerHTML = ''; 
    // clear search list
    elements.searchResPages.innerHTML = ''; 
    // clear pagination extra buttons

}


// highlight with gray color the selected recipe (using hash id)
export const highlightSelected = id => {
    const resultsArr = Array.from(document.querySelectorAll('.results__link')); // nodelist to array
    resultsArr.forEach(el => { // do something for each array element
        el.classList.remove('results__link--active'); 
    });
    document.querySelector(`.results__link[href*="${id}"]`).classList.add('results__link--active');
};

// .results__link[href*="${id}"]`) - select this class with certain ahref attribute 



// limit title length
export const limitRecipeTitle = (title, limit = 30) => {
    const newTitle = [];
    if (title.length > limit) {
        title.split(' ').reduce((acc, cur) => {
                if (acc + cur.length <= limit) {
                    newTitle.push(cur);
                }
                return acc + cur.length;

              
        }, 0);

        //return the result
        return `${newTitle.join(' ')} . . .`;
    }

      return title;

}





// render recipes html template
const renderRecipe = recipe => {
    const markup = `
        <li>
            <a class="results__link" href="#${recipe.recipe_id}">
                <figure class="results__fig">
                    <img src="${recipe.image_url}" alt="${recipe.title}">
                </figure>
                <div class="results__data">
                    <h4 class="results__name">${limitRecipeTitle(recipe.title)}</h4>
                    <p class="results__author">${recipe.publisher}</p>
                </div>
            </a>
        </li>
    `;

    elements.searchResList.insertAdjacentHTML('beforeend', markup);
}




// type: 'prev' or 'next' // create html template func

const createButton = (page, type) => `
  <button class="btn-inline results__btn--${type}" data-goto=${type === 'prev' ? page - 1 : page + 1}>
        <span>Page ${type === 'prev' ? page - 1 : page + 1}</span>
        <svg class="search__icon">
            <use href="img/icons.svg#icon-triangle-${type === 'prev' ? 'left' : 'right'}"></use>
        </svg>
    </button>
`;


// render pagination func
const renderButtons = (page, numResults, resPerPage) => {
    const pages = Math.ceil(numResults / resPerPage);

    let button; // for block scope
    if (page === 1 && pages > 1) {
        // only NEXT PAGE button
        button = createButton(page, 'next');
    } else if (page < pages) {
        // render both buttons so we call it x2 to get 2 html blocks
        button = ` 
        ${createButton(page, 'prev')}
        ${createButton(page, 'next')}
        `;
    } else if (page === pages && pages > 1) {
        // only prev button
        button = createButton(page, 'prev');
    }
        // add to HTML
        elements.searchResPages.insertAdjacentHTML('afterbegin', button);

};




// RENDER + PAGINATION. render results by handling array of recipes we get by API.
// set result amount with resPerPage
// 'page' arg is starting page that we show
export const renderResults = (recipes, page = 1, resPerPage = 10) => {
    // start and end is for setting pages amount and slice out extra
    const start = (page - 1) * resPerPage; 
    const end = page * resPerPage;
    recipes.slice(start, end).forEach(renderRecipe); // automatic execute for each element of array
    // done with recipes render
    // now pagination render
    renderButtons(page, recipes.length, resPerPage) 
    // attention: page and resPerPage is fetched from other above arguments list
} 