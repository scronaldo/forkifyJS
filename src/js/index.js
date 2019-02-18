
import Search from './models/Search';
import Recipe from './models/Recipe';
import List from './models/List'; // import default values
import Likes from './models/Likes';
import * as searchView from './views/searchView'; // * imp all exports as object
import * as recipeView from './views/recipeView';
import * as listView from './views/listView'; 
import * as likesView from './views/likesView';
import { elements, renderLoader, clearLoader } from './views/base'; // imp non default values




/* Global state of the app

- Search object
- Current recipe object
- Shopping list object
- Liked recipes 

state object keeps all the actual data
*/


const state = {};

// SEARCH CONTROLLER

// main function handling search
const controlSearch = async () => {
    // 1) Get query from views
    const query = searchView.getInput();
    console.log(query);
    
    if (query) {
        // 2) New search object and add to current state
        state.search = new Search(query);

        // 3) Prepare UI for results
        searchView.clearInput();
        searchView.clearResults();
        renderLoader(elements.searchRes);
        try {
           // 4) Search for recipes
        await state.search.getResults();

        // 5) Render results on UI
        clearLoader();
        searchView.renderResults(state.search.result);   
        } catch (e) {
            alert(e);
            clearLoader();


        }
       
    }
}

// search button
elements.searchForm.addEventListener('submit', e => {
    e.preventDefault();
    controlSearch();
})


// event delegation for pagination navigation
elements.searchResPages.addEventListener('click', e => {
    const btn = e.target.closest('.btn-inline'); // find closest to target button w this class
    if (btn) {// if found and btn is not empty then 
        const goToPage = parseInt(btn.dataset.goto, 10); // read data attribute value and parse it to integer from string
        // we assign page number to goToPage const
        searchView.clearResults(); // clear results from previous page

        searchView.renderResults(state.search.result, goToPage); // here we specify result page (default was 1)

        }
});



// RECIPE CONTROLLER

// basically we read the hash id and api-call the needed recipe
const controlRecipe = async () => {
// Get ID (hash #) from url bar
const id = window.location.hash.replace('#', '') // and remove hash sign #
console.log(id);

if (id) { // if found hash in url
    // Prepare UI for changes
  
    recipeView.clearRecipe();
    renderLoader(elements.recipe);

    // hightlight selected search item (if there was search query)
    if (state.search) searchView.highlightSelected(id);

  

    // Create new recipe object
    state.recipe = new Recipe(id); // and add nested object to our state object
    
 

try {
     // check if no errors
      // Get recipe data and parse ingredients into handy object 
      await state.recipe.getRecipe(); // asyncrhoniously get recipe w/o blocking event loop;
            state.recipe.parseIngredients(); // transform ingredients API array into filtred handy objects

      // Calculate servings and time
      state.recipe.calcTime();
      state.recipe.calcServings();
      
      // Render recipe
    
      clearLoader();
    
      recipeView.renderRecipe(
        state.recipe,
        state.likes.isLiked(id)
    );
       // recipe object as arg
      
  
} catch (e) {
    alert (e);
    console.log(e);
}
  


}



}


// detect hash change to launch recipe controller - old way
// window.addEventListener('hashchange', controlRecipe);
// window.addEventListener('load', controlRecipe );

// shorthand to add multiple eventListeners - new way
['hashchange', 'load'].forEach(event => window.addEventListener(event, controlRecipe));




/** 
 * LIST CONTROLLER
 */

 // func we call when ADD TO ORDER LIST IS CLICKED 
const controlList = () => {
    // Create a new list IF there is none yet
    if (!state.list) state.list = new List();
    // created list Object with array of itmes inside (items are objects) obj.array = [items]

    // Add each ingredient to the list and UI
    state.recipe.ingredients.forEach(el => { // for each ing in array we do next:
        const item = state.list.addItem(el.count, el.unit, el.ingredient);
        // create item obj an push it to items array
        // then render this item (since addItem returns current item)
        listView.renderItem(item);
    });
}


// Handle delete and update list item events
elements.shopping.addEventListener('click', e => {
    const id = e.target.closest('.shopping__item').dataset.itemid;
    // read value of data attr with name itemid (data-itemid)
    //now we got element id and gonna delete it

    // Handle the delete button
    if (e.target.matches('.shopping__delete, .shopping__delete *')) {
        // Delete from state
        state.list.deleteItem(id);

        // Delete from UI
        listView.deleteItem(id); 
        // using id from data-itemid to identify element

    // Handle the count update
    } else if (e.target.matches('.shopping__count-value')) {
        const val = parseFloat(e.target.value, 10); // read current count
        state.list.updateCount(id, val);
        // new value user entered set as new count
    }
});


/** 
 * LIKE CONTROLLER
 */




// Likes controller func (add to likes or remove from likes)
const controlLike = () => {
    if (!state.likes) state.likes = new Likes();
    // create new likes obj if not yet created in the current state var
    const currentID = state.recipe.id;
    // read current recipe id

    // if not yet liked
    if (!state.likes.isLiked(currentID)) {
        // add like to state and return added like obj (to newLike)
        const newLike = state.likes.addLike(
            currentID,
            state.recipe.title,
            state.recipe.author,
            state.recipe.img
        )

        //toggle the Like button
        likesView.toggleLikeBtn(true);
        // true boolean is linked with html string for correct svg part

        //add like to UI like menu
        likesView.renderLike(newLike);
        console.log(state.likes);
        
    }

    // if current recipe is ALREADY liked
    else {
        // remove like from the state
        state.likes.deleteLike(currentID);

        // toggle the like button
        likesView.toggleLikeBtn(false);

        // remove like from UI List
        likesView.deleteLike(currentID);
        console.log(state.likes);
    }
    // show likes menu if likes > 0;
    likesView.toggleLikeMenu(state.likes.getNumLikes());


}



// LOCALSTORAGE - RESTORE LIKED RECIPES
// Restore liked recipes on page load
window.addEventListener('load', () => {
    // initialize like obj
    state.likes = new Likes();
    
    // Restore likes
    state.likes.readStorage();

    // Toggle like menu button
    likesView.toggleLikeMenu(state.likes.getNumLikes());

    // Render the existing likes
    state.likes.likes.forEach(like => likesView.renderLike(like));
    // for each like obj in likes array we do render like func (add current like obj into like menu)
});








// RECIPE BUTTONS
// Handling recipe button clicks - specificly servings and ingredients number, add to fav or cart
elements.recipe.addEventListener('click', e => {
    // if target matches selector (* means with any nested children)
    if (e.target.matches('.btn-decrease, .btn-decrease *')) {
        // Decrease button is clicked
        if (state.recipe.servings > 1) { // don't let user set 0 or less servings
            state.recipe.updateServings('dec'); // update servings in recipe object using it's method
            recipeView.updateServingsIngredients(state.recipe); // render updated values
        }
    } else if (e.target.matches('.btn-increase, .btn-increase *')) {
        // Increase button is clicked
        state.recipe.updateServings('inc');
        recipeView.updateServingsIngredients(state.recipe);
    } 

    // add to order list part
    else if (e.target.matches('.recipe__btn--add, .recipe__btn--add *')) {
        // Add ingredients to shopping list
        controlList();
    } 
    
    else if (e.target.matches('.recipe__love, .recipe__love *')) {
        // Like controller func - add || remove from likes list
        controlLike();
    }
});

