import React from "react";

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { 
      hasError: false, 
      error: null, 
      errorInfo: null,
      reloadCountdown: 5
    };
    this.reloadTimer = null;
    this.countdownTimer = null;
  }

  static getDerivedStateFromError(error) {
    // Update state so the next render will show the fallback UI.
    return { hasError: true, reloadCountdown: 5 };
  }

  componentDidCatch(error, errorInfo) {
    // You can log the error to an error reporting service here
    console.error("ErrorBoundary caught an error:", error, errorInfo);
    this.setState({
      error: error,
      errorInfo: errorInfo,
      reloadCountdown: 5
    }, () => {
      // Start auto-reload countdown after state is set
      this.startAutoReload();
    });
  }

  startAutoReload = () => {
    // Clear any existing timers
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    if (this.reloadTimer) {
      clearTimeout(this.reloadTimer);
    }

    // Start countdown
    this.countdownTimer = setInterval(() => {
      this.setState((prevState) => {
        const newCountdown = prevState.reloadCountdown > 0 ? prevState.reloadCountdown - 1 : 0;
        if (newCountdown <= 0) {
          if (this.countdownTimer) {
            clearInterval(this.countdownTimer);
            this.countdownTimer = null;
          }
          return { reloadCountdown: 0 };
        }
        return { reloadCountdown: newCountdown };
      });
    }, 1000);

    // Set reload timer (5 seconds)
    this.reloadTimer = setTimeout(() => {
      console.log("Auto-reloading page due to error...");
      window.location.reload();
    }, 100);
  };

  componentWillUnmount() {
    // Clean up timers
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    if (this.reloadTimer) {
      clearTimeout(this.reloadTimer);
    }
  }

  handleReset = () => {
    // Clear timers
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    if (this.reloadTimer) {
      clearTimeout(this.reloadTimer);
    }
    // Immediately reload
    window.location.reload();
  };

  handleCancelAutoReload = () => {
    // Clear timers to cancel auto-reload
    if (this.countdownTimer) {
      clearInterval(this.countdownTimer);
    }
    if (this.reloadTimer) {
      clearTimeout(this.reloadTimer);
    }
    this.setState({ reloadCountdown: 0 });
  };

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <div className="min-h-screen bg-[#0f111a] text-white flex items-center justify-center p-4">
          <div className="max-w-2xl w-full bg-[#111422] border border-[#24283b] rounded-xl p-8">
            <h1 className="text-3xl font-bold text-red-400 mb-4">
              Something went wrong
            </h1>
            <p className="text-gray-300 mb-4">
              We're sorry, but something unexpected happened. The page will automatically reload in {this.state.reloadCountdown} seconds.
            </p>
            {this.state.reloadCountdown > 0 && (
              <div className="mb-6 p-3 bg-yellow-900/30 border border-yellow-700/50 rounded-lg">
                <p className="text-yellow-400 text-sm">
                  Auto-reloading in {this.state.reloadCountdown} second{this.state.reloadCountdown !== 1 ? 's' : ''}...
                </p>
                <button
                  onClick={this.handleCancelAutoReload}
                  className="mt-2 text-yellow-400 hover:text-yellow-300 text-sm underline"
                >
                  Cancel auto-reload
                </button>
              </div>
            )}
            {process.env.NODE_ENV === "development" && this.state.error && (
              <details className="mb-6">
                <summary className="cursor-pointer text-gray-400 hover:text-gray-300 mb-2">
                  Error Details (Development Only)
                </summary>
                <pre className="bg-[#0b0e19] p-4 rounded-lg overflow-auto text-sm text-red-300 max-h-64">
                  {this.state.error.toString()}
                  {this.state.errorInfo?.componentStack}
                </pre>
              </details>
            )}
            <div className="flex gap-4 flex-wrap">
              <button
                onClick={this.handleReset}
                className="px-6 py-3 bg-[#28e0b9] text-black font-semibold rounded-lg hover:bg-[#22c7a3] transition-colors"
              >
                Refresh Now
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="px-6 py-3 bg-[#24283b] text-white font-semibold rounded-lg hover:bg-[#2b2f40] transition-colors"
              >
                Go to Home
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;

