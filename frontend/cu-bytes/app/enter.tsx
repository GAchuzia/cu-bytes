import { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-enter';
import { useUser } from './context';

export default function EnterScreen() {

    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);    

    /*
        Variables used to store a copy of the logged-in user's username and profile settings 
    */
    const 
        {
            usernameGlobal,
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

    /*
        Variable and setter for storing and modifying the selected food item
        Initialize the default key values for the food item
        This ensures that the key values can be accessed without raising errors
    */
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
            "id": 1, // Initial value of 1 to prevent errors
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

    /*
        Variable and setter for storing and modifying the food item name entered by the user
    */
    const [foodItemName, setFoodItemName] = useState(foodItem["name"]);

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
        Filter the array of food items by the entered string value
        If the name of the food item includes the entered string, store the food item in the filtered array

        param(s):
            name - string : The entered string, representing a possible food item name
    */
    const filterFoodItemArray = (name: string) => {
        const filteredFoodItemArray = foodItemArray.filter(foodItem => (foodItem["name"].toLowerCase() as string).includes(name.toLowerCase()));
        setFilteredFoodItemArray(filteredFoodItemArray);
    }

    /*
        Display the loading symbol while food items are being retrieved or logged
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
            <StatusBar style="auto" />

            <Text style={styles.subtitle}>Logged in as {usernameGlobal}</Text>

            <Text style={styles.title}>Browse Food Items</Text>

            {/* Enter the name of a food item */}
            <TextInput
                style={styles.textInput}
                onChangeText={setFoodItemName}
                value={foodItemName}
                placeholder={"Search for food items"}
            >
            </TextInput>

            {/* Filter the food items in the array by the food item name and store in another array */}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => {
                    filterFoodItemArray(foodItemName);
                    setVisible(false);
                }}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Search</Text>
            </TouchableOpacity>

            {/* If the entered string value does not return any food items, display the following message */}
            {filteredFoodItemArray.length == 0 && !visible && (
                <View>
                    <Text style={styles.pressableText}>
                        No food items found
                    </Text>
                </View>
            )}

            {/* If the entered string value returns food items, display the name and id of each food item */}
            {filteredFoodItemArray && !visible && (
                <View>
                    {filteredFoodItemArray.map((foodItem) => (
                        <Text 
                            style={styles.pressableText}
                            key={foodItem["id"]}
                            onPress={() => {
                                getFoodItem(foodItem["id"]);
                                setVisible(true);
                            }}
                        >
                            {foodItem["name"]} (ID {foodItem["id"]})
                            {'\n'}
                        </Text>
                    ))}
                </View>
            )}

            {visible && (
                <Text style={styles.subsubtitle}>

                    {foodItem.name}
                    {'\n'}
                    Calories: {processFoodItemCalories(foodItem.calories)}
                    {'\n'}
                    Dining Location: {foodItem.dining_location}
                    {'\n'}
                    Cost: $ {processFoodItemCost(foodItem.cost)}
                    {'\n'}

                    {foodItem.has_eggs === true && hasEggAllergyGlobal ? "Warning - this item contains eggs \n" : null}
                    {foodItem.has_eggs === null && hasEggAllergyGlobal ? "Warning - this item may contain eggs \n" : null}

                    {foodItem.has_fish === true && hasFishAllergyGlobal ? "Warning - this item contains fish \n" : null}
                    {foodItem.has_fish === null && hasFishAllergyGlobal ? "Warning - this item may contain fish \n" : null}

                    {foodItem.is_dairy_free === false && hasDairyIntoleranceGlobal ? "Warning - this item contains dairy \n" : null}
                    {foodItem.is_dairy_free === null && hasDairyIntoleranceGlobal ? "Warning - this item may contain dairy \n" : null}

                    {foodItem.has_milk === true && hasMilkAllergyGlobal ? "Warning - this item contains milk \n" : null}
                    {foodItem.has_milk === null && hasMilkAllergyGlobal ? "Warning - this item may contain milk \n" : null}

                    {foodItem.has_peanuts === true && hasPeanutAllergyGlobal ? "Warning - this item contains peanuts \n" : null}
                    {foodItem.has_peanuts === null && hasPeanutAllergyGlobal ? "Warning - this item may contain peanuts \n" : null}

                    {foodItem.has_sesame === true && hasSesameAllergyGlobal ? "Warning - this item contains sesame \n" : null}
                    {foodItem.has_sesame === null && hasSesameAllergyGlobal ? "Warning - this item may contain sesame \n" : null}

                    {foodItem.has_shellfish === true && hasShellfishAllergyGlobal ? "Warning - this item contains shellfish \n" : null}
                    {foodItem.has_shellfish === null && hasShellfishAllergyGlobal ? "Warning - this item may contain shellfish \n" : null}

                    {foodItem.has_soy === true && hasSoyAllergyGlobal ? "Warning - this item contains soy \n" : null}
                    {foodItem.has_soy === null && hasSoyAllergyGlobal ? "Warning - this item may contain soy \n" : null}

                    {foodItem.has_treenuts === true && hasTreenutAllergyGlobal ? "Warning - this item contains treenuts \n" : null}
                    {foodItem.has_treenuts === null && hasTreenutAllergyGlobal ? "Warning - this item may contain treenuts \n" : null}

                    {foodItem.has_wheat === true && hasWheatAllergyGlobal ? "Warning - this item contains wheat \n" : null}
                    {foodItem.has_wheat === null && hasWheatAllergyGlobal ? "Warning - this item may contain wheat \n" : null}
                
                    {foodItem.is_gluten_free === false && hasGlutenAllergyGlobal ? "Warning - this item contains gluten \n" : null}
                    {foodItem.is_gluten_free === null && hasGlutenAllergyGlobal ? "Warning - this item may contain gluten \n" : null}
                    
                    {foodItem.is_vegan === false && isVeganGlobal ?  "Warning - this item is not vegan \n" : null}
                    {foodItem.is_vegan === null && isVeganGlobal ?  "Warning - this item may not be vegan \n" : null}
                    
                    {foodItem.is_vegetarian === false && isVegetarianGlobal ?  "Warning - this item is not vegetarian \n" : null}
                    {foodItem.is_vegetarian === null && isVegetarianGlobal ?  "Warning - this item may not be vegetarian \n" : null}                        
                    
                    {foodItem.is_kosher === false && prefersKosherGlobal ? "Warning - this item is not kosher \n" : null}                                                
                    {foodItem.is_kosher === null && prefersKosherGlobal ? "Warning - this item may not be kosher \n" : null}                                                
                
                    {foodItem.is_halal === false && prefersHalalGlobal ? "Warning - this item is not halal \n" : null}                                                
                    {foodItem.is_halal === null && prefersHalalGlobal ? "Warning - this item may not be halal \n" : null}
                </Text>
            )}

            {visible && usernameGlobal != "" && (
                <TouchableOpacity
                    style={[styles.button, loading && styles.buttonDisabled]}
                    onPress={() => {
                        logFoodItemById(foodItem.id);
                        setVisible(false);
                    }}
                    disabled={loading}
                >
                    <Text style={styles.buttonText}>Log Food Item</Text>
                </TouchableOpacity>   
            )}

        </View>
    )
}