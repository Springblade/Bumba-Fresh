import React from 'react';
import { FormField } from '../ui/FormField';
import { Select } from '../ui/Select';
import { UserIcon, PhoneIcon, AtSignIcon, MapPinIcon, BuildingIcon } from 'lucide-react';
export const ShippingForm = () => {
  const states = [{
    value: 'CA',
    label: 'California'
  }, {
    value: 'NY',
    label: 'New York'
  }, {
    value: 'TX',
    label: 'Texas'
  }
  // Add more states as needed
  ];
  return <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="First Name" type="text" placeholder="John" icon={<UserIcon className="w-5 h-5" />} required />
        <FormField label="Last Name" type="text" placeholder="Doe" icon={<UserIcon className="w-5 h-5" />} required />
      </div>
      <FormField label="Phone" type="tel" placeholder="(123) 456-7890" icon={<PhoneIcon className="w-5 h-5" />} required />
      <FormField label="Email" type="email" placeholder="john@example.com" icon={<AtSignIcon className="w-5 h-5" />} required />
      <FormField label="Address" type="text" placeholder="123 Main St" icon={<MapPinIcon className="w-5 h-5" />} required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField label="City" type="text" placeholder="San Francisco" icon={<BuildingIcon className="w-5 h-5" />} required />
        <Select label="State" options={states} required icon={<MapPinIcon className="w-5 h-5" />} />
      </div>
      <FormField label="ZIP Code" type="text" placeholder="94105" icon={<MapPinIcon className="w-5 h-5" />} required />
    </div>;
};