import React, { useState } from 'react';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const { token } = useAuth();

  const compressImage = (file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target.result;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          let width = img.width;
          let height = img.height;
          
          // Max dimensions
          const maxWidth = 1024;
          const maxHeight = 1024;
          
          if (width > height) {
            if (width > maxWidth) {
              height = (height * maxWidth) / width;
              width = maxWidth;
            }
          } else {
            if (height > maxHeight) {
              width = (width * maxHeight) / height;
              height = maxHeight;
            }
          }
          
          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0, width, height);
          
          canvas.toBlob((blob) => {
            resolve(new File([blob], file.name, { type: 'image/jpeg' }));
          }, 'image/jpeg', 0.7);
        };
      };
    });
  };

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (file) {
      // Compress image before preview
      const compressedFile = await compressImage(file);
      setSelectedFile(compressedFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(compressedFile);
      setResult(null);
      toast.success('Image loaded successfully');
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      toast.error('Please select an image first');
      return;
    }

    const formData = new FormData();
    formData.append('image', selectedFile);

    setLoading(true);
    try {
      const response = await axios.post('/diseases/detect', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`
        },
        timeout: 30000 // 30 second timeout
      });
      
      setResult(response.data);
      toast.success('Detection complete!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Detection failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <div style={{ backgroundColor: 'white', borderRadius: '8px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)', padding: '2rem', marginBottom: '2rem' }}>
        <h2 style={{ color: '#2e7d32', marginBottom: '0.5rem' }}>Upload Leaf Image</h2>
        <p style={{ color: '#666', marginBottom: '1.5rem' }}>Upload a clear image of the affected leaf for disease detection</p>
        
        <div style={{ border: '2px dashed #ccc', borderRadius: '8px', padding: '2rem', textAlign: 'center' }}>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            style={{ display: 'none' }}
            id="imageUpload"
          />
          <label htmlFor="imageUpload" style={{ 
            backgroundColor: '#2e7d32', 
            color: 'white', 
            padding: '0.75rem 1.5rem', 
            borderRadius: '4px', 
            cursor: 'pointer', 
            display: 'inline-block',
            transition: 'background-color 0.3s'
          }}>
            📸 Choose Image
          </label>
          
          {preview && (
            <div style={{ marginTop: '1.5rem' }}>
              <img 
                src={preview} 
                alt="Preview" 
                style={{ 
                  maxWidth: '100%', 
                  maxHeight: '300px', 
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                }} 
              />
              <br />
              <button
                onClick={handleUpload}
                disabled={loading}
                style={{ 
                  marginTop: '1rem', 
                  backgroundColor: loading ? '#ccc' : '#1976d2', 
                  color: 'white', 
                  padding: '0.75rem 1.5rem', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '1rem',
                  transition: 'background-color 0.3s'
                }}
              >
                {loading ? '🔍 Detecting...' : '🔬 Detect Disease'}
              </button>
            </div>
          )}
        </div>
      </div>

      {result && (
        <div style={{ 
          backgroundColor: 'white', 
          borderRadius: '8px', 
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
          padding: '2rem',
          animation: 'fadeIn 0.5s'
        }}>
          <h3 style={{ color: '#2e7d32', marginBottom: '1rem' }}>📋 Detection Result</h3>
          <div style={{ backgroundColor: '#ffebee', borderLeft: '4px solid #f44336', padding: '1rem', marginBottom: '1rem', borderRadius: '4px' }}>
            <p style={{ fontSize: '1.1rem' }}><strong>🦠 Disease:</strong> {result.disease}</p>
            <p><strong>📊 Confidence:</strong> {result.confidence}</p>
          </div>
          <div style={{ backgroundColor: '#e8f5e9', borderLeft: '4px solid #4caf50', padding: '1rem', borderRadius: '4px' }}>
            <p><strong>💡 Treatment Suggestion:</strong></p>
            <p style={{ marginTop: '0.5rem', lineHeight: '1.6' }}>{result.suggestion}</p>
          </div>
        </div>
      )}
      
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(10px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}
      </style>
    </div>
  );
};

export default Dashboard;