import { getCheckoutInfo } from './2c2p-sdk.js';

async function run() {
    const checkoutPayload = {
        "invoiceNo": "PSUV-dBPMQWYFFLtoBZU6HBAcy5",       // booking.reserve_number
        "description": "Sinopharm + Moderna",         // booking.order_vaccine_product_name
        "amount": 10500,               // booking.order_total_price
        "currencyCode": "THB",
        // 255 chars 
        "userDefined1": "446",           // booking.id
        "userDefined2": "2",            // booking.order_vaccine_product_id
        "userDefined3": "PSUV",         // booking.preferred_hospital
        "paymentChannel": ["IMBANK", "WEBPAY"]
    }

    try {
        const { webPaymentUrl, paymentToken } = await getCheckoutInfo(checkoutPayload);
        console.log('webPaymentUrl:', webPaymentUrl);
        console.log('paymentToken:', paymentToken)
    }
    catch (err) {
        console.error(err);
    }
}

run();