import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        try {
            const saved = localStorage.getItem('ar_cart');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    
    const [isCartOpen, setIsCartOpen] = useState(false);

    useEffect(() => {
        localStorage.setItem('ar_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (art) => {
        setCart(prev => {
            if (prev.find(item => item.id === art.id)) return prev;
            return [...prev, art];
        });
        setIsCartOpen(true);
    };

    const removeFromCart = (id) => {
        setCart(prev => prev.filter(item => item.id !== id));
    };

    const clearCart = () => setCart([]);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, isCartOpen, setIsCartOpen }}>
            {children}
        </CartContext.Provider>
    );
};
