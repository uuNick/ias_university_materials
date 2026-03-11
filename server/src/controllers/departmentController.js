import { departmentRepository } from '../repositories/departmentRepository.js';
import { facultyRepository } from '../repositories/facultyRepository.js';
import * as DepartmentCases from '../use-cases/departmentUseCases.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getDepartment = asyncHandler (async(req, res) => {
  const result = await DepartmentCases.getDepartmentByIdUseCase(req.params.id, departmentRepository);
  res.json(result);
});

export const getAllDepartments = asyncHandler (async(req, res) => {
  const departments = await DepartmentCases.getAllDepartmentUseCase(departmentRepository);
  res.json(departments);
});

export const getDepartmentsByFacultyId = asyncHandler (async(req, res) => {
  const departments = await DepartmentCases.getDepartmentByFacultyUseCase(req.params.id, departmentRepository);
  res.json(departments);
});

export const createDepartment = asyncHandler (async(req, res) => {
  const department = await DepartmentCases.createDepartmentUseCase(req.body, departmentRepository, facultyRepository);
  res.status(201).json(department);
});

export const updateDepartment = asyncHandler (async(req, res) => {
  const department = await DepartmentCases.updateDepartmentUseCase(req.params.id, req.body, departmentRepository);
  res.status(200).json(department);
});

export const deleteDepartment = asyncHandler (async(req, res) => {
  await DepartmentCases.deleteDepartmentUseCase(req.params.id, departmentRepository);
  res.status(204).send();
});

