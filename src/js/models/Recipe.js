// model for getting specific recipe
import axios from 'axios'; // import axios package

import { proxy , key } from '../config';


// class to generate specific recipe obj by id 

export default class Recipe {
    constructor(id) {
        this.id = id;
    }

    async getRecipe() {
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/get?key=${key}&rId=${this.id}`);
            // make object props out of API fetched data
            this.title = res.data.recipe.title;
            this.author = res.data.recipe.publisher;
            this.img = res.data.recipe.image_url;
            this.url = res.data.recipe.source_url;
            this.ingredients = res.data.recipe.ingredients; // array
        } catch (e) {
          console.log(e);
          
        }
    }

    // method to calculate cooking time
    calcTime() {
        // Assuming that we need 15 min for each 3 ingredients
        const numIng = this.ingredients.length;
        const periods = Math.ceil(numIng / 3);
        this.time = periods * 15;
    }


    calcServings() {
        this.servings = 4;
    }



    // transform ingredients into handy data that will be easy to display and use
    parseIngredients() {
        // replacing units
        const unitsLong = ['tablespoons', 'tablespoon', 'ounces', 'ounce', 'teaspoons', 'teaspoon', 'cups', 'pounds'];
        const unitsShort = ['tbsp', 'tbsp', 'oz', 'oz', 'tsp', 'tsp', 'cup', 'pound'];
        const units = [...unitsShort, 'kg', 'g']; 

        // create new ingredients var by handling array of old property values
        const newIngredients = this.ingredients.map(el => {
            // 1) Uniform units to get rid of different units names
            let ingredient = el.toLowerCase();
            unitsLong.forEach((unit, i) => {
                ingredient = ingredient.replace(unit, unitsShort[i]);
            });

            // 2) Remove parentheses (regexp)
            ingredient = ingredient.replace(/ *\([^)]*\) */g, ' ');

            // 3) Parse ingredients into count, unit and ingredient (string into obj)
            const arrIng = ingredient.split(' '); // split into array
            const unitIndex = arrIng.findIndex(el2 => units.includes(el2)); // find index of a unit
            // assume there is ONLY one unit per ingredient (per one array element)

            let objIng; // initialize ingredient object
            if (unitIndex > -1) {
                // There is a unit
                // Example 4 1/2 cups, arrCount is [4, 1/2] --> eval("4+1/2") --> 4.5
                // Ex. 4 cups, arrCount is [4]
                const arrCount = arrIng.slice(0, unitIndex); // get count (cut out the count number to const)
                // note: count and unit always come in the beggining in that API
                
                let count; // prepare spot to save count number
                if (arrCount.length === 1) {
                    count = eval(arrIng[0].replace('-', '+'));
                } else {
                    count = eval(arrIng.slice(0, unitIndex).join('+'));
                }
                // we summed up the count using eval to strings data

                objIng = {
                    // creating object for each ingredient

                    // destructarization
                    count, 
                    // assign count unit by it's index position
                    unit: arrIng[unitIndex], 
                    // cut off count and units and join into str
                    ingredient: arrIng.slice(unitIndex + 1).join(' ') 
                };


            } else if (parseInt(arrIng[0], 10)) { // if could parse [0] into number = true; else = false;
                // There is NO unit, but 1st element is number
                objIng = {
                    count: parseInt(arrIng[0], 10),
                    unit: '',
                    ingredient: arrIng.slice(1).join(' ')
                }
            } else if (unitIndex === -1) {
                // There is NO unit and NO number in 1st position
                objIng = {
                    count: 1, // no unit so i'ts suppose to be 1 
                    unit: '', // empty
                    ingredient // es6 destructutisation assigment by same name
                }
            }
            // return (add) object  for our new array
            return objIng; 
        });

        // =) done proccesing old strings array and now we got array of objects


        this.ingredients = newIngredients; // transform property by reassinging

        // so instead of array of ingredients string we suppose to get array with handy objects;
    }

    // lets user change serving by buttons
    updateServings (type) {
        // Servings
        const newServings = type === 'dec' ? this.servings - 1 : this.servings + 1;
        // so we assign it a number (this.servings digit -+ 1)

        // Ingredients - update all ingredients count
        this.ingredients.forEach(ing => {
            ing.count *= (newServings / this.servings);
        });

        this.servings = newServings; // assing new servings count
    }

}