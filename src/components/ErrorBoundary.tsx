import React, { Component, ErrorInfo } from 'react';
import { AlertCircleIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from './ui/Button';
interface Props {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}
interface State {
  hasError: boolean;
  error: Error | null;
}
export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };
  public static getDerivedStateFromError(error: Error): State {
    return {
      hasError: true,
      error
    };
  }
  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }
  private handleRetry = () => {
    this.setState({
      hasError: false,
      error: null
    });
  };
  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }
      return <div className="min-h-[400px] flex items-center justify-center p-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-error-100 text-error-600 mb-4">
              <AlertCircleIcon className="w-8 h-8" />
            </div>
            <h2 className="text-2xl font-semibold text-gray-900 mb-2">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6 max-w-md">
              We're sorry, but something unexpected happened. Please try again
              or contact support if the problem persists.
            </p>
            <Button onClick={this.handleRetry}>
              <RefreshCwIcon className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>;
    }
    return this.props.children;
  }
}
