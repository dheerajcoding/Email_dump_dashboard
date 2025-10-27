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
      
      // If there's a search term, export filtered leads
      if (searchTerm && filteredLeads.length > 0) {
        exportFilteredLeads();
      } else {
        // Export all leads from backend
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
      }
    } catch (error) {
      console.error('Error exporting leads:', error);
      alert('Failed to export leads. Please try again.');
    } finally {
      setExporting(false);
    }
  };

  // Export filtered leads (client-side)
  const exportFilteredLeads = () => {
    const XLSX = window.XLSX;
    if (!XLSX) {
      alert('Export library not loaded. Please refresh the page.');
      return;
    }

    // Prepare data
    const excelData = filteredLeads.map((lead, index) => ({
      '#': index + 1,
      ...lead.data,
      'File Name': lead.fileName,
      'Fetched At': new Date(lead.fetchedAt).toLocaleString(),
      'Date': lead.date
    }));

    // Create workbook
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(excelData);
    XLSX.utils.book_append_sheet(wb, ws, 'Filtered Leads');

    // Download
    const date = new Date().toISOString().split('T')[0];
    XLSX.writeFile(wb, `filtered_leads_${date}.xlsx`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="px-6 sm:px-8 lg:px-12 py-8 h-full">
      {/* Top Bar with Date Info and Export */}
      <div className="mb-6 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-2xl p-4 shadow-xl flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="bg-white/20 backdrop-blur-sm p-3 rounded-xl">
            <span className="text-2xl">📅</span>
          </div>
          <div>
            <p className="text-sm text-blue-100 font-medium">Showing leads for</p>
            <p className="text-lg font-bold text-white">
              {pagination.date || new Date().toISOString().split('T')[0]}
              <span className="ml-3 text-blue-200">•</span>
              <span className="ml-3 text-blue-100">Total: {pagination.total || 0} leads</span>
            </p>
          </div>
        </div>
        <button
          onClick={handleExport}
          disabled={exporting || pagination.total === 0}
          className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl hover:bg-blue-50 disabled:bg-gray-200 disabled:text-gray-500 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl font-semibold transform hover:scale-105"
        >
          <FiDownload className="w-5 h-5" />
          {exporting ? 'Exporting...' : searchTerm ? `Export Filtered (${filteredLeads.length})` : 'Export All to Excel'}
        </button>
      </div>

      {/* Pagination Controls - Top */}
      {pagination.totalPages > 1 && (
        <div className="mb-6 bg-white rounded-2xl shadow-xl p-5 border border-gray-200">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-600 font-medium">
              Page <span className="font-bold text-blue-600">{pagination.page}</span> of{' '}
              <span className="font-bold text-blue-600">{pagination.totalPages}</span>
            </div>
            
            <div className="flex gap-3">
              <button
                onClick={() => onPageChange(pagination.page - 1)}
                disabled={pagination.page === 1}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg font-medium transform hover:scale-105"
              >
                <FiChevronLeft className="w-4 h-4" />
                Previous
              </button>
              
              <button
                onClick={() => onPageChange(pagination.page + 1)}
                disabled={pagination.page === pagination.totalPages}
                className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed transition-all duration-200 shadow-md hover:shadow-lg font-medium transform hover:scale-105"
              >
                Next
                <FiChevronRight className="w-4 h-4" />
              </button>
            </div>
            
            <div className="text-sm text-gray-600 font-medium">
              Showing <span className="font-bold text-blue-600">{(pagination.page - 1) * 500 + 1}-{Math.min(pagination.page * 500, pagination.total)}</span> of{' '}
              <span className="font-bold text-blue-600">{pagination.total}</span>
            </div>
          </div>
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-6 bg-white rounded-2xl shadow-xl p-6 border border-gray-200">
        <div className="relative">
          <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="🔍 Search leads by any field..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-12 py-4 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-200 text-gray-700 placeholder-gray-400 font-medium"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FiX className="w-5 h-5" />
            </button>
          )}
        </div>
        {searchTerm && (
          <p className="mt-3 text-sm text-gray-600 flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Showing <span className="font-bold text-blue-600">{filteredLeads.length}</span> of <span className="font-bold">{leads.length}</span> leads
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
          
          {/* Pagination Controls - Bottom */}
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
                  Showing <span className="font-semibold">{(pagination.page - 1) * 500 + 1}-{Math.min(pagination.page * 500, pagination.total)}</span> of{' '}
                  <span className="font-semibold">{pagination.total}</span>
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
