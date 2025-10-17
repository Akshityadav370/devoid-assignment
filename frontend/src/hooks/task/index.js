import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import taskService from '../../services/task.service';

const useTasks = (projectId) => {
  return useQuery({
    queryKey: ['tasks', projectId],
    queryFn: () => taskService.fetchTasks({ projectId }),
    enabled: !!projectId,
  });
};

const useCreateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.createTask,
    onMutate: async ({ projectId, data }) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });

      // Snapshot previous value
      const previousTasks = queryClient.getQueryData(['tasks', projectId]);

      // Optimistically update
      queryClient.setQueryData(['tasks', projectId], (old) => {
        if (!old) return old;
        const newTask = {
          _id: `temp-${Date.now()}`,
          ...data,
          createdAt: new Date().toISOString(),
        };
        return {
          ...old,
          tasks: {
            ...old.tasks,
            [data.status]: [newTask, ...(old.tasks[data.status] || [])],
          },
        };
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      // Rollback on error
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ['tasks', variables.projectId],
          context.previousTasks
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', variables.projectId],
      });
    },
  });
};

const useUpdateTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.updateTask,
    onMutate: async ({ taskId, data, projectId }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });

      const previousTasks = queryClient.getQueryData(['tasks', projectId]);

      queryClient.setQueryData(['tasks', projectId], (old) => {
        if (!old) return old;

        const newTasks = { Todo: [], InProgress: [], Done: [] };

        // Remove task from all columns
        Object.keys(old.tasks).forEach((status) => {
          newTasks[status] = old.tasks[status].filter((t) => t._id !== taskId);
        });

        // Find the task and update it
        let updatedTask = null;
        Object.keys(old.tasks).forEach((status) => {
          const task = old.tasks[status].find((t) => t._id === taskId);
          if (task) {
            updatedTask = { ...task, ...data };
          }
        });

        // Add to new status column
        if (updatedTask) {
          const targetStatus = data.status || updatedTask.status;
          newTasks[targetStatus] = [...newTasks[targetStatus], updatedTask];
        }

        return { ...old, tasks: newTasks };
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ['tasks', variables.projectId],
          context.previousTasks
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', variables.projectId],
      });
    },
  });
};

const useDeleteTask = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: taskService.deleteTask,
    onMutate: async ({ taskId, status, projectId }) => {
      await queryClient.cancelQueries({ queryKey: ['tasks', projectId] });

      const previousTasks = queryClient.getQueryData(['tasks', projectId]);

      queryClient.setQueryData(['tasks', projectId], (old) => {
        if (!old) return old;
        return {
          ...old,
          tasks: {
            ...old.tasks,
            [status]: old.tasks[status].filter((t) => t._id !== taskId),
          },
        };
      });

      return { previousTasks };
    },
    onError: (err, variables, context) => {
      if (context?.previousTasks) {
        queryClient.setQueryData(
          ['tasks', variables.projectId],
          context.previousTasks
        );
      }
    },
    onSettled: (data, error, variables) => {
      queryClient.invalidateQueries({
        queryKey: ['tasks', variables.projectId],
      });
    },
  });
};

export { useTasks, useCreateTask, useUpdateTask, useDeleteTask };
