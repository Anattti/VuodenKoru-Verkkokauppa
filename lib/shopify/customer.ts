import { getSession } from './auth';

const SHOP_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID;
const API_VERSION = '2024-10';

export interface CustomerProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  emailAddress?: {
    emailAddress: string;
  };
}

export interface CustomerOrder {
  id: string;
  name: string;
  processedAt: string;
  statusPageUrl: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        title: string;
        quantity: number;
        image?: {
          url: string;
          altText?: string;
        };
      };
    }>;
  };
}

/**
 * Fetcher for the Shopify Customer Account API.
 */
async function customerAccountFetch<T>({
  query,
  variables = {}
}: {
  query: string;
  variables?: Record<string, unknown>;
}): Promise<T> {
  const session = await getSession();

  if (!session) {
    throw new Error('Customer is not authenticated');
  }

  if (!SHOP_ID) {
    throw new Error('Missing SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID');
  }

  const endpoint = `https://shopify.com/authentication/${SHOP_ID}/account/api/${API_VERSION}/graphql.json`;

  const response = await fetch(endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': session.accessToken,
    },
    body: JSON.stringify({ query, variables }),
  });

  const json = await response.json();

  if (json.errors) {
    console.error('Customer Account API Error:', json.errors);
    throw new Error(json.errors[0]?.message || 'Unknown Customer Account API error');
  }

  return json.data;
}

/**
 * Gets the customer's profile.
 */
export async function getCustomerProfile(): Promise<CustomerProfile | null> {
  const query = `
    query getCustomerProfile {
      customer {
        id
        firstName
        lastName
        emailAddress {
          emailAddress
        }
      }
    }
  `;

  try {
    const data = await customerAccountFetch<{ customer: CustomerProfile }>({ query });
    return data.customer;
  } catch (error) {
    console.error('Failed to fetch customer profile:', error);
    return null;
  }
}

/**
 * Gets the customer's orders.
 */
export async function getCustomerOrders(): Promise<CustomerOrder[]> {
  const query = `
    query getCustomerOrders {
      customer {
        orders(first: 20) {
          edges {
            node {
              id
              name
              processedAt
              statusPageUrl
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 50) {
                edges {
                  node {
                    title
                    quantity
                    image {
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
  `;

  try {
    const data = await customerAccountFetch<{ customer: { orders: { edges: Array<{ node: CustomerOrder }> } } }>({ query });
    return data.customer.orders.edges.map(edge => edge.node);
  } catch (error) {
    console.error('Failed to fetch customer orders:', error);
    return [];
  }
}
