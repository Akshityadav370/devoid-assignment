import { useState } from 'react';
import { useProjects } from '../hooks/project';
import { AppContext } from './useApp';
import { useRef } from 'react';
import { getOrCreateStorageId } from '../utils';

const AppProvider = ({ children }) => {
  const [currentProject, setCurrentProject] = useState(null);
  const storageId = useRef(getOrCreateStorageId());

  const {
    data,
    isLoading: loadingProjects,
    error: errorFetchingProjects,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useProjects({ storageId });

  const projects = data?.pages
    ? data.pages.flatMap((page) => page.projects)
    : [];
  const totalProjects = data?.pages?.[0]?.pagination?.total ?? 0;

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
        storageId: storageId.current,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppProvider;
