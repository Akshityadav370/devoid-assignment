const chatStorageService = {
  getStorageKey: (projectId) => `chat_history_${projectId}`,

  saveMessages: (projectId, messages) => {
    try {
      localStorage.setItem(
        chatStorageService.getStorageKey(projectId),
        JSON.stringify(messages)
      );
    } catch (error) {
      console.error('Error saving chat history:', error);
    }
  },

  loadMessages: (projectId) => {
    try {
      const stored = localStorage.getItem(
        chatStorageService.getStorageKey(projectId)
      );
      if (stored) {
        const parsed = JSON.parse(stored);
        return parsed.map((msg) => ({
          ...msg,
          timestamp: new Date(msg.timestamp),
        }));
      }
      return [];
    } catch (error) {
      console.error('Error loading chat history:', error);
      return [];
    }
  },

  clearMessages: (projectId) => {
    try {
      localStorage.removeItem(chatStorageService.getStorageKey(projectId));
    } catch (error) {
      console.error('Error clearing chat history:', error);
    }
  },
};

export { chatStorageService };
