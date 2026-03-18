import { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, FlatList, Image, Modal, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

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
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [lowConfidenceMessage, setLowConfidenceMessage] = useState<string | null>(null);
    const [isBackPressed, setIsBackPressed] = useState(false);
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
            hasSoyAllergyGlobal,
            hasTreenutAllergyGlobal,
            hasWheatAllergyGlobal,
            isVeganGlobal,
            isVegetarianGlobal,
            prefersHalalGlobal,
            setUsernameGlobal,
            setHasConfiguredSettingsGlobal,
            setShowStatsGlobal,
            setHasDairyIntoleranceGlobal,
            setHasEggAllergyGlobal,
            setHasFishOrShellfishAllergyGlobal,
            setHasGlutenAllergyGlobal,
            setHasMilkAllergyGlobal,
            setHasPeanutAllergyGlobal,
            setHasSesameAllergyGlobal,
            setHasSoyAllergyGlobal,
            setHasTreenutAllergyGlobal,
            setHasWheatAllergyGlobal,
            setIsVeganGlobal,
            setIsVegetarianGlobal,
            setPrefersHalalGlobal,

        } = useUser();

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
                },
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                },
            ]
        } as {
            food_items: [
                {
                    dining_location: string,
                    id: number,
                    name: string
                },
                {
                    dining_location: string,
                    id: number,
                    name: string
                },
            ]    
        }
    );

    /*
        Calculate how to display the selected attribute of the selected food item
        Used for processing the calories, carbs, fat, fiber, proteins, and sugar food item attributes

        param(s):
            attribute - number : The value of an attribute of the selected food item

        returns : The updated attribute value of the selected food item
    */
    function processSelectedFoodItemAttribute(attribute: number) {

        if (attribute == -1) {
            return "Unknown";
        }
        else {
            return attribute;
        }
    }

    /*
        Convert the selected food item from a JSON object to an array of JSON objects

        param(s):
            foodItem - any : The selected food item, a JSON object

        returns : The selected food item, an array of JSON objects
    */
    const processSelectedFoodItem = (foodItem: any) => {

        return [
            { field_name: "Name", field_value: foodItem["food_name"]},
            { field_name: "Confidence", field_value: foodItem["confidence"] + " %" },
            { field_name: "Calories", field_value: processSelectedFoodItemAttribute(foodItem["calories"]) },
            { field_name: "Carbs", field_value: processSelectedFoodItemAttribute(foodItem["carbs_g"]) + " grams" },
            { field_name: "Fat", field_value: processSelectedFoodItemAttribute(foodItem["fat_g"]) + " grams" },
            { field_name: "Fiber", field_value: processSelectedFoodItemAttribute(foodItem["fiber_g"]) + " grams" },
            { field_name: "Proteins", field_value: processSelectedFoodItemAttribute(foodItem["proteins_g"]) + " grams" },
            { field_name: "Sugar", field_value: processSelectedFoodItemAttribute(foodItem["sugar_g"]) + " grams" }
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

        if (foodItem["is_dairy_free"] === false && hasDairyIntoleranceGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains dairy" });
        }
        if (foodItem["is_dairy_free"] === null && hasDairyIntoleranceGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain dairy" });
        }
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
    };

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
    };

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
    };

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
            const res = await fetch(`${API_BASE_URL}/browse/food-item-by-name`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( { food_name: name } )
                }
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
        Log out the logged-in user by setting their username and profile settings to their defaults, and routing to the splash page
    */
    const logout = () => { 

        setUsernameGlobal('');
        setHasConfiguredSettingsGlobal(false);
        setShowStatsGlobal(false);
        setHasDairyIntoleranceGlobal(false);
        setHasEggAllergyGlobal(false);
        setHasFishOrShellfishAllergyGlobal(false);
        setHasGlutenAllergyGlobal(false);
        setHasMilkAllergyGlobal(false);
        setHasPeanutAllergyGlobal(false);
        setHasSesameAllergyGlobal(false);
        setHasSoyAllergyGlobal(false);
        setHasTreenutAllergyGlobal(false);
        setHasWheatAllergyGlobal(false);
        setIsVeganGlobal(false);
        setIsVegetarianGlobal(false);
        setPrefersHalalGlobal(false);

        router.push('/');
    }

    return (
        <View style={styles.container}>
            
            <StatusBar style="auto" hidden={true}/>

            <View id="scanFoodItemsStatusbar" style={styles.statusbar}>

                {/* Route the user to the 'home' page or the 'splash' page */}
                <TouchableOpacity id="backButton" style={[styles.headerButtonDefault, {backgroundColor: isBackPressed ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsBackPressed(true)}
                    onPressOut={() => setIsBackPressed(false)}
                    onPress={() => usernameGlobal != '' ? router.push('/home') : router.push('/')}>

                    <Text id="backButtonText" style={styles.headerButtonTextDefault} numberOfLines={1}>
                        Back
                    </Text>
                </TouchableOpacity>

                <Text id="loggedInUser" style={styles.headerUsernameIcon}>
                    {usernameGlobal != '' ? `${usernameGlobal}` : 'Guest'}
                </Text>

                {/* Route the user to the 'splash' page or the 'login' page */}
                <TouchableOpacity id="loginLogoutButton" style={[styles.headerButtonDefault, {backgroundColor: isLoginLogoutPressed ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsLoginLogoutPressed(true)}
                    onPressOut={() => setIsLoginLogoutPressed(false)}
                    onPress={() => usernameGlobal != '' ? logout() : router.push('/login')}>

                    <Text id="loginLogoutButtonText" style={styles.headerButtonTextDefault} numberOfLines={1}>
                        {usernameGlobal != '' ? 'Logout' : 'Login'}
                    </Text>
                </TouchableOpacity>

            </View>

            <Text id="scanFoodItemsTitle" style={styles.headerTitle}>
                Scan Food
            </Text>

            <ScrollView id="scanFoodItemsScrollView" style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled"
                bounces={true}
                overScrollMode="always">

                <Text id="scanFoodItemsInfoText" style={styles.infoText}>
                    Take a photo or upload an image of a food item to identify
                </Text>

                {/* Display the uploaded photo of a food item, henceforth known as the selected food item */}
                {selectedImage && (
                    <Image id="foodItemImage" style={styles.foodImage}
                        source={{uri: selectedImage}}
                        resizeMode="contain">    
                    </Image>
                )}

                {/* Display placeholder text if a photo of a food item has not been uploaded */}
                {/* No selected image makes prediction and lowConfidenceMessage variable values irrelevant */}
                {!selectedImage && (
                    <Text id="foodItemPlaceholderText" style={styles.placeholderText}>
                        Uploaded photos will be displayed here
                    </Text>
                )}

                {/* Display message when confidence was too low (e.g. unclear or non-food image) */}
                {/* Only display when a photo or image has been selected and there is a low confidence message to display */}
                {/* If there's a low confidence message, then the prediction variable value is irrelevant */}
                {selectedImage && lowConfidenceMessage && (
                    <View id="lowConfidenceBanner" style={styles.lowConfidenceBanner}>
                        <Text style={styles.lowConfidenceTitle}>No food detected</Text>
                        <Text style={styles.lowConfidenceMessage}>
                            We couldn&apos;t detect any food in this photo. Please take a clear photo of the food item.
                        </Text>
                    </View>
                )}

                {/* Display information about the selected food item */}
                {/* Only display when a photo or image has been selected and there is a prediction */}
                {/* If there's a prediction, then the lowConfidenceMessage variable value is irrelevant */}
                {selectedImage && prediction && (
                    <View id="foodItemOuterView" style={styles.selectedFoodItemContainer}>

                        <FlatList id="foodItemFlatList"
                            data={processSelectedFoodItem(prediction)}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <View id="foodItemInnerView" style={styles.row}>
                                    <Text id="foodItemFieldNameText" style={styles.rowCell}>{item["field_name"]}</Text>
                                    <Text id="foodItemFieldValueText" style={styles.rowCell}>{item["field_value"]}</Text>
                                </View>
                            )}>
                        </FlatList>

                    </View>
                )}

                {/* Display the relevant warnings for the selected food item based on the logged-in user's settings */}
                {/* Only display when a photo or image has been selected and there is a prediction */}
                {/* If there's a prediction, then the lowConfidenceMessage variable value is irrelevant */}
                {selectedImage && prediction && (
                    <View id="warningOuterView" style={styles.selectedFoodItemContainer}>

                        <FlatList id="warningFlatList"
                            data={processSelectedFoodItemWarnings(prediction)}
                            scrollEnabled={false}
                            renderItem={({ item }) => (
                                <View id="warningInnerView" style={styles.row}>
                                    <Text id="warningFieldNameText" style={styles.rowCell}>{item["field_name"]}</Text>
                                    <Text id="warningFieldValueText" style={styles.rowCell}>{item["field_value"]}</Text>
                                </View>
                            )}>

                        </FlatList>

                    </View>
                )}

                {/* Display buttons that enable the user to take a photo, or upload an image of a food item to identify */}
                {/* Only display when no photo or image has been selected */}
                {/* No selected image makes prediction and lowConfidenceMessage variable values irrelevant */}
                {!selectedImage && (
                    <View id="takePhotoOrUploadPhotoView" style={styles.container}>

                        <TouchableOpacity id="takePhotoButton" style={[styles.bodyButtonDefault, loading && styles.buttonDisabled]}
                            onPress={takePhoto}
                            disabled={loading}>

                            <Text id="takePhotoButtonText" style={styles.bodyButtonTextDefault}>
                                Take Photo
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity id="uploadPhotoButton" style={[styles.bodyButtonDefault, loading && styles.buttonDisabled]}
                            onPress={pickImage}
                            disabled={loading}>

                            <Text id="uploadPhotoButtonText" style={styles.bodyButtonTextDefault}>
                                Upload Photo
                            </Text>
                        </TouchableOpacity>

                    </View>
                )}

                {/* Display buttons that enable the ML component to scan the photo or image, or remove the uploaded photo or image */}
                {/* Only display when a photo or image has been selected and there is no prediction */}
                {/* The image has not been scanned so the lowConfidenceMessage variable value is irrelevant */}
                {selectedImage && prediction === null && (
                    <View id="scanFoodOrDeleteFoodView" style={styles.container}>

                        <TouchableOpacity id="scanFoodButton"
                            style={[styles.bodyButtonScanFood,
                                loading && styles.buttonDisabled,
                                !selectedImage && styles.buttonDisabled]}
                            onPress={scanFood}
                            disabled={loading || !selectedImage}>

                            {loading ? (<ActivityIndicator color="white"/>) :
                                
                                (<Text id="scanFoodButtonText" style={styles.bodyButtonTextDefault}>
                                    Scan Food
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
                            disabled={loading || !selectedImage}>

                            {loading ? (<ActivityIndicator color="white"/>) :

                                (<Text id="deleteFoodButtonText" style={styles.bodyButtonTextAlt}>
                                    Delete Food
                                </Text>)
                            }
                        </TouchableOpacity>

                    </View>
                )}

                {/* Display buttons that enable the generic category of the food item to be used to retrieve related food items from the backend database,
                    or clear the photo or image and prediction results and enable the user to submit a new photo or image */}
                {/* If there's a prediction, then the lowConfidenceMessage variable value is irrelevant */}
                {selectedImage && prediction && (
                    <View id="browseSimilarOrScanOtherView" style={styles.container}>

                        <TouchableOpacity id="browseSimilarFoodItemsButton" style={[styles.bodyButtonDefault, {backgroundColor: isBrowseSimilarPressed ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsBrowseSimilarPressed(true)}
                            onPressOut={() => setIsBrowseSimilarPressed(false)}
                            onPress={() => {
                                getFoodItemByName(prediction.food_name);
                            }}>

                            <Text id="browseSimilarFoodItemsButtonText" style={styles.bodyButtonTextDefault} numberOfLines={1}>
                                Browse Similar
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity id="scanOtherFoodItemButton" style={[styles.bodyButtonDefault, {backgroundColor: isScanOtherPressed ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsScanOtherPressed(true)}
                            onPressOut={() => setIsScanOtherPressed(false)}
                            onPress={() => {
                                setSelectedImage(null);
                                setPrediction(null);
                                setLowConfidenceMessage(null);
                            }}>

                            <Text id="scanOtherFoodItemButtonText" style={styles.bodyButtonTextDefault} numberOfLines={1}>
                                Scan Other
                            </Text>
                        </TouchableOpacity>

                    </View>
                )}

                {/* Display a button that enables the selected food item to be saved to the backend database */}
                {usernameGlobal != "" && prediction && (
                    <TouchableOpacity id="saveFoodItemButton" style={[styles.bodyButtonAlt]}
                        onPress={() => {
                            logFoodItemByName(prediction.food_name);
                            setModalVisible(true);
                            setTimeout(() => {setModalVisible(false);}, 8000);
                            router.push('/home');}}
                        disabled={loading}>

                        <Text id="saveFoodItemButtonText" style={styles.bodyButtonTextAlt}>
                            Save Food Item
                        </Text>
                    </TouchableOpacity>
                )}

                {/* Display a message when the selected food item is saved */}
                {usernameGlobal != "" && modalVisible && (
                    <Modal id="savedFoodItemModal"
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}>

                        <View id="savedFoodItemOuterView">

                            <View id="savedFoodItemInnerView" style={styles.savedFoodItemMessageContainer}>

                                <Text id="savedFoodItemText" style={styles.savedFoodItemText}>
                                    Food Item Saved!
                                </Text>
                            </View>
                        </View>

                    </Modal>
                )}

            </ScrollView>

        </View>
    )

}
