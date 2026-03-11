import { facultyRepository } from '../repositories/facultyRepository.js';
import * as FacultyCases from '../use-cases/facultyUseCases.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getFaculty = asyncHandler (async(req, res) => {
  const faculty = await FacultyCases.getFacultyByIdUseCase(req.params.id, facultyRepository);
  res.json(faculty);
});

export const getAllFaculties = asyncHandler (async(req, res) => {
    const faculties = await FacultyCases.getAllFacultyUseCase(facultyRepository);
    res.json(faculties);
});

export const createFaculty = asyncHandler (async(req, res) => {
  const faculty = await FacultyCases.createFacultyUseCase(req.body, facultyRepository);
  res.status(201).json(faculty);
});

export const updateFaculty = asyncHandler (async(req, res) => {
  const faculty = await FacultyCases.updateFacultyUseCase(req.params.id, req.body, facultyRepository);
  res.status(200).json(faculty);
});

export const deleteFaculty = asyncHandler (async(req, res) => {
    await FacultyCases.deleteFacultyUseCase(req.params.id, facultyRepository);
    res.status(204).send();
});

export const getReportMaterialsOnYear = asyncHandler (async(req, res) => {
  const { startYear, endYear } = req.query;
  const report = await FacultyCases.getFacultyReportOnYearUseCase(
    { startYear, endYear }, 
    facultyRepository
  );
  res.json(report);
});

export const getReportMaterialsOnYearWithDepartments = asyncHandler (async(req, res) => {
  const { startYear, endYear } = req.query;
  const report = await FacultyCases.getFacultyReportOnYearWithDepartmentsUseCase(
    { startYear, endYear }, 
    facultyRepository
  );
  res.json(report);
});