import { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './styles/style-statistics';
import { useUser } from './context';

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

    useEffect(() => {
        const getStatistics = async () => {
            try {
                fetch(`http://127.0.0.1:5000/statistics/daily/${usernameGlobal}?`)
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
        };

        getStatistics();

    }, []);

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

            {/* Display the following message when no statistics buttons have been pressed and no statistics have been fetched */}
            {!statisticModeButtonPressed && !fetchedStatistics && (
                <Text style={styles.infoText}>
                    What statistics would you like to view?
                </Text>
            )}
            
            {/* Display the following message when a statistics button has been pressed but no statistics have been fetched */}
            {statisticModeButtonPressed && !fetchedStatistics && (
                <Text style={styles.infoText}>
                    Enter the number of days to include in the retrieved statistics
                </Text>
            )}

            {/* Display the button used to notify the frontend to retrieve daily statistics */}
            {!statisticModeButtonPressed && (
                <TouchableOpacity id="dailyStatsButton"
                    style={[styles.bodyButtonDefault,
                        { backgroundColor: isDailyPressed || usernameGlobal == '' ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsDailyPressed(true)}
                    onPressOut={() => setIsDailyPressed(false)}
                    onPress={() => {
                        setStatisticModeButtonPressed(true)
                        setSelectedStatisticMode("Daily")
                    }}
                    disabled={ usernameGlobal == '' ? true : false }
                >
                    <Text id="dailyStatsButtonText"
                        style={styles.bodyButtonTextDefault}>

                        Daily Statistics
                    </Text>

                </TouchableOpacity>                
            )}

            {/* Display the button used to notify the frontend to retrieve aggregate statistics */}
            {!statisticModeButtonPressed && (
                <TouchableOpacity id="aggregateStatsButton"
                    style={[styles.bodyButtonDefault,
                        { backgroundColor: isAggregatePressed || usernameGlobal == '' ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsAggregatePressed(true)}
                    onPressOut={() => setIsAggregatePressed(false)}
                    onPress={() => {
                        setStatisticModeButtonPressed(true)    
                        setSelectedStatisticMode("Aggregate");
                    }}
                    disabled={ usernameGlobal == '' ? true : false }
                >
                    <Text id="aggregateStatsButtonText"
                        style={styles.bodyButtonTextDefault}>

                        Aggregate Statistics
                    </Text>

                </TouchableOpacity>                
            )}

            {/* Display the button used to notify the frontend to retrieve global statistics */}
            {!statisticModeButtonPressed && (
                <TouchableOpacity id="globalStatsButton"
                    style={[styles.bodyButtonDefault,
                        { backgroundColor: isGlobalPressed || usernameGlobal == '' ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsGlobalPressed(true)}
                    onPressOut={() => setIsGlobalPressed(false)}
                    onPress={() => {
                        setStatisticModeButtonPressed(true)
                        setSelectedStatisticMode("Global")
                    }}
                    disabled={ usernameGlobal == '' ? true : false }
                >
                    <Text id="globalStatsButtonText"
                        style={styles.bodyButtonTextDefault}>

                        Global Statistics
                    </Text>

                </TouchableOpacity>                
            )}

            {/* Display the button used to notify the frontend to retrieve comparative statistics */}
            {!statisticModeButtonPressed && (
                <TouchableOpacity id="comparativeStatsButton"
                    style={[styles.bodyButtonDefault,
                        { backgroundColor: isComparativePressed || usernameGlobal == '' ? '#666666' : '#131312' }
                    ]}
                    onPressIn={() => setIsComparativePressed(true)}
                    onPressOut={() => setIsComparativePressed(false)}
                    onPress={() => {
                        setStatisticModeButtonPressed(true)
                        setSelectedStatisticMode("Comparative")
                    }}
                    disabled={ usernameGlobal == '' ? true : false }
                >
                    <Text id="comparativeStatsButtonText"
                        style={styles.bodyButtonTextDefault}>

                        Comparative Statistics
                    </Text>

                </TouchableOpacity>                
            )}

            {/* Display buttons to increase/decrease the number of days to include when retrieving the statistics */}
            {statisticModeButtonPressed && !fetchedStatistics && (
                <View style={styles.bodyContainerDefault}>

                    <View style={styles.bodyContainerAlt}>

                        <TouchableOpacity id="decreaseNumberOfDaysButton"
                            style={styles.bodyButtonDecreaseNumberOfDays}
                            onPress={() => {numberOfDays > 3 ? setNumberOfDays(numberOfDays-1) : null}}
                        >    
                            <Text id="decreaseNumberOfDaysButtonText"
                                style={styles.bodyButtonTextDecreaseNumberOfDays}
                            >
                                -
                            </Text>
                        </TouchableOpacity>

                        <Text style={styles.numberOfDaysText}>{numberOfDays}</Text>                        
                        
                        <TouchableOpacity id="increaseNumberOfDaysButton"
                            style={styles.bodyButtonIncreaseNumberOfDays}
                            onPress={() => setNumberOfDays(numberOfDays+1)}
                        >
                            <Text id="increaseNumberOfDaysButtonText"
                                style={styles.bodyButtonTextIncreaseNumberOfDays}
                            >
                                +
                            </Text>
                        </TouchableOpacity>

                    </View>
                    
                    <TouchableOpacity id="getStatsButton"
                        style={[styles.bodyButtonDefault,
                            { backgroundColor: isLoginLogoutPressed ? '#666666' : '#131312' }
                        ]}
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
                    >    
                        <Text id="getStatsButtonText"
                            style={styles.bodyButtonTextDefault} 
                        >
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
                        style={[styles.bodyButtonDefault,
                            { backgroundColor: isLoginLogoutPressed ? '#666666' : '#131312' }
                        ]}
                        onPress={() => {
                            setStatisticModeButtonPressed(false)
                            setSelectedStatisticMode("")
                            setFetchedStatistics(false)
                            setNumberOfDays(7)
                        }}
                    >    
                        <Text id="viewOtherStatsButtonText"
                            style={styles.bodyButtonTextDefault} 
                        >
                            View Other Statistics
                        </Text>

                    </TouchableOpacity>

                </View>
            )}

            {/* Display the fetched daily statistics */}
            {selectedStatisticMode === 'Daily' && fetchedStatistics &&
                <View style={styles.bodyContainerDefault}>

                    <Text style={styles.infoText}>
                        Daily statistics for {usernameGlobal} over the last {numberOfDays} days
                    </Text>

                    <View style={styles.bodyContainerAlt}>

                    </View>

                    <TouchableOpacity id="viewOtherStatsAgainButton"
                        style={[styles.bodyButtonDefault,
                            { backgroundColor: isLoginLogoutPressed ? '#666666' : '#131312' }
                        ]}
                        onPress={() => {
                            setStatisticModeButtonPressed(false)
                            setSelectedStatisticMode("")
                            setFetchedStatistics(false)
                            setNumberOfDays(7)
                        }}
                    >
                        <Text id="viewOtherStatsAgainButtonText" 
                            style={styles.bodyButtonTextDefault}>

                            View Other Statistics
                        </Text>

                    </TouchableOpacity>

                </View>
            }

            {/* Display the fetched aggregated statistics */}
            {selectedStatisticMode === 'Aggregate' && fetchedStatistics && (
                <View style={styles.bodyContainerDefault}>

                    <Text style={styles.infoText}>
                        Aggregate statistics for {usernameGlobal} over the last {numberOfDays} days
                    </Text>

                    <View style={styles.bodyContainerAlt}>

                        <Text style={styles.statisticsInfoText}>
                            Days Active:
                            {'\n'}
                            Items Logged:
                            {'\n'}
                            Percent Dairy:
                            {'\n'}
                            Percent Fruits / Vegs:
                            {'\n'}
                            Percent Grain:
                            {'\n'}
                            Percent Protein:
                            {'\n'}
                            Top Dining Location:
                            {'\n'}
                            Top Food Item:
                            {'\n'}                    
                            Total Calories:
                            {'\n'}
                            Total Carbs:
                            {'\n'}
                            Total Fat:
                            {'\n'}
                            Total Fiber:
                            {'\n'}
                            Total Protein:
                            {'\n'}
                            Total Sugar:
                            {'\n'}
                        </Text>

                        <Text style={styles.statisticsInfoText}>
                            {aggregateStatistics.days_active}
                            {'\n'}
                            {aggregateStatistics.items_logged}
                            {'\n'}
                            {aggregateStatistics.percent_dairy} %
                            {'\n'}
                            {aggregateStatistics.percent_fruit_veg} %
                            {'\n'}
                            {aggregateStatistics.percent_grain} %
                            {'\n'}
                            {aggregateStatistics.percent_protein} %
                            {'\n'}
                            {aggregateStatistics.top_dining_location}
                            {'\n'}
                            {aggregateStatistics.top_food}
                            {'\n'}                    
                            {aggregateStatistics.total_calories}
                            {'\n'}
                            {aggregateStatistics.total_carbs_g} grams
                            {'\n'}
                            {aggregateStatistics.total_fat_g} grams
                            {'\n'}
                            {aggregateStatistics.total_fiber_g} grams
                            {'\n'}
                            {aggregateStatistics.total_protein_g} grams
                            {'\n'}
                            {aggregateStatistics.total_sugar_g} grams
                            {'\n'}
                        </Text>

                    </View>

                    <TouchableOpacity id="viewOtherStatsAgainButton"
                        style={[styles.bodyButtonDefault,
                            { backgroundColor: isLoginLogoutPressed ? '#666666' : '#131312' }
                        ]}
                        onPress={() => {
                            setStatisticModeButtonPressed(false)
                            setSelectedStatisticMode("")
                            setFetchedStatistics(false)
                            setNumberOfDays(7)
                        }}
                    >
                        <Text id="viewOtherStatsAgainButtonText" 
                            style={styles.bodyButtonTextDefault}>

                            View Other Statistics
                        </Text>

                    </TouchableOpacity>

                </View>
            )}

            {/* Display the fetched global statistics */}
            {selectedStatisticMode === 'Global' && fetchedStatistics && (
                <View style={styles.bodyContainerDefault}>

                    <Text style={styles.infoText}>
                        Global statistics for all users who agreed to share their data over the last {numberOfDays} days
                    </Text>

                    <View style={styles.bodyContainerAlt}>

                        <Text style={styles.statisticsInfoText}>
                            Trending Food Item:
                            {'\n'}
                            Trending Food Item:
                            {'\n'}
                            Trending Food Item:
                            {'\n'}
                            Trending Food Item:
                            {'\n'}
                            Trending Food Item:
                            {'\n'}
                            Trending Dining Location:
                            {'\n'}
                            Trending Dining Location:
                            {'\n'}
                            Trending Dining Location:
                            {'\n'}
                        </Text>

                        <Text style={styles.statisticsInfoText}>
                            {globalStatistics.trending_item_1}
                            {'\n'}
                            {globalStatistics.trending_item_2}
                            {'\n'}
                            {globalStatistics.trending_item_3}
                            {'\n'}
                            {globalStatistics.trending_item_4}
                            {'\n'}
                            {globalStatistics.trending_item_5}
                            {'\n'}
                            {globalStatistics.trending_location_1}
                            {'\n'}
                            {globalStatistics.trending_location_2}
                            {'\n'}
                            {globalStatistics.trending_location_3}
                            {'\n'}
                        </Text>

                    </View>

                    <TouchableOpacity id="viewOtherStatsAgainButton"
                        style={[styles.bodyButtonDefault,
                            { backgroundColor: isLoginLogoutPressed ? '#666666' : '#131312' }
                        ]}
                        onPress={() => {
                            setStatisticModeButtonPressed(false)
                            setSelectedStatisticMode("")
                            setFetchedStatistics(false)
                            setNumberOfDays(7)
                        }}
                    >
                        <Text id="viewOtherStatsAgainButtonText" 
                            style={styles.bodyButtonTextDefault}>

                            View Other Statistics
                        </Text>

                    </TouchableOpacity>

                </View>
            )}
            
            {/* Display the fetched comparative statistics */}
            {selectedStatisticMode === 'Comparative' && fetchedStatistics && (
                <View style={styles.bodyContainerDefault}>

                    <Text style={styles.infoText}>
                        Here are the comparative statistics for all users who agreed to share their data over the last {numberOfDays} days
                    </Text>

                    <View style={styles.bodyContainerAlt}>

                        <Text style={styles.statisticsInfoText}>
                            Balanced Food Groups Percentile:
                            {'\n'}
                            Balanced Macronutrients Percentile:
                            {'\n'}
                            Carbs Percentile:
                            {'\n'}
                            Checkin Percentile:
                            {'\n'}
                            Dairy Percentile:
                            {'\n'}
                            Fat Percentile:
                            {'\n'}
                            Fiber Percentile:
                            {'\n'}
                            Food Logging Percentile:
                            {'\n'}
                            Fruits / Vegs Percentile:
                            {'\n'}
                            Grain Percentile:
                            {'\n'}
                            Protein Percentile:
                            {'\n'}
                            Sugar Percentile:
                            {'\n'}
                        </Text>

                        <Text style={styles.statisticsInfoText}>
                            {comparativeStatistics.balanced_food_groups_percentile}
                            {'\n'}
                            {comparativeStatistics.balanced_macronutrients_percentile}
                            {'\n'}
                            {comparativeStatistics.carbs_percentile}
                            {'\n'}
                            {comparativeStatistics.checkin_percentile}
                            {'\n'}
                            {comparativeStatistics.dairy_percentile}
                            {'\n'}
                            {comparativeStatistics.fat_percentile}
                            {'\n'}
                            {comparativeStatistics.fiber_percentile}
                            {'\n'}
                            {comparativeStatistics.food_logging_percentile}
                            {'\n'}
                            {comparativeStatistics.fruits_veg_percentile}
                            {'\n'}
                            {comparativeStatistics.grain_percentile}
                            {'\n'}
                            {comparativeStatistics.protein_fg_percentile}
                            {'\n'}
                            {comparativeStatistics.sugar_percentile}
                            {'\n'}
                        </Text>

                    </View>

                    <TouchableOpacity id="viewOtherStatsAgainButton"
                        style={[styles.bodyButtonDefault,
                            { backgroundColor: isLoginLogoutPressed ? '#666666' : '#131312' }
                        ]}
                        onPress={() => {
                            setStatisticModeButtonPressed(false)
                            setSelectedStatisticMode("")
                            setFetchedStatistics(false)
                            setNumberOfDays(7)
                        }}
                    >
                        <Text id="viewOtherStatsAgainButtonText" 
                            style={styles.bodyButtonTextDefault}>

                            View Other Statistics
                        </Text>

                    </TouchableOpacity>

                </View>
            )}

        </View>

    )

}