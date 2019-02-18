import uniqid from 'uniqid';

// order list model (customer select dish and adds it's ingerients to Order (shopping) list)
export default class List {
    constructor() {
        this.items = [];
        // store list items in array 
    }
    
    // add item to list
    addItem(count, unit, ingredient) {
        const item = {
            id: uniqid(), // package func - generate random ID for each item
            count, // dest.
            unit,
            ingredient
        }
        // so we create object for item and then
        this.items.push(item); // add its to item list array
        return item;
    }

    deleteItem(id) {
        const index = this.items.findIndex(el => el.id === id);
         // if element true to this func, return element


        // [2,4,8] splice(1, 2) -> returns [4, 8], original array is [2]
        // [2,4,8] slice(1, 2) -> returns 4, original array is [2,4,8]
        // found index of id we wanna delete
        this.items.splice(index, 1); // from position VarIndex remove 1 element, add new ommited
    }

    updateCount(id, newCount) { 
        // new count for item object with specified id
        this.items.find(el => el.id === id).count = newCount;
        // find returns element that matched func true so find=>element
    }
}