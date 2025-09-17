import apiClient from ".";

export const EmployeeEmployee = {
    getProfile: async () => {
        try {
            const token = localStorage.getItem('token')
             if (!token) {
                throw new Error('No authentication token found');
            }
            const response = await apiClient.get(`/employees/profile`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data
        } catch (error){
            throw error;
        }
    },
    updateProfile: async (updatedData) => {
        try{
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const response = await apiClient.put(`/employees/profile`, updatedData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return response.data;
        } catch (error) {
            throw error;
        }  
    }
}