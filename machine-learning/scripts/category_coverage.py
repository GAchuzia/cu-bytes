from pathlib import Path
try:
    # When running from the machine-learning folder with `python -m scripts.category_coverage`
    from scripts.food_category_matcher import create_class_mapping, load_food_categories
except ModuleNotFoundError:
    # When running the file directly with `python scripts/category_coverage.py`
    from food_category_matcher import create_class_mapping, load_food_categories

FOOD101_CLASSES_FILE = Path("data/food-101/meta/classes.txt")
UEC_CLASSES_DIR = Path("data/UECFOOD256")

THRESHOLD = 0.92

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
uec_only_categories = covered_categories_uec - covered_categories_101

missing_from_food101 = sorted(set(food_categories) - covered_categories_101)

print(f"Base categories (food_categories.json): {len(food_categories)}")
print(f"Food-101 covered categories: {len(covered_categories_101)}")
print(f"UEC-256 covered categories: {len(covered_categories_uec)}")
print(f"Overlap (covered by both): {len(overlap_categories)}")
print(f"UEC-only (not covered by Food-101): {len(uec_only_categories)}")
print()

print(f"Missing from Food-101 (for reference): {len(missing_from_food101)}")
for c in missing_from_food101:
    print(c)

print()
print("Overlap categories:")
for c in sorted(overlap_categories):
    print(c)

print()
print("UEC-only categories:")
for c in sorted(uec_only_categories):
    print(c)

# Which UEC class folders to use when you want "UEC-only" add-on data.
# Rule: include UEC class folders whose mapped base category is in uec_only_categories.
uec_classes_include = sorted(
    [
        cls
        for cls in uec_classes
        if cls in mapping_uec and mapping_uec[cls] in uec_only_categories
    ]
)

uec_classes_exclude = sorted(
    [
        cls
        for cls in uec_classes
        if cls in mapping_uec and mapping_uec[cls] in covered_categories_101
    ]
)

uec_classes_unmapped = sorted(
    [cls for cls in uec_classes if cls not in mapping_uec]
)

print()
print(
    f"UEC class folders to INCLUDE (mapped to UEC-only categories): {len(uec_classes_include)}"
)
for c in uec_classes_include:
    print(c)

print()
print(
    f"UEC class folders to EXCLUDE (mapped to categories already covered by Food-101): {len(uec_classes_exclude)}"
)
for c in uec_classes_exclude:
    print(c)

print()
print(
    f"UEC class folders UNMAPPED (no base-category match at threshold={THRESHOLD}): {len(uec_classes_unmapped)}"
)
for c in uec_classes_unmapped:
    print(c)