import { getSession } from './auth';

const SHOP_ID = process.env.SHOPIFY_CUSTOMER_ACCOUNT_SHOP_ID;
const API_VERSION = '2024-10';

export interface CustomerProfile {
  id: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: {
    phoneNumber: string;
  };
  emailAddress?: {
    emailAddress: string;
  };
  defaultAddress?: CustomerAddress;
}

export interface CustomerAddress {
  id: string;
  address1: string;
  address2?: string;
  city: string;
  company?: string;
  firstName: string;
  lastName: string;
  name?: string;
  phoneNumber?: string;
  territoryCode: string;
  zip: string;
  zoneCode?: string;
}

export interface CustomerAddressInput {
  address1: string;
  address2?: string;
  city: string;
  company?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  territoryCode: string;
  zip: string;
  zoneCode?: string;
}

export interface CustomerOrder {
  id: string;
  name: string;
  processedAt: string;
  statusPageUrl: string;
  fulfillmentStatus: string;
  financialStatus: string;
  totalPrice: {
    amount: string;
    currencyCode: string;
  };
  lineItems: {
    edges: Array<{
      node: {
        name: string;
        title: string;
        quantity: number;
        image?: {
          url: string;
          altText?: string;
        };
      };
    }>;
  };
  fulfillments: {
    edges: Array<{
      node: {
        status: string;
        trackingInformation: Array<{
          number?: string;
          company?: string;
          url?: string;
        }>;
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

  const endpoint = `https://shopify.com/${SHOP_ID}/account/customer/api/${API_VERSION}/graphql.json`;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': session.accessToken,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`Customer Account API Request Failed:
        Status: ${response.status}
        StatusText: ${response.statusText}
        URL: ${endpoint}
        Body snippet: ${errorText.substring(0, 200)}
      `);
      throw new Error(`Customer Account API HTTP error: ${response.status}`);
    }

    const json = await response.json();

    if (json.errors) {
      console.error('Customer Account API GraphQL Error:', JSON.stringify(json.errors, null, 2));
      throw new Error(json.errors[0]?.message || 'Unknown Customer Account API error');
    }

    return json.data;
  } catch (error) {
    console.error('Customer Account API network/parse error:', error);
    throw error;
  }
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
        phoneNumber {
          phoneNumber
        }
        emailAddress {
          emailAddress
        }
        defaultAddress {
          id
          address1
          address2
          city
          company
          firstName
          lastName
          name
          phoneNumber
          territoryCode
          zip
          zoneCode
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
 * Gets a single order by ID.
 */
export async function getOrderDetail(orderId: string): Promise<CustomerOrder | null> {
  const query = `
    query getOrderDetail($id: ID!) {
      order(id: $id) {
        id
        name
        processedAt
        statusPageUrl
        fulfillmentStatus
        financialStatus
        totalPrice {
          amount
          currencyCode
        }
        lineItems(first: 50) {
          edges {
            node {
              name
              title
              quantity
              image {
                url
                altText
              }
            }
          }
        }
        fulfillments(first: 5) {
          edges {
            node {
              status
              trackingInformation {
                number
                company
                url
              }
            }
          }
        }
      }
    }
  `;

  try {
    const data = await customerAccountFetch<{ order: CustomerOrder }>({
      query,
      variables: { id: orderId }
    });
    return data.order;
  } catch (error) {
    console.error('Failed to fetch order detail:', error);
    return null;
  }
}

/**
 * Gets the customer's addresses.
 */
export async function getCustomerAddresses(): Promise<CustomerAddress[]> {
  const query = `
    query getCustomerAddresses {
      customer {
        addresses(first: 10) {
          nodes {
            id
            address1
            address2
            city
            company
            firstName
            lastName
            name
            phoneNumber
            territoryCode
            zip
            zoneCode
          }
        }
      }
    }
  `;

  try {
    const data = await customerAccountFetch<{ customer: { addresses: { nodes: CustomerAddress[] } } }>({ query });
    return data.customer.addresses.nodes;
  } catch (error) {
    console.error('Failed to fetch customer addresses:', error);
    return [];
  }
}

/**
 * Creates a new customer address.
 */
export async function createCustomerAddress(address: CustomerAddressInput, isDefault: boolean = false): Promise<{ address?: CustomerAddress; errors?: any[] }> {
  const query = `
    mutation customerAddressCreate($address: CustomerAddressInput!, $defaultAddress: Boolean) {
      customerAddressCreate(address: $address, defaultAddress: $defaultAddress) {
        customerAddress {
          id
          address1
          address2
          city
          company
          firstName
          lastName
          name
          phoneNumber
          territoryCode
          zip
          zoneCode
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  try {
    const data = await customerAccountFetch<{
      customerAddressCreate: {
        customerAddress: CustomerAddress;
        userErrors: any[]
      }
    }>({
      query,
      variables: { address, defaultAddress: isDefault }
    });

    if (data.customerAddressCreate.userErrors.length > 0) {
      return { errors: data.customerAddressCreate.userErrors };
    }

    return { address: data.customerAddressCreate.customerAddress };
  } catch (error) {
    console.error('Failed to create customer address:', error);
    throw error;
  }
}

/**
 * Updates an existing customer address.
 */
export async function updateCustomerAddress(addressId: string, address: CustomerAddressInput, isDefault: boolean = false): Promise<{ address?: CustomerAddress; errors?: any[] }> {
  const query = `
    mutation customerAddressUpdate($address: CustomerAddressInput!, $addressId: ID!, $defaultAddress: Boolean) {
      customerAddressUpdate(address: $address, addressId: $addressId, defaultAddress: $defaultAddress) {
        customerAddress {
          id
          address1
          address2
          city
          company
          firstName
          lastName
          name
          phoneNumber
          territoryCode
          zip
          zoneCode
        }
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  try {
    const data = await customerAccountFetch<{
      customerAddressUpdate: {
        customerAddress: CustomerAddress;
        userErrors: any[]
      }
    }>({
      query,
      variables: { address, addressId, defaultAddress: isDefault }
    });

    if (data.customerAddressUpdate.userErrors.length > 0) {
      return { errors: data.customerAddressUpdate.userErrors };
    }

    return { address: data.customerAddressUpdate.customerAddress };
  } catch (error) {
    console.error('Failed to update customer address:', error);
    throw error;
  }
}

/**
 * Deletes a customer address.
 */
export async function deleteCustomerAddress(addressId: string): Promise<{ deletedId?: string; errors?: any[] }> {
  const query = `
    mutation customerAddressDelete($addressId: ID!) {
      customerAddressDelete(addressId: $addressId) {
        deletedAddressId
        userErrors {
          field
          message
          code
        }
      }
    }
  `;

  try {
    const data = await customerAccountFetch<{
      customerAddressDelete: {
        deletedAddressId: string;
        userErrors: any[]
      }
    }>({
      query,
      variables: { addressId }
    });

    if (data.customerAddressDelete.userErrors.length > 0) {
      return { errors: data.customerAddressDelete.userErrors };
    }

    return { deletedId: data.customerAddressDelete.deletedAddressId };
  } catch (error) {
    console.error('Failed to delete customer address:', error);
    throw error;
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
              fulfillmentStatus
              financialStatus
              totalPrice {
                amount
                currencyCode
              }
              lineItems(first: 50) {
                edges {
                  node {
                    name
                    title
                    quantity
                    image {
                      url
                      altText
                    }
                  }
                }
              }
              fulfillments(first: 5) {
                edges {
                  node {
                    status
                    trackingInformation {
                      number
                      company
                      url
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
