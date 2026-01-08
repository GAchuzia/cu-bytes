import { SetStateAction, useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-enter'

export default function EnterScreen() {

    ////////////////////////////////////////////////// FoodItem, Loading, and Visible Variables and Setters //////////////////////////////////////////////////
    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    // The food item variables
    const [foodItemId, setFoodItemId] = useState(1); // initial value of 1 to prevent errors
    const [foodItemName, setFoodItemName] = useState('');
    const [foodItem, setFoodItem] = useState({});

    // The food item array variables
    const [foodItemArray, setFoodItemArray] = useState([]);
    const [filteredFoodItemArray, setFilteredFoodItemArray] = useState([]);

    /*
    Set the value of the food item name variable to the value entered in the food item name text input element
    event: The event is the current string value in the food item name text input element
    */
    function saveFoodItemName(event: { target: { value: SetStateAction<string>; }; }) {
        setFoodItemName(event.target.value);
    }

    ////////////////////////////////////////////////// FoodItem, Loading, and Visible Variables and Setters //////////////////////////////////////////////////

    ////////////////////////////////////////////////// foodItem["calories"] //////////////////////////////////////////////////

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

    ////////////////////////////////////////////////// foodItem["calories"] //////////////////////////////////////////////////

    ////////////////////////////////////////////////// Send food items request ////////////////////////////////////////////////// 
    
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
                //const filteredFoodItemArray = foodItemArray.filter(foodItem => (foodItem["name"].toLowerCase() as string).includes(foodItemName.toLowerCase()));
                //setFilteredFoodItemArray(filteredFoodItemArray);
            })
        };
        handlePressGetFoodItems();
    }, []);

    ////////////////////////////////////////////////// Send food items request ////////////////////////////////////////////////// 

    ////////////////////////////////////////////////// Send food item request ////////////////////////////////////////////////// 
    
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

    ////////////////////////////////////////////////// Send food item request //////////////////////////////////////////////////

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
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => {
                    setVisible(false);
                    filterFoodItemArray();
                }}
                disabled={loading}
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
                    <Text style={styles.subsubtitle}>Food Item Name: {foodItem["name"]}</Text>
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