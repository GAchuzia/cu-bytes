import { useState } from 'react';
import { View, Text, TouchableOpacity, TextInput, FlatList } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './style-enter'

export default function EnterScreen() {

    const [loading, setLoading] = useState(false);
    const [visible, setVisible] = useState(false);

    // The food item id variable
    const [foodItemId, setFoodItemId] = useState(1);    
    // The food item name variable
    const [foodItemName, setFoodItemName] = useState('');
    // The food item
    const [foodItem, setFoodItem] = useState({});

    // The unfiltered food item array variable
    const [foodItemArray, setFoodItemArray] = useState([]);
    // The food item array that is filtered based on the food item name
    const [filteredFoodItemArray, setFilteredFoodItemArray] = useState([]);

    // Sets the value of the food item id based on the selected food item
    function saveFoodItemId(id) {
        setFoodItemId(id);
        console.log(foodItemId);
    }

    // Sets the value of the food item name based on the value of the food item name text input
    function saveFoodItemName(event) {
        setFoodItemName(event.target.value);
        console.log(foodItemName);
    }

    // Sets the value of the food item based
    function saveFoodItem(item) {
        setFoodItem(item);
        console.log(foodItem);
    }

    // Sets the value of the food item array
    function saveFoodItemArray(foodItemArray) {
        setFoodItemArray(foodItemArray);
        console.log(foodItemArray);
    }

    // Sets the value of the filtered food item array
    function saveFilteredFoodItemArray(foodItemArray) {
        const filteredFoodItemArray = foodItemArray.filter(foodItem => (foodItem["name"] as string).includes(foodItemName));
        setFilteredFoodItemArray(filteredFoodItemArray);
        console.log(filteredFoodItemArray);
    }

    // Sends a get all food items request to the server
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
            saveFoodItemArray(data);
            saveFilteredFoodItemArray(data);
        })
    }

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
            saveFoodItem(data);
            console.log(foodItem);
        })
    }

    // The page that the user sees in the app/browser
    return (

        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.title}>Enter</Text>
            <Text style={styles.subtitle}>Enter the food item manually</Text>

            {/*Enter the food item to get detailed information on*/}
            <TextInput
                style={styles.textInput}
                onChange={saveFoodItemName}
                placeholder={"Enter the food item name"}
                value={foodItemName}
            >
            </TextInput>

            {/*Send a request to the server to see food items in the database that match the entered food item*/}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => {
                    setVisible(false);
                    handlePressGetFoodItems();
                }}
                disabled={loading}
            >
                <Text style={styles.buttonText}>Confirm</Text>

            </TouchableOpacity>

            {filteredFoodItemArray && !visible && (
                <View>
                    
                    {filteredFoodItemArray.map((foodItem) => (
                        <Text 
                            style={styles.pressableText}
                            key={foodItem["id"]}
                            onPress={() => {
                                saveFoodItemId(foodItem["id"]); 
                                handlePressGetFoodItem();
                                setVisible(true);
                            }}
                        >
                            {foodItem["name"]} (ID {foodItem["id"]})
                            <br></br>
                            <line>--------------------------------------------------</line>
                        </Text>
                    ))}
                </View>
            )}

            {visible && (
                <View>
                    <Text style={styles.subsubtitle}>Food Item Name: {foodItem["name"]}</Text>
                    <br></br>
                    <Text style={styles.subsubtitle}>Calories: {foodItem["calories"]}</Text>
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