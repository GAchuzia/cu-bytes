import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-scan';

import { useUser } from './context';

export default function ScanScreen() {

    // Get the variables and setters used to access and modify a copy of the user profile elements
    const
        {
            usernameGlobal,
            showStatsGlobal,
            hasEggAllergyGlobal,
            hasDairyIntoleranceGlobal,
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

    const [loading, setLoading] = useState(false);

    // The page that the user sees in the app/browser
    return (

        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.subtitle}>Logged in as {usernameGlobal}</Text>
            
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

