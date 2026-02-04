import React from 'react';

function App() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: 'white',
      fontSize: '24px',
      fontFamily: 'Arial, sans-serif'
    }}>
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        backdropFilter: 'blur(10px)',
        padding: '40px',
        borderRadius: '20px',
        textAlign: 'center'
      }}>
        <h1>Inventory Management System</h1>
        <p>App is working! 🎉</p>
        <p style={{ fontSize: '16px', marginTop: '20px' }}>
          If you can see this, the basic React app is working.
        </p>
      </div>
    </div>
  );
}

export default App;
