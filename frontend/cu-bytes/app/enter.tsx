import { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, TextInput, FlatList, ActivityIndicator, Modal } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView } from 'react-native-safe-area-context';

import { screenChrome as sc } from './_styles/screenChrome';
import { styles } from './_styles/style-enter';
import { useUser } from './_context';
import { API_BASE_URL } from '../services/api';

export default function EnterScreen() {

    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isHomeOrSplashPressed, setIsHomeOrSplashPressed] = useState(false);
    const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);
    const [isSearchPressed, setIsSearchPressed] = useState(false);

    /*
        Variables used to store a copy of the logged-in user's username and profile settings 
    */
    const 
        {
            usernameGlobal,
            hasDairyIntoleranceGlobal,            
            hasEggAllergyGlobal,
            hasFishOrShellfishAllergyGlobal,
            hasGlutenAllergyGlobal,            
            hasMilkAllergyGlobal,
            hasPeanutAllergyGlobal,
            hasSesameAllergyGlobal,
            hasSulfitesAllergyGlobal,
            hasSoyAllergyGlobal,
            hasTreenutAllergyGlobal,
            hasWheatAllergyGlobal,
            isVeganGlobal,
            isVegetarianGlobal,
            prefersHalalGlobal,
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
        Variable and setter for storing and modifying the selected food item
        Initialize the default key values for the food item
        This ensures that the key values can be accessed without raising errors
    */
    const [foodItem, setFoodItem] = useState(
        {
            calories: -1,
            carbs_g: 0.00,
            comments: "",
            cost: 0.00,
            dining_location: "",
            fat_g: 0.00,
            fiber_g: 0.00,
            food_category: "",
            has_eggs: null,
            has_fish_or_shellfish: null,
            has_milk: null,
            has_peanuts: null,
            has_sesame: null,
            has_soy: null,
            has_sulfites: null,
            has_treenuts: null,
            has_wheat: null,
            id: -1, // Initial value of 1 to prevent errors
            is_dairy_free: null,
            is_gluten_free: null,
            is_halal: null,
            is_vegan: null,
            is_vegetarian: null,
            last_updated: "",
            name: "",
            proteins_g: 0.00,
            sugar_g: 0.00
        } as {
            calories: number,
            carbs_g: number,
            comments: string,
            cost: number,
            dining_location: string,
            fat_g: number,
            fiber_g: number,
            food_category: string,
            has_eggs: null,
            has_fish_or_shellfish: null,
            has_milk: null,
            has_peanuts: null,
            has_sesame: null,
            has_soy: null,
            has_sulfites: null,
            has_treenuts: null,
            has_wheat: null,
            id: number,
            is_dairy_free: null,
            is_gluten_free: null,
            is_halal: null,
            is_vegan: null,
            is_vegetarian: null,
            last_updated: string,
            name: string,
            proteins_g: number,
            sugar_g: number
        }
    );

    /*
        Variable and setter for storing and modifying the food item name entered by the user
    */
    const [foodItemName, setFoodItemName] = useState(foodItem["name"]);

    /*
        Variable and setter for storing food items retrieved from the backend database
        When the page is loaded, every food item from the backend database is retrieved and stored in the array
    */
    const [foodItemArray, setFoodItemArray] = useState([]);

    /*
        Variable and setter for storing food items retrieved from the backend database
        Every time the user searches for a food item by name,
        Every food item whose name includes the entered string is stored in the filtered array
    */
    const [filteredFoodItemArray, setFilteredFoodItemArray] = useState([]);

    /*
        Calculate how to display the calories of the selected food item
        If the value of the calories key is -1, then there is an "Unknown" number of calories
        If the value of the calories key is not -1, then the displayed calorie amount is equal to that of the calories key value

        param(s):
            calories - number : The number of calories of the selected food item, as per the calorie key value
        
        returns : The calories value of the selected food item
    */
    function processFoodItemCalories(calories: number) {

        if (calories == -1) {
            return "Unknown" 
        }
        else { 
            return calories;
        }
    }

    /*
        Calculate how to display the cost of the selected food item
        If the value of the cost key is -1, then there is an "Unknown" cost for the food item
        If the value of the cost key is not -1, then the displayed cost is equal to that of the cost key value

        param(s):
            cost - number : The cost of the selected food item, as per the cost key value

        returns : The cost of the selected food item
    */
    function processFoodItemCost(cost: number) {

        if (cost == -1) {
            return "Unknown"
        }
        else {
            return cost
        }
    }

    /*
        Calculate how to display the amount of carbs for the selected food item
        If the value of the carbs_g key is -1, then there is an "Unknown" amount of carbs for the food item
        If the value of the carbs_g key is not -1, then the displayed amount of carbs is equal to that of the carbs_g key value

        param(s):
            carbs - number : The amount of carbs in grams for the selected food item, as per the carbs_g key value

        returns : The amount of carbs for the selected food item
    */
    function processFoodItemCarbs(carbs: number) {

        if (carbs == -1) {
            return "Unknown"
        }
        else {
            return carbs
        }
    }

    /*
        Calculate how to display the amount of fat for the selected food item
        If the value of the fat_g key is -1, then there is an "Unknown" amount of fat for the food item
        If the value of the fat_g key is not -1, then the displayed amount of fat is equal to that of the fat_g key value

        param(s):
            fat - number : The amount of fat in grams for the selected food item, as per the fat key value

        returns : The amount of fat for the selected food item
    */
    function processFoodItemFat(fat: number) {

        if (fat == -1) {
            return "Unknown"
        }
        else {
            return fat
        }
    }

    /*
        Calculate how to display the amount of fiber for the selected food item
        If the value of the fiber_g key is -1, then there is an "Unknown" amount of fiber for the food item
        If the value of the fiber_g key is not -1, then the displayed amount of fiber is equal to that of the fiber_g key value

        param(s):
            fiber - number : The amount of fiber in grams for the selected food item, as per the fiber key value

        returns : The amount of fiber for the selected food item
    */
    function processFoodItemFiber(fiber: number) {

        if (fiber == -1) {
            return "Unknown"
        }
        else {
            return fiber
        }
    }

    /*
        Calculate how to display the amount of proteins for the selected food item
        If the value of the proteins_g key is -1, then there is an "Unknown" amount of proteins for the food item
        If the value of the proteins_g key is not -1, then the displayed amount of proteins is equal to that of the proteins_g key value

        param(s):
            proteins - number : The amount of proteins in grams for the selected food item, as per the proteins key value

        returns : The amount of proteins for the selected food item
    */
    function processFoodItemProteins(proteins: number) {

        if (proteins == -1) {
            return "Unknown"
        }
        else {
            return proteins
        }
    }

    /*
        Calculate how to display the amount of sugar for the selected food item
        If the value of the sugar_g key is -1, then there is an "Unknown" amount of sugar for the food item
        If the value of the sugar_g key is not -1, then the displayed amount of sugar is equal to that of the sugar_g key value

        param(s):
            sugar - number : The amount of sugar in grams for the selected food item, as per the sugar key value

        returns : The amount of sugar for the selected food item
    */
    function processFoodItemSugar(sugar: number) {

        if (sugar == -1) {
            return "Unknown"
        }
        else {
            return sugar
        }
    }

    /*
        Convert the selected food item from a JSON object to an array of JSON objects

        param(s):
            foodItem - any : The selected food item, a JSON object

        returns : The selected food item, an array of JSON objects
    */
    const processSelectedFoodItem = (foodItem: any) => {

        return [
            { field_name: "Name", field_value: foodItem["name"]},
            { field_name: "Calories", field_value: processFoodItemCalories(foodItem["calories"]) },
            { field_name: "Location", field_value: foodItem["dining_location"] },
            { field_name: "Cost", field_value: "$ " + processFoodItemCost(foodItem["cost"]) },
            { field_name: "Carbs", field_value: processFoodItemCarbs(foodItem["carbs_g"]) + " grams" },
            { field_name: "Fat", field_value: processFoodItemFat(foodItem["fat_g"]) + " grams" },
            { field_name: "Fiber", field_value: processFoodItemFiber(foodItem["fiber_g"]) + " grams" },
            { field_name: "Proteins", field_value: processFoodItemProteins(foodItem["proteins_g"]) + " grams" },
            { field_name: "Sugar", field_value: processFoodItemSugar(foodItem["sugar_g"]) + " grams" }
        ]
    }

    /*
        Generate the relevant warnings for the selected food item based on the logged-in user's settings

        param(s):
            foodItem - any : The selected food item, a JSON object

        returns : The warnings for the selected food item, an array of JSON objects
    */
    const processSelectedFoodItemWarnings = (foodItem: any) => {

        let foodItemWarningsArray = Array();

        if (foodItem["has_eggs"] === true && hasEggAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains eggs" });
        }
        if (foodItem["has_eggs"] === null && hasEggAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain eggs" });
        }
        if (foodItem["has_fish_or_shellfish"] === true && hasFishOrShellfishAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains fish or shellfish" });
        }
        if (foodItem["has_fish_or_shellfish"] === null && hasFishOrShellfishAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain fish or shellfish" });
        }
        if (foodItem["is_dairy_free"] === false && hasDairyIntoleranceGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains dairy" });
        }
        if (foodItem["is_dairy_free"] === null && hasDairyIntoleranceGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain dairy" });
        }
        if (foodItem["has_milk"] === true && hasMilkAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains milk" });
        }
        if (foodItem["has_milk"] === null && hasMilkAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain milk" });
        }
        if (foodItem["has_peanuts"] === true && hasPeanutAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains peanuts" });
        }
        if (foodItem["has_peanuts"] === null && hasPeanutAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain peanuts" });
        }
        if (foodItem["has_sesame"] === true && hasSesameAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains sesame" });
        }
        if (foodItem["has_sesame"] === null && hasSesameAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain sesame" });
        }
        if (foodItem["has_soy"] === true && hasSoyAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains soy" });
        }
        if (foodItem["has_soy"] === null && hasSoyAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain soy" });
        }
        if (foodItem["has_sulfites"] === true && hasSulfitesAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains sulfites" });
        }
        if (foodItem["has_sulfites"] === null && hasSulfitesAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain sulfites" });
        }
        if (foodItem["has_treenuts"] === true && hasTreenutAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains treenuts" });
        }
        if (foodItem["has_treenuts"] === null && hasTreenutAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain treenuts" });
        }
        if (foodItem["has_wheat"] === true && hasWheatAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains wheat" });
        }
        if (foodItem["has_wheat"] === null && hasWheatAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain wheat" });
        }
        if (foodItem["is_gluten_free"] === false && hasGlutenAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item contains gluten" });
        }
        if (foodItem["is_gluten_free"] === null && hasGlutenAllergyGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may contain gluten" });
        }
        if (foodItem["is_vegan"] === false && isVeganGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item is not vegan" });
        }
        if (foodItem["is_vegan"] === null && isVeganGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may not be vegan" });
        }
        if (foodItem["is_vegetarian"] === false && isVegetarianGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item is not vegetarian" });
        }
        if (foodItem["is_vegetarian"] === null && isVegetarianGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may not be vegetarian" });
        }
        if (foodItem["is_halal"] === false && prefersHalalGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item is not halal" });
        }
        if (foodItem["is_halal"] === null && prefersHalalGlobal) {
            foodItemWarningsArray.push({ field_name: "Warning", field_value: "This item may not be halal" });
        }       

        return foodItemWarningsArray;
    }

    /*
        If the user is not logged-in, set the profile settings to true,
        So that all allergy and intolerance warnings will be displayed by default
    */
    useEffect(() => {
        
        if (usernameGlobal === '') {
            setHasDairyIntoleranceGlobal(true);
            setHasEggAllergyGlobal(true);
            setHasFishOrShellfishAllergyGlobal(true);
            setHasGlutenAllergyGlobal(true);
            setHasMilkAllergyGlobal(true);
            setHasPeanutAllergyGlobal(true);
            setHasSesameAllergyGlobal(true);
            setHasSulfitesAllergyGlobal(true);
            setHasSoyAllergyGlobal(true);
            setHasTreenutAllergyGlobal(true);
            setHasWheatAllergyGlobal(true);
            setIsVeganGlobal(true);
            setIsVegetarianGlobal(true);
            setPrefersHalalGlobal(true);
        }

    }, []);

    /*
        Send a request to the backend endpoint to get all food items from the database
    */
    useEffect(() => {
        const getFoodItems = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/browse/food-items`);
                const data = await res.json();

                // Store the retrieved food items in the array
                setFoodItemArray(data);
                console.log(foodItemArray);

            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        getFoodItems();

    }, []);

    /*
        Send a request to the backend endpoint to get a food item from the database by id

        param(s):
            id - number : The id of the selected food item
    */
    const getFoodItem = async (id: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/browse/food-item/${id}`);
            const data = await res.json();

            // Store the retrieved food item in the variable
            setFoodItem(data);
            console.log(foodItem);

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    /*
        Send a request to the backend endpoint to log a username and food item id in the database
        This records which user purchased what food item

        param(s):
            id - number : The id of the food item to be logged
    */
    const logFoodItemById = async (id: number) => {
        try {
            const res = await fetch(`${API_BASE_URL}/logging/log-by-id`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify( { username: usernameGlobal, food_id: id } )
                }
            );
            const data = await res.json();

        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    }
    
    /*
        Filter the array of food items by the entered string value
        If the name of the food item includes the entered string, store the food item in the filtered array

        param(s):
            name - string : The entered string, representing a possible food item name
    */
    const filterFoodItemArray = (name: string) => {
        const filteredFoodItemArray = foodItemArray.filter(foodItem => (foodItem["name"].toLowerCase() as string).includes(name.toLowerCase()));
        setFilteredFoodItemArray(filteredFoodItemArray);
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

            <View id="browseFoodItemsStatusbar" style={sc.topBar}>
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
                        {usernameGlobal != '' ? 'Log out' : 'Log in'}
                    </Text>
                </TouchableOpacity>
            </View>

            <ScrollView id="browseFoodItemsScrollView" style={sc.scrollView}
                contentContainerStyle={sc.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled">

                <Text id="browseFoodItemsTitle" style={sc.pageTitle}>
                    Browse food
                </Text>
                <Text id="browseFoodItemsInfoText" style={sc.pageSubtitle}>
                    Search by name, then tap a result for nutrition details.
                </Text>

                <View style={sc.formCard}>
                    <TextInput id="browseFoodItemsNameTextInput" style={sc.textInput}
                        onChangeText={setFoodItemName}
                        placeholder="Search food items"
                        placeholderTextColor="#8E95A1"
                        value={foodItemName}
                    />

                    <TouchableOpacity id="browseFoodItemsButton"
                        style={[sc.bodyButton, isSearchPressed && sc.bodyButtonPressed]}
                        onPressIn={() => setIsSearchPressed(true)}
                        onPressOut={() => setIsSearchPressed(false)}
                        onPress={() => {
                            filterFoodItemArray(foodItemName);
                            setVisible(false);}}
                        activeOpacity={0.92}>

                        <Text id="browseFoodItemsButtonText" style={sc.bodyButtonText}>
                            Search
                        </Text>
                    </TouchableOpacity>
                </View>

                {filteredFoodItemArray.length == 0 && !visible && (
                    <Text id="browseFoodItemsFailureText" style={styles.emptyState}>
                        No food items found
                    </Text>
                )}

                {filteredFoodItemArray && !visible && filteredFoodItemArray.length > 0 && (
                    <View id="browseFoodItemsSuccessView" style={[sc.card, styles.listStack, { padding: 0, overflow: 'hidden' }]}>

                        {filteredFoodItemArray.map((foodItem) => (
                            <Text id="browseFoodItemsSuccessText" style={styles.listRowText}
                                key={foodItem["id"]}
                                onPress={() => {
                                    getFoodItem(foodItem["id"]);
                                    setVisible(true);}}>
                                {foodItem["name"]}
                            </Text>
                        ))}
                    </View>
                )}

                {visible && (
                    <View id="foodItemOuterView" style={[sc.card, styles.selectedFoodItemContainer]}>
                        <FlatList id="foodItemFlatList"
                            data={processSelectedFoodItem(foodItem)}
                            scrollEnabled={false}
                            renderItem={({ item, index }) => (
                                <View id="foodItemInnerView" style={[sc.row, index === processSelectedFoodItem(foodItem).length - 1 && sc.rowLast]}>
                                    <Text id="foodItemFieldNameText" style={sc.rowCellLabel}>{item["field_name"]}</Text>
                                    <Text id="foodItemFieldValueText" style={sc.rowCellValue}>{item["field_value"]}</Text>
                                </View>
                            )}>
                        </FlatList>
                    </View>
                )}

                {visible && (
                    <View id="warningOuterView" style={[sc.card, styles.selectedFoodItemContainer]}>
                        <FlatList id="warningFlatList"
                            data={processSelectedFoodItemWarnings(foodItem)}
                            scrollEnabled={false}
                            renderItem={({ item, index }) => (
                                <View id="warningInnerView" style={[sc.row, index === processSelectedFoodItemWarnings(foodItem).length - 1 && sc.rowLast]}>
                                    <Text id="warningFieldNameText" style={sc.rowCellLabel}>{item["field_name"]}</Text>
                                    <Text id="warningFieldValueText" style={sc.rowCellValue}>{item["field_value"]}</Text>
                                </View>
                            )}>
                        </FlatList>
                    </View>
                )}

                {usernameGlobal != "" && visible && (
                    <TouchableOpacity id="saveFoodItemButton" style={sc.bodyButton}
                        onPress={() => {
                            logFoodItemById(foodItem.id);
                            setVisible(false);
                            setModalVisible(true);
                            setTimeout(() => {setModalVisible(false);}, 8000);
                            router.push("/home");}}
                        disabled={loading}
                        activeOpacity={0.92}>

                        <Text id="saveFoodItemButtonText" style={sc.bodyButtonText}>
                            Save food item
                        </Text>
                    </TouchableOpacity>
                )}

                {usernameGlobal != "" && modalVisible && (
                    <Modal id="savedFoodItemModal"
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}>

                        <View id="savedFoodItemOuterView" style={styles.savedFoodItemMessageContainer}>
                            <View id="savedFoodItemInnerView" style={styles.savedFoodItemInner}>
                                <Text id="savedFoodItemText" style={styles.savedFoodItemText}>
                                    Food item saved
                                </Text>
                            </View>
                        </View>
                    </Modal>
                )}
            </ScrollView>
        </View>
        </SafeAreaView>
    )

}