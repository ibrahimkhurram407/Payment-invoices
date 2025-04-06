export interface Invoice {
  invoiceId: string;
  amount: number;
  url: string;
  paid: boolean;
}

export interface VAT {
  country: string;
  rate: string;
}

export interface Business {
  id: string;
  country: string;
  city: string;
  name: string;
  address: string;
  postalCode: string;
}

export interface PaymentData {
  paymentTotalAmount: number;
  paymentCurrency: string;
  invoices: Invoice[];
  paymentDescription: string;
  vat: VAT | null;
  business: Business | null;
  isNewCustomer: boolean;
  creditAmount: number;
  balanceAmount: number;
  amountDue: number;
  userId: string;
  customerId: string;
}

export interface BusinessFormData {
  name: string;
  country: string;
  address: string;
  city: string;
  postalCode: string;
  vatId: string;
}

// export interface BusinessFormData {
//   name: string;
//   billingAddressLine1: string;
//   city: string;
//   country: string;
//   postalCode: string;
//   region: string;
//   vatId: string;
//   vatType: string;
//   vatValue: string;
// }

export interface ApiResponse {
  message: string;
  success?: boolean;
}
