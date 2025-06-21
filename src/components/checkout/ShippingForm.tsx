import { useState } from 'react';
import { FormField } from '../ui/FormField';
import { UserIcon, PhoneIcon, AtSignIcon, MapPinIcon, BuildingIcon } from 'lucide-react';

interface ShippingFormData {
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  address: string;
  city: string;
  zipCode: string;
}

interface ShippingFormProps {
  onShippingDataChange?: (data: ShippingFormData) => void;
}

export const ShippingForm = ({ onShippingDataChange }: ShippingFormProps) => {
  const [formData, setFormData] = useState<ShippingFormData>({
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    address: '',
    city: '',
    zipCode: ''
  });

  const handleChange = (field: keyof ShippingFormData, value: string) => {
    const updatedData = { ...formData, [field]: value };
    setFormData(updatedData);
    onShippingDataChange?.(updatedData);
  };
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField 
          label="First Name" 
          type="text" 
          placeholder="John" 
          icon={<UserIcon className="w-5 h-5" />} 
          value={formData.firstName}
          onChange={(e) => handleChange('firstName', e.target.value)}
          required 
        />
        <FormField 
          label="Last Name" 
          type="text" 
          placeholder="Doe" 
          icon={<UserIcon className="w-5 h-5" />} 
          value={formData.lastName}
          onChange={(e) => handleChange('lastName', e.target.value)}
          required 
        />
      </div>
      <FormField 
        label="Phone" 
        type="tel" 
        placeholder="(123) 456-7890" 
        icon={<PhoneIcon className="w-5 h-5" />} 
        value={formData.phone}
        onChange={(e) => handleChange('phone', e.target.value)}
        required 
      />
      <FormField 
        label="Email" 
        type="email" 
        placeholder="john@example.com" 
        icon={<AtSignIcon className="w-5 h-5" />} 
        value={formData.email}
        onChange={(e) => handleChange('email', e.target.value)}
        required 
      />
      <FormField 
        label="Address" 
        type="text" 
        placeholder="123 Main St" 
        icon={<MapPinIcon className="w-5 h-5" />} 
        value={formData.address}
        onChange={(e) => handleChange('address', e.target.value)}
        required 
      />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField 
          label="City" 
          type="text" 
          placeholder="San Francisco" 
          icon={<BuildingIcon className="w-5 h-5" />} 
          value={formData.city}
          onChange={(e) => handleChange('city', e.target.value)}
          required 
        />
        <FormField 
          label="ZIP Code" 
          type="text" 
          placeholder="94105" 
          icon={<MapPinIcon className="w-5 h-5" />} 
          value={formData.zipCode}
          onChange={(e) => handleChange('zipCode', e.target.value)}
          required 
        />
      </div>
    </div>
  );
};