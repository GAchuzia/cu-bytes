import { useState } from 'react';
import { ScrollView, View, Text, TouchableOpacity, ActivityIndicator } from 'react-native';

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

    const [isBackPressed, setIsBackPressed] = useState(false);
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
        Variable and setter for storing and modifying the trending recommendations of the logged-in user
    */
    const [trendingRecommendations, setTrendingRecommendations] = useState(
        {
            "food_items": [
                {
                "dining_location": "Unknown",
                "id": -1,
                "name": "Unknown"
                },
                {
                "dining_location": "Unknown",
                "id": -1,
                "name": "Unknown"
                },
                {
                "dining_location": "Unknown",
                "id": -1,
                "name": "Unknown"
                }
            ]
        }
    )

    /*
        Variable and setter for storing and modifying the random recommendations of the logged-in user
    */
    const [randomRecommendations, setRandomRecommendations] = useState(
        {
            "food_items": [
                {
                "dining_location": "Unknown",
                "id": -1,
                "name": "Unknown"
                },
                {
                "dining_location": "Unknown",
                "id": -1,
                "name": "Unknown"
                },
                {
                "dining_location": "Unknown",
                "id": -1,
                "name": "Unknown"
                }
            ]
        }
    )

    /*
        Variable and setter for storing and modifying the ideal recommendations of the logged-in user
    */
    const [idealRecommendations, setIdealRecommendations] = useState(
        {
            "food_items": [
                {
                "dining_location": "Unknown",
                "id": -1,
                "name": "Unknown"
                },
                {
                "dining_location": "Unknown",
                "id": -1,
                "name": "Unknown"
                },
                {
                "dining_location": "Unknown",
                "id": -1,
                "name": "Unknown"
                }
            ]
        }
    )

    /*
        Variable and setter for storing and modifying the nutrient recommendations of the logged-in user
    */
    const [nutrientRecommendations, setNutrientRecommendations] = useState(
        {
            "food_items": [
                {
                "dining_location": "Unknown",
                "id": -1,
                "name": "Unknown"
                },
                {
                "dining_location": "Unknown",
                "id": -1,
                "name": "Unknown"
                },
                {
                "dining_location": "Unknown",
                "id": -1,
                "name": "Unknown"
                }
            ]
        }
    )

    /*
        Variable and setter for storing and modifying the similar recommendations of the logged-in user
    */
    const [similarRecommendations, setSimilarRecommendations] = useState(
        {
            "deficient_nutrient": "Unknown",
            "food_items": [
                {
                "dining_location": "Unknown",
                "id": -1,
                "name": "Unknown"
                },
                {
                "dining_location": "Unknown",
                "id": -1,
                "name": "Unknown"
                },
                {
                "dining_location": "Unknown",
                "id": -1,
                "name": "Unknown"
                }
            ]
        }
    )

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
            fetch(`${API_BASE_URL}/recommend/trending/${usernameGlobal}?items=${items}`)
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
            fetch(`${API_BASE_URL}/recommend/random/${usernameGlobal}?items=${items}`)
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
            fetch(`${API_BASE_URL}/recommend/ideal/${usernameGlobal}?items=${items}`)
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
            fetch(`${API_BASE_URL}/recommend/nutrient/${usernameGlobal}?items=${items}`)
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
            fetch(`${API_BASE_URL}/recommend/similar/${usernameGlobal}?items=${items}&users=${users}`)
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

            <View style={styles.statusbar}>

                <TouchableOpacity id="backButton"
                    style={[styles.headerButton, { backgroundColor: isBackPressed ? '#666666' : '#131312' }]}
                    onPressIn={ () => setIsBackPressed(true) }
                    onPressOut={ () => setIsBackPressed(false) }
                    onPress={ () => usernameGlobal != '' ? router.push('/home') : router.push('/') }>

                    <Text id="backButtonText" style={styles.headerButtonText}>Back</Text>
                </TouchableOpacity>

                <Text id="loggedInUser" style={styles.headerUsernameIcon}>
                    {usernameGlobal != '' ? `${usernameGlobal}` : 'Guest' }
                </Text>

                <TouchableOpacity id="loginLogoutButton"
                    style={[styles.headerButton,
                        { backgroundColor : isLoginLogoutPressed ? '#666666' : '#131312' }
                    ]}
                    onPressIn={ () => setIsLoginLogoutPressed(true) }
                    onPressOut={ () => setIsLoginLogoutPressed(false) }
                    onPress={ () => usernameGlobal != '' ? logout() : router.push('/login') }>

                    <Text id="loginLogoutButtonText" style={styles.headerButtonText}>
                        {usernameGlobal != '' ? 'Logout' : 'Login' }
                    </Text>
                </TouchableOpacity>
                
            </View>

            <ScrollView contentContainerStyle={styles.bodyContainer}>

                <Text id="recommendationsTitle" style={styles.headerTitle}>Recs.</Text>

                {/* Display the following message when no recommendations buttons have been pressed and no recommendations have been fetched */}
                {!recommendationModeButtonPressed && !fetchedRecommendations && (
                    <Text style={styles.infoText}> What recommendations would you like to view?</Text>
                )}

                {/* Display the following message when a recommendations button has been pressed but no recommendations have been fetched */}
                {recommendationModeButtonPressed && !fetchedRecommendations && (
                    <Text style={styles.infoText}>Enter the number of food items to include in the retrieved recommendations</Text>
                )}

                {/* Display the buttons used to notify the frontend to retrieve recommendations */}
                {!recommendationModeButtonPressed && (
                    <View style={styles.bodyContainer}>

                        <View style={styles.bodyContainer}>
                            <TouchableOpacity id="trendingRecsButton"
                                style={[styles.bodyButtonDefault, { backgroundColor : isTrendingPressed || usernameGlobal == '' ? '#666666' : '#131312' }]}>

                                <Text id="trendingRecsButtonText" style={styles.bodyButtonTextDefault}>
                                    Trending{'\n'}Recs.
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity id="randomRecsButton"
                                style={[styles.bodyButtonDefault, { backgroundColor : isRandomPressed || usernameGlobal == '' ? '#666666' : '#131312' }]}>
                                
                                <Text id="randomRecsButtonText" style={styles.bodyButtonTextDefault}>
                                    Random{'\n'}Recs.
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.bodyContainer}>
                            <TouchableOpacity id="idealRecsButton"
                                style={[styles.bodyButtonDefault, { backgroundColor : isRandomPressed || usernameGlobal == '' ? '#666666' : '#131312' }]}>

                                <Text id="idealRecsButtonText" style={styles.bodyButtonTextDefault}>
                                    Ideal{'\n'}Recs.
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity id="nutrientRecsButton"
                                style={[styles.bodyButtonDefault, { backgroundColor : isNutrientPressed || usernameGlobal == '' ? '#666666' : '#131312' }]}>
                                
                                <Text id="nutrientRecsButtonText" style={styles.bodyButtonTextDefault}>
                                    Nutrient{'\n'}Recs.
                                </Text>
                            </TouchableOpacity>
                        </View>

                        <View style={styles.bodyContainer}>
                            <TouchableOpacity id="similarRecsButton"
                                style={[styles.bodyButtonDefault, { backgroundColor : isSimilarPressed || usernameGlobal == '' ? '#666666' : '#131312' }]}>
                                
                                <Text id="similarRecsButtonText" style={styles.bodyButtonTextDefault}>
                                    Similar{'\n'}Recs.
                                </Text>
                            </TouchableOpacity>
                        </View>

                    </View>
                )}

                {/* Display the button used to notify the frontend to retrieve trending recommendations */}


                {/* Display the button used to notify the frontend to retrieve random recommendations */}


                {/* Display the button used to notify the frontend to retrieve ideal recommendations */}


                {/* Display the button used to notify the frontend to retrieve nutrient recommendations */}


                {/* Display the button used to notify the frontend to retrieve similar recommendations */}

            </ScrollView>

        </View>
    )
     
}