import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

const CartContext = createContext();

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within CartProvider');
    }
    return context;
};

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        // Load cart from localStorage
        const savedCart = localStorage.getItem('cart');
        if (savedCart) {
            setCartItems(JSON.parse(savedCart));
        }
    }, []);

    useEffect(() => {
        // Save cart to localStorage
        localStorage.setItem('cart', JSON.stringify(cartItems));
    }, [cartItems]);

    const addToCart = (book) => {
        // Check if book already in cart
        const exists = cartItems.find(item => item._id === book._id);

        if (exists) {
            toast.info('Book already in cart');
            return;
        }

        setCartItems([...cartItems, book]);
        toast.success('Book added to cart');
    };

    const removeFromCart = (bookId) => {
        setCartItems(cartItems.filter(item => item._id !== bookId));
        toast.info('Book removed from cart');
    };

    const clearCart = () => {
        setCartItems([]);
        localStorage.removeItem('cart');
    };

    const getCartTotal = () => {
        return cartItems.reduce((total, item) => total + item.price, 0);
    };

    const getCartCount = () => {
        return cartItems.length;
    };

    const isInCart = (bookId) => {
        return cartItems.some(item => item._id === bookId);
    };

    const value = {
        cartItems,
        addToCart,
        removeFromCart,
        clearCart,
        getCartTotal,
        getCartCount,
        isInCart,
    };

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};
