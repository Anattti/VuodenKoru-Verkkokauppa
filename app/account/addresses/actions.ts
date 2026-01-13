'use server';

import {
    createCustomerAddress,
    updateCustomerAddress,
    deleteCustomerAddress,
    CustomerAddressInput
} from "@/lib/shopify/customer";
import { revalidatePath } from "next/cache";

export async function createAddressAction(formData: FormData) {
    const isDefault = formData.get('isDefault') === 'on';

    const address: CustomerAddressInput = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        company: formData.get('company') as string || undefined,
        address1: formData.get('address1') as string,
        address2: formData.get('address2') as string || undefined,
        city: formData.get('city') as string,
        zip: formData.get('zip') as string,
        territoryCode: formData.get('territoryCode') as string, // ISO code e.g. 'FI'
        phoneNumber: formData.get('phoneNumber') as string || undefined,
    };

    try {
        const result = await createCustomerAddress(address, isDefault);
        revalidatePath('/account');
        revalidatePath('/account/addresses');
        return result;
    } catch (error) {
        console.error('Action error creating address:', error);
        return { errors: [{ message: 'Osoitteen luominen epäonnistui.' }] };
    }
}

export async function updateAddressAction(addressId: string, formData: FormData) {
    const isDefault = formData.get('isDefault') === 'on';

    const address: CustomerAddressInput = {
        firstName: formData.get('firstName') as string,
        lastName: formData.get('lastName') as string,
        company: formData.get('company') as string || undefined,
        address1: formData.get('address1') as string,
        address2: formData.get('address2') as string || undefined,
        city: formData.get('city') as string,
        zip: formData.get('zip') as string,
        territoryCode: formData.get('territoryCode') as string,
        phoneNumber: formData.get('phoneNumber') as string || undefined,
    };

    try {
        const result = await updateCustomerAddress(addressId, address, isDefault);
        revalidatePath('/account');
        revalidatePath('/account/addresses');
        return result;
    } catch (error) {
        console.error('Action error updating address:', error);
        return { errors: [{ message: 'Osoitteen päivittäminen epäonnistui.' }] };
    }
}

export async function deleteAddressAction(addressId: string) {
    try {
        const result = await deleteCustomerAddress(addressId);
        revalidatePath('/account');
        revalidatePath('/account/addresses');
        return result;
    } catch (error) {
        console.error('Action error deleting address:', error);
        return { errors: [{ message: 'Osoitteen poistaminen epäonnistui.' }] };
    }
}
