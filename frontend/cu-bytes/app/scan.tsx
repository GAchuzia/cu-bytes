import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './style-scan'

export default function ScanScreen() {

    const [loading, setLoading] = useState(false);

    // The page that the user sees in the app/browser
    return (

        <View style={styles.container}>
            <StatusBar style="auto" />
            
            <Text style={styles.title}>Scan</Text>
            <Text style={styles.subtitle}>Upload a photo of the food item that you would like to have analyzed</Text>
            <Text style={styles.subtitle}>CU-Bytes will identify the food item and provide important statistics</Text>

            <Text style={styles.subtitle}>Your Photo Here</Text>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                // Add functionality to browse files and upload a photo
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Upload Photo
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                // Add functionality to scan the photo
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Scan Food
                </Text>
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

