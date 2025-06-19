import React from 'react';
import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
interface Step {
  id: string;
  label: string;
  completed: boolean;
  current: boolean;
}
interface SubscriptionProgressProps {
  steps: Step[];
}
export const SubscriptionProgress = ({
  steps
}: SubscriptionProgressProps) => {
  return <nav aria-label="Progress">
      <ol className="flex items-center">
        {steps.map((step, index) => <li key={step.id} className={`relative ${index !== steps.length - 1 ? 'flex-1' : ''}`}>
            <div className="flex items-center">
              <motion.div initial={false} animate={{
            backgroundColor: step.completed ? '#10B981' : step.current ? '#4F46E5' : '#E5E7EB',
            scale: step.current ? 1.1 : 1
          }} className="relative w-8 h-8 rounded-full flex items-center justify-center">
                {step.completed ? <CheckIcon className="w-5 h-5 text-white" /> : <span className="text-sm font-medium text-white">
                    {index + 1}
                  </span>}
              </motion.div>
              {index !== steps.length - 1 && <div className="flex-1 mx-4">
                  <div className={`h-0.5 ${step.completed ? 'bg-primary-600' : 'bg-gray-200'}`} />
                </div>}
            </div>
            <span className="absolute -bottom-6 w-full text-center text-sm font-medium text-gray-600">
              {step.label}
            </span>
          </li>)}
      </ol>
    </nav>;
};