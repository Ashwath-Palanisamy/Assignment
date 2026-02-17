// ============================================
// 1. DATA (Foundation)
// ============================================
const recipes = [
    { id: 1, title: "Classic Spaghetti Carbonara", time: 25, difficulty: "easy", description: "A creamy Italian pasta dish made with eggs, cheese, pancetta, and black pepper.", category: "pasta" },
    { id: 2, title: "Chicken Tikka Masala", time: 45, difficulty: "medium", description: "Tender chicken pieces in a creamy, spiced tomato sauce.", category: "curry" },
    { id: 3, title: "Homemade Croissants", time: 180, difficulty: "hard", description: "Buttery, flaky French pastries that require patience.", category: "baking" },
    { id: 4, title: "Greek Salad", time: 15, difficulty: "easy", description: "Fresh vegetables, feta cheese, and olives tossed in olive oil.", category: "salad" },
    { id: 5, title: "Beef Wellington", time: 120, difficulty: "hard", description: "Tender beef fillet wrapped in puff pastry.", category: "meat" },
    { id: 6, title: "Vegetable Stir Fry", time: 20, difficulty: "easy", description: "Colorful mixed vegetables cooked quickly.", category: "vegetarian" },
    { id: 7, title: "Pad Thai", time: 30, difficulty: "medium", description: "Thai stir-fried rice noodles with shrimp and peanuts.", category: "noodles" },
    { id: 8, title: "Margherita Pizza", time: 60, difficulty: "medium", description: "Classic Italian pizza with fresh mozzarella and basil.", category: "pizza" }
];

// ============================================
// 2. STATE MANAGEMENT
// ============================================
let currentFilter = 'all';
let currentSort = 'none';

// ============================================
// 3. DOM REFERENCES
// ============================================
const recipeContainer = document.querySelector('#recipe-container');
const filterButtons = document.querySelectorAll('.filter-btn');
const sortButtons = document.querySelectorAll('.sort-btn');

// ============================================
// 4. PURE FILTER & SORT FUNCTIONS
// ============================================
const applyFilter = (data, filterType) => {
    if (filterType === 'all') return data;
    if (filterType === 'quick') return data.filter(r => r.time < 30);
    return data.filter(r => r.difficulty === filterType);
};

const applySort = (data, sortType) => {
    const copy = [...data]; // Pure: do not mutate original
    if (sortType === 'name') return copy.sort((a, b) => a.title.localeCompare(b.title));
    if (sortType === 'time') return copy.sort((a, b) => a.time - b.time);
    return copy;
};

// ============================================
// 5. RENDER FUNCTIONS
// ============================================
const createRecipeCard = (recipe) => `
    <div class="recipe-card" data-id="${recipe.id}">
        <h3>${recipe.title}</h3>
        <div class="recipe-meta">
            <span>⏱️ ${recipe.time} min</span>
            <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
        </div>
        <p>${recipe.description}</p>
    </div>
`;

const updateDisplay = () => {
    // Pipeline: Data -> Filter -> Sort -> Render
    let filtered = applyFilter(recipes, currentFilter);
    let sorted = applySort(filtered, currentSort);
    
    recipeContainer.innerHTML = sorted.map(createRecipeCard).join('');
    
    // Update button visual state
    filterButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.filter === currentFilter));
    sortButtons.forEach(btn => btn.classList.toggle('active', btn.dataset.sort === currentSort));
    
    console.log(`Displaying ${sorted.length} recipes (Filter: ${currentFilter}, Sort: ${currentSort})`);
};

// ============================================
// 6. EVENT LISTENERS & INIT
// ============================================
const setupEventListeners = () => {
    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentFilter = btn.dataset.filter;
            updateDisplay();
        });
    });

    sortButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            currentSort = btn.dataset.sort;
            updateDisplay();
        });
    });
};

// Initialize App
setupEventListeners();
updateDisplay();
