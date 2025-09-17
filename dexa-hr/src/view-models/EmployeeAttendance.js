import apiClient from ".";

export const EmployeeAttendance = {
    getMyAttendance: async () => {
        try {
            const token = localStorage.getItem('token')
             if (!token) {
                throw new Error('No authentication token found');
            }
            const response = await apiClient.get(`/attendences/my-attendance`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data
        } catch (error){
            throw error;
        }
    },
    getTodayAttendance: async () => {
        try {
            const token = localStorage.getItem('token')
             if (!token) {
                throw new Error('No authentication token found');
            }
            const response = await apiClient.get(`/attendences/today`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return response.data
        } catch (error){
            throw error;
        }
    },
    markAttendance: async (image) => {
        try {
            const token = localStorage.getItem('token')
             if (!token) {
                throw new Error('No authentication token found');
            }
            const response = await fetch(image);
            const blob = await response.blob();
            
            const formData = new FormData();
            formData.append('clock_in_photo', blob, 'attendance-photo.jpg');
            
            const apiResponse = await apiClient.post(`/attendences`, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                }
            });
            return apiResponse.data
        } catch (error){
            throw error;
        }
    }
}