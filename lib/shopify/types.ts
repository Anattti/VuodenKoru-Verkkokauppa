// Shopify types
export interface ShopifyProduct {
    id: string;
    title: string;
    handle: string;
    description: string;
    descriptionHtml: string;
    tags: string[];
    productType: string;
    priceRange: {
        minVariantPrice: {
            amount: string;
            currencyCode: string;
        };
        maxVariantPrice: {
            amount: string;
            currencyCode: string;
        };
    };
    media: {
        edges: Array<{
            node: ShopifyMedia;
        }>;
    };
    images: {
        edges: Array<{
            node: {
                url: string;
                altText: string | null;
                width: number;
                height: number;
            };
        }>;
    };
    options: Array<{
        id: string;
        name: string;
        values: string[];
    }>;
    variants: {
        edges: Array<{
            node: {
                id: string;
                title: string;
                availableForSale: boolean;
                selectedOptions: Array<{
                    name: string;
                    value: string;
                }>;
                price: {
                    amount: string;
                    currencyCode: string;
                };
            };
        }>;
    };
    availableForSale: boolean;
}

export interface ShopifyCollection {
    id: string;
    title: string;
    handle: string;
    description: string;
    products: {
        edges: Array<{
            node: ShopifyProduct;
        }>;
    };
}

export interface ShopifyCart {
    id: string;
    checkoutUrl: string;
    totalQuantity: number;
    cost: {
        totalAmount: {
            amount: string;
            currencyCode: string;
        };
    };
    lines: {
        edges: Array<{
            node: {
                id: string;
                quantity: number;
                merchandise: {
                    id: string;
                    title: string;
                    product: {
                        id: string;
                        title: string;
                        handle: string;
                        images: {
                            edges: Array<{
                                node: {
                                    url: string;
                                    altText: string | null;
                                };
                            }>;
                        };
                    };
                    price: {
                        amount: string;
                        currencyCode: string;
                    };
                };
            };
        }>;
    };
}

export interface CartLine {
    id: string;
    quantity: number;
    title: string;
    productTitle: string;
    productHandle: string;
    imageUrl: string;
    imageAlt: string | null;
    price: string;
    currencyCode: string;
}

export interface ShopifyMedia {
    updatedAt: any;
    id: string;
    mediaContentType: 'IMAGE' | 'VIDEO' | 'MODEL_3D' | 'EXTERNAL_VIDEO';
    alt: string | null;
    previewImage: {
        url: string;
        altText: string | null;
    };
    // Include specific fields for 3D models only when relevant
    sources?: Array<{
        url: string;
        mimeType: string;
        format: string;
        filesize: number;
    }>;
    // For images
    image?: {
        url: string;
        width: number;
        height: number;
    };
}

// Cart mutation types for Storefront API 2024-10
export interface CartUserError {
    field: string[] | null;
    message: string;
    code?: string;
}

export interface CartWarning {
    code: string;
    message: string;
}

export interface CartLineUpdateInput {
    id: string;
    quantity?: number;
    merchandiseId?: string;
    attributes?: Array<{ key: string; value: string }>;
}

export interface CartLinesUpdatePayload {
    cart: ShopifyCart | null;
    userErrors: CartUserError[];
    warnings: CartWarning[];
}
