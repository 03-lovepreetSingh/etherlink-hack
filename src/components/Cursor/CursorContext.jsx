/* eslint-disable react/prop-types */
/* eslint-disable no-unused-vars */
import React, { createContext, useState } from 'react';

export const CursorContext = createContext();

export const CursorProvider = ({ children }) => {
    const [hover, setHover] = useState(false);

    return (
        <CursorContext.Provider value={{ hover, setHover }}>
            {children}
        </CursorContext.Provider>
    );
};
