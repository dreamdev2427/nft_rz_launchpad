import axios from "axios";
import { config } from "../config";

export function convertMicroDenomToDenom(
  amount: number | string,
  denom: number = 6
) {
  if (typeof amount === "string") {
    amount = Number(amount);
  }
  amount = amount / 10 ** 6;
  return isNaN(amount) ? 0 : amount;
}

export function convertDenomToMicroDenom(
  amount: number | string,
  denom: number = 6
): string {
  if (typeof amount === "string") {
    amount = Number(amount);
  }
  amount = amount * 10 ** 6;
  return isNaN(amount) ? "0" : String(amount).split(".")[0];
}

export async function getSystemTime(): Promise<number> {
  try {
    const resp = await axios.get(`${config.API_URL}api/users/system_time`);
    return resp.data as number;
  } catch (err) {}
  return 0;
}

export const sleep = (ms: number) => {
  return new Promise((resolve) => setTimeout(resolve, ms));
};

export const copyToClipboard = (data: any) => {
  if (typeof window === "undefined") {
    return;
  }
  if (navigator.clipboard && window.isSecureContext) {
    // navigator clipboard api method'
    return navigator.clipboard.writeText(data);
  } else {
    var textField = document.createElement("textarea");
    textField.innerText = data;
    textField.style.position = "fixed";
    textField.style.left = "-999999px";
    textField.style.top = "-999999px";
    document.body.appendChild(textField);
    textField.select();
    document.execCommand("copy");
    textField.remove();
  }
};
