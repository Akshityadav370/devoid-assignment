import { Link, useLocation } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { FaCaretDown, FaHome } from 'react-icons/fa';

const Sidebar = ({ isOpen, onClose }) => {
  const location = useLocation();
  const {
    projects = [],
    loadingProjects,
    errorFetchingProjects,
    setCurrentProject,
    hasMoreProjects,
    fetchMoreProjects,
    isFetchingMoreProjects,
    totalProjects,
  } = useApp();

  const handleProjectClick = (project) => {
    setCurrentProject(project);
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className='fixed inset-0 bg-black bg-opacity-50 z-20 lg:hidden'
          onClick={onClose}
        />
      )}

      <div
        className={`
        fixed inset-y-0 left-0 z-30 
        w-64 bg-white shadow-xl transform transition-transform duration-300 ease-in-out
        lg:static lg:translate-x-0 lg:z-auto
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
      >
        <div className='flex flex-col h-full'>
          <div className='flex items-center justify-between p-4 border-b border-gray-200'>
            <div>
              <h2 className='text-lg font-semibold text-gray-900'>Projects</h2>
              {totalProjects > 0 && (
                <p className='text-xs text-gray-500 mt-0.5'>
                  {projects.length} of {totalProjects}
                </p>
              )}
            </div>
            <button
              onClick={onClose}
              className='lg:hidden p-1 rounded-md text-gray-400 hover:text-gray-600'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M6 18L18 6M6 6l12 12'
                />
              </svg>
            </button>
          </div>

          <div className='flex-1 overflow-y-auto p-4'>
            {loadingProjects && (
              <div className='text-center text-gray-500'>
                Loading projects...
              </div>
            )}

            {errorFetchingProjects && (
              <div className='text-center text-red-500'>
                Error loading projects
              </div>
            )}

            {!loadingProjects && projects && projects.length === 0 && (
              <div className='text-center text-gray-500'>No projects found</div>
            )}

            {projects && projects.length > 0 && (
              <div className='space-y-2'>
                {projects.map((project) => (
                  <Link
                    key={project._id}
                    to={`/project/${project._id}`}
                    onClick={() => handleProjectClick(project)}
                    className={`
                    block p-3 rounded-lg border transition-colors duration-200
                    ${
                      location.pathname === `/project/${project._id}`
                        ? 'bg-blue-50 border-blue-200 text-blue-900'
                        : 'border-gray-200 hover:bg-gray-50 text-gray-700'
                    }
                  `}
                  >
                    <h3 className='font-medium truncate'>{project.name}</h3>
                    {project.description && (
                      <p className='text-sm text-gray-500 truncate mt-1'>
                        {project.description}
                      </p>
                    )}
                  </Link>
                ))}
              </div>
            )}

            {hasMoreProjects && (
              <div className='mt-4'>
                <button
                  onClick={fetchMoreProjects}
                  disabled={isFetchingMoreProjects}
                  className='w-full py-2 px-4 text-sm text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed'
                >
                  {isFetchingMoreProjects ? (
                    'Loading...'
                  ) : (
                    <div className='flex w-full gap-2 justify-center'>
                      <FaCaretDown size={20} />
                      <p>Load More</p>
                    </div>
                  )}
                </button>
              </div>
            )}
          </div>

          <div className='p-4 border-t border-gray-200'>
            <Link
              to='/'
              className='flex items-center gap-4 justify-center w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors'
            >
              <FaHome size={20} />
              Home
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
