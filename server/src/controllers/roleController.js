import { roleRepository } from '../repositories/roleRepository.js';
import * as RoleCases from '../use-cases/roleUseCases.js';

export const getAllRoles = async (req, res) => {
  try {
    const roles = await RoleCases.getAllRolesUseCase(roleRepository);
    res.json(roles);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRoleById = async (req, res) => {
  try {
    const role = await RoleCases.getRoleByIdUseCase(req.params.id, roleRepository);
    res.json(role);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const createRole = async (req, res) => {
  try {
    const newRole = await RoleCases.createRoleUseCase(req.body, roleRepository);
    res.status(201).json(newRole);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateRole = async (req, res) => {
  try {
    const updated = await RoleCases.updateRoleUseCase(req.params.id, req.body, roleRepository);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteRole = async (req, res) => {
  try {
    await RoleCases.deleteRoleUseCase(req.params.id, roleRepository);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};