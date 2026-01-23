import requests

# Test script that queries each of the real food-item endpoints
# Instructions:
#   1. Start the backend server
#   2. In a new terminal navigate to this directory
#   3. Run the test: python test_real_browse_endpoints.py
#
#   Note: Sometimes item_id 1 will timeout. Do not worry about it.

BASE_URL = "http://127.0.0.1:5000/browse/food-item"
MAX_ITEMS = 660  # Change this to match the total number of food items


def main():
    bad_items = []  # Keep track of problematic item ids

    print(f"Querying {MAX_ITEMS} endpoints. Please wait...")

    for item_id in range(1, MAX_ITEMS + 1):
        url = f"{BASE_URL}/{item_id}"

        try:
            response = requests.get(url, timeout=2)

            if response.status_code != 200:
                print(f"Item {item_id} failed with status code {response.status_code}")
                bad_items.append(item_id)

        except requests.exceptions.RequestException as e:
            print(f"Item {item_id} request error: {e}")
            bad_items.append(item_id)

    # Output the final result
    if len(bad_items) == 0:
        print(f"PASS: All item_ids from 1 to {MAX_ITEMS} returned HTTP 200")
    else:
        print(f"FAIL: The following item_ids failed: {bad_items}")


if __name__ == "__main__":
    main()
