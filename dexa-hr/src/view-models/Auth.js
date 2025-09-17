import apiClient from '.';

export const AuthViewModel = {
  login: async (email, password) => {
        try {
          const response = await apiClient.post(`/users/login`, {
        email,
        password,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
  register: async (email, password, employee_id) => {
    try {
      const response = await apiClient.post(`/users/register`, {
        email,
        password,
        role: 'EMPLOYEE',
        employee_id,
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};