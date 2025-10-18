import { FaGripVertical, FaTrash } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';

const TaskCard = ({ task, onEdit, onDelete, onDragStart }) => {
  const getStatusColor = (status) => {
    switch (status) {
      case 'Todo':
        return 'bg-blue-50 border-blue-200 hover:bg-blue-100';
      case 'InProgress':
        return 'bg-amber-50 border-amber-200 hover:bg-amber-100';
      case 'Done':
        return 'bg-green-50 border-green-200 hover:bg-green-100';
      default:
        return 'bg-gray-50 border-gray-200 hover:bg-gray-100';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return 'bg-red-500';
      case 'Medium':
        return 'bg-yellow-500';
      case 'Low':
        return 'bg-green-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, task)}
      className={`p-4 rounded-lg shadow-sm border cursor-move hover:shadow-md transition-all duration-200 ${getStatusColor(
        task.status
      )}`}
    >
      <div className='flex items-start justify-between mb-2'>
        <div className='flex items-center gap-2 flex-1'>
          <FaGripVertical size={16} className='text-gray-400' />
          <h4 className='font-medium text-gray-900'>{task.title}</h4>
        </div>
        <div className='flex gap-1'>
          <button
            onClick={() => onEdit(task)}
            className='p-1 text-gray-600 hover:bg-white hover:text-blue-600 rounded transition-colors'
          >
            <MdModeEdit size={14} />
          </button>
          <button
            onClick={() => onDelete(task._id, task.status)}
            className='p-1 text-gray-600 hover:bg-white hover:text-red-600 rounded transition-colors'
          >
            <FaTrash size={14} />
          </button>
        </div>
      </div>
      {task.description && (
        <p className='text-sm text-gray-600 line-clamp-2 mb-2'>
          {task.description}
        </p>
      )}
      <div className='flex items-center justify-end pt-2 border-t border-gray-200'>
        <div className='flex items-center gap-2'>
          <div
            className={`w-2 h-2 rounded-full ${getPriorityColor(
              task.priority
            )}`}
          ></div>
          <span className='text-xs font-medium text-gray-700'>
            {task.priority}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
