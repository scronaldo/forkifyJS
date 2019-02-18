import { elements } from './base';
import { limitRecipeTitle } from './searchView';

// toggle like button svg style in recipe card
export const toggleLikeBtn = isLiked => {
    const iconString = isLiked ? 'icon-heart' : 'icon-heart-outlined';
    // manipulate svg accrording to if recipe is liked or not
    document.querySelector('.recipe__love use').setAttribute('href', `img/icons.svg#${iconString}`);
    //so we created variable to get right string based on argument value
    // icons.svg#icon-heart-outlined
};

// show hide likes menu (if more than 0 likes)
export const toggleLikeMenu = numLikes => {
    elements.likesMenu.style.visibility = numLikes > 0 ? 'visible' : 'hidden';
};

// render added like on the like menu
export const renderLike = like => {
    const markup = `
        <li>
            <a class="likes__link" href="#${like.id}">
                <figure class="likes__fig">
                    <img src="${like.img}" alt="${like.title}">
                </figure>
                <div class="likes__data">
                    <h4 class="likes__name">${limitRecipeTitle(like.title)}</h4>
                    <p class="likes__author">${like.author}</p>
                </div>
            </a>
        </li>
    `;
    elements.likesList.insertAdjacentHTML('beforeend', markup);
};

// delete like from UI using id
export const deleteLike = id => {
    const el = document.querySelector(`.likes__link[href*="${id}"]`).parentElement;
    if (el) el.parentElement.removeChild(el);
}