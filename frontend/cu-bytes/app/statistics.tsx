import { useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-home';
import { useUser } from './context';

export default function StatisticsScreen() {

    const [loading, setLoading] = useState(false);
    const [isBackPressed, setIsBackPressed] = useState(false);
    const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);

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
        Log out the logged-in user by setting their username and profile settings to null, 
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

    /*
        Display the loading symbol while food items are being retrieved or logged
    */
    if (loading) {
        return (
            <View>
                <ActivityIndicator size="large" />
            </View>
        );
    }
    
    return (

        <View style={styles.container}>

            
        </View>

    )

}