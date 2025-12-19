"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode, useRef } from 'react';
import { ShopifyProduct, ShopifyCart } from '@/lib/shopify/types';
import {
    createCart,
    addToCart as addToCartAPI,
    removeFromCart as removeFromCartAPI,
    updateCartLines,
    getCart,
    formatPrice,
    isMockMode
} from '@/lib/shopify';

// Helper to map Shopify cart lines to valid CartItems
const mapCartToItems = (cart: ShopifyCart): CartItem[] => {
    return cart.lines.edges.map(({ node }) => ({
        id: node.id,
        variantId: node.merchandise.id,
        productId: node.merchandise.product.id,
        title: node.merchandise.product.title,
        variantTitle: node.merchandise.title === 'Default Title' ? '' : node.merchandise.title,
        quantity: node.quantity,
        price: node.merchandise.price.amount,
        currencyCode: node.merchandise.price.currencyCode,
        imageUrl: node.merchandise.product.images.edges[0]?.node.url || '',
        imageAlt: node.merchandise.product.images.edges[0]?.node.altText || null,
        handle: node.merchandise.product.handle,
    }));
};

interface CartItem {
    id: string;
    variantId: string;
    productId: string;
    title: string;
    variantTitle: string;
    quantity: number;
    price: string;
    currencyCode: string;
    imageUrl: string;
    imageAlt: string | null;
    handle: string;
}

interface CartContextType {
    items: CartItem[];
    isOpen: boolean;
    isLoading: boolean;
    isInitializing: boolean;
    cartCount: number;
    cartTotal: string;
    isMock: boolean;
    openCart: () => void;
    closeCart: () => void;
    toggleCart: () => void;
    addItem: (product: ShopifyProduct, variantId?: string) => Promise<void>;
    removeItem: (itemId: string) => Promise<void>;
    updateQuantity: (itemId: string, quantity: number) => Promise<void>;
    clearCart: () => void;
    checkoutUrl: string | null;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'shopify-cart';

export function CartProvider({ children }: { children: ReactNode }) {
    const [items, setItems] = useState<CartItem[]>([]);
    const [isOpen, setIsOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [isInitializing, setIsInitializing] = useState(true);
    const [cartId, setCartId] = useState<string | null>(null);
    const [checkoutUrl, setCheckoutUrl] = useState<string | null>(null);
    const hasInitialized = useRef(false);

    // Validate and sync cart with Shopify on mount
    const validateAndSyncCart = useCallback(async (storedCartId: string, storedItems: CartItem[], storedCheckoutUrl: string | null) => {
        if (isMockMode) {
            // In mock mode, just load from localStorage
            setItems(storedItems);
            setCartId(storedCartId);
            setCheckoutUrl(storedCheckoutUrl);
            setIsInitializing(false);
            return;
        }

        try {
            const cart = await getCart(storedCartId);
            if (cart) {
                // Cart is valid, sync state from Shopify (source of truth)
                setCartId(cart.id);
                setItems(mapCartToItems(cart));
                setCheckoutUrl(cart.checkoutUrl);
            } else {
                // Cart expired or invalid (10-day expiration)
                console.info('Ostoskori vanhentunut, tyhjennetään paikallinen tila');
                setItems([]);
                setCartId(null);
                setCheckoutUrl(null);
                localStorage.removeItem(CART_STORAGE_KEY);
            }
        } catch (error) {
            console.error('Ostoskorin validointi epäonnistui:', error);
            // On error, use local state as fallback
            setItems(storedItems);
            setCartId(storedCartId);
            setCheckoutUrl(storedCheckoutUrl);
        } finally {
            setIsInitializing(false);
        }
    }, []);

    // Load and validate cart from localStorage on mount
    useEffect(() => {
        if (hasInitialized.current) return;
        hasInitialized.current = true;

        const stored = localStorage.getItem(CART_STORAGE_KEY);
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                if (parsed.cartId) {
                    // Validate with Shopify
                    validateAndSyncCart(parsed.cartId, parsed.items || [], parsed.checkoutUrl || null);
                } else {
                    setIsInitializing(false);
                }
            } catch {
                console.error('Tallennetun ostoskorin jäsennys epäonnistui');
                setIsInitializing(false);
            }
        } else {
            setIsInitializing(false);
        }
    }, [validateAndSyncCart]);

    // Save cart to localStorage whenever it changes
    useEffect(() => {
        if (isInitializing) return;

        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify({
            items,
            cartId,
            checkoutUrl,
        }));
    }, [items, cartId, checkoutUrl, isInitializing]);

    const cartCount = items.reduce((sum, item) => sum + item.quantity, 0);

    const cartTotal = formatPrice(
        items.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0).toFixed(2)
    );

    const openCart = useCallback(() => setIsOpen(true), []);
    const closeCart = useCallback(() => setIsOpen(false), []);
    const toggleCart = useCallback(() => setIsOpen(prev => !prev), []);

    const addItem = useCallback(async (product: ShopifyProduct, variantId?: string) => {
        setIsLoading(true);
        try {
            const variant = variantId
                ? product.variants.edges.find(e => e.node.id === variantId)?.node
                : product.variants.edges[0]?.node;

            if (!variant) {
                throw new Error('No variant found');
            }

            // Optimistic update for immediate UI feedback
            const existingIndex = items.findIndex(item => item.variantId === variant.id);
            const previousItems = [...items];

            if (existingIndex >= 0) {
                setItems(prev => prev.map((item, i) =>
                    i === existingIndex
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                ));
            } else {
                const newItem: CartItem = {
                    id: `temp-${Date.now()}`, // Temporary ID, will be replaced by Shopify
                    variantId: variant.id,
                    productId: product.id,
                    title: product.title,
                    variantTitle: variant.title !== 'Default Title' ? variant.title : '',
                    quantity: 1,
                    price: variant.price.amount,
                    currencyCode: variant.price.currencyCode,
                    imageUrl: product.images.edges[0]?.node.url || '',
                    imageAlt: product.images.edges[0]?.node.altText || product.title,
                    handle: product.handle,
                };
                setItems(prev => [...prev, newItem]);
            }

            // Sync with Shopify
            if (!isMockMode) {
                try {
                    let currentCartId = cartId;
                    if (!currentCartId) {
                        const cart = await createCart();
                        currentCartId = cart.id;
                        setCartId(cart.id);
                    }
                    const updatedCart = await addToCartAPI(currentCartId, variant.id, 1);
                    setCheckoutUrl(updatedCart.checkoutUrl);
                    setItems(mapCartToItems(updatedCart));
                } catch (error) {
                    // Rollback on error
                    setItems(previousItems);
                    throw error;
                }
            } else {
                setCheckoutUrl('#mock-checkout');
            }

            // Open cart drawer
            setIsOpen(true);
        } catch (error) {
            console.error('Failed to add item:', error);
        } finally {
            setIsLoading(false);
        }
    }, [items, cartId]);

    const removeItem = useCallback(async (itemId: string) => {
        setIsLoading(true);
        const previousItems = [...items];

        try {
            // Optimistic update
            setItems(prev => prev.filter(item => item.id !== itemId));

            // Sync with Shopify
            if (!isMockMode && cartId) {
                try {
                    const updatedCart = await removeFromCartAPI(cartId, itemId);
                    setItems(mapCartToItems(updatedCart));
                    setCheckoutUrl(updatedCart.checkoutUrl);
                } catch (error) {
                    // Rollback on error
                    setItems(previousItems);
                    throw error;
                }
            }
        } catch (error) {
            console.error('Failed to remove item:', error);
        } finally {
            setIsLoading(false);
        }
    }, [cartId, items]);

    const updateQuantity = useCallback(async (itemId: string, quantity: number) => {
        if (quantity <= 0) {
            return removeItem(itemId);
        }

        setIsLoading(true);
        const previousItems = [...items];

        try {
            // Optimistic update
            setItems(prev => prev.map(item =>
                item.id === itemId ? { ...item, quantity } : item
            ));

            // Sync with Shopify using cartLinesUpdate mutation
            if (!isMockMode && cartId) {
                try {
                    const result = await updateCartLines(cartId, [{ id: itemId, quantity }]);

                    // Check for userErrors
                    if (result.userErrors && result.userErrors.length > 0) {
                        const errorMessage = result.userErrors[0].message;
                        console.error('Cart update error:', errorMessage);
                        setItems(previousItems);
                        return;
                    }

                    // Log warnings if any
                    if (result.warnings && result.warnings.length > 0) {
                        result.warnings.forEach(warning => {
                            console.warn(`Cart warning [${warning.code}]: ${warning.message}`);
                        });
                    }

                    if (result.cart) {
                        setItems(mapCartToItems(result.cart));
                        setCheckoutUrl(result.cart.checkoutUrl);
                    } else {
                        // Cart might have been deleted/expired
                        setItems(previousItems);
                        console.error('Cart no longer valid');
                    }
                } catch (error) {
                    // Rollback on error
                    setItems(previousItems);
                    throw error;
                }
            }
        } catch (error) {
            console.error('Failed to update quantity:', error);
        } finally {
            setIsLoading(false);
        }
    }, [removeItem, cartId, items]);

    const clearCart = useCallback(() => {
        setItems([]);
        setCartId(null);
        setCheckoutUrl(null);
        localStorage.removeItem(CART_STORAGE_KEY);
    }, []);

    return (
        <CartContext.Provider value={{
            items,
            isOpen,
            isLoading,
            isInitializing,
            cartCount,
            cartTotal,
            isMock: isMockMode,
            openCart,
            closeCart,
            toggleCart,
            addItem,
            removeItem,
            updateQuantity,
            clearCart,
            checkoutUrl,
        }}>
            {children}
        </CartContext.Provider>
    );
}

export function useCart() {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
}
