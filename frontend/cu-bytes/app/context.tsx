import { createContext, useContext, useState, ReactNode } from 'react';

// The variable for storing the username of the logged-in user
// and the setter for setting the value of the username
type UserContextType = {
    user: string;
    setUser: (user: string) => void;
}

// Create the state that will be used to store the username of the logged-in user
// and share this state across the different components (pages represented by the tsx files)
const UserContext = createContext<UserContextType | undefined>(undefined);

// Set up a component that can accept child components (tsx files)
// and pass on a variable and its setter to these child components
export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState('');

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

// The component that the child components (tsx files) use to access the state
export const useUser = () => {
    const context = useContext(UserContext);

    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }

    return context;
}
