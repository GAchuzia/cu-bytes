import { useState } from 'react';
import { View, ScrollView, Text, TouchableOpacity, FlatList, ActivityIndicator, TouchableWithoutFeedbackComponent } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

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
        Log out the logged-in user by setting their username and profile settings to null 
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
            <View>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (

        <View style={styles.container}>
           
            <StatusBar style="auto" hidden={true}/>

            <View id="viewRecommendationsStatusbar" style={styles.statusbar}>

                {/* Route the user to the 'home' page or the 'splash' page */}
                <TouchableOpacity id="homeOrSplashButton"
                    style={[styles.headerButtonDefault, {backgroundColor: isHomeOrSplashPressed ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsHomeOrSplashPressed(true)}
                    onPressOut={() => setIsHomeOrSplashPressed(false)}
                    onPress={() => usernameGlobal != '' ? router.push('/home') : router.push('/')}>

                    <Text id="homeOrSplashButtonText" style={styles.headerButtonTextDefault}>
                        Home
                    </Text>
                </TouchableOpacity>

                <Text id="loggedInUser" style={styles.headerUsernameIcon}>
                    {usernameGlobal != '' ? `${usernameGlobal}` : 'Guest'}
                </Text>

                {/* Route the user to the 'splash' page or the 'login' page */}
                <TouchableOpacity id="loginLogoutButton"
                    style={[styles.headerButtonDefault, {backgroundColor : isLoginLogoutPressed ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsLoginLogoutPressed(true)}
                    onPressOut={() => setIsLoginLogoutPressed(false)}
                    onPress={() => usernameGlobal != '' ? logout() : router.push('/login')}>

                    <Text id="loginLogoutButtonText" style={styles.headerButtonTextDefault} numberOfLines={1}>
                        {usernameGlobal != '' ? 'Logout' : 'Login'}
                    </Text>
                </TouchableOpacity>
                
            </View>

            <Text id="recommendationsTitle" style={styles.headerTitle}>
                Recommendations
            </Text>

            <ScrollView id="viewRecommendationsScrollView" style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled">

                {/* Display the following message when no recommendations buttons have been pressed and no recommendations have been fetched */}
                {!recommendationModeButtonPressed && !fetchedRecommendations && (
                    <Text id="viewRecommendationsInfoTextDefault" style={styles.infoText}>
                        What recommendations would you like to view?
                    </Text>
                )}

                {/* Display the following message when a recommendations button has been pressed but no recommendations have been fetched */}
                {recommendationModeButtonPressed && !fetchedRecommendations && (
                    <Text id="viewRecommendationsInfoTextNumberOfFoodItems" style={styles.infoText}>
                        Enter the number of food items to include in the retrieved recommendations
                    </Text>
                )}

                {/* Display the button used to notify the frontend to retrieve trending recommendations */}
                {!recommendationModeButtonPressed && (
                    <TouchableOpacity id="trendingRecsButton"
                        style={[styles.bodyButtonDefault, {backgroundColor: isTrendingPressed || usernameGlobal == '' ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsTrendingPressed(true)}
                            onPressOut={() => setIsTrendingPressed(false)}
                            onPress={() => {
                                setRecommendationModeButtonPressed(true);
                                setSelectedRecommendationMode("Trending");
                            }}
                            disabled={usernameGlobal === '' ? true: false}>

                            <Text id="trendingRecsButtonText" style={styles.bodyButtonTextDefault}>
                                Trending
                                {'\n'}
                                Recommendations
                            </Text>
                    </TouchableOpacity>
                )}

                {/* Display the button used to notify the frontend to retrieve random recommendations */}
                {!recommendationModeButtonPressed && (
                    <TouchableOpacity id="randomRecsButton"
                        style={[styles.bodyButtonDefault, {backgroundColor: isRandomPressed || usernameGlobal == '' ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsRandomPressed(true)}
                            onPressOut={() => setIsRandomPressed(false)}
                            onPress={() => {
                                setRecommendationModeButtonPressed(true);
                                setSelectedRecommendationMode("Random");
                            }}
                            disabled={usernameGlobal === '' ? true: false}>

                            <Text id="randomRecsButtonText" style={styles.bodyButtonTextDefault}>
                                Random
                                {'\n'}
                                Recommendations
                            </Text>
                    </TouchableOpacity>
                )}

                {/* Display the button used to notify the frontend to retrieve ideal recommendations */}
                {!recommendationModeButtonPressed && (
                    <TouchableOpacity id="idealRecsButton"
                        style={[styles.bodyButtonDefault, {backgroundColor: isIdealPressed || usernameGlobal == '' ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsIdealPressed(true)}
                            onPressOut={() => setIsIdealPressed(false)}
                            onPress={() => {
                                setRecommendationModeButtonPressed(true);
                                setSelectedRecommendationMode("Ideal");
                            }}
                            disabled={usernameGlobal === '' ? true: false}>

                            <Text id="idealRecsButtonText" style={styles.bodyButtonTextDefault}>
                                Ideal
                                {'\n'}
                                Recommendations
                            </Text>
                    </TouchableOpacity>
                )}

                {/* Display the button used to notify the frontend to retrieve nutrient recommendations */}
                {!recommendationModeButtonPressed && (
                    <TouchableOpacity id="nutrientRecsButton"
                        style={[styles.bodyButtonDefault, {backgroundColor: isNutrientPressed || usernameGlobal == '' ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsNutrientPressed(true)}
                            onPressOut={() => setIsNutrientPressed(false)}
                            onPress={() => {
                                setRecommendationModeButtonPressed(true);
                                setSelectedRecommendationMode("Nutrient");
                            }}
                            disabled={usernameGlobal === '' ? true: false}>

                            <Text id="nutrientRecsButtonText" style={styles.bodyButtonTextDefault}>
                                Nutritional
                                {'\n'}
                                Recommendations
                            </Text>
                    </TouchableOpacity>
                )}

                {/* Display the button used to notify the frontend to retrieve similar recommendations */}
                {!recommendationModeButtonPressed && (
                    <TouchableOpacity id="similarRecsButton"
                        style={[styles.bodyButtonDefault, {backgroundColor: isSimilarPressed || usernameGlobal == '' ? '#666666' : '#131312'}]}
                            onPressIn={() => setIsSimilarPressed(true)}
                            onPressOut={() => setIsSimilarPressed(false)}
                            onPress={() => {
                                setRecommendationModeButtonPressed(true);
                                setSelectedRecommendationMode("Similar");
                            }}
                            disabled={usernameGlobal === '' ? true: false}>

                            <Text id="similarRecsButtonText" style={styles.bodyButtonTextDefault}>
                                Similar
                                {'\n'}
                                Recommendations
                            </Text>
                    </TouchableOpacity>
                )}

                {/* Display buttons to increase/decrease the number of food items to include when retrieving the recommendations */}
                {recommendationModeButtonPressed && !fetchedRecommendations && (
                    <View id="increaseDecreaseNumberOfItemsOrUsersOuterView" style={styles.container}>

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
                            <View id="increaseDecreaseNumberOfItemsOrUsersOuterView" style={styles.container}>

                                {selectedRecommendationMode === 'Similar' && (
                                    <Text id="viewRecommendationsInfoTextNumberOfFoodItems" style={styles.infoText}>
                                        Also enter the number of user to include in the retrieved recommendations
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
                            style={[styles.bodyButtonDefault, {backgroundColor: isLoginLogoutPressed ? '#666666' : '#131312'}]}
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
                            }}>

                            <Text id="getRecsButtonText" style={styles.bodyButtonTextDefault}>
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
                            style={[styles.bodyButtonDefault, {backgroundColor: isLoginLogoutPressed ? '#666666' : '#131312'}]}
                            onPress={() => {
                                setRecommendationModeButtonPressed(false);
                                setSelectedRecommendationMode("");
                                setFetchedRecommendations(false);
                                setNumberOfFoodItems(3);
                                setNumberOfUsers(10);
                            }}>

                            <Text id="viewOtherRecsButtonText" style={styles.bodyButtonTextDefault}>
                                View Other Recommendations
                            </Text>
                        </TouchableOpacity>

                    </View>
                )}

                {/* Display the fetched trending recommendations */}
                {selectedRecommendationMode === 'Trending' && fetchedRecommendations && (
                    <View id="trendingRecommendationsOuterView2" style={styles.fetchedRecommendationsContainer}>

                        <Text id="trendingRecommendationsInfoText" style={styles.infoText}>
                            Here are the top {numberOfFoodItems} food items that are trending in the last 7 days
                        </Text>

                        <View id="trendingRecommendationsOuterView1" style={styles.container}>

                            {trendingRecommendations.food_items.map((foodItem, index) => (
                                <View id="trendingRecommendationsInnerView1" style={styles.fetchedRecommendationsContainer} key={index}>

                                    <FlatList
                                        data={processRecommendations(foodItem)}
                                        scrollEnabled={false}
                                        renderItem={({ item }) => (
                                            <View id="trendingRecommendationsInnerView2" style={styles.row}>
                                                <Text id="trendingRecommendationsFieldNameText" style={styles.rowCell}>{item["field_name"]}</Text>
                                                <Text id="trendingRecommendationsFieldValueText" style={styles.rowCell}>{item["field_value"]}</Text>
                                            </View>
                                        )}>
                                    </FlatList>

                                </View>                                
                            ))}
                        </View>

                    </View>
                )}

                {/* Display the fetched random recommendations */}
                {selectedRecommendationMode === 'Random' && fetchedRecommendations && (
                    <View id="randomRecommendationsOuterView2" style={styles.fetchedRecommendationsContainer}>

                        <Text id="randomRecommendationsInfoText" style={styles.infoText}>
                            Here are {numberOfFoodItems} food items that {usernameGlobal} has not yet tried
                        </Text>

                        <View id="randomRecommendationsOuterView1" style={styles.container}>

                            {randomRecommendations.food_items.map((foodItem, index) => (
                                <View id="randomRecommendationsInnerView1" style={styles.fetchedRecommendationsContainer} key={index}>

                                    <FlatList
                                        data={processRecommendations(foodItem)}
                                        scrollEnabled={false}
                                        renderItem={({ item }) => (
                                            <View id="randomRecommendationsInnerView2" style={styles.row}>
                                                <Text id="randomRecommendationsFieldNameText" style={styles.rowCell}>{item["field_name"]}</Text>
                                                <Text id="randomRecommendationsFieldValueText" style={styles.rowCell}>{item["field_value"]}</Text>
                                            </View>
                                        )}>
                                    </FlatList>

                                </View>                                
                            ))}
                        </View>

                    </View>
                )}

                {/* Display the fetched ideal recommendations */}
                {selectedRecommendationMode === 'Ideal' && fetchedRecommendations && (
                    <View id="idealRecommendationsOuterView2" style={styles.fetchedRecommendationsContainer}>

                        <Text id="idealRecommendationsInfoText" style={styles.infoText}>
                            Here are {numberOfFoodItems} food items that bring {usernameGlobal} closest to the ideal dietary proportions
                            {'\n'}
                            (Based on the USDA/AMDR 2000-cal adult)
                        </Text>

                        <View id="idealRecommendationsOuterView1" style={styles.container}>

                            {idealRecommendations.food_items.map((foodItem, index) => (
                                <View id="idealRecommendationsInnerView1" style={styles.fetchedRecommendationsContainer} key={index}>

                                    <FlatList
                                        data={processRecommendations(foodItem)}
                                        scrollEnabled={false}
                                        renderItem={({ item }) => (
                                            <View id="idealRecommendationsInnerView2" style={styles.row}>
                                                <Text id="idealRecommendationsFieldNameText" style={styles.rowCell}>{item["field_name"]}</Text>
                                                <Text id="idealRecommendationsFieldValueText" style={styles.rowCell}>{item["field_value"]}</Text>
                                            </View>
                                        )}>
                                    </FlatList>

                                </View>                                
                            ))}
                        </View>

                    </View>
                )}

                {/* Display the fetched nutrient recommendations */}
                {selectedRecommendationMode === 'Nutrient' && fetchedRecommendations && (
                    <View id="nutrientRecommendationsOuterView2" style={styles.fetchedRecommendationsContainer}>

                        <Text id="nutrientRecommendationsInfoText" style={styles.infoText}>
                            Here are {numberOfFoodItems} food items that are high in the nutrient that {usernameGlobal} is the most deficient in
                            {'\n'}
                            (The deficient nutrient refers to the nutrient whose value is lowest based on the USDA/AMDR 2000-cal adult)
                        </Text>

                        <View id="nutrientRecommendationsOuterView1" style={styles.container}>

                            <Text id="deficientNutrientInfoText" style={styles.infoText}>
                                    Deficient Nutrient: {nutrientRecommendations.deficient_nutrient}
                            </Text>

                            {nutrientRecommendations.food_items.map((foodItem, index) => (
                                <View id="nutrientRecommendationsInnerView1" style={styles.fetchedRecommendationsContainer} key={index}>

                                    <FlatList
                                        data={processRecommendations(foodItem)}
                                        scrollEnabled={false}
                                        renderItem={({ item }) => (
                                            <View id="nutrientRecommendationsInnerView2" style={styles.row}>
                                                <Text id="nutrientRecommendationsFieldNameText" style={styles.rowCell}>{item["field_name"]}</Text>
                                                <Text id="nutrientRecommendationsFieldValueText" style={styles.rowCell}>{item["field_value"]}</Text>
                                            </View>
                                        )}>
                                    </FlatList>

                                </View>                                
                            ))}
                        </View>

                    </View>
                )}

                {/* Display the fetched similar recommendations */}
                {selectedRecommendationMode === 'Similar' && fetchedRecommendations && (
                    <View id="similarRecommendationsOuterView2" style={styles.fetchedRecommendationsContainer}>

                        <Text id="similarRecommendationsInfoText" style={styles.infoText}>
                            Here are {numberOfFoodItems} food items that are popular with other users that share similar tastes to {usernameGlobal}
                        </Text>

                        <View id="similarRecommendationsOuterView1" style={styles.container}>

                            <Text id="deficientNutrientInfoText" style={styles.infoText}>
                                    Deficient Nutrient: {similarRecommendations.deficient_nutrient}
                            </Text>

                            {similarRecommendations.food_items.map((foodItem, index) => (
                                <View id="similarRecommendationsInnerView1" style={styles.fetchedRecommendationsContainer} key={index}>
                                
                                    <FlatList
                                        data={processRecommendations(foodItem)}
                                        scrollEnabled={false}
                                        renderItem={({ item }) => (
                                            <View id="similarRecommendationsInnerView2" style={styles.row}>
                                                <Text id="similarRecommendationsFieldNameText" style={styles.rowCell}>{item["field_name"]}</Text>
                                                <Text id="similarRecommendationsFieldValueText" style={styles.rowCell}>{item["field_value"]}</Text>
                                            </View>
                                        )}>
                                    </FlatList>

                                </View>                                
                            ))}
                        </View>

                    </View>
                )}

                {fetchedRecommendations && (
                    <TouchableOpacity id="viewOtherRecsAgainButton"
                        style={[styles.bodyButtonDefault, {backgroundColor: isLoginLogoutPressed ? '#666666' : '#131312'}]}
                        onPress={() => {
                            setRecommendationModeButtonPressed(false);
                            setSelectedRecommendationMode("");
                            setFetchedRecommendations(false);
                            setNumberOfFoodItems(3);
                            setNumberOfUsers(10);
                        }}>

                        <Text id="viewOtherRecsAgainButtonText" style={styles.bodyButtonTextDefault}>
                            View Other Recommendations
                        </Text>
                    </TouchableOpacity>
                )}

            </ScrollView>

        </View>
    )
     
}