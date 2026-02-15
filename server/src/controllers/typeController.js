import { typeRepository } from '../repositories/typeRepository.js';
import * as TypeCases from '../use-cases/typeUseCases.js';

export const getAllTypes = async (req, res) => {
  try {
    const types = await TypeCases.getAllTypesUseCase(typeRepository);
    res.json(types);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getTypeById = async (req, res) => {
  try {
    const type = await TypeCases.getTypeByIdUseCase(req.params.id, typeRepository);
    res.json(type);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const createType = async (req, res) => {
  try {
    const newType = await TypeCases.createTypeUseCase(req.body, typeRepository);
    res.status(201).json(newType);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateType = async (req, res) => {
  try {
    const updated = await TypeCases.updateTypeUseCase(req.params.id, req.body, typeRepository);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteType = async (req, res) => {
  try {
    await TypeCases.deleteTypeUseCase(req.params.id, typeRepository);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};