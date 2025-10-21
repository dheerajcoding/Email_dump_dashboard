import { useState } from 'react';

function LeadsTable({ leads }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'asc' });

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
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 sticky top-0">
            <tr>
              <th className="table-header-style w-12">#</th>
              {columns.map((column) => (
                <th
                  key={column}
                  className="table-header-style cursor-pointer hover:bg-gray-200 transition-colors"
                  onClick={() => handleSort(column)}
                >
                  <div className="flex items-center gap-2">
                    {column}
                    {sortConfig.key === column && (
                      <span>{sortConfig.direction === 'asc' ? '↑' : '↓'}</span>
                    )}
                  </div>
                </th>
              ))}
              <th className="table-header-style">File Name</th>
              <th className="table-header-style">Fetched At</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedLeads.map((lead, index) => (
              <tr
                key={lead._id}
                className={`hover:bg-blue-50 transition-colors ${
                  index % 2 === 0 ? 'bg-white' : 'bg-gray-50'
                }`}
              >
                <td className="table-cell-style font-medium text-gray-500">
                  {index + 1}
                </td>
                {columns.map((column) => (
                  <td key={column} className="table-cell-style">
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
      
      <div className="bg-gray-50 px-4 py-3 border-t border-gray-200">
        <p className="text-sm text-gray-600">
          Showing <span className="font-semibold">{sortedLeads.length}</span> leads
        </p>
      </div>
    </div>
  );
}

export default LeadsTable;
