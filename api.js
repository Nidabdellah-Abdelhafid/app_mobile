import axios from 'axios';

const API_URL = 'http://localhost:8080/api'; // Adjust the URL as needed

const authenticate = async (username, password) => {
  try {
    const response = await axios.post(`${API_URL}/authenticate`, {
      username,
      password,
    });
    return response.data.id_token;
  } catch (error) {
    console.error('Authentication failed:', error);
    throw error;
  }
};

const fetchOffres = async (token) => {
  try {
    const response = await axios.get(`${API_URL}/themes`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching offres:', error);
    throw error;
  }
};

const api = axios.create({
  baseURL: API_URL,
});

export const getEntities = async () => {
  try {
    const response = await api.get('/entities');
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const getEntity = async (id) => {
  try {
    const response = await api.get(`/entities/${id}`);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const createEntity = async (entity) => {
  try {
    const response = await api.post('/entities', entity);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const updateEntity = async (id, entity) => {
  try {
    const response = await api.put(`/entities/${id}`, entity);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error;
  }
};

export const deleteEntity = async (id) => {
  try {
    await api.delete(`/entities/${id}`);
  } catch (error) {
    console.error(error);
    throw error;
  }
};
