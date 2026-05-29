import { axiosInstance } from "./axiosInstance";

const reportService = {
    getMaterialsByYearWithDepartments: async (startYear, endYear) => {
        try {
            const response = await axiosInstance.get('/faculties/report/materials_by_year_with_departments', {
                params: { startYear, endYear }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getMaterialsByFaculty: async (startYear, endYear) => {
        try {
            const response = await axiosInstance.get('/faculties/report/materials_by_year', {
                params: { startYear, endYear }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getTopAuthors: async (limit = 10) => {
        try {
            const response = await axiosInstance.get('/authors/report/top_authors', {
                params: { limit }
            });
            return response.data;
        } catch (error) {
            throw error;
        }
    },

    getAuthorMaterials: async (authorName, startYear, endYear) => {
        try {
            const response = await axiosInstance.get('/authors/report/by_author', {
                params: { authorName, startYear, endYear }
            })
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    getSpecialtyMaterials: async (spec_code, startYear, endYear) => {
        try {
            const response = await axiosInstance.get('/specialties/report/by_specialty', {
                params: { spec_code, startYear, endYear }
            })
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    getDepartmentMaterials: async (startYear, endYear) => {
        try {
            const response = await axiosInstance.get('/materials/report/by_department', {
                params: { startYear, endYear }
            })
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },

    getSpecialtyDisciplinesWithMaterials: async (specCode, startYear, endYear) => {
        try {
            const response = await axiosInstance.get('/specialties/report/disciplines_with_materials', {
                params: { specCode, startYear, endYear }
            })
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    getDepartmentDisciplines: async (departmentName, startYear, endYear) => {
        try {
            const response = await axiosInstance.get('/departments/report/disciplines', {
                params: { departmentName, startYear, endYear }
            })
            return response.data;
        } catch (error) {
            console.log(error);
            throw error;
        }
    },
    
};

export default reportService;