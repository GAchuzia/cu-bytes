import { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, FlatList, Image, Alert, ActivityIndicator, Modal } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './_styles/style-scan';
import { useUser } from './_context';
import { apiService, API_BASE_URL } from '../services/api';

interface PredictionResult {
    success?: true;
    food_name: string;
    confidence: number;
    calories: number;
    fat_g: number;
    carbs_g: number;
    proteins_g: number;
    fiber_g: number;
    sugar_g: number;
    is_vegan: boolean;
    is_gluten_free: boolean;
    is_halal: boolean;
    is_vegetarian: boolean;
    is_dairy_free: boolean;
    has_eggs: boolean;
    has_fish_or_shellfish: boolean;
    has_milk: boolean;
    has_peanuts: boolean;
    has_sesame: boolean;
    has_soy: boolean;
    has_treenuts: boolean;
    has_wheat: boolean;
}

/** Returned when confidence is below threshold (e.g. unclear photo or non-food). */
interface LowConfidenceResponse {
    success: false;
    reason: 'low_confidence';
    confidence: number;
    message: string;
}

export default function ScanScreen() {

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const [lowConfidenceMessage, setLowConfidenceMessage] = useState<string | null>(null);
    const [isBackPressed, setIsBackPressed] = useState(false);
    const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);
    const [isUploadPhotoPressed, setIsUploadPhotoPressed] = useState(false);
    const [isScanPressed, setIsScanPressed] = useState(false);

    /*
        Variables and setters used to store a copy of the logged-in user's username and profile settings
        (Frontend copy updated based on the backend data)
    */
    const
        {
            usernameGlobal,
            hasEggAllergyGlobal,
            hasFishOrShellfishAllergyGlobal,
            hasDairyIntoleranceGlobal,
            hasMilkAllergyGlobal,
            hasPeanutAllergyGlobal,
            hasSesameAllergyGlobal,
            hasSoyAllergyGlobal,
            hasTreenutAllergyGlobal,
            hasWheatAllergyGlobal,
            hasGlutenAllergyGlobal,
            isVeganGlobal,
            isVegetarianGlobal,
            prefersHalalGlobal,
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
        Convert the selected food item from a JSON object to an array of JSON objects

        param(s):
            foodItem - any : The selected food item, a JSON object

        returns : The selected food item, an array of JSON objects
    */
    const processSelectedFoodItem = (foodItem: any) => {

        return [
            { field_name: "Name", field_value: foodItem["food_name"]},
            { field_name: "Confidence", field_value: foodItem["confidence"] + " %" },
            { field_name: "Calories", field_value: processFoodItemCalories(foodItem["calories"]) },
            { field_name: "Carbs", field_value: processFoodItemCarbs(foodItem["carbs_g"]) + " grams" },
            { field_name: "Fat", field_value: processFoodItemFat(foodItem["fat_g"]) + " grams" },
            { field_name: "Fiber", field_value: processFoodItemFiber(foodItem["fiber_g"]) + " grams" },
            { field_name: "Proteins", field_value: processFoodItemProteins(foodItem["proteins_g"]) + " grams" },
            { field_name: "Sugar", field_value: processFoodItemSugar(foodItem["sugar_g"]) + " grams" }
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

        if (foodItem.confidence >= 75 && foodItem["has_eggs"] === true && hasEggAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains eggs" });
        }
        if (foodItem.confidence >= 75 && foodItem["has_eggs"] === null && hasEggAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain eggs" });
        }

        if (foodItem.confidence >= 75 && foodItem["has_fish_or_shellfish"] === true && hasFishOrShellfishAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains fish or shellfish" });
        }
        if (foodItem.confidence >= 75 && foodItem["has_fish_or_shellfish"] === null && hasFishOrShellfishAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain fish or shellfish" });
        }

        if (foodItem.confidence >= 75 && foodItem["is_dairy_free"] === false && hasDairyIntoleranceGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains dairy" });
        }
        if (foodItem.confidence >= 75 && foodItem["is_dairy_free"] === null && hasDairyIntoleranceGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain dairy" });
        }

        if (foodItem.confidence >= 75 && foodItem["has_milk"] === true && hasMilkAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains milk" });
        }
        if (foodItem.confidence >= 75 && foodItem["has_milk"] === null && hasMilkAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain milk" });
        }

        if (foodItem.confidence >= 75 && foodItem["has_peanuts"] === true && hasPeanutAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains peanuts" });
        }
        if (foodItem.confidence >= 75 && foodItem["has_peanuts"] === null && hasPeanutAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain peanuts" });
        }

        if (foodItem.confidence >= 75 && foodItem["has_sesame"] === true && hasSesameAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains sesame" });
        }
        if (foodItem.confidence >= 75 && foodItem["has_sesame"] === null && hasSesameAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain sesame" });
        }
        
        if (foodItem.confidence >= 75 && foodItem["has_soy"] === true && hasSoyAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains soy" });
        }
        if (foodItem.confidence >= 75 && foodItem["has_soy"] === null && hasSoyAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain soy" });
        }

        if (foodItem.confidence >= 75 && foodItem["has_treenuts"] === true && hasTreenutAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains treenuts" });
        }
        if (foodItem.confidence >= 75 && foodItem["has_treenuts"] === null && hasTreenutAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain treenuts" });
        }

        if (foodItem.confidence >= 75 && foodItem["has_wheat"] === true && hasWheatAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains wheat" });
        }
        if (foodItem.confidence >= 75 && foodItem["has_wheat"] === null && hasWheatAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain wheat" });
        }

        if (foodItem.confidence >= 75 && foodItem["is_gluten_free"] === false && hasGlutenAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains gluten" });
        }
        if (foodItem.confidence >= 75 && foodItem["is_gluten_free"] === null && hasGlutenAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain gluten" });
        }

        if (foodItem.confidence >= 75 && foodItem["is_vegan"] === false && isVeganGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item is not vegan" });
        }
        if (foodItem.confidence >= 75 && foodItem["is_vegan"] === null && isVeganGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may not be vegan" });
        }

        if (foodItem.confidence >= 75 && foodItem["is_vegetarian"] === false && isVegetarianGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item is not vegetarian" });
        }
        if (foodItem.confidence >= 75 && foodItem["is_vegetarian"] === null && isVegetarianGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may not be vegetarian" });
        }

        if (foodItem.confidence >= 75 && foodItem["is_halal"] === false && prefersHalalGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item is not halal" });
        }
        if (foodItem.confidence >= 75 && foodItem["is_halal"] === null && prefersHalalGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may not be halal" });
        }       

        return foodItemWarningsArray;
    }

    /*
        Enable the user to select an image on the device that cu-bytes is running on
        The selected image will be analyzed by the machine learning component
    */
    const pickImage = async () => {
        try {
            // Request permissions
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

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
            Alert.alert('Error', 'Failed to pick image');
        }
    };

    /*
        Enable the user to take a photo with the device camera.
    */
    const takePhoto = async () => {
        try {
            const { status } = await ImagePicker.requestCameraPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Sorry, we need camera permissions to take a photo!');
                return;
            }

            const result = await ImagePicker.launchCameraAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [4, 3],
                quality: 1,
            });

            if (!result.canceled && result.assets[0]) {
                setSelectedImage(result.assets[0].uri);
                setPrediction(null);
                setLowConfidenceMessage(null);
            }
        } catch (err) {
            console.error('Error taking photo:', err);
            Alert.alert('Error', 'Failed to take photo');
        }
    };

    /*
        Send the selected image to the machine learning component to be identified and analyzed
    */
    const scanFood = async () => {

        if (!selectedImage) {
            Alert.alert('No Image', 'Please select an image first');
            return;
        }

        setLoading(true);

        try {
            const result = await apiService.predictFood(selectedImage);
            console.log('Prediction result received:', result);

            const lowConf = result as LowConfidenceResponse;
            if (lowConf.success === false && lowConf.reason === 'low_confidence') {
                setLowConfidenceMessage(lowConf.message);
                setPrediction(null);
                Alert.alert('Please retake the photo', lowConf.message, [{ text: 'OK' }]);
                return;
            }

            setLowConfidenceMessage(null);
            setPrediction(result as PredictionResult);
        } catch (err: any) {
            console.error('Prediction error:', err);
            Alert.alert('Error', err.response?.data?.error || 'Failed to predict food. Please try again.');
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
            console.error(err);
        } finally {
            setLoading(false);
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
                    Take a photo or upload a photo of a food item to identify
                </Text>

                {/* Display the uploaded photo of a food item, henceforth known as the selected food item */}
                {selectedImage && (
                    <Image id="foodItemImage" style={styles.foodImage}
                        source={{uri: selectedImage}}
                        resizeMode="contain">    
                    </Image>
                )}

                {/* Display placeholder text if a photo of a food item has not been uploaded */}
                {!selectedImage && (
                    <Text id="foodItemPlaceholderText" style={styles.placeholderText}>
                        Uploaded photos will be displayed here
                    </Text>
                )}

                {/* Display message when confidence was too low (e.g. unclear or non-food image) */}
                {lowConfidenceMessage && (
                    <View id="lowConfidenceBanner" style={styles.lowConfidenceBanner}>
                        <Text style={styles.lowConfidenceTitle}>No food detected</Text>
                        <Text style={styles.lowConfidenceMessage}>
                            We couldn&apos;t detect any food in this photo. Please take a clear photo of the food item.
                        </Text>
                    </View>
                )}

                {/* Display information about the selected food item */}
                {prediction && (
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
                {prediction && (
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

                {/* Display a button that enables the user to take a photo of the food item to identify */}
                <TouchableOpacity id="takePhotoButton" style={[styles.bodyButtonDefault, loading && styles.buttonDisabled]}
                    onPress={takePhoto}
                    disabled={loading}>

                    <Text id="takePhotoButtonText" style={styles.bodyButtonTextDefault}>
                        Take Photo
                    </Text>
                </TouchableOpacity>

                {/* Display a button that enables the user to upload a photo or an image of the food item to identify */}
                <TouchableOpacity id="uploadPhotoButton" style={[styles.bodyButtonDefault, loading && styles.buttonDisabled]}
                    onPress={pickImage}
                    disabled={loading}>

                    <Text id="uploadPhotoButtonText" style={styles.bodyButtonTextDefault}>
                        {selectedImage ?  'Upload Different Photo' : 'Upload Photo'}
                    </Text>
                </TouchableOpacity>

                {/* Display a button that prompts the AI model to scan the photo or image to identify the food item */}
                {selectedImage && (
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
                )}

                {/* Display a button to remove the uploaded photo or image */}
                {selectedImage && (
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
                )}

            </ScrollView>

        </View>
    )

}
