import { SetStateAction, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


import { useUser } from './context';
import { styles } from "./styles/style-dining";

export default function DiningScreen() {

    const [loading, setLoading] = useState(true);
    const [diningLocationsVisible, setDiningLocationsVisible] = useState(true);
    const [foodItemsVisible, setFoodItemsVisible] = useState(true);

    // Get the variables and setters used to access and modify a copy of the user profile elements
    const
        {
            usernameGlobal,
            showStatsGlobal,
            hasEggAllergyGlobal,
            hasFishAllergyGlobal,
            hasDairyIntoleranceGlobal,
            hasMilkAllergyGlobal,
            hasPeanutAllergyGlobal,
            hasSesameAllergyGlobal,
            hasShellfishAllergyGlobal,
            hasSoyAllergyGlobal,
            hasTreenutAllergyGlobal,
            hasWheatAllergyGlobal,
            hasGlutenAllergyGlobal,
            isVeganGlobal,
            isVegetarianGlobal,
            prefersKosherGlobal,
            prefersHalalGlobal
        
        } = useUser();

    // Variables and setters for food item elements
    const [foodItem, setFoodItem] = useState(
        {
            "calories": -1,
            "comments": "",
            "cost": 1.0,
            "dining_location": 0,
            "has_eggs": null,
            "has_fish": null,
            "has_milk": null,
            "has_peanuts": null,
            "has_sesame": null,
            "has_shellfish": null,
            "has_soy": null,
            "has_treenuts": null,
            "has_wheat": null,
            "id": 1, // initial value of 1 to prevent errors
            "is_dairy_free": null,
            "is_gluten_free": null,
            "is_halal": null,
            "is_kosher": null,
            "is_vegan": null,
            "is_vegetarian": null,
            "last_updated": "Unknown",
            "name": ""
        }
    );
    const [foodItemId, setFoodItemId] = useState(foodItem["id"]); 
    const [foodItemName, setFoodItemName] = useState(foodItem["name"]);

    // Variables and setters for storing food item JSON objects
    const [foodItemArray, setFoodItemArray] = useState([]);
    const [filteredFoodItemArray, setFilteredFoodItemArray] = useState([]);

    /*
    Set the value of the food item name variable to the value entered in the food item name text input element
    event: The event is the current string value in the food item name text input element
    */
    function saveFoodItemName(event: { target: { value: SetStateAction<string>; }; }) {
        setFoodItemName(event.target.value);
    }

    /*
    Calculate how to display the calories of a food item
    If the calories variable of the selected food item has a value of -1, then the calorie amount is "Unknown" and convey this to the user
    Otherwise, convey the calorie amount to the user
    calories: The integer representing the number of calories of the food item
    */
    function processFoodItemCalories(calories: number) {

        if (calories == -1) { 
            return "Unknown" 
        }
        else { 
            return calories 
        }
    }

    /*
    Calculate how to display the cost of a food item
    If the cost variable of the selected food item has a value of -1, then the cost amount is "Unknown" and display this to the user
    Otherwise, display the cost amount to the user
    cost: The float representing the cost of the food item
    */
   function processFoodItemCost(cost: number) {

        if (cost == -1) {
            return "Unknown"
        }
        else {
            return cost
        }
   }
    
    // Sends a get all food items request to the server exactly once
    useEffect(() => {
        const handlePressGetFoodItems = () => {
            fetch("http://127.0.0.1:5000/browse/food-items", {
                    method: "GET"
                }
            )
            .then(response => {
                if (!response.ok) {
                    throw new Error (`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setFoodItemArray(data);
                setLoading(false);
                console.log(data);
            })
        };
        handlePressGetFoodItems();
    }, []);

    // Sends a get food item by id request to the server
    function handlePressGetFoodItem(foodItemId: number) {
        const foodItemRequest = `http://127.0.0.1:5000/browse//food-item/${foodItemId}`;
        
        fetch(foodItemRequest, {
                method: "GET"
            }
        )
        .then(response => {
            if (!response.ok) {
                throw new Error (`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            setFoodItem(data);
            setFoodItemId(foodItem["id"]);
            console.log(data);
        })
    }
    
    // Filter the array of food items (retrieved from the backend database)
    //
    //
    const filterFoodItemArray = (diningLocationId: number) => {
        const filteredFoodItemArray = foodItemArray.filter(foodItem => ((foodItem["location"] as number) == diningLocationId));
        setFilteredFoodItemArray(filteredFoodItemArray);
    }

    // Variables and setters for dining location elements
    const [diningLocation, setDiningLocation] = useState(
        {
            "id": 1, // initial value of 1 to prevent errors
            "name": ""
        }
    )
    const [diningLocationId, setDiningLocationId] = useState(diningLocation["id"]);
    const [diningLocationName, setDiningLocationName] = useState(diningLocation["name"]);

    // Variables and setters for storing dining location JSON objects
    const [diningLocationArray, setDiningLocationArray] = useState([]);
    const [filteredDiningLocationArray, setFilteredDiningLocationArray] = useState([]);

    /*
    Set the value of the dining location name variable to the value entered in the dining location name text input element
    event: The event is the current string value in the dining location name text input element
    */
   function saveDiningLocationName(event: { target: { value: SetStateAction<string>; }; }) {
        setDiningLocationName(event.target.value);
   }

   // Sends a get all dining locations request to the server exactly once
   useEffect(() => {
        const handlePressGetDiningLocations = () => {
            fetch("http://127.0.0.1:5000//locations/dining-locations", {
                    method: "GET"
                }
            )
            .then(response => {
                if (!response.ok) {
                    throw new Error (`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                setDiningLocationArray(data);
                setLoading(false);
                console.log(data);
            })
        };
        handlePressGetDiningLocations();
   }, []);

   /*
   Filter the array of dining locations (retrieved from the backend database)
   The dining location name, entered in the text input, is used to filter the array
   The dining location whose names partially or wholly match the entered value are stored in a filtered array
   */
    const filterDiningLocationArray = () => {
        const filteredDiningLocationArray = diningLocationArray.filter(diningLocation => (diningLocation["name"].toLowerCase() as string).includes(diningLocationName.toLowerCase()));
        setFilteredDiningLocationArray(filteredDiningLocationArray);
    }

    // Display loading symbol while the dining locations and food items are being fetched
    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // The page that the user sees in the app/browser
    return (

        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.subtitle}>Logged in as {usernameGlobal}</Text>

            <Text style={styles.title}>Dining</Text>

            <Text style={styles.subtitle}>Enter the dining location manually</Text>

            {/* Enter the dining location name to list dining locations with similar or matching names */}
            <TextInput
                style={styles.textInput}
                onChange={saveDiningLocationName}
                placeholder={"Enter the dining location name"}
                value={diningLocationName}
            >
            </TextInput>

            {/* Filter the dining locations in the frontend array by the dining location name and store in another array */}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => {
                    setDiningLocationsVisible(true);
                    setFoodItemsVisible(false);
                    foodItem.name = "";

                    filterDiningLocationArray();
                    console.log(diningLocationsVisible);
                }}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Confirm</Text>
            </TouchableOpacity>

            {/* If the entered string value does not return any dining locations, display the following message */}
            {filteredDiningLocationArray.length == 0 && diningLocationsVisible && (
                <View>
                    <Text style={styles.pressableText}>
                        There are no dining locations on campus that match this search
                    </Text>
                </View>
            )}

            {/* If the entered string value returns any dining locations, display the name and id of each dining location */}
            {filteredDiningLocationArray && diningLocationsVisible && (
                <View>
                    {filteredDiningLocationArray.map((diningLocation) => (
                        <Text
                            style={styles.pressableText}
                            key={diningLocation["id"]}
                            onPress={() => {
                                filterFoodItemArray(diningLocation["id"]);

                                setDiningLocationsVisible(false);
                                setFoodItemsVisible(true);
                            }}
                        >
                            {diningLocation["name"]}{"\n"}(ID {diningLocation["id"]})
                            <br></br>
                            <line>---</line>
                        </Text>
                    ))}
                </View>
            )}

            {filteredFoodItemArray && foodItemsVisible && (
                <View>
                    {filteredFoodItemArray.map((foodItem) => (
                        <Text 
                            style={styles.pressableText}
                            key={foodItem["id"]}
                            onPress={() => {
                                handlePressGetFoodItem(foodItem["id"]);
                                setFoodItemsVisible(false);
                            }}
                        >
                            {foodItem["name"]}{"\n"}(ID {foodItem["id"]})
                            <br></br>
                            <line>---</line>
                        </Text>
                    ))}
                </View>
            )}

            {foodItem.name != "" && (

                <View>
                    <Text style={styles.subsubtitle}>{foodItem.name}</Text>
                    <br></br>
                    <Text style={styles.subsubtitle}>Calories: {processFoodItemCalories(foodItem.calories)}</Text>
                    <br></br>
                    <Text style={styles.subsubtitle}>Dining Location: {foodItem.dining_location}</Text>
                    <br></br>
                    <Text style={styles.subsubtitle}>Cost: $ {processFoodItemCost(foodItem.cost)}</Text>
                    <br></br>

                    {/* Display warnings to the logged-in user based on the food item properties and the user's own profile settings */}
                    
                    {foodItem.has_eggs == true && (
                        <Text style={styles.subsubtitle}>{foodItem.has_eggs === true && hasEggAllergyGlobal ? "Warning - this item contains eggs" : null}</Text>
                    )}
                    {foodItem.has_eggs == null && (
                        <Text style={styles.subsubtitle}>{foodItem.has_eggs === null && hasEggAllergyGlobal ? "Warning - this item may contain eggs" : null}</Text>
                    )}

                    {foodItem.has_fish == true && (
                        <Text style={styles.subsubtitle}>{foodItem.has_fish === true && hasFishAllergyGlobal ? "Warning - this item contains fish" : null}</Text>
                    )}
                    {foodItem.has_fish == null && (
                        <Text style={styles.subsubtitle}>{foodItem.has_fish === null && hasFishAllergyGlobal ? "Warning - this item may contain fish" : null}</Text>
                    )}

                    {foodItem.is_dairy_free == true && (
                        <Text style={styles.subsubtitle}>{foodItem.is_dairy_free === false && hasDairyIntoleranceGlobal ? "Warning - this item contains dairy" : null}</Text>
                    )}
                     {foodItem.is_dairy_free == null && (
                        <Text style={styles.subsubtitle}>{foodItem.is_dairy_free === null && hasDairyIntoleranceGlobal ? "Warning - this item may contain dairy" : null}</Text>
                    )}

                    {foodItem.has_milk == true && (
                        <Text style={styles.subsubtitle}>{foodItem.has_milk === true && hasMilkAllergyGlobal ? "Warning - this item contains milk" : null}</Text>
                    )}
                    {foodItem.has_milk == null && (
                        <Text style={styles.subsubtitle}>{foodItem.has_milk === null && hasMilkAllergyGlobal ? "Warning - this item may contain milk" : null}</Text>
                    )}

                    {foodItem.has_peanuts == true && (
                        <Text style={styles.subsubtitle}>{foodItem.has_peanuts === true && hasPeanutAllergyGlobal ? "Warning - this item contains peanuts" : null}</Text>
                    )}
                    {foodItem.has_peanuts == null && (
                        <Text style={styles.subsubtitle}>{foodItem.has_peanuts === null && hasPeanutAllergyGlobal ? "Warning - this item may contain peanuts" : null}</Text>
                    )}

                    {foodItem.has_sesame == true && (
                        <Text style={styles.subsubtitle}>{foodItem.has_sesame === true && hasSesameAllergyGlobal ? "Warning - this item contains sesame" : null}</Text>
                    )}
                    {foodItem.has_sesame == null && (
                        <Text style={styles.subsubtitle}>{foodItem.has_sesame === null && hasSesameAllergyGlobal ? "Warning - this item may contain sesame" : null}</Text>
                    )}

                    {foodItem.has_shellfish == true && (
                        <Text style={styles.subsubtitle}>{foodItem.has_shellfish === true && hasShellfishAllergyGlobal ? "Warning - this item contains shellfish" : null}</Text>
                    )}    
                    {foodItem.has_shellfish == null && (
                        <Text style={styles.subsubtitle}>{foodItem.has_shellfish === null && hasShellfishAllergyGlobal ? "Warning - this item may contain shellfish" : null}</Text>
                    )}

                    {foodItem.has_soy == true && (
                        <Text style={styles.subsubtitle}>{foodItem.has_soy === true && hasSoyAllergyGlobal ? "Warning - this item contains soy" : null}</Text>
                    )}
                    {foodItem.has_soy == null && (                    
                        <Text style={styles.subsubtitle}>{foodItem.has_soy === null && hasSoyAllergyGlobal ? "Warning - this item may contain soy" : null}</Text>
                    )}
                    
                    {foodItem.has_treenuts == true && (
                        <Text style={styles.subsubtitle}>{foodItem.has_treenuts === true && hasTreenutAllergyGlobal ? "Warning - this item contains treenuts" : null}</Text>
                    )}                    
                    {foodItem.has_treenuts == null && (
                        <Text style={styles.subsubtitle}>{foodItem.has_treenuts === null && hasTreenutAllergyGlobal ? "Warning - this item may contain treenuts" : null}</Text>
                    )}

                    {foodItem.has_wheat == true && (                    
                        <Text style={styles.subsubtitle}>{foodItem.has_wheat === true && hasWheatAllergyGlobal ? "Warning - this item contains wheat" : null}</Text>
                    )}
                    {foodItem.has_wheat == null && (
                        <Text style={styles.subsubtitle}>{foodItem.has_wheat === null && hasWheatAllergyGlobal ? "Warning - this item may contain wheat" : null}</Text>
                    )}

                    {foodItem.is_gluten_free == false && (
                        <Text style={styles.subsubtitle}>{foodItem.is_gluten_free === false && hasGlutenAllergyGlobal ? "Warning - this item contains gluten" : null}</Text>
                    )}
                    {foodItem.is_gluten_free == null && (
                        <Text style={styles.subsubtitle}>{foodItem.is_gluten_free === null && hasGlutenAllergyGlobal ? "Warning - this item may contain gluten" : null}</Text>
                    )}

                    {foodItem.is_vegan == false && (
                        <Text style={styles.subsubtitle}>{foodItem.is_vegan === false && isVeganGlobal ?  "Warning - this item is not vegan" : null}</Text>
                    )}
                    {foodItem.is_vegan == null && (
                        <Text style={styles.subsubtitle}>{foodItem.is_vegan === null && isVeganGlobal ?  "Warning - this item may not be vegan" : null}</Text>
                    )}

                    {foodItem.is_vegetarian == false && (
                        <Text style={styles.subsubtitle}>{foodItem.is_vegetarian === false && isVegetarianGlobal ?  "Warning - this item is not vegetarian" : null}</Text>
                    )}
                    {foodItem.is_vegetarian == null && (
                        <Text style={styles.subsubtitle}>{foodItem.is_vegetarian === null && isVegetarianGlobal ?  "Warning - this item may not be vegetarian" : null}</Text>
                    )}

                    {foodItem.is_kosher == false && (
                        <Text style={styles.subsubtitle}>{foodItem.is_kosher === false && prefersKosherGlobal ? "Warning - this item is not kosher" : null}</Text>
                    )}
                    {foodItem.is_kosher == null && (
                        <Text style={styles.subsubtitle}>{foodItem.is_kosher === null && prefersKosherGlobal ? "Warning - this item may not be kosher" : null}</Text>
                    )}    
                        
                    {foodItem.is_halal == false && (                        
                        <Text style={styles.subsubtitle}>{foodItem.is_halal === false && prefersHalalGlobal ? "Warning - this item is not halal" : null}</Text>
                    )}
                    {foodItem.is_halal == null && (
                        <Text style={styles.subsubtitle}>{foodItem.is_halal === null && prefersHalalGlobal ? "Warning - this item may not be halal" : null}</Text>
                    )}
                </View>
            )}

        </View>
    )

}