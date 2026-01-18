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
            "food_name": "",
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
                            Calories: {foodItem["calories"]}
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