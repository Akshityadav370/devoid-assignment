import { useState } from 'react';

const ProjectForm = ({ project, onSubmit, onCancel }) => {
  const [name, setName] = useState(project?.name || '');
  const [description, setDescription] = useState(project?.description || '');

  const handleSubmit = () => {
    if (name.trim()) {
      onSubmit({ name, description });
    }
  };

  return (
    <div>
      <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>Project Name</label>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          placeholder='Enter project name'
        />
      </div>
      <div className='mb-4'>
        <label className='block text-sm font-medium mb-1'>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className='w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500'
          rows='3'
          placeholder='Enter project description'
        />
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
          {project ? 'Update' : 'Create'}
        </button>
      </div>
    </div>
  );
};

export default ProjectForm;
