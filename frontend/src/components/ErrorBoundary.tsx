import React from 'react';
import { ShieldAlert, RefreshCw } from 'lucide-react';

interface ErrorBoundaryProps {
  children: React.ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('[Ironclad ErrorBoundary]', error, errorInfo);

    // Report to Sentry if available
    try {
      const Sentry = (window as any).__SENTRY__;
      if (Sentry?.captureException) {
        Sentry.captureException(error, { extra: { componentStack: errorInfo.componentStack } });
      }
    } catch {
      // Sentry not available, skip
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-forge-abyssal flex items-center justify-center px-6">
          <div className="max-w-md w-full text-center">
            <div className="w-24 h-24 mx-auto mb-8 rounded-full border-2 border-forge-blood/50 flex items-center justify-center bg-forge-iron/20 backdrop-blur-md">
              <ShieldAlert size={48} className="text-forge-blood animate-pulse" />
            </div>

            <h1 className="text-3xl font-cinematic text-white tracking-widest uppercase mb-3">
              The Forge Has Broken
            </h1>
            <p className="text-slate-400 font-mono text-sm mb-2">
              An unexpected error disrupted the arena.
            </p>
            <p className="text-slate-600 font-mono text-xs mb-8 break-all px-4">
              {this.state.error?.message || 'Unknown error'}
            </p>

            <div className="flex flex-col gap-3 items-center">
              <button
                onClick={this.handleRetry}
                className="px-8 py-3 bg-forge-blood hover:bg-forge-bloodLight text-white font-mono text-sm tracking-widest uppercase transition-colors flex items-center gap-2 rounded-lg shadow-forge-blood"
              >
                <RefreshCw size={16} />
                Reignite the Forge
              </button>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 border border-forge-iron text-slate-400 hover:text-white font-mono text-xs tracking-widest uppercase transition-colors rounded-lg"
              >
                Full Reload
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
