"use client";
import { useEffect } from 'react';
import { useNavbarTitle } from './NavbarTitleContext';

export default function SetNavbarTitle({ title }: { title: string }) {
    const { setTitle } = useNavbarTitle();

    useEffect(() => {
        // Only set title if it's different to avoid loops/unnecessary updates
        // Use a small timeout to ensure it runs after mount if needed, or just run direct
        setTitle(title);

        // Reset on unmount
        return () => setTitle("");
    }, [title, setTitle]);

    return null;
}
