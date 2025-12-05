import { RefreshCw } from 'lucide-react';

const RefreshButton = ({ onClick, isLoading, className = "" }) => {
  return (
    <button
      onClick={onClick}
      disabled={isLoading}
      title="Refresh Data"
      className={`
        group relative p-2 rounded-lg transition-all duration-200 ease-in-out
        hover:bg-blue-50 active:scale-95 border border-transparent hover:border-blue-100
        disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:bg-transparent
        ${className}
      `}
    >
      <RefreshCw 
        className={`
          w-4 h-4 text-gray-500 group-hover:text-blue-600 transition-colors cursor-pointer
          ${isLoading ? 'animate-spin text-blue-600' : ''}
        `} 
      />
    </button>
  );
};

export default RefreshButton;