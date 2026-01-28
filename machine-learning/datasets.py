from pathlib import Path
from typing import Tuple, List, Optional, Dict
from torch.utils.data import Dataset, DataLoader
from torchvision import transforms
from PIL import Image
from config import Config
from scripts.food_category_matcher import load_food_categories, create_class_mapping


class GenericDataset(Dataset):
    """Generic dataset loader for class folders"""

    def __init__(
        self,
        root_dir: str,
        class_mapping: Dict[str, int],
        transform=None,
        split: Optional[str] = None,
        split_ratio: Optional[float] = None,
    ):
        self.root_dir = Path(root_dir)
        self.class_mapping = class_mapping
        self.transform = transform
        self.class_names = sorted(class_mapping.keys())

        image_extensions = [".jpg", ".jpeg", ".png", ".JPG", ".JPEG", ".PNG"]
        all_samples = []

        for class_name in class_mapping.keys():
            class_dir = self.root_dir / class_name
            if class_dir.exists() and class_dir.is_dir():
                for ext in image_extensions:
                    all_samples.extend(
                        [
                            (str(img_file), class_mapping[class_name])
                            for img_file in class_dir.glob(f"*{ext}")
                        ]
                    )

        if not all_samples:
            # Try case variations
            for class_name in class_mapping.keys():
                for variant in [
                    class_name,
                    class_name.lower(),
                    class_name.upper(),
                    class_name.title(),
                ]:
                    class_dir = self.root_dir / variant
                    if class_dir.exists() and class_dir.is_dir():
                        for ext in image_extensions:
                            all_samples.extend(
                                [
                                    (str(img_file), class_mapping[class_name])
                                    for img_file in class_dir.glob(f"*{ext}")
                                ]
                            )
                        break
        
        # Debug output if no samples found
        if not all_samples and len(class_mapping) > 0:
            print(f"    WARNING: No images found for any class in {self.root_dir}")
            print(f"    Checked {len(class_mapping)} classes")
            # Show what directories actually exist
            existing_dirs = [d.name for d in self.root_dir.iterdir() if d.is_dir() and not d.name.startswith('.')]
            if existing_dirs:
                print(f"    Found {len(existing_dirs)} directories: {existing_dirs[:5]}...")
            else:
                print(f"    No directories found in {self.root_dir}")

        split_path_obj = Path(split) if split else None
        if split_path_obj and split_path_obj.exists() and split_path_obj.is_file():
            with open(split, "r") as f:
                split_paths = set(line.strip() for line in f.readlines())
            
            print(f"    Loading split from {split}: {len(split_paths)} entries")
            print(f"    Found {len(all_samples)} total samples before filtering")
            
            # Normalize split paths (remove extensions for matching)
            split_paths_normalized = set()
            for sp in split_paths:
                # Add original
                split_paths_normalized.add(sp)
                # Add without extension
                split_paths_normalized.add(str(Path(sp).with_suffix('')))
                # Add just the filename
                split_paths_normalized.add(Path(sp).name)
                # Add filename without extension
                split_paths_normalized.add(Path(sp).stem)
            
            self.samples = []
            for path, label in all_samples:
                path_obj = Path(path)
                # Check multiple matching strategies
                if (path_obj.name in split_paths_normalized or
                    path_obj.stem in split_paths_normalized or
                    str(path_obj.relative_to(self.root_dir)) in split_paths_normalized or
                    str(path_obj.relative_to(self.root_dir).with_suffix('')) in split_paths_normalized):
                    self.samples.append((path, label))
            
            print(f"    Matched {len(self.samples)} samples after filtering")
            if len(self.samples) == 0 and len(all_samples) > 0:
                print(f"    WARNING: No samples matched! Sample split entries: {list(split_paths)[:3]}")
                print(f"    Sample image paths: {[Path(p).name for p, _ in all_samples[:3]]}")
        elif split and split_ratio and split in ["train", "val"]:
            import random

            random.seed(42)
            random.shuffle(all_samples)
            split_idx = int(len(all_samples) * split_ratio)
            self.samples = (
                all_samples[:split_idx] if split == "train" else all_samples[split_idx:]
            )
        else:
            self.samples = all_samples

    def __len__(self):
        return len(self.samples)

    def __getitem__(self, idx):
        image_path, label = self.samples[idx]
        try:
            image = Image.open(image_path).convert("RGB")
        except Exception:
            image = Image.new("RGB", (224, 224), color="black")
        if self.transform:
            image = self.transform(image)
        return image, label


class CombinedDataset(Dataset):
    """Combine multiple datasets"""

    def __init__(self, datasets: List[Dataset]):
        self.datasets = datasets
        self.cumulative_sizes = self._get_cumulative_sizes()

    def _get_cumulative_sizes(self):
        cumulative_sizes = []
        cumsum = 0
        for dataset in self.datasets:
            cumsum += len(dataset)
            cumulative_sizes.append(cumsum)
        return cumulative_sizes

    def __len__(self):
        return self.cumulative_sizes[-1] if self.cumulative_sizes else 0

    def __getitem__(self, idx):
        if idx < 0:
            if -idx > len(self):
                raise ValueError(
                    "Absolute value of index should not exceed dataset length"
                )
            idx = len(self) + idx

        dataset_idx = 0
        for i, size in enumerate(self.cumulative_sizes):
            if idx < size:
                dataset_idx = i
                break

        if dataset_idx > 0:
            idx = idx - self.cumulative_sizes[dataset_idx - 1]

        return self.datasets[dataset_idx][idx]


def get_data_transforms(image_size: int = 224, augment: bool = True):
    """Get data transforms for training and validation"""
    if augment:
        train_transform = transforms.Compose(
            [
                transforms.Resize((image_size, image_size)),
                transforms.RandomHorizontalFlip(p=0.5),
                transforms.RandomRotation(degrees=15),
                transforms.ColorJitter(
                    brightness=0.2, contrast=0.2, saturation=0.2, hue=0.1
                ),
                transforms.RandomResizedCrop(image_size, scale=(0.8, 1.0)),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]
                ),
            ]
        )
    else:
        train_transform = transforms.Compose(
            [
                transforms.Resize((image_size, image_size)),
                transforms.ToTensor(),
                transforms.Normalize(
                    mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]
                ),
            ]
        )

    val_transform = transforms.Compose(
        [
            transforms.Resize((image_size, image_size)),
            transforms.ToTensor(),
            transforms.Normalize(mean=[0.485, 0.456, 0.406], std=[0.229, 0.224, 0.225]),
        ]
    )

    return train_transform, val_transform


def create_data_loaders(config: Config, num_workers: Optional[int] = None):
    """
    Create data loaders from multiple datasets.
    All datasets are mapped to food_categories.json as the base food categories.
    """
    if num_workers is None:
        num_workers = 4 if config.GPU_AVAILABLE else 2

    train_transform, val_transform = get_data_transforms(config.IMAGE_SIZE)

    # Load food_categories.json as the base categories
    food_categories_file = Path(__file__).parent / "food_categories.json"
    food_categories = load_food_categories(food_categories_file)
    print(f"Loaded {len(food_categories)} base food categories from food_categories.json")
    
    # Create mapping from food category name to index
    # This will grow as we add new categories from datasets
    category_to_idx = {category: idx for idx, category in enumerate(food_categories)}
    next_category_idx = len(food_categories)

    train_datasets = []
    val_datasets = []
    
    # Track which categories are actually used across all datasets
    used_categories = set()

    for dataset_config in config.DATASETS_CONFIG:
        dataset_name = dataset_config.get("name", "unknown")
        dataset_path = Path(dataset_config["path"])
        metadata = dataset_config.get("metadata", {})

        if not dataset_path.exists():
            print(f"Warning: Dataset path does not exist: {dataset_path}")
            continue

        try:
            # Check for Food-101 structure (has meta/ folder)
            meta_dir = dataset_path / "meta"
            images_dir = dataset_path / "images"

            if meta_dir.exists() and images_dir.exists():
                # Food-101 structure: load classes from meta/classes.txt
                classes_file = meta_dir / "classes.txt"
                if classes_file.exists():
                    with open(classes_file, "r") as f:
                        available_classes = [line.strip() for line in f.readlines()]
                    dataset_path = images_dir  # Use images/ directory
                else:
                    available_classes = []
            else:
                # Standard class folders structure
                available_classes = [
                    d.name
                    for d in dataset_path.iterdir()
                    if d.is_dir() and not d.name.startswith(".")
                ]

            if not available_classes:
                for subdir in dataset_path.iterdir():
                    if subdir.is_dir() and not subdir.name.startswith("."):
                        sub_classes = [d.name for d in subdir.iterdir() if d.is_dir()]
                        if sub_classes:
                            dataset_path = subdir
                            available_classes = sub_classes
                            break

            if not available_classes:
                print(f"Warning: No class directories found in {dataset_path}")
                continue

            print(f"\nProcessing dataset: {dataset_name}")
            print(f"  Found {len(available_classes)} classes in dataset")
            
            # Map dataset classes to food_categories.json (existing + newly added)
            dataset_class_mapping = create_class_mapping(
                available_classes, food_categories, threshold=0.6
            )
            
            # Create class_mapping: dataset_folder_name -> food_category_index
            # Add new categories if they don't match well enough
            class_mapping = {}
            matched_count = 0
            added_count = 0
            
            for dataset_class in available_classes:
                # Get the mapped category name (or None if no match found)
                mapped_category = dataset_class_mapping.get(dataset_class)
                
                if mapped_category and mapped_category in category_to_idx:
                    # Use existing matched category
                    class_mapping[dataset_class] = category_to_idx[mapped_category]
                    used_categories.add(mapped_category)
                    matched_count += 1
                else:
                    # No good match found - add as new category
                    # Use the dataset class name as the new category
                    new_category = dataset_class
                    
                    # Normalize the name a bit (capitalize first letter of each word)
                    new_category = ' '.join(word.capitalize() for word in new_category.split())
                    
                    if new_category not in category_to_idx:
                        # Add to categories and mapping
                        category_to_idx[new_category] = next_category_idx
                        food_categories.append(new_category)
                        next_category_idx += 1
                        print(f"  Added new category: '{new_category}' (from '{dataset_class}')")
                    
                    class_mapping[dataset_class] = category_to_idx[new_category]
                    used_categories.add(new_category)
                    added_count += 1
            
            print(f"  Mapped {matched_count}/{len(available_classes)} to existing categories")
            print(f"  Added {added_count} new categories")
            
            if not class_mapping:
                print(f"  Warning: No classes could be processed for {dataset_name}, skipping dataset")
                continue

            # Handle Food-101 train/test split files
            train_split = None
            val_split = None
            if meta_dir.exists():
                train_file = meta_dir / "train.txt"
                test_file = meta_dir / "test.txt"
                if train_file.exists() and test_file.exists():
                    # Create split files with full image paths for GenericDataset
                    train_split_file = dataset_path.parent / "train_split.txt"
                    val_split_file = dataset_path.parent / "test_split.txt"

                    with open(train_file, "r") as f:
                        train_entries = [line.strip() for line in f.readlines()]
                    with open(test_file, "r") as f:
                        test_entries = [line.strip() for line in f.readlines()]

                    # Write full paths
                    with open(train_split_file, "w") as f:
                        for entry in train_entries:
                            class_name, img_name = entry.split("/")
                            f.write(f"{class_name}/{img_name}.jpg\n")
                    with open(val_split_file, "w") as f:
                        for entry in test_entries:
                            class_name, img_name = entry.split("/")
                            f.write(f"{class_name}/{img_name}.jpg\n")

                    train_split = str(train_split_file)
                    val_split = str(val_split_file)

            split_ratio = (
                metadata.get("train_split_ratio", 0.8) if not train_split else None
            )

            generic_train = GenericDataset(
                dataset_path,
                class_mapping,
                transform=train_transform,
                split=train_split if train_split else "train",
                split_ratio=split_ratio,
            )
            generic_val = GenericDataset(
                dataset_path,
                class_mapping,
                transform=val_transform,
                split=val_split if val_split else "val",
                split_ratio=split_ratio,
            )

            # Validate that datasets have samples
            train_samples = len(generic_train)
            val_samples = len(generic_val)
            
            print(f"  Train samples: {train_samples}, Validation samples: {val_samples}")
            
            if train_samples == 0 and val_samples == 0:
                print(f"  ERROR: No samples found for {dataset_name}!")
                print(f"  Dataset path: {dataset_path}")
                print(f"  Class mapping has {len(class_mapping)} classes")
                print(f"  Checking if class directories exist...")
                for class_name in list(class_mapping.keys())[:5]:  # Check first 5
                    class_dir = dataset_path / class_name
                    if class_dir.exists():
                        img_count = len(list(class_dir.glob("*.jpg")) + list(class_dir.glob("*.jpeg")) + list(class_dir.glob("*.png")))
                        print(f"    {class_name}: {img_count} images")
                    else:
                        print(f"    {class_name}: directory not found")
                continue
            
            if train_samples == 0:
                print(f"  WARNING: No training samples found for {dataset_name}, skipping train dataset")
            else:
                train_datasets.append(generic_train)
            
            if val_samples == 0:
                print(f"  WARNING: No validation samples found for {dataset_name}, skipping val dataset")
            else:
                val_datasets.append(generic_val)
        except Exception as e:
            print(f"Failed to load dataset {dataset_name}: {e}")
            import traceback
            traceback.print_exc()
            continue

    if not train_datasets:
        raise ValueError("No training datasets were successfully loaded! Check dataset paths and class mappings.")
    
    if not val_datasets:
        raise ValueError("No validation datasets were successfully loaded! Check dataset paths and class mappings.")

    combined_train = (
        CombinedDataset(train_datasets)
        if len(train_datasets) > 1
        else train_datasets[0]
    )
    combined_val = (
        CombinedDataset(val_datasets) if len(val_datasets) > 1 else val_datasets[0]
    )

    # Validate combined datasets have samples
    train_total = len(combined_train)
    val_total = len(combined_val)
    
    print(f"\nDataset Summary:")
    print(f"  Total training samples: {train_total}")
    print(f"  Total validation samples: {val_total}")
    
    if train_total == 0:
        raise ValueError(
            f"Combined training dataset is empty! "
            f"Check that dataset paths exist and contain images matching the class mappings."
        )
    
    if val_total == 0:
        raise ValueError(
            f"Combined validation dataset is empty! "
            f"Check that dataset paths exist and contain images matching the class mappings."
        )

    # Set config to use food_categories.json as the base + any newly added categories
    all_class_names = food_categories
    config.NUM_CLASSES = len(food_categories)
    config.ALL_CLASS_NAMES = all_class_names
    
    base_count = len(load_food_categories(food_categories_file))
    added_count = len(food_categories) - base_count
    
    print(f"\nUsing {len(food_categories)} total food categories:")
    print(f"  Base categories from food_categories.json: {base_count}")
    if added_count > 0:
        print(f"  New categories added from datasets: {added_count}")
    print(f"  Categories used across all datasets: {len(used_categories)}")

    train_loader = DataLoader(
        combined_train,
        batch_size=config.BATCH_SIZE,
        shuffle=True,
        num_workers=num_workers,
        pin_memory=True if config.GPU_AVAILABLE else False,
    )

    val_loader = DataLoader(
        combined_val,
        batch_size=config.BATCH_SIZE,
        shuffle=False,
        num_workers=num_workers,
        pin_memory=True if config.GPU_AVAILABLE else False,
    )

    return train_loader, val_loader, all_class_names
