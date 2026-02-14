import React from 'react';

const Table = ({ 
  columns = [], 
  data = [], 
  headers, // For backward compatibility
  loading = false,
  emptyMessage = "No data available",
  pagination = false, // Placeholder for now
  children, 
  className = '' 
}) => {
  // If headers were passed (old pattern), use them
  const columnHeaders = columns.length > 0 
    ? columns.map(col => col.title) 
    : (headers || []);

  const renderContent = () => {
    if (loading) {
      return (
        <tr>
          <td colSpan={columnHeaders.length || 1} className="px-6 py-10 text-center">
            <div className="flex justify-center items-center space-x-2">
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-100"></div>
              <div className="w-2 h-2 bg-indigo-600 rounded-full animate-bounce delay-200"></div>
              <span className="text-gray-500 font-medium ml-2">Loading data...</span>
            </div>
          </td>
        </tr>
      );
    }

    if (data.length === 0 && !children) {
      return (
        <tr>
          <td colSpan={columnHeaders.length || 1} className="px-6 py-10 text-center text-gray-500 font-medium italic">
            {emptyMessage}
          </td>
        </tr>
      );
    }

    if (children) return children;

    return data.map((row, rowIndex) => (
      <tr key={row._id || rowIndex} className="hover:bg-gray-50/50 dark:hover:bg-gray-700/50 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0">
        {columns.map((col, colIndex) => (
          <td key={colIndex} className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
            {col.render ? col.render(row[col.key], row) : row[col.key]}
          </td>
        ))}
      </tr>
    ));
  };

  return (
    <div className={`overflow-x-auto rounded-xl border border-gray-100 dark:border-gray-700 ${className}`}>
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50/80 dark:bg-gray-800/80 backdrop-blur-sm sticky top-0">
          <tr>
            {columnHeaders.map((header, index) => (
              <th
                key={index}
                scope="col"
                className="px-6 py-4 text-left text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider whitespace-nowrap"
              >
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-100 dark:divide-gray-700">
          {renderContent()}
        </tbody>
      </table>
    </div>
  );
};

const TRow = ({ children, onClick, className = '' }) => (
  <tr 
    onClick={onClick} 
    className={`hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors border-b border-gray-100 dark:border-gray-700 last:border-0 ${onClick ? 'cursor-pointer' : ''} ${className}`}
  >
    {children}
  </tr>
);

const TCell = ({ children, className = '' }) => (
  <td className={`px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300 font-medium ${className}`}>
    {children}
  </td>
);

export { Table, TRow, TCell };
