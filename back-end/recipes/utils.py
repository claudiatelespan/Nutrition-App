CATEGORY_UNIT_CONVERSIONS = {
    'Baking': {
        'cup': 120,
        'tablespoon': 12,
        'teaspoon': 4,
        'drop': 0.05,
        'ounce': 28.35,
        'package': 250,
        'piece': 50
    },
    'Beverages': {
        'cup': 240,
        'tablespoon': 15,
        'teaspoon': 5,
        'can': 400,
        'dash': 0.3,
        'ounce': 30,
        'package': 250
    },
    'Condiments': {
        'cup': 240,
        'tablespoon': 15,
        'teaspoon': 5,
        'bottle': 500,
        'can': 400,
        'ounce': 30,
        'package': 250,
        'piece': 50
    },
    'Dairy': {
        'cup': 240,
        'tablespoon': 14.2,
        'ounce': 28.35,
        'package': 250,
        'piece': 50,
        'pound': 453.6,
        'stick': 113,
        'can': 400,
        'container': 250
    },
    'Fruits': {
        'cup': 150,
        'tablespoon': 10,
        'teaspoon': 5,
        'can': 400,
        'ounce': 28.35,
        'pint': 473,
        'quart': 946,
        'piece': 100
    },
    'Grains': {
        'cup': 185,
        'tablespoon': 13,
        'ounce': 28.35,
        'loaf': 500,
        'package': 250,
        'piece': 50,
        'pound': 453.6,
        'can': 400
    },
    'Herbs & Spices': {
        'cup': 25,
        'tablespoon': 6,
        'teaspoon': 2,
        'pinch': 0.3,
        'dash': 0.3,
        'sprig': 1,
        'cube': 5,
        'slice': 3,
        'ounce': 28.35,
        'package': 100,
        'piece': 2
    },
    'Legumes': {
        'cup': 200,
        'can': 400,
        'piece': 50
    },
    'Meat': {
        'cup': 225,
        'ounce': 28.35,
        'pound': 453.6,
        'piece': 150,
        'link': 75,
        'teaspoon': 5,
        'grams': 1
    },
    'Nuts': {
        'cup': 140,
        'package': 200,
        'pound': 453.6,
        'quarter cup': 35
    },
    'Oils': {
        'cup': 220,
        'tablespoon': 13.5,
        'teaspoon': 4.5,
        'quart': 946
    },
    'Seafood': {
        'cup': 225,
        'ounce': 28.35,
        'pound': 453.6,
        'piece': 150,
        'can': 400
    },
    'Vegetables': {
        'cup': 130,
        'ounce': 28.35,
        'package': 250,
        'piece': 80,
        'pound': 453.6,
        'teaspoon': 5,
        'can': 400,
        'head': 300,
        'bunch': 100,
        'pinch': 0.3,
        'grams': 1
    }
}

LIQUID_CATEGORIES = ["Beverages", "Condiments", "Oils"]
DISTINCT_UNITS = ["can", "package", "piece"]

def smart_round(quantity):
    if quantity < 10:
        return round(quantity)
    elif quantity < 100:
        return round(quantity / 5) * 5
    elif quantity < 1000:
        return round(quantity / 10) * 10
    else:
        return round(quantity / 50) * 50

def get_quantity_and_unit(ingredient):
    ing = ingredient.ingredient
    category = ing.category

    if category == "Herbs & Spices":
        return (0, "")
    
    if ingredient.unit in DISTINCT_UNITS or ingredient.unit == "grams":
        return (ingredient.quantity, ingredient.unit)

    if category in LIQUID_CATEGORIES:
        return (CATEGORY_UNIT_CONVERSIONS[category][ingredient.unit] * ingredient.quantity, "ml")
    
    return (CATEGORY_UNIT_CONVERSIONS[category][ingredient.unit] * ingredient.quantity, "grams")
    
