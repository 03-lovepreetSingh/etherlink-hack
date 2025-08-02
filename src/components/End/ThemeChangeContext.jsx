'use client'
/* eslint-disable react/prop-types */
import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
    const [isThemeDark, setIsThemeDark] = useState(true);
    const [isLoaded, setIsLoaded] = useState(false);

    return (
        <ThemeContext.Provider value={{ isThemeDark, setIsThemeDark, isLoaded, setIsLoaded }}>
            {children}
        </ThemeContext.Provider>
    );
};

export const useThemeChange = () => useContext(ThemeContext);
