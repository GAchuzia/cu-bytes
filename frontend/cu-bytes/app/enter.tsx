import { useState, useEffect } from 'react';
import { View, ScrollView, Text, TouchableOpacity, TextInput, ActivityIndicator, Modal } from 'react-native';

import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

import { styles } from './_styles/style-enter';
import { useUser } from './_context';
import { API_BASE_URL } from '../services/api';

export default function EnterScreen() {

    const [loading, setLoading] = useState(true);
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [isBackPressed, setIsBackPressed] = useState(false);
    const [isLoginLogoutPressed, setIsLoginLogoutPressed] = useState(false);
    const [isSearchPressed, setIsSearchPressed] = useState(false);

    /*
        Variables used to store a copy of the logged-in user's username and profile settings 
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
        Variable and setter for storing and modifying the selected food item
        Initialize the default key values for the food item
        This ensures that the key values can be accessed without raising errors
    */
    const [foodItem, setFoodItem] = useState(
        {
            "calories": -1,
            "carbs_g": 0.00,
            "comments": "",
            "cost": 0.00,
            "dining_location": "",
            "fat_g": 0.00,
            "fiber_g": 0.00,
            "food_category": "",
            "has_eggs": null,
            "has_fish_or_shellfish": null,
            "has_milk": null,
            "has_peanuts": null,
            "has_sesame": null,
            "has_soy": null,
            "has_treenuts": null,
            "has_wheat": null,
            "id": -1, // Initial value of 1 to prevent errors
            "is_dairy_free": null,
            "is_gluten_free": null,
            "is_halal": null,
            "is_vegan": null,
            "is_vegetarian": null,
            "last_updated": "",
            "name": "",
            "proteins_g": 0.00,
            "sugar_g": 0.00
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
        Log out the logged-in user by setting their username and profile settings to null, and routing to the splash page
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
            
            <StatusBar style="auto" hidden={true}/>

            <View id="browseFoodItemsStatusbar" style={styles.statusbar}>

                {/* Route the user to the 'home' page or the 'splash' page */}
                <TouchableOpacity id="backButton"
                    style={[styles.headerButtonDefault, {backgroundColor: isBackPressed ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsBackPressed(true)}
                    onPressOut={() => setIsBackPressed(false)}
                    onPress={() => usernameGlobal != '' ? router.push('/home') : router.push('/')}>

                    <Text id="backButtonText" style={styles.headerButtonTextDefault} numberOfLines={1}>
                        Back
                    </Text>     
                </TouchableOpacity>

                <Text id="loggedInUser" style={styles.headerUsernameIcon}>
                    {usernameGlobal != '' ? `${usernameGlobal}` : 'Guest'}
                </Text>

                {/* Route the user to the 'splash' page or the 'login' page */}
                <TouchableOpacity id="loginLogoutButton"
                    style={[styles.headerButtonDefault, {backgroundColor: isLoginLogoutPressed ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsLoginLogoutPressed(true)}
                    onPressOut={() => setIsLoginLogoutPressed(false)}
                    onPress={() => usernameGlobal != '' ? logout() : router.push('/login')}>

                    <Text id="loginLogoutButtonText" style={styles.headerButtonTextDefault} numberOfLines={1}>
                        {usernameGlobal != '' ? 'Logout' : 'Login'}
                    </Text>
                </TouchableOpacity>

            </View>

            <Text id="browseFoodItemsTitle" style={styles.headerTitle}>
                Food Items
            </Text>

            <ScrollView id="browseFoodItemsScrollView" style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={true}
                keyboardShouldPersistTaps="handled">

                <Text id="browseFoodItemsInfoText" style={styles.infoText}>
                    Search for a food item by name
                </Text>

                {/* Enter the name of a food item */}
                <TextInput id="browseFoodItemsNameTextInput" style={styles.foodItemNameTextInput}
                    onChangeText={setFoodItemName}
                    placeholder={"Search for food items"}
                    value={foodItemName}>
                </TextInput>

                {/* Filter the food items in the array by the food item name and store in another array */}
                <TouchableOpacity id="browseFoodItemsButton"
                    style={[styles.bodyButtonDefault, {backgroundColor: isSearchPressed ? '#666666' : '#131312'}]}
                    onPressIn={() => setIsSearchPressed(true)}
                    onPressOut={() => setIsSearchPressed(false)}
                    onPress={() => {
                        filterFoodItemArray(foodItemName);
                        setVisible(false);}}>

                    <Text id="browseFoodItemsButtonText" style={styles.bodyButtonTextDefault}>
                        Search
                    </Text>
                </TouchableOpacity>

                {/* If the entered string value does not return any food items, display the following message */}
                {filteredFoodItemArray.length == 0 && !visible && (
                    <View id="browseFoodItemsFailureView" style={styles.foodItemViewDefault}>

                        <Text id="browseFoodItemsFailureText" style={styles.foodItemTextDefault}>
                            No food items found
                        </Text>
                    </View>
                )}

                {/* If the entered string value returns food items, display the name and id of each food item */}
                {filteredFoodItemArray && !visible && (
                    <View id="browseFoodItemsSuccessView" style={styles.foodItemViewDefault}>

                        {filteredFoodItemArray.map((foodItem) => (

                            <Text id="browseFoodItemsSuccessText" style={styles.foodItemTextDefault}
                                key={foodItem["id"]}
                                onPress={() => {
                                    getFoodItem(foodItem["id"]);
                                    setVisible(true);}}>
                                {foodItem["name"]}
                            </Text>
                        ))}
                    </View>
                )}

                {/* Display general information about the selected food item */}
                {visible && (
                    <View id="foodItemView" style={styles.selectedFoodItemView}>

                        <Text id="foodItemLabelsText" style={styles.foodItemLabelText}>
                            Name:
                            {'\n'}
                            Calories:
                            {'\n'}
                            Location:
                            {'\n'}
                            Cost:
                            {'\n'}
                            Carbs:
                            {'\n'}
                            Fat:
                            {'\n'}
                            Fiber:
                            {'\n'}
                            Proteins:
                            {'\n'}
                            Sugar:
                        </Text>

                        <Text id="foodItemDataText" style={styles.foodItemDataText}>
                            {foodItem.name}
                            {'\n'}
                            {processFoodItemCalories(foodItem.calories)}
                            {'\n'}
                            {foodItem.dining_location}
                            {'\n'}
                            $ {processFoodItemCost(foodItem.cost)}
                            {'\n'}
                            {processFoodItemCarbs(foodItem.carbs_g)} grams
                            {'\n'}
                            {processFoodItemFat(foodItem.fat_g)} grams
                            {'\n'}
                            {processFoodItemFiber(foodItem.fiber_g)} grams
                            {'\n'}
                            {processFoodItemProteins(foodItem.proteins_g)} grams
                            {'\n'}
                            {processFoodItemSugar(foodItem.sugar_g)} grams
                        </Text>

                    </View>
                )}

                {/* Display warning information about the selected food item */}
                {visible && (
                    <Text id="warningsText" style={styles.foodItemTextDefault}>
                        {usernameGlobal == '' ? "Warnings will be displayed here" : null}

                        {foodItem.has_eggs === true && hasEggAllergyGlobal ? "Warning - this item contains eggs \n" : null}
                        {foodItem.has_eggs === null && hasEggAllergyGlobal ? "Warning - this item may contain eggs \n" : null}

                        {foodItem.has_fish_or_shellfish === true && hasFishOrShellfishAllergyGlobal ? "Warning - this item contains fish or shellfish \n" : null}
                        {foodItem.has_fish_or_shellfish === null && hasFishOrShellfishAllergyGlobal ? "Warning - this item may contain fish or shellfish \n" : null}

                        {foodItem.is_dairy_free === false && hasDairyIntoleranceGlobal ? "Warning - this item contains dairy \n" : null}
                        {foodItem.is_dairy_free === null && hasDairyIntoleranceGlobal ? "Warning - this item may contain dairy \n" : null}

                        {foodItem.has_milk === true && hasMilkAllergyGlobal ? "Warning - this item contains milk \n" : null}
                        {foodItem.has_milk === null && hasMilkAllergyGlobal ? "Warning - this item may contain milk \n" : null}

                        {foodItem.has_peanuts === true && hasPeanutAllergyGlobal ? "Warning - this item contains peanuts \n" : null}
                        {foodItem.has_peanuts === null && hasPeanutAllergyGlobal ? "Warning - this item may contain peanuts \n" : null}

                        {foodItem.has_sesame === true && hasSesameAllergyGlobal ? "Warning - this item contains sesame \n" : null}
                        {foodItem.has_sesame === null && hasSesameAllergyGlobal ? "Warning - this item may contain sesame \n" : null}

                        {foodItem.has_soy === true && hasSoyAllergyGlobal ? "Warning - this item contains soy \n" : null}
                        {foodItem.has_soy === null && hasSoyAllergyGlobal ? "Warning - this item may contain soy \n" : null}

                        {foodItem.has_treenuts === true && hasTreenutAllergyGlobal ? "Warning - this item contains treenuts \n" : null}
                        {foodItem.has_treenuts === null && hasTreenutAllergyGlobal ? "Warning - this item may contain treenuts \n" : null}

                        {foodItem.has_wheat === true && hasWheatAllergyGlobal ? "Warning - this item contains wheat \n" : null}
                        {foodItem.has_wheat === null && hasWheatAllergyGlobal ? "Warning - this item may contain wheat \n" : null}
                    
                        {foodItem.is_gluten_free === false && hasGlutenAllergyGlobal ? "Warning - this item contains gluten \n" : null}
                        {foodItem.is_gluten_free === null && hasGlutenAllergyGlobal ? "Warning - this item may contain gluten \n" : null}
                        
                        {foodItem.is_vegan === false && isVeganGlobal ?  "Warning - this item is not vegan \n" : null}
                        {foodItem.is_vegan === null && isVeganGlobal ?  "Warning - this item may not be vegan \n" : null}
                        
                        {foodItem.is_vegetarian === false && isVegetarianGlobal ?  "Warning - this item is not vegetarian \n" : null}
                        {foodItem.is_vegetarian === null && isVegetarianGlobal ?  "Warning - this item may not be vegetarian \n" : null}                        
                        
                        {foodItem.is_halal === false && prefersHalalGlobal ? "Warning - this item is not halal \n" : null}                                                
                        {foodItem.is_halal === null && prefersHalalGlobal ? "Warning - this item may not be halal \n" : null}
                    </Text>
                )}

                {/*  */}
                {usernameGlobal != "" && visible && (
                    <TouchableOpacity id="saveFoodItemButton" style={[styles.bodyButtonAlt]}
                        onPress={() => {
                            logFoodItemById(foodItem.id);
                            setVisible(false);
                            setModalVisible(true);
                            setTimeout(() => {setModalVisible(false);}, 8000);
                            router.push("/home");}}
                        disabled={loading}>

                        <Text id="saveFoodItemButtonText" style={styles.bodyButtonTextAlt}>
                            Save Food Item
                        </Text>
                    </TouchableOpacity>   
                )}

                {/* Display a message when the selected food item is saved */}
                {usernameGlobal != "" && modalVisible && (
                    <Modal id="savedFoodItemModal"
                        animationType="fade"
                        transparent={true}
                        visible={modalVisible}>

                        <View id="savedFoodItemOuterView">

                            <View id="savedFoodItemInnerView" style={styles.savedFoodItemModal}>

                                <Text id="savedFoodItemText" style={styles.savedFoodItemText}>
                                    Food Item Saved!
                                </Text>
                            </View>

                        </View>

                    </Modal>
                )}

            </ScrollView>

        </View>
    )

}