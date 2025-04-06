import Image from "next/image";

export function PaymentMethodIcons() {
  const paymentMethods = [
    { name: "Visa", icon: "/visa.svg" },
    { name: "Mastercard", icon: "/mastercard.svg" },
    { name: "American Express", icon: "/amex.svg" },
    { name: "Apple Pay", icon: "/apple-pay.svg" },
    { name: "Google Pay", icon: "/google-pay.svg" },
    { name: "PayPal", icon: "/paypal.svg" },
    { name: "Klarna", icon: "/klarna.svg" }
  ];

  return (
    <div className="mt-4">
      <p className="text-sm text-gray-500 dark:text-gray-400 mb-3">Accepted payment methods</p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        {paymentMethods.map((method) => (
          <div 
            key={method.name}  
            className="rounded-md p-2 h-8 flex items-center justify-center"
            title={method.name}
          >
            <img 
              src={method.icon} 
              alt={`${method.name} payment method`} 
              className="h-full object-contain"
            />
          </div>
        ))}
      </div>
    </div>
  );
}