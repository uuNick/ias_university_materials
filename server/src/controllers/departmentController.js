import { departmentRepository } from '../repositories/departmentRepository.js';
import { facultyRepository } from '../repositories/facultyRepository.js';
import * as DepartmentCases from '../use-cases/departmentUseCases.js';

export const getDepartment = async (req, res) => {
  try {
    const result = await DepartmentCases.getDepartmentByIdUseCase(req.params.id, departmentRepository);
    res.json(result);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getAllDepartments = async (req, res) => {
  try {
    const departments = await DepartmentCases.getAllDepartmentUseCase(departmentRepository);
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getDepartmentsByFacultyId = async (req, res) => {
  try {
    const departments = await DepartmentCases.getDepartmentByFacultyUseCase(req.params.id, departmentRepository);
    res.json(departments);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createDepartment = async (req, res) => {
  try {
    const result = await DepartmentCases.createDepartmentUseCase(req.body, departmentRepository, facultyRepository);
    res.status(201).json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateDepartment = async(req, res) => {
  try{
    const department = await DepartmentCases.updateDepartmentUseCase(req.params.id, req.body, departmentRepository);
    res.status(200).json(department);
  } catch (error){
    res.status(500).json({error: error.message});
  }
}

export const deleteDepartment = async (req, res) => {
  try {
    await DepartmentCases.deleteDepartmentUseCase(req.params.id, departmentRepository);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

