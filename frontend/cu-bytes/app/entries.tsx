import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './_styles/style-entries';
import { useUser } from './_context';
import { API_BASE_URL } from '../services/api';

export default function EntriesScreen() {

    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [isBackPressed, setIsBackPressed] = useState(false);
    const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);

    /*
        Variables used to store a copy of the logged-in user's username and profile settings
    */
    const
        {
            usernameGlobal,
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

    // Variables and setters for storing food item JSON objects
    const [foodItemArray, setFoodItemArray] = useState([]);

    /*
        Send a request to the backend endpoint to get all food items from the database logged by the logged-in user
    */
    useEffect(() => {
        const foodItemEntryRequest = `${API_BASE_URL}/logging/history/${usernameGlobal}`

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
            return "Unknown";
        }
        else {
            return calories;
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
            return "Unknown";
        }
        else {
            return carbs;
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
            return "Unknown";
        }
        else {
            return fat;
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
            return "Unknown";
        }
        else {
            return fiber;
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
            return "Unknown";
        }
        else {
            return proteins;
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
            return "Unknown";
        }
        else {
            return sugar;
        }
   }

    /*
        Log out the logged-in user by setting their username and profile settings to null, and routing to the splash page
    */
    const logout = () => { 
        
        setUsernameGlobal('');
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

    return (

        <View style={styles.container}>
            
            <StatusBar style="auto" hidden={true}/>

            <View id="viewSavedFoodItemsStatusbar" style={styles.statusbar}>

                {/* Route the user to the 'home' page */}
                <TouchableOpacity id="backButton"
                    style={[styles.headerButtonDefault, {backgroundColor: isBackPressed ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsBackPressed(true)}
                    onPressOut={() => setIsBackPressed(false)}
                    onPress={() => router.push('/home')}>

                    <Text id="backButtonText" style={styles.headerButtonTextDefault} numberOfLines={1}>
                        Back
                    </Text>
                </TouchableOpacity>

                <Text  id="loggedInUser" style={styles.headerUsernameIcon}>
                    {usernameGlobal != '' ? `${usernameGlobal}` : 'Guest'}
                </Text>

                {/* Route the user to the 'splash' page or the 'login' page */}
                <TouchableOpacity id="loginLogoutButton"
                    style={[styles.headerButtonDefault, {backgroundColor: isLoginLogoutPressed ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsLoginLogoutPressed(true)}
                    onPressOut={() => setIsLoginLogoutPressed(false)}
                    onPress={() => usernameGlobal != '' ? logout() : router.push('/login')}>

                    <Text id="loginLogoutButtonText" style={styles.headerButtonTextDefault} numberOfLines={1}>
                        {usernameGlobal != '' ? 'Logout' : 'Login'}
                    </Text>
                </TouchableOpacity>

            </View>

            <Text id="savedFoodItemsTitle" style={styles.headerTitle}>
                Saved Food Items
            </Text>

            <ScrollView id="viewSavedFoodItemsScrollView" style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled>

                <Text id="viewSavedFoodItemsInfoTextDefault" style={styles.infoText}>
                    Here are the food items that you saved
                </Text>

                {foodItemArray.length === 0 && !visible ? (
                    <View id="viewSavedFoodItemsViewNoItems">
                        <Text id="viewSavedFoodItemsInfoTextNoItems" style={styles.infoText}>
                            You have saved no food items
                        </Text>
                    </View>
                ) : null}

                {foodItemArray && foodItemArray.length > 0 && !visible ? (

                    <View style={styles.bodyContainer}>

                        <FlatList
                            data={foodItemArray}
                            scrollEnabled={true}
                            renderItem={({ item }) => (
                                <View id="rowView" style={styles.row}>
                                    <Text style={styles.rowCell}><Text style={{ fontWeight: 'bold' }}>Name</Text> {item["food_name"]}</Text>
                                    <Text style={styles.rowCell}><Text style={{ fontWeight: 'bold' }}>Dining Locations</Text> {item["dining_location"]}</Text>
                                    <Text style={styles.rowCell}><Text style={{ fontWeight: 'bold' }}>Calories</Text> {processFoodItemCalories(item["calories"])}</Text>
                                    <Text style={styles.rowCell}><Text style={{ fontWeight: 'bold' }}>Carbs</Text> {processFoodItemCarbs(item["carbs_g"])} g</Text>
                                    <Text style={styles.rowCell}><Text style={{ fontWeight: 'bold' }}>Fat</Text> {processFoodItemFat(item["fat_g"])} g</Text>
                                    <Text style={styles.rowCell}><Text style={{ fontWeight: 'bold' }}>Fiber</Text> {processFoodItemFiber(item["fiber_g"])} g</Text>
                                    <Text style={styles.rowCell}><Text style={{ fontWeight: 'bold' }}>Proteins</Text> {processFoodItemProteins(item["proteins_g"])} g</Text>
                                    <Text style={styles.rowCell}><Text style={{ fontWeight: 'bold' }}>Sugar</Text> {processFoodItemSugar(item["sugar_g"])} g</Text>
                                    <Text style={styles.rowCell}><Text style={{ fontWeight: 'bold' }}>Saved</Text> {item["transaction_time"]}</Text>
                                </View>
                            )}
                            keyExtractor={foodItem => foodItem["food_name"]}>
                        </FlatList>

                    </View>
                ) : null}

            </ScrollView>

        </View>
    )

}
