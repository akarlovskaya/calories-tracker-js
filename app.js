/* jshint esversion: 6 */
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
        updateItem: function(name, calories) {
            // Calories to number
            calories = parseInt(calories);
            let found = null;

            data.items.forEach(function(item){
              if(item.id === data.currentItem.id){
                item.name = name;
                item.calories = calories;
                found = item;
              }
            });
            return found;
        },
        deleteItem: function(id){
            // get ids
            const ids = data.items.map(function(item){
                return item.id;
            });
            // get index
            const index = ids.indexOf(id);
            // Remove item
            data.items.splice(index, 1);
        },
        clearAllItems: function(){
            data.items = [];
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
        listItems: '#item-list li',
        addBtn: '.add-btn',
        updateBtn: '.update-btn',
        deleteBtn: '.delete-btn',
        backBtn: '.back-btn',
        clearBtn: '.clear-btn',
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
        updateListItem: function(item){
            let listItems = document.querySelectorAll(UISelectors.listItems);

            // Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(listItem){
              const itemID = listItem.getAttribute('id');

              if(itemID === `item-${item.id}`){
                document.querySelector(`#${itemID}`).innerHTML = `<strong>${item.name}: </strong> <em>${item.calories} Calories</em>
                <a href="#" class="secondary-content">
                  <i class="edit-item fa fa-pencil"></i>
                </a>`;
              }
            });
        },
        deleteListItem: function(id){
            const itemID = `#item-${id}`;
            const item = document.querySelector(itemID);
            item.remove();
        },
        clearInput: function() {
            document.querySelector(UISelectors.itemNameInput).value = '';
            document.querySelector(UISelectors.itemCaloriesInput).value = '';
        },
        removeItems: function(){
            let listItems = document.querySelectorAll(UISelectors.listItems);
            // Turn Node list into array
            listItems = Array.from(listItems);

            listItems.forEach(function(item){
              item.remove();
            });
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

        // disable submit on enter
        document.addEventListener('keypress', function(e){
            if ( e.keyCode === 13 || e.which === 13 ) { // e.which for older browsers
                e.preventDefault();
            }
        });

        // "Add meal" click event
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
        document.querySelector(UISelectors.addBtn).addEventListener('click', itemAddSubmit);

        // Edit item on click
        const itemEditClick = function(e){
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
        document.querySelector(UISelectors.itemList).addEventListener('click', itemEditClick);

        // Update item on Update click button
        const itemUpdateSubmit = function(e){
            // Get item input
            const input = UICntrl.getItemInput();
            // Update item
            const updatedItem = ItemCntrl.updateItem(input.name, input.calories);
            // Update UI
            UICntrl.updateListItem(updatedItem);

             // Get total calories
             const totalCalories = ItemCntrl.getTotalCalories();
             // Add total calories to UI
             UICntrl.showTotalCalories(totalCalories);

             UICntrl.clearEditState();

            e.preventDefault();
        };
        document.querySelector(UISelectors.updateBtn).addEventListener('click', itemUpdateSubmit);

        // Delete event
        const itemDeleteSubmit = function(e){
            const currentItem = ItemCntrl.getCurrentItem();
            ItemCntrl.deleteItem(currentItem.id);
            // delete from UI
            UICntrl.deleteListItem(currentItem.id);

            // Get total calories
            const totalCalories = ItemCntrl.getTotalCalories();
            // Add total calories to UI
            UICntrl.showTotalCalories(totalCalories);

            UICntrl.clearEditState();

            e.preventDefault();
        };
        document.querySelector(UISelectors.deleteBtn).addEventListener('click', itemDeleteSubmit);

        // Back button Event (clear inputs)
        document.querySelector(UISelectors.backBtn).addEventListener('click', UICntrl.clearEditState);

        // Clear all button (inputs and list)
        const clearAllItemsClick = function(e){
            // Delete all items from data structure
            ItemCntrl.clearAllItems();
            // Get total calories
            const totalCalories = ItemCntrl.getTotalCalories();
            // Add total calories to UI
            UICntrl.showTotalCalories(totalCalories);
            // Remove from UI
            UICntrl.removeItems();
            // Hide UL
            UICntrl.hideList();
            e.preventDefault();
        };
        document.querySelector(UISelectors.clearBtn).addEventListener('click', clearAllItemsClick);
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
            // add total to UI
            UICntrl.showTotalCalories(totalCalories);

            // Load Event Listeners
            loadEventListeners();
        }
    };

})(ItemCntrl, UICntrl);

// Initializing App
App.init();
