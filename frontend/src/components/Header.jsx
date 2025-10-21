import { FiRefreshCw, FiDatabase, FiClock } from 'react-icons/fi';

function Header({ stats, onRefresh }) {
  const formatDate = (date) => {
    if (!date) return 'Never';
    return new Date(date).toLocaleString('en-IN', {
      timeZone: 'Asia/Kolkata',
      dateStyle: 'medium',
      timeStyle: 'short'
    });
  };

  return (
    <header className="bg-white shadow-md border-b-4 border-blue-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              📧 Email Lead Sync Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-600">
              Automatically syncing Policy Bazaar leads from email
            </p>
          </div>
          
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors duration-200 shadow-md hover:shadow-lg"
          >
            <FiRefreshCw className="w-4 h-4" />
            Refresh
          </button>
        </div>

        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-lg">
                <FiDatabase className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Total Leads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalLeads.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-green-500 rounded-lg">
                <FiClock className="w-6 h-6 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-gray-600">Last Updated</p>
                <p className="text-lg font-semibold text-gray-900">{formatDate(stats.latestUpdate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
