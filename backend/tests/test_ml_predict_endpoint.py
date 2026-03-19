import os
from pathlib import Path

import pytest

import backend.services.ml_service as ml_service


REPO_ROOT = Path(__file__).resolve().parents[2]


def _list_images(folder: Path):
    exts = {".jpg", ".jpeg", ".png", ".webp"}
    if not folder.exists():
        return []
    return sorted(
        [p for p in folder.iterdir() if p.is_file() and p.suffix.lower() in exts]
    )


def _take_subset(images, max_images: int):
    # max_images <= 0 means "all"
    if max_images <= 0:
        return images
    return images[:max_images]


@pytest.fixture(scope="session")
def ml_images_root():
    """
    Default test images:
      machine-learning/data/evaluation_data

    Override with env var ML_TEST_IMAGES_DIR if you move the data.
    """
    root = os.getenv("ML_TEST_IMAGES_DIR")
    if root:
        return Path(root)
    return REPO_ROOT / "machine-learning" / "data" / "evaluation_data"


@pytest.fixture(scope="session")
def require_model_files():
    if not (ml_service.MODEL_PATH.exists() and ml_service.CLASS_NAMES_PATH.exists()):
        pytest.skip(
            "Model files missing. Expected "
            f"{ml_service.MODEL_PATH} and {ml_service.CLASS_NAMES_PATH}"
        )


@pytest.fixture(scope="session")
def max_images():
    # Keep tests fast. Set ML_TEST_MAX_IMAGES=0 to include all images.
    return int(os.getenv("ML_TEST_MAX_IMAGES", "100"))


@pytest.fixture(scope="session")
def non_food_min_low_conf_ratio():
    # Non-food images should usually be rejected by the confidence threshold.
    return float(os.getenv("ML_TEST_NONFOOD_MIN_LOW_CONF_RATIO", "0.7"))


def _post_image(client, image_path: Path):
    with open(image_path, "rb") as f:
        response = client.post(
            "/ml/predict",
            data={"image": (f, image_path.name)},
            content_type="multipart/form-data",
        )
    return response


def _assert_common_fields(payload: dict):
    assert "success" in payload
    assert "confidence" in payload
    assert 0 <= float(payload["confidence"]) <= 100


def _log_prediction(stage: str, image_path: Path, payload: dict):
    confidence = payload.get("confidence")
    success = payload.get("success")
    food_name = payload.get("food_name")
    reason = payload.get("reason")
    message = payload.get("message")

    print(
        f"[{stage}] {image_path.name} | success={success} confidence={confidence} "
        f"food_name={food_name} reason={reason} message={message}"
    )


def test_ml_predict_carleton_food_images_return_valid_response(
    client, ml_images_root: Path, require_model_files, max_images: int
):
    folder = ml_images_root / "hey_chef_carleton"
    images = _take_subset(_list_images(folder), max_images)
    if not images:
        pytest.skip(f"No images found in {folder}")

    print(f"[ENDPOINT] Carleton food folder: {folder} | images={len(images)}")

    success_true = 0
    for image_path in images:
        response = _post_image(client, image_path)
        assert response.status_code == 200

        payload = response.get_json()
        _log_prediction("ENDPOINT", image_path, payload)
        _assert_common_fields(payload)

        if payload["success"] is True:
            success_true += 1
            assert "food_name" in payload, f"Missing food_name for {image_path}"
            assert "calories" in payload, f"Missing calories for {image_path}"
        else:
            assert (
                payload.get("reason") == "low_confidence"
            ), f"Expected low_confidence for {image_path} but got {payload}"
            assert "message" in payload, f"Missing message for {image_path}"

    print(f"[ENDPOINT] Accepted (success=True): {success_true}/{len(images)}")
    assert success_true >= 1


def test_ml_predict_non_food_images_are_low_confidence(
    client,
    ml_images_root: Path,
    require_model_files,
    max_images: int,
    non_food_min_low_conf_ratio: float,
):
    folder = ml_images_root / "non_food"
    images = _take_subset(_list_images(folder), max_images)
    if not images:
        pytest.skip(f"No images found in {folder}")

    print(f"[ENDPOINT] Non-food folder: {folder} | images={len(images)}")

    low_conf_count = 0
    for image_path in images:
        response = _post_image(client, image_path)
        assert response.status_code == 200

        payload = response.get_json()
        _log_prediction("ENDPOINT", image_path, payload)
        _assert_common_fields(payload)

        if payload["success"] is False:
            assert (
                payload.get("reason") == "low_confidence"
            ), f"Expected low_confidence for {image_path} but got {payload}"
            low_conf_count += 1

    low_conf_ratio = low_conf_count / len(images)
    print(f"[ENDPOINT] Low-confidence (rejected): {low_conf_count}/{len(images)} ratio={low_conf_ratio}")
    assert low_conf_ratio >= non_food_min_low_conf_ratio


def test_ml_predict_general_food_images_return_valid_response(
    client, ml_images_root: Path, require_model_files, max_images: int
):
    folder = ml_images_root / "UPMC-Food101"
    images = _take_subset(_list_images(folder), max_images)
    if not images:
        pytest.skip(f"No images found in {folder}")

    print(f"[ENDPOINT] General foods folder: {folder} | images={len(images)}")

    success_true = 0
    for image_path in images:
        response = _post_image(client, image_path)
        assert response.status_code == 200

        payload = response.get_json()
        _log_prediction("ENDPOINT", image_path, payload)
        _assert_common_fields(payload)

        if payload["success"] is True:
            success_true += 1
            assert "food_name" in payload, f"Missing food_name for {image_path}"
            assert "calories" in payload, f"Missing calories for {image_path}"
        else:
            assert (
                payload.get("reason") == "low_confidence"
            ), f"Expected low_confidence for {image_path} but got {payload}"
            assert "message" in payload, f"Missing message for {image_path}"

    print(f"[ENDPOINT] Accepted (success=True): {success_true}/{len(images)}")
    assert success_true >= 1
