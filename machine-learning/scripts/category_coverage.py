from pathlib import Path
try:
    # When running from the machine-learning folder with `python -m scripts.category_coverage`
    from scripts.food_category_matcher import create_class_mapping, load_food_categories
except ModuleNotFoundError:
    # When running the file directly with `python scripts/category_coverage.py`
    from food_category_matcher import create_class_mapping, load_food_categories

FOOD101_CLASSES_FILE = Path("data/food-101/meta/classes.txt")
UEC_CLASSES_DIR = Path("data/UECFOOD256")

# controls name matching between food-101 and UECFOOD256
THRESHOLD = 1

food_categories = load_food_categories(Path("food_categories.json"))

food101_classes = []
with open(FOOD101_CLASSES_FILE, "r", encoding="utf-8") as f:
    food101_classes = [line.strip() for line in f if line.strip()]

uec_classes = [
    d.name
    for d in UEC_CLASSES_DIR.iterdir()
    if d.is_dir() and not d.name.startswith(".")
]

mapping_101 = create_class_mapping(
    food101_classes, food_categories, threshold=THRESHOLD
)
mapping_uec = create_class_mapping(
    uec_classes, food_categories, threshold=THRESHOLD
)

covered_categories_101 = set(mapping_101.values())
covered_categories_uec = set(mapping_uec.values())

overlap_categories = covered_categories_101 & covered_categories_uec
covered_by_any_dataset = covered_categories_101 | covered_categories_uec

base_categories_not_added = sorted(set(food_categories) - covered_by_any_dataset)


def print_section(title: str):
    bar = "=" * 80
    print()
    print(bar)
    print(title)
    print(bar)

print_section("SUMMARY")
print(f"Base categories: {len(food_categories)}")
print(f"Food-101 covered categories: {len(covered_categories_101)}")
print(f"UEC-256 covered categories: {len(covered_categories_uec)}")
print(f"Overlap between Food-101 and UEC-256: {len(overlap_categories)}")
print(f"Base categories not added by either: {len(base_categories_not_added)}")

print_section(f"BASE CATEGORIES ({len(food_categories)})")
for c in sorted(food_categories):
    print(c)

print_section(f"FOOD-101 COVERED CATEGORIES ({len(covered_categories_101)})")
for c in sorted(covered_categories_101):
    print(c)

print_section(f"UEC-256 COVERED CATEGORIES ({len(covered_categories_uec)})")
for c in sorted(covered_categories_uec):
    print(c)

print_section(f"OVERLAP BETWEEN FOOD-101 AND UEC-256 ({len(overlap_categories)})")
for c in sorted(overlap_categories):
    print(c)

print_section(f"BASE CATEGORIES NOT ADDED BY EITHER ({len(base_categories_not_added)})")
for c in sorted(base_categories_not_added):
    print(c)