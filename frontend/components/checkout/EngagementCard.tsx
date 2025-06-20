import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
interface EngagementCardProps {
  title: string;
  description: string;
  ctaText: string;
  icon: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'featured';
}
export const EngagementCard = ({
  title,
  description,
  ctaText,
  icon,
  onClick,
  variant = 'default'
}: EngagementCardProps) => {
  return <div className={`
        relative p-6 rounded-xl border transition-all duration-300
        ${variant === 'featured' ? 'border-primary-200 bg-primary-50 hover:border-primary-300' : 'border-gray-200 bg-white hover:border-gray-300'}
      `}>
      <div className="flex items-start gap-4">
        <div className={`
            p-3 rounded-lg
            ${variant === 'featured' ? 'bg-primary-100 text-primary-600' : 'bg-gray-100 text-gray-600'}
          `}>
          {icon}
        </div>
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">{title}</h3>
          <p className="text-gray-600 mb-4">{description}</p>
          <Button onClick={onClick} variant={variant === 'featured' ? 'primary' : 'outline'} className="w-full sm:w-auto">
            {ctaText}
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>;
};