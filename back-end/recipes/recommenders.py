from django.db.models import F, Value, FloatField, Case, When, ExpressionWrapper
from django.db.models.functions import Log
from recipes.models import Recipe
import math

def get_popular_recipes(n=10, weight_rating=1.0, weight_count=0.5):
    safe_rating_count = Case(
        When(rating_count__gt=0, then=F('rating_count')),
        default=Value(0),
        output_field=FloatField()
    )
    
    log_count = Case(
        When(rating_count__gt=0, then=Log(safe_rating_count + Value(1), math.e)),
        default=Value(0),
        output_field=FloatField()
    )
    
    popularity_score = ExpressionWrapper(
        F('rating') * Value(weight_rating, output_field=FloatField()) + 
        log_count * Value(weight_count, output_field=FloatField()),
        output_field=FloatField()
    )
    
    recipes = Recipe.objects.annotate(
        popularity_score=popularity_score
    ).order_by('-popularity_score')[:n]
    
    return recipes