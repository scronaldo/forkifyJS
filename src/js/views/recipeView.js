import { elements } from "./base";
import { Fraction } from 'fractional';



// clear recipe markup - we dont return anything in this func - just clear html markup p.s. no return means undefined is returned
export const clearRecipe = () => {
    elements.recipe.innerHTML = '';
};






// Render the recipe - IMPORTANT function
// get recipe object as argument
export const renderRecipe = (recipe, isLiked) => {
    const markup = `
        <figure class="recipe__fig">
            <img src="${recipe.img}" alt="${recipe.title}" class="recipe__img">
            <h1 class="recipe__title">
                <span>${recipe.title}</span>
            </h1>
        </figure>

        <div class="recipe__details">
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-stopwatch"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--minutes">${recipe.time}</span>
                <span class="recipe__info-text"> minutes</span>
            </div>
            <div class="recipe__info">
                <svg class="recipe__info-icon">
                    <use href="img/icons.svg#icon-man"></use>
                </svg>
                <span class="recipe__info-data recipe__info-data--people">${recipe.servings}</span>
                <span class="recipe__info-text"> servings</span>

                <div class="recipe__info-buttons">
                    <button class="btn-tiny btn-decrease">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-minus"></use>
                        </svg>
                    </button>
                    <button class="btn-tiny btn-increase">
                        <svg>
                            <use href="img/icons.svg#icon-circle-with-plus"></use>
                        </svg>
                    </button>
                </div>

            </div>
            <button class="recipe__love">
                <svg class="header__likes">
                    <use href="img/icons.svg#icon-heart${isLiked ? '' : '-outlined'}"></use>
                </svg>
            </button>
        </div>

        <div class="recipe__ingredients">
            <ul class="recipe__ingredient-list">
                ${recipe.ingredients.map(el => createIngredient(el)).join('')}
            </ul>

            <button class="btn-small recipe__btn recipe__btn--add">
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-shopping-cart"></use>
                </svg>
                <span>Add to shopping list</span>
            </button>
        </div>

        <div class="recipe__directions">
            <h2 class="heading-2">How to cook it</h2>
            <p class="recipe__directions-text">
                This recipe was carefully designed and tested by Pavel and
                <span class="recipe__by">${recipe.author}</span>. Please check out directions at their website.
            </p>
            <a class="btn-small recipe__btn" href="${recipe.url}" target="_blank">
                <span>Source</span>
                <svg class="search__icon">
                    <use href="img/icons.svg#icon-triangle-right"></use>
                </svg>

            </a>
        </div>
    `;
    elements.recipe.insertAdjacentHTML('afterbegin', markup);
};
// about     ${recipe.ingredients.map(el => createIngredient(el)).join('')}  : 
// 1) we loop over each ingredient object and create html markup for each that is added into new Array
// 2) now we new array containing strings
// 2) we transform that array into one string by .join method and now we have string with clean html united markup




// function that creates markup for each ingredient object
// we use map and loop over unknown number of elements returning markup string for each of them
const createIngredient = ingredient => `
    <li class="recipe__item">
        <svg class="recipe__icon">
            <use href="img/icons.svg#icon-check"></use>
        </svg>
        <div class="recipe__count">${formatCount(ingredient.count)}</div>
        <div class="recipe__ingredient">
            <span class="recipe__unit">${ingredient.unit}</span>
            ${ingredient.ingredient}
        </div>
    </li>
`;




// function from Fraction package to fix count values (float number to fraction )
const formatCount = count => {
    if (count) { // if have count
        // count = 2.5 --> 5/2 --> 2 1/2
        // count = 0.5 --> 1/2

        const newCount = Math.round(count * 10000) / 10000;   // rounding =)
        const [int, dec] = newCount.toString().split('.').map(el => parseInt(el, 10));
        // declared 2 consts and assign them array of 2 elements (1st is integer and 2nd is decimal)
        /* newCount.toString().split('.').map(el => parseInt(el, 10)); = count number to string to array [str, str] and
         then map it to array [num, num] with parseInt and assign it to int and dec vars
         so we transformed number into array of it's integer and decimal (using split method primarily) 
         */


        if (!dec) return newCount; // if no decimal (decimal is a number with . point )

        if (int === 0) {
            const fr = new Fraction(newCount); // calling package method
            return `${fr.numerator}/${fr.denominator}`;
        } else {
            const fr = new Fraction(newCount - int);
            return `${int} ${fr.numerator}/${fr.denominator}`;
        }
    }
    return '?'; // if no count, render unknown number
};



// render updated servings if button is clicked
export const updateServingsIngredients = recipe => {
    // Update servings number (just changing text inside html element)
    document.querySelector('.recipe__info-data--people').textContent = recipe.servings; 

    // Update ingredeints
    const countElements = Array.from(document.querySelectorAll('.recipe__count')); // nodeList to array
    countElements.forEach((el, i) => { // do something for each arr element 
        el.textContent = formatCount(recipe.ingredients[i].count); // assing new value
    });
};

