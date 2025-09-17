import apiClient from '.';
export const AdminAttendance = {
    getAllAttendanceRecords: async (page, limit) => {
        try{
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('No authentication token found');
            }
            const response = await apiClient.get(`/attendences`, {
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
    }
}