import { materialRepository } from '../repositories/materialRepository.js';
import * as MaterialUseCase from '../use-cases/materialUseCases.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import axios from 'axios';

export const getMaterial = asyncHandler(async (req, res) => {
  const result = await MaterialUseCase.getMaterialByIdUseCase(req.params.id, req.user, materialRepository);
  res.json(result);
});

export const getMaterialsWithPagination = asyncHandler(async (req, res) => {
  const result = await MaterialUseCase.getMaterialsWithPag(
    req.query,
    req.user,
    materialRepository
  );

  res.status(200).json(result);
});

// export const getDepartmentsByFacultyId = asyncHandler (async(req, res) => {
//   const departments = await DepartmentCases.getDepartmentByFacultyUseCase(req.params.id, departmentRepository);
//   res.json(departments);
// });

// export const createDepartment = asyncHandler (async(req, res) => {
//   const department = await DepartmentCases.createDepartmentUseCase(req.body, departmentRepository, facultyRepository);
//   res.status(201).json(department);
// });

export const updateMaterial = asyncHandler(async (req, res) => {
  const material = await MaterialUseCase.updateMaterialUseCase(req.params.id, req.body, materialRepository);
  res.status(200).json(material);
});

// export const deleteDepartment = asyncHandler (async(req, res) => {
//   await DepartmentCases.deleteDepartmentUseCase(req.params.id, departmentRepository);
//   res.status(204).send();
// });

export const getMaterialStats = asyncHandler(async (req, res) => {
  const stats = await MaterialUseCase.getUniversityMaterialStatsUseCase(materialRepository);
  res.status(200).json(stats);
});

export const getRecentMaterials = asyncHandler(async (req, res) => {
  const recentMaterials = await MaterialUseCase.getRecentMaterialsUseCase(materialRepository);
  res.status(200).json(recentMaterials);
});

export const aiSearchMaterials = asyncHandler(async (req, res) => {
  const AI_SERVER_URL = process.env.AI_SERVER_URL;
  try {
    const { query } = req.body;
    const aiServerResponce = await axios.post(`${AI_SERVER_URL}/api/ai/search`, {
      query: query,
      limit: 30
    });
    res.status(200).json(aiServerResponce.data);
  } catch (error) {
    console.error('Ошибка на стороне ИИ сервера: ', error.message);
    res.status(502).json({
      message: 'Сервер ИИ вернул ошибку или недоступен'
    });
  }
});

export const getDepartmentMaterialsReport = asyncHandler(async (req, res) => {
  const { startYear, endYear } = req.query;
  const reportData = await MaterialUseCase.getDepartmentMaterialsUseCase(
    materialRepository,
    req.user,
    { yearFrom: startYear, yearTo: endYear }
  );

  res.status(200).json(reportData);
});

export const exportDepartmentReportExcel = asyncHandler(async (req, res) => {
  const { startYear, endYear , departmentName } = req.query;

  const excelBuffer = await MaterialUseCase.exportDepartmentMaterialsToExcelUseCase(
    { yearFrom: startYear, yearTo: endYear },
    materialRepository,
    req.user, 
    departmentName
  );

  res.setHeader(
    'Content-Type',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
  );

  res.setHeader(
    'Content-Disposition',
    `attachment; filename="materials_department.xlsx"`
  );

  // Отправляем буфер в поток ответа
  res.end(excelBuffer);
});