import { userRepository } from '../repositories/userRepository.js';
import * as UserUseCases from '../use-cases/userUseCases.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const getUserById = asyncHandler(async (req, res) => {
  const user = await UserUseCases.getUserByIdUseCase(req.params.id, userRepository);
  res.json(user);
});

export const getAllUsers = asyncHandler(async (req, res) => {
  const users = await UserUseCases.getAllUserUseCase(userRepository);
  res.json(users);
});

export const createUser = asyncHandler(async (req, res) => {
  const newUser = await UserUseCases.createUserUseCase(req.body, userRepository);
  res.status(201).json(newUser);
});

export const updateUser = asyncHandler (async(req, res) => {
  const updated = await UserUseCases.updateUserUseCase(req.params.id, req.body, userRepository);
  res.json(updated);
});

export const deleteUser = asyncHandler(async (req, res) => {
  await UserUseCases.deleteUserUseCase(req.params.id, userRepository);
  res.status(204).send();
});