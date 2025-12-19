import { ShopifyProduct, ShopifyCart, ShopifyCollection, CartLineUpdateInput, CartLinesUpdatePayload } from './types';

const domain = process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN?.replace(/^https?:\/\//, '').replace(/\/$/, '');
const storefrontAccessToken = process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_ACCESS_TOKEN;
const endpoint = `https://${domain}/api/2024-10/graphql.json`;

if (!domain || !storefrontAccessToken) {
  console.warn('Shopify Storefront API credentials are missing. Please check .env.local');
}

// GraphQL fetcher
async function shopifyFetch<T>({
  query,
  variables = {}
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  if (!domain || !storefrontAccessToken) {
    throw new Error('Missing Shopify API credentials');
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5s timeout

    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': storefrontAccessToken,
      },
      body: JSON.stringify({ query, variables }),
      signal: controller.signal
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('401 Unauthorized: Tarkista API-avain. Varmista, että käytät "Storefront API Access Token" -avainta, ETKÄ Admin API -avainta.');
      }
      throw new Error(`HTTP Error: ${response.status} ${response.statusText}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error('Shopify API Error:', json.errors);
      throw new Error(json.errors[0]?.message || 'Unknown Shopify API error');
    }

    return json.data;
  } catch (error) {
    console.error('Fetch error:', error);
    throw error;
  }
}

// Get all products
export async function getProducts(): Promise<ShopifyProduct[]> {
  const query = `
    query getProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            descriptionHtml
            tags
            productType
            availableForSale
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
              maxVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 5) {
              edges {
                node {
                  url
                  altText
                  width
                  height
                }
              }
            }
            media(first: 10) {
              edges {
                node {
                  ... on MediaImage {
                    id
                    mediaContentType
                    image {
                      url
                      width
                      height
                    }
                    previewImage {
                      url
                      altText
                    }
                  }
                  ... on Model3d {
                    id
                    mediaContentType
                    sources {
                      url
                      mimeType
                      format
                      filesize
                    }
                    previewImage {
                      url
                      altText
                    }
                  }
                }
              }
            }
            variants(first: 10) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>({
    query,
    variables: { first: 50 },
  });

  return data.products.edges.map(edge => edge.node);
}

// Get all collections
export async function getCollections(): Promise<ShopifyCollection[]> {
  const query = `
    query getCollections {
      collections(first: 10) {
        edges {
          node {
            id
            title
            handle
            description
            products(first: 5) {
              edges {
                node {
                  id
                  title
                  handle
                  priceRange {
                    minVariantPrice {
                      amount
                      currencyCode
                    }
                  }
                  images(first: 1) {
                    edges {
                      node {
                        url
                        altText
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ collections: { edges: Array<{ node: ShopifyCollection }> } }>({
    query,
  });

  return data.collections.edges.map(edge => edge.node);
}

// Get single product by handle
export async function getProductByHandle(handle: string): Promise<ShopifyProduct | null> {
  const query = `
    query getProductByHandle($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        handle
        description
        descriptionHtml
        tags
        productType
        availableForSale
        priceRange {
          minVariantPrice {
            amount
            currencyCode
          }
          maxVariantPrice {
            amount
            currencyCode
          }
        }
        images(first: 10) {
          edges {
            node {
              url
              altText
              width
              height
            }
          }
        }
        media(first: 10) {
          edges {
            node {
              ... on MediaImage {
                id
                mediaContentType
                image {
                  url
                  width
                  height
                }
                previewImage {
                  url
                  altText
                }
              }
              ... on Model3d {
                id
                mediaContentType
                sources {
                  url
                  mimeType
                  format
                  filesize
                }
                previewImage {
                  url
                  altText
                }
              }
            }
          }
        }
        variants(first: 50) {
          edges {
            node {
              id
              title
              availableForSale
              price {
                amount
                currencyCode
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ productByHandle: ShopifyProduct | null }>({
    query,
    variables: { handle },
  });

  return data.productByHandle;
}

// Get products from collection (or recent products)
export async function getCollectionProducts({ collection, first = 4 }: { collection: string, first?: number }): Promise<ShopifyProduct[]> {
  const query = `
      query getProducts($first: Int!) {
        products(first: $first) {
          edges {
            node {
              id
              title
              handle
              description
              descriptionHtml
              tags
              productType
              availableForSale
              priceRange {
                minVariantPrice {
                  amount
                  currencyCode
                }
                maxVariantPrice {
                  amount
                  currencyCode
                }
              }
              images(first: 5) {
                edges {
                  node {
                    url
                    altText
                    width
                    height
                  }
                }
              }
              media(first: 5) {
                edges {
                  node {
                    ... on MediaImage {
                      id
                      mediaContentType
                      image {
                        url
                        width
                        height
                      }
                      previewImage {
                        url
                        altText
                      }
                    }
                    ... on Model3d {
                      id
                      mediaContentType
                      sources {
                        url
                        mimeType
                        format
                        filesize
                      }
                      previewImage {
                        url
                        altText
                      }
                    }
                  }
                }
              }
              variants(first: 10) {
                edges {
                  node {
                    id
                    title
                    availableForSale
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    `;
  // Note: For simplicity in this demo, we're just fetching products instead of a specific collection
  // In a real app, this would query a specific collection handle

  const data = await shopifyFetch<{ products: { edges: Array<{ node: ShopifyProduct }> } }>({
    query,
    variables: { first },
  });

  return data.products.edges.map(edge => edge.node);
}

// Create a cart
export async function createCart(): Promise<ShopifyCart> {
  const query = `
    mutation cartCreate {
      cartCreate {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      id
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ cartCreate: { cart: ShopifyCart } }>({ query });
  return data.cartCreate.cart;
}

// Add item to cart
export async function addToCart(
  cartId: string,
  variantId: string,
  quantity: number = 1
): Promise<ShopifyCart> {
  const query = `
    mutation cartLinesAdd($cartId: ID!, $lines: [CartLineInput!]!) {
      cartLinesAdd(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      id
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ cartLinesAdd: { cart: ShopifyCart } }>({
    query,
    variables: {
      cartId,
      lines: [{ merchandiseId: variantId, quantity }],
    },
  });

  return data.cartLinesAdd.cart;
}

// Remove item from cart
export async function removeFromCart(
  cartId: string,
  lineId: string
): Promise<ShopifyCart> {
  const query = `
    mutation cartLinesRemove($cartId: ID!, $lineIds: [ID!]!) {
      cartLinesRemove(cartId: $cartId, lineIds: $lineIds) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      id
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ cartLinesRemove: { cart: ShopifyCart } }>({
    query,
    variables: { cartId, lineIds: [lineId] },
  });

  return data.cartLinesRemove.cart;
}

// Get cart
export async function getCart(cartId: string): Promise<ShopifyCart | null> {
  const query = `
    query cart($cartId: ID!) {
      cart(id: $cartId) {
        id
        checkoutUrl
        totalQuantity
        cost {
          totalAmount {
            amount
            currencyCode
          }
        }
        lines(first: 100) {
          edges {
            node {
              id
              quantity
              merchandise {
                ... on ProductVariant {
                  id
                  title
                  product {
                    id
                    title
                    handle
                    images(first: 1) {
                      edges {
                        node {
                          url
                          altText
                        }
                      }
                    }
                  }
                  price {
                    amount
                    currencyCode
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{ cart: ShopifyCart | null }>({
    query,
    variables: { cartId },
  });

  return data.cart;
}

// Update cart lines (quantity changes) - Shopify Storefront API 2024-10
export async function updateCartLines(
  cartId: string,
  lines: CartLineUpdateInput[]
): Promise<{ cart: ShopifyCart | null; userErrors: Array<{ field: string[] | null; message: string }>; warnings: Array<{ code: string; message: string }> }> {
  const query = `
    mutation cartLinesUpdate($cartId: ID!, $lines: [CartLineUpdateInput!]!) {
      cartLinesUpdate(cartId: $cartId, lines: $lines) {
        cart {
          id
          checkoutUrl
          totalQuantity
          cost {
            totalAmount {
              amount
              currencyCode
            }
          }
          lines(first: 100) {
            edges {
              node {
                id
                quantity
                merchandise {
                  ... on ProductVariant {
                    id
                    title
                    product {
                      id
                      title
                      handle
                      images(first: 1) {
                        edges {
                          node {
                            url
                            altText
                          }
                        }
                      }
                    }
                    price {
                      amount
                      currencyCode
                    }
                  }
                }
              }
            }
          }
        }
        userErrors {
          field
          message
        }
        warnings {
          code
          message
        }
      }
    }
  `;

  const data = await shopifyFetch<{ cartLinesUpdate: CartLinesUpdatePayload }>({
    query,
    variables: {
      cartId,
      lines: lines.map(line => ({
        id: line.id,
        quantity: line.quantity,
      })),
    },
  });

  return {
    cart: data.cartLinesUpdate.cart,
    userErrors: data.cartLinesUpdate.userErrors,
    warnings: data.cartLinesUpdate.warnings,
  };
}

// Helper: Format price for display
export function formatPrice(amount: string, currencyCode: string = 'EUR'): string {
  return new Intl.NumberFormat('fi-FI', {
    style: 'currency',
    currency: currencyCode,
  }).format(parseFloat(amount));
}

// Export mock status for UI
export const isMockMode = false;
