
import { Button } from "@/components/ui/button";
import { Invoice } from "@/types/payment";

interface PaymentButtonProps {
  invoice: Invoice;
}

export function PaymentButton({ invoice }: PaymentButtonProps) {
  const handlePayment = () => {
    if (!invoice.paid) {
      window.location.href = invoice.url;
    }
  };
  
  return (
    <Button
      onClick={handlePayment}
      disabled={invoice.paid}
      className={`w-full py-4 mt-4 ${
        invoice.paid 
          ? "opacity-50 cursor-not-allowed" 
          : ""
      }`}
    >
      {invoice.paid ? "Paid" : `Pay ${invoice.invoiceId}`}
    </Button>
  );
}
