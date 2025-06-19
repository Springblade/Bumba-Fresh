import React, { Component } from 'react';
import { AlertCircleIcon } from 'lucide-react';
import { Button } from '../../../components/ui/Button';
interface Props {
  children: React.ReactNode;
  onReset?: () => void;
}
interface State {
  hasError: boolean;
  error?: Error;
}
export class SubscriptionErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      hasError: false
    };
  }
  static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Subscription error:', error, errorInfo);
  }
  render() {
    if (this.state.hasError) {
      return <div className="p-6 bg-error-50 rounded-lg">
          <div className="flex items-start space-x-3">
            <AlertCircleIcon className="w-6 h-6 text-error-600 flex-shrink-0" />
            <div>
              <h3 className="text-error-900 font-medium">
                Something went wrong
              </h3>
              <p className="text-error-600 mt-1">
                We're having trouble loading your subscription information.
                Please try again.
              </p>
              {this.props.onReset && <Button onClick={this.props.onReset} variant="outline" className="mt-4">
                  Try Again
                </Button>}
            </div>
          </div>
        </div>;
    }
    return this.props.children;
  }
}