import { FiX } from 'react-icons/fi';

function LeadDetailModal({ lead, onClose }) {
  if (!lead) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-blue-600 text-white px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">Lead Details</h2>
          <button
            onClick={onClose}
            className="text-white hover:bg-blue-700 rounded-full p-2 transition-colors"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Metadata Section */}
          <div className="mb-6 bg-gray-50 rounded-lg p-4 border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">📧 Source Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <p className="text-sm text-gray-600">Email Subject</p>
                <p className="font-medium text-gray-900">{lead.emailSubject || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">File Name</p>
                <p className="font-medium text-gray-900">{lead.fileName || 'N/A'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Fetched At</p>
                <p className="font-medium text-gray-900">
                  {lead.fetchedAt ? new Date(lead.fetchedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date</p>
                <p className="font-medium text-gray-900">{lead.date || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Lead Data Section */}
          <div className="bg-white rounded-lg border border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800 mb-3 px-4 pt-4">📊 Lead Data</h3>
            <div className="divide-y divide-gray-200">
              {lead.data && Object.entries(lead.data).map(([key, value], index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-2 px-4 py-3 hover:bg-gray-50 transition-colors"
                >
                  <div className="text-sm font-semibold text-gray-700 break-words">
                    {key}
                  </div>
                  <div className="text-sm text-gray-900 break-words">
                    {value !== null && value !== undefined && value !== '' ? (
                      <span className="font-medium">{String(value)}</span>
                    ) : (
                      <span className="text-gray-400 italic">Empty</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeadDetailModal;
