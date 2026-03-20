# rename_images.py
from pathlib import Path
import argparse


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument(
        "--folder",
        default=r"C:\Chukwudubanyi\Code\cu-bytes\machine-learning\data\test_data\hey_chef_carleton",
        help="Folder containing images to rename",
    )
    parser.add_argument(
        "--start", type=int, default=1, help="Starting image number (X)"
    )
    parser.add_argument(
        "--dry-run", action="store_true", help="Print changes without renaming"
    )
    args = parser.parse_args()

    folder = Path(args.folder)
    if not folder.exists():
        raise SystemExit(f"Folder not found: {folder}")

    files = [p for p in folder.iterdir() if p.is_file()]
    files.sort(key=lambda p: p.name.lower())

    base = "heychef"

    for idx, path in enumerate(files, start=args.start):
        ext = path.suffix  # includes the dot, e.g. ".jpg"
        new_name = f"image{idx}_{base}{ext}"
        target = folder / new_name

        if path.name == new_name:
            continue

        if target.exists():
            raise SystemExit(f"Target already exists, would overwrite: {target}")

        if args.dry_run:
            print(f"DRY: {path.name} -> {new_name}")
        else:
            path.rename(target)
            print(f"Renamed: {path.name} -> {new_name}")


if __name__ == "__main__":
    main()
