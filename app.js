/* jshint esversion: 6 */

// Storage controller

// Item Controller
const ItemCntrl = (function(){
    // Item Constructor
    const Item = function(id, name, calories){
        this.id = id;
        this.name = name;
        this.calories = calories;
    };

    // Data Structure / State
    const data = {
        items: [
            // {id: 0, name: 'Steak', calories: 500},
            // {id: 1, name: 'Cookie', calories: 200},
            // {id: 2, name: 'Potato', calories: 100}
        ],
        currentItem: null,
        totalCalories: 0
    };

    // Public methods (make data accessbile and available outside of module)
    return {
        getItems: function(){
            return data.items;
        },
        addItem: function(name, calories){
            let ID;

            if ( data.items.length > 0 ) {
                ID = data.items[data.items.length - 1].id + 1;
            } else {
                ID = 0;
            }
            // parse calories to number
            calories = parseInt(calories);

            // create new Item
            let newItem = new Item(ID, name, calories);
            // add newItem to items array
            data.items.push(newItem);
            return newItem;
        },
        logData: function(){
            return data;
        }
    };
})();


// UI Controller
const UICntrl = (function(){
    // Store all UI selectors in one place (object)
    const UISelectors = {
        itemList: '#item-list',
        addBtn: '.add-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories'
    };
    // Public methods
    return {
        // output list of items in html
        populateItemList: function(items){
            let html = '';

            items.forEach(function(item){
                html += `
                    <li class="collection-item" id="item-${item.id}">
                      <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                      <a href="#" class="secondary-content">
                        <i class="edit-item fa fa-pencil"></i>
                      </a>
                    </li>
                `;
            });
            document.querySelector(UISelectors.itemList).innerHTML = html;
        },
        // make UISelectors accessbile outside Module
        getSelectors: function(){
            return UISelectors;
        },
        getItemInput: function(){
            return {
                name: document.querySelector(UISelectors.itemNameInput).value,
                calories: document.querySelector(UISelectors.itemCaloriesInput).value
            };
        },
        addListItem: function(item){
            // show ul element
            document.querySelector(UISelectors.itemList).style.display = 'block';
            // create li element
            const li = document.createElement('li');
            // add class
            li.className = 'collection-item';
            // add id
            li.id = `item-${item.id}`;
            // add HTML
            li.innerHTML = `
                <strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>
            `;
            // insert item using insertAdjacentElement() method (inserts a the specified element into a specified position)
            document.querySelector(UISelectors.itemList).insertAdjacentElement('beforeend', li);
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        // hide ul element if no items in UI
        hideList: function(){
            document.querySelector(UISelectors.itemList).style.display = 'none';
        }

    };

})();


// App Controller (what is going to be ready when app is loaded)
const App = (function(ItemCntrl, UICntrl){
    // Load event Listeners
    const loadEventListeners = function(){
        // Get UI selectors from UISelectors object and define them as var
        const UISelectors = UICntrl.getSelectors();
        // Add item submit
        const itemAddSubmit = function(e){
            // get form input from UI controller
            const input = UICntrl.getItemInput();

            // check that name and calories were entered
            if ( input.name !== '' && input.calories !== '') {
                // add item
                const newItem = ItemCntrl.addItem(input.name, input.calories);
                // add item to UI
                UICntrl.addListItem(newItem);
                // clear fields after
                UICntrl.clearInput();
            }
            e.preventDefault();
        };

        // "Add meal" click event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);
    };

    // Public Methods
    return {
        init: function(){
            // Fetch items from Data Structure
            const items = ItemCntrl.getItems();
            // Check if items present
            if ( items.length === 0 ) {
                UICntrl.hideList();
            } else {
                // Populate list with items
                UICntrl.populateItemList(items);
            }

            // Load Event Listeners
            loadEventListeners();
        }
    };

})(ItemCntrl, UICntrl);

// Initializing App
App.init();
