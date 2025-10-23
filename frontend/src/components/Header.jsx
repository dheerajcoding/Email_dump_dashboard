import { FiRefreshCw, FiDatabase, FiClock, FiTrendingUp } from 'react-icons/fi';

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
    <header className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-800 shadow-2xl">
      <div className="px-6 sm:px-8 lg:px-12 py-8">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-4">
            <div className="bg-white p-3 rounded-xl shadow-lg">
              <span className="text-4xl">📧</span>
            </div>
            <div>
              <h1 className="text-4xl font-bold text-white drop-shadow-lg">
                Email Lead Sync Dashboard
              </h1>
              <p className="mt-1 text-blue-100 text-sm font-medium flex items-center gap-2">
                <FiTrendingUp className="w-4 h-4" />
                Automatically syncing Policy Bazaar leads from email
              </p>
            </div>
          </div>
          
          <button
            onClick={onRefresh}
            className="flex items-center gap-2 px-6 py-3 bg-white text-blue-700 rounded-xl hover:bg-blue-50 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:scale-105 font-semibold"
          >
            <FiRefreshCw className="w-5 h-5" />
            Refresh
          </button>
        </div>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl shadow-lg">
                <FiDatabase className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-100">Total Leads</p>
                <p className="text-4xl font-bold text-white mt-1">{stats.totalLeads.toLocaleString()}</p>
              </div>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 shadow-xl hover:shadow-2xl transition-shadow duration-300">
            <div className="flex items-center gap-4">
              <div className="p-4 bg-gradient-to-br from-green-400 to-green-600 rounded-xl shadow-lg">
                <FiClock className="w-8 h-8 text-white" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-100">Last Updated</p>
                <p className="text-xl font-semibold text-white mt-1">{formatDate(stats.latestUpdate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Header;
