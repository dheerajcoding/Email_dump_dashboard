import { useState, useMemo } from 'react';
import LeadsTable from './LeadsTable';
import { FiSearch, FiX, FiChevronLeft, FiChevronRight, FiDownload } from 'react-icons/fi';
import axios from 'axios';

function Dashboard({ leads, loading, pagination, onPageChange }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [exporting, setExporting] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

  // Filter leads based on search term
  const filteredLeads = useMemo(() => {
    if (!searchTerm) return leads;

    return leads.filter(lead => {
      const searchLower = searchTerm.toLowerCase();
      
      // Search in all data fields
      if (lead.data) {
        const dataValues = Object.values(lead.data).join(' ').toLowerCase();
        if (dataValues.includes(searchLower)) return true;
      }

      // Search in metadata
      if (lead.emailSubject?.toLowerCase().includes(searchLower)) return true;
      if (lead.fileName?.toLowerCase().includes(searchLower)) return true;

      return false;
    });
  }, [leads, searchTerm]);

  // Export all leads to Excel
  const handleExport = async () => {
    try {
      setExporting(true);
      const response = await axios.get(`${API_URL}/api/leads/export`, {
        responseType: 'blob'
      });

      // Create download link
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      const date = new Date().toISOString().split('T')[0];
      link.setAttribute('download', `leads_${date}.xlsx`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting leads:', error);
      alert('Failed to export leads. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Current Date Info */}
      <div className="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-center justify-between">
        <p className="text-sm text-blue-800">
          📅 Showing leads for: <span className="font-semibold">{pagination.date || new Date().toISOString().split('T')[0]}</span>
          {' '} | Total: <span className="font-semibold">{pagination.total || 0}</span> leads
        </p>
        <button
          onClick={handleExport}
          disabled={exporting || pagination.total === 0}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors text-sm font-medium"
        >
          <FiDownload className="w-4 h-4" />
          {exporting ? 'Exporting...' : 'Export to Excel'}
        </button>
      </div>

      {/* Search Bar */}
      <div className="mb-6 bg-white rounded-lg shadow-md p-4">
        <div className="relative">
          <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search leads by any field..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="mt-2 text-sm text-gray-600">
            Showing {filteredLeads.length} of {leads.length} leads
          </p>
        )}
      </div>

      {/* Leads Table */}
      {filteredLeads.length === 0 ? (
        <div className="bg-white rounded-lg shadow-md p-12 text-center">
          <div className="text-gray-400 mb-4">
            <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {searchTerm ? 'No leads found' : 'No leads yet for today'}
          </h3>
          <p className="text-gray-600">
            {searchTerm 
              ? 'Try adjusting your search term' 
              : 'Waiting for new emails with lead data...'}
          </p>
        </div>
      ) : (
        <>
          <LeadsTable leads={filteredLeads} />
          
          {/* Pagination Controls */}
          {pagination.totalPages > 1 && (
            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  Page <span className="font-semibold">{pagination.page}</span> of{' '}
                  <span className="font-semibold">{pagination.totalPages}</span>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => onPageChange(pagination.page - 1)}
                    disabled={pagination.page === 1}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    <FiChevronLeft className="w-4 h-4" />
                    Previous
                  </button>
                  
                  <button
                    onClick={() => onPageChange(pagination.page + 1)}
                    disabled={pagination.page === pagination.totalPages}
                    className="flex items-center gap-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                    <FiChevronRight className="w-4 h-4" />
                  </button>
                </div>
                
                <div className="text-sm text-gray-600">
                  Showing <span className="font-semibold">{leads.length}</span> of{' '}
                  <span className="font-semibold">{pagination.total}</span> leads
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}

export default Dashboard;
