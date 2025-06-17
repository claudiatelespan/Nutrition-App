from django.db.models import F, Value, FloatField, Case, When, ExpressionWrapper
from django.db.models.functions import Log
from recipes.models import Recipe, RecipeRating
import math
import numpy as np

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

def cosine_similarity(vec1, vec2):
    """Compute cosine similarity between two 1-D numpy arrays."""
    if np.linalg.norm(vec1) == 0 or np.linalg.norm(vec2) == 0:
        return 0.0
    return np.dot(vec1, vec2) / (np.linalg.norm(vec1) * np.linalg.norm(vec2))

def get_recipes_by_content(user_id, top_n=10, rating_threshold=4):
    user_ratings = RecipeRating.objects.filter(user_id=user_id, rating__gte=rating_threshold)
    
    if not user_ratings.exists():
        return Recipe.objects.none()
    
    vectors = []
    for ur in user_ratings:
        recipe = ur.recipe
        if not recipe.content_vector:
            continue
        vec = np.array(recipe.content_vector)
        vectors.append(vec)
    
    if not vectors:
        return Recipe.objects.none()
    
    user_profile = np.mean(vectors, axis=0)
    
    rated_recipe_ids = user_ratings.values_list('recipe_id', flat=True)
    candidates = Recipe.objects.exclude(id__in=rated_recipe_ids).exclude(content_vector__isnull=True)
    
    scored_candidates = []
    for candidate in candidates:
        candidate_vec = np.array(candidate.content_vector)
        sim = cosine_similarity(user_profile, candidate_vec)
        scored_candidates.append((candidate, sim))
    
    scored_candidates.sort(key=lambda x: x[1], reverse=True)
    
    recommended_recipes = [r[0] for r in scored_candidates[:top_n]]
    
    return recommended_recipes

from django.db.models import Max, Min

def get_combined_recommendations(user_id, top_n=10, rating_threshold=3, alpha=0.7):
    user_ratings = RecipeRating.objects.filter(user_id=user_id, rating__gte=rating_threshold)
    if not user_ratings.exists():
        return Recipe.objects.none()
    
    vectors = []
    weights = []
    for ur in user_ratings:
        if not ur.recipe.content_vector:
            continue
        vec = np.array(ur.recipe.content_vector)
        weight = ur.rating
        vectors.append(vec * weight)
        weights.append(weight)
    if not vectors:
        return Recipe.objects.none()
    
    user_profile = np.sum(vectors, axis=0) / sum(weights)
    
    rated_recipe_ids = user_ratings.values_list('recipe_id', flat=True)
    candidates = Recipe.objects.exclude(id__in=rated_recipe_ids).exclude(content_vector__isnull=True)
    
    from django.db.models import F, Value, FloatField, Case, When, ExpressionWrapper
    from django.db.models.functions import Log
    import math
    
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
        F('rating') * Value(1.0, output_field=FloatField()) + 
        log_count * Value(0.5, output_field=FloatField()),
        output_field=FloatField()
    )
    candidates = candidates.annotate(popularity_score=popularity_score)
    
    pop_minmax = candidates.aggregate(min_pop=Min('popularity_score'), max_pop=Max('popularity_score'))
    min_pop = pop_minmax['min_pop'] or 0
    max_pop = pop_minmax['max_pop'] or 1
    
    scored_candidates = []
    
    for candidate in candidates:
        candidate_vec = np.array(candidate.content_vector)
        content_sim = cosine_similarity(user_profile, candidate_vec)
        
        if max_pop - min_pop == 0:
            pop_norm = 0
        else:
            pop_norm = (candidate.popularity_score - min_pop) / (max_pop - min_pop)
        
        final_score = alpha * content_sim + (1 - alpha) * pop_norm
        scored_candidates.append((candidate, final_score))
    
    scored_candidates.sort(key=lambda x: x[1], reverse=True)
    return [r[0] for r in scored_candidates[:top_n]]
