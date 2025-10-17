import axios from 'axios';
import { API_BASE_URL } from '../utils';

const taskService = {
  fetchTasks: async ({ projectId, limit = 10, offset = 0 }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/tasks/read-tasks?projectId=${projectId}&limit=${limit}&offset=${offset}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to fetch tasks');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Request failed: ' + error.message);
      }
    }
  },
  createTask: async ({ projectId, data }) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/tasks/add-task/${projectId}`,
        data,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to create Task');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Request failed: ' + error.message);
      }
    }
  },
  updateTask: async ({ taskId, data }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/tasks/update-task/${taskId}`,
        data,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to update Task');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Request failed: ' + error.message);
      }
    }
  },
  deleteTask: async ({ taskId }) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/tasks/delete-task/${taskId}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(error.response.data.message || 'Failed to delete task');
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Request failed: ' + error.message);
      }
    }
  },
};

export default taskService;
