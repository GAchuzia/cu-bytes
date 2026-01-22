import { SetStateAction, useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, ScrollView } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-entries';
import { useUser } from './context';

export default function EntriesScreen() {

    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false); 

    // Get the variables and setters used to access and modify a copy of the user profile elements
    const 
        { usernameGlobal } = useUser();

    // Variables and setters for food item elements
    const [foodItem, setFoodItem] = useState(
        {
            "calories": -1,
            "carbs_g": 0.00,
            "fat_g": 0.00,
            "fiber_g": 0.00,
            "food_name": "",
            "proteins_g": 0.00,
            "sugar_g": 0.00,
            "transaction_time": ""
        }
    );

    // Variables and setters for storing food item JSON objects
    const [foodItemArray, setFoodItemArray] = useState([]);

    // Sends a get all food items request to the server exactly once
    useEffect(() => {
        const foodItemEntryRequest = `http://127.0.0.1:5000/logging/history/${usernameGlobal}`

        const handlePressGetFoodItems = () => {
            fetch(foodItemEntryRequest, {
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
            })
        };
        handlePressGetFoodItems();
    }, []);

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

    // Display loading symbol while the food items are being fetched
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

            <Text style={styles.title}>Food Entries</Text>

            <Text style={styles.subtitle}>Here are the food items that {usernameGlobal} has selected</Text>

            {/* If the entered string value does not return any food items, display the following message */}
            {foodItemArray.length == 0 && !visible && (
                <View>
                    <Text style={styles.pressableText}>
                        There are no food items on campus that match this search
                    </Text>
                </View>
            )}

            {/* If the entered string value returns any food items, display the name and id of each food item */}
            {foodItemArray && !visible && (
                <ScrollView>
                    {foodItemArray.map((foodItem) => (
                        <Text style={styles.subsubtitle}>
                            {foodItem["food_name"]}
                            <br></br>
                            Calories: {processFoodItemCalories(foodItem["calories"])}
                            <br></br>
                            Carbs: {foodItem["carbs_g"]} grams
                            <br></br>
                            Fat: {foodItem["fat_g"]} grams
                            <br></br>
                            Fiber: {foodItem["fiber_g"]} grams
                            <br></br>
                            Proteins: {foodItem["proteins_g"]} grams
                            <br></br>
                            Sugar: {foodItem["sugar_g"]} grams
                            <br></br>
                            {foodItem["transaction_time"]}
                            <br></br>
                            <line>---</line>
                        </Text>
                    ))}
                </ScrollView>
            )}

        </View>
    )
}