import { useState } from 'react';
import { View, Text, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
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
}

export default function ScanScreen() {
    const [loading, setLoading] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<PredictionResult | null>(null);
    const { user } = useUser();

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
            setPrediction(result);
        } catch (error: any) {
            console.error('Prediction error:', error);
            Alert.alert('Error', error.response?.data?.error || 'Failed to predict food. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <StatusBar style="auto" />
            
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
                    <Text style={styles.subtitle}>Food: {prediction.food_name}</Text>
                    <Text style={styles.subtitle}>Calories: {prediction.calories}</Text>
                    <Text style={styles.subtitle}>Confidence: {prediction.confidence}%</Text>
                </View>
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

