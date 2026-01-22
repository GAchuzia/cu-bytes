import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-settings';
import { useUser } from './context';

export default function SettingsScreen() {

    // Get the variables or setters used to access or modify a copy of the user profile elements
    const
        {
            usernameGlobal,
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

    const [loading, setLoading] = useState(true);

    // Variables and setters for each of the configurable settings
    // The variable values will be sent to a backend endpoint to attempt to edit the user profile

    const [showStatsEnabled, setShowStatsEnabled] = useState(false);
    const [hasEggAllergy, setHasEggAllergy] = useState(false);
    const [hasFishOrShellfishAllergy, setHasFishOrShellfishAllergy] = useState(false);
    const [hasDairyIntolerance, setHasDairyIntolerance] = useState(false);
    const [hasMilkAllergy, setHasMilkAllergy] = useState(false);
    const [hasPeanutAllergy, setHasPeanutAllergy] = useState(false);
    const [hasSeasameAllergy, setHasSesameAllergy] = useState(false);
    const [hasSoyAllergy, setHasSoyAllergy] = useState(false);
    const [hasTreenutAllergy, setHasTreenutAllergy] = useState(false);
    const [hasWheatAllergy, setHasWheatAllergy] = useState(false);
    const [hasGlutenAllergy, setHasGlutenAllergy] = useState(false);
    const [isVegan, setIsVegan] = useState(false);
    const [isVegetarian, setIsVegetarian] = useState(false);
    const [prefersHalal, setPrefersHalal] = useState(false);

    ////////////////////////////////////////////////// Get Initial Profile //////////////////////////////////////////////////

    // Get the user profile from the backend (will run on page load)
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:5000/profile/retreive/${usernameGlobal}`);
                const data = await res.json();

                // Trigger updates for the switches
                setShowStatsEnabled(data.show_stats);
                setHasEggAllergy(data.has_egg_allergy);
                setHasFishOrShellfishAllergy(data.has_fish_or_shellfish_allergy);
                setHasDairyIntolerance(data.has_dairy_intolerance);
                setHasMilkAllergy(data.has_milk_allergy);
                setHasPeanutAllergy(data.has_peanut_allergy);
                setHasSesameAllergy(data.has_sesame_allergy);
                setHasSoyAllergy(data.has_soy_allergy);
                setHasTreenutAllergy(data.has_treenut_allergy);
                setHasWheatAllergy(data.has_wheat_allergy);
                setHasGlutenAllergy(data.has_gluten_allergy);
                setIsVegan(data.is_vegan);
                setIsVegetarian(data.is_vegetarian);
                setPrefersHalal(data.prefers_halal);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadSettings();
        }, []);

    ////////////////////////////////////////////////// Send Profile Update //////////////////////////////////////////////////

    // Send the user profile update to the backend endpoint
    const handlePressConfirmSettings = () => {
        fetch("http://127.0.0.1:5000/profile/edit", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(
                    {
                        username: usernameGlobal,
                        show_stats: showStatsEnabled,
                        has_egg_allergy: hasEggAllergy,
                        has_fish_or_shellfish_allergy: hasFishOrShellfishAllergy,
                        has_dairy_intolerance: hasDairyIntolerance,
                        has_milk_allergy: hasMilkAllergy,
                        has_peanut_allergy: hasPeanutAllergy,
                        has_sesame_allergy: hasSeasameAllergy,
                        has_soy_allergy: hasSoyAllergy,
                        has_treenut_allergy: hasTreenutAllergy,
                        has_wheat_allergy: hasWheatAllergy,
                        has_gluten_allergy: hasGlutenAllergy,
                        is_vegan: isVegan,
                        is_vegetarian: isVegetarian,
                        prefers_halal: prefersHalal,
                    }
                ),
            }
        )
        .then(response => {
            if (!response.ok) {
                throw new Error (`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Set the user profile global elements
            // This ensures that the updated user profile elements can be accessed across different fronted pages
            // (Without requiring sending retrieval requests to the backend endpoint)
            setShowStatsGlobal(showStatsEnabled);
            setHasEggAllergyGlobal(hasEggAllergy);
            setHasFishOrShellfishAllergyGlobal(hasFishOrShellfishAllergy);
            setHasDairyIntoleranceGlobal(hasDairyIntolerance);
            setHasMilkAllergyGlobal(hasMilkAllergy);
            setHasPeanutAllergyGlobal(hasPeanutAllergy);
            setHasSesameAllergyGlobal(hasSeasameAllergy);
            setHasSoyAllergyGlobal(hasSoyAllergy);
            setHasTreenutAllergyGlobal(hasTreenutAllergy);
            setHasWheatAllergyGlobal(hasWheatAllergy);
            setHasGlutenAllergyGlobal(hasGlutenAllergy);
            setIsVeganGlobal(isVegan);
            setIsVegetarianGlobal(isVegetarian);
            setPrefersHalalGlobal(prefersHalal);

            // Route to the home page
            router.push("/home");
        })
        .catch(error => {
            console.log(error);
        });
    }

    // Display loading symbol while the profiles are being fetched
    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    // The page that the user sees in the app/browser
    return (
        <View style={styles.container}>
            <StatusBar style="auto" />

            <Text style={styles.subtitle}>Logged in as {usernameGlobal}</Text>

            <Text style={styles.title}>Settings</Text>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Do you have an allergy or intolerance to <b>dairy</b> products?
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        style={styles.switch}
                        value={hasDairyIntolerance}
                        onValueChange={setHasDairyIntolerance}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Do you have an allergy or intolerance to <b>eggs</b>?
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        style={styles.switch}
                        value={hasEggAllergy}
                        onValueChange={setHasEggAllergy}
                    />
                </View>
            </View>

            {/* Added 01/11/2026 */}
            <View style={styles.row}>
                <Text style={styles.label}>
                    Do you have an allergy or intolerance to <b>fish</b> or <b>shellfish</b>?
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        style={styles.switch}
                        value={hasFishOrShellfishAllergy}
                        onValueChange={setHasFishOrShellfishAllergy}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Do you have an allergy or intolerance to <b>gluten</b>?
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        style={styles.switch}
                        value={hasGlutenAllergy}
                        onValueChange={setHasGlutenAllergy}
                    />
                </View>
            </View>

            {/* Added 01/11/2026 */}
            <View style={styles.row}>
                <Text style={styles.label}>
                    Do you have an allergy or intolerance to <b>milk</b>?
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        style={styles.switch}
                        value={hasMilkAllergy}
                        onValueChange={setHasMilkAllergy}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Do you have an allergy or intolerance to <b>peanuts</b>?
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        style={styles.switch}
                        value={hasPeanutAllergy}
                        onValueChange={setHasPeanutAllergy}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Do you have an allergy or intolerance to <b>sesame</b>?
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        style={styles.switch}
                        value={hasSeasameAllergy}
                        onValueChange={setHasSesameAllergy}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Do you have an allergy or intolerance to <b>soy</b>?
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        style={styles.switch}
                        value={hasSoyAllergy}
                        onValueChange={setHasSoyAllergy}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Do you have an allergy or intolerance to <b>treenuts</b>?
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        style={styles.switch}
                        value={hasTreenutAllergy}
                        onValueChange={setHasTreenutAllergy}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Do you have an allergy or intolerance to <b>wheat</b>?
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        style={styles.switch}
                        value={hasWheatAllergy}
                        onValueChange={setHasWheatAllergy}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Are you <b>vegan</b>?
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        style={styles.switch}
                        value={isVegan}
                        onValueChange={setIsVegan}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Are you <b>vegetarian</b>?
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        style={styles.switch}
                        value={isVegetarian}
                        onValueChange={setIsVegetarian}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Do you prefer <b>halal</b> products?
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        style={styles.switch}
                        value={prefersHalal}
                        onValueChange={setPrefersHalal}
                    />
                </View>
            </View>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Do you consent to having your statistics anonymously collected for
                    statistics purposes?
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        style={styles.switch}
                        value={showStatsEnabled}
                        onValueChange={setShowStatsEnabled}
                    />
                </View>
            </View>

            <TouchableOpacity
                style={[styles.button, loading && styles.buttonDisabled]}
                onPress={() => handlePressConfirmSettings()}
                disabled={loading}
            >
                <Text style={styles.buttonText}>
                    Confirm
                </Text>
            </TouchableOpacity>
        </View>
    )
}
