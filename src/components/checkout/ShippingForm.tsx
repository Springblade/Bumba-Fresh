import React, { useState } from 'react';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import { UserIcon, PhoneIcon, MapPinIcon, BuildingIcon } from 'lucide-react';
interface Address {
  fullName: string;
  phoneNumber: string;
  address: string;
  city: string;
  postalCode: string;
}
interface ShippingFormProps {
  onSubmit: (data: Address) => void;
  isSubmitting?: boolean;
  error?: string | null;
  initialAddress?: Address | null;
}
export const ShippingForm = ({
  onSubmit,
  isSubmitting,
  error,
  initialAddress
}: ShippingFormProps) => {
  const [formData, setFormData] = useState<Address>({
    fullName: initialAddress?.fullName || '',
    phoneNumber: initialAddress?.phoneNumber || '',
    address: initialAddress?.address || '',
    city: initialAddress?.city || '',
    postalCode: initialAddress?.postalCode || ''
  });
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const {
      name,
      value
    } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  const handleBlur = (field: string) => {
    setTouched(prev => ({
      ...prev,
      [field]: true
    }));
  };
  const isFormValid = () => {
    return Object.values(formData).every(value => value.trim() !== '');
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit(formData);
    }
  };
  return <form onSubmit={handleSubmit} className="space-y-6">
      <FormField label="Full Name" name="fullName" type="text" placeholder="John Doe" icon={<UserIcon className="w-5 h-5" />} value={formData.fullName} onChange={handleChange} onBlur={() => handleBlur('fullName')} error={touched.fullName && !formData.fullName ? 'Full name is required' : ''} required />
      <FormField label="Phone Number" name="phoneNumber" type="tel" placeholder="(123) 456-7890" icon={<PhoneIcon className="w-5 h-5" />} value={formData.phoneNumber} onChange={handleChange} onBlur={() => handleBlur('phoneNumber')} error={touched.phoneNumber && !formData.phoneNumber ? 'Phone number is required' : ''} required />
      <FormField label="Address" name="address" type="text" placeholder="123 Main Street" icon={<MapPinIcon className="w-5 h-5" />} value={formData.address} onChange={handleChange} onBlur={() => handleBlur('address')} error={touched.address && !formData.address ? 'Address is required' : ''} required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="City" name="city" type="text" placeholder="San Francisco" icon={<BuildingIcon className="w-5 h-5" />} value={formData.city} onChange={handleChange} onBlur={() => handleBlur('city')} error={touched.city && !formData.city ? 'City is required' : ''} required />
        <FormField label="Postal Code" name="postalCode" type="text" placeholder="94105" icon={<MapPinIcon className="w-5 h-5" />} value={formData.postalCode} onChange={handleChange} onBlur={() => handleBlur('postalCode')} error={touched.postalCode && !formData.postalCode ? 'Postal code is required' : ''} required />
      </div>
      {error && <div className="text-error-600 text-sm rounded-lg bg-error-50 p-3">
          {error}
        </div>}
      <Button type="submit" className="w-full" disabled={!isFormValid() || isSubmitting} isLoading={isSubmitting}>
        Continue to Payment
      </Button>
    </form>;
};