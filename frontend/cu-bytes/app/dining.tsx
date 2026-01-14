import { SetStateAction, useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';


import { useUser } from './context';
import { styles } from "./styles/style-dining";

export default function DiningScreen() {

    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);

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
    const filterFoodItemArray = () => {
        const filteredFoodItemArray = foodItemArray.filter(foodItem => (foodItem["name"].toLowerCase() as string).includes(foodItemName.toLowerCase()));
        setFilteredFoodItemArray(filteredFoodItemArray);
    }

    // Variables and setters for dining location elements
    const [diningLocation, setDiningLocation] = useState(
        {
            "id": 1, // initial value of 1 to prevent errors
            "dining_location": ""
        }
    )
    const [diningLocationId, setDiningLocationId] = useState(diningLocation["id"]);
    const [diningLocationName, setDiningLocationName] = useState(diningLocation["dining_location"]);

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
            // setDiningLocationArray(data);
            setLoading(false);
        })
    };
    handlePressGetDiningLocations();
   }, []);

   // Sends a get dining location by id request to the server
   function handlePressGetDiningLocation(diningLocationId: number) {
        const diningLocationRequest = `http://127.0.0.1:5000//locations/dining-locations/${diningLocationId}`;

        fetch(diningLocationRequest, {
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
            setDiningLocation(data);
            setDiningLocationId(diningLocation["id"]);
            console.log(data);
        })
    
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

            {/* */}

        </View>
    )

}