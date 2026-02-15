import { userRepository } from '../repositories/userRepository.js';
import * as UserUseCases from '../use-cases/userUseCases.js';

export const getUserById = async (req, res) => {
  try {
    const user = await UserUseCases.getUserByIdUseCase(req.params.id, userRepository);
    res.json(user);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getAllUsers = async(req, res) => {
    try{
        const users = await UserUseCases.getAllUserUseCase(userRepository);
        res.json(users);
    } catch (error){
        res.status(404).json({error: error.message});
    }
}

export const createUser = async (req, res) => {
  try {
    const newUser = await UserUseCases.createUserUseCase(req.body, userRepository);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteUser = async (req, res) => {
  try {
    await UserUseCases.deleteUserUseCase(req.params.id, userRepository);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};