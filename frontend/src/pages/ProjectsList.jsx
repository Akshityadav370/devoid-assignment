import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';

const ProjectsList = () => {
  const { projects, loadingProjects, errorFetchingProjects } = useApp();

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='mb-6'>
        <h1 className='text-2xl font-bold text-gray-900'>All Projects</h1>
        <p className='text-gray-600'>Manage your projects and tasks</p>
      </div>

      <div className='mb-6'>
        <Link
          to='/project/new'
          className='inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
        >
          Create New Project
        </Link>
      </div>

      {loadingProjects && (
        <div className='text-center py-8'>
          <div className='text-gray-500'>Loading projects...</div>
        </div>
      )}

      {errorFetchingProjects && (
        <div className='text-center py-8'>
          <div className='text-red-500'>
            Error loading projects: {errorFetchingProjects.message}
          </div>
        </div>
      )}

      <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4'>
        {projects.map((project) => (
          <Link
            key={project._id}
            to={`/project/${project._id}`}
            className='block p-6 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all'
          >
            <h3 className='text-lg font-semibold text-gray-900 mb-2'>
              {project.name}
            </h3>
            {project.description && (
              <p className='text-gray-600 text-sm mb-4'>
                {project.description}
              </p>
            )}
            <div className='text-blue-600 text-sm font-medium'>
              View Tasks →
            </div>
          </Link>
        ))}
      </div>

      {!loadingProjects && projects.length === 0 && (
        <div className='text-center py-12'>
          <div className='text-gray-500 text-lg'>No projects yet</div>
          <p className='text-gray-400 mt-2'>
            Create your first project to get started
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
