import { useState } from 'react';
import { FiEye } from 'react-icons/fi';
import LeadDetailModal from './LeadDetailModal';

function LeadsTable({ leads }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });
  const [selectedLead, setSelectedLead] = useState(null);

  // Get all unique column names from the lead data
  const getColumns = () => {
    if (leads.length === 0) return [];

    const columnSet = new Set();
    leads.forEach(lead => {
      if (lead.data) {
        Object.keys(lead.data).forEach(key => columnSet.add(key));
      }
    });

    return Array.from(columnSet);
  };

  const columns = getColumns();

  // Sort leads
  const sortedLeads = [...leads].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a.data?.[sortConfig.key] || '';
    const bValue = b.data?.[sortConfig.key] || '';

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <>
      <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
              <tr>
                <th className="table-header-style w-16 text-gray-700">#</th>
                <th className="table-header-style w-32 text-gray-700">Actions</th>
                {columns.map((column) => (
                  <th
                    key={column}
                    className="table-header-style cursor-pointer hover:bg-blue-50 transition-colors text-gray-700"
                    onClick={() => handleSort(column)}
                  >
                    <div className="flex items-center gap-2 font-semibold">
                      {column}
                      {sortConfig.key === column && (
                        <span className="text-blue-600 font-bold">{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                      )}
                    </div>
                  </th>
                ))}
                <th className="table-header-style text-gray-700">File Name</th>
                <th className="table-header-style text-gray-700">Fetched At</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {sortedLeads.map((lead, index) => (
                <tr
                  key={lead._id}
                  className={`hover:bg-blue-50 transition-all duration-150 ${
                    index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'
                  }`}
                >
                  <td className="table-cell-style font-bold text-gray-600">
                    {index + 1}
                  </td>
                  <td className="table-cell-style">
                    <button
                      onClick={() => setSelectedLead(lead)}
                      className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 text-sm font-medium shadow-md hover:shadow-lg transform hover:scale-105"
                      title="View full details"
                    >
                      <FiEye className="w-4 h-4" />
                      View
                    </button>
                  </td>
                  {columns.map((column) => (
                    <td key={column} className="table-cell-style text-gray-700">
                      {lead.data?.[column] || '-'}
                    </td>
                  ))}
                  <td className="table-cell-style text-xs text-gray-500">
                    {lead.fileName || '-'}
                  </td>
                  <td className="table-cell-style text-xs text-gray-500">
                    {formatDate(lead.fetchedAt)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t border-gray-200">
          <p className="text-sm text-gray-700 font-medium flex items-center gap-2">
            <span className="inline-block w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
            Showing <span className="font-bold text-blue-600">{sortedLeads.length}</span> leads
          </p>
        </div>
      </div>

      {/* Lead Detail Modal */}
      {selectedLead && (
        <LeadDetailModal
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
        />
      )}
    </>
  );
}

export default LeadsTable;
