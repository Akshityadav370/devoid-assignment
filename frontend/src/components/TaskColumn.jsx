import { useState } from 'react';
import TaskCard from './TaskCard';
import { FaPlus } from 'react-icons/fa';

const TaskColumn = ({
  title,
  tasks,
  status,
  onEditTask,
  onDeleteTask,
  onDrop,
}) => {
  const [draggedOver, setDraggedOver] = useState(false);

  const handleDragOver = (e) => {
    e.preventDefault();
    setDraggedOver(true);
  };

  const handleDragLeave = () => {
    setDraggedOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDraggedOver(false);
    onDrop(e, status);
  };

  const getColumnBackground = (status) => {
    switch (status) {
      case 'Todo':
        return 'bg-white border-l-4 border-l-blue-400 shadow-sm';
      case 'InProgress':
        return 'bg-white border-l-4 border-l-amber-400 shadow-sm';
      case 'Done':
        return 'bg-white border-l-4 border-l-green-400 shadow-sm';
      default:
        return 'bg-white border-l-4 border-l-gray-400 shadow-sm';
    }
  };

  const getHeaderColor = (status) => {
    switch (status) {
      case 'Todo':
        return 'text-blue-700';
      case 'InProgress':
        return 'text-amber-700';
      case 'Done':
        return 'text-green-700';
      default:
        return 'text-gray-700';
    }
  };

  return (
    <div className='flex-1 max-w-[300px]'>
      <div className={`rounded-lg p-4 ${getColumnBackground(status)}`}>
        <div
          className={`flex items-center justify-between mb-4 p-3 rounded-lg ${getHeaderColor(
            status
          )}`}
        >
          <h3 className='font-semibold flex items-center gap-2'>
            {title}
            <span className='text-xs bg-white/60 px-2 py-1 rounded-full'>
              {tasks?.length || 0}
            </span>
          </h3>
        </div>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`space-y-3 min-h-[400px] transition-colors rounded-lg p-2 ${
            draggedOver
              ? 'bg-blue-200/30 border-2 border-dashed border-blue-300'
              : ''
          }`}
        >
          {tasks?.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={onEditTask}
              onDelete={onDeleteTask}
              onDragStart={(e, task) => {
                e.dataTransfer.setData('task', JSON.stringify(task));
              }}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TaskColumn;
