
import React from 'react';
import { Person, useTaskContext } from '@/contexts/TaskContext';
import { cn } from '@/lib/utils';

const PersonFilter: React.FC = () => {
  const { filterByPerson, setFilterByPerson } = useTaskContext();
  
  const filters: Array<{ label: string; value: Person | 'All' }> = [
    { label: 'All', value: 'All' },
    { label: 'Person A', value: 'A' },
    { label: 'Person B', value: 'B' },
    { label: 'Both', value: 'Both' },
  ];

  return (
    <div className="w-full mb-6 animate-fade-in">
      <div className="flex justify-center space-x-2 py-2 px-4 overflow-x-auto">
        {filters.map((filter) => (
          <button
            key={filter.value}
            onClick={() => setFilterByPerson(filter.value)}
            className={cn(
              "px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 focus-ring",
              filterByPerson === filter.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-secondary/50 text-muted-foreground hover:bg-secondary"
            )}
          >
            {filter.label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default PersonFilter;
