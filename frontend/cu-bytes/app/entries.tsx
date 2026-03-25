import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList, ScrollView } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { screenChrome as sc } from './_styles/screenChrome';
import { styles } from './_styles/style-entries';
import { useUser } from './_context';
import { API_BASE_URL } from '../services/api';

export default function EntriesScreen() {

    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [isHomeOrSplashPressed, setIsHomeOrSplashPressed] = useState(false);
    const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);

    /*
        Variables used to store a copy of the logged-in user's username and profile settings
    */
    const
        {
            usernameGlobal,
            setUsernameGlobal,
            setHasDairyIntoleranceGlobal,            
            setHasEggAllergyGlobal,
            setHasFishOrShellfishAllergyGlobal,
            setHasGlutenAllergyGlobal,
            setHasMilkAllergyGlobal,
            setHasPeanutAllergyGlobal,
            setHasSesameAllergyGlobal,
            setHasSulfitesAllergyGlobal,
            setHasSoyAllergyGlobal,
            setHasTreenutAllergyGlobal,
            setHasWheatAllergyGlobal,
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
        Log out the logged-in user by setting their profile settings to false, and routing to the splash page
    */
    const logout = () => { 
        
        setUsernameGlobal('');
        setHasDairyIntoleranceGlobal(false);        
        setHasEggAllergyGlobal(false);
        setHasFishOrShellfishAllergyGlobal(false);
        setHasGlutenAllergyGlobal(false);
        setHasMilkAllergyGlobal(false);
        setHasPeanutAllergyGlobal(false);
        setHasSesameAllergyGlobal(false);
        setHasSoyAllergyGlobal(false);
        setHasSulfitesAllergyGlobal(false);
        setHasTreenutAllergyGlobal(false);
        setHasWheatAllergyGlobal(false);
        setIsVeganGlobal(false);
        setIsVegetarianGlobal(false);
        setPrefersHalalGlobal(false);

        router.push('/');
    }

    const line = (label: string, value: string | number) => (
        <>
            <Text style={styles.rowLabel}>{label}</Text>
            <Text style={styles.rowCell}>{value}</Text>
        </>
    );

    return (
        <SafeAreaView style={sc.safeRoot} edges={['top', 'left', 'right']}>
        <View style={sc.container}>
            <StatusBar style="dark" />

            <View id="viewSavedFoodItemsStatusbar" style={sc.topBar}>
                <TouchableOpacity id="homeOrSplashButton"
                    style={[sc.headerButton, isHomeOrSplashPressed && sc.headerButtonPressed]}
                    onPressIn={() => setIsHomeOrSplashPressed(true)}
                    onPressOut={() => setIsHomeOrSplashPressed(false)}
                    onPress={() => router.push('/home')}
                    activeOpacity={0.9}>

                    <Text id="homeOrSplashButtonText" style={sc.headerButtonText} numberOfLines={1}>
                        Home
                    </Text>
                </TouchableOpacity>

                <Text id="loggedInUser" style={sc.userPill} numberOfLines={1}>
                    {usernameGlobal != '' ? `${usernameGlobal}` : 'Guest'}
                </Text>

                <TouchableOpacity id="loginLogoutButton"
                    style={[sc.headerButton, isLoginLogoutPressed && sc.headerButtonPressed]}
                    onPressIn={() => setIsLoginLogoutPressed(true)}
                    onPressOut={() => setIsLoginLogoutPressed(false)}
                    onPress={() => usernameGlobal != '' ? logout() : router.push('/login')}
                    activeOpacity={0.9}>

                    <Text id="loginLogoutButtonText" style={sc.headerButtonText} numberOfLines={1}>
                        {usernameGlobal != '' ? 'Log Out' : 'Log In'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView id="viewSavedFoodItemsScrollView" style={sc.scrollView}
                contentContainerStyle={sc.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled>

                <Text id="savedFoodItemsTitle" style={sc.pageTitle}>
                    Saved Foods
                </Text>
                <Text id="viewSavedFoodItemsInfoTextDefault" style={sc.pageSubtitle}>
                    Items you have logged to your account.
                </Text>

                {foodItemArray.length === 0 && !visible ? (
                    <Text id="viewSavedFoodItemsInfoTextNoItems" style={styles.emptyHint}>
                        You have no saved food items yet.
                    </Text>
                ) : null}

                {foodItemArray && foodItemArray.length > 0 && !visible ? (
                    <FlatList
                        data={foodItemArray}
                        scrollEnabled={true}
                        renderItem={({ item }) => (
                            <View id="rowView" style={styles.entryCard}>
                                {line('Name', item["food_name"])}
                                {line('Location', item["dining_location"])}
                                {line('Calories', processFoodItemCalories(item["calories"]))}
                                {line('Carbs', `${processFoodItemCarbs(item["carbs_g"])} g`)}
                                {line('Fat', `${processFoodItemFat(item["fat_g"])} g`)}
                                {line('Fiber', `${processFoodItemFiber(item["fiber_g"])} g`)}
                                {line('Protein', `${processFoodItemProteins(item["proteins_g"])} g`)}
                                {line('Sugar', `${processFoodItemSugar(item["sugar_g"])} g`)}
                                {line('Saved', item["transaction_time"])}
                            </View>
                        )}
                        keyExtractor={(foodItem, index) =>
                            `${foodItem["food_name"]}-${foodItem["transaction_time"]}-${index}`}
                    />
                ) : null}
            </ScrollView>
        </View>
        </SafeAreaView>
    )

}
