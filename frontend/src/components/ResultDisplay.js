import React, { useEffect, useState } from 'react';

function ResultDisplay({ result, previewUrl, onReset }) {
  const [animatedConfidence, setAnimatedConfidence] = useState(0);
  const isReal = result.class === 'Real';
  const confidencePercent = (result.confidence * 100).toFixed(2);

  useEffect(() => {
    const timer = setTimeout(() => {
      setAnimatedConfidence(parseFloat(confidencePercent));
    }, 300);
    return () => clearTimeout(timer);
  }, [confidencePercent]);

  const styles = {
    '--result-gradient': isReal 
      ? 'linear-gradient(135deg, #10b981, #06b6d4)' 
      : 'linear-gradient(135deg, #ef4444, #f97316)',
    '--result-color': isReal ? '#10b981' : '#ef4444',
    '--result-badge-bg': isReal 
      ? 'rgba(16, 185, 129, 0.1)' 
      : 'rgba(239, 68, 68, 0.1)',
    '--result-badge-border': isReal 
      ? 'rgba(16, 185, 129, 0.3)' 
      : 'rgba(239, 68, 68, 0.3)',
  };

  return (
    <div className="hero-card" style={styles}>
      <div className="card-glow"></div>
      <div className="result-container">
        <div className="result-image-wrapper" style={styles}>
          <img 
            src={previewUrl} 
            alt="Scanned currency" 
            className="result-image"
          />
        </div>
        
        <div className="result-header">
          <div className="result-badge" style={styles}>
            {isReal ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
              </svg>
            )}
            Verification Complete
          </div>
          
          <h2 className={`result-value ${isReal ? 'real' : 'fake'}`}>
            {result.class}
          </h2>
          
          <p className="result-description">
            {isReal 
              ? 'This currency appears to be authentic' 
              : 'This currency may be counterfeit'}
          </p>
        </div>

        <div className="confidence-container">
          <div className="confidence-header">
            <span className="confidence-label">Confidence Score</span>
            <span className="confidence-value">{confidencePercent}%</span>
          </div>
          <div className="confidence-bar-bg">
            <div 
              className={`confidence-bar ${isReal ? 'real' : 'fake'}`}
              style={{ width: `${animatedConfidence}%` }}
            ></div>
          </div>
          <div className="confidence-details">
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        <button className="btn-secondary" onClick={onReset}>
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
          </svg>
          Scan Another Note
        </button>
      </div>
    </div>
  );
}

export default ResultDisplay;
