import { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { screenChrome as sc } from './_styles/screenChrome';
import { styles } from './_styles/style-recommendations';
import { useUser } from './_context';
import { API_BASE_URL } from '@/services/api';

export default function RecommendationsScreen() {

    const [loading, setLoading] = useState(false);

    /*
        Variable and setter used to track whether one of the recommendation mode buttons has been pressed
        Initialized with the value false
        Set to the value true everytime a recommendation mode button is pressed
        Set to the value false everytime a recommendation fetch button is pressed
    */
    const [recommendationModeButtonPressed, setRecommendationModeButtonPressed] = useState(false);

    /*
        Variable and setter used to track what recommendation mode button has specifically been pressed
        Initialized with the value ""
        Set to the value "Trending", "Random", "Ideal", "Nutrient", or "Similar" everytime a recommendation mode button is pressed
        Set to the value "" everytime a recommendation fetch button is pressed
    */
    const [selectedRecommendationMode, setSelectedRecommendationMode] = useState("");

    /*
        Variable and setter used to track whether any recommendations have been fetched from the backend
        Initialized with the value false
        Set to the value true everytime a recommendation fetch button is pressed
    */
    const [fetchedRecommendations, setFetchedRecommendations] = useState(false);

    const [isHomeOrSplashPressed, setIsHomeOrSplashPressed] = useState(false);
    const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);
    const [isTrendingPressed, setIsTrendingPressed] = useState(false);
    const [isRandomPressed, setIsRandomPressed] = useState(false);
    const [isIdealPressed, setIsIdealPressed] = useState(false);
    const [isNutrientPressed, setIsNutrientPressed] = useState(false);
    const [isSimilarPressed, setIsSimilarPressed] = useState(false);

    const [numberOfFoodItems, setNumberOfFoodItems] = useState(3);
    const [numberOfUsers, setNumberOfUsers] = useState(10);

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
        Variable and setter for storing and modifying the trending recommendations of the logged-in user
    */
    const [trendingRecommendations, setTrendingRecommendations] = useState(
        {
            food_items: [
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                },
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                },
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                }
            ]
        } as {
            food_items: [
                {
                    dining_location: string,
                    id: number,
                    name: string
                },
                {
                    dining_location: string,
                    id: number,
                    name: string
                },
                {
                    dining_location: string,
                    id: number,
                    name: string
                }
            ]
        }
    )

    /*
        Variable and setter for storing and modifying the random recommendations of the logged-in user
    */
    const [randomRecommendations, setRandomRecommendations] = useState(
        {
            food_items: [
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                },
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                },
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                }
            ]
        } as {
            food_items: [
                {
                    dining_location: string,
                    id: number,
                    name: string
                },
                {
                    dining_location: string,
                    id: number,
                    name: string
                },
                {
                    dining_location: string,
                    id: number,
                    name: string
                }
            ]
        }
    )

    /*
        Variable and setter for storing and modifying the ideal recommendations of the logged-in user
    */
    const [idealRecommendations, setIdealRecommendations] = useState(
        {
            food_items: [
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                },
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                },
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                }
            ]
        } as {
            food_items: [
                {
                    dining_location: string,
                    id: number,
                    name: string,
                },
                {
                    dining_location: string,
                    id: number,
                    name: string,
                },
                {
                    dining_location: string,
                    id: number,
                    name: string,
                }
            ]
        }
    )

    /*
        Variable and setter for storing and modifying the nutrient recommendations of the logged-in user
    */
    const [nutrientRecommendations, setNutrientRecommendations] = useState(
        {
            deficient_nutrient: "Unknown",
            food_items: [
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                },
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                },
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                }
            ]
        } as {
            deficient_nutrient: string,
            food_items: [
                {
                    dining_location: string,
                    id: number,
                    name: string,
                },
                {
                    dining_location: string,
                    id: number,
                    name: string,
                },
                {
                    dining_location: string,
                    id: number,
                    name: string,
                }
            ]
        }
    )

    /*
        Variable and setter for storing and modifying the similar recommendations of the logged-in user
    */
    const [similarRecommendations, setSimilarRecommendations] = useState(
        {
            deficient_nutrient: "Unknown",
            food_items: [
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                },
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                },
                {
                    dining_location: "Unknown",
                    id: -1,
                    name: "Unknown"
                }
            ]
        } as {
            deficient_nutrient: string,
            food_items: [
                {
                    dining_location: string,
                    id: number,
                    name: string
                },
                {
                    dining_location: string,
                    id: number,
                    name: string
                },
                {
                    dining_location: string,
                    id: number,
                    name: string
                }
            ] 
        }
    )

    /*
        Convert the fetched recommendations from a JSON object to an array of JSON objects
        The recommendations could be trending, random, ideal, nutrient, or similar recommendations

        param(s):
            stats - any : The fetched recommendations, a JSON object

        returns : The fetched recommendations, an array of JSON objects
    */
    const processRecommendations = (recs: any) => {
        
        return [
            { field_name: "Food Item", field_value: recs["name"] },
            { field_name: "Dining Location", field_value: recs["dining_location"] }
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
        Send a request to the backend endpoint to get the logged-in user's trending recommendations

        param(s):
            items - number : The number of fooditems to return
    */
    const getTrendingRecs = async (items: number) => {
        try {
            await fetch(`${API_BASE_URL}/recommend/trending/${usernameGlobal}?items=${items}`)
                .then( response => response.json() )
                .then( data => {
                    setTrendingRecommendations(data);
                    console.log(trendingRecommendations);
                })
                .catch( error => { console.log(error) });
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

   /*
        Send a request to the backend endpoint to get the logged-in user's random recommendations

        param(s):
            items - number : The number of fooditems to return
   */
    const getRandomRecs = async (items: number) => {
        try {
            await fetch(`${API_BASE_URL}/recommend/random/${usernameGlobal}?items=${items}`)
                .then( response => response.json() )
                .then( data => {
                    setRandomRecommendations(data);
                    console.log(randomRecommendations);
                })
                .catch( error => { console.log(error) });
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    /*
        Send a request to the backend endpoint to get the logged-in user's ideal recommendations

        param(s):
            items - number : The number of fooditems to return
    */
    const getIdealRecs = async (items: number) => {
        try {
            await fetch(`${API_BASE_URL}/recommend/ideal/${usernameGlobal}?items=${items}`)
                .then( response => response.json() )
                .then( data => {
                    setIdealRecommendations(data);
                    console.log(idealRecommendations);
                })
                .catch( error => { console.log(error) });
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    /*
        Send a request to the backend endpoint to get the logged-in user's nutrient recommendations

        param(s):
            items - number : The number of fooditems to return
    */
    const getNutrientRecs = async (items: number) => {
        try {
            await fetch(`${API_BASE_URL}/recommend/nutrient/${usernameGlobal}?items=${items}`)
                .then( response => response.json() )
                .then( data => {
                    setNutrientRecommendations(data);
                    console.log(nutrientRecommendations);
                })
                .catch( error => { console.log(error) });
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    /*
        Send a request to the backend endpoint to get the logged-in user's similar recommendations

        param(s):
            items - number : The number of fooditems to return
            users - number : The number of users to compare with
    */
    const getSimilarRecs = async (items: number, users: number) => {
        try {
            await fetch(`${API_BASE_URL}/recommend/similar/${usernameGlobal}?items=${items}`)
                .then( response => response.json() )
                .then( data => {
                    setSimilarRecommendations(data);
                    console.log(similarRecommendations);
                })
                .catch( error => { console.log(error) });
        } catch (err) {
            console.log(err);
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

    return (
        <SafeAreaView style={sc.safeRoot} edges={['top', 'left', 'right']}>
        <View style={sc.container}>
            <StatusBar style="dark" />

            <View id="viewRecommendationsStatusbar" style={sc.topBar}>
                <TouchableOpacity id="homeOrSplashButton"
                    style={[sc.headerButton, isHomeOrSplashPressed && sc.headerButtonPressed]}
                    onPressIn={() => setIsHomeOrSplashPressed(true)}
                    onPressOut={() => setIsHomeOrSplashPressed(false)}
                    onPress={() => usernameGlobal != '' ? router.push('/home') : router.push('/')}
                    activeOpacity={0.9}>

                    <Text id="homeOrSplashButtonText" style={sc.headerButtonText}>
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
                        {usernameGlobal != '' ? 'Log out' : 'Log in'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView id="viewRecommendationsScrollView" style={sc.scrollView}
                contentContainerStyle={sc.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">

                <Text id="recommendationsTitle" style={sc.pageTitle}>
                    Recommendations
                </Text>

                {/* Display the following message when no recommendations buttons have been pressed and no recommendations have been fetched */}
                {!recommendationModeButtonPressed && !fetchedRecommendations && (
                    <Text id="viewRecommendationsInfoTextDefault" style={sc.pageSubtitle}>
                        What recommendations would you like to view?
                    </Text>
                )}

                {/* Display the following message when a recommendations button has been pressed but no recommendations have been fetched */}
                {recommendationModeButtonPressed && !fetchedRecommendations && (
                    <Text id="viewRecommendationsInfoTextNumberOfFoodItems" style={sc.pageSubtitle}>
                        Enter the number of food items to include in the retrieved recommendations
                    </Text>
                )}

                {/* Display the button used to notify the frontend to retrieve trending recommendations */}
                {!recommendationModeButtonPressed && (
                    <TouchableOpacity id="trendingRecsButton"
                        style={[sc.bodyButton, usernameGlobal === '' && sc.bodyButtonDisabled, isTrendingPressed && sc.bodyButtonPressed]}
                            onPressIn={() => setIsTrendingPressed(true)}
                            onPressOut={() => setIsTrendingPressed(false)}
                            onPress={() => {
                                setRecommendationModeButtonPressed(true);
                                setSelectedRecommendationMode("Trending");
                            }}
                            disabled={usernameGlobal === '' ? true: false}
                            activeOpacity={0.92}>

                            <Text id="trendingRecsButtonText" style={sc.bodyButtonText}>
                                Trending Picks
                            </Text>
                    </TouchableOpacity>
                )}

                {!recommendationModeButtonPressed && (
                    <TouchableOpacity id="randomRecsButton"
                        style={[sc.bodyButton, usernameGlobal === '' && sc.bodyButtonDisabled, isRandomPressed && sc.bodyButtonPressed]}
                            onPressIn={() => setIsRandomPressed(true)}
                            onPressOut={() => setIsRandomPressed(false)}
                            onPress={() => {
                                setRecommendationModeButtonPressed(true);
                                setSelectedRecommendationMode("Random");
                            }}
                            disabled={usernameGlobal === '' ? true: false}
                            activeOpacity={0.92}>

                            <Text id="randomRecsButtonText" style={sc.bodyButtonText}>
                                Random Suggestions
                            </Text>
                    </TouchableOpacity>
                )}

                {!recommendationModeButtonPressed && (
                    <TouchableOpacity id="idealRecsButton"
                        style={[sc.bodyButton, usernameGlobal === '' && sc.bodyButtonDisabled, isIdealPressed && sc.bodyButtonPressed]}
                            onPressIn={() => setIsIdealPressed(true)}
                            onPressOut={() => setIsIdealPressed(false)}
                            onPress={() => {
                                setRecommendationModeButtonPressed(true);
                                setSelectedRecommendationMode("Ideal");
                            }}
                            disabled={usernameGlobal === '' ? true: false}
                            activeOpacity={0.92}>

                            <Text id="idealRecsButtonText" style={sc.bodyButtonText}>
                                Ideal Balance (USDA / AMDR)
                            </Text>
                    </TouchableOpacity>
                )}

                {!recommendationModeButtonPressed && (
                    <TouchableOpacity id="nutrientRecsButton"
                        style={[sc.bodyButton, usernameGlobal === '' && sc.bodyButtonDisabled, isNutrientPressed && sc.bodyButtonPressed]}
                            onPressIn={() => setIsNutrientPressed(true)}
                            onPressOut={() => setIsNutrientPressed(false)}
                            onPress={() => {
                                setRecommendationModeButtonPressed(true);
                                setSelectedRecommendationMode("Nutrient");
                            }}
                            disabled={usernameGlobal === '' ? true: false}
                            activeOpacity={0.92}>

                            <Text id="nutrientRecsButtonText" style={sc.bodyButtonText}>
                                Deficient Nutrient
                            </Text>
                    </TouchableOpacity>
                )}

                {!recommendationModeButtonPressed && (
                    <TouchableOpacity id="similarRecsButton"
                        style={[sc.bodyButton, usernameGlobal === '' && sc.bodyButtonDisabled, isSimilarPressed && sc.bodyButtonPressed]}
                            onPressIn={() => setIsSimilarPressed(true)}
                            onPressOut={() => setIsSimilarPressed(false)}
                            onPress={() => {
                                setRecommendationModeButtonPressed(true);
                                setSelectedRecommendationMode("Similar");
                            }}
                            disabled={usernameGlobal === '' ? true: false}
                            activeOpacity={0.92}>

                            <Text id="similarRecsButtonText" style={sc.bodyButtonText}>
                                Similar Tastes
                            </Text>
                    </TouchableOpacity>
                )}

                {/* Display buttons to increase/decrease the number of food items to include when retrieving the recommendations */}
                {recommendationModeButtonPressed && !fetchedRecommendations && (
                    <View id="increaseDecreaseNumberOfItemsOrUsersOuterView" style={styles.innerStack}>

                        <View id="increaseDecreaseNumberOfItemsInnerView" style={styles.buttonContainer}>

                            <TouchableOpacity id="decreaseNumberOfItemsButton"
                                style={styles.bodyButtonDecreaseNumberOfItemsOrUsers}
                                onPress={() => {numberOfFoodItems > 1 ? setNumberOfFoodItems(numberOfFoodItems-1) : null}}>

                                <Text id="decreaseNumberOfItemsButtonText" style={styles.bodyButtonTextDecreaseNumberOfItemsOrUsers}>
                                    -
                                </Text>
                            </TouchableOpacity>

                            <Text id="numberOfItemsText" style={styles.numberOfItemsOrUsersText}>
                                {numberOfFoodItems}
                            </Text>                        
                            
                            <TouchableOpacity id="increaseNumberOfItemsButton"
                                style={styles.bodyButtonIncreaseNumberOfItemsOrUsers}
                                onPress={() => setNumberOfFoodItems(numberOfFoodItems+1)}>

                                <Text id="increaseNumberOfItemsButtonText" style={styles.bodyButtonTextIncreaseNumberOfItemsOrUsers}>
                                    +
                                </Text>
                            </TouchableOpacity>

                        </View>
                        
                        {/* Display buttons to increase/decrease the number users to include when retrieving the recommendations */}
                        {selectedRecommendationMode === 'Similar' && (
                            <View id="increaseDecreaseNumberOfItemsOrUsersOuterView" style={styles.innerStack}>

                                {selectedRecommendationMode === 'Similar' && (
                                    <Text id="viewRecommendationsInfoTextNumberOfFoodItems" style={sc.pageSubtitle}>
                                        Peer count for similar-taste matching (optional tuning).
                                    </Text>
                                )}

                                <View id="increaseDecreaseNumberOfUsersInnerView" style={styles.buttonContainer}>

                                    <TouchableOpacity id="decreaseNumberOfUsersButton"
                                        style={styles.bodyButtonDecreaseNumberOfItemsOrUsers}
                                        onPress={() => {numberOfUsers > 1 ? setNumberOfUsers(numberOfUsers-1) : null}}>

                                        <Text id="decreaseNumberOfUsersButtonText" style={styles.bodyButtonTextDecreaseNumberOfItemsOrUsers}>
                                            -
                                        </Text>
                                    </TouchableOpacity>

                                    <Text id="numberOfUsersText" style={styles.numberOfItemsOrUsersText}>
                                        {numberOfUsers}
                                    </Text>                        
                                    
                                    <TouchableOpacity id="increaseNumberOfUsersButton"
                                        style={styles.bodyButtonIncreaseNumberOfItemsOrUsers}
                                        onPress={() => setNumberOfUsers(numberOfUsers+1)}>

                                        <Text id="increaseNumberOfUsersButtonText" style={styles.bodyButtonTextIncreaseNumberOfItemsOrUsers}>
                                            +
                                        </Text>
                                    </TouchableOpacity>

                                </View>
                            </View>
                        )}

                        <TouchableOpacity id="getRecsButton"
                            style={sc.bodyButton}
                            onPress={() => {
                                { 
                                    selectedRecommendationMode === 'Trending' ? getTrendingRecs(numberOfFoodItems) :
                                    selectedRecommendationMode === 'Random' ? getRandomRecs(numberOfFoodItems) :
                                    selectedRecommendationMode === 'Ideal' ? getIdealRecs(numberOfFoodItems) :
                                    selectedRecommendationMode === 'Nutrient' ? getNutrientRecs(numberOfFoodItems) :
                                    selectedRecommendationMode === 'Similar' ? getSimilarRecs(numberOfFoodItems, numberOfUsers) :
                                    null
                                }
                                setFetchedRecommendations(true)
                            }}
                            activeOpacity={0.92}>

                            <Text id="getRecsButtonText" style={sc.bodyButtonText}>
                                { 
                                    selectedRecommendationMode === 'Trending' ? 'Get Trending Recommendations' :
                                    selectedRecommendationMode === 'Random' ? 'Get Random Recommendations' :
                                    selectedRecommendationMode === 'Ideal' ? 'Get Ideal Recommendations' :
                                    selectedRecommendationMode === 'Nutrient' ? 'Get Nutritional Recommendations' :
                                    selectedRecommendationMode === 'Similar' ? 'Get Similar Recommendations' :
                                    ''
                                }
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity id="viewOtherRecsButton"
                            style={sc.bodyButtonOutline}
                            onPress={() => {
                                setRecommendationModeButtonPressed(false);
                                setSelectedRecommendationMode("");
                                setFetchedRecommendations(false);
                                setNumberOfFoodItems(3);
                                setNumberOfUsers(10);
                            }}
                            activeOpacity={0.92}>

                            <Text id="viewOtherRecsButtonText" style={sc.bodyButtonOutlineText}>
                                Choose another type
                            </Text>
                        </TouchableOpacity>

                    </View>
                )}

                {/* Display the fetched trending recommendations */}
                {selectedRecommendationMode === 'Trending' && fetchedRecommendations && (
                    <View id="trendingRecommendationsOuterView2" style={{ alignSelf: 'stretch', marginBottom: 14 }}>

                        <Text id="trendingRecommendationsInfoText" style={sc.pageSubtitle}>
                            Top {numberOfFoodItems} trending items (last 7 days).
                        </Text>

                        <View id="trendingRecommendationsOuterView1" style={styles.innerStack}>

                            {trendingRecommendations.food_items.map((foodItem, index) => {
                                const recRows = processRecommendations(foodItem);
                                return (
                                <View id="trendingRecommendationsInnerView1" style={[sc.card, { marginBottom: 12, padding: 0, overflow: 'hidden' }]} key={index}>

                                    <FlatList
                                        data={recRows}
                                        scrollEnabled={false}
                                        renderItem={({ item, index: ri }) => (
                                            <View id="trendingRecommendationsInnerView2" style={[sc.row, ri === recRows.length - 1 && sc.rowLast]}>
                                                <Text id="trendingRecommendationsFieldNameText" style={sc.rowCellLabel}>{item["field_name"]}</Text>
                                                <Text id="trendingRecommendationsFieldValueText" style={sc.rowCellValue}>{item["field_value"]}</Text>
                                            </View>
                                        )}>
                                    </FlatList>

                                </View>
                                );
                            })}
                        </View>

                    </View>
                )}

                {/* Display the fetched random recommendations */}
                {selectedRecommendationMode === 'Random' && fetchedRecommendations && (
                    <View id="randomRecommendationsOuterView2" style={{ alignSelf: 'stretch', marginBottom: 14 }}>

                        <Text id="randomRecommendationsInfoText" style={sc.pageSubtitle}>
                            {numberOfFoodItems} items you have not tried yet.
                        </Text>

                        <View id="randomRecommendationsOuterView1" style={styles.innerStack}>

                            {randomRecommendations.food_items.map((foodItem, index) => {
                                const recRows = processRecommendations(foodItem);
                                return (
                                <View id="randomRecommendationsInnerView1" style={[sc.card, { marginBottom: 12, padding: 0, overflow: 'hidden' }]} key={index}>

                                    <FlatList
                                        data={recRows}
                                        scrollEnabled={false}
                                        renderItem={({ item, index: ri }) => (
                                            <View id="randomRecommendationsInnerView2" style={[sc.row, ri === recRows.length - 1 && sc.rowLast]}>
                                                <Text id="randomRecommendationsFieldNameText" style={sc.rowCellLabel}>{item["field_name"]}</Text>
                                                <Text id="randomRecommendationsFieldValueText" style={sc.rowCellValue}>{item["field_value"]}</Text>
                                            </View>
                                        )}>
                                    </FlatList>

                                </View>
                                );
                            })}
                        </View>

                    </View>
                )}

                {/* Display the fetched ideal recommendations */}
                {selectedRecommendationMode === 'Ideal' && fetchedRecommendations && (
                    <View id="idealRecommendationsOuterView2" style={{ alignSelf: 'stretch', marginBottom: 14 }}>

                        <Text id="idealRecommendationsInfoText" style={sc.pageSubtitle}>
                            {numberOfFoodItems} picks closest to ideal macros (USDA / AMDR, 2000 kcal reference).
                        </Text>

                        <View id="idealRecommendationsOuterView1" style={styles.innerStack}>

                            {idealRecommendations.food_items.map((foodItem, index) => {
                                const recRows = processRecommendations(foodItem);
                                return (
                                <View id="idealRecommendationsInnerView1" style={[sc.card, { marginBottom: 12, padding: 0, overflow: 'hidden' }]} key={index}>

                                    <FlatList
                                        data={recRows}
                                        scrollEnabled={false}
                                        renderItem={({ item, index: ri }) => (
                                            <View id="idealRecommendationsInnerView2" style={[sc.row, ri === recRows.length - 1 && sc.rowLast]}>
                                                <Text id="idealRecommendationsFieldNameText" style={sc.rowCellLabel}>{item["field_name"]}</Text>
                                                <Text id="idealRecommendationsFieldValueText" style={sc.rowCellValue}>{item["field_value"]}</Text>
                                            </View>
                                        )}>
                                    </FlatList>

                                </View>
                                );
                            })}
                        </View>

                    </View>
                )}

                {/* Display the fetched nutrient recommendations */}
                {selectedRecommendationMode === 'Nutrient' && fetchedRecommendations && (
                    <View id="nutrientRecommendationsOuterView2" style={{ alignSelf: 'stretch', marginBottom: 14 }}>

                        <Text id="nutrientRecommendationsInfoText" style={sc.pageSubtitle}>
                            {numberOfFoodItems} items rich in your most under-served nutrient (USDA / AMDR reference).
                        </Text>

                        <View id="nutrientRecommendationsOuterView1" style={styles.innerStack}>

                            <Text id="deficientNutrientInfoText" style={[sc.pageSubtitle, { fontWeight: '700' as const }]}>
                                Focus nutrient: {nutrientRecommendations.deficient_nutrient}
                            </Text>

                            {nutrientRecommendations.food_items.map((foodItem, index) => {
                                const recRows = processRecommendations(foodItem);
                                return (
                                <View id="nutrientRecommendationsInnerView1" style={[sc.card, { marginBottom: 12, padding: 0, overflow: 'hidden' }]} key={index}>

                                    <FlatList
                                        data={recRows}
                                        scrollEnabled={false}
                                        renderItem={({ item, index: ri }) => (
                                            <View id="nutrientRecommendationsInnerView2" style={[sc.row, ri === recRows.length - 1 && sc.rowLast]}>
                                                <Text id="nutrientRecommendationsFieldNameText" style={sc.rowCellLabel}>{item["field_name"]}</Text>
                                                <Text id="nutrientRecommendationsFieldValueText" style={sc.rowCellValue}>{item["field_value"]}</Text>
                                            </View>
                                        )}>
                                    </FlatList>

                                </View>
                                );
                            })}
                        </View>

                    </View>
                )}

                {/* Display the fetched similar recommendations */}
                {selectedRecommendationMode === 'Similar' && fetchedRecommendations && (
                    <View id="similarRecommendationsOuterView2" style={{ alignSelf: 'stretch', marginBottom: 14 }}>

                        <Text id="similarRecommendationsInfoText" style={sc.pageSubtitle}>
                            {numberOfFoodItems} picks popular with users who eat like you.
                        </Text>

                        <View id="similarRecommendationsOuterView1" style={styles.innerStack}>

                            <Text id="deficientNutrientInfoText" style={[sc.pageSubtitle, { fontWeight: '700' as const }]}>
                                Related nutrient signal: {similarRecommendations.deficient_nutrient}
                            </Text>

                            {similarRecommendations.food_items.map((foodItem, index) => {
                                const recRows = processRecommendations(foodItem);
                                return (
                                <View id="similarRecommendationsInnerView1" style={[sc.card, { marginBottom: 12, padding: 0, overflow: 'hidden' }]} key={index}>

                                    <FlatList
                                        data={recRows}
                                        scrollEnabled={false}
                                        renderItem={({ item, index: ri }) => (
                                            <View id="similarRecommendationsInnerView2" style={[sc.row, ri === recRows.length - 1 && sc.rowLast]}>
                                                <Text id="similarRecommendationsFieldNameText" style={sc.rowCellLabel}>{item["field_name"]}</Text>
                                                <Text id="similarRecommendationsFieldValueText" style={sc.rowCellValue}>{item["field_value"]}</Text>
                                            </View>
                                        )}>
                                    </FlatList>

                                </View>
                                );
                            })}
                        </View>

                    </View>
                )}

                {fetchedRecommendations && (
                    <TouchableOpacity id="viewOtherRecsAgainButton"
                        style={sc.bodyButtonOutline}
                        onPress={() => {
                            setRecommendationModeButtonPressed(false);
                            setSelectedRecommendationMode("");
                            setFetchedRecommendations(false);
                            setNumberOfFoodItems(3);
                            setNumberOfUsers(10);
                        }}
                        activeOpacity={0.92}>

                        <Text id="viewOtherRecsAgainButtonText" style={sc.bodyButtonOutlineText}>
                            Choose another type
                        </Text>
                    </TouchableOpacity>
                )}

            </ScrollView>

        </View>
        </SafeAreaView>
    )

}