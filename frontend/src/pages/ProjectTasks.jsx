// import { useParams } from 'react-router-dom';
import { useApp } from '../context/useApp';

const ProjectTasks = () => {
  //   const { projectId } = useParams();
  const { currentProject } = useApp();

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>
          {currentProject?.name || 'Project Tasks'}
        </h1>
        {currentProject?.description && (
          <p className='text-gray-600 mt-2'>{currentProject.description}</p>
        )}
      </div>

      <div className='bg-white rounded-lg border border-gray-200 p-6'>
        <p className='text-gray-500'>tasks</p>
      </div>
    </div>
  );
};

export default ProjectTasks;
