import logging
from datetime import datetime
import requests

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

class RecipeSuggester:
    def __init__(self):
        """
        Initialize the RecipeSuggester with a static recipe database and TheMealDB API setup.
        """
        # Static recipe database as fallback
        self.recipes = [
            {
                'name': 'Tomato Onion Curry',
                'ingredients': [
                    {'name': 'tomato', 'qty': 2},
                    {'name': 'onion', 'qty': 1},
                    {'name': 'spices', 'qty': 1}
                ],
                'instructions': '1. Sauté onions until golden. 2. Add chopped tomatoes and spices. 3. Cook until the mixture thickens into a curry. 4. Serve hot with rice or bread.'
            },
            {
                'name': 'Aloo Matar',
                'ingredients': [
                    {'name': 'potato', 'qty': 3},
                    {'name': 'peas', 'qty': 1},
                    {'name': 'spices', 'qty': 1}
                ],
                'instructions': '1. Boil potatoes and peas. 2. In a pan, heat oil and add spices. 3. Add boiled potatoes and peas, stir-fry for 5 minutes. 4. Garnish with cilantro and serve.'
            },
            {
                'name': 'Vegetable Stir Fry',
                'ingredients': [
                    {'name': 'carrot', 'qty': 2},
                    {'name': 'peas', 'qty': 1},
                    {'name': 'onion', 'qty': 1},
                    {'name': 'spices', 'qty': 1}
                ],
                'instructions': '1. Heat oil in a wok. 2. Add chopped onions, carrots, and peas. 3. Stir-fry with spices for 5-7 minutes. 4. Serve as a side dish or with rice.'
            },
            {
                'name': 'Carrot Potato Soup',
                'ingredients': [
                    {'name': 'carrot', 'qty': 3},
                    {'name': 'potato', 'qty': 2},
                    {'name': 'spices', 'qty': 1}
                ],
                'instructions': '1. Boil carrots and potatoes until soft. 2. Blend with spices and water to make a smooth soup. 3. Heat and serve with bread.'
            },
            {
                'name': 'Peas and Tomato Pasta',
                'ingredients': [
                    {'name': 'peas', 'qty': 1},
                    {'name': 'tomato', 'qty': 2},
                    {'name': 'pasta', 'qty': 2},
                    {'name': 'spices', 'qty': 1}
                ],
                'instructions': '1. Boil pasta until al dente. 2. In a pan, cook tomatoes and peas with spices. 3. Mix in the pasta and stir well. 4. Serve with grated cheese if desired.'
            },
            {
                'name': 'Apple Salad',
                'ingredients': [
                    {'name': 'apple', 'qty': 1},
                    {'name': 'carrot', 'qty': 1}
                ],
                'instructions': '1. Dice the apple and grate the carrot. 2. Mix in a bowl with a pinch of salt and lemon juice. 3. Serve fresh as a healthy salad.'
            }
        ]
        # TheMealDB API setup
        self.api_endpoint = "https://www.themealdb.com/api/json/v1/1/filter.php"
        self.lookup_endpoint = "https://www.themealdb.com/api/json/v1/1/lookup.php"

    def suggest_recipes(self, inventory, prioritize_near_expiry=False, days_threshold=3):
        """
        Suggest recipes using TheMealDB API based on available, non-expired ingredients in the inventory.
        Falls back to static recipes if API fails.
        
        Args:
            inventory (list): List of dicts with keys 'name', 'qty', and 'expiry'.
            prioritize_near_expiry (bool): If True, prioritize recipes using near-expiry items.
            days_threshold (int): Number of days to consider an item near expiry.
        
        Returns:
            list: List of suggested recipes with name, ingredients, and instructions.
        """
        if not inventory or not isinstance(inventory, list):
            logger.warning("Invalid inventory data provided.")
            return [{'name': 'Invalid inventory', 'ingredients': [], 'instructions': ''}]

        # Use current date for expiry check (May 31, 2025, 09:20 PM IST)
        today = datetime.now()

        # Filter available, non-expired ingredients
        available = {}
        near_expiry_items = set()
        logger.info("Inventory items: %s", inventory)
        for item in inventory:
            try:
                if not all(key in item for key in ['name', 'qty', 'expiry']):
                    logger.warning("Skipping item due to missing keys: %s", item)
                    continue

                qty = float(item['qty'])
                expiry = datetime.strptime(item['expiry'], '%Y-%m-%d')
                days_left = (expiry - today).days

                if qty > 0 and expiry >= today:
                    available[item['name'].lower()] = qty
                    logger.info("Available: %s (Qty: %s, Days left: %d)", item['name'], qty, days_left)
                    if days_left <= days_threshold:
                        near_expiry_items.add(item['name'].lower())
                        logger.info("%s is near expiry (%d days left)", item['name'], days_left)
                else:
                    logger.info("Skipping %s: Expired or qty <= 0 (Expiry: %s, Qty: %s)", item['name'], item['expiry'], qty)
            except (ValueError, TypeError, KeyError) as e:
                logger.warning("Skipping invalid inventory item: %s", str(e))
                continue

        logger.info("Available ingredients: %s", available)
        logger.info("Near-expiry ingredients: %s", near_expiry_items)

        # Try to fetch recipes using TheMealDB API
        suggested_recipes = []
        try:
            # TheMealDB allows searching by a single main ingredient
            for ingredient in available.keys():
                params = {"i": ingredient}
                response = requests.get(self.api_endpoint, params=params)
                response.raise_for_status()
                api_recipes = response.json().get('meals', [])

                # Fetch detailed recipe information for each meal
                for api_recipe in api_recipes:
                    # Avoid duplicates
                    if any(recipe['name'] == api_recipe['strMeal'] for recipe in suggested_recipes):
                        continue

                    # Fetch detailed recipe info
                    lookup_response = requests.get(self.lookup_endpoint, params={"i": api_recipe['idMeal']})
                    lookup_response.raise_for_status()
                    recipe_details = lookup_response.json().get('meals', [])[0]

                    # Extract ingredients
                    ingredients = []
                    for i in range(1, 21):  # TheMealDB has up to 20 ingredients
                        ingredient_name = recipe_details.get(f'strIngredient{i}', '')
                        if ingredient_name:
                            ingredients.append(ingredient_name.lower())

                    # Check if we can make this recipe with available ingredients
                    can_make = all(ing in available for ing in ingredients if ing)
                    if not can_make:
                        continue

                    # Extract instructions
                    instructions = recipe_details.get('strInstructions', 'No instructions available.')

                    # Check if the recipe uses near-expiry items
                    uses_near_expiry = any(ing in near_expiry_items for ing in ingredients if ing)

                    suggested_recipes.append({
                        'name': api_recipe['strMeal'],
                        'ingredients': ingredients,
                        'instructions': instructions,
                        'uses_near_expiry': uses_near_expiry
                    })
                    logger.info("TheMealDB Recipe suggested: %s", api_recipe['strMeal'])

        except Exception as e:
            logger.error("Failed to fetch TheMealDB recipes: %s", str(e))
            logger.info("Falling back to static recipe database.")

            # Fallback to static recipe matching
            for recipe in self.recipes:
                can_make = True
                uses_near_expiry = False
                missing_ingredients = []
                for ingredient in recipe['ingredients']:
                    ingredient_name = ingredient['name'].lower()
                    required_qty = ingredient['qty']
                    if ingredient_name not in available or available[ingredient_name] < required_qty:
                        can_make = False
                        missing_ingredients.append(f"{ingredient_name} (need {required_qty}, have {available.get(ingredient_name, 0)})")
                        break
                    if ingredient_name in near_expiry_items:
                        uses_near_expiry = True

                if can_make:
                    recipe_entry = {
                        'name': recipe['name'],
                        'ingredients': [ing['name'] for ing in recipe['ingredients']],
                        'instructions': recipe['instructions'],
                        'uses_near_expiry': uses_near_expiry
                    }
                    suggested_recipes.append(recipe_entry)
                    logger.info("Static Recipe suggested: %s", recipe['name'])
                else:
                    logger.info("Cannot make %s: Missing %s", recipe['name'], missing_ingredients)

        # Sort recipes if prioritizing near-expiry items
        if prioritize_near_expiry:
            suggested_recipes.sort(key=lambda x: x['uses_near_expiry'], reverse=True)

        # Default message if no recipes are found
        if not suggested_recipes:
            suggested_recipes.append({
                'name': 'No recipe suggestions',
                'ingredients': [],
                'instructions': '',
                'uses_near_expiry': False
            })

        logger.info("Suggested %d recipes, prioritizing near-expiry: %s", len(suggested_recipes), prioritize_near_expiry)
        return suggested_recipes