import { useState } from 'react';
import { useProjects } from '../hooks/project';
import { useEffect } from 'react';
import { AppContext } from './useApp';

const AppProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);
  const [projects, setProjects] = useState([]);
  const [hasMoreProjects, setHasMoreProjects] = useState(false);
  const [offset, setOffset] = useState(0);

  const {
    data,
    isLoading: loadingProjects,
    error: errorFetchingProjects,
  } = useProjects({ limit: 10, offset });

  useEffect(() => {
    if (data && data.projects) {
      setProjects((prev) => [...prev, ...data.projects]);
      setHasMoreProjects(data.pagination.hasMore);
    }
  }, [data]);

  return (
    <AppContext.Provider
      value={{
        currentProject,
        setCurrentProject,
        projects,
        setProjects,
        loadingProjects,
        errorFetchingProjects,
        setOffset,
        hasMoreProjects,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
