import { facultyRepository } from '../repositories/facultyRepository.js';
import * as FacultyCases from '../use-cases/facultyUseCases.js';

export const getFaculty = async (req, res) => {
  try {
    const result = await FacultyCases.getFacultyByIdUseCase(req.params.id, facultyRepository);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getAllFaculties = async (req, res) => {
  try {
    const faculties = await FacultyCases.getAllFacultyUseCase(facultyRepository);
    res.json(faculties);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createFaculty = async (req, res) => {
  try {
    const faculty = await FacultyCases.createFacultyUseCase(req.body, facultyRepository);
    res.status(201).json(faculty);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateFaculty = async(req, res) => {
  try{
    const faculty = await FacultyCases.updateFacultyUseCase(req.body, facultyRepository);
    res.status(200).json(faculty);
  } catch (error){
    res.status(500).json({error: error.message});
  }
}

export const deleteFaculty = async (req, res) => {
  try {
    await FacultyCases.deleteFacultyUseCase(req.params.id, facultyRepository);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getReportMaterialsOnYear = async (req, res) => {
  try {
    const { startYear, endYear } = req.query;
    const report = await FacultyCases.getFacultyReportOnYearUseCase(
      { startYear, endYear }, 
      facultyRepository
    );
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getReportMaterialsOnYearWithDepartments = async (req, res) => {
  try {
    const { startYear, endYear } = req.query;
    const report = await FacultyCases.getFacultyReportOnYearWithDepartmentsUseCase(
      { startYear, endYear }, 
      facultyRepository
    );
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};