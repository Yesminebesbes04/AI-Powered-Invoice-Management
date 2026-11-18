import React, { useState } from 'react';
import CreateUserForm from './components/CreateUserForm';
import UserDirectory from './components/UserDirectory';
import { IconShield, IconUsers, IconSparkles } from './components/Icons';

export default function App() {
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const handleUserCreated = () => {
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="app-container">
      {/* Enterprise Header / Navbar */}
      <header
        className="glass-card"
        style={{
          padding: '1.25rem 2rem',
          marginBottom: '2rem',
          display: 'flex',
          alignItems: 'center',
          justify: 'space-between',
          flexWrap: 'wrap',
          gap: '1rem'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div
            style={{
              width: '42px',
              height: '42px',
              borderRadius: '0.75rem',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 8px 16px rgba(99, 102, 241, 0.4)'
            }}
          >
            <IconShield className="w-6 h-6" style={{ color: '#fff' }} />
          </div>
          <div>
            <h1 style={{ fontSize: '1.35rem', fontWeight: '800', color: '#fff', letterSpacing: '-0.02em' }}>
              Invoice Pro Enterprise
            </h1>
            <span style={{ fontSize: '0.8rem', color: '#818cf8', fontWeight: '500' }}>
              User Administration & Control Hub
            </span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: 'rgba(16, 185, 129, 0.15)',
              padding: '0.4rem 0.85rem',
              borderRadius: '9999px',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              fontSize: '0.8rem',
              color: '#34d399',
              fontWeight: '600'
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#34d399', display: 'inline-block' }} />
            System Active
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '2rem' }}>
        {/* Left Column: Create User Form */}
        <div>
          <CreateUserForm onUserCreated={handleUserCreated} />
        </div>

        {/* Right Column: User Directory */}
        <div>
          <UserDirectory refreshTrigger={refreshTrigger} />
        </div>
      </div>
    </div>
  );
}
