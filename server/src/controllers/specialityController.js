import { specialityRepository } from '../repositories/specialityRepository.js';
import * as SpecCases from '../use-cases/specialityUseCases.js';

export const getAllSpecialities = async (req, res) => {
  try {
    const data = await SpecCases.getAllSpecialitiesUseCase(specialityRepository);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getSpecialityByCode = async (req, res) => {
  try {
    const spec = await SpecCases.getSpecialityByCodeUseCase(req.params.code, specialityRepository);
    res.json(spec);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const createSpeciality = async (req, res) => {
  try {
    const newSpec = await SpecCases.createSpecialityUseCase(req.body, specialityRepository);
    res.status(201).json(newSpec);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateSpeciality = async (req, res) => {
  try {
    const updated = await SpecCases.updateSpecialityUseCase(req.params.code, req.body, specialityRepository);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteSpeciality = async (req, res) => {
  try {
    await SpecCases.deleteSpecialityUseCase(req.params.code, specialityRepository);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getSpecialityReportByYear = async (req, res) => {
  try {
    const { startYear, endYear } = req.query;
    const result = await SpecCases.getSpecialityReportByYearUseCase(
      { startYear, endYear }, 
      specialityRepository
    );
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};