import React, { useState } from 'react';
import UploadArea from './components/UploadArea';
import ResultDisplay from './components/ResultDisplay';
import './App.css';

function AnimatedBackground() {
  return (
    <div className="animated-bg">
      <div className="bg-gradient-overlay"></div>
      <div className="floating-orb orb-1"></div>
      <div className="floating-orb orb-2"></div>
      <div className="floating-orb orb-3"></div>
      <div className="floating-orb orb-4"></div>
      <div className="grid-pattern"></div>
      <div className="noise-overlay"></div>
    </div>
  );
}

function LoadingStep({ icon, text, isActive }) {
  return (
    <div className={`loading-step ${isActive ? 'active' : ''}`}>
      <div className="loading-step-icon">
        {icon}
      </div>
      <span className="loading-step-text">{text}</span>
    </div>
  );
}

function App() {
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [loadingStep, setLoadingStep] = useState(0);

  const handleImageSelect = (file) => {
    if (file) {
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
      setResult(null);
      setError(null);
    }
  };

  const handleScan = async () => {
    if (!selectedImage) return;

    setIsLoading(true);
    setError(null);
    setResult(null);
    setLoadingStep(0);

    const steps = [
      'Uploading image...',
      'Preprocessing...',
      'Running AI analysis...',
      'Generating results...'
    ];

    let stepIndex = 0;
    const stepInterval = setInterval(() => {
      stepIndex++;
      if (stepIndex < steps.length) {
        setLoadingStep(stepIndex);
      }
    }, 500);

    const formData = new FormData();
    formData.append('image', selectedImage);

    try {
      const response = await fetch('/api/predict', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Prediction failed');
      }

      setLoadingStep(steps.length - 1);
      clearInterval(stepInterval);
      setResult(data.prediction);
    } catch (err) {
      clearInterval(stepInterval);
      setError(err.message || 'Failed to analyze image. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }
    setSelectedImage(null);
    setPreviewUrl(null);
    setResult(null);
    setError(null);
    setLoadingStep(0);
  };

  const loadingSteps = [
    { icon: '📤', text: 'Uploading image' },
    { icon: '⚙️', text: 'Preprocessing' },
    { icon: '🤖', text: 'Running AI analysis' },
    { icon: '✅', text: 'Generating results' }
  ];

  return (
    <>
      <AnimatedBackground />
      <div className="app">
        <header className="header">
          <div className="badge-container">
            <div className="badge">
              <span>Powered by AI</span>
            </div>
          </div>
          
          <div className="logo">
            <span className="logo-icon">₹</span>
            <h1>TrueRupee</h1>
          </div>
          <p className="tagline">Instant Indian Currency Verification</p>
        </header>

        <main className="main-content">
          {!result && !isLoading && !error && (
            <UploadArea 
              onImageSelect={handleImageSelect}
              selectedImage={selectedImage}
              previewUrl={previewUrl}
              onScan={handleScan}
            />
          )}

          {isLoading && (
            <div className="hero-card">
              <div className="card-glow"></div>
              <div className="loading-container">
                <div className="scanner-container">
                  <div className="scanner-ring"></div>
                  <div className="scanner-ring"></div>
                  <div className="scanner-ring"></div>
                  <div className="scanner-core">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 01-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 014.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0112 15a9.065 9.065 0 00-6.23.693L5 14.5m14.8.8l1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0112 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
                    </svg>
                  </div>
                </div>
                <p className="loading-text">Analyzing Currency</p>
                <p className="loading-subtext">Please wait while our AI examines the note</p>
                
                <div className="loading-steps">
                  {loadingSteps.map((step, index) => (
                    <LoadingStep 
                      key={index}
                      icon={
                        index <= loadingStep ? (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        ) : null
                      }
                      text={step.text}
                      isActive={index === loadingStep}
                    />
                  ))}
                </div>
                
                <div className="loading-progress">
                  <div className="loading-progress-bar"></div>
                </div>
              </div>
            </div>
          )}

          {result && (
            <ResultDisplay 
              result={result} 
              previewUrl={previewUrl}
              onReset={handleReset}
            />
          )}

          {error && (
            <div className="hero-card">
              <div className="card-glow"></div>
              <div className="error-container">
                <div className="error-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z" />
                  </svg>
                </div>
                <p className="error-text">{error}</p>
                <button className="btn-secondary" onClick={handleReset}>
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 15L3 9m0 0l6-6M3 9h12a6 6 0 010 12h-3" />
                  </svg>
                  Try Again
                </button>
              </div>
            </div>
          )}
        </main>

        <footer className="footer">
          <div className="footer-content">
            <span>Advanced Deep Learning Technology</span>
            <span className="footer-divider"></span>
            <span>Made with precision</span>
          </div>
        </footer>
      </div>
    </>
  );
}

export default App;
