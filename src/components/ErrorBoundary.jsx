import React, { useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ErrorBoundary as ReactErrorBoundary } from 'react-error-boundary';
import { 
  AlertTriangle, 
  Home, 
  RefreshCw, 
  Copy, 
  Check, 
  Trash2,
  ChevronRight
} from 'lucide-react';
import styles from '../styles/ErrorBoundary.module.css';

const ErrorFallback = ({ error, resetErrorBoundary }) => {
  const [copied, setCopied] = useState(false);
  const isDev = process.env.NODE_ENV === 'development';

  const handleCopyError = useCallback(() => {
    const errorLog = `Error: ${error.message}\nStack: ${error.stack}`;
    navigator.clipboard.writeText(errorLog);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [error]);

  const handleHardReset = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = '/';
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.fallbackContainer} role="alert">
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <AlertTriangle className={styles.icon} />
          </div>
          <h1 className={styles.title}>System Interruption</h1>
          <p className={styles.message}>
            An unexpected error occurred. We've logged the technical details and our team is looking into it.
          </p>
        </div>

        <div className={styles.actions}>
          <button onClick={resetErrorBoundary} className={styles.primaryBtn}>
            <RefreshCw size={18} />
            Try Again
          </button>
          <Link to="/" onClick={resetErrorBoundary} className={styles.secondaryBtn}>
            <Home size={18} />
            Back to Dashboard
          </Link>
        </div>

        <div className={styles.supportActions}>
          <button onClick={handleCopyError} className={styles.textBtn}>
            {copied ? <Check size={16} color="#10b981" /> : <Copy size={16} />}
            {copied ? 'Copied Details' : 'Copy Error Details'}
          </button>
          <button onClick={handleHardReset} className={styles.textBtnDanger}>
            <Trash2 size={16} />
            Clear App Data & Reset
          </button>
        </div>

        {(isDev || true) && ( // Show in dev, or keep for "Advanced" users in prod
          <details className={styles.errorDetails}>
            <summary>
              <span>Technical Information</span>
              <ChevronRight size={16} className={styles.chevron} />
            </summary>
            <div className={styles.debugInfo}>
              <p><strong>Message:</strong> {error.message}</p>
              <pre>{error.stack}</pre>
            </div>
          </details>
        )}
      </div>
    </div>
  );
};

const ErrorBoundary = ({ children }) => {
  const location = useLocation();

  const logError = (error, info) => {
    // Integrate with services like Sentry, LogRocket, or Datadog here
    console.group('%c Error Boundary Caught Error', 'background: #fee2e2; color: #b91c1c; padding: 4px;');
    console.error("Error:", error);
    console.error("Component Stack:", info.componentStack);
    console.log("Path:", location.pathname);
    console.groupEnd();
  };

  return (
    <ReactErrorBoundary
      FallbackComponent={ErrorFallback}
      onError={logError}
      resetKeys={[location.pathname]}
    >
      {children}
    </ReactErrorBoundary>
  );
};

export default ErrorBoundary;