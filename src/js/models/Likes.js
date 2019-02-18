// LIKES MODEL

export default class Likes {

    constructor() {
        this.likes = [];
        // by default has property with Array to save the like objects
    }

    addLike(id, title, author, img) {
        const like = { id, title, author, img };
        // new object out of arguments

        this.likes.push(like);
        // push new like object to likes array

         // Persist data in localStorage
         this.persistData();

         return like;
         // return the new like object
    }

    deleteLike(id) {
        const index = this.likes.findIndex(el => el.id === id);
        // find by id
        this.likes.splice(index, 1);
        // splice it out (delete index, elements to delete)

        // Persist data in localStorage
        this.persistData();
        // save localStorage data
    }

    isLiked(id) {
        return this.likes.findIndex(el => el.id === id) !== -1;
        // we find current recipe id and see if it's not -1 
        // if not -1 then true means liked
    }


    // how many likes in total?
    getNumLikes() {
        return this.likes.length;
    }



 

    // funcs for localStorage
    // save likes list (we call it whenever add or remove liked recipes)
    persistData() {
        localStorage.setItem('likes', JSON.stringify(this.likes));
    // set new key - value pair (key Likes, value is our likes array converted into string)

    }

    // read likes list
    readStorage() {
        const storage = JSON.parse(localStorage.getItem('likes'));
        // string (stringed object actually) into obj convertation
        
        // Restoring likes from the localStorage
        if (storage) this.likes = storage;
        // if storage not empty (storage) then assign likes
    }
}
