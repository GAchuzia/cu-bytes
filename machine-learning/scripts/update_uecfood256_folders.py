"""
Script to update folder names in UECFOOD256 to match category.txt names,
and then map them to food_categories.json names

To run:
    python scripts/update_uecfood256_folders.py --data-dir "data/UECFOOD256"
"""
from pathlib import Path
import shutil
from typing import Dict, List, Optional
from food_category_matcher import load_food_categories, create_class_mapping


def load_category_file(category_file: Path) -> Dict[int, str]:
    """
    Load category.txt file and return mapping of index -> category name
    UECFOOD256 category.txt format: tab-separated id and name, with header row
    """
    categories = {}
    with open(category_file, "r", encoding="utf-8") as f:
        lines = f.readlines()
        # Skip the header row (first line)
        for line in lines[1:]:
            line = line.strip()
            if not line:
                continue
            # Parse tab-separated values: id\tname
            parts = line.split('\t')
            if len(parts) >= 2:
                try:
                    category_id = int(parts[0].strip())
                    category_name = parts[1].strip()
                    categories[category_id] = category_name
                except (ValueError, IndexError):
                    # If parsing fails, skip this line
                    continue
            elif len(parts) == 1:
                # Fallback: if no tab, treat as single value (legacy format)
                try:
                    category_id = int(parts[0].strip())
                    # Use the full line as category name
                    categories[category_id] = line
                except ValueError:
                    continue
    return categories


def get_folder_to_category_mapping(
    data_dir: Path, category_file: Path
) -> Dict[str, str]:
    """
    Map folder names (typically numeric like 1, 2, 3...) to category names from category.txt
    """
    categories = load_category_file(category_file)
    folder_mapping = {}
    
    # Get all folders in data directory
    for folder in data_dir.iterdir():
        if folder.is_dir():
            folder_name = folder.name
            try:
                # Try to parse as integer index
                folder_idx = int(folder_name)
                if folder_idx in categories:
                    folder_mapping[folder_name] = categories[folder_idx]
            except ValueError:
                # If not numeric, assume it's already a category name
                folder_mapping[folder_name] = folder_name
    
    return folder_mapping


def update_folders(
    data_dir: Path,
    category_file: Optional[Path] = None,
    food_categories_file: Optional[Path] = None,
    dry_run: bool = False,
) -> Dict[str, str]:
    """
    Update folder names in UECFOOD256 to match category.txt, then map to food_categories.json
    
    Args:
        data_dir: Path to UECFOOD256 data directory
        category_file: Path to category.txt file (defaults to data_dir/category.txt)
        food_categories_file: Path to food_categories.json
        dry_run: If True, only print what would be done without actually renaming
    
    Returns:
        Dictionary mapping old_folder_name -> new_folder_name
    """
    if category_file is None:
        category_file = data_dir / "category.txt"
        # Also check parent directory
        if not category_file.exists():
            category_file = data_dir.parent / "category.txt"
    
    if not category_file.exists():
        raise FileNotFoundError(f"category.txt not found at {category_file}")
    
    # Load category mappings
    print(f"Loading categories from {category_file}")
    folder_to_category = get_folder_to_category_mapping(data_dir, category_file)
    print(f"Found {len(folder_to_category)} folders to process")
    
    # Load food categories
    food_categories = load_food_categories(food_categories_file)
    
    # Map category names to food_categories.json
    category_names = list(folder_to_category.values())
    category_mapping = create_class_mapping(category_names, food_categories, threshold=0.6)
    
    # Create final mapping: folder_name -> food_category_name
    final_mapping = {}
    rename_operations = []
    
    for folder_name, category_name in folder_to_category.items():
        # Use mapped category name if available, otherwise use original
        mapped_category = category_mapping.get(category_name, category_name)
        final_mapping[folder_name] = mapped_category
        
        if folder_name != mapped_category:
            rename_operations.append((folder_name, mapped_category))
    
    if dry_run:
        print("\n=== DRY RUN - No changes will be made ===\n")
    
    print(f"\nRenaming {len(rename_operations)} folders:")
    for old_name, new_name in rename_operations:
        old_path = data_dir / old_name
        new_path = data_dir / new_name
        
        if old_path.exists():
            print(f"  '{old_name}' -> '{new_name}'")
            
            if not dry_run:
                # Handle case where new_path already exists (merge?)
                if new_path.exists() and new_path != old_path:
                    print(f"    Warning: '{new_name}' already exists, skipping...")
                    continue
                
                try:
                    old_path.rename(new_path)
                except Exception as e:
                    print(f"    Error renaming {old_name}: {e}")
        else:
            print(f"  Warning: Folder '{old_name}' does not exist, skipping...")
    
    return final_mapping


if __name__ == "__main__":
    import argparse
    
    parser = argparse.ArgumentParser(
        description="Update UECFOOD256 folder names based on category.txt and food_categories.json"
    )
    parser.add_argument(
        "--data-dir",
        type=Path,
        default=None,
        help="Path to UECFOOD256 data directory (default: ./data/UECFOOD256)",
    )
    parser.add_argument(
        "--category-file",
        type=Path,
        default=None,
        help="Path to category.txt file (default: data_dir/category.txt)",
    )
    parser.add_argument(
        "--food-categories",
        type=Path,
        default=None,
        help="Path to food_categories.json (default: ./food_categories.json)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Show what would be done without actually renaming folders",
    )
    
    args = parser.parse_args()
    
    # Base directory is the parent of scripts (machine-learning/)
    base_dir = Path(__file__).parent.parent
    
    # Default paths
    if args.data_dir is None:
        # data directory is in parent directory (machine-learning/)
        args.data_dir = base_dir / "data" / "UECFOOD256"
    else:
        # If a relative path is provided, resolve it relative to base_dir
        if not args.data_dir.is_absolute():
            args.data_dir = base_dir / args.data_dir
    
    # Default food_categories.json path (in parent directory)
    if args.food_categories is None:
        args.food_categories = base_dir / "food_categories.json"
    else:
        # If a relative path is provided, resolve it relative to base_dir
        if args.food_categories and not args.food_categories.is_absolute():
            args.food_categories = base_dir / args.food_categories
    
    # Also handle category_file if it's a relative path
    if args.category_file and not args.category_file.is_absolute():
        args.category_file = base_dir / args.category_file
    
    if not args.data_dir.exists():
        print(f"Error: Data directory does not exist: {args.data_dir}")
        print("Please download UECFOOD256 dataset first or specify --data-dir")
        exit(1)
    
    try:
        mapping = update_folders(
            args.data_dir,
            args.category_file,
            args.food_categories,
            dry_run=args.dry_run,
        )
        print(f"\nCompleted! Mapped {len(mapping)} folders.")
    except Exception as e:
        print(f"Error: {e}")
        exit(1)
