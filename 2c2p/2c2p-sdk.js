import axios from 'axios';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const PAYMENT_GATEWAY_2C2P_API_URL = process.env.PAYMENT_GATEWAY_2C2P_API_URL;
const PAYMENT_GATEWAY_2C2P_API_SECRET = process.env.PAYMENT_GATEWAY_2C2P_API_SECRET;
const PAYMENT_GATEWAY_2C2P_API_MERCHANT_ID = process.env.PAYMENT_GATEWAY_2C2P_API_MERCHANT_ID;

export async function getCheckoutPaymentUrl(checkoutPayload) {
    checkoutPayload.merchantID = PAYMENT_GATEWAY_2C2P_API_MERCHANT_ID;

    try {
        const requestToken = jwt.sign(checkoutPayload, PAYMENT_GATEWAY_2C2P_API_SECRET)
        const responseToken = await getPaymentToken(requestToken);
        const { webPaymentUrl } = jwt.decode(responseToken, PAYMENT_GATEWAY_2C2P_API_SECRET);
        return webPaymentUrl;
    } catch (err) {
        throw new Error('getCheckoutPaymentUrl: ' + err)
    }
}

async function getPaymentToken(requestToken) {

    const response = await axios.post(`${PAYMENT_GATEWAY_2C2P_API_URL}/PaymentToken`, {
        payload: requestToken
    });

    if (!response.data) {
        throw new Error('getPaymentToken: No data returned from 2c2p');
    }

    if (response.data.respCode) {
        throw new Error('getPaymentToken: ' + response.data.respCode + ', ' + response.data.respDesc);
    }

    if (!response.data.payload) {
        throw new Error('getPaymentToken: No response payload returned from 2c2p');
    }

    return response.data.payload;

}