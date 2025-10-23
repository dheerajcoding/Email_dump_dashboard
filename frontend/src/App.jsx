import { useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import axios from 'axios';
import Dashboard from './components/Dashboard';
import Header from './components/Header';
import Toast from './components/Toast';

// Use environment variable for API URL
// In development: http://localhost:5000
// In production: Set VITE_API_URL to your Render backend URL
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const socket = io(API_URL);

function App() {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalLeads: 0, latestUpdate: null, currentDate: null });
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0, date: null });
  const [toast, setToast] = useState({ show: false, message: '', type: 'info' });

  // Fetch leads with pagination (default: page 1, limit 500)
  const fetchLeads = async (page = 1, limit = 500) => {
    try {
      setLoading(true);
      const response = await axios.get(`${API_URL}/api/leads?page=${page}&limit=${limit}`);
      if (response.data.success) {
        setLeads(response.data.data);
        setPagination({
          page: response.data.page,
          totalPages: response.data.totalPages,
          total: response.data.total,
          date: response.data.date
        });
        console.log(`✅ Loaded ${response.data.count} of ${response.data.total} leads (Page ${response.data.page})`);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
      showToast('Error fetching leads', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Fetch statistics
  const fetchStats = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/stats`);
      if (response.data.success) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  // Handle page change
  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= pagination.totalPages) {
      fetchLeads(newPage);
    }
  };

  // Show toast notification
  const showToast = (message, type = 'info') => {
    setToast({ show: true, message, type });
    setTimeout(() => {
      setToast({ show: false, message: '', type: 'info' });
    }, 5000);
  };

  // Initial data fetch
  useEffect(() => {
    fetchLeads();
    fetchStats();
  }, []);

  // Socket.io event listeners
  useEffect(() => {
    socket.on('connect', () => {
      console.log('✅ Connected to server');
    });

    socket.on('new-leads', (data) => {
      console.log('📡 New leads received:', data);
      showToast(`${data.count} new leads added from ${data.email.fileName}`, 'success');
      
      // Reload current page to show new leads
      fetchLeads(pagination.page);
      fetchStats();
    });

    socket.on('database-cleared', (data) => {
      console.log('🗑️ Database cleared:', data);
      showToast(`New day started! Database cleared: ${data.deletedCount} leads removed`, 'info');
      setLeads([]);
      setPagination({ page: 1, totalPages: 1, total: 0, date: data.newDate });
      fetchStats();
    });

    socket.on('disconnect', () => {
      console.log('❌ Disconnected from server');
    });

    return () => {
      socket.off('connect');
      socket.off('new-leads');
      socket.off('database-cleared');
      socket.off('disconnect');
    };
  }, [pagination.page]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100 flex flex-col">
      <Header 
        stats={stats} 
        onRefresh={() => { 
          fetchLeads(pagination.page); 
          fetchStats(); 
        }} 
      />
      <div className="flex-1">
        <Dashboard 
          leads={leads} 
          loading={loading} 
          pagination={pagination}
          onPageChange={handlePageChange}
        />
      </div>
      {toast.show && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
}

export default App;
