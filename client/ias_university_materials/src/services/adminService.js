import { axiosInstance } from "./axiosInstance";

const adminService = {
    downloadDatabaseBackup: async () => {
        const response = await axiosInstance.get('/admin/backup', {
            responseType: 'blob',
        });
        return response.data;
    },
    runLibraryParser: async () => {
        try {
            const response = await axiosInstance.post('/admin/run_parser');
            return response.data;
        } catch (error) {
            throw error;
        }
    },
};

export default adminService;