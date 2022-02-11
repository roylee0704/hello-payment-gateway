import { paymentInquiry } from "./2c2p-sdk.js";

const PAYMENT_TOKEN = process.env.PAYMENT_TOKEN;
const INVOICE_NO = process.env.INVOICE_NO;

async function run() {
  try {
    const response = await paymentInquiry({
      paymentToken: PAYMENT_TOKEN,
      invoiceNo: INVOICE_NO,
    });
    console.log("result:", response);
  } catch (err) {
    console.error(err);
  }
}

run();
