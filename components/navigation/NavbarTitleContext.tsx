"use client";
import React, { createContext, useContext, useState, ReactNode } from 'react';

type NavbarTitleContextType = {
    title: string;
    setTitle: (title: string) => void;
    isHidden: boolean;
    setHidden: (hidden: boolean) => void;
};

const NavbarTitleContext = createContext<NavbarTitleContextType | undefined>(undefined);

export const NavbarTitleProvider = ({ children }: { children: ReactNode }) => {
    const [title, setTitle] = useState("");
    const [isHidden, setHidden] = useState(false);

    return (
        <NavbarTitleContext.Provider value={{ title, setTitle, isHidden, setHidden }}>
            {children}
        </NavbarTitleContext.Provider>
    );
};

export const useNavbarTitle = () => {
    const context = useContext(NavbarTitleContext);
    if (!context) {
        throw new Error('useNavbarTitle must be used within a NavbarTitleProvider');
    }
    return context;
};
