
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PaymentData } from "@/types/payment";

interface PaymentDetailsProps {
  paymentData: PaymentData;
}

export function PaymentDetails({ paymentData }: PaymentDetailsProps) {
  const { paymentDescription, invoices, paymentCurrency } = paymentData;
  
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
        <CardTitle className="text-xl">Payment Details</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-1">Description</h3>
          <p>{paymentDescription}</p>
        </div>
        
        {invoices.length > 0 && (
          <div>
            <h3 className="text-gray-500 dark:text-gray-400 text-sm mb-2">Invoices</h3>
            <div className="space-y-2">
              {invoices.map((invoice) => (
                <div 
                  key={invoice.invoiceId} 
                  className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800 rounded-md"
                >
                  <div>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{invoice.invoiceId}</span>
                    <span className={`ml-2 text-xs px-2 py-0.5 rounded-full ${
                      invoice.paid 
                        ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200" 
                        : "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200"
                    }`}>
                      {invoice.paid ? "Paid" : "Unpaid"}
                    </span>
                  </div>
                  <span>{formatCurrency(invoice.amount)}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
