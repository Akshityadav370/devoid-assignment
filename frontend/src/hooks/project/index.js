import {
  useInfiniteQuery,
  useMutation,
  useQuery,
  useQueryClient,
} from '@tanstack/react-query';
import projectService from '../../services/project.service';
import { chatStorageService } from '../../services/chat.service';

const useProjects = () => {
  return useInfiniteQuery({
    queryKey: ['projects'],
    queryFn: ({ pageParam = 0 }) =>
      projectService.fetchProjects({ limit: 10, offset: pageParam }),
    getNextPageParam: (lastPage) => {
      if (lastPage.pagination.hasMore) {
        return lastPage.pagination.offset + lastPage.projects.length;
      }
      return undefined;
    },
    initialPageParam: 0,
  });
};

const useGetProjectById = (projectId, currentProject) => {
  return useQuery({
    queryKey: ['project', projectId],
    queryFn: () => projectService.getProjectById({ projectId }),
    enabled: !!projectId && !currentProject,
  });
};

const useCreateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectService.createProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

const useUpdateProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectService.updateProject,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      //   queryClient.invalidateQueries({ queryKey: ['tasks', data._id] });
    },
  });
};

const useDeleteProject = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: projectService.deleteProject,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
      chatStorageService.clearMessages(data._id);
    },
  });
};

export {
  useProjects,
  useCreateProject,
  useUpdateProject,
  useDeleteProject,
  useGetProjectById,
};
