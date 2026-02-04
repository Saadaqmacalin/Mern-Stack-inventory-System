import React from 'react';

const TestStyles = () => {
  return (
    <div className="p-8 space-y-4">
      {/* Test basic Tailwind classes */}
      <div className="bg-blue-500 text-white p-4 rounded-lg">
        This should be blue with white text
      </div>
      
      {/* Test gradient */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 rounded-lg">
        This should have a blue gradient
      </div>
      
      {/* Test shadow */}
      <div className="bg-white p-4 rounded-lg shadow-2xl border border-gray-200">
        This should have a strong shadow
      </div>
      
      {/* Test hover effect */}
      <div className="bg-green-500 text-white p-4 rounded-lg hover:bg-green-600 transition-colors">
        Hover over this to see color change
      </div>
    </div>
  );
};

export default TestStyles;
