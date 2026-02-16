import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, Modal, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { apiService } from '../services/api';

import { styles } from './styles/style-scan';
import { useUser } from './context';

interface PredictionResult {
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

export default function ScanScreen() {

    const [loading, setLoading] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
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
            showStatsGlobal,
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
        Enable the user to select an image on the device that cu-bytes is running on
        The selected image will be analyzed by the machine learning component
    */
    const pickImage = async () => {
        try {
            // Request permissions
            const {status} = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to select an image!');
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
                // Clear previous prediction
                setPrediction(null);
            }
        } catch (err) {
            console.error('Error picking image:', err);
            Alert.alert('Error', 'Failed to pick image');
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
            setPrediction(result);
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
            const res = await fetch(`http://127.0.0.1:5000/logging/log-by-name`, {
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

        setUsernameGlobal("");
        setShowStatsGlobal(false)
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
            <StatusBar
                style="auto"
                hidden={true}
            />

            <View
                style={styles.statusbar}>

                <TouchableOpacity id="backButton"
                    style={[styles.headerButton,
                        { backgroundColor: isBackPressed ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsBackPressed(true)}
                    onPressOut={() => setIsBackPressed(false)}
                    onPress={() => usernameGlobal != '' ? router.push('/home') : router.push('/')}>

                    <Text id="backButtonText"
                        style={styles.headerButtonText}>

                        Back
                    </Text>

                </TouchableOpacity>

                <View style={styles.headerContainer}></View>

                <Text id="scanFoodItemTitle"
                    style={styles.headerTitle}>

                    Scan Food Item
                </Text>

                <Text id="loggedInUser"
                    style={styles.headerUsernameIcon}>

                    {usernameGlobal != '' ? `${usernameGlobal}` : 'Guest'}
                </Text>

                <TouchableOpacity id="loginLogoutButton"
                    style={[styles.headerButton,
                        { backgroundColor: isLoginLogoutPressed ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsLoginLogoutPressed(true)}
                    onPressOut={() => setIsLoginLogoutPressed(false)}
                    onPress={() => usernameGlobal != '' ? logout() : router.push('/login')}>

                    <Text id="loginLogoutButtonText"
                        style={styles.headerButtonText}>

                        {usernameGlobal != '' ? 'Logout' : 'Login' }
                    </Text>

                </TouchableOpacity>

            </View>

            <Text style={styles.infoText}>

                Upload an image of the food item that you would like CU-Bytes to identify
            </Text>

            {selectedImage && (
                <Image
                    source={{ uri: selectedImage }}
                    style={styles.foodImage}
                    resizeMode="contain"
                />
            )}

            {!selectedImage && (
                <Text style={styles.placeholderText}>Uploaded photos will be displayed here</Text>
            )}

            {prediction && (
                <View style={styles.bodyContainer}>
                    <Text style={styles.foodInfoText}>
                        Food: {prediction.food_name}
                        {'\n'}
                        Calories: {processFoodItemCalories(prediction.calories)}
                        {'\n'}
                        Confidence: {prediction.confidence}%
                        {'\n'}
                        Carbs: {prediction.carbs_g != null ? processFoodItemCarbs(prediction.carbs_g) : "Unknown" } grams
                        {'\n'}
                        Fat: {prediction.fat_g != null ? processFoodItemFat(prediction.fat_g) : "Unknown" } grams
                        {'\n'}
                        Fiber: {prediction.fiber_g != null ? processFoodItemFiber(prediction.fiber_g) : "Unknown" } grams
                        {'\n'}
                        Proteins: {prediction.proteins_g != null ? processFoodItemProteins(prediction.proteins_g) : "Unknown" } grams
                        {'\n'}
                        Sugar: {prediction.sugar_g != null ? processFoodItemSugar(prediction.sugar_g) : "Unknown" } grams
                        {'\n'}

                        {prediction.confidence >= 75 && prediction.has_eggs === true && hasEggAllergyGlobal ? "Warning - this item contains eggs \n" : null}
                        {prediction.confidence >= 75 && prediction.has_eggs === null && hasEggAllergyGlobal ? "Warning - this item may contain eggs \n" : null}

                        {prediction.confidence >= 75 && prediction.has_fish_or_shellfish === true && hasFishOrShellfishAllergyGlobal ? "Warning - this item contains fish or shellfish \n" : null}
                        {prediction.confidence >= 75 && prediction.has_fish_or_shellfish === null && hasFishOrShellfishAllergyGlobal ? "Warning - this item may contain fish or shellfish \n" : null}

                        {prediction.confidence >= 75 && prediction.is_dairy_free === false && hasDairyIntoleranceGlobal ? "Warning - this item contains dairy \n" : null}
                        {prediction.confidence >= 75 && prediction.is_dairy_free === null && hasDairyIntoleranceGlobal ? "Warning - this item may contain dairy \n" : null}

                        {prediction.confidence >= 75 && prediction.has_milk === true && hasMilkAllergyGlobal ? "Warning - this item contains milk \n" : null}
                        {prediction.confidence >= 75 && prediction.has_milk === null && hasMilkAllergyGlobal ? "Warning - this item may contain milk \n" : null}

                        {prediction.confidence >= 75 && prediction.has_peanuts === true && hasPeanutAllergyGlobal ? "Warning - this item contains peanuts \n" : null}
                        {prediction.confidence >= 75 && prediction.has_peanuts === null && hasPeanutAllergyGlobal ? "Warning - this item may contain peanuts \n" : null}

                        {prediction.confidence >= 75 && prediction.has_sesame === true && hasSesameAllergyGlobal ? "Warning - this item contains sesame \n" : null}
                        {prediction.confidence >= 75 && prediction.has_sesame === null && hasSesameAllergyGlobal ? "Warning - this item may contain sesame \n" : null}

                        {prediction.confidence >= 75 && prediction.has_soy === true && hasSoyAllergyGlobal ? "Warning - this item contains soy \n" : null}
                        {prediction.confidence >= 75 && prediction.has_soy === null && hasSoyAllergyGlobal ? "Warning - this item may contain soy \n" : null}

                        {prediction.confidence >= 75 && prediction.has_treenuts === true && hasTreenutAllergyGlobal ? "Warning - this item contains treenuts \n" : null}
                        {prediction.confidence >= 75 && prediction.has_treenuts === null && hasTreenutAllergyGlobal ? "Warning - this item may contain treenuts \n" : null}

                        {prediction.confidence >= 75 && prediction.has_wheat === true && hasWheatAllergyGlobal ? "Warning - this item contains wheat \n" : null}
                        {prediction.confidence >= 75 && prediction.has_wheat === null && hasWheatAllergyGlobal ? "Warning - this item may contain wheat \n" : null}

                        {prediction.confidence >= 75 && prediction.is_gluten_free === false && hasGlutenAllergyGlobal ? "Warning - this item contains gluten \n" : null}
                        {prediction.confidence >= 75 && prediction.is_gluten_free === null && hasGlutenAllergyGlobal ? "Warning - this item may contain gluten \n" : null}

                        {prediction.confidence >= 75 && prediction.is_vegan === false && isVeganGlobal ?  "Warning - this item is not vegan \n" : null}
                        {prediction.confidence >= 75 && prediction.is_vegan === null && isVeganGlobal ?  "Warning - this item may not be vegan \n" : null}

                        {prediction.confidence >= 75 && prediction.is_vegetarian === false && isVegetarianGlobal ?  "Warning - this item is not vegetarian \n" : null}
                        {prediction.confidence >= 75 && prediction.is_vegetarian === null && isVegetarianGlobal ?  "Warning - this item may not be vegetarian \n" : null}

                        {prediction.confidence >= 75 && prediction.is_halal === false && prefersHalalGlobal ? "Warning - this item is not halal \n" : null}
                        {prediction.confidence >= 75 && prediction.is_halal === null && prefersHalalGlobal ? "Warning - this item may not be halal \n" : null}
                    </Text>
                </View>
            )}

            {prediction && usernameGlobal != "" && (
                <View style={styles.bodyContainer}>
                    <TouchableOpacity
                        style={[styles.bodyButtonAlt]}
                        onPress={() => {
                            logFoodItemByName(prediction.food_name);

                            setModalVisible(true);
                            setTimeout(() => {
                            setModalVisible(false);
                            }, 2000);

                            router.push('/home');
                        }}
                        disabled={loading}
                    >
                        <Text style={styles.bodyButtonTextAlt}>Save Food Item</Text>
                    </TouchableOpacity>
                </View>
            )}

            {modalVisible && usernameGlobal != "" && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                >
                    <View>
                        <View style={styles.bodyContainer}>
                            <Text style={styles.infoText}>Food Item Saved!</Text>
                        </View>
                    </View>
                </Modal>
            )}

            <TouchableOpacity id="uploadPhotoButton"
                style={[styles.bodyButtonDefault,
                    loading && styles.buttonDisabled
                ]}
                onPress={pickImage}
                disabled={loading}
            >
                <Text id="uploadPhotoButtonText"
                    style={styles.bodyButtonTextDefault}>

                    {selectedImage ?  'Upload Different Photo' : 'Upload Photo' }
                </Text>
            </TouchableOpacity>

            {selectedImage && (
                <TouchableOpacity id="scanFoodButton"
                    style={[styles.bodyButtonScanFood,
                        loading && styles.buttonDisabled,
                        !selectedImage && styles.buttonDisabled
                    ]}
                    onPress={scanFood}
                    disabled={loading || !selectedImage}
                >
                    {loading ? (<ActivityIndicator color="white"/>) :

                        (<Text id="scanFoodButtonText"
                            style={styles.bodyButtonTextDefault}>

                            Scan Food
                        </Text>)
                    }
                </TouchableOpacity>
            )}

            {selectedImage && (
                <TouchableOpacity id="deleteFoodButton"
                    style={[styles.bodyButtonDeleteFood,
                        loading && styles.buttonDisabled,
                        !selectedImage && styles.buttonDisabled
                    ]}
                    onPress={() => {
                        setSelectedImage(null);
                        setPrediction(null);
                    }}
                    disabled={loading || !selectedImage}
                >
                    {loading ? (<ActivityIndicator color="white"/>) :

                        (<Text id="deleteFoodButtonText"
                            style={styles.bodyButtonTextAlt}>

                            Delete Food
                        </Text>)
                    }
                </TouchableOpacity>
            )}

        </View>
    )
}
