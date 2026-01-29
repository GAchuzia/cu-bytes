import { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Switch, ActivityIndicator } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-settings';
import { useUser } from './context';

export default function SettingsScreen() {

    const [loading, setLoading] = useState(true);

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
        Send a request to the backend endpoint to get the logged-in user's username and profile settings
    */
    useEffect(() => {
        const loadSettings = async () => {
            try {
                const res = await fetch(`http://127.0.0.1:5000/profile/retreive/${usernameGlobal}`);
                const data = await res.json();

                // Update the copy of the logged-in user's username and profile settings using the retrieved data
                setHasEggAllergyGlobal(data.has_egg_allergy);
                setHasFishOrShellfishAllergyGlobal(data.has_fish_or_shellfish_allergy);
                setHasDairyIntoleranceGlobal(data.has_dairy_intolerance);
                setHasMilkAllergyGlobal(data.has_milk_allergy);
                setHasPeanutAllergyGlobal(data.has_peanut_allergy);
                setHasSesameAllergyGlobal(data.has_sesame_allergy);
                setHasSoyAllergyGlobal(data.has_soy_allergy);
                setHasTreenutAllergyGlobal(data.has_treenut_allergy);
                setHasWheatAllergyGlobal(data.has_wheat_allergy);
                setHasGlutenAllergyGlobal(data.has_gluten_allergy);
                setIsVeganGlobal(data.is_vegan);
                setIsVegetarianGlobal(data.is_vegetarian);
                setPrefersHalalGlobal(data.prefers_halal);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        loadSettings();

    }, []);

    /*
        Send a request to the backend endpoint to update the logged-in user's profile settings
    */
    const handlePressConfirmSettings = async () => {
        try {
            const res = await fetch(`http://127.0.0.1:5000/profile/edit`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(
                        {
                            username: usernameGlobal,
                            has_egg_allergy: hasEggAllergyGlobal,
                            has_fish_or_shellfish_allergy: hasFishOrShellfishAllergyGlobal,
                            has_dairy_intolerance: hasDairyIntoleranceGlobal,
                            has_milk_allergy: hasMilkAllergyGlobal,
                            has_peanut_allergy: hasPeanutAllergyGlobal,
                            has_sesame_allergy: hasSesameAllergyGlobal,
                            has_soy_allergy: hasSoyAllergyGlobal,
                            has_treenut_allergy: hasTreenutAllergyGlobal,
                            has_wheat_allergy: hasWheatAllergyGlobal,
                            has_gluten_allergy: hasGlutenAllergyGlobal,
                            is_vegan: isVeganGlobal,
                            is_vegetarian: isVegetarianGlobal,
                            prefers_halal: prefersHalalGlobal
                        }
                    ) 
                }
            );
            const data = await res.json();

            setHasEggAllergyGlobal(data.has_egg_allergy),
            setHasFishOrShellfishAllergyGlobal(data.has_fish_or_shellfish_allergy);
            setHasDairyIntoleranceGlobal(data.has_dairy_intolerance);
            setHasMilkAllergyGlobal(data.has_milk_allergy);
            setHasPeanutAllergyGlobal(data.has_peanut_allergy);
            setHasSesameAllergyGlobal(data.has_sesame_allergy);
            setHasSoyAllergyGlobal(data.has_soy_allergy);
            setHasTreenutAllergyGlobal(data.has_treenut_allergy);
            setHasWheatAllergyGlobal(data.has_wheat_allergy);
            setHasGlutenAllergyGlobal(data.has_gluten_allergy);
            setIsVeganGlobal(data.is_vegan);
            setIsVegetarianGlobal(data.is_vegetarian);
            setPrefersHalalGlobal(data.prefers_halal);

            router.push("/home");

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    
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

            <Text style={styles.subtitle}>{usernameGlobal != "" ? `Logged in as ${usernameGlobal}` : "Not logged in"}</Text>

            <Text style={styles.title}>Settings</Text>

            <View style={styles.row}>
                <Text style={styles.label}>
                    Do you have an allergy or intolerance to <b>dairy</b> products?
                </Text>
                <View style={styles.switchContainer}>
                    <Switch
                        style={styles.switch}
                        value={hasDairyIntoleranceGlobal}
                        onValueChange={setHasDairyIntoleranceGlobal}
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
                        value={hasEggAllergyGlobal}
                        onValueChange={setHasEggAllergyGlobal}
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
                        value={hasFishOrShellfishAllergyGlobal}
                        onValueChange={setHasFishOrShellfishAllergyGlobal}
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
                        value={hasGlutenAllergyGlobal}
                        onValueChange={setHasGlutenAllergyGlobal}
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
                        value={hasMilkAllergyGlobal}
                        onValueChange={setHasMilkAllergyGlobal}
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
                        value={hasPeanutAllergyGlobal}
                        onValueChange={setHasPeanutAllergyGlobal}
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
                        value={hasSesameAllergyGlobal}
                        onValueChange={setHasSesameAllergyGlobal}
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
                        value={hasSoyAllergyGlobal}
                        onValueChange={setHasSoyAllergyGlobal}
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
                        value={hasTreenutAllergyGlobal}
                        onValueChange={setHasTreenutAllergyGlobal}
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
                        value={hasWheatAllergyGlobal}
                        onValueChange={setHasWheatAllergyGlobal}
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
                        value={isVeganGlobal}
                        onValueChange={setIsVeganGlobal}
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
                        value={isVegetarianGlobal}
                        onValueChange={setIsVegetarianGlobal}
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
                        value={prefersHalalGlobal}
                        onValueChange={setPrefersHalalGlobal}
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
                        value={showStatsGlobal}
                        onValueChange={setShowStatsGlobal}
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
