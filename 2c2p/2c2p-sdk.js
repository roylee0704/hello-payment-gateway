import axios from "axios";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import * as jose from "jose";

dotenv.config();

const PAYMENT_GATEWAY_2C2P_API_URL = process.env.PAYMENT_GATEWAY_2C2P_API_URL;
const PAYMENT_GATEWAY_2C2P_PAYMENT_ACTION_API_URL =
  process.env.PAYMENT_GATEWAY_2C2P_PAYMENT_ACTION_API_URL;

const PAYMENT_GATEWAY_2C2P_API_SECRET =
  process.env.PAYMENT_GATEWAY_2C2P_API_SECRET;
const PAYMENT_GATEWAY_2C2P_API_MERCHANT_ID =
  process.env.PAYMENT_GATEWAY_2C2P_API_MERCHANT_ID;
const PAYMENT_GATEWAY_2C2P_API_WEBHOOK_URL =
  process.env.PAYMENT_GATEWAY_2C2P_API_WEBHOOK_URL;

export async function getCheckoutInfo(checkoutPayload) {
  checkoutPayload.merchantID = PAYMENT_GATEWAY_2C2P_API_MERCHANT_ID;
  checkoutPayload.backendReturnUrl = PAYMENT_GATEWAY_2C2P_API_WEBHOOK_URL;

  try {
    const requestToken = jwt.sign(
      checkoutPayload,
      PAYMENT_GATEWAY_2C2P_API_SECRET
    );
    console.debug("requestToken:", requestToken);

    const responseToken = await getPaymentToken(requestToken);
    console.debug("responseToken:", responseToken);

    const response = jwt.decode(responseToken, PAYMENT_GATEWAY_2C2P_API_SECRET);
    console.debug("response:", response);

    return {
      webPaymentUrl: response.webPaymentUrl,
      paymentToken: response.paymentToken,
    };
  } catch (err) {
    throw new Error("getCheckoutPaymentUrl: " + err);
  }
}

async function getPaymentToken(requestToken) {
  const response = await axios.post(
    `${PAYMENT_GATEWAY_2C2P_API_URL}/PaymentToken`,
    {
      payload: requestToken,
    }
  );

  if (!response.data) {
    throw new Error("getPaymentToken: No data returned from 2c2p");
  }

  if (response.data.respCode) {
    throw new Error(
      "getPaymentToken: " +
        response.data.respCode +
        ", " +
        response.data.respDesc
    );
  }

  if (!response.data.payload) {
    throw new Error("getPaymentToken: No response payload returned from 2c2p");
  }

  return response.data.payload;
}

// @doc https://developer.2c2p.com/docs/api-payment-inquiry
export async function paymentInquiry({
  paymentToken,
  invoiceNo,
  locale = "en",
}) {
  const payload = {
    paymentToken,
    merchantID: PAYMENT_GATEWAY_2C2P_API_MERCHANT_ID,
    invoiceNo,
    locale,
  };
  const requestToken = jwt.sign(payload, PAYMENT_GATEWAY_2C2P_API_SECRET);

  const response = await axios.post(
    `${PAYMENT_GATEWAY_2C2P_API_URL}/paymentInquiry`,
    {
      payload: requestToken,
    }
  );

  if (!response.data) {
    throw new Error("getPaymentInquiry: No data returned from 2c2p");
  }

  if (response.data.respCode) {
    throw new Error(
      "getPaymentInquiry: " +
        response.data.respCode +
        ", " +
        response.data.respDesc
    );
  }

  if (!response.data.payload) {
    throw new Error(
      "getPaymentInquiry: No response payload returned from 2c2p"
    );
  }

  return jwt.decode(response.data.payload, PAYMENT_GATEWAY_2C2P_API_SECRET);
}

//@doc https://developer.2c2p.com/docs/api-payment-action-payment-process#refund-request-parameter
/**
 * this gotta use xml payload,
 * learn from here: https://developer.2c2p.com/recipes/generate-jwt-token-with-keys
 *
 * @param {actionAmount, invoiceNo } payload
 * @returns
 */
export async function refund({ invoiceNo, actionAmount }) {
  const payload = `
  <PaymentProcessRequest>
    <version>3.8</version>
    <merchantID>${PAYMENT_GATEWAY_2C2P_API_MERCHANT_ID}</merchantID>
    <invoiceNo>${invoiceNo}</invoiceNo>
    <actionAmount>${actionAmount}</actionAmount>
    <processType>R</processType>
  </PaymentProcessRequest>
`.replace(/(\s|\n)*/g, "");

  const algorithm = "ES256";
  const x509 = `-----BEGIN CERTIFICATE-----
  MIIDPjCCAiYCCQCUznZSH6DdxzANBgkqhkiG9w0BAQUFADBhMQswCQYDVQQGEwJN
  WTELMAkGA1UECAwCTVkxCzAJBgNVBAcMAk1ZMQswCQYDVQQKDAJNWTELMAkGA1UE
  CwwCTVkxCzAJBgNVBAMMAk1ZMREwDwYJKoZIhvcNAQkBFgJNWTAeFw0yMjAyMTEw
  NjIxMTNaFw0zMjAyMDkwNjIxMTNaMGExCzAJBgNVBAYTAk1ZMQswCQYDVQQIDAJN
  WTELMAkGA1UEBwwCTVkxCzAJBgNVBAoMAk1ZMQswCQYDVQQLDAJNWTELMAkGA1UE
  AwwCTVkxETAPBgkqhkiG9w0BCQEWAk1ZMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8A
  MIIBCgKCAQEAqnVghnl5zcgTmIuqxx0c19JndUsnjc5xWWkg5UsSnrX+HbeWiwDg
  q6SWqY+szqIh13IjJrjbh2AgCdQrwi8etiKEA0vutlt1cM6YiKUI3446talz5K5I
  kzlSmlJPzFDhe2GGkRWWIXuRlJoVZBeqdRQQxUIKcKEUwa3jt/24K8kwYPsmSnwD
  pVgAlVMk+yvqo8dwu/2xb69NJEuN+NHXCtPTBVZkUAZ1hqcceat8o2svKo/RgxM/
  VXHrbh23CRBj++TA8dzvGBj7QelD85bhdhAmHHYPD2J3iFGW2zJz3Jh959pNz2AS
  0Rk8PWuAPlBejSMEIjOxoev9Watd9/4ryQIDAQABMA0GCSqGSIb3DQEBBQUAA4IB
  AQBnN9OKrnO6b86maJ+++uUkDgrqB80TJ3TeEYhOdwjCwyr6y8/E3Zbj05zX/NZL
  PXkiJ48Yc3Z6TmxASb8j2K4HgfhP9uSM7BZT64PYbB6phl4MItciVOkRcVM5xzi+
  PALLnypfc+RQxiM4GARBzUoOAbF0ciNMcU9gO/JZOVmdHbWioZtPF62lWpOi0USm
  Wz/Wyv9BjsqigkO2Zt79QLw2Qz+0p0uu+j30ZjMo1jv3YSa2oWPEKzKfv70O8sIV
  MQIjR6+BjKLB34bBbAozXCXjqwA0GzieXs2JUy9iaXJn05P6Xv8TRQQHpA7NSqX8
  IQtByvKtX3yUy0+ig3c6ckdV
  -----END CERTIFICATE-----
  `;
  const ecPublicKey = await jose.importX509(x509, algorithm);

  console.log(payload, "payload");
  const requestToken = jwt.sign(payload, PAYMENT_GATEWAY_2C2P_API_SECRET);

  const response = await axios.post(
    `${PAYMENT_GATEWAY_2C2P_PAYMENT_ACTION_API_URL}/action`,
    {
      payload: requestToken,
    }
  );

  if (!response.data) {
    throw new Error("getPaymentInquiry: No data returned from 2c2p");
  }

  if (response.data.respCode) {
    throw new Error(
      "refund: " + response.data.respCode + ", " + response.data.respDesc
    );
  }

  if (!response.data.payload) {
    throw new Error("refund: No response payload returned from 2c2p");
  }

  return jwt.decode(response.data.payload, PAYMENT_GATEWAY_2C2P_API_SECRET);
}
