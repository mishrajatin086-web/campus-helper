// LocalStorage se existing items load karo ya empty array rakho
let items = JSON.parse(localStorage.getItem('campusItems')) || [];

// DOM Elements
const itemForm = document.getElementById('itemForm');
const itemsContainer = document.getElementById('itemsContainer');
const searchInput = document.getElementById('searchInput');
const filterCategory = document.getElementById('filterCategory');

// Save items to LocalStorage
function saveItems() {
    localStorage.setItem('campusItems', JSON.stringify(items));
}

// Render Items on Screen
function renderItems() {
    const searchTerm = searchInput.value.toLowerCase();
    const selectedCategory = filterCategory.value;

    itemsContainer.innerHTML = '';

    const filteredItems = items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchTerm) || 
                              item.description.toLowerCase().includes(searchTerm);
        const matchesCategory = selectedCategory === 'All' || item.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    if (filteredItems.length === 0) {
        itemsContainer.innerHTML = `
            <div class="col-span-full bg-white p-8 text-center text-gray-500 rounded-lg shadow-sm">
                No items found. Be the first to post!
            </div>
        `;
        return;
    }

    filteredItems.forEach((item, index) => {
        const isLost = item.type === 'Lost';
        const badgeColor = isLost ? 'bg-red-100 text-red-700 border-red-300' : 'bg-green-100 text-green-700 border-green-300';

        const cardHtml = `
            <div class="item-card bg-white p-5 rounded-lg shadow border-l-4 ${isLost ? 'border-red-500' : 'border-green-500'} flex flex-col justify-between">
                <div>
                    <div class="flex justify-between items-start mb-2">
                        <span class="px-2 py-0.5 text-xs font-semibold rounded border ${badgeColor}">
                            ${item.type.toUpperCase()}
                        </span>
                        <span class="text-xs text-gray-400">${item.date}</span>
                    </div>
                    <h3 class="text-lg font-bold text-gray-800">${item.title}</h3>
                    <p class="text-xs text-blue-600 font-medium mb-2">📁 ${item.category}</p>
                    <p class="text-sm text-gray-600 mb-4">${item.description}</p>
                </div>
                <button onclick="deleteItem(${index})" class="self-end text-xs text-red-500 hover:text-red-700 font-semibold underline">
                    Mark as Resolved / Delete
                </button>
            </div>
        `;
        itemsContainer.innerHTML += cardHtml;
    });
}

// Add New Item Event
itemForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const newItem = {
        type: document.getElementById('type').value,
        title: document.getElementById('title').value,
        category: document.getElementById('category').value,
        description: document.getElementById('description').value,
        date: new Date().toLocaleDateString()
    };

    items.unshift(newItem); // New item at top
    saveItems();
    renderItems();

    itemForm.reset(); // Reset form
});

// Delete Item Function
function deleteItem(index) {
    items.splice(index, 1);
    saveItems();
    renderItems();
}

// Search & Filter Events
searchInput.addEventListener('input', renderItems);
filterCategory.addEventListener('change', renderItems);

// Initial Load
renderItems();