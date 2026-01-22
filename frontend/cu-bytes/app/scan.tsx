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

    // Get the variables or setters used to access or modify a copy of the user profile elements
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
            prefersHalalGlobal

        } = useUser();

    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);

    const [modalVisible, setModalVisible] = useState(false);

    const pickImage = async () => {
        try {
            // Request permissions
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
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
                setPrediction(null); // Clear previous prediction
            }
        } catch (error) {
            console.error('Error picking image:', error);
            Alert.alert('Error', 'Failed to pick image');
        }
    };

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

        } catch (error: any) {
            console.error('Prediction error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to predict food. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    /*
    Sends a log food item by id request to the server
    */
    function handlePressLogFoodItemByName(foodItemName: string) {
        const foodItemEntryRequest = `http://127.0.0.1:5000/logging/log-by-name`;

        fetch(foodItemEntryRequest, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify( { username: usernameGlobal, food_name: foodItemName } )
            }
        )
        .then((response) => response.json())

        .then((data) => {

            setLoading(false);

            console.log(data);
            
            // If the backend endpoint returns an error message, store the error message
            if (data.status === 'error') {
                throw new Error (`HTTP error! status: ${data.status}`);
            }
        })

        .catch((error) => {

        });
    }

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

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.subtitle}>{usernameGlobal != "" ? `Logged in as ${usernameGlobal}` : "Not logged in"}</Text>
            
            <Text style={styles.title}>Scan</Text>
            <Text style={styles.subtitle}>Upload a photo of the food item that you would like to have analyzed</Text>
            <Text style={styles.subtitle}>CU-Bytes will identify the food item and provide important statistics</Text>

            {selectedImage && (
                <Image 
                    source={{ uri: selectedImage }} 
                    style={{ width: 300, height: 300, marginVertical: 20, borderRadius: 10 }}
                    resizeMode="contain"
                />
            )}

            {!selectedImage && (
                <Text style={styles.subtitle}>Your Photo Here</Text>
            )}

            {prediction && (
                <View style={styles.infoSection}>
                    <Text style={styles.subtitle}>
                        Food: {prediction.food_name}
                        {'\n'}
                        Calories: {processFoodItemCalories(prediction.calories)}
                        {'\n'}
                        Confidence: {prediction.confidence}%
                        {'\n'}
                        Carbs: {prediction.carbs_g != null ? prediction.carbs_g : 0.00 } grams
                        {'\n'}
                        Fat: {prediction.fat_g != null ? prediction.fat_g : 0.00 } grams
                        {'\n'}
                        Fiber: {prediction.fiber_g != null ? prediction.fiber_g : 0.00 } grams
                        {'\n'}
                        Proteins: {prediction.proteins_g != null ? prediction.proteins_g : 0.00 } grams
                        {'\n'}
                        Sugar: {prediction.sugar_g != null ? prediction.sugar_g : 0.00 } grams
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
                <View style={styles.infoSection}>
                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={() => {
                            handlePressLogFoodItemByName(prediction.food_name);
                            setModalVisible(true);
                        }}
                        disabled={loading}
                    >
                        <Text style={styles.buttonText}>Add Food Item</Text>
                    </TouchableOpacity>
                </View>
            )}

            {modalVisible && usernameGlobal != "" && (
                <Modal
                    animationType="fade"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={() => {
                        Alert.alert('Modal has been closed.');
                        setModalVisible(false);
                    }}
                >
                    <View>
                        <View>
                            <Text style={styles.subsubtitle}>Food Item Logged!</Text>
                            <TouchableOpacity
                                style={[styles.buttonPopup]}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Continue Browsing</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}  

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={pickImage}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Upload Photo
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={scanFood}
                disabled={loading || !selectedImage}
            >
                {loading ? (
                    <ActivityIndicator color="white" />
                ) : (
                    <Text style={styles.buttonText}>
                        Scan Food
                    </Text>
                )}
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => router.push("/enter")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Enter Food
                </Text>
            </TouchableOpacity>
        </View>
    )
}

