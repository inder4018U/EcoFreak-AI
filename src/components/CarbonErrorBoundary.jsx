import React from 'react';

export class CarbonErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error("CarbonFootprintCard caught an error:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-4 text-left">
          <div className="flex items-center gap-2 text-white/80 font-medium text-xs mb-1">
            <span>🌍</span>
            <span>Carbon Footprint Estimator</span>
          </div>
          <p className="text-white/40 text-xs">
            The carbon estimation module encountered an issue, but your waste classification remains unaffected.
          </p>
          <button
            onClick={() => this.setState({ hasError: false, error: null })}
            className="mt-2 text-emerald-400 hover:text-emerald-300 text-xs underline"
          >
            Retry Estimation
          </button>
        </div>
      );
    }
    return this.props.children;
  }
}

export default CarbonErrorBoundary;
