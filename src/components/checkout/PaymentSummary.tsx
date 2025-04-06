import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentData } from "@/types/payment";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { getVatRateByCountry, getCountryNameByCode } from "@/lib/constants";

interface PaymentSummaryProps {
  paymentData: PaymentData;
  euVatCountry?: string | null;
}

export function PaymentSummary({ paymentData, euVatCountry }: PaymentSummaryProps) {
  const { 
    paymentTotalAmount, 
    paymentCurrency, 
    amountDue, 
    creditAmount, 
    balanceAmount,
    vat
  } = paymentData;

  // Calculate paid amount
  const paidAmount = paymentData.invoices
    .filter(invoice => invoice.paid)
    .reduce((sum, invoice) => sum + invoice.amount, 0);

  // Calculate VAT amount if applicable
  let vatRate = 0;
  let countryName = "";
  
  if (vat) {
    vatRate = parseInt(vat.rate, 10);
    countryName = getCountryNameByCode(vat.country);
  } else if (euVatCountry) {
    vatRate = getVatRateByCountry(euVatCountry);
    countryName = getCountryNameByCode(euVatCountry);
  }
  
  const vatAmount = vatRate > 0 ? (amountDue * vatRate) / 100 : 0;

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: paymentCurrency,
    }).format(amount);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl">Payment Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-500 dark:text-gray-400">Total Amount:</span>
          <span>{formatCurrency(paymentTotalAmount)}</span>
        </div>
        
        {paidAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Already Paid:</span>
            <span className="text-green-600 dark:text-green-400">-{formatCurrency(paidAmount)}</span>
          </div>
        )}
        
        {creditAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Credit Applied:</span>
            <span className="text-green-600 dark:text-green-400">-{formatCurrency(creditAmount)}</span>
          </div>
        )}
        
        {balanceAmount > 0 && (
          <div className="flex justify-between">
            <span className="text-gray-500 dark:text-gray-400">Balance Applied:</span>
            <span className="text-green-600 dark:text-green-400">-{formatCurrency(balanceAmount)}</span>
          </div>
        )}
        
        {(vat || euVatCountry) && (
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-1">
              <span className="text-gray-500 dark:text-gray-400">VAT ({vatRate}%):</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <InfoIcon size={16} className="text-gray-500 dark:text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent className="max-w-xs">
                    {euVatCountry ? (
                      <p>Stripe has determined that you are required to pay VAT as you are in {euVatCountry}. If you believe this is a mistake and you should not be charged VAT, please contact DevRoom support.</p>
                    ) : (
                      <p>VAT is being applied based on your business location.</p>
                    )}
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            <span>{formatCurrency(vatAmount)}</span>
          </div>
        )}
        
        <div className="pt-4 border-t border-gray-200 dark:border-gray-800 flex justify-between font-semibold">
          <span>Amount Due:</span>
          <span>{formatCurrency(amountDue + vatAmount - paidAmount)}</span>
        </div>
      </CardContent>
    </Card>
  );
}