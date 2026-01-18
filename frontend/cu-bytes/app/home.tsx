import { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-home';
import { useUser } from './context';
import { HeaderShownContext } from '@react-navigation/elements';

export default function HomeScreen() {

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

            <Text style={styles.title}>Home</Text>

            {/*Route the user to the scan page*/}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => router.push("/scan")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Scan Food
                </Text>
            </TouchableOpacity>

            {/*Route the user to the weekly progress page*/}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                //onPress={() => router.push("/progress")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Weekly Progress
                </Text>
            </TouchableOpacity>

            {/*Route the user to the dining options page*/}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => router.push("/dining")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Dining Options
                </Text>
            </TouchableOpacity>

            {/*Route the user to the goals page*/}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                //onPress={() => router.push("/goals")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Goals
                </Text>
            </TouchableOpacity>

            {/*Route the user to the settings page*/}
            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => router.push("/settings")}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Settings
                </Text>
            </TouchableOpacity>

        </View>
    )
}
