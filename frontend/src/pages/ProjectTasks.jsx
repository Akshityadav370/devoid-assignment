import { useParams } from 'react-router-dom';
import { useState } from 'react';
import { useApp } from '../context/useApp';
import {
  useCreateTask,
  useDeleteTask,
  useTasks,
  useUpdateTask,
} from '../hooks/task';
import Modal from '../components/Modal';
import TaskForm from '../components/TaskForm';
import { FaPlus } from 'react-icons/fa';
import TaskColumn from '../components/TaskColumn';
import { useGetProjectById } from '../hooks/project';
import { useEffect } from 'react';

const ProjectTasks = () => {
  const { projectId } = useParams();
  const { currentProject, setCurrentProject } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const { data: tasksData, isLoading } = useTasks(
    currentProject?._id || projectId
  );
  const createTaskMutation = useCreateTask();
  const updateTaskMutation = useUpdateTask();
  const deleteTaskMutation = useDeleteTask();

  const { data: projectData, isLoading: loadingProject } = useGetProjectById(
    projectId,
    currentProject
  );

  useEffect(() => {
    if (projectData && !currentProject) {
      setCurrentProject(projectData);
    }
  }, [projectData, setCurrentProject, currentProject]);

  const tasks = tasksData?.tasks || { Todo: [], InProgress: [], Done: [] };

  const handleAddTask = () => {
    setEditingTask(null);
    setModalOpen(true);
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setModalOpen(true);
  };

  const handleSubmitTask = async (taskData) => {
    if (editingTask) {
      updateTaskMutation.mutate(
        {
          taskId: editingTask._id,
          data: taskData,
          projectId: currentProject._id || projectId,
        },
        {
          onSuccess: () => {
            setModalOpen(false);
            setEditingTask(null);
          },
        }
      );
    } else {
      createTaskMutation.mutate(
        {
          projectId: currentProject._id || projectId,
          data: taskData,
        },
        {
          onSuccess: () => {
            setModalOpen(false);
          },
        }
      );
    }
  };

  const handleDeleteTask = (taskId, status) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      deleteTaskMutation.mutate({
        taskId,
        status,
        projectId: currentProject._id || projectId,
      });
    }
  };

  const handleDrop = async (e, newStatus) => {
    e.preventDefault();
    const taskData = JSON.parse(e.dataTransfer.getData('task'));

    if (taskData.status !== newStatus) {
      updateTaskMutation.mutate({
        taskId: taskData._id,
        data: { status: newStatus },
        projectId: currentProject._id || projectId,
      });
    }
  };

  if (isLoading || loadingProject) {
    return (
      <div className='flex items-center justify-center h-full'>
        Loading tasks...
      </div>
    );
  }

  return (
    <div className='max-w-6xl mx-auto'>
      <div className='mb-6 flex justify-between'>
        <div>
          <h1 className='text-2xl font-bold text-gray-900'>
            {currentProject?.name || 'Project Tasks'}
          </h1>
          {currentProject?.description && (
            <p className='text-gray-600 mt-2'>{currentProject.description}</p>
          )}
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
          className='flex cursor-pointer items-center self-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700'
        >
          <FaPlus size={20} />
          New Task
        </button>
      </div>

      <div className='flex-1 overflow-x-auto p-6'>
        <div className='flex gap-4 min-w-max'>
          <TaskColumn
            title='To Do'
            tasks={tasks.Todo}
            status='Todo'
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onDrop={handleDrop}
          />
          <TaskColumn
            title='In Progress'
            tasks={tasks.InProgress}
            status='InProgress'
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onDrop={handleDrop}
          />
          <TaskColumn
            title='Done'
            tasks={tasks.Done}
            status='Done'
            onAddTask={handleAddTask}
            onEditTask={handleEditTask}
            onDeleteTask={handleDeleteTask}
            onDrop={handleDrop}
          />
        </div>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editingTask ? 'Edit Task' : 'New Task'}
      >
        <TaskForm
          task={editingTask}
          //   defaultStatus={defaultStatus}
          onSubmit={handleSubmitTask}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
    </div>
  );
};

export default ProjectTasks;
