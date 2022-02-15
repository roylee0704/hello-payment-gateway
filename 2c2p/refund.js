import { refund } from "./2c2p-sdk.js";

const INVOICE_NO = process.env.INVOICE_NO;
const ACTION_AMOUNT = process.env.ACTION_AMOUNT;

async function run() {
  try {
    const response = await refund({
      invoiceNo: INVOICE_NO,
      actionAmount: ACTION_AMOUNT,
    });
    console.log("result:", response);
  } catch (err) {
    console.error(err);
  }
}

run();
