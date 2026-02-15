import { udcRepository } from '../repositories/udcRepository.js';
import * as UdcCases from '../use-cases/udcUseCases.js';

export const getAllUdc = async (req, res) => {
  try {
    const data = await UdcCases.getAllUdcUseCase(udcRepository);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getUdcByCode = async (req, res) => {
  try {
    const udc = await UdcCases.getUdcByCodeUseCase(req.params.code, udcRepository);
    res.json(udc);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const createUdc = async (req, res) => {
  try {
    const newUdc = await UdcCases.createUdcUseCase(req.body, udcRepository);
    res.status(201).json(newUdc);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateUdc = async (req, res) => {
  try {
    const updated = await UdcCases.updateUdcUseCase(req.params.code, req.body, udcRepository);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUdc = async (req, res) => {
  try {
    await UdcCases.deleteUdcUseCase(req.params.code, udcRepository);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};