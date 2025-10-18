export const API_BASE_URL = 'https://devoid-assignment.vercel.app/api';

const STORAGE_ID_KEY = 'storageId';

export function generateUUID() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    var r = (Math.random() * 16) | 0,
      v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

export const getOrCreateStorageId = () => {
  let id = localStorage.getItem(STORAGE_ID_KEY);
  if (!id) {
    id = generateUUID();
    localStorage.setItem(STORAGE_ID_KEY, id);
  }
  return id;
};

export const clearStorageId = () => {
  localStorage.removeItem(STORAGE_ID_KEY);
};
