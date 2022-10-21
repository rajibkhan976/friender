import React from 'react';
import Routeing from './Route';
import { DarkModeProvider } from './context/DarkModeContext';

function App() {
  return (
    <div className="app">
      <DarkModeProvider>
        <Routeing />  
      </DarkModeProvider>
    </div>
  );
}

export default App; 
