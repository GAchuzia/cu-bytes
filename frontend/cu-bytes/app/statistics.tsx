import { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-statistics';
import { useUser } from './context';

export default function StatisticsScreen() {

    const [loading, setLoading] = useState(false);
    const [selectedStatistic, setSelectedStatistic] = useState(false);
    
    const [isBackPressed, setIsBackPressed] = useState(false);
    const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);
    const [isDailyPressed, setIsDailyPressed] = useState(false);
    const [isAggregatePressed, setIsAggregatePressed] = useState(false);
    const [isGlobalPressed, setIsGlobalPressed] = useState(false);
    const [isComparativePressed, setIsComparativePressed] = useState(false);

    const [numberOfDays, setNumberOfDays] = useState(7);

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
        Variable and setter for storing and modifying the daily statistics of the logged-in user
    */
    const [dailyStatistics, setDailyStatistics] = useState(
        {
            "1900-01-01": {
                "calories": 0,
                "carbs_g": 0,
                "fat_g": 0,
                "fiber_g": 0,
                "items_logged": 0,
                "proteins_g": 0,
                "sugar_g": 0
            }
        }
    );

    /*
        Variable and setter for storing and modifying the aggregate statistics of the logged-in user
    */
    const [aggregateStatistics, setAggregateStatistics] = useState(
        {
            "days_active": 0,
            "items_logged": 0,
            "percent_dairy": 0,
            "percent_fruit_veg": 0,
            "percent_grain": 0,
            "percent_protein": 0,
            "top_dining_location": "Unknown",
            "top_food": "Unknown",
            "total_calories": 0,
            "total_carbs_g": 0,
            "total_fat_g": 0,
            "total_fiber_g": 0,
            "total_protein_g": 0,
            "total_sugar_g": 0
        }
    );

    /*
        Variable and setter for storing and modifying the global statistics
    */
    const [globalStatistics, setGlobalStatistics] = useState(
        {
            "trending_item_1": "Unknown",
            "trending_item_2": "Unknown",
            "trending_item_3": "Unknown",
            "trending_item_4": "Unknown",
            "trending_item_5": "Unknown",
            "trending_location_1": "Unknown",
            "trending_location_2": "Unknown",
            "trending_location_3": "Unknown",
        }
    );

    /*
        Variable and setter for storing and modifying the comparative statistics of the logged-in user
    */
    const [comparativeStatistics, setComparativeStatistics] = useState(
        {
            "balanced_food_groups_percentile": 0,
            "balanced_macronutrients_percentile": 0,
            "carbs_percentile": 0,
            "checkin_percentile": 0,
            "dairy_percentile": 0,
            "fat_percentile": 0,
            "fiber_percentile": 0,
            "food_logging_percentile": 0,
            "fruits_veg_percentile": 0,
            "grain_percentile": 0,
            "protein_fg_percentile": 0,
            "sugar_percentile": 0
        }
    );

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
        Send a request to the backend endpoint to get the logged-in user's daily statistics

        param(s):
            days - number : The number of days to include in the statistics
    */
    const getDailyStats = async (days: number) => {
        try {
            fetch(`http://127.0.0.1:5000/statistics/daily/${usernameGlobal}?days=${days}`)
                .then( response => response.json() )
                .then( data => {
                    setDailyStatistics(data);
                    console.log(dailyStatistics);
                })
                .catch( error => { console.error(error) });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    /*
        Send a request to the backend endpoint to get the logged-in user's aggregate statistics

        param(s):
            days - number : The number of days to include in the statistics
    */
    const getAggregateStats = async (days: number) => {
        try {
            fetch(`http://127.0.0.1:5000/statistics/aggregate/${usernameGlobal}?days=${days}`)
                .then( response => response.json() )
                .then( data => {
                    setAggregateStatistics(data);
                    console.log(aggregateStatistics);
                })
                .catch( error => { console.error(error) });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    /*
        Send a request to the backend endpoint to get the global statistics

        param(s):
            days - number : The number of days to include in the statistics
    */
    const getGlobalStats = async (days: number) => {
        try {
            fetch(`http://127.0.0.1:5000/statistics/global?days=${days}`)
                .then( response => response.json() )
                .then( data => {
                    setGlobalStatistics(data);
                    console.log(globalStatistics);
                })
                .catch( error => { console.error(error) });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    /*
        Send a request to the backend endpoint to get the comparative statistics for the logged-in user

        param(s):
            days - number : The number of days to include in the statistics
    */
    const getComparativeStats = async (days: number) => {
        try {
            fetch(`http://127.0.0.1:5000/statistics/comparative/${usernameGlobal}?days=${days}`)
                .then( response => response.json() )
                .then( data => {
                    setComparativeStatistics(data);
                    console.log(comparativeStatistics);
                })
                .catch( error => { console.error(error) });
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
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

                    <Text id="statisticsTitle"
                        style={styles.headerTitle}>
                        
                        Statistics
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

                What statistics would you like to view?
            </Text>

            {/* Daily Statistics */}
            {!selectedStatistic && (
                <TouchableOpacity id="dailyStatsButton"
                    style={[styles.bodyButtonDefault,
                        { backgroundColor: isDailyPressed || usernameGlobal == '' ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsDailyPressed(true)}
                    onPressOut={() => setIsDailyPressed(false)}
                    onPress={() =>
                        setSelectedStatistic(true)
                        //getDailyStats()
                    }
                    disabled={ usernameGlobal == '' ? true : false }
                >

                    <Text id="dailyStatsButtonText"
                        style={styles.bodyButtonTextDefault}>

                        Daily Statistics
                    </Text>

                </TouchableOpacity>                
            )}

            {/* Aggregate Statistics */}
            {!selectedStatistic && (
                <TouchableOpacity id="aggregateStatsButton"
                    style={[styles.bodyButtonDefault,
                        { backgroundColor: isAggregatePressed || usernameGlobal == '' ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsAggregatePressed(true)}
                    onPressOut={() => setIsAggregatePressed(false)}
                    onPress={() => 
                        setSelectedStatistic(true)    
                        //getAggregateStats()
                    }
                >

                    <Text id="aggregateStatsButtonText"
                        style={styles.bodyButtonTextDefault}>

                        Aggregate Statistics
                    </Text>

                </TouchableOpacity>                
            )}

            {/* Global Statistics */}
            {!selectedStatistic && (
                <TouchableOpacity id="globalStatsButton"
                    style={[styles.bodyButtonDefault,
                        { backgroundColor: isGlobalPressed || usernameGlobal == '' ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsGlobalPressed(true)}
                    onPressOut={() => setIsGlobalPressed(false)}
                    onPress={() => 
                        setSelectedStatistic(true)
                        //getGlobalStats()
                    }
                >

                    <Text id="globalStatsButtonText"
                        style={styles.bodyButtonTextDefault}>

                        Global Statistics
                    </Text>

                </TouchableOpacity>                
            )}

            {/* Comparative Statistics */}
            {!selectedStatistic && (
                <TouchableOpacity id="comparativeStatsButton"
                    style={[styles.bodyButtonDefault,
                        { backgroundColor: isComparativePressed || usernameGlobal == '' ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsComparativePressed(true)}
                    onPressOut={() => setIsComparativePressed(false)}
                    onPress={() =>
                        setSelectedStatistic(true)
                        //getComparativeStats()
                    }
                >

                    <Text id="comparativeStatsButtonText"
                        style={styles.bodyButtonTextDefault}>

                        Comparative Statistics
                    </Text>

                </TouchableOpacity>                
            )}

            {/* Enter the number of days to include when retrieving the statistics */}
            {selectedStatistic && (
                <View>
                    
                    <TouchableOpacity id="increaseNumberOfDaysButton"
                        onPress={() => setNumberOfDays(numberOfDays + 1)}
                    >
                        <Text id="increaseNumberOfDaysButtonText"
                        >
                            +
                        </Text>

                    </TouchableOpacity>

                    <Text>
                        {numberOfDays}
                    </Text>

                    <TouchableOpacity id="decreaseNumberOfDaysButton"
                        onPress={() => {numberOfDays > 0 ? setNumberOfDays(numberOfDays - 1) : null }}
                    >    
                        <Text id="decreaseNumberOfDaysButtonText"
                        >
                            -
                        </Text>
                    </TouchableOpacity>

                </View>
            )}


        </View>

    )

}