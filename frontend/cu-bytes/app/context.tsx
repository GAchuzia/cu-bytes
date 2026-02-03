import { createContext, useContext, useState, ReactNode } from 'react';

/*
    Define the context
    Define the variables and setters used to store and modify a copy of the logged-in user's username and profile settings
*/
type UserContextType = {

    usernameGlobal: string;
    setUsernameGlobal: (usernameGlobal: string) => void;
    hasConfiguredSettingsGlobal: boolean;
    setHasConfiguredSettingsGlobal: (hasConfiguredSettingsGlobal: boolean) => void;
    showStatsGlobal: boolean;
    setShowStatsGlobal: (showStatsGlobal: boolean) => void;
    hasEggAllergyGlobal: boolean;
    setHasEggAllergyGlobal: (hasEggAllergyGlobal: boolean) => void;
    hasFishOrShellfishAllergyGlobal: boolean; 
    setHasFishOrShellfishAllergyGlobal: (hasFishOrShellfishAllergyGlobal: boolean) => void;
    hasDairyIntoleranceGlobal: boolean;
    setHasDairyIntoleranceGlobal: (hasDairyIntoleranceGlobal: boolean) => void;
    hasMilkAllergyGlobal: boolean;
    setHasMilkAllergyGlobal: (hasMilkAllergyGlobal: boolean) => void;
    hasPeanutAllergyGlobal: boolean;
    setHasPeanutAllergyGlobal: (hasPeanutAllergyGlobal: boolean) => void;
    hasSesameAllergyGlobal: boolean;
    setHasSesameAllergyGlobal: (HasSesameAllergyGlobal: boolean) => void;
    hasSoyAllergyGlobal: boolean;
    setHasSoyAllergyGlobal: (hasSoyAllergyGlobal: boolean) => void;
    hasTreenutAllergyGlobal: boolean;
    setHasTreenutAllergyGlobal: (hasTreenutAllergyGlobal: boolean) => void;
    hasWheatAllergyGlobal: boolean;
    setHasWheatAllergyGlobal: (hasWheatAllergyGlobal: boolean) => void;
    hasGlutenAllergyGlobal: boolean;
    setHasGlutenAllergyGlobal: (hasGlutenAllergyGlobal: boolean) => void;
    isVeganGlobal: boolean;
    setIsVeganGlobal: (isVeganGlobal: boolean) => void;
    isVegetarianGlobal: boolean;
    setIsVegetarianGlobal: (isVegetarianGlobal: boolean) => void;
    prefersHalalGlobal: boolean;
    setPrefersHalalGlobal: (setPrefersHalalGlobal: boolean) => void;
}

/*
    Create a copy of the context and store it in a variable
*/
const UserContext = createContext<UserContextType | undefined>(undefined);

/*
    Export the component that enables child components (the frontend pages / tsx files) to access or update the state
*/
export const UserProvider = ({ children }: { children: ReactNode }) => {

    const [usernameGlobal, setUsernameGlobal] = useState('');
    const [hasConfiguredSettingsGlobal, setHasConfiguredSettingsGlobal] = useState(false); 
    const [showStatsGlobal, setShowStatsGlobal] = useState(false);
    const [hasEggAllergyGlobal, setHasEggAllergyGlobal] = useState(false);
    const [hasFishOrShellfishAllergyGlobal, setHasFishOrShellfishAllergyGlobal] = useState(false);
    const [hasDairyIntoleranceGlobal, setHasDairyIntoleranceGlobal] = useState(false);
    const [hasMilkAllergyGlobal, setHasMilkAllergyGlobal] = useState(false);
    const [hasPeanutAllergyGlobal, setHasPeanutAllergyGlobal] = useState(false);
    const [hasSesameAllergyGlobal, setHasSesameAllergyGlobal] = useState(false);
    const [hasSoyAllergyGlobal, setHasSoyAllergyGlobal] = useState(false);
    const [hasTreenutAllergyGlobal, setHasTreenutAllergyGlobal] = useState(false);
    const [hasWheatAllergyGlobal, setHasWheatAllergyGlobal] = useState(false);
    const [hasGlutenAllergyGlobal, setHasGlutenAllergyGlobal] = useState(false);
    const [isVeganGlobal, setIsVeganGlobal] = useState(false);
    const [isVegetarianGlobal, setIsVegetarianGlobal] = useState(false);
    const [prefersHalalGlobal, setPrefersHalalGlobal] = useState(false);

    return (
        <UserContext.Provider 
            value={
                {
                    usernameGlobal,
                    setUsernameGlobal,
                    hasConfiguredSettingsGlobal,
                    setHasConfiguredSettingsGlobal,
                    showStatsGlobal,
                    setShowStatsGlobal,
                    hasEggAllergyGlobal,
                    setHasEggAllergyGlobal,
                    hasFishOrShellfishAllergyGlobal,
                    setHasFishOrShellfishAllergyGlobal,
                    hasDairyIntoleranceGlobal,
                    setHasDairyIntoleranceGlobal,
                    hasMilkAllergyGlobal,
                    setHasMilkAllergyGlobal,
                    hasPeanutAllergyGlobal,
                    setHasPeanutAllergyGlobal,
                    hasSesameAllergyGlobal,
                    setHasSesameAllergyGlobal,
                    hasSoyAllergyGlobal,
                    setHasSoyAllergyGlobal,
                    hasTreenutAllergyGlobal,
                    setHasTreenutAllergyGlobal,
                    hasWheatAllergyGlobal,
                    setHasWheatAllergyGlobal,
                    hasGlutenAllergyGlobal,
                    setHasGlutenAllergyGlobal,
                    isVeganGlobal,
                    setIsVeganGlobal,
                    isVegetarianGlobal,
                    setIsVegetarianGlobal,
                    prefersHalalGlobal,
                    setPrefersHalalGlobal
                }
            }
        >
            {children}
        </UserContext.Provider>
    );
};

/*
    Export the component that child components (the frontend pages / tsx files) use to access or update the state
*/
export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) { throw new Error('useUser must be used within a UserProvider'); }

    return context;
}