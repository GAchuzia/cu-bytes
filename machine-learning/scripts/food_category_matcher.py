"""
Utility module for matching dataset class names to food_categories.json
"""
from pathlib import Path
from typing import List, Dict, Optional, Tuple
import json
from difflib import SequenceMatcher
import re


def load_food_categories(categories_file: Optional[Path] = None) -> List[str]:
    """Load food categories from food_categories.json"""
    if categories_file is None:
        # food_categories.json is in the parent directory (machine-learning/)
        categories_file = Path(__file__).parent.parent / "food_categories.json"
    
    if not categories_file.exists():
        raise FileNotFoundError(f"Food categories file not found: {categories_file}")
    
    # Try to load as JSON first
    try:
        with open(categories_file, "r", encoding="utf-8") as f:
            data = json.load(f)
            if isinstance(data, list):
                return [str(item).strip() for item in data if item.strip()]
            elif isinstance(data, dict) and "categories" in data:
                return [str(item).strip() for item in data["categories"] if item.strip()]
    except (json.JSONDecodeError, AttributeError):
        # If not JSON, read as plain text (one per line)
        with open(categories_file, "r", encoding="utf-8") as f:
            return [line.strip() for line in f if line.strip()]


def normalize_name(name: str) -> str:
    """Normalize a food name for comparison"""
    # Convert to lowercase
    name = name.lower()
    # Remove extra spaces
    name = re.sub(r'\s+', ' ', name)
    # Remove special characters but keep spaces and hyphens
    name = re.sub(r'[^\w\s-]', '', name)
    return name.strip()


def calculate_similarity(name1: str, name2: str) -> float:
    """Calculate similarity between two food names"""
    norm1 = normalize_name(name1)
    norm2 = normalize_name(name2)
    
    # Check for exact match
    if norm1 == norm2:
        return 1.0
    
    # Use SequenceMatcher for fuzzy matching
    similarity = SequenceMatcher(None, norm1, norm2).ratio()
    
    # Bonus for substring matches
    if norm1 in norm2 or norm2 in norm1:
        similarity = max(similarity, 0.85)
    
    # Check for word-level matches
    words1 = set(norm1.split())
    words2 = set(norm2.split())
    if words1 and words2:
        word_overlap = len(words1.intersection(words2)) / max(len(words1), len(words2))
        similarity = max(similarity, word_overlap * 0.9)
    
    return similarity


def match_to_category(
    dataset_class_name: str, 
    food_categories: List[str],
    threshold: float = 0.6
) -> Optional[Tuple[str, float]]:
    """
    Match a dataset class name to the closest food category
    
    Returns:
        Tuple of (matched_category, similarity_score) or None if no match above threshold
    """
    best_match = None
    best_similarity = 0.0
    
    for category in food_categories:
        similarity = calculate_similarity(dataset_class_name, category)
        if similarity > best_similarity:
            best_similarity = similarity
            best_match = category
    
    if best_similarity >= threshold:
        return (best_match, best_similarity)
    return None


def create_class_mapping(
    dataset_classes: List[str],
    food_categories: Optional[List[str]] = None,
    threshold: float = 0.6
) -> Dict[str, str]:
    """
    Create a mapping from dataset class names to food_categories.json names
    
    Returns:
        Dictionary mapping dataset_class -> food_category
    """
    if food_categories is None:
        food_categories = load_food_categories()
    
    mapping = {}
    used_categories = set()
    
    # First pass: exact matches
    for dataset_class in dataset_classes:
        normalized_dataset = normalize_name(dataset_class)
        for category in food_categories:
            if normalize_name(category) == normalized_dataset:
                mapping[dataset_class] = category
                used_categories.add(category)
                break
    
    # Second pass: fuzzy matches
    for dataset_class in dataset_classes:
        if dataset_class not in mapping:
            match_result = match_to_category(dataset_class, food_categories, threshold)
            if match_result:
                matched_category, similarity = match_result
                # Only use if category hasn't been used or it's a very good match
                if matched_category not in used_categories or similarity > 0.9:
                    mapping[dataset_class] = matched_category
                    used_categories.add(matched_category)
    
    return mapping


if __name__ == "__main__":
    # Test the matching function
    categories = load_food_categories()
    print(f"Loaded {len(categories)} food categories")
    
    # Test examples
    test_classes = ["pizza", "hamburger", "ice_cream", "fried rice", "chicken wings"]
    mapping = create_class_mapping(test_classes, categories)
    
    print("\nTest mappings:")
    for orig, mapped in mapping.items():
        print(f"  {orig} -> {mapped}")
