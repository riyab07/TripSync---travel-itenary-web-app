import json
import os
import logging

# Set up logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logger = logging.getLogger(__name__)

DATA_FILE = 'data/saved_recipes.json'

class RecipeManager:
    def __init__(self):
        """
        Initialize the RecipeManager with a JSON file for storing saved recipes.
        """
        # Ensure the data directory exists
        os.makedirs(os.path.dirname(DATA_FILE), exist_ok=True)
        
        # Initialize the saved recipes file if it doesn't exist
        if not os.path.exists(DATA_FILE):
            with open(DATA_FILE, 'w') as f:
                json.dump([], f)

    def _load(self):
        """Load saved recipes from the JSON file."""
        try:
            with open(DATA_FILE, 'r') as f:
                return json.load(f)
        except Exception as e:
            logger.error("Error loading saved recipes: %s", str(e))
            return []

    def _save(self, data):
        """Save recipes to the JSON file."""
        try:
            with open(DATA_FILE, 'w') as f:
                json.dump(data, f, indent=4)
        except Exception as e:
            logger.error("Error saving recipes: %s", str(e))
            raise

    def save_recipe(self, recipe):
        """
        Save a recipe to the saved recipes list.
        
        Args:
            recipe (dict): Recipe to save with 'title' and 'ingredients'.
        
        Returns:
            dict: Saved recipe.
        """
        saved_recipes = self._load()
        # Avoid duplicates by checking if the recipe already exists
        if not any(r['title'] == recipe['title'] for r in saved_recipes):
            saved_recipes.append(recipe)
            self._save(saved_recipes)
            logger.info("Recipe saved: %s", recipe['title'])
        return recipe

    def get_saved_recipes(self):
        """
        Retrieve all saved recipes.
        
        Returns:
            list: List of saved recipes.
        """
        recipes = self._load()
        logger.info("Retrieved %d saved recipes", len(recipes))
        return recipes

    def delete_recipe(self, title):
        """
        Delete a recipe by its title.
        
        Args:
            title (str): Title of the recipe to delete.
        
        Returns:
            bool: True if deleted, False if not found.
        """
        saved_recipes = self._load()
        updated_recipes = [recipe for recipe in saved_recipes if recipe['title'] != title]
        if len(updated_recipes) == len(saved_recipes):
            logger.warning("Recipe not found for deletion: %s", title)
            return False
        self._save(updated_recipes)
        logger.info("Recipe deleted: %s", title)
        return True