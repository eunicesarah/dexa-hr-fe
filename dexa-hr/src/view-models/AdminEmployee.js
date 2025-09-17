import apiClient from ".";

export const AdminEmployee = {
    getAllEmployees: async (page, limit) => {
        try{
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const response = await apiClient.get(`/employees`, {
                headers: {
                    Authorization: `Bearer ${token}`
                },
                params: {
                    page,
                    limit
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getEmployeeById: async (id) => {
        try{
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const response = await apiClient.get(`/employees/admin/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateEmployee: async (id, updatedData) => {
        try{
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const response = await apiClient.put(`/employees/admin/${id}`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    insertEmployee: async (insertData) => {
        try{
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const response = await apiClient.post(`/employees`, insertData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteEmployee: async (id) => {
        try{
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const response = await apiClient.delete(`/employees/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    }
}