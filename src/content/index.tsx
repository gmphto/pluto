import React from 'react';
import ReactDOM from 'react-dom/client';
import { ContentApp } from './contentApp';

// Wait for page to be ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initialize);
} else {
  initialize();
}

function initialize() {
  console.log('Pinterest Stats Analyzer content script loaded');

  // Create container for floating button
  const buttonContainer = document.createElement('div');
  buttonContainer.id = 'pinterest-stats-floating-button';
  document.body.appendChild(buttonContainer);

  // Render the content app
  const root = ReactDOM.createRoot(buttonContainer);
  root.render(<ContentApp />);

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    root.unmount();
    buttonContainer.remove();
  });
}
