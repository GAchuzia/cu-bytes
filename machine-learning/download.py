import urllib.request
import tarfile
import zipfile
import shutil
from pathlib import Path
from typing import Optional, Dict, Any
import json


def download_dataset(
    url: str,
    data_dir: Path,
    filename: Optional[str] = None,
    extract_to: Optional[str] = None,
    fix_nested: bool = True,
) -> str:
    """Download and extract any dataset"""
    if not url or url.strip() == "":
        raise ValueError("URL cannot be empty")

    data_dir.mkdir(parents=True, exist_ok=True)

    if filename is None:
        filename = url.split("/")[-1]
        if not filename or "." not in filename:
            raise ValueError("Cannot determine filename from URL")

    archive_path = data_dir / filename

    if extract_to is None:
        extract_to = filename
        for ext in [".tar.gz", ".tgz", ".tar", ".zip", ".gz"]:
            if extract_to.endswith(ext):
                extract_to = extract_to[: -len(ext)]
                break
        if extract_to.endswith(".tar"):
            extract_to = extract_to[:-4]

    extracted_dir = data_dir / extract_to

    if not archive_path.exists():
        print(f"Downloading {filename}...")
        try:
            urllib.request.urlretrieve(url, archive_path)
            print("Download complete!")
        except Exception as e:
            print(f"Download failed: {e}")
            raise

    # Check if already extracted (with different possible names)
    has_content = False
    possible_names = [
        extract_to,
        extract_to.replace("_", "").upper(),  # uec_food100 -> UECFOOD100
        extract_to.replace("_", "-"),  # uec_food100 -> uec-food100
        extract_to.upper(),  # uec_food100 -> UEC_FOOD100
        extract_to.replace("_", ""),  # uec_food100 -> uecfood100
    ]

    # Also check for common variations in data directory
    for item in data_dir.iterdir():
        if item.is_dir():
            item_lower = item.name.lower().replace("_", "").replace("-", "")
            extract_lower = extract_to.lower().replace("_", "").replace("-", "")
            if item_lower == extract_lower:
                check_dir = item
                items = list(check_dir.iterdir())
                if items and any(
                    item_file.is_file()
                    or (item_file.is_dir() and any(item_file.iterdir()))
                    for item_file in items
                ):
                    has_content = True
                    extracted_dir = check_dir
                    break

    if not has_content:
        print(f"Extracting to {extracted_dir}...")
        if extracted_dir.exists():
            shutil.rmtree(extracted_dir)

        if filename.endswith(".tar.gz") or filename.endswith(".tgz"):
            with tarfile.open(archive_path, "r:gz") as tar:
                tar.extractall(data_dir)
        elif filename.endswith(".tar"):
            with tarfile.open(archive_path, "r:") as tar:
                tar.extractall(data_dir)
        elif filename.endswith(".zip"):
            with zipfile.ZipFile(archive_path, "r") as zip_ref:
                zip_ref.extractall(data_dir)
        else:
            raise ValueError(f"Unsupported archive format: {filename}")

        print("Extraction complete!")

        # Find what was actually extracted (might have different name)
        actual_extracted = None
        for item in data_dir.iterdir():
            if item.is_dir() and item.name != archive_path.stem:
                # Check if this looks like our extracted dataset by comparing normalized names
                item_norm = item.name.lower().replace("_", "").replace("-", "")
                extract_norm = extract_to.lower().replace("_", "").replace("-", "")
                if item_norm == extract_norm:
                    actual_extracted = item
                    break

        # Rename to expected name if different
        if actual_extracted and actual_extracted != extracted_dir:
            if not extracted_dir.exists():
                print(f"Renaming {actual_extracted.name} to {extract_to}...")
                actual_extracted.rename(extracted_dir)
            else:
                # If both exist, use the one that looks more correct
                actual_items = (
                    list(actual_extracted.iterdir())
                    if actual_extracted.exists()
                    else []
                )
                extracted_items = (
                    list(extracted_dir.iterdir()) if extracted_dir.exists() else []
                )
                if len(actual_items) > len(extracted_items):
                    print(f"Using {actual_extracted.name} (more content found)")
                    extracted_dir = actual_extracted
                elif extracted_dir.exists():
                    extracted_dir = extracted_dir
                else:
                    extracted_dir = actual_extracted

        # Fix nested structure
        if fix_nested and extracted_dir.exists():
            items = list(extracted_dir.iterdir())
            # Check for nested directory
            if len(items) == 1 and items[0].is_dir():
                nested_dir = items[0]
                nested_norm = nested_dir.name.lower().replace("_", "").replace("-", "")
                extract_norm = extract_to.lower().replace("_", "").replace("-", "")
                # Only fix if nested name matches expected name
                if nested_norm == extract_norm or len(items) == 1:
                    print("Fixing nested directory structure...")
                    for item in nested_dir.iterdir():
                        dest_path = extracted_dir / item.name
                        if dest_path.exists():
                            (
                                shutil.rmtree(dest_path)
                                if dest_path.is_dir()
                                else dest_path.unlink()
                            )
                        shutil.move(str(item), str(dest_path))
                    nested_dir.rmdir()

    # Verify final path exists - if not, try to find it
    if not extracted_dir.exists():
        # Last resort: find any directory that might be our dataset
        extract_norm = extract_to.lower().replace("_", "").replace("-", "")
        for item in data_dir.iterdir():
            if item.is_dir():
                item_norm = item.name.lower().replace("_", "").replace("-", "")
                if item_norm == extract_norm:
                    extracted_dir = item
                    print(f"Found dataset at {extracted_dir.name}")
                    break

    if not extracted_dir.exists():
        raise FileNotFoundError(
            f"Extracted directory not found at {extracted_dir}. "
            f"Please check the archive contents manually."
        )

    return str(extracted_dir)


def download_food101_data(data_dir: Path) -> str:
    """Download Food-101 dataset"""
    return download_dataset(
        url="http://data.vision.ee.ethz.ch/cvl/food-101.tar.gz",
        data_dir=data_dir,
        filename="food-101.tar.gz",
        extract_to="food-101",
    )


def load_datasets_config(config_path: Optional[Path] = None) -> Dict[str, Any]:
    """Load datasets configuration from JSON file"""
    if config_path is None:
        config_path = Path(__file__).resolve().parent / "datasets_config.json"

    if not config_path.exists():
        raise FileNotFoundError(f"Datasets config file not found: {config_path}")

    with open(config_path, "r") as f:
        return json.load(f)


def download_all_datasets(
    data_dir: Path, config_path: Optional[Path] = None
) -> Dict[str, str]:
    """Download all enabled datasets from config file"""
    config = load_datasets_config(config_path)
    datasets = config.get("datasets", [])
    downloaded_paths = {}

    print(f"\n{'='*60}")
    print("Downloading All Configured Datasets")
    print(f"{'='*60}\n")

    for dataset_info in datasets:
        if not dataset_info.get("enabled", True):
            continue

        name = dataset_info["name"]
        display_name = dataset_info.get("display_name", name)
        url = dataset_info.get("url", "").strip()

        print(f"Processing {display_name}...")

        if not url:
            print(f"Warning: No URL provided. Skipping.")
            continue

        try:
            dataset_path = download_dataset(
                url=url,
                data_dir=data_dir,
                filename=dataset_info.get("filename"),
                extract_to=dataset_info.get("extract_to"),
            )
            downloaded_paths[name] = dataset_path
            print(f"Successfully downloaded {display_name} to: {dataset_path}")
        except Exception as e:
            print(f"Failed to download {display_name}: {e}")

    print(f"\n{'='*60}")
    print(f"Downloaded {len(downloaded_paths)} dataset(s) successfully")
    print(f"{'='*60}\n")

    return downloaded_paths
