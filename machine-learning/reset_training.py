"""
Script to reset/clean up training artifacts (checkpoints, logs, etc.)
"""
import argparse
import shutil
from pathlib import Path
from typing import List


def reset_all(base_dir: Path = None):
    """Delete all training runs, checkpoints, and logs"""
    if base_dir is None:
        base_dir = Path(__file__).resolve().parent
    
    models_dir = base_dir / "models"
    
    if not models_dir.exists():
        print(f"Models directory does not exist: {models_dir}")
        return
    
    # Directories to clean
    runs_dir = models_dir / "runs"
    old_checkpoints_dir = models_dir / "checkpoints"
    old_best_model = models_dir / "best_model.pth"
    old_class_names = models_dir / "class_names.json"
    
    deleted = []
    
    # Remove runs directory (contains all new run-based checkpoints/logs)
    if runs_dir.exists():
        shutil.rmtree(runs_dir)
        deleted.append(str(runs_dir))
        print(f"Deleted: {runs_dir}")
    
    # Remove old checkpoint directory (legacy structure)
    if old_checkpoints_dir.exists():
        shutil.rmtree(old_checkpoints_dir)
        deleted.append(str(old_checkpoints_dir))
        print(f"Deleted: {old_checkpoints_dir}")
    
    # Remove old best_model.pth (legacy)
    if old_best_model.exists():
        old_best_model.unlink()
        deleted.append(str(old_best_model))
        print(f"Deleted: {old_best_model}")
    
    # Remove old class_names.json (legacy)
    if old_class_names.exists():
        old_class_names.unlink()
        deleted.append(str(old_class_names))
        print(f"Deleted: {old_class_names}")
    
    if deleted:
        print(f"\n✓ Reset complete! Deleted {len(deleted)} item(s)")
    else:
        print("\n✓ Nothing to reset - directories are already clean")


def reset_specific_run(run_name: str, base_dir: Path = None):
    """Delete a specific training run"""
    if base_dir is None:
        base_dir = Path(__file__).resolve().parent
    
    runs_dir = base_dir / "models" / "runs"
    run_dir = runs_dir / run_name
    
    if not run_dir.exists():
        print(f"Run directory does not exist: {run_dir}")
        print(f"Available runs:")
        if runs_dir.exists():
            for run in sorted(runs_dir.iterdir()):
                if run.is_dir():
                    print(f"  - {run.name}")
        return
    
    shutil.rmtree(run_dir)
    print(f"✓ Deleted run: {run_name}")


def list_runs(base_dir: Path = None):
    """List all training runs"""
    if base_dir is None:
        base_dir = Path(__file__).resolve().parent
    
    runs_dir = base_dir / "models" / "runs"
    
    if not runs_dir.exists():
        print("No runs directory found. No training runs exist yet.")
        return
    
    runs = [d for d in runs_dir.iterdir() if d.is_dir()]
    
    if not runs:
        print("No training runs found.")
        return
    
    print(f"Found {len(runs)} training run(s):\n")
    for run in sorted(runs, key=lambda x: x.name, reverse=True):
        # Try to read run summary if it exists
        summary_file = run / "run_summary.json"
        if summary_file.exists():
            import json
            try:
                with open(summary_file, "r") as f:
                    summary = json.load(f)
                model = summary.get("model_name", "unknown")
                best_acc = summary.get("best_val_acc", "N/A")
                epochs = summary.get("num_epochs", "N/A")
                print(f"  {run.name}")
                print(f"    Model: {model}, Best Val Acc: {best_acc:.2f}%, Epochs: {epochs}")
            except:
                print(f"  {run.name}")
        else:
            print(f"  {run.name}")


def main():
    parser = argparse.ArgumentParser(
        description="Reset or manage training runs and checkpoints"
    )
    parser.add_argument(
        "--all",
        action="store_true",
        help="Delete all training runs, checkpoints, and logs"
    )
    parser.add_argument(
        "--run",
        type=str,
        default=None,
        help="Delete a specific run by name (use --list to see available runs)"
    )
    parser.add_argument(
        "--list",
        action="store_true",
        help="List all training runs"
    )
    parser.add_argument(
        "--confirm",
        action="store_true",
        help="Skip confirmation prompt (use with caution!)"
    )
    
    args = parser.parse_args()
    
    if args.list:
        list_runs()
    elif args.run:
        if not args.confirm:
            response = input(f"Are you sure you want to delete run '{args.run}'? (yes/no): ")
            if response.lower() != "yes":
                print("Cancelled.")
                return
        reset_specific_run(args.run)
    elif args.all:
        if not args.confirm:
            response = input(
                "Are you sure you want to delete ALL training runs, checkpoints, and logs? "
                "This cannot be undone! (yes/no): "
            )
            if response.lower() != "yes":
                print("Cancelled.")
                return
        reset_all()
    else:
        parser.print_help()
        print("\nExamples:")
        print("  python reset_training.py --list              # List all runs")
        print("  python reset_training.py --run 20250122_120000_resnet50  # Delete specific run")
        print("  python reset_training.py --all               # Delete everything")


if __name__ == "__main__":
    main()
