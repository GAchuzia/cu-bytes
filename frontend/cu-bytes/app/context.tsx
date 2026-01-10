import { createContext, useContext, useState, ReactNode } from 'react';

// The variable for storing the profile of the logged-in user
// and the setter for setting the values of the profile
type UserContextType = {

    usernameGlobal: string;
    setUsernameGlobal: (usernameGlobal: string) => void;
    hasConfiguredSettingsGlobal: boolean;
    setHasConfiguredSettingsGlobal: (hasConfiguredSettingsGlobal: boolean) => void;
    showStatsGlobal: boolean;
    setShowStatsGlobal: (showStatsGlobal: boolean) => void;
    hasEggAllergyGlobal: boolean;
    setHasEggAllergyGlobal: (hasEggAllergyGlobal: boolean) => void;
    hasDairyIntoleranceGlobal: boolean;
    setHasDairyIntoleranceGlobal: (hasDairyIntoleranceGlobal: boolean) => void;
    hasPeanutAllergyGlobal: boolean;
    setHasPeanutAllergyGlobal: (hasPeanutAllergyGlobal: boolean) => void;
    hasSesameAllergyGlobal: boolean;
    setHasSesameAllergyGlobal: (HasSesameAllergyGlobal: boolean) => void;
    hasShellfishAllergyGlobal: boolean;
    setHasShellfishAllergyGlobal: (HasShellfishAllergyGlobal: boolean) => void;
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
    prefersKosherGlobal: boolean;
    setPrefersKosherGlobal: (prefersKosherGlobal: boolean) => void;
    prefersHalalGlobal: boolean;
    setPrefersHalalGlobal: (setPrefersHalalGlobal: boolean) => void;
}

// Create the state that will be used to store the profile of the logged-in user
// and share this state across the different components (pages represented by the tsx files)
const UserContext = createContext<UserContextType | undefined>(undefined);

// Set up a component that can accept child components (tsx files)
// and pass on a variable and its setter to these child components
export const UserProvider = ({ children }: { children: ReactNode }) => {

    const [usernameGlobal, setUsernameGlobal] = useState('');
    const [hasConfiguredSettingsGlobal, setHasConfiguredSettingsGlobal] = useState(false);
    const [showStatsGlobal, setShowStatsGlobal] = useState(false);
    const [hasEggAllergyGlobal, setHasEggAllergyGlobal] = useState(false);
    const [hasDairyIntoleranceGlobal, setHasDairyIntoleranceGlobal] = useState(false);
    const [hasPeanutAllergyGlobal, setHasPeanutAllergyGlobal] = useState(false);
    const [hasSesameAllergyGlobal, setHasSesameAllergyGlobal] = useState(false);
    const [hasShellfishAllergyGlobal, setHasShellfishAllergyGlobal] = useState(false);
    const [hasSoyAllergyGlobal, setHasSoyAllergyGlobal] = useState(false);
    const [hasTreenutAllergyGlobal, setHasTreenutAllergyGlobal] = useState(false);
    const [hasWheatAllergyGlobal, setHasWheatAllergyGlobal] = useState(false);
    const [hasGlutenAllergyGlobal, setHasGlutenAllergyGlobal] = useState(false);
    const [isVeganGlobal, setIsVeganGlobal] = useState(false);
    const [isVegetarianGlobal, setIsVegetarianGlobal] = useState(false);
    const [prefersKosherGlobal, setPrefersKosherGlobal] = useState(false);
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
                    hasDairyIntoleranceGlobal,
                    setHasDairyIntoleranceGlobal,
                    hasPeanutAllergyGlobal,
                    setHasPeanutAllergyGlobal,
                    hasSesameAllergyGlobal,
                    setHasSesameAllergyGlobal,
                    hasShellfishAllergyGlobal,
                    setHasShellfishAllergyGlobal,
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
                    prefersKosherGlobal,
                    setPrefersKosherGlobal,
                    prefersHalalGlobal,
                    setPrefersHalalGlobal
                }
            }
        >
            {children}
        </UserContext.Provider>
    );
};

// The component that the child components (tsx files) use to access the state
export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) { throw new Error('useUser must be used within a UserProvider'); }

    return context;
}