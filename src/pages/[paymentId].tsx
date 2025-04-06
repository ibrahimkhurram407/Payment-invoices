import { useState, useEffect } from "react";
import { GetServerSideProps } from "next";
import { useRouter } from "next/router";
import { CheckoutLayout } from "@/components/checkout/CheckoutLayout";
import { PaymentDetails } from "@/components/checkout/PaymentDetails";
import { PaymentSummary } from "@/components/checkout/PaymentSummary";
import { BusinessForm } from "@/components/checkout/BusinessForm";
import { PaymentButton } from "@/components/checkout/PaymentButton";
import { PaymentData, BusinessFormData } from "@/types/payment";
import { getPaymentData, saveGeolocationData, getAuthTokenClient, getOrCreateToken } from "@/lib/api";
import { isEuCountry } from "@/lib/constants";
import { Card, CardContent } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";

interface CheckoutPageProps {
  initialPaymentData?: PaymentData;
  paymentId: string;
  country?: string;
  city?: string;
  region?: string;
  postalCode?: string;
}

export default function CheckoutPage({ initialPaymentData, paymentId, country, city, region, postalCode }: CheckoutPageProps) {
  const router = useRouter();
  const { toast } = useToast();
  const [paymentData, setPaymentData] = useState<PaymentData | null>(initialPaymentData || null);
  const [loading, setLoading] = useState(!initialPaymentData);
  const [error, setError] = useState<string | null>(null);
  const [euVatCountry, setEuVatCountry] = useState<string | null>(null);
  const [businessData, setBusinessData] = useState<BusinessFormData | null>(null);
  const [geoSaved, setGeoSaved] = useState(false);
  const geoData = {
    postalCode: postalCode,
    city: city,
    country: country,
    region: region
  };
  useEffect(() => {
    async function fetchData() {
      if (!initialPaymentData) {
        try {
          setLoading(true);
          // Get or create JWT token
          // const token = await getOrCreateToken(paymentId);
          
          // Fetch payment data
          const data = await getPaymentData(paymentId);
          setPaymentData(data);
          setError(null);
        } catch (err) {
          console.error("Error fetching payment data:", err);
          setError("Failed to load payment data. Please try again later.");
        } finally {
          setLoading(false);
        }
      }
    }
    
    fetchData();
  }, [initialPaymentData, paymentId]);

  useEffect(() => {
    const detectUserLocation = async () => {
      if (!paymentData?.isNewCustomer || geoSaved) return;
  
      try {
        if (country && isEuCountry(country)) {
          setEuVatCountry(country);
        }
  
        // Save geolocation data to the API
        const token = getAuthTokenClient();
        
        if (token && paymentData.customerId) {
          const response = await saveGeolocationData(paymentData.customerId, geoData, token);
          setGeoSaved(true);
          
          toast({
            title: "Location detected",
            description: response.message || `Your location has been detected as ${country}.`,
          });
        }
      
      } catch (error) {
        console.error("Failed to detect or save user location:", error);
        toast({
          title: "Error",
          description: "Failed to detect or save your location.",
          variant: "destructive",
        });
      }
    };
  
    detectUserLocation();
  }, [paymentData, geoSaved, geoData, country]);
  

  // Handle business data saved
  const handleBusinessDataSaved = (data: BusinessFormData) => {
    setBusinessData(data);
    // Update payment data with the new business info
    if (paymentData) {
      setPaymentData({
        ...paymentData,
        business: {
          id: data.vatId,
          country: data.country,
          city: data.city,
          name: data.name,
          address: data.address,
          postalCode: data.postalCode
        }
      });
    }
  };

  if (loading) {
    return (
      <CheckoutLayout title="Loading Payment...">
        <div className="flex justify-center items-center min-h-[50vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </CheckoutLayout>
    );
  }
  
  if (error || !paymentData) {
    return (
      <CheckoutLayout title="Error">
        <div className="max-w-md mx-auto text-center py-12">
          <h1 className="text-2xl font-bold mb-4">Something went wrong</h1>
          <p className="mb-6">{error || "Failed to load payment data"}</p>
          <button
            onClick={() => router.reload()}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md"
          >
            Try Again
          </button>
        </div>
      </CheckoutLayout>
    );
  }
  
  return (
    <CheckoutLayout title="DevRoom Payment Checkout">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-2xl md:text-3xl font-bold mb-8 text-center">Complete Your Payment</h1>
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <PaymentDetails paymentData={paymentData} />
            { JSON.stringify(geoData)}
            {!paymentData.business && !businessData && (
              <BusinessForm 
                paymentId={paymentId}
                userId={paymentData.userId}
                onBusinessDataSaved={handleBusinessDataSaved} 
              />
            )}
            
            {paymentData.business && (
              <div className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-[#ffd35f] dark:border-[#ffd35f]">
                <h3 className="font-medium mb-2">Business Details</h3>
                <div className="space-y-1 text-gray-600 dark:text-gray-300">
                  <p>{paymentData.business.name}</p>
                  <p>{paymentData.business.address}</p>
                  <p>{paymentData.business.city}, {paymentData.business.postalCode}</p>
                  <p>{paymentData.business.country}</p>
                  <p>VAT ID: {paymentData.business.id}</p>
                </div>
              </div>
            )}
          </div>
          
          <div>
            {euVatCountry}
            <PaymentSummary 
              paymentData={paymentData} 
              euVatCountry={euVatCountry} 
            />
            
            <Card className="mt-6">
              <CardContent className="pt-6">
                <h3 className="font-medium mb-4">Payment Options</h3>
                <div className="space-y-4">
                  {paymentData.invoices.map((invoice) => (
                    <PaymentButton 
                      key={invoice.invoiceId}
                      invoice={invoice}
                    />
                  ))}
                  
                  {paymentData.invoices.every(invoice => invoice.paid) && (
                    <div className="text-center text-green-600 dark:text-green-400 mt-4">
                      All invoices have been paid. Thank you!
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </CheckoutLayout>
  );
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const { paymentId } = context.params as { paymentId: string };

  try {
    const headers = context.req.headers;

    const country = headers["x-vercel-ip-country"] as string || "null";
    const city = headers["x-vercel-ip-city"] as string || "null";
    const region = headers["x-vercel-ip-country-region"] as string || "null";
    const postalCode = headers["x-vercel-ip-postal-code"] as string || "null";

    return {
      props: {
        paymentId,
        country,
        city,
        region,
        postalCode, 
      },
    };
  } catch (error) {
    console.error("Error in getServerSideProps:", error);

    return {
      props: {
        paymentId,
      },
    };
  }
};
