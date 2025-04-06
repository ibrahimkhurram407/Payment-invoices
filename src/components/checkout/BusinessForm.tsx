import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { BusinessFormData, ApiResponse } from "@/types/payment";
import { saveBusinessData, getAuthTokenClient } from "@/lib/api";
import { EU_COUNTRIES } from "@/lib/constants";
import { useToast } from "@/components/ui/use-toast";

interface BusinessFormProps {
  paymentId: string;
  userId: string;
  onBusinessDataSaved: (data: BusinessFormData) => void;
}

export function BusinessForm({ paymentId, userId, onBusinessDataSaved }: BusinessFormProps) {
  const { toast } = useToast();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [formData, setFormData] = useState<BusinessFormData>({
    name: "",
    country: "",
    address: "",
    city: "",
    postalCode: "",
    vatId: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleCountryChange = (value: string) => {
    setFormData(prev => ({ ...prev, country: value }));
    if (errors.country) {
      setErrors(prev => ({ ...prev, country: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = "Entity name is required";
    }
    
    if (!formData.country) {
      newErrors.country = "Country is required";
    }
    
    if (!formData.address.trim()) {
      newErrors.address = "Address is required";
    }
    
    if (!formData.city.trim()) {
      newErrors.city = "City is required";
    }
    
    if (!formData.postalCode.trim()) {
      newErrors.postalCode = "Postal code is required";
    }
    
    if (!formData.vatId.trim()) {
      newErrors.vatId = "VAT ID is required";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    setApiResponse(null);
    
    try {
      // const token = getAuthTokenClient();
      // if (!token) {
      //   throw new Error("Authentication token not found");
      // }
      
      // Save business data to DevRoom API
      let response = await saveBusinessData(paymentId, formData);
      
      // Display API response message
      setApiResponse("Your business details have been saved successfully.",);
      
      // Notify parent component
      onBusinessDataSaved(formData);
      
      toast({
        title: "Business details saved",
        description: "Your business details have been saved successfully.",
      });

      // Refresh after 3 seconds
      // setTimeout(() => {
      //   window.location.reload();  // Refresh the page
      // }, 3000);
    } catch (error) {
      console.error("Failed to save business data:", error);
      setApiResponse("Failed to save business details. Please try again.");
      
      toast({
        title: "Error",
        description: "Failed to save business details. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
};


  return (
    <div className="mt-6 bg-gray-50 dark:bg-gray-900 rounded-lg p-4 border border-[#ffd35f] dark:border-[#ffd35f]">
      <button
        type="button"
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-blue-600 dark:text-blue-400 hover:text-blue-500 dark:hover:text-blue-300 text-sm flex items-center"
      >
        {isExpanded ? "Hide VAT registration details" : "Are you registered for VAT?"}
      </button>
      
      {isExpanded && (
        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Entity Name</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
            />
            {errors.name && <p className="text-red-500">{errors.name}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="country">Country</Label>
            <Select
              value={formData.country}
              onValueChange={handleCountryChange}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent>
                {EU_COUNTRIES.map(country => (
                  <SelectItem key={country.code} value={country.code}>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.country && <p className="text-red-500">{errors.country}</p>}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Input
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              required
            />
            {errors.address && <p className="text-red-500">{errors.address}</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                required
              />
              {errors.city && <p className="text-red-500">{errors.city}</p>}
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="postalCode">Postal Code</Label>
              <Input
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleChange}
                required
              />
              {errors.postalCode && <p className="text-red-500">{errors.postalCode}</p>}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="vatId">VAT ID</Label>
            <Input
              id="vatId"
              name="vatId"
              value={formData.vatId}
              onChange={handleChange}
              required
            />
            {errors.vatId && <p className="text-red-500">{errors.vatId}</p>}
          </div>
          
          <Button 
            type="submit" 
            className="w-full"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Saving..." : "Save Business Details"}
          </Button>
        </form>
      )}
    </div>
  );
}