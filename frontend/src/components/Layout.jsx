import { useState } from 'react';
import { useRoutes } from 'react-router-dom';
import Sidebar from './Sidebar';
import ProjectsList from '../pages/ProjectsList';
import ProjectTasks from '../pages/ProjectTasks';

const Layout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const routes = useRoutes([
    { path: '/', element: <ProjectsList /> },
    { path: '/project/:projectId', element: <ProjectTasks /> },
  ]);

  return (
    <div className='flex h-screen bg-gray-50'>
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className='flex-1 flex flex-col overflow-hidden'>
        <header className='lg:hidden bg-white shadow-sm border-b border-gray-200'>
          <div className='flex items-center justify-between p-4'>
            <button
              onClick={() => setSidebarOpen(true)}
              className='p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100'
            >
              <svg
                className='w-6 h-6'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth={2}
                  d='M4 6h16M4 12h16M4 18h16'
                />
              </svg>
            </button>
            {/* <h1 className='text-lg font-semibold text-gray-900'>
              Project Manager
            </h1> */}
          </div>
        </header>

        <main className='flex-1 overflow-auto p-2 lg:p-6 relative'>
          {routes}
        </main>
      </div>
    </div>
  );
};

export default Layout;
