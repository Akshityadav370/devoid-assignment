import { MdModeEdit } from 'react-icons/md';
import { useApp } from '../context/useApp';
import { FaTrash } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProjectCard = ({ project, handleDeleteProject, handleEditProject }) => {
  const { setCurrentProject } = useApp();

  return (
    <div
      onClick={() => setCurrentProject(project)}
      className='bg-white p-6 flex flex-col rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow'
    >
      <div className='flex items-start justify-between mb-3'>
        <h3 className='text-lg font-semibold text-gray-900'>{project.name}</h3>
        <div className='flex gap-1'>
          <button
            onClick={(e) => handleEditProject(e, project)}
            className='p-1 text-blue-600 hover:bg-blue-50 rounded cursor-pointer'
          >
            <MdModeEdit size={16} />
          </button>
          <button
            onClick={(e) => handleDeleteProject(e, project._id)}
            className='p-1 text-red-600 hover:bg-red-50 rounded cursor-pointer'
          >
            <FaTrash size={16} />
          </button>
        </div>
      </div>
      {project.description && (
        <p className='text-sm text-gray-600 mb-3'>{project.description}</p>
      )}

      <div className='w-full flex flex-col items-end'>
        <Link
          key={project._id}
          to={`/project/${project._id}`}
          onClick={() => setCurrentProject(project)}
        >
          <div className='text-blue-600 text-sm font-medium cursor-pointer'>
            View Tasks →
          </div>
        </Link>
      </div>
    </div>
  );
};

export default ProjectCard;
