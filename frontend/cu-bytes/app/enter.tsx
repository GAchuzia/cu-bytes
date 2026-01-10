import { SetStateAction, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-enter';
import { useUser } from './context';

export default function EnterScreen() {

    // Get the variables and setters used to access and modify a copy of the user profile elements
    const 
        {
            usernameGlobal,
            showStatsGlobal,
            hasEggAllergyGlobal,
            hasDairyIntoleranceGlobal,
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

    // Variable and setter for controlling the visibility of components on the page
    const [visible, setVisible] = useState(false);

    // Variables and setters for food item ids, food item names, and food item JSON objects
    const [foodItem, setFoodItem] = useState({});
    const [foodItemId, setFoodItemId] = useState(1); // initial value of 1 to prevent errors
    const [foodItemName, setFoodItemName] = useState('');
    
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
    If the calories variable of the selected food item has a value of -1, then the calorie amount is unknown and convey this to the user
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
            })
        };
        handlePressGetFoodItems();
    }, []);

    // Sends a get food item by id request to the server
    const handlePressGetFoodItem = () => {
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
            console.log(data);
        })
    }

    // Filter the array of food items (retrieved from the backend database)
    // The food item name, entered in the text input, is used to filter the array
    // The food items whose names partially or wholly match the entered value are stored in a filtered array
    const filterFoodItemArray = () => {
        const filteredFoodItemArray = foodItemArray.filter(foodItem => (foodItem["name"].toLowerCase() as string).includes(foodItemName.toLowerCase()));
        setFilteredFoodItemArray(filteredFoodItemArray);
    }

    // The page that the user sees in the app/browser
    return (

        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.subtitle}>Logged in as {usernameGlobal}</Text>

            <Text style={styles.title}>Enter</Text>

            <Text style={styles.subtitle}>Enter the food item manually</Text>

            {/* Enter the food item to get detailed information on*/}
            <TextInput
                style={styles.textInput}
                onChange={saveFoodItemName}
                placeholder={"Enter the food item name"}
                value={foodItemName}
            >
            </TextInput>

            {/* Filter the food items in the frontend array by the food item name and store in another array */}
            <TouchableOpacity
                style={[styles.button]}
                onPress={() => {
                    setVisible(false);
                    filterFoodItemArray();
                }}
            >
                <Text style={styles.buttonText}>Confirm</Text>

            </TouchableOpacity>

            {/* If the entered string value does not return any food items, display the following message */}
            {filteredFoodItemArray.length == 0 && !visible && (
                <View>
                    <Text style={styles.pressableText}>
                        There are no food items on campus that match this search
                    </Text>
                </View>
            )}

            {/* If the entered string value returns any food items, display the name and id of each food item */}
            {filteredFoodItemArray && !visible && (
                <View>
                    
                    {filteredFoodItemArray.map((foodItem) => (
                        <Text 
                            style={styles.pressableText}
                            key={foodItem["id"]}
                            onPress={() => {
                                setFoodItemId(foodItem["id"]);
                                handlePressGetFoodItem();
                                setVisible(true);
                            }}
                        >
                            {foodItem["name"]} (ID {foodItem["id"]})
                            <br></br>
                            <line>---</line>
                        </Text>
                    ))}

                </View>
            )}

            {visible && (
                <View>
                    <Text style={styles.subsubtitle}>{foodItem["name"]}</Text>
                    <br></br>
                    <Text style={styles.subsubtitle}>Calories: {processFoodItemCalories(foodItem["calories"])}</Text>
                    <br></br>
                    <Text style={styles.subsubtitle}>Dining Location: {foodItem["dining_location"]}</Text>
                    <br></br>
                    <Text style={styles.subsubtitle}>Cost: ${foodItem["cost"]}</Text>
                    <br></br>
                </View>
            )}

        </View>
    )
}