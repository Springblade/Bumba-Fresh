import { CheckCircleIcon, ClockIcon } from 'lucide-react';

interface TimelineStep {
  status: string;
  date: string;
  completed: boolean;
}

interface TimelineProps {
  steps: TimelineStep[];
}

export const Timeline = ({ steps }: TimelineProps) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  return (
    <div className="py-4">
      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-[21px] top-0 h-full w-0.5 bg-gray-200" aria-hidden="true" />
        
        <ul className="space-y-6">
          {steps.map((step, index) => (
            <li key={index} className="relative">
              <div className="flex items-start">
                <div className={`
                  flex h-10 w-10 items-center justify-center rounded-full z-10 bg-white border-2
                  ${step.completed 
                    ? 'border-primary-600 bg-primary-600' 
                    : 'border-gray-300 bg-gray-100'
                  }
                `}>
                  {step.completed ? (
                    <CheckCircleIcon className="w-5 h-5 text-white" />
                  ) : (
                    <ClockIcon className="w-5 h-5 text-gray-400" />
                  )}
                </div>
                
                <div className="ml-4 flex-1">
                  <div className="flex items-center justify-between">
                    <h4 className={`text-base font-medium ${
                      step.completed ? 'text-gray-900' : 'text-gray-500'
                    }`}>
                      {step.status}
                    </h4>
                    <time className={`text-sm ${
                      step.completed ? 'text-gray-600' : 'text-gray-400'
                    }`}>
                      {formatDate(step.date)}
                    </time>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
