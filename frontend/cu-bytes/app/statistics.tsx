import { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { screenChrome as sc } from './_styles/screenChrome';
import { styles } from './_styles/style-statistics';
import { useUser } from './_context';
import { API_BASE_URL } from '../services/api';

export default function StatisticsScreen() {

    const [loading, setLoading] = useState(false);

    /*
        Variable and setter used to track whether one of the statistic mode buttons has been pressed
        Initialized with the value false
        Set to the value true everytime a statistics mode button is pressed
        Set to the value false everytime a statistics fetch button is pressed
    */
    const [statisticModeButtonPressed, setStatisticModeButtonPressed] = useState(false);

    /*
        Variable and setter used to track what statistic mode button has specifically been pressed
        Initialized with the value ""
        Set to the value "Daily", "Aggregate", "Global", or "Comparative" everytime a statistics mode button is pressed
        Set to the value "" everytime a statistics fetch button is pressed
    */
    const [selectedStatisticMode, setSelectedStatisticMode] = useState("");

    /*
        Variable and setter used to track whether any statistics have been fetched from the backend
        Initialized with the value false
        Set to the value true everytime a statistics fetch button is pressed
    */
    const [fetchedStatistics, setFetchedStatistics] = useState(false);
    
    const [isHomeOrSplashPressed, setIsHomeOrSplashPressed] = useState(false);
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
    const {
        usernameGlobal,
        setUsernameGlobal,
        setHasDairyIntoleranceGlobal,            
        setHasEggAllergyGlobal,
        setHasFishOrShellfishAllergyGlobal,
        setHasGlutenAllergyGlobal,
        setHasMilkAllergyGlobal,
        setHasPeanutAllergyGlobal,
        setHasSesameAllergyGlobal,
        setHasSulfitesAllergyGlobal,
        setHasSoyAllergyGlobal,
        setHasTreenutAllergyGlobal,
        setHasWheatAllergyGlobal,
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
                calories: 0,
                carbs_g: 0,
                fat_g: 0,
                fiber_g: 0,
                items_logged: 0,
                proteins_g: 0,
                sugar_g: 0
            },
            "1900-01-02": {
                calories: 0,
                carbs_g: 0,
                fat_g: 0,
                fiber_g: 0,
                items_logged: 0,
                proteins_g: 0,
                sugar_g: 0
            },
            "1900-01-03": {
                calories: 0,
                carbs_g: 0,
                fat_g: 0,
                fiber_g: 0,
                items_logged: 0,
                proteins_g: 0,
                sugar_g: 0
            }
        } as {
            "1900-01-01": {
                calories: number,
                carbs_g: number,
                fat_g: number,
                fiber_g: number,
                items_logged: number,
                proteins_g: number,
                sugar_g: number
            },
            "1900-01-02": {
                calories: number,
                carbs_g: number,
                fat_g: number,
                fiber_g: number,
                items_logged: number,
                proteins_g: number,
                sugar_g: number
            },
            "1900-01-03": {
                calories: number,
                carbs_g: number,
                fat_g: number,
                fiber_g: number,
                items_logged: number,
                proteins_g: number,
                sugar_g: number
            }    
        }
    );

    /*
        Variable and setter for storing and modifying the aggregate statistics of the logged-in user
    */
    const [aggregateStatistics, setAggregateStatistics] = useState(
        {
            days_active: 0,
            items_logged: 0,
            percent_dairy: 0,
            percent_fruit_veg: 0,
            percent_grain: 0,
            percent_protein: 0,
            top_dining_location: "Unknown",
            top_food: "Unknown",
            total_calories: 0,
            total_carbs_g: 0,
            total_fat_g: 0,
            total_fiber_g: 0,
            total_protein_g: 0,
            total_sugar_g: 0
        } as {
            days_active: number,
            items_logged: number,
            percent_dairy: number,
            percent_fruit_veg: number,
            percent_grain: number,
            percent_protein: number,
            top_dining_location: string,
            top_food: string,
            total_calories: number,
            total_carbs_g: number,
            total_fat_g: number,
            total_fiber_g: number,
            total_protein_g: number,
            total_sugar_g: number
        }
    );

    /*
        Variable and setter for storing and modifying the global statistics
    */
    const [globalStatistics, setGlobalStatistics] = useState(
        {
            trending_item_1: "Unknown",
            trending_item_2: "Unknown",
            trending_item_3: "Unknown",
            trending_item_4: "Unknown",
            trending_item_5: "Unknown",
            trending_location_1: "Unknown",
            trending_location_2: "Unknown",
            trending_location_3: "Unknown"
        } as {
            trending_item_1: string,
            trending_item_2: string,
            trending_item_3: string,
            trending_item_4: string,
            trending_item_5: string,
            trending_location_1: string,
            trending_location_2: string,
            trending_location_3: string
        }
    );

    /*
        Variable and setter for storing and modifying the comparative statistics of the logged-in user
    */
    const [comparativeStatistics, setComparativeStatistics] = useState(
        {
            balanced_food_groups_percentile: 0,
            balanced_macronutrients_percentile: 0,
            carbs_percentile: 0,
            checkin_percentile: 0,
            dairy_percentile: 0,
            fat_percentile: 0,
            fiber_percentile: 0,
            food_logging_percentile: 0,
            fruits_veg_percentile: 0,
            grain_percentile: 0,
            protein_fg_percentile: 0,
            sugar_percentile: 0
        } as {
            balanced_food_groups_percentile: number,
            balanced_macronutrients_percentile: number,
            carbs_percentile: number,
            checkin_percentile: number,
            dairy_percentile: number,
            fat_percentile: number,
            fiber_percentile: number,
            food_logging_percentile: number,
            fruits_veg_percentile: number,
            grain_percentile: number,
            protein_fg_percentile: number,
            sugar_percentile: number          
        }
    );

    /*
        Convert the fetched daily statistics from a JSON object to an array of JSON objects

        param(s):
            stats - any : The fetched daily statistics, a JSON object

        returns : The fetched daily statistics, an array of JSON objects
    */
    const processDailyStatistics = (stats: any) => {

        return [
            { field_name: "Items Logged", field_value: stats["items_logged"] },
            { field_name: "Calories", field_value: stats["calories"] },
            { field_name: "Carbs", field_value: stats["carbs_g"] + " grams" },
            { field_name: "Fat", field_value: stats["fat_g"] + " grams" },
            { field_name: "Fiber", field_value: stats["fiber_g"] + " grams" },
            { field_name: "Proteins", field_value: stats["proteins_g"] + " grams" },
            { field_name: "Sugar", field_value: stats["sugar_g"] + " grams" },
        ]
    }

    /*
        Convert the fetched aggregate statistics from a JSON object to an array of JSON objects

        param(s):
            stats - any : The fetched aggregate statistics, a JSON object

        returns : The fetched aggregate statistics, an array of JSON objects
    */
    const processAggregateStatistics = (stats: any) => {

        return [
            { field_name: "Days Active", field_value: stats["days_active"] },
            { field_name: "Items Logged", field_value: stats["items_logged"] },
            { field_name: "Top Food Item", field_value: stats["top_food"] },
            { field_name: "Top Dining Location", field_value: stats["top_dining_location"] },                     
            { field_name: "Percent Dairy", field_value: stats["percent_dairy"] + " %" },
            { field_name: "Percent Fruits / Vegs", field_value: stats["percent_fruit_veg"] + " %" },
            { field_name: "Percent Grain", field_value: stats["percent_grain"] + " %" },
            { field_name: "Percent Protein", field_value: stats["percent_protein"] + " %" },
            { field_name: "Total Calories", field_value: stats["total_calories"] + " grams" },
            { field_name: "Total Carbs", field_value: stats["total_carbs_g"] + " grams" },
            { field_name: "Total Fat", field_value: stats["total_fat_g"] + " grams" },
            { field_name: "Total Fiber", field_value: stats["total_fiber_g"] + " grams" },
            { field_name: "Total Protein", field_value: stats["total_protein_g"] + " grams" },
            { field_name: "Total Sugar", field_value: stats["total_sugar_g"] + " grams" }
        ]
    }

    /*
        Convert the fetched global statistics from a JSON object to an array of JSON objects

        param(s):
            stats - any : The fetched global statistics, a JSON object

        returns : The fetched global statistics, an array of JSON objects
    */
    const processGlobalStatistics = (stats: any) => {

        return [
            { field_name: "Trending Food Item 1", field_value: stats["trending_item_1"] },
            { field_name: "Trending Food Item 2", field_value: stats["trending_item_2"] },
            { field_name: "Trending Food Item 3", field_value: stats["trending_item_3"] },
            { field_name: "Trending Food Item 4", field_value: stats["trending_item_4"] },
            { field_name: "Trending Food Item 5", field_value: stats["trending_item_5"] },
            { field_name: "Trending Dining Location 1", field_value: stats["trending_location_1"] },
            { field_name: "Trending Dining Location 2", field_value: stats["trending_location_2"] },
            { field_name: "Trending Dining Location 3", field_value: stats["trending_location_3"] }
        ]
    }

    /*
        Convert the fetched comparative statistics from a JSON object to an array of JSON objects

        param(s):
            stats - any : The fetched comparative statistics, a JSON object

        returns : The fetched comparative statistics, an array of JSON objects
    */
    const processComparativeStatistics = (stats: any) => {

        return [
            { field_name: "Balanced Food Groups Percentile", field_value: stats["balanced_food_groups_percentile"] },
            { field_name: "Balanced Macronutrients Percentile", field_value: stats["balanced_macronutrients_percentile"] },
            { field_name: "Number of Days Active", field_value: stats["checkin_percentile"] + ' day(s)' },            
            { field_name: "Number of Items Logged", field_value: stats["food_logging_percentile"] + ' item(s)' },
            { field_name: "Carbs Percentile", field_value: stats["carbs_percentile"] },
            { field_name: "Fat Percentile", field_value: stats["fat_percentile"] },
            { field_name: "Fiber Percentile", field_value: stats["fiber_percentile"] },
            { field_name: "Protein Percentile", field_value: stats["protein_fg_percentile"] },
            { field_name: "Sugar Percentile", field_value: stats["sugar_percentile"] },
            { field_name: "Dairy Percentile", field_value: stats["dairy_percentile"] },
            { field_name: "Fruits / Vegs Percentile", field_value: stats["fruits_veg_percentile"] },
            { field_name: "Grain Percentile", field_value: stats["grain_percentile"] },
        ]
    }

    /*
        Log out the logged-in user by setting their profile settings to false, and routing to the splash page
    */
    const logout = () => { 
        
        setUsernameGlobal('');
        setHasDairyIntoleranceGlobal(false);        
        setHasEggAllergyGlobal(false);
        setHasFishOrShellfishAllergyGlobal(false);
        setHasGlutenAllergyGlobal(false);
        setHasMilkAllergyGlobal(false);
        setHasPeanutAllergyGlobal(false);
        setHasSesameAllergyGlobal(false);
        setHasSoyAllergyGlobal(false);
        setHasSulfitesAllergyGlobal(false);
        setHasTreenutAllergyGlobal(false);
        setHasWheatAllergyGlobal(false);
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
            fetch(`${API_BASE_URL}/statistics/daily/${usernameGlobal}?days=${days}`)
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
            fetch(`${API_BASE_URL}/statistics/aggregate/${usernameGlobal}?days=${days}`)
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
            fetch(`${API_BASE_URL}/statistics/global?days=${days}`)
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
            fetch(`${API_BASE_URL}/statistics/comparative/${usernameGlobal}?days=${days}`)
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
            <SafeAreaView style={[sc.safeRoot, { justifyContent: 'center', alignItems: 'center' }]} edges={['top', 'left', 'right']}>
                <ActivityIndicator size="large" color="#C5151A" />
            </SafeAreaView>
        );
    }

    const aggregateRows =
        selectedStatisticMode === 'Aggregate' && fetchedStatistics
            ? processAggregateStatistics(aggregateStatistics)
            : [];
    const globalRows =
        selectedStatisticMode === 'Global' && fetchedStatistics
            ? processGlobalStatistics(globalStatistics)
            : [];
    const comparativeRows =
        selectedStatisticMode === 'Comparative' && fetchedStatistics
            ? processComparativeStatistics(comparativeStatistics)
            : [];

    return (
        <SafeAreaView style={sc.safeRoot} edges={['top', 'left', 'right']}>
        <View style={sc.container}>
            <StatusBar style="dark" />

            <View id="viewStatisticsStatusbar" style={sc.topBar}>
                <TouchableOpacity id="homeOrSplashButton"
                    style={[sc.headerButton, isHomeOrSplashPressed && sc.headerButtonPressed]}
                    onPressIn={() => setIsHomeOrSplashPressed(true)}
                    onPressOut={() => setIsHomeOrSplashPressed(false)}
                    onPress={() => usernameGlobal != '' ? router.push('/home') : router.push('/')}
                    activeOpacity={0.9}>

                    <Text id="homeOrSplashButtonText" style={sc.headerButtonText} numberOfLines={1}>
                        Home
                    </Text>
                </TouchableOpacity>

                <Text id="loggedInUser" style={sc.userPill} numberOfLines={1}>
                    {usernameGlobal != '' ? `${usernameGlobal}` : 'Guest'}
                </Text>

                <TouchableOpacity id="loginLogoutButton"
                    style={[sc.headerButton, isLoginLogoutPressed && sc.headerButtonPressed]}
                    onPressIn={() => setIsLoginLogoutPressed(true)}
                    onPressOut={() => setIsLoginLogoutPressed(false)}
                    onPress={() => usernameGlobal != '' ? logout() : router.push('/login')}
                    activeOpacity={0.9}>

                    <Text id="loginLogoutButtonText" style={sc.headerButtonText} numberOfLines={1}>
                        {usernameGlobal != '' ? 'Log Out' : 'Log In' }
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView id="viewStatisticsScrollView" style={sc.scrollView}
                contentContainerStyle={sc.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">

                <Text id="statisticsTitle" style={sc.pageTitle}>
                    Statistics
                </Text>

                {/* Display the following message when no statistics buttons have been pressed and no statistics have been fetched */}
                {!statisticModeButtonPressed && !fetchedStatistics && (
                    <Text id="viewStatisticsInfoTextDefault" style={sc.pageSubtitle}>
                        What statistics would you like to view?
                    </Text>
                )}
                
                {/* Display the following message when a statistics button has been pressed but no statistics have been fetched */}
                {statisticModeButtonPressed && !fetchedStatistics && (
                    <Text id="viewStatisticsInfoTextNumberOfDays" style={sc.pageSubtitle}>
                        Enter the number of days to include in the retrieved statistics
                    </Text>
                )}

                {/* Display the button used to notify the frontend to retrieve daily statistics */}
                {!statisticModeButtonPressed && (
                    <TouchableOpacity id="dailyStatsButton"
                        style={[sc.bodyButton, usernameGlobal === '' && sc.bodyButtonDisabled, isDailyPressed && sc.bodyButtonPressed]}
                        onPressIn={() => setIsDailyPressed(true)}
                        onPressOut={() => setIsDailyPressed(false)}
                        onPress={() => {
                            setStatisticModeButtonPressed(true)
                            setSelectedStatisticMode("Daily")
                        }}
                        disabled={usernameGlobal === '' ? true : false}
                        activeOpacity={0.92}>

                        <Text id="dailyStatsButtonText" style={sc.bodyButtonText}>
                            Daily Statistics
                        </Text>
                    </TouchableOpacity>                
                )}

                {/* Display the button used to notify the frontend to retrieve aggregate statistics */}
                {!statisticModeButtonPressed && (
                    <TouchableOpacity id="aggregateStatsButton"
                        style={[sc.bodyButton, usernameGlobal === '' && sc.bodyButtonDisabled, isAggregatePressed && sc.bodyButtonPressed]}
                        onPressIn={() => setIsAggregatePressed(true)}
                        onPressOut={() => setIsAggregatePressed(false)}
                        onPress={() => {
                            setStatisticModeButtonPressed(true)    
                            setSelectedStatisticMode("Aggregate");
                        }}
                        disabled={usernameGlobal === '' ? true : false}
                        activeOpacity={0.92}>

                        <Text id="aggregateStatsButtonText" style={sc.bodyButtonText}>
                            Aggregate Statistics
                        </Text>
                    </TouchableOpacity>                
                )}

                {/* Display the button used to notify the frontend to retrieve global statistics */}
                {!statisticModeButtonPressed && (
                    <TouchableOpacity id="globalStatsButton"
                        style={[sc.bodyButton, usernameGlobal === '' && sc.bodyButtonDisabled, isGlobalPressed && sc.bodyButtonPressed]}
                        onPressIn={() => setIsGlobalPressed(true)}
                        onPressOut={() => setIsGlobalPressed(false)}
                        onPress={() => {
                            setStatisticModeButtonPressed(true)
                            setSelectedStatisticMode("Global")
                        }}
                        disabled={usernameGlobal === '' ? true : false}
                        activeOpacity={0.92}>

                        <Text id="globalStatsButtonText" style={sc.bodyButtonText}>
                            Global Statistics
                        </Text>
                    </TouchableOpacity>                
                )}

                {/* Display the button used to notify the frontend to retrieve comparative statistics */}
                {!statisticModeButtonPressed && (
                    <TouchableOpacity id="comparativeStatsButton"
                        style={[sc.bodyButton, usernameGlobal === '' && sc.bodyButtonDisabled, isComparativePressed && sc.bodyButtonPressed]}
                        onPressIn={() => setIsComparativePressed(true)}
                        onPressOut={() => setIsComparativePressed(false)}
                        onPress={() => {
                            setStatisticModeButtonPressed(true)
                            setSelectedStatisticMode("Comparative")
                        }}
                        disabled={usernameGlobal === '' ? true : false}
                        activeOpacity={0.92}>

                        <Text id="comparativeStatsButtonText" style={sc.bodyButtonText}>
                            Comparative Statistics
                        </Text>
                    </TouchableOpacity>                
                )}

                {/* Display buttons to increase/decrease the number of days to include when retrieving the statistics */}
                {statisticModeButtonPressed && !fetchedStatistics && (
                    <View id="increaseDecreaseNumberOfDaysOuterView" style={styles.innerStack}>

                        <View id="increaseDecreaseNumberOfDaysInnerView" style={styles.buttonContainer}>

                            <TouchableOpacity id="decreaseNumberOfDaysButton"
                                style={styles.bodyButtonDecreaseNumberOfDays}
                                onPress={() => {numberOfDays > 3 ? setNumberOfDays(numberOfDays-1) : null}}>

                                <Text id="decreaseNumberOfDaysButtonText" style={styles.bodyButtonTextDecreaseNumberOfDays}>
                                    -
                                </Text>
                            </TouchableOpacity>

                            <Text id="numberOfDaysText" style={styles.numberOfDaysText}>
                                {numberOfDays}
                            </Text>                        
                            
                            <TouchableOpacity id="increaseNumberOfDaysButton"
                                style={styles.bodyButtonIncreaseNumberOfDays}
                                onPress={() => setNumberOfDays(numberOfDays+1)}>

                                <Text id="increaseNumberOfDaysButtonText" style={styles.bodyButtonTextIncreaseNumberOfDays}>
                                    +
                                </Text>
                            </TouchableOpacity>

                        </View>
                        
                        <TouchableOpacity id="getStatsButton"
                            style={sc.bodyButton}
                            onPress={() => {
                                { 
                                    selectedStatisticMode === 'Daily' ? getDailyStats(numberOfDays) :
                                    selectedStatisticMode === 'Aggregate' ? getAggregateStats(numberOfDays) :
                                    selectedStatisticMode === 'Global' ? getGlobalStats(numberOfDays) :
                                    selectedStatisticMode === 'Comparative' ? getComparativeStats(numberOfDays) :
                                    null
                                }
                                setFetchedStatistics(true)
                            }}
                            activeOpacity={0.92}>

                            <Text id="getStatsButtonText" style={sc.bodyButtonText}>
                                { 
                                    selectedStatisticMode === 'Daily' ? 'Get Daily Statistics' :
                                    selectedStatisticMode === 'Aggregate' ? 'Get Aggregate Statistics' :
                                    selectedStatisticMode === 'Global' ? 'Get Global Statistics' :
                                    selectedStatisticMode === 'Comparative' ? 'Get Comparative Statistics' :
                                    ''
                                }
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity id="viewOtherStatsButton"
                            style={sc.bodyButtonOutline}
                            onPress={() => {
                                setStatisticModeButtonPressed(false)
                                setSelectedStatisticMode("")
                                setFetchedStatistics(false)
                                setNumberOfDays(7)
                            }}
                            activeOpacity={0.92}>

                            <Text id="viewOtherStatsButtonText" style={sc.bodyButtonOutlineText}>
                                View Other Statistics
                            </Text>
                        </TouchableOpacity>

                    </View>
                )}

                {/* Display the fetched daily statistics */}
                {selectedStatisticMode === 'Daily' && fetchedStatistics && (
                    <View id="dailyStatisticsOuterView2" style={{ alignSelf: 'stretch' }}>

                        <Text id="dailyStatisticsInfoText" style={sc.pageSubtitle}>
                            Day-by-day breakdown for {usernameGlobal} (last {numberOfDays} days).
                        </Text>

                        <View id="dailyStatisticsOuterView1" style={styles.innerStack}>
                            {Object.entries(dailyStatistics).map(([date, stats]) => {

                                const rows = processDailyStatistics(stats);
                                return (
                                <View id="dailyStatisticsInnerView1" style={[sc.card, { marginBottom: 14, padding: 0, overflow: 'hidden' }]} key={date} >

                                    <Text id="dailyStatisticsDateInfoText" style={[sc.pageSubtitle, { marginBottom: 0, paddingHorizontal: 14, paddingTop: 12 }]}>
                                        {date}
                                    </Text>

                                    <FlatList
                                        data={rows}
                                        scrollEnabled={false}
                                        renderItem={({ item, index }) => (
                                            <View id="dailyStatisticsInnerView2" style={[sc.row, index === rows.length - 1 && sc.rowLast]}>
                                                <Text id="dailyStatisticsFieldNameText" style={sc.rowCellLabel}>{item["field_name"]}</Text>
                                                <Text id="dailyStatisticsFieldValueText" style={sc.rowCellValue}>{item["field_value"]}</Text>
                                            </View>
                                        )}>
                                    </FlatList>

                                </View>
                                );
                            })}
                        </View>

                    </View>
                )}

                {/* Display the fetched aggregated statistics */}
                {selectedStatisticMode === 'Aggregate' && fetchedStatistics && (
                    <View id="aggregateStatisticsOuterView" style={[sc.card, { alignSelf: 'stretch', marginBottom: 14, padding: 0, overflow: 'hidden' }]}>

                        <Text id="aggregateStatisticsInfoText" style={[sc.pageSubtitle, { paddingHorizontal: 14, paddingTop: 12 }]}>
                            Aggregated totals for {usernameGlobal} (last {numberOfDays} days).
                        </Text>

                        <FlatList id="aggregateStatisticsFlatList"
                            data={aggregateRows}
                            scrollEnabled={false}
                            renderItem={({ item, index }) => (
                                <View id="aggregateStatisticsInnerView" style={[sc.row, index === aggregateRows.length - 1 && sc.rowLast]}>
                                    <Text id="aggregateStatisticsFieldNameText" style={sc.rowCellLabel}>{item["field_name"]}</Text>
                                    <Text id="aggregateStatisticsFieldValueText" style={sc.rowCellValue}>{item["field_value"]}</Text>
                                </View>
                            )}>
                        </FlatList>

                    </View>
                )}

                {/* Display the fetched global statistics */}
                {selectedStatisticMode === 'Global' && fetchedStatistics && (
                    <View id="globalStatisticsOuterView" style={[sc.card, { alignSelf: 'stretch', marginBottom: 14, padding: 0, overflow: 'hidden' }]}>

                        <Text id="globalStatisticsInfoText" style={[sc.pageSubtitle, { paddingHorizontal: 14, paddingTop: 12 }]}>
                            Trending foods and dining locations (last {numberOfDays} days).
                        </Text>

                        <FlatList id="globalStatisticsFlatList"
                            data={globalRows}
                            scrollEnabled={false}
                            renderItem={({ item, index }) => (
                                <View id="globalStatisticsInnerView" style={[sc.row, index === globalRows.length - 1 && sc.rowLast]}>
                                    <Text id="globalStatisticsFieldNameText" style={sc.rowCellLabel}>{item["field_name"]}</Text>
                                    <Text id="globalStatisticsFieldValueText" style={sc.rowCellValue}>{item["field_value"]}</Text>
                                </View>
                            )}>
                        </FlatList>

                    </View>
                )}
            
                {/* Display the fetched comparative statistics */}
                {selectedStatisticMode === 'Comparative' && fetchedStatistics && (
                    <View id="comparativeStatisticsOuterView" style={[sc.card, { alignSelf: 'stretch', marginBottom: 14, padding: 0, overflow: 'hidden' }]}>

                        <Text id="comparativeStatisticsInfoText" style={[sc.pageSubtitle, { paddingHorizontal: 14, paddingTop: 12 }]}>

                            Percentiles vs other consenting users (last {numberOfDays} days). Based on proximity to recommended amounts.
                        </Text>

                        <FlatList id="comparativeStatisticsFlatList"
                            data={comparativeRows}
                            scrollEnabled={false}
                            renderItem={({ item, index }) => (
                                <View id="comparativeStatisticsInnerView" style={[sc.row, index === comparativeRows.length - 1 && sc.rowLast]}>
                                    <Text id="comparativeStatisticsFieldNameText" style={sc.rowCellLabel}>{item["field_name"]}</Text>
                                    <Text id="comparativeStatisticsFieldValueText" style={sc.rowCellValue}>{item["field_value"]}</Text>
                                </View>
                            )}>
                        </FlatList>

                    </View>
                )}

                {fetchedStatistics && (
                    <TouchableOpacity id="viewOtherStatsAgainButton"
                        style={sc.bodyButtonOutline}
                        onPress={() => {
                            setStatisticModeButtonPressed(false)
                            setSelectedStatisticMode("")
                            setFetchedStatistics(false)
                            setNumberOfDays(7)
                        }}
                        activeOpacity={0.92}>

                        <Text id="viewOtherStatsAgainButtonText" style={sc.bodyButtonOutlineText}>
                            View Other Statistics
                        </Text>
                    </TouchableOpacity>
                )}

            </ScrollView>

        </View>
        </SafeAreaView>
    )

}