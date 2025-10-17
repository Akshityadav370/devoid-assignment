import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import projectService from '../../services/project.service';

const useProjects = (options = {}) => {
  return useQuery({
    queryKey: ['projects', options],
    queryFn: () => projectService.fetchProjects(options),
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
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['projects'] });
    },
  });
};

export { useProjects, useCreateProject, useUpdateProject, useDeleteProject };
