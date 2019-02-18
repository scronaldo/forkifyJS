// model to get search results (array of recipes)
import axios from 'axios';
import {proxy , key} from '../config';

export default class Search {
    constructor(query) {
        this.query = query;
    }

    async getResults() {
    
        try {
            const res = await axios(`${proxy}http://food2fork.com/api/search?key=${key}&q=${this.query}`);
            // save API response to variable

        this.result = res.data.recipes;
        // save array with recipes to property

        // console.log(this.result);  
        } catch (error) {
            alert(error);
            console.log(error);
        }
      
        
    }


}
 
//  CORS  
// https://cors-anywhere.herokuapp.com/
// https://thingproxy.freeboard.io/fetch/
// https://gist.github.com/jimmywarting/ac1be6ea0297c16c477e17f8fbe51347



