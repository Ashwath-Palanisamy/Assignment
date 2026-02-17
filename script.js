const RecipeApp = (() => {
    // --- PRIVATE DATA ---
    const recipes = [
        {
            id: 1,
            title: "Classic Spaghetti Carbonara",
            time: 25,
            difficulty: "easy",
            description: "Creamy Italian pasta dish with pancetta.",
            ingredients: ["200g Spaghetti", "100g Pancetta", "2 Large Eggs", "50g Pecorino Cheese", "Black Pepper"],
            steps: [
                "Boil a large pot of salted water.",
                {
                    text: "Prepare the creamy base",
                    substeps: ["Whisk eggs in a small bowl.", "Mix in grated cheese and pepper."]
                },
                "Fry pancetta until golden brown.",
                "Combine pasta and sauce off the heat to avoid scrambling eggs."
            ]
        },
        {
            id: 2,
            title: "Chicken Tikka Masala",
            time: 45,
            difficulty: "medium",
            description: "Spiced chicken in a tomato-cream sauce.",
            ingredients: ["Chicken Breast", "Yogurt", "Garam Masala", "Canned Tomatoes", "Heavy Cream", "Garlic & Ginger"],
            steps: [
                "Marinate chicken in yogurt and spices for 30 mins.",
                "Grill chicken until charred.",
                {
                    text: "Simmer the sauce",
                    substeps: ["Sauté onions and ginger.", "Add tomatoes and simmer.", "Stir in heavy cream at the end."]
                }
            ]
        },
        {
            id: 3,
            title: "Homemade Croissants",
            time: 180,
            difficulty: "hard",
            description: "Flaky, buttery French pastry.",
            ingredients: ["Bread Flour", "Active Dry Yeast", "Sugar", "Salt", "Unsalted Butter (lots)", "Milk"],
            steps: [
                "Mix dough and chill overnight.",
                {
                    text: "The Lamination Process",
                    substeps: [
                        "Create a butter block.",
                        {
                            text: "Folding (The Turns)",
                            substeps: ["First fold (Letter fold).", "Second fold after 30 min chill.", "Third fold."]
                        }
                    ]
                },
                "Shape into triangles and roll.",
                "Proof until doubled in size and bake."
            ]
        },
        {
            id: 4,
            title: "Greek Salad",
            time: 15,
            difficulty: "easy",
            description: "Fresh and crisp Mediterranean salad.",
            ingredients: ["Cucumber", "Tomatoes", "Feta Cheese", "Kalamata Olives", "Red Onion", "Olive Oil"],
            steps: ["Chop all vegetables into chunks.", "Add olives and feta slices.", "Drizzle with olive oil and sprinkle oregano."]
        },
        {
            id: 5,
            title: "Beef Wellington",
            time: 120,
            difficulty: "hard",
            description: "Luxury beef fillet in pastry.",
            ingredients: ["Beef Fillet", "Puff Pastry", "Mushroom Duxelles", "Prosciutto", "Egg Wash"],
            steps: [
                "Sear the beef on all sides.",
                "Spread mushroom duxelles over prosciutto.",
                "Wrap the beef in the prosciutto/mushroom layer.",
                "Encase in puff pastry and bake until golden."
            ]
        },
        {
            id: 6,
            title: "Vegetable Stir Fry",
            time: 20,
            difficulty: "easy",
            description: "Quick and healthy veggies.",
            ingredients: ["Broccoli", "Carrots", "Bell Peppers", "Soy Sauce", "Sesame Oil", "Ginger"],
            steps: ["Heat oil in a wok.", "Add hard veggies first (carrots).", "Toss in peppers and sauce. Stir fry for 5 mins."]
        },
        {
            id: 7,
            title: "Pad Thai",
            time: 30,
            difficulty: "medium",
            description: "Classic Thai street food noodles.",
            ingredients: ["Rice Noodles", "Shrimp", "Tamarind Paste", "Peanuts", "Bean Sprouts", "Eggs"],
            steps: [
                "Soak noodles in warm water.",
                "Sauté shrimp and scrambled eggs.",
                "Add noodles and tamarind sauce. Toss with peanuts."
            ]
        },
        {
            id: 8,
            title: "Margherita Pizza",
            time: 60,
            difficulty: "medium",
            description: "Simple basil and mozzarella pizza.",
            ingredients: ["Pizza Dough", "San Marzano Tomatoes", "Fresh Mozzarella", "Fresh Basil", "Olive Oil"],
            steps: [
                "Stretch dough into a circle.",
                "Spread crushed tomatoes.",
                "Add cheese and bake at max temperature.",
                "Finish with fresh basil leaves."
            ]
        }
    ];

    // --- PRIVATE STATE ---
    let currentFilter = 'all';
    let currentSort = 'none';
    const container = document.querySelector('#recipe-container');

    // --- RECURSIVE FUNCTION ---
    const renderSteps = (steps) => {
        return `<ol class="steps-list">
            ${steps.map(step => {
            if (typeof step === 'string') {
                return `<li>${step}</li>`;
            } else {
                return `<li>
                        <strong>${step.text}</strong>
                        <ul class="substep-list">
                            ${renderSteps(step.substeps)}
                        </ul>
                    </li>`;
            }
        }).join('')}
        </ol>`;
    };

    // --- RENDERING LOGIC ---
    const createCard = (recipe) => `
        <div class="recipe-card" data-id="${recipe.id}">
            <h3>${recipe.title}</h3>
            <div class="recipe-meta">
                <span>⏱️ ${recipe.time} min</span>
                <span class="difficulty ${recipe.difficulty}">${recipe.difficulty}</span>
            </div>
            <p>${recipe.description}</p>
            <div class="card-controls">
                <button class="toggle-btn" data-type="steps">Show Steps</button>
                <button class="toggle-btn" data-type="ingredients">Show Ingredients</button>
            </div>
            <div class="steps-container">${renderSteps(recipe.steps)}</div>
            <div class="ingredients-container">
                <ul>${recipe.ingredients.map(i => `<li>${i}</li>`).join('')}</ul>
            </div>
        </div>
    `;

    const updateDisplay = () => {
        let result = currentFilter === 'all' ? recipes :
            currentFilter === 'quick' ? recipes.filter(r => r.time < 30) :
                recipes.filter(r => r.difficulty === currentFilter);

        const sorted = [...result];
        if (currentSort === 'name') sorted.sort((a, b) => a.title.localeCompare(b.title));
        if (currentSort === 'time') sorted.sort((a, b) => a.time - b.time);

        container.innerHTML = sorted.map(createCard).join('');
    };

    // --- EVENT DELEGATION ---
    const setupListeners = () => {
        // Toggle Logic (Delegation)
        container.addEventListener('click', (e) => {
            if (!e.target.classList.contains('toggle-btn')) return;
            const type = e.target.dataset.type;
            const parent = e.target.closest('.recipe-card');
            const targetDiv = parent.querySelector(`.${type}-container`);

            const isVisible = targetDiv.classList.toggle('visible');
            e.target.textContent = isVisible ? `Hide ${type.charAt(0).toUpperCase() + type.slice(1)}` : `Show ${type.charAt(0).toUpperCase() + type.slice(1)}`;
        });

        // Filter/Sort Logic
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentFilter = e.target.dataset.filter;
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                updateDisplay();
            });
        });

        document.querySelectorAll('.sort-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                currentSort = e.target.dataset.sort;
                document.querySelectorAll('.sort-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                updateDisplay();
            });
        });
    };

    // --- PUBLIC API ---
    return {
        init: () => {
            setupListeners();
            updateDisplay();
            console.log("RecipeApp Part 3 Ready!");
        }
    };
})();

RecipeApp.init();