import axios from 'axios';
import { API_BASE_URL } from '../utils';

const projectService = {
  fetchProjects: async ({ limit = 10, offset = 0 }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/projects/read-projects?limit=${limit}&offset=${offset}`
      );
      //   console.log('response', response.data);
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || 'Failed to fetch project'
        );
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Request failed: ' + error.message);
      }
    }
  },
  getProjectById: async ({ projectId }) => {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/projects/read-project-by-id/${projectId}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || 'Failed to fetch project by Id'
        );
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Request failed: ' + error.message);
      }
    }
  },
  createProject: async (data) => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/projects/add-project`,
        data,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || 'Failed to create project'
        );
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Request failed: ' + error.message);
      }
    }
  },
  updateProject: async ({ projectId, data }) => {
    try {
      const response = await axios.put(
        `${API_BASE_URL}/projects/update-project/${projectId}`,
        data,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || 'Failed to update project'
        );
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Request failed: ' + error.message);
      }
    }
  },
  deleteProject: async (projectId) => {
    try {
      const response = await axios.delete(
        `${API_BASE_URL}/projects/delete-project/${projectId}`
      );
      return response.data;
    } catch (error) {
      if (error.response) {
        throw new Error(
          error.response.data.message || 'Failed to delete project'
        );
      } else if (error.request) {
        throw new Error('No response from server');
      } else {
        throw new Error('Request failed: ' + error.message);
      }
    }
  },
};

export default projectService;
