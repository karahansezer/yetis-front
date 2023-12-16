import React from 'react';
import Navigator from './src/components/navigation/Navigator';
import { AuthProvider } from './src/contexts/AuthContext';

export default function App() {
  return (
    <AuthProvider>
      <Navigator/>
    </AuthProvider>
  );
}