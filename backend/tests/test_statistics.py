# Project imports
from datetime import datetime, timedelta
from backend.tests.test_helpers import (
    seeded_food_data,
    seeded_users,
    seeded_food_categories,
    seeded_transactions,
)


def test_all_stats_invalid_user(client, seeded_users):
    # Test invalid usernames for all statistics endpoints that require username
    response = client.get("/statistics/daily/Alison")
    assert response.status_code == 400

    response = client.get("/statistics/aggregate/Alison")
    assert response.status_code == 400

    response = client.get("/statistics/comparative/Alison")
    assert response.status_code == 400


def test_all_stats_invalid_range(client, seeded_users):
    # Test invalid ranges for all statistics endpoints
    response = client.get("/statistics/daily/Alice?days=0")
    assert response.status_code == 400

    response = client.get("/statistics/aggregate/Alice?days=-7")
    assert response.status_code == 400

    response = client.get("/statistics/global?days=-1")
    assert response.status_code == 400

    response = client.get("/statistics/comparative/Alice?days=-9")
    assert response.status_code == 400


def test_all_stats_no_items_in_range(client, seeded_users):
    # Turn on show_stats for Alice
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Alice"},
    )

    # Query each endpoint that relies on having recorded transaction
    response = client.get("/statistics/daily/Alice?days=5")
    assert response.status_code == 204

    response = client.get("/statistics/aggregate/Alice?days=5")
    assert response.status_code == 204

    response = client.get("/statistics/comparative/Alice?days=5")
    assert response.status_code == 204


def test_all_stats_show_stats_off(
    client, seeded_users, seeded_food_data, seeded_food_categories
):
    # By default show stats is off

    # Log an item for Alice
    response = client.post(
        "/logging/log-by-id",
        json={"username": "Alice", "food_id": 1},
    )
    assert response.status_code == 200

    # Daily statistics should work
    response = client.get("/statistics/daily/Alice?days=5")
    assert response.status_code == 200

    # Aggregate statistics should work
    response = client.get("/statistics/aggregate/Alice?days=5")
    assert response.status_code == 200

    # Global statistics should work
    # Note that there are NO users with show stats on
    response = client.get("/statistics/global?days=5")
    assert response.status_code == 200

    # Should not be able to compare stats
    response = client.get("/statistics/comparative/Alice?days=5")
    assert response.status_code == 403


def test_all_stats_show_stats_on(
    client, seeded_users, seeded_food_data, seeded_food_categories
):
    # Turn on show_stats for Alice
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Alice"},
    )

    # Log an item for Alice
    response = client.post(
        "/logging/log-by-id",
        json={"username": "Alice", "food_id": 1},
    )
    assert response.status_code == 200

    # Daily statistics should work
    response = client.get("/statistics/daily/Alice?days=5")
    assert response.status_code == 200

    # Aggregate statistics should work
    response = client.get("/statistics/aggregate/Alice?days=5")
    assert response.status_code == 200

    # Global statistics should work
    response = client.get("/statistics/global?days=5")
    assert response.status_code == 200

    # Should not be able to compare stats
    response = client.get("/statistics/comparative/Alice?days=5")
    assert response.status_code == 200


def test_get_daily_statistics_success(
    client, seeded_users, seeded_food_data, seeded_food_categories, seeded_transactions
):
    response = client.get("/statistics/daily/Alice?days=3")
    assert response.status_code == 200

    data = response.get_json()
    assert isinstance(data, dict)
    assert len(data) == 3

    # Expected date keys (today, 1 day ago, 2 days ago)
    today = datetime.now().date()
    yesterday = today - timedelta(days=1)
    day_before = today - timedelta(days=2)

    today_key = today.isoformat()
    yesterday_key = yesterday.isoformat()
    day_before_key = day_before.isoformat()

    assert today_key in data
    assert yesterday_key in data
    assert day_before_key in data

    # Today: zero logs
    today_stats = data[today_key]
    assert today_stats["items_logged"] == 0
    assert today_stats["calories"] == 0
    assert today_stats["fat_g"] == 0.0
    assert today_stats["carbs_g"] == 0.0
    assert today_stats["proteins_g"] == 0.0
    assert today_stats["fiber_g"] == 0.0
    assert today_stats["sugar_g"] == 0.0

    # 1 day ago: 1 hamburger + 1 salad = 760 cal, etc.
    yesterday_stats = data[yesterday_key]
    assert yesterday_stats["items_logged"] == 2
    assert yesterday_stats["calories"] == 760
    assert abs(yesterday_stats["fat_g"] - 8.4) < 0.01
    assert abs(yesterday_stats["carbs_g"] - 84.0) < 0.01
    assert abs(yesterday_stats["proteins_g"] - 19.0) < 0.01
    assert abs(yesterday_stats["fiber_g"] - 13.6) < 0.01
    assert abs(yesterday_stats["sugar_g"] - 0.1) < 0.01

    # 2 days ago: 1 hamburger
    day_before_stats = data[day_before_key]
    assert day_before_stats["items_logged"] == 1
    assert day_before_stats["calories"] == 460
    assert abs(day_before_stats["fat_g"] - 4.2) < 0.01
    assert abs(day_before_stats["carbs_g"] - 42.0) < 0.01
    assert abs(day_before_stats["proteins_g"] - 9.5) < 0.01
    assert abs(day_before_stats["fiber_g"] - 6.8) < 0.01
    assert abs(day_before_stats["sugar_g"] - 0.0) < 0.01


def test_get_aggregate_statistics_success(
    client, seeded_users, seeded_food_data, seeded_food_categories, seeded_transactions
):
    # Test statistics for a full aggregation
    response = client.get("/statistics/aggregate/Alice?days=3")
    assert response.status_code == 200

    data = response.get_json()
    assert isinstance(data, dict)

    assert data["days_active"] == 2
    assert (
        data["items_logged"] == 3
    )  # hamburger and salad yesterday + hamburger two days ago
    assert data["total_calories"] == 1220
    assert abs(data["total_fat_g"] - 12.6) < 0.01
    assert abs(data["total_carbs_g"] - 126.0) < 0.01
    assert abs(data["total_protein_g"] - 28.5) < 0.01
    assert abs(data["total_fiber_g"] - 20.4) < 0.01
    assert abs(data["total_sugar_g"] - 0.1) < 0.01

    # Percentages sum ~100%
    percent_keys = [
        "percent_dairy",
        "percent_fruit_veg",
        "percent_grain",
        "percent_protein",
    ]
    total_percent = 0.0
    for key in percent_keys:
        total_percent += data[key]
    assert abs(total_percent - 100.0) < 0.1

    assert data["top_food"] == "Hamburger"
    assert data["top_dining_location"] == "Tim Hortons"

    # Test default days (should match because Alice consumed no new items)
    response2 = client.get("/statistics/aggregate/Alice")
    assert response2.status_code == 200

    data2 = response2.get_json()
    assert data == data2


def test_get_aggregate_statistics_small_window(
    client, seeded_users, seeded_food_data, seeded_food_categories, seeded_transactions
):
    # Test smaller window size (Window does not include all food items)
    response = client.get("/statistics/aggregate/Charlie?days=2")
    assert response.status_code == 200

    data = response.get_json()
    assert isinstance(data, dict)

    assert data["days_active"] == 1
    assert data["items_logged"] == 1  # banana bread one day ago
    assert data["total_calories"] == 600
    assert abs(data["total_fat_g"] - 0.3) < 0.01
    assert abs(data["total_carbs_g"] - 0.1) < 0.01
    assert abs(data["total_protein_g"] - 0.1) < 0.01
    assert abs(data["total_fiber_g"] - 0.1) < 0.01
    assert abs(data["total_sugar_g"] - 5.0) < 0.01

    # Percentages sum ~100%
    percent_keys = [
        "percent_dairy",
        "percent_fruit_veg",
        "percent_grain",
        "percent_protein",
    ]
    total_percent = 0.0
    for key in percent_keys:
        total_percent += data[key]
    assert abs(total_percent - 100.0) < 0.1

    assert data["top_food"] == "Banana Bread"
    assert data["top_dining_location"] == "Colonel by Chicken"


def test_get_global_statistics_success(
    client, seeded_users, seeded_food_data, seeded_food_categories, seeded_transactions
):
    # Test with only Alice having stats_sharing enabled
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Alice"},
    )

    response = client.get("/statistics/global?days=5")
    assert response.status_code == 200

    data = response.get_json()
    assert isinstance(data, dict)

    assert data["trending_item_1"] == "Hamburger"
    assert data["trending_item_2"] == "Caesar Salad"
    assert data["trending_item_3"] == "Unknown"
    assert data["trending_item_4"] == "Unknown"
    assert data["trending_item_5"] == "Unknown"
    assert data["trending_location_1"] == "Tim Hortons"
    assert data["trending_location_2"] == "Subway"
    assert data["trending_location_3"] == "Unknown"

    # Test default days (should match because Alice consumed no new items)
    response2 = client.get("/statistics/global")
    assert response2.status_code == 200

    data2 = response2.get_json()
    assert data == data2

    # Check case when show_stats is enabled for everyone
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Bob"},
    )
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Charlie"},
    )

    response3 = client.get("/statistics/global?days=5")
    assert response3.status_code == 200

    data3 = response3.get_json()
    assert isinstance(data3, dict)

    assert data3["trending_item_1"] == "Caesar Salad"
    assert data3["trending_item_2"] == "Hamburger"
    assert data3["trending_item_3"] == "Banana Bread"
    assert data3["trending_item_4"] == "Unknown"
    assert data3["trending_item_5"] == "Unknown"
    assert data["trending_location_1"] == "Tim Hortons"
    assert data["trending_location_2"] == "Subway"
    assert data["trending_location_3"] == "Unknown"


def test_get_comparative_statistics_success(
    client, seeded_users, seeded_food_data, seeded_food_categories, seeded_transactions
):
    # Turn on show stats for all users for best comparison
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Alice"},
    )
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Bob"},
    )
    client.post(
        "/profile/edit",
        json={"show_stats": True, "username": "Charlie"},
    )

    response = client.get("/statistics/comparative/Alice?days=3")
    assert response.status_code == 200

    data = response.get_json()
    print("Comparative stats 1:", data)
    assert isinstance(data, dict)

    assert data["balanced_food_groups_percentile"] == 100
    assert data["balanced_macronutrients_percentile"] == 100
    assert data["carbs_percentile"] == 50
    assert data["checkin_percentile"] == 100
    assert data["dairy_percentile"] == 100
    assert data["fat_percentile"] == 50
    assert data["fiber_percentile"] == 100
    assert data["food_logging_percentile"] == 100
    assert data["fruits_veg_percentile"] == 100
    assert data["grain_percentile"] == 50
    assert data["protein_fg_percentile"] == 50
    assert data["sugar_percentile"] == 100

    # Test default days - Difference is that Charlie consumed more food
    response2 = client.get("/statistics/comparative/Alice")
    assert response2.status_code == 200
    data2 = response2.get_json()
    print("Comparative stats 2:", data2)
    assert isinstance(data2, dict)

    assert data2["balanced_food_groups_percentile"] == 50
    assert data2["balanced_macronutrients_percentile"] == 100
    assert data2["carbs_percentile"] == 50
    assert data2["checkin_percentile"] == 100
    assert data2["dairy_percentile"] == 100
    assert data2["fat_percentile"] == 50
    assert data2["fiber_percentile"] == 50
    assert data2["food_logging_percentile"] == 100
    assert data2["fruits_veg_percentile"] == 100
    assert data2["grain_percentile"] == 0
    assert data2["protein_fg_percentile"] == 50
    assert data2["sugar_percentile"] == 100
