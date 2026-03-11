import { specialityRepository } from '../repositories/specialityRepository.js';
import * as SpecCases from '../use-cases/specialityUseCases.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getAllSpecialities = asyncHandler(async (req, res) => {
  const data = await SpecCases.getAllSpecialitiesUseCase(specialityRepository);
  res.json(data);
});

export const getSpecialityByCode = asyncHandler(async (req, res) => {
  const spec = await SpecCases.getSpecialityByCodeUseCase(req.params.code, specialityRepository);
  res.json(spec);
});

export const createSpeciality = asyncHandler(async (req, res) => {
  const newSpec = await SpecCases.createSpecialityUseCase(req.body, specialityRepository);
  res.status(201).json(newSpec);
});

export const updateSpeciality = asyncHandler(async (req, res) => {
  const updated = await SpecCases.updateSpecialityUseCase(req.params.code, req.body, specialityRepository);
  res.json(updated);
});

export const deleteSpeciality = asyncHandler(async (req, res) => {
  await SpecCases.deleteSpecialityUseCase(req.params.code, specialityRepository);
  res.status(204).send();
});

export const getSpecialityReportByYear = asyncHandler(async (req, res) => {
  const { startYear, endYear } = req.query;
  const result = await SpecCases.getSpecialityReportByYearUseCase(
    { startYear, endYear },
    specialityRepository
  );
  res.json(result);
});