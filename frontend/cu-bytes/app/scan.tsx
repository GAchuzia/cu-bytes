import { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, Image, Modal, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { KeyValueRows } from './_components/KeyValueRows';
import { screenChrome as sc } from './_styles/screenChrome';
import { styles } from './_styles/style-scan';
import { useUser } from './_context';
import { apiService, API_BASE_URL } from '../services/api';

/*
    The prediction result returned by the machine learning component when the confidence attribute is above a certain threshold
*/
interface PredictionResult {
    success?: true,
    confidence: number,

    food_name: string,
    calories: number,
    carbs_g: number,
    fat_g: number,
    fiber_g: number,
    proteins_g: number,    
    sugar_g: number,
    
    is_dairy_free: boolean,
    has_eggs: boolean,
    has_fish_or_shellfish: boolean,
    is_gluten_free: boolean,
    has_milk: boolean,
    has_peanuts: boolean,
    has_sesame: boolean,
    has_soy: boolean,
    has_treenuts: boolean,
    has_wheat: boolean,
    is_vegan: boolean;
    is_vegetarian: boolean,
    is_halal: boolean,
}

/*
    The prediction result returned by the machine learning component when the confidence attribute is below a certain threshold
    The machine learning component will be return these results when the selected photo or image is unclear or of a non-food item
*/
interface LowConfidenceResponse {
    success: false,
    reason: 'low_confidence',
    confidence: number,
    message: string,
}

export default function ScanScreen() {

    const [loading, setLoading] = useState(false);
    
    const [foodItemSaved, setFoodItemSaved] = useState(false);
    const [similarFoodItems, setSimilarFoodItems] = useState(false);
    const [similarFoodItemSelected, setSimilarFoodItemSelected] = useState(false);
    const [foodItemInfoVisible, setFoodItemInfoVisible] = useState(false);
    const [foodItemWarningVisible, setFoodItemWarningVisible] = useState(false);

    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [lowConfidenceMessage, setLowConfidenceMessage] = useState<string | null>(null);
    
    const [isHomeOrSplashPressed, setIsHomeOrSplashPressed] = useState(false);
    const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);
    const [isBrowseSimilarPressed, setIsBrowseSimilarPressed] = useState(false);
    const [isScanOtherPressed, setIsScanOtherPressed] = useState(false);
 
    /*
        Variables and setters used to store a copy of the logged-in user's username and profile settings
        (Frontend copy updated based on the backend data)
    */
    const
        {
            usernameGlobal,
            hasDairyIntoleranceGlobal,            
            hasEggAllergyGlobal,
            hasFishOrShellfishAllergyGlobal,
            hasGlutenAllergyGlobal,            
            hasMilkAllergyGlobal,
            hasPeanutAllergyGlobal,
            hasSesameAllergyGlobal,
            hasSulfitesAllergyGlobal,
            hasSoyAllergyGlobal,
            hasTreenutAllergyGlobal,
            hasWheatAllergyGlobal,
            isVeganGlobal,
            isVegetarianGlobal,
            prefersHalalGlobal,
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

    /*
        Variable and setter for storing and modifying the selected food item
        Initialize the default key values for the food item
        This ensures that the key values can be accessed without raising errors
    */
    const [foodItem, setFoodItem] = useState(
        {
            calories: -1,
            carbs_g: 0.00,
            comments: "",
            cost: 0.00,
            dining_location: "",
            fat_g: 0.00,
            fiber_g: 0.00,
            food_category: "",
            has_eggs: null,
            has_fish_or_shellfish: null,
            has_milk: null,
            has_peanuts: null,
            has_sesame: null,
            has_soy: null,
            has_sulfites: null,
            has_treenuts: null,
            has_wheat: null,
            id: -1, // Initial value of 1 to prevent errors
            is_dairy_free: null,
            is_gluten_free: null,
            is_halal: null,
            is_vegan: null,
            is_vegetarian: null,
            last_updated: "",
            name: "",
            proteins_g: 0.00,
            sugar_g: 0.00
        } as {
            calories: number,
            carbs_g: number,
            comments: string,
            cost: number,
            dining_location: string,
            fat_g: number,
            fiber_g: number,
            food_category: string,
            has_eggs: null,
            has_fish_or_shellfish: null,
            has_milk: null,
            has_peanuts: null,
            has_sesame: null,
            has_soy: null,
            has_sulfites: null,
            has_treenuts: null,
            has_wheat: null,
            id: number,
            is_dairy_free: null,
            is_gluten_free: null,
            is_halal: null,
            is_vegan: null,
            is_vegetarian: null,
            last_updated: string,
            name: string,
            proteins_g: number,
            sugar_g: number
        }
    );

    /*
        Variable and setter for storing food items retrieved from the backend database that match a generic category
    */
    const [genericCategoryFoodItems, setGenericCategoryFoodItems] = useState(
        {
            food_items: [
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                }
            ]
        } as {
            food_items: [
                {
                    dining_location: string,
                    id: number,
                    name: string
                }
            ]    
        }
    );

    const similarFoodItemsList =
        Array.isArray(genericCategoryFoodItems?.food_items)
            ? genericCategoryFoodItems.food_items.filter(
                  (fi) => fi && typeof fi.id === 'number' && fi.id !== -1
              )
            : [];

    const noSimilarMatches =
        similarFoodItems &&
        !similarFoodItemSelected &&
        !!prediction &&
        similarFoodItemsList.length === 0;

    /*
        Calculate how to display the attribute of the food item
        Used for processing the calories, carbs, fat, fiber, proteins, and sugar food item attributes

        param(s):
            attribute - number : The value of an attribute of the food item

        returns : The updated attribute value of the food item
    */
    function processFoodItemAttribute(attribute: number) {

        if (attribute == -1) {
            return "Unknown";
        }
        else {
            return attribute;
        }
    }

    /*
        Convert the scanned food item from a JSON object to an array of JSON objects

        param(s):
            foodItem - any : The scanned food item, a JSON object

        returns : The scanned food item, an array of JSON objects
    */
    const processScannedFoodItem = (foodItem: any) => {

        return [
            { field_name: "Name", field_value: foodItem["food_name"]},
            { field_name: "Confidence", field_value: foodItem["confidence"] + " %" },
            { field_name: "Calories", field_value: processFoodItemAttribute(foodItem["calories"]) },
            { field_name: "Carbs", field_value: processFoodItemAttribute(foodItem["carbs_g"]) + " grams*" },
            { field_name: "Fat", field_value: processFoodItemAttribute(foodItem["fat_g"]) + " grams*" },
            { field_name: "Fiber", field_value: processFoodItemAttribute(foodItem["fiber_g"]) + " grams*" },
            { field_name: "Proteins", field_value: processFoodItemAttribute(foodItem["proteins_g"]) + " grams*" },
            { field_name: "Sugar", field_value: processFoodItemAttribute(foodItem["sugar_g"]) + " grams*" }
        ]
    }

    /*
        Convert the selected food item from a JSON object to an array of JSON objects

        param(s):
            foodItem - any : The selected food item, a JSON object

        returns : The selected food item, an array of JSON objects
    */
    const processSelectedFoodItem = (foodItem: any) => {

        return [
            { field_name: "Name", field_value: foodItem["name"]},
            { field_name: "Calories", field_value: processFoodItemAttribute(foodItem["calories"]) },
            { field_name: "Location", field_value: foodItem["dining_location"] },
            { field_name: "Cost", field_value: "$ " + processFoodItemAttribute(foodItem["cost"]) },
            { field_name: "Carbs", field_value: processFoodItemAttribute(foodItem["carbs_g"]) + " grams*" },
            { field_name: "Fat", field_value: processFoodItemAttribute(foodItem["fat_g"]) + " grams*" },
            { field_name: "Fiber", field_value: processFoodItemAttribute(foodItem["fiber_g"]) + " grams*" },
            { field_name: "Proteins", field_value: processFoodItemAttribute(foodItem["proteins_g"]) + " grams*" },
            { field_name: "Sugar", field_value: processFoodItemAttribute(foodItem["sugar_g"]) + " grams*" }
        ]
    }

    /*
        Generate the relevant warnings for the selected food item based on the logged-in user's settings

        param(s):
            foodItem - any : The selected food item, a JSON object

        returns : The warnings for the selected food item, an array of JSON objects
    */
    const processSelectedFoodItemWarnings = (foodItem: any) => {

        let foodItemWarningsArray = Array();

        if (foodItem["has_eggs"] === true && hasEggAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains eggs" });
        }
        if (foodItem["has_eggs"] === null && hasEggAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain eggs" });
        }
        if (foodItem["has_fish_or_shellfish"] === true && hasFishOrShellfishAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains fish or shellfish" });
        }
        if (foodItem["has_fish_or_shellfish"] === null && hasFishOrShellfishAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain fish or shellfish" });
        }
        if (foodItem["is_dairy_free"] === false && hasDairyIntoleranceGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains dairy" });
        }
        if (foodItem["is_dairy_free"] === null && hasDairyIntoleranceGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain dairy" });
        }
        if (foodItem["has_milk"] === true && hasMilkAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains milk" });
        }
        if (foodItem["has_milk"] === null && hasMilkAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain milk" });
        }
        if (foodItem["has_peanuts"] === true && hasPeanutAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains peanuts" });
        }
        if (foodItem["has_peanuts"] === null && hasPeanutAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain peanuts" });
        }
        if (foodItem["has_sesame"] === true && hasSesameAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains sesame" });
        }
        if (foodItem["has_sesame"] === null && hasSesameAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain sesame" });
        }
        if (foodItem["has_soy"] === true && hasSoyAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains soy" });
        }
        if (foodItem["has_soy"] === null && hasSoyAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain soy" });
        }
        if (foodItem["has_sulfites"] === true && hasSulfitesAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains sulfites" });
        }
        if (foodItem["has_sulfites"] === null && hasSulfitesAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain sulfites" });
        }
        if (foodItem["has_treenuts"] === true && hasTreenutAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains treenuts" });
        }
        if (foodItem["has_treenuts"] === null && hasTreenutAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain treenuts" });
        }
        if (foodItem["has_wheat"] === true && hasWheatAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains wheat" });
        }
        if (foodItem["has_wheat"] === null && hasWheatAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain wheat" });
        }
        if (foodItem["is_gluten_free"] === false && hasGlutenAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains gluten" });
        }
        if (foodItem["is_gluten_free"] === null && hasGlutenAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain gluten" });
        }
        if (foodItem["is_vegan"] === false && isVeganGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item is not vegan" });
        }
        if (foodItem["is_vegan"] === null && isVeganGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may not be vegan" });
        }
        if (foodItem["is_vegetarian"] === false && isVegetarianGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item is not vegetarian" });
        }
        if (foodItem["is_vegetarian"] === null && isVegetarianGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may not be vegetarian" });
        }
        if (foodItem["is_halal"] === false && prefersHalalGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item is not halal" });
        }
        if (foodItem["is_halal"] === null && prefersHalalGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may not be halal" });
        }       

        return foodItemWarningsArray;
    }

    /*
        If the user is not logged-in, set the profile settings to true,
        So that all allergy and intolerance warnings will be displayed by default
    */
    useEffect(() => {
        
        if (usernameGlobal === '') {
            setHasDairyIntoleranceGlobal(true);
            setHasEggAllergyGlobal(true);
            setHasFishOrShellfishAllergyGlobal(true);
            setHasGlutenAllergyGlobal(true);
            setHasMilkAllergyGlobal(true);
            setHasPeanutAllergyGlobal(true);
            setHasSesameAllergyGlobal(true);
            setHasSulfitesAllergyGlobal(true);
            setHasSoyAllergyGlobal(true);
            setHasTreenutAllergyGlobal(true);
            setHasWheatAllergyGlobal(true);
            setIsVeganGlobal(true);
            setIsVegetarianGlobal(true);
            setPrefersHalalGlobal(true);
        }

    }, []);

    /*
        Enable the user to select an image on the device that the CU-Bytes application is running on
        The selected image will be analyzed by the machine learning component
    */
    const pickImage = async () => {
        try {
            // Request permissions
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

            // If the application is denied permission to access the camera roll, display a message to the user
            if (status !== 'granted') {
                Alert.alert('Permission Needed', 'Sorry, we need camera roll permissions to select an image!');
                return;
            }

            // Launch image picker
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
                // Clear previous prediction and low-confidence message
                setPrediction(null);
                setLowConfidenceMessage(null);
            }
        } catch (err) {
            console.error('Error picking image:', err);
            Alert.alert('Error', 'Failed to pick image. Please try again');
        }
    }

    /*
        Enable the user to take a photo with the camera on the device that the CU-Bytes application is running on
        The selected photo will be analyzed by the machine learning component
    */
    const takePhoto = async () => {
        try {
            // Request permissions
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            // If the application is denied permission to access the camera, display a message to the user
            if (status !== 'granted') {
                Alert.alert('Permission Needed', 'Sorry, we need camera permissions to take a photo!');
                return;
            }

            // Launch camera
            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
                // Clear previous prediction and low-confidence message
                setPrediction(null);
                setLowConfidenceMessage(null);
            }

        } catch (err) {
            console.error('Error taking photo:', err);
            Alert.alert('Error', 'Failed to take photo. Please try again');
        }
    }

    /*
        Send the selected photo or image to the machine learning component to be analyzed
    */
    const scanFood = async () => {

        // If the application does not currently have a selected photo or image, display a message to the user
        if (!selectedImage) {
            Alert.alert('No Image', 'Please select an image or take a photo first');
            return;
        }

        setLoading(true);

        try {
            // Predict the food item from the selected photo or image
            const result = await apiService.predictFood(selectedImage);
            console.log('Prediction result received:', result);

            // Low confidence prediction result
            const lowConf = result as LowConfidenceResponse;

            // The confidence attribute of the prediction result is below the threshold
            if (lowConf.success === false && lowConf.reason === 'low_confidence') {
                setPrediction(null);
                setLowConfidenceMessage(lowConf.message);

                Alert.alert('Please retake the photo or select a different image', lowConf.message, [{ text: 'OK' }]);
                return;
            }

            // The confidence attribute of the prediction result is above the threshold
            setPrediction(result as PredictionResult);
            setLowConfidenceMessage(null);

        } catch (err: any) {
            console.error('Prediction error:', err);
            Alert.alert('Error', err.response?.data?.error || 'Failed to predict food item. Please try again');
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
            const res = await fetch(`${API_BASE_URL}/logging/log-by-id`, {
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
        Send a request to the backend endpoint to log a username and food item name in the database
        This records which user purchased what food item

        param(s):
            name - string : The name of the food item to be logged
    */
    const logFoodItemByName = async (name: string) => {
        try {
            const res = await fetch(`${API_BASE_URL}/logging/log-by-name`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( { username: usernameGlobal, food_name: name } )
                }
            );
            const data = await res.json();

        } catch (err) {
            console.error('Error logging food item by name:', err);
        } finally {
            setLoading(false);
        }
    }

    /*
        Send a request to the backend endpoint to get a list of food items that match the provided food name
        The food name is a generic category. Every food item in the backend database is assigned a generic category

        param(s):
            name - string : The name of the generic category that food items will be matched against
    */
    const getFoodItemByName = async (name: string) => {
        try {
            const res = await fetch(
                `${API_BASE_URL}/browse/food-item-by-name?name=${encodeURIComponent(name)}`
            );
            const data = await res.json();

            // Store the retrieved food items in the array
            setGenericCategoryFoodItems(data);
            console.log(genericCategoryFoodItems);
        
        } catch (err) {
            console.error('Error retrieving food items by name:', err);
        } finally {
            setLoading(false);
        }
    }

    /*
        Send a request to the backend endpoint to get a food item from the database by id

        param(s):
            id - number : The id of the selected food item
    */
    const getFoodItem = async (id: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/browse/food-item/${id}`);
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

    return (
        <SafeAreaView style={sc.safeRoot} edges={['top', 'left', 'right']}>
        <View style={sc.container}>
            
            <StatusBar style="dark" />

            <View id="scanFoodItemsStatusbar" style={sc.topBar}>

                <TouchableOpacity id="backButton" style={[sc.headerButton, isHomeOrSplashPressed && sc.headerButtonPressed]}
                    onPressIn={() => setIsHomeOrSplashPressed(true)}
                    onPressOut={() => setIsHomeOrSplashPressed(false)}
                    onPress={() => usernameGlobal != '' ? router.push('/home') : router.push('/')}
                    activeOpacity={0.9}>

                    <Text id="backButtonText" style={sc.headerButtonText} numberOfLines={1}>
                        Home
                    </Text>
                </TouchableOpacity>

                <Text id="loggedInUser" style={sc.userPill} numberOfLines={1}>
                    {usernameGlobal != '' ? `${usernameGlobal}` : 'Guest'}
                </Text>

                <TouchableOpacity id="loginLogoutButton" style={[sc.headerButton, isLoginLogoutPressed && sc.headerButtonPressed]}
                    onPressIn={() => setIsLoginLogoutPressed(true)}
                    onPressOut={() => setIsLoginLogoutPressed(false)}
                    onPress={() => usernameGlobal != '' ? logout() : router.push('/login')}
                    activeOpacity={0.9}>

                    <Text id="loginLogoutButtonText" style={sc.headerButtonText} numberOfLines={1}>
                        {usernameGlobal != '' ? 'Log Out' : 'Log In'}
                    </Text>
                </TouchableOpacity>

            </View>

            <ScrollView id="scanFoodItemsScrollView" style={sc.scrollView}
                contentContainerStyle={sc.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
                nestedScrollEnabled
                bounces={true}
                overScrollMode="always">

                <Text id="scanFoodItemsTitle" style={sc.pageTitle}>
                    Scan Food
                </Text>

                <Text id="scanFoodItemsInfoText" style={sc.pageSubtitle}>
                    {
                        !similarFoodItems && !similarFoodItemSelected ? 'Take a photo or upload an image of a food item to identify' :
                        similarFoodItems && !similarFoodItemSelected ? 'Here are the food items similar to ' + prediction?.food_name : 
                        similarFoodItems && similarFoodItemSelected ? 'Here is a food item similar to ' + prediction?.food_name : 
                        ''
                    }
                </Text>

                {/* Display the uploaded photo of a food item, henceforth known as the selected food item */}
                {selectedImage && !similarFoodItems && !similarFoodItemSelected && (
                    <Image
                        id="foodItemImage"
                        style={styles.foodImage}
                        source={{ uri: selectedImage }}
                        resizeMode="contain"
                    />
                )}

                {/* Display placeholder text if a photo of a food item has not been uploaded */}
                {/* No selected image makes prediction and lowConfidenceMessage variable values irrelevant */}
                {!selectedImage && !similarFoodItems && !similarFoodItemSelected && (
                    <Text id="foodItemPlaceholderText" style={styles.placeholderText}>
                        Uploaded photos will be displayed here
                    </Text>
                )}

                {/* Display message when confidence was too low (e.g. unclear or non-food image) */}
                {/* Only display when a photo or image has been selected and there is a low confidence message to display */}
                {/* If there's a low confidence message, then the prediction variable value is irrelevant */}
                {selectedImage && lowConfidenceMessage && !similarFoodItems && !similarFoodItemSelected && (
                    <View id="lowConfidenceBanner" style={styles.lowConfidenceBanner}>
                        <Text style={styles.lowConfidenceTitle}>No Confident Match</Text>
                        <Text style={styles.lowConfidenceMessage}>
                            We couldn&apos;t identify the food in this image. Try a clearer shot of the dish.
                        </Text>
                    </View>
                )}

                {/* Display information about the selected food item */}
                {/* Only display when a photo or image has been selected and there is a prediction */}
                {/* If there's a prediction, then the lowConfidenceMessage variable value is irrelevant */}
                {selectedImage && prediction && !similarFoodItems && !similarFoodItemSelected && (
                    <View id="foodItemOuterView" style={[sc.card, styles.selectedFoodItemContainer]}>

                        <KeyValueRows
                            rows={processScannedFoodItem(prediction)}
                            styles={{
                                row: sc.row,
                                rowLast: sc.rowLast,
                                rowCellLabel: sc.rowCellLabel,
                                rowCellValue: sc.rowCellValue,
                            }}
                        />

                        <Text id="noteInfoText" style={styles.listRowText}>
                            * = estimate from USDA food database 
                        </Text>
                    </View>
                )}

                {/* Display the relevant warnings for the selected food item based on the logged-in user's settings */}
                {/* Only display when a photo or image has been selected and there is a prediction */}
                {/* If there's a prediction, then the lowConfidenceMessage variable value is irrelevant */}
                {selectedImage && prediction && !similarFoodItems && !similarFoodItemSelected && (
                    <View id="warningOuterView" style={[sc.card, styles.selectedFoodItemContainer]}>

                        <KeyValueRows
                            rows={processSelectedFoodItemWarnings(prediction)}
                            styles={{
                                row: sc.row,
                                rowLast: sc.rowLast,
                                rowCellLabel: sc.rowCellLabel,
                                rowCellValue: sc.rowCellValue,
                            }}
                        />
                        
                        <Text id="noteInfoText" style={styles.listRowText}>
                            Allergy information on this page is derived from an aggregation of Carleton data, and may not be entirely accurate
                        </Text>
                    </View>
                )}

                {/* Display buttons that enable the user to take a photo, or upload an image of a food item to identify */}
                {/* Only display when no photo or image has been selected */}
                {/* No selected image makes prediction and lowConfidenceMessage variable values irrelevant */}
                {!selectedImage && !similarFoodItems && !similarFoodItemSelected && (
                    <View id="takePhotoOrUploadPhotoView" style={styles.innerStack}>

                        <TouchableOpacity id="takePhotoButton" style={[sc.bodyButton, loading && styles.buttonDisabled]}
                            onPress={takePhoto}
                            disabled={loading}
                            activeOpacity={0.92}>

                            <Text id="takePhotoButtonText" style={sc.bodyButtonText}>
                                Open Camera
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity id="uploadPhotoButton" style={[sc.bodyButtonOutline, loading && styles.buttonDisabled]}
                            onPress={pickImage}
                            disabled={loading}
                            activeOpacity={0.92}>

                            <Text id="uploadPhotoButtonText" style={sc.bodyButtonOutlineText}>
                                Choose From Gallery
                            </Text>
                        </TouchableOpacity>

                    </View>
                )}

                {/* Display buttons that enable the ML component to scan the photo or image, or remove the uploaded photo or image */}
                {/* Only display when a photo or image has been selected and there is no prediction */}
                {/* The image has not been scanned so the lowConfidenceMessage variable value is irrelevant */}
                {selectedImage && prediction === null && (
                    <View id="scanFoodOrDeleteFoodView" style={styles.innerStack}>

                        <TouchableOpacity id="scanFoodButton"
                            style={[styles.bodyButtonScanFood,
                                loading && styles.buttonDisabled,
                                !selectedImage && styles.buttonDisabled]}
                            onPress={scanFood}
                            disabled={loading || !selectedImage}
                            activeOpacity={0.92}>

                            {loading ? (<ActivityIndicator color="#FFFFFF"/>) :
                                
                                (<Text id="scanFoodButtonText" style={sc.bodyButtonText}>
                                    Analyze Photo
                                </Text>)
                            }
                        </TouchableOpacity>

                        <TouchableOpacity id="deleteFoodButton"
                            style={[styles.bodyButtonDeleteFood,
                                loading && styles.buttonDisabled,
                                !selectedImage && styles.buttonDisabled]}
                            onPress={() => {
                                setSelectedImage(null);
                                setPrediction(null);
                            }}
                            disabled={loading || !selectedImage}
                            activeOpacity={0.92}>

                            {loading ? (<ActivityIndicator color="#9E1116"/>) :

                                (<Text id="deleteFoodButtonText" style={styles.bodyButtonDeleteFoodText}>
                                    Remove Photo
                                </Text>)
                            }
                        </TouchableOpacity>

                    </View>
                )}

                {/* Display buttons that enable the generic category of the food item to be used to retrieve related food items from the backend database,
                    or clear the photo or image and prediction results and enable the user to submit a new photo or image */}
                {/* If there's a prediction, then the lowConfidenceMessage variable value is irrelevant */}
                {selectedImage && prediction && !similarFoodItems && !similarFoodItemSelected && (
                    <View id="browseSimilarOrScanOtherView" style={styles.innerStack}>

                        <TouchableOpacity id="browseSimilarFoodItemsButton" style={[sc.bodyButton, isBrowseSimilarPressed && sc.bodyButtonPressed]}
                            onPressIn={() => setIsBrowseSimilarPressed(true)}
                            onPressOut={() => setIsBrowseSimilarPressed(false)}
                            onPress={() => {
                                getFoodItemByName(prediction.food_name);
                                setSimilarFoodItems(true);
                            }}
                            activeOpacity={0.92}>

                            <Text id="browseSimilarFoodItemsButtonText" style={sc.bodyButtonText} numberOfLines={1}>
                                Browse Similar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity id="scanOtherFoodItemButton" style={[sc.bodyButtonOutline, isScanOtherPressed && { opacity: 0.88 }]}
                            onPressIn={() => setIsScanOtherPressed(true)}
                            onPressOut={() => setIsScanOtherPressed(false)}
                            onPress={() => {
                                setSelectedImage(null);
                                setPrediction(null);
                                setLowConfidenceMessage(null);
                            }}
                            activeOpacity={0.92}>

                            <Text id="scanOtherFoodItemButtonText" style={sc.bodyButtonOutlineText} numberOfLines={1}>
                                New Photo
                            </Text>
                        </TouchableOpacity>

                        {usernameGlobal !== '' && (
                            <TouchableOpacity id="saveFoodItemButton" style={sc.bodyButtonOutline}
                                onPress={() => {
                                    logFoodItemByName(prediction.food_name);
                                    setSelectedImage(null);
                                    setPrediction(null);
                                    setLowConfidenceMessage(null);
                                    setSimilarFoodItems(false);
                                    setSimilarFoodItemSelected(false);
                                    setFoodItemInfoVisible(false);
                                    setFoodItemWarningVisible(false);
                                    setFoodItemSaved(true);
                                    setTimeout(() => {setFoodItemSaved(false);}, 2000);
                                    router.push('/home');}}
                                disabled={loading}
                                activeOpacity={0.92}>

                                <Text id="saveFoodItemButtonText" style={sc.bodyButtonOutlineText}>
                                    Save Food Item
                                </Text>
                            </TouchableOpacity>
                        )}

                    </View>
                )}

                {/* Display food items that match the selected generic category */}
                {similarFoodItems && !similarFoodItemSelected && (
                    <View id="browseSimilarFoodItemsSuccessView" style={[sc.card, { marginBottom: 14, overflow: 'hidden' }]}>

                        {noSimilarMatches && (
                            <View id="noSimilarMatchesBanner" style={styles.lowConfidenceBanner}>
                                <Text style={styles.lowConfidenceTitle}>No Carleton Dining Matches</Text>
                                <Text style={styles.lowConfidenceMessage}>
                                    {prediction?.food_name
                                        ? `"${prediction.food_name}" items are not available for purchase at any of Carleton's Dining locations.`
                                        : `These items are not available for purchase at any of Carleton's Dining locations.`}
                                </Text>
                            </View>
                        )}

                        {similarFoodItemsList.map((foodItem) => (

                            <Text id="browseSimilarFoodItemsSuccessText" style={styles.listRowText}
                                key={foodItem["id"]}
                                onPress={() => {
                                    getFoodItem(foodItem["id"]);
                                    setSimilarFoodItemSelected(true);
                                    setFoodItemInfoVisible(true);
                                    setFoodItemWarningVisible(true);
                                }}>
                                {foodItem["name"]} · {foodItem["dining_location"]}
                            </Text>
                        ))}

                    </View>
                )}

                {/* Display information about the selected food item */}
                {similarFoodItemSelected && foodItemInfoVisible && (
                    <View id="selectedSimilarFoodItemOuterView" style={[sc.card, styles.selectedFoodItemContainer]}>

                        <KeyValueRows
                            rows={processSelectedFoodItem(foodItem)}
                            styles={{
                                row: sc.row,
                                rowLast: sc.rowLast,
                                rowCellLabel: sc.rowCellLabel,
                                rowCellValue: sc.rowCellValue,
                            }}
                        />

                        <Text id="noteInfoText" style={styles.listRowText}>
                            * = estimate from USDA food database 
                        </Text>
                    </View>
                )}

                {/* Display the relevant warnings for the selected food item based on the logged-in user's settings */}
                {similarFoodItemSelected && foodItemWarningVisible && (
                    <View id="warningOuterView" style={[sc.card, styles.selectedFoodItemContainer]}>

                        <KeyValueRows
                            rows={processSelectedFoodItemWarnings(foodItem)}
                            styles={{
                                row: sc.row,
                                rowLast: sc.rowLast,
                                rowCellLabel: sc.rowCellLabel,
                                rowCellValue: sc.rowCellValue,
                            }}
                        />
                    </View>
                )}

                {/* Display a button that enables the selected food item to be saved to the backend database */}
                {similarFoodItems && similarFoodItemSelected && (
                    <View id="scanOtherOrsaveFoodItemView" style={styles.innerStack}>

                        <TouchableOpacity id="scanOtherFoodItemButton" style={[sc.bodyButtonOutline, isScanOtherPressed && { opacity: 0.88 }]}
                            onPressIn={() => setIsScanOtherPressed(true)}
                            onPressOut={() => setIsScanOtherPressed(false)}
                            onPress={() => {
                                setSelectedImage(null);
                                setPrediction(null);
                                setLowConfidenceMessage(null);
                                
                                setSimilarFoodItems(false);
                                setSimilarFoodItemSelected(false);
                                setFoodItemInfoVisible(false);
                                setFoodItemWarningVisible(false);
                            }}
                            activeOpacity={0.92}>

                            <Text id="scanOtherFoodItemButtonText" style={sc.bodyButtonOutlineText} numberOfLines={1}>
                                New Photo
                            </Text>
                        </TouchableOpacity>
                        
                        {usernameGlobal !== '' && (
                            <TouchableOpacity id="saveFoodItemButton" style={sc.bodyButton}
                                onPress={() => {
                                    logFoodItemById(foodItem.id);
                                    setSelectedImage(null);
                                    setPrediction(null);
                                    setLowConfidenceMessage(null);
                                    setSimilarFoodItems(false);
                                    setSimilarFoodItemSelected(false);
                                    setFoodItemInfoVisible(false);
                                    setFoodItemWarningVisible(false);
                                    setFoodItemSaved(true);
                                    setTimeout(() => {setFoodItemSaved(false);}, 2000);
                                    router.push('/home');}}
                                disabled={loading}
                                activeOpacity={0.92}>

                                <Text id="saveFoodItemButtonText" style={sc.bodyButtonText}>
                                    Save Food Item
                                </Text>
                            </TouchableOpacity>
                        )}

                    </View>
                )}

                {/* Display a message when the selected food item is saved */}
                {usernameGlobal != "" && foodItemSaved && (
                    <Modal id="savedFoodItemModal"
                        animationType="fade"
                        transparent={true}
                        visible={foodItemSaved}>

                        <View id="savedFoodItemOuterView" style={styles.savedFoodItemMessageContainer}>

                            <View id="savedFoodItemInnerView" style={styles.savedFoodItemInner}>

                                <Text id="savedFoodItemText" style={styles.savedFoodItemText}>
                                    Food Item Saved
                                </Text>
                            </View>
                        </View>

                    </Modal>
                )}

            </ScrollView>

        </View>
        </SafeAreaView>
    )

}
