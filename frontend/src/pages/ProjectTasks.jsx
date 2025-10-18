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
import Chatbox from '../components/Chatbox';
import { useMemo } from 'react';
import ChatboxToggle from '../components/ChatboxToggle';

const ProjectTasks = () => {
  const { projectId } = useParams();
  const { currentProject, setCurrentProject } = useApp();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [chatBoxOpen, setChatBoxOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('Todo');
  const [draggedOverTab, setDraggedOverTab] = useState(null);

  const GOOGLE_API_KEY = import.meta.env.VITE_GEMINI_API_KEY || '';

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

  const tasks = useMemo(
    () => tasksData?.tasks || { Todo: [], InProgress: [], Done: [] },
    [tasksData?.tasks]
  );

  const projectContext = useMemo(
    () => ({
      name: currentProject?.name,
      description: currentProject?.description,
      tasks: tasks,
    }),
    [currentProject, tasks]
  );

  const tabs = [
    { key: 'Todo', label: 'To Do', count: tasks.Todo?.length || 0 },
    {
      key: 'InProgress',
      label: 'In Progress',
      count: tasks.InProgress?.length || 0,
    },
    { key: 'Done', label: 'Done', count: tasks.Done?.length || 0 },
  ];

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
    setDraggedOverTab(null);
    const taskData = JSON.parse(e.dataTransfer.getData('task'));

    if (taskData.status !== newStatus) {
      updateTaskMutation.mutate({
        taskId: taskData._id,
        data: { status: newStatus },
        projectId: currentProject._id || projectId,
      });
    }
  };

  const handleTabDragOver = (e, tabKey) => {
    e.preventDefault();
    setDraggedOverTab(tabKey);
  };

  const handleTabDragLeave = () => {
    setDraggedOverTab(null);
  };

  const handleTabDrop = (e, newStatus) => {
    e.preventDefault();
    setDraggedOverTab(null);
    const taskData = JSON.parse(e.dataTransfer.getData('task'));

    if (taskData.status !== newStatus) {
      updateTaskMutation.mutate({
        taskId: taskData._id,
        data: { status: newStatus },
        projectId: currentProject._id || projectId,
      });
      setActiveTab(newStatus);
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
      <div className='mb-4 lg:mb-6 flex flex-col sm:flex-row justify-between gap-4'>
        <div>
          <h1 className='text-xl lg:text-2xl font-bold text-gray-900'>
            {currentProject?.name || 'Project Tasks'}
          </h1>
          {currentProject?.description && (
            <p className='text-gray-600 mt-2 text-sm lg:text-base'>
              {currentProject.description}
            </p>
          )}
        </div>
        <button
          onClick={() => {
            setEditingTask(null);
            setModalOpen(true);
          }}
          className='flex cursor-pointer items-center justify-center self-start sm:self-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 whitespace-nowrap'
        >
          <FaPlus size={18} />
          New Task
        </button>
      </div>

      <div className='lg:hidden mb-4'>
        <div className='flex gap-2 overflow-x-auto pb-2'>
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              onDragOver={(e) => handleTabDragOver(e, tab.key)}
              onDragLeave={handleTabDragLeave}
              onDrop={(e) => handleTabDrop(e, tab.key)}
              className={`flex flex-1 gap-2 justify-center px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
                activeTab === tab.key
                  ? 'bg-blue-600 text-white shadow-md'
                  : draggedOverTab === tab.key
                  ? 'bg-blue-100 text-blue-700 border-2 border-blue-400 border-dashed'
                  : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
              }`}
            >
              <span className='font-medium'>{tab.label}</span>
              <span
                className={`px-2 py-0.5 rounded-full text-xs font-semibold ${
                  activeTab === tab.key
                    ? 'bg-white/20 text-white'
                    : 'bg-gray-200 text-gray-700'
                }`}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      <div className='lg:hidden'>
        <TaskColumn
          title={tabs.find((t) => t.key === activeTab)?.label}
          tasks={tasks[activeTab]}
          status={activeTab}
          onAddTask={handleAddTask}
          onEditTask={handleEditTask}
          onDeleteTask={handleDeleteTask}
          onDrop={handleDrop}
          isMobile={true}
        />
      </div>

      <div className='hidden lg:block flex-1 overflow-x-auto p-6'>
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
          onSubmit={handleSubmitTask}
          onCancel={() => setModalOpen(false)}
        />
      </Modal>
      <Chatbox
        isOpen={chatBoxOpen}
        onClose={() => setChatBoxOpen(false)}
        projectId={currentProject?._id}
        projectContext={projectContext}
      />
      <ChatboxToggle
        onClick={() => setChatBoxOpen(!chatBoxOpen)}
        isOpen={chatBoxOpen}
      />
    </div>
  );
};

export default ProjectTasks;
