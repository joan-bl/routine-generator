import React from 'react';

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    this.setState({
      error: error,
      errorInfo: errorInfo
    });
    
    // Log error to console in development
    if (process.env.NODE_ENV === 'development') {
      console.error('Error caught by boundary:', error, errorInfo);
    }
  }

  handleRetry = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary">
          <div className="error-content">
            <h2>¡Oops! Algo salió mal</h2>
            <p>Ha ocurrido un error inesperado en la aplicación.</p>
            <details style={{ whiteSpace: 'pre-wrap', marginTop: '20px' }}>
              <summary>Detalles del error (para desarrolladores)</summary>
              {this.state.error && this.state.error.toString()}
              <br />
              {this.state.errorInfo.componentStack}
            </details>
            <div className="error-actions">
              <button onClick={this.handleRetry} className="retry-button">
                Intentar de nuevo
              </button>
              <button 
                onClick={() => window.location.reload()} 
                className="reload-button"
              >
                Recargar página
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