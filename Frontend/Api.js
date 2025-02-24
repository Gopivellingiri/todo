import axios from "axios";

export const API_BASE_URL = "http://localhost:4000/api/users";
export const API_TASK_URL = "http://localhost:4000/api/tasks";

// Register User
export const registerUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/register`, userData);
  return response.data;
};

//Login user
export const loginUser = async (userData) => {
  const response = await axios.post(`${API_BASE_URL}/login`, userData);
  return response.data;
};
