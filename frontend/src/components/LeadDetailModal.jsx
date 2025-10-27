import { FiX, FiEye } from 'react-icons/fi';

function LeadDetailModal({ lead, onClose }) {
  if (!lead) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 transition-all duration-300"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 py-5 flex items-center justify-between shadow-lg">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FiEye className="w-7 h-7" />
              Lead Details
            </h2>
            <p className="text-blue-100 text-sm mt-1 font-medium">Complete information about this lead</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white/20 rounded-xl p-2.5 transition-all duration-200 hover:rotate-90 transform"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-gray-50">
          {/* Metadata Section */}
          <div className="mb-6 bg-white rounded-2xl p-5 border-2 border-blue-100 shadow-md">
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-2xl">📧</span>
              Source Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Email Subject</p>
                <p className="font-semibold text-gray-900">{lead.emailSubject || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">File Name</p>
                <p className="font-semibold text-gray-900">{lead.fileName || 'N/A'}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Fetched At</p>
                <p className="font-semibold text-gray-900">
                  {lead.fetchedAt ? new Date(lead.fetchedAt).toLocaleString() : 'N/A'}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Date</p>
                <p className="font-semibold text-gray-900">{lead.date || 'N/A'}</p>
              </div>
            </div>
          </div>

          {/* Lead Data Section */}
          <div className="bg-white rounded-2xl border-2 border-gray-200 shadow-md overflow-hidden">
            <h3 className="text-lg font-bold text-gray-800 px-5 pt-5 pb-3 flex items-center gap-2 bg-gradient-to-r from-gray-50 to-white">
              <span className="text-2xl">📊</span>
              Lead Data
            </h3>
            <div className="divide-y divide-gray-200">
              {lead.data && Object.entries(lead.data).map(([key, value], index) => (
                <div
                  key={index}
                  className="grid grid-cols-1 md:grid-cols-2 gap-3 px-5 py-4 hover:bg-blue-50 transition-all duration-150"
                >
                  <div className="text-sm font-bold text-gray-700 break-words">
                    {key}
                  </div>
                  <div className="text-sm text-gray-900 break-words">
                    {value !== null && value !== undefined && value !== '' ? (
                      <span className="font-semibold">{String(value)}</span>
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
        <div className="bg-gradient-to-r from-gray-50 to-gray-100 px-6 py-4 border-t-2 border-gray-200 flex justify-end gap-3 shadow-inner">
          <button
            onClick={onClose}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 font-semibold shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default LeadDetailModal;
