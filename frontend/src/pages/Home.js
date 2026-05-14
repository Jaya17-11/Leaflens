import React from 'react';
import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', color: '#2e7d32', marginBottom: '1rem' }}>
          Welcome to Crop Disease Detection System
        </h1>
        <p style={{ fontSize: '1.2rem', color: '#666', maxWidth: '800px', margin: '0 auto' }}>
          Protect your crops with our advanced disease detection technology.
          Upload leaf images and get instant disease identification along with treatment suggestions.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '2rem', marginBottom: '3rem' }}>
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>📸</div>
          <h3>Upload Images</h3>
          <p>Simply take a photo of the affected leaf and upload it to our system</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🔍</div>
          <h3>Instant Detection</h3>
          <p>Get immediate results identifying the disease affecting your crops</p>
        </div>
        
        <div style={{ backgroundColor: 'white', padding: '1.5rem', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>💡</div>
          <h3>Treatment Advice</h3>
          <p>Receive expert suggestions on how to treat and prevent the disease</p>
        </div>
      </div>

      <div style={{ backgroundColor: '#e8f5e9', padding: '2rem', borderRadius: '8px', textAlign: 'center' }}>
        <h2 style={{ color: '#2e7d32', marginBottom: '1rem' }}>Ready to protect your crops?</h2>
        <p style={{ marginBottom: '1.5rem' }}>Join thousands of farmers who trust our disease detection system</p>
        <Link to="/register" style={{
          backgroundColor: '#2e7d32',
          color: 'white',
          padding: '0.75rem 1.5rem',
          borderRadius: '4px',
          textDecoration: 'none',
          display: 'inline-block'
        }}>
          Get Started Now
        </Link>
      </div>
    </div>
  );
};

export default Home;