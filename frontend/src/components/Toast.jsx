function Toast({ message, type = 'info' }) {
  const styles = {
    success: {
      gradient: 'from-green-500 to-green-600',
      border: 'border-green-400',
      shadow: 'shadow-green-500/50'
    },
    error: {
      gradient: 'from-red-500 to-red-600',
      border: 'border-red-400',
      shadow: 'shadow-red-500/50'
    },
    info: {
      gradient: 'from-blue-500 to-blue-600',
      border: 'border-blue-400',
      shadow: 'shadow-blue-500/50'
    },
    warning: {
      gradient: 'from-yellow-500 to-yellow-600',
      border: 'border-yellow-400',
      shadow: 'shadow-yellow-500/50'
    }
  }[type];

  const icon = {
    success: '✅',
    error: '❌',
    info: 'ℹ️',
    warning: '⚠️'
  }[type];

  return (
    <div className="fixed bottom-6 right-6 z-50 animate-slide-up">
      <div 
        className={`bg-gradient-to-r ${styles.gradient} text-white px-7 py-4 rounded-2xl shadow-2xl ${styles.shadow} flex items-center gap-3 max-w-md border-2 ${styles.border} backdrop-blur-sm transform transition-all duration-300 hover:scale-105`}
      >
        <span className="text-2xl animate-bounce">{icon}</span>
        <p className="font-semibold text-base">{message}</p>
      </div>
    </div>
  );
}

export default Toast;
