import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const History = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(null);
  const { token } = useAuth();

  const fetchHistory = useCallback(async () => {
    try {
      setLoading(true);
      const response = await axios.get('/diseases/history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistory(response.data);
    } catch (error) {
      toast.error('Failed to fetch history');
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);

  const deleteHistory = async (id) => {
    if (!window.confirm('Are you sure you want to delete this record?')) {
      return;
    }
    
    setDeleting(id);
    try {
      await axios.delete(`/diseases/history/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success('Record deleted successfully');
      setHistory(history.filter(item => item._id !== id));
    } catch (error) {
      toast.error('Failed to delete record');
    } finally {
      setDeleting(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem' }}>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>Loading history...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h2 style={{ color: '#2e7d32', marginBottom: '1.5rem' }}>Detection History</h2>
      
      {history.length === 0 ? (
        <div style={{ backgroundColor: 'white', padding: '3rem', borderRadius: '8px', textAlign: 'center', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
          <p style={{ fontSize: '1.1rem', color: '#666' }}>No detection history found.</p>
          <p style={{ color: '#999', marginTop: '0.5rem' }}>Upload some leaf images to get started!</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {history.map((item) => (
            <div key={item._id} style={{ 
              backgroundColor: 'white', 
              borderRadius: '8px', 
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)', 
              padding: '1rem',
              position: 'relative'
            }}>
              <div style={{ display: 'flex', flexDirection: 'row', gap: '1rem', flexWrap: 'wrap' }}>
                <div style={{ flex: '1', minWidth: '150px' }}>
                  <img 
                    src={`http://localhost:5000${item.imageUrl}`} 
                    alt="Leaf" 
                    style={{ width: '100%', height: '150px', objectFit: 'cover', borderRadius: '8px' }}
                    loading="lazy"
                  />
                </div>
                <div style={{ flex: '2', minWidth: '200px' }}>
                  <p style={{ color: '#666', fontSize: '0.875rem', marginBottom: '0.5rem' }}>
                    📅 {new Date(item.detectedAt).toLocaleString()}
                  </p>
                  <div style={{ backgroundColor: '#ffebee', padding: '0.75rem', borderRadius: '4px', marginBottom: '0.75rem' }}>
                    <p><strong>🦠 Disease:</strong> {item.diseaseName}</p>
                    <p><strong>📊 Confidence:</strong> {item.confidence}</p>
                  </div>
                  <div style={{ backgroundColor: '#e8f5e9', padding: '0.75rem', borderRadius: '4px' }}>
                    <p><strong>💡 Suggestion:</strong> {item.suggestion}</p>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                  <button
                    onClick={() => deleteHistory(item._id)}
                    disabled={deleting === item._id}
                    style={{
                      backgroundColor: '#f44336',
                      color: 'white',
                      border: 'none',
                      padding: '0.5rem 1rem',
                      borderRadius: '4px',
                      cursor: deleting === item._id ? 'not-allowed' : 'pointer',
                      fontSize: '0.9rem',
                      opacity: deleting === item._id ? 0.6 : 1,
                      transition: 'background-color 0.3s'
                    }}
                    onMouseEnter={(e) => {
                      if (!deleting) e.target.style.backgroundColor = '#d32f2f';
                    }}
                    onMouseLeave={(e) => {
                      if (!deleting) e.target.style.backgroundColor = '#f44336';
                    }}
                  >
                    {deleting === item._id ? 'Deleting...' : '🗑️ Delete'}
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default History;