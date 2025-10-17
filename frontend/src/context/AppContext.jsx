import { useState } from 'react';
import { useProjects } from '../hooks/project';
import { AppContext } from './useApp';
import { useMemo } from 'react';

const AppProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);

  const {
    data,
    isLoading: loadingProjects,
    error: errorFetchingProjects,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProjects();

  const projects = useMemo(() => {
    if (!data?.pages) return [];
    return data.pages.flatMap((page) => page.projects);
  }, [data]);

  const totalProjects = useMemo(() => {
    return data?.pages?.[0]?.pagination?.total ?? 0;
  }, [data]);

  const handleFetchMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };

  return (
    <AppContext.Provider
      value={{
        currentProject,
        setCurrentProject,
        projects,
        loadingProjects,
        errorFetchingProjects,
        hasMoreProjects: hasNextPage,
        fetchMoreProjects: handleFetchMore,
        isFetchingMoreProjects: isFetchingNextPage,
        totalProjects,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
