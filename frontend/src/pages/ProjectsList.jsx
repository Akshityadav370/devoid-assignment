import { Link } from 'react-router-dom';
import { useApp } from '../context/useApp';
import { useState } from 'react';
import {
  useCreateProject,
  useDeleteProject,
  useUpdateProject,
} from '../hooks/project';
import { FaPlus, FaRegEdit, FaTrash } from 'react-icons/fa';
import { MdModeEdit } from 'react-icons/md';
import Modal from '../components/Modal';
import ProjectForm from '../components/ProjectForm';

const ProjectsList = () => {
  const {
    projects,
    loadingProjects,
    errorFetchingProjects,
    setCurrentProject,
  } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null);

  const createProjectMutation = useCreateProject();
  const updateProjectMutation = useUpdateProject();
  const deleteProjectMutation = useDeleteProject();

  const handleSubmitProject = async (projectData) => {
    if (editingProject) {
      updateProjectMutation.mutate(
        {
          projectId: editingProject._id,
          data: projectData,
        },
        {
          onSuccess: () => {
            setModalOpen(false);
            setEditingProject(null);
          },
        }
      );
    } else {
      createProjectMutation.mutate(projectData, {
        onSuccess: () => {
          setModalOpen(false);
        },
      });
    }
  };

  const handleEditProject = (e, project) => {
    e.stopPropagation();
    setEditingProject(project);
    setModalOpen(true);
  };

  const handleDeleteProject = async (e, projectId) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this project?')) {
      deleteProjectMutation.mutate(projectId);
    }
  };

  return (
    <div className='max-w-4xl mx-auto'>
      <div className='mb-6 flex justify-between'>
        <h1 className='text-2xl font-bold text-gray-900'>All Projects</h1>
        <button
          onClick={() => {
            setEditingProject(null);
            setModalOpen(true);
          }}
          className='flex cursor-pointer items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
        >
          <FaPlus size={20} />
          New Project
        </button>
      </div>

      <div className='mb-6'></div>

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
          <div
            key={project._id}
            onClick={() => setCurrentProject(project)}
            className='bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow'
          >
            <div className='flex items-start justify-between mb-3'>
              <h3 className='text-lg font-semibold text-gray-900'>
                {project.name}
              </h3>
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
              <p className='text-sm text-gray-600 mb-3'>
                {project.description}
              </p>
            )}
            <Link key={project._id} to={`/project/${project._id}`}>
              <div className='text-blue-600 text-sm font-medium cursor-pointer'>
                View Tasks →
              </div>
            </Link>
          </div>
        ))}
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingProject ? 'Edit Project' : 'New Project'}
      >
        <ProjectForm
          project={editingProject}
          onSubmit={handleSubmitProject}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>

      {!loadingProjects && projects.length === 0 && (
        <div className='text-center py-12'>
          <p className='text-gray-400 mt-2'>
            Create your first project to get started!
          </p>
        </div>
      )}
    </div>
  );
};

export default ProjectsList;
