import React from 'react';
import AuthWrapper from './components/AuthWrapper';
import { UserProfileProvider } from './components/UserProfileProvider';
import ErrorBoundary from './components/ErrorBoundary';
import './index.css';

function App() {
  return (
    <ErrorBoundary>
      <div className="min-h-screen">
        <UserProfileProvider>
          <AuthWrapper />
        </UserProfileProvider>
      </div>
    </ErrorBoundary>
  );
}

export default App;