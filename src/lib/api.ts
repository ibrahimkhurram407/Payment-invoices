import { PaymentData, BusinessFormData } from "@/types/payment";
import Cookies from "js-cookie";

// Get endpoints from environment variables
const AUTH_ENDPOINT  = process.env.NEXT_PUBLIC_GET_TOKEN_ENDPOINT || 'https://ibrahimkhurram.com:805/get-token';
const PAYMENT_DATA_ENDPOINT  = process.env.NEXT_PUBLIC_DATA_ENDPOINT || 'https://ibrahimkhurram.com:805/api/data';
const CUSTOMER_UPDATE_ENDPOINT  = process.env.NEXT_PUBLIC_VAT_DETAILS_SAVE_ENDPOINT || 'https://ibrahimkhurram.com:805/api/data/business';
const API_KEY = process.env.NEXT_PUBLIC_API_KEY || 'aed9264363f5df556a827c3046a0d6635fbf06d9ee13ec572ac93fc624aae1bf';
const APPLICATION_ID = process.env.APP_ID || "test";

// Function to get JWT token
export async function getJwtToken(): Promise<string> {
  const res = await fetch(AUTH_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ applicationId: APPLICATION_ID, key: API_KEY }),
  });

  if (!res.ok) throw new Error("Failed to get token");

  const data = await res.json();
  return data.token;
}




// Function to get or create JWT token
export async function getOrCreateToken(paymentId: string): Promise<string> {
  // Check if we already have a token in cookies
  const existingToken = getAuthTokenClient();
  
  if (existingToken) {
    return existingToken;
  }
  
  // If no token exists, get a new one
  const token = await getJwtToken();
  setAuthToken(token);
  return token;
}

async function fetchWithAuthRetry<T>(
  fetchFn: (token: string) => Promise<T>,
  paymentIdOrCustomerId: string
): Promise<T> {
  let token = getAuthTokenClient();

  if (!token) {
    token = await getJwtToken();
    setAuthToken(token);
  }

  try {
    return await fetchFn(token);
  } catch (error: any) {
    // Only retry on 401 or 403
    if (error.message.includes("401") || error.message.includes("403") || error.error.includes("Invalid token")) {
      token = await getJwtToken();
      setAuthToken(token);
      return await fetchFn(token);
    }

    throw error; // For other errors, just rethrow
  }
}

// Function to get payment data
export async function getPaymentData(paymentId: string): Promise<PaymentData> {
  return await fetchWithAuthRetry(async (token) => {
    const res = await fetch(`${PAYMENT_DATA_ENDPOINT}/${paymentId}`, {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`${res.status}: ${errorText}`);
    }

    return res.json();
  }, paymentId);
}




// Function to save business data
export async function saveBusinessData(customerId: string, businessData: BusinessFormData): Promise<void> {
  await fetchWithAuthRetry(async (token) => {
    const res = await fetch(`${CUSTOMER_UPDATE_ENDPOINT}/${customerId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: businessData.name,
        billingAddressLine1: businessData.address,
        postalCode: businessData.postalCode,
        city: businessData.city,
        country: businessData.country,
        vatValue: businessData.vatId,
        vatType: businessData.vatId,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      throw new Error(`${res.status}: ${errorText}`);
    }
  }, customerId);
}



// Function to save geolocation data
export async function saveGeolocationData(customerId: string, geoData: {
  postalCode: string | undefined;
  city: string | undefined;
  country: string | undefined;
  region: string | undefined;
}, token: string) {

  const fetchFn = async (token: string) => {
    const res = await fetch(`${CUSTOMER_UPDATE_ENDPOINT}/${customerId}`, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(geoData),
    });

    if (!res.ok) {
      throw new Error("Failed to save geolocation data");
    }

    // Return an object with a message property
    return { message: "Successfully saved geolocation data" };
  };

  // Use fetchWithAuthRetry to retry if necessary
  return await fetchWithAuthRetry(fetchFn, customerId);
}




// Function to manage JWT token in cookies
export function setAuthToken(token: string): void {
  Cookies.set("auth_token", token, { expires: 1 }); // Expires in 1 day
}

export function getAuthTokenClient(): string | null {
  return Cookies.get("auth_token") || null;
}

export function removeAuthToken(): void {
  Cookies.remove("auth_token");
}