import React, { useState } from 'react';
import { FormField } from '../ui/FormField';
import { Button } from '../ui/Button';
import { UserIcon, PhoneIcon, MapPinIcon, BuildingIcon } from 'lucide-react';
interface Address {
  fullName: string;
  phoneNumber: string;
  email?: string;
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
}: ShippingFormProps) => {  const [formData, setFormData] = useState<Address>({
    fullName: initialAddress?.fullName || '',
    phoneNumber: initialAddress?.phoneNumber || '',
    email: initialAddress?.email || '',
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
  };  const isFormValid = () => {
    return formData.fullName.trim() !== '' && 
           formData.phoneNumber.trim() !== '' && 
           formData.email && formData.email.trim() !== '' &&
           formData.address.trim() !== '' && 
           formData.city.trim() !== '' && 
           formData.postalCode.trim() !== '';
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isFormValid()) {
      onSubmit(formData);
    }
  };  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-6">Shipping Information</h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* First Name and Last Name Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            label="First Name" 
            name="firstName"
            type="text" 
            placeholder="John" 
            icon={<UserIcon className="w-5 h-5" />} 
            value={formData.fullName.split(' ')[0] || ''}
            onChange={(e) => {
              const firstName = e.target.value;
              const lastName = formData.fullName.split(' ').slice(1).join(' ');
              setFormData(prev => ({
                ...prev,
                fullName: `${firstName} ${lastName}`.trim()
              }));
            }}
            onBlur={() => handleBlur('fullName')}
            error={touched.fullName && !formData.fullName ? 'First name is required' : ''}
            required 
          />

          <FormField 
            label="Last Name" 
            name="lastName"
            type="text" 
            placeholder="Doe" 
            icon={<UserIcon className="w-5 h-5" />} 
            value={formData.fullName.split(' ').slice(1).join(' ') || ''}
            onChange={(e) => {
              const lastName = e.target.value;
              const firstName = formData.fullName.split(' ')[0] || '';
              setFormData(prev => ({
                ...prev,
                fullName: `${firstName} ${lastName}`.trim()
              }));
            }}
            onBlur={() => handleBlur('fullName')}
            error={touched.fullName && !formData.fullName ? 'Last name is required' : ''}
            required 
          />
        </div>

        <FormField 
          label="Phone" 
          name="phoneNumber"
          type="tel" 
          placeholder="(123) 456-7890" 
          icon={<PhoneIcon className="w-5 h-5" />} 
          value={formData.phoneNumber}
          onChange={handleChange}
          onBlur={() => handleBlur('phoneNumber')}
          error={touched.phoneNumber && !formData.phoneNumber ? 'Phone number is required' : ''}
          required 
        />

        <FormField 
          label="Email" 
          name="email"
          type="email" 
          placeholder="john@example.com" 
          icon={<UserIcon className="w-5 h-5" />} 
          value={formData.email || ''}
          onChange={handleChange}
          onBlur={() => handleBlur('email')}
          error={touched.email && !formData.email ? 'Email is required' : ''}
          required 
        />

        <FormField 
          label="Address" 
          name="address"
          type="text" 
          placeholder="123 Main St" 
          icon={<MapPinIcon className="w-5 h-5" />} 
          value={formData.address}
          onChange={handleChange}
          onBlur={() => handleBlur('address')}
          error={touched.address && !formData.address ? 'Address is required' : ''}
          required 
        />

        {/* City and ZIP Code Row */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField 
            label="City" 
            name="city"
            type="text" 
            placeholder="San Francisco" 
            icon={<BuildingIcon className="w-5 h-5" />} 
            value={formData.city}
            onChange={handleChange}
            onBlur={() => handleBlur('city')}
            error={touched.city && !formData.city ? 'City is required' : ''}
            required 
          />

          <FormField 
            label="ZIP Code" 
            name="postalCode"
            type="text" 
            placeholder="94105" 
            icon={<MapPinIcon className="w-5 h-5" />} 
            value={formData.postalCode}
            onChange={handleChange}
            onBlur={() => handleBlur('postalCode')}
            error={touched.postalCode && !formData.postalCode ? 'ZIP code is required' : ''}
            required 
          />
        </div>

        {error && (
          <div className="text-error-600 text-sm rounded-lg bg-error-50 p-3">
            {error}
          </div>
        )}

        <Button 
          type="submit" 
          className="w-full" 
          disabled={!isFormValid() || isSubmitting}
          isLoading={isSubmitting}
        >
          Continue to Payment
        </Button>
      </form>
    </div>
  );
};