'use client';

import { Component, type ReactNode } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Production da Sentry yoki boshqa monitoring ga yuborish mumkin
    console.error('[ErrorBoundary] Xatolik tutildi:', error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div
          className="min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#070b14] p-4"
          role="alert"
          aria-live="assertive"
        >
          <div className="text-center max-w-md w-full p-8 rounded-2xl bg-white dark:bg-[#0b1222] border border-red-500/20 shadow-xl">
            <div className="w-16 h-16 mx-auto mb-6 rounded-full bg-red-500/10 flex items-center justify-center">
              <AlertTriangle className="w-8 h-8 text-red-500" aria-hidden="true" />
            </div>

            <h2 className="text-xl font-bold text-slate-900 dark:text-white mb-3">
              Xatolik yuz berdi
            </h2>

            <p className="text-sm text-slate-600 dark:text-slate-400 mb-2">
              {this.state.error?.message || "Noma'lum xatolik. Sahifani yangilang yoki qayta urinib ko'ring."}
            </p>

            {process.env.NODE_ENV === 'development' && this.state.error?.stack && (
              <pre className="mt-3 mb-4 p-3 rounded-xl bg-slate-100 dark:bg-slate-900 text-left text-[10px] text-red-400 overflow-auto max-h-32">
                {this.state.error.stack}
              </pre>
            )}

            <button
              onClick={this.handleReset}
              className="mt-4 inline-flex items-center gap-2 px-6 py-3 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold rounded-xl text-sm transition-all shadow-md"
            >
              <RefreshCw className="w-4 h-4" aria-hidden="true" />
              Qayta urinish
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
