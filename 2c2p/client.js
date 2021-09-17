import { getCheckoutPaymentUrl } from './2c2p-sdk.js';

async function run() {
    const checkoutPayload = {
        "invoiceNo": "PSUV-dBPMQWYFFLtoBZU6HBAcyD",       // booking.reserve_number
        "description": "Sinopharm + Moderna",         // booking.order_vaccine_product_name
        "amount": 10500,               // booking.order_total_price
        "currencyCode": "THB",
        // 255 chars 
        "userDefined1": "446",           // booking.id
        "userDefined2": "2",            // booking.order_vaccine_product_id
        "userDefined3": "PSUV",         // booking.preferred_hospital
    }

    try {
        const checkoutPaymentUrl = await getCheckoutPaymentUrl(checkoutPayload);
        console.log(checkoutPaymentUrl)
    }
    catch (err) {
        console.error(err);
    }
}

run();