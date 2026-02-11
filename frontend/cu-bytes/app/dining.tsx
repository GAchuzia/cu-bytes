import { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator, Alert, Modal } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { useUser } from './context';
import { styles } from "./styles/style-dining";

export default function DiningScreen() {

    const [loading, setLoading] = useState(true);
    const [diningLocationsVisible, setDiningLocationsVisible] = useState(true);
    const [foodItemsVisible, setFoodItemsVisible] = useState(true);
    const [modalVisible, setModalVisible] = useState(false);
    const [isBackPressed, setIsBackPressed] = useState(false);
    const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);
    const [isSearchPressed, setIsSearchPressed] = useState(false);

    /*
        Variables used to store a copy of the logged-in user's username and profile settings
    */
    const
        {
            usernameGlobal,
            hasEggAllergyGlobal,
            hasFishOrShellfishAllergyGlobal,
            hasDairyIntoleranceGlobal,
            hasMilkAllergyGlobal,
            hasPeanutAllergyGlobal,
            hasSesameAllergyGlobal,
            hasSoyAllergyGlobal,
            hasTreenutAllergyGlobal,
            hasWheatAllergyGlobal,
            hasGlutenAllergyGlobal,
            isVeganGlobal,
            isVegetarianGlobal,
            prefersHalalGlobal,
            setUsernameGlobal,
            setShowStatsGlobal,
            setHasEggAllergyGlobal,
            setHasFishOrShellfishAllergyGlobal,
            setHasDairyIntoleranceGlobal,
            setHasMilkAllergyGlobal,
            setHasPeanutAllergyGlobal,
            setHasSesameAllergyGlobal,
            setHasSoyAllergyGlobal,
            setHasTreenutAllergyGlobal,
            setHasWheatAllergyGlobal,
            setHasGlutenAllergyGlobal,
            setIsVeganGlobal,
            setIsVegetarianGlobal,
            setPrefersHalalGlobal

        } = useUser();

    /*
        Variable and setter for storing and modifying the selected food item
        Initialize the default key values for the food item
        This ensures that the key values can be accessed without raising errors
    */
    const [foodItem, setFoodItem] = useState(
        {
            "calories": -1,
            "carbs_g": 0.00,
            "comments": "",
            "cost": 0.00,
            "dining_location": "",
            "fat_g": 0.00,
            "fiber_g": 0.00,
            "food_category": "",
            "has_eggs": null,
            "has_fish_or_shellfish": null,
            "has_milk": null,
            "has_peanuts": null,
            "has_sesame": null,
            "has_soy": null,
            "has_treenuts": null,
            "has_wheat": null,
            "id": -1, // Initial value of 1 to prevent errors
            "is_dairy_free": null,
            "is_gluten_free": null,
            "is_halal": null,
            "is_vegan": null,
            "is_vegetarian": null,
            "last_updated": "",
            "name": "",
            "proteins_g": 0.00,
            "sugar_g": 0.00
        }
    );

    /*
        Variable and setter for storing food items retrieved from the backend database
        When the page is loaded, every food item from the backend database is retrieved and stored in the array
    */
    const [foodItemArray, setFoodItemArray] = useState([]);

    /*
        Variable and setter for storing food items retrieved from the backend database
        Every time the user searches for a food item by name,
        Every food item whose name includes the entered string is stored in the filtered array
    */
    const [filteredFoodItemArray, setFilteredFoodItemArray] = useState([]);

    /*
        Calculate how to display the calories of the selected food item
        If the value of the calories key is -1, then there is an "Unknown" number of calories
        If the value of the calories key is not -1, then the displayed calorie amount is equal to that of the calories key value

        param(s):
            calories - number : The number of calories of the selected food item, as per the calorie key value

        returns : The calories value of the selected food item
    */
    function processFoodItemCalories(calories: number) {

        if (calories == -1) {
            return "Unknown"
        }
        else {
            return calories;
        }
    }

    /*
        Calculate how to display the cost of the selected food item
        If the value of the cost key is -1, then there is an "Unknown" cost for the food item
        If the value of the cost key is not -1, then the displayed cost is equal to that of the cost key value

        param(s):
            cost - number : The cost of the selected food item, as per the cost key value

        returns : The cost of the selected food item
    */
   function processFoodItemCost(cost: number) {

        if (cost == -1) {
            return "Unknown"
        }
        else {
            return cost
        }
   }

    /*
        Calculate how to display the amount of carbs for the selected food item
        If the value of the carbs_g key is -1, then there is an "Unknown" amount of carbs for the food item
        If the value of the carbs_g key is not -1, then the displayed amount of carbs is equal to that of the carbs_g key value

        param(s):
            carbs - number : The amount of carbs in grams for the selected food item, as per the carbs_g key value

        returns : The amount of carbs for the selected food item
    */
   function processFoodItemCarbs(carbs: number) {

        if (carbs == -1) {
            return "Unknown"
        }
        else {
            return carbs
        }
   }

    /*
        Calculate how to display the amount of fat for the selected food item
        If the value of the fat_g key is -1, then there is an "Unknown" amount of fat for the food item
        If the value of the fat_g key is not -1, then the displayed amount of fat is equal to that of the fat_g key value

        param(s):
            fat - number : The amount of fat in grams for the selected food item, as per the fat key value

        returns : The amount of fat for the selected food item
    */
   function processFoodItemFat(fat: number) {

        if (fat == -1) {
            return "Unknown"
        }
        else {
            return fat
        }
   }

    /*
        Calculate how to display the amount of fiber for the selected food item
        If the value of the fiber_g key is -1, then there is an "Unknown" amount of fiber for the food item
        If the value of the fiber_g key is not -1, then the displayed amount of fiber is equal to that of the fiber_g key value

        param(s):
            fiber - number : The amount of fiber in grams for the selected food item, as per the fiber key value

        returns : The amount of fiber for the selected food item
    */
   function processFoodItemFiber(fiber: number) {

        if (fiber == -1) {
            return "Unknown"
        }
        else {
            return fiber
        }
   }

    /*
        Calculate how to display the amount of proteins for the selected food item
        If the value of the proteins_g key is -1, then there is an "Unknown" amount of proteins for the food item
        If the value of the proteins_g key is not -1, then the displayed amount of proteins is equal to that of the proteins_g key value

        param(s):
            proteins - number : The amount of proteins in grams for the selected food item, as per the proteins key value

        returns : The amount of proteins for the selected food item
    */
   function processFoodItemProteins(proteins: number) {

        if (proteins == -1) {
            return "Unknown"
        }
        else {
            return proteins
        }
   }

    /*
        Calculate how to display the amount of sugar for the selected food item
        If the value of the sugar_g key is -1, then there is an "Unknown" amount of sugar for the food item
        If the value of the sugar_g key is not -1, then the displayed amount of sugar is equal to that of the sugar_g key value

        param(s):
            sugar - number : The amount of sugar in grams for the selected food item, as per the sugar key value

        returns : The amount of sugar for the selected food item
    */
   function processFoodItemSugar(sugar: number) {

        if (sugar == -1) {
            return "Unknown"
        }
        else {
            return sugar
        }
   }

    /*
        Send a request to the backend endpoint to get all food items from the database
    */
    useEffect(() => {
        const getFoodItems = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:5000/browse/food-items`);
                const data = await res.json();

                // Store the retrieved food items in the array
                setFoodItemArray(data);
                console.log(foodItemArray);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getFoodItems();

    }, []);

    /*
        Send a request to the backend endpoint to get a food item from the database by id

        param(s):
            id - number : The id of the selected food item
    */
    const getFoodItem = async (id: number) => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/browse//food-item/${id}`);
            const data = await res.json();

            // Store the retrieved food item in the variable
            setFoodItem(data);
            console.log(foodItem);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    /*
        Send a request to the backend endpoint to log a username and food item id in the database
        This records which user purchased what food item

        param(s):
            id - number : The id of the food item to be logged
    */
    const logFoodItemById = async (id: number) => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/logging/log-by-id`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( { username: usernameGlobal, food_id: id } )
                }
            );
            const data = await res.json();

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    /*
        Filter the array of food items by the id of the selected dining location
        If the dining location id of the food item equals the id of the selected dining location, store the food item in the filtered array

        param(s):
            id - number: The id of the selected dining location
    */
    const filterFoodItemArray = (diningLocationId: number) => {
        const filteredFoodItemArray = foodItemArray.filter(foodItem => ((foodItem["location"] as number) == diningLocationId));
        setFilteredFoodItemArray(filteredFoodItemArray);
    }

    /*
        Variable and setter for storing and modifying the selected dining location
        Initialize the default key values for the dining location
        This ensures that the key values can be accessed without raising errors
    */
    const [diningLocation, setDiningLocation] = useState(
        {
            "id": 1, // Initial value of 1 to prevent errors
            "name": ""
        }
    )

    /*
        Variable and setter for storing and modifying the dining location name entered by the user
    */
    const [diningLocationName, setDiningLocationName] = useState(diningLocation["name"]);

    /*
        Variable and setter for storing dining locations retrieved from the backend database
        When the page is loaded, every dining location from the backend database is retrieved and stored in the array
    */
    const [diningLocationArray, setDiningLocationArray] = useState([]);

    /*
        Variable and setter for storing dining locations retrieved from the backend database
        Every time the user searches for a dining location by name,
        Every dining location whose name includes the entered string is stored in the filtered array
    */
    const [filteredDiningLocationArray, setFilteredDiningLocationArray] = useState([]);

    /*
        Send a request to the backend endpoint to get all dining locations from the database
    */
    useEffect(() => {
        const getDiningLocations = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:5000//locations/dining-locations`);
                const data = await res.json();

                // Store the retrieved dining locations in the array
                setDiningLocationArray(data);
                console.log(diningLocationArray);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getDiningLocations();

    }, []);

    /*
        Filter the array of dining locations by the entered string value
        If the name of the dining location includes the entered string, store the dining location in the filtered array

        param(s):
            name - string : The entered string, representing a possible dining location name
    */
    const filterDiningLocationArray = (name: string) => {
        const filteredDiningLocationArray = diningLocationArray.filter(diningLocation => (diningLocation["name"].toLowerCase() as string).includes(name.toLowerCase()));
        setFilteredDiningLocationArray(filteredDiningLocationArray);
    }

    /*
        Log out the logged-in user by setting their username and profile settings to null, and routing to the splash page
    */
    const logout = () => {

        setUsernameGlobal("");
        setShowStatsGlobal(false);
        setHasEggAllergyGlobal(false);
        setHasFishOrShellfishAllergyGlobal(false);
        setHasDairyIntoleranceGlobal(false);
        setHasMilkAllergyGlobal(false);
        setHasPeanutAllergyGlobal(false);
        setHasSesameAllergyGlobal(false);
        setHasSoyAllergyGlobal(false);
        setHasTreenutAllergyGlobal(false);
        setHasWheatAllergyGlobal(false);
        setHasGlutenAllergyGlobal(false);
        setIsVeganGlobal(false);
        setIsVegetarianGlobal(false);
        setPrefersHalalGlobal(false);

        router.push('/');
    }

    /*
        Display the loading symbol while dining locations are being retrieved or logged
    */
    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (

        <View style={styles.container}>
            <StatusBar
                style="auto"
                hidden={true}
            />

            <View
                style={styles.statusbar}>

                <TouchableOpacity id="backButton"
                    style={[styles.headerButton,
                        { backgroundColor: isBackPressed ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsBackPressed(true)}
                    onPressOut={() => setIsBackPressed(false)}
                    onPress={() => usernameGlobal != '' ? router.push('/home') : router.push('/')}>

                    <Text id="backButtonText"
                        style={styles.headerButtonText}>

                        Back
                    </Text>

                </TouchableOpacity>

                <View style={styles.headerContainer}></View>

                <Text id="browseDiningLocationsTitle"
                    style={styles.headerTitle}>

                    Dining Options
                </Text>

                <View style={styles.headerContainer}></View>

                <Text id="loggedInUser"
                    style={styles.headerUsernameIcon}>

                    {usernameGlobal != '' ? `${usernameGlobal}` : 'Guest'}
                </Text>

                <TouchableOpacity id="loginLogoutButton"
                    style={[styles.headerButton,
                        { backgroundColor: isLoginLogoutPressed ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsLoginLogoutPressed(true)}
                    onPressOut={() => setIsLoginLogoutPressed(false)}
                    onPress={() => usernameGlobal != '' ? logout() : router.push('/login')}>

                    <Text id="loginLogoutButtonText"
                        style={styles.headerButtonText}>

                        {usernameGlobal != '' ? 'Logout' : 'Login' }
                    </Text>

                </TouchableOpacity>

            </View>

            <Text id="browseDiningLocationsInfo"
                style={styles.infoText}>

                Search for a dining location by name
            </Text>

            {/* Enter the name of a dining location */}
            <TextInput id="browseDiningLocationsNameTextInput"
                style={styles.diningLocationNameTextInput}
                onChangeText={setDiningLocationName}
                value={diningLocationName}
                placeholder={"Search for dining locations"}
            >
            </TextInput>

            {/* Filter the dining locations in the array by the dining location name and store in another array */}
            <TouchableOpacity id="browseDiningLocationsButton"
                style={[styles.bodyButton,
                    { backgroundColor: isSearchPressed ? '#666666' : '#131312' }
                ]}
                onPressIn={() => setIsSearchPressed(true)}
                onPressOut={() => setIsSearchPressed(false)}
                onPress={() => {
                    filterDiningLocationArray(diningLocationName);
                    setFoodItemsVisible(false);
                    setDiningLocationsVisible(true);
                }}>

                <Text id="browseDiningLocationsButtonText"
                    style={styles.bodyButtonText}>

                    Search
                </Text>

            </TouchableOpacity>

            {/* If the entered string value does not return any dining locations, display the following message */}
            {filteredDiningLocationArray.length == 0 && diningLocationsVisible && (
                <View style={styles.bodyContainer}>
                    <Text
                        style={styles.diningInfoText}>

                        No dining locations found
                    </Text>
                </View>
            )}

            {/* If the entered string value returns dining locations, display the name and id of each dining location */}
            {filteredDiningLocationArray.length > 0 && diningLocationsVisible && (
                <View style={styles.bodyContainer}>
                    {filteredDiningLocationArray.map((diningLocation) => (
                        <Text
                            style={styles.foodInfoText}
                            key={diningLocation["id"]}
                            onPress={() => {
                                filterFoodItemArray(diningLocation["id"]);
                                setFoodItemsVisible(true);
                                setDiningLocationsVisible(false);
                            }}
                        >
                            {diningLocation["name"]}
                            {"\n"}
                        </Text>
                    ))}
                </View>
            )}

            {filteredFoodItemArray.length > 0 && foodItemsVisible && (
                <View style={styles.bodyContainer}>
                    {filteredFoodItemArray.map((foodItem) => (
                        <Text
                            style={styles.foodInfoText}
                            key={foodItem["id"]}
                            onPress={() => {
                                getFoodItem(foodItem["id"]);
                                setFoodItemsVisible(false);
                            }}
                        >
                            {foodItem["name"]}
                            {"\n"}
                        </Text>
                    ))}
                </View>
            )}

            {!foodItemsVisible && foodItem.name != "" && (
                <Text style={styles.foodInfoText}>
                    {foodItem.name}
                    {'\n'}
                    Calories: {processFoodItemCalories(foodItem.calories)}
                    {'\n'}
                    Dining Location: {foodItem.dining_location}
                    {'\n'}
                    Cost: $ {processFoodItemCost(foodItem.cost)}
                    {'\n'}
                    Carbs: {processFoodItemCarbs(foodItem.carbs_g)} grams
                    {'\n'}
                    Fat: {processFoodItemFat(foodItem.fat_g)} grams
                    {'\n'}
                    Fiber: {processFoodItemFiber(foodItem.fiber_g)} grams
                    {'\n'}
                    Proteins: {processFoodItemProteins(foodItem.proteins_g)} grams
                    {'\n'}
                    Sugar: {processFoodItemSugar(foodItem.sugar_g)} grams
                    {'\n'}

                    {foodItem.has_eggs === true && hasEggAllergyGlobal ? "Warning - this item contains eggs" : null}
                    {foodItem.has_eggs === null && hasEggAllergyGlobal ? "Warning - this item may contain eggs" : null}

                    {foodItem.has_fish_or_shellfish === true && hasFishOrShellfishAllergyGlobal ? "Warning - this item contains fish or shellfish \n" : null}
                    {foodItem.has_fish_or_shellfish === null && hasFishOrShellfishAllergyGlobal ? "Warning - this item may contain fish or shellfish \n" : null}

                    {foodItem.is_dairy_free === false && hasDairyIntoleranceGlobal ? "Warning - this item contains dairy" : null}
                    {foodItem.is_dairy_free === null && hasDairyIntoleranceGlobal ? "Warning - this item may contain dairy" : null}

                    {foodItem.has_milk === true && hasMilkAllergyGlobal ? "Warning - this item contains milk" : null}
                    {foodItem.has_milk === null && hasMilkAllergyGlobal ? "Warning - this item may contain milk" : null}

                    {foodItem.has_peanuts === true && hasPeanutAllergyGlobal ? "Warning - this item contains peanuts" : null}
                    {foodItem.has_peanuts === null && hasPeanutAllergyGlobal ? "Warning - this item may contain peanuts" : null}

                    {foodItem.has_sesame === true && hasSesameAllergyGlobal ? "Warning - this item contains sesame" : null}
                    {foodItem.has_sesame === null && hasSesameAllergyGlobal ? "Warning - this item may contain sesame" : null}

                    {foodItem.has_soy === true && hasSoyAllergyGlobal ? "Warning - this item contains soy" : null}
                    {foodItem.has_soy === null && hasSoyAllergyGlobal ? "Warning - this item may contain soy" : null}

                    {foodItem.has_treenuts === true && hasTreenutAllergyGlobal ? "Warning - this item contains treenuts" : null}
                    {foodItem.has_treenuts === null && hasTreenutAllergyGlobal ? "Warning - this item may contain treenuts" : null}

                    {foodItem.has_wheat === true && hasWheatAllergyGlobal ? "Warning - this item contains wheat" : null}
                    {foodItem.has_wheat === null && hasWheatAllergyGlobal ? "Warning - this item may contain wheat" : null}

                    {foodItem.is_gluten_free === false && hasGlutenAllergyGlobal ? "Warning - this item contains gluten" : null}
                    {foodItem.is_gluten_free === null && hasGlutenAllergyGlobal ? "Warning - this item may contain gluten" : null}

                    {foodItem.is_vegan === false && isVeganGlobal ?  "Warning - this item is not vegan" : null}
                    {foodItem.is_vegan === null && isVeganGlobal ?  "Warning - this item may not be vegan" : null}

                    {foodItem.is_vegetarian === false && isVegetarianGlobal ?  "Warning - this item is not vegetarian" : null}
                    {foodItem.is_vegetarian === null && isVegetarianGlobal ?  "Warning - this item may not be vegetarian" : null}

                    {foodItem.is_halal === false && prefersHalalGlobal ? "Warning - this item is not halal" : null}
                    {foodItem.is_halal === null && prefersHalalGlobal ? "Warning - this item may not be halal" : null}
                </Text>
            )}

            {!foodItemsVisible && usernameGlobal != "" && foodItem.name != "" && (
                <TouchableOpacity
                    style={[styles.bodyButtonAlt]}
                    onPress={() => {
                        logFoodItemById(foodItem.id);
                        setFoodItemsVisible(true);
                        setModalVisible(true);

                        setModalVisible(true);
                        setTimeout(() => {
                        setModalVisible(false);
                        }, 2000);

                        router.push("/home");
                    }}
                    disabled={loading}
                >
                    <Text style={styles.bodyButtonTextAlt}>Save Food Item</Text>
                </TouchableOpacity>
            )}

            {modalVisible && usernameGlobal != "" && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View>
                        <View style={styles.bodyContainer}>
                            <Text style={styles.infoText}>Food Item Saved!</Text>
                        </View>
                    </View>
                </Modal>
            )}

        </View>
    )

}
