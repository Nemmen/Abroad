import React, { useState } from 'react';
import { User } from 'lucide-react';
import clsx from 'clsx';


export function Button({ children, variant = 'default', className, ...props }) {
  const variants = {
    default: 'bg-blue-600 text-white hover:bg-blue-700',
    outline: 'border border-gray-300 text-gray-700 hover:bg-gray-100',
  };

  return (
    <button
      className={clsx(
        'px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-offset-2',
        variants[variant],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}

export function StudentList({ students }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {(expanded ? students : students.slice(0, 12)).map((student, index) => (
          <div
            key={index}
            className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg"
          >
            <div className="text-gray-500">
              <User className="w-5 h-5" />
            </div>
            <span className="font-medium text-gray-700">{student.name}</span>
          </div>
        ))}
      </div>
      {students.length > 12 && (
        <Button
          variant="outline"
          className="mt-6"
          onClick={() => setExpanded(!expanded)}
        >
          {expanded ? 'Show Less' : `Show All (${students.length})`}
        </Button>
      )}
    </div>
  );
}
