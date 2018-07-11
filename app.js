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
        // get item object to edit it on click
        getItemById: function(id) {
            let found = null;
            data.items.forEach(function(item){
                if ( item.id === id ) {
                    found = item;
                }
            });
            return found;
        },
        setCurrentItem: function(currentItem){
            data.currentItem = currentItem;
        },
        getCurrentItem: function() {
            return data.currentItem;
        },
        getTotalCalories: function(){
            let total = 0;

            data.items.forEach(function(item){
                total += item.calories;
            });
            data.totalCalories = total;
            return data.totalCalories;
        },
        // for logging data
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
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        itemNameInput: '#item-name',
        itemCaloriesInput: '#item-calories',
        totalCalories: '.total-calories'
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
        },
        showTotalCalories: function(totalCalories){
            document.querySelector(UISelectors.totalCalories).textContent = totalCalories;
        },
        clearEditState: function(){
            UICntrl.clearInput();
            document.querySelector(UISelectors.updateBtn).style.display = 'none';
            document.querySelector(UISelectors.deleteBtn).style.display = 'none';
            document.querySelector(UISelectors.backBtn).style.display = 'none';
            document.querySelector(UISelectors.addBtn).style.display = 'inline';

        },
        showEditState: function(){
            document.querySelector(UISelectors.updateBtn).style.display = 'inline';
            document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
            document.querySelector(UISelectors.backBtn).style.display = 'inline';
            document.querySelector(UISelectors.addBtn).style.display = 'none';

        },
        // add current item to form after clicking Edit icon
        addItemToForm: function() {
            document.querySelector(UISelectors.itemNameInput).value = ItemCntrl.getCurrentItem().name;
            document.querySelector(UISelectors.itemCaloriesInput).value = ItemCntrl.getCurrentItem().calories;
            UICntrl.showEditState();
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
                // get total calories
                const totalCalories = ItemCntrl.getTotalCalories();
                UICntrl.showTotalCalories(totalCalories);

            }
            e.preventDefault();
        };
        // "Add meal" click event
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Update item on click
        const itemUpdateSubmit = function(e){
            // check class name to make sure icon was clicked
            if ( e.target.classList.contains('edit-item') ) {
                // get id of clicked item (id from parent li el)
                let liElId = e.target.parentNode.parentNode.id; // <li class="collection-item" id="item-0">
                let idArr = liElId.split('-'); // getting array (2) ["item", "0"]
                let id = parseInt(idArr[1]);

                // find item object
                const itemToEdit = ItemCntrl.getItemById(id);
                // set itemToEdit as currentItem in Data Sturcture
                ItemCntrl.setCurrentItem(itemToEdit);
                // add current item to form inputs
                UICntrl.addItemToForm();
            }
            e.preventDefault();
        };
        // Edit Item Icon click event
        document.querySelector(UISelectors.itemList).addEventListener('click', itemUpdateSubmit);



    };

    // Public Methods
    return {
        init: function(){
            // Clear edit State
            UICntrl.clearEditState();
            // Fetch items from Data Structure
            const items = ItemCntrl.getItems();
            // Check if items present
            if ( items.length === 0 ) {
                UICntrl.hideList();
            } else {
                // Populate list with items
                UICntrl.populateItemList(items);
            }

            // get total calories
            const totalCalories = ItemCntrl.getTotalCalories();
            UICntrl.showTotalCalories(totalCalories);

            // Load Event Listeners
            loadEventListeners();
        }
    };

})(ItemCntrl, UICntrl);

// Initializing App
App.init();
