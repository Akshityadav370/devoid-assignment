import { useState } from 'react';

const TaskForm = ({ task, onSubmit, onCancel, defaultStatus = 'Todo' }) => {
  const [title, setTitle] = useState(task?.title || '');
  const [description, setDescription] = useState(task?.description || '');
  const [status, setStatus] = useState(task?.status || defaultStatus);

  const handleSubmit = () => {
    if (title.trim()) {
      onSubmit({ title, description, status });
    }
  };

  return (
    <div>
      <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>Title</label>
        <input
          type='text'
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Enter task title'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          rows='3'
          placeholder='Enter task description'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>Status</label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value)}
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
        >
          <option value='Todo'>To Do</option>
          <option value='InProgress'>In Progress</option>
          <option value='Done'>Done</option>
        </select>
      </div>
      <div className='flex gap-2 justify-end'>
        <button
          onClick={onCancel}
          className='px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg'
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className='px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
        >
          {task ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  );
};

export default TaskForm;
