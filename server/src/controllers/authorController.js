import { authorRepository } from '../repositories/authorRepository.js';
import * as UseCases from '../use-cases/authorUseCases.js';

export const getAuthorById = async (req, res) => {
  try {
    const author = await UseCases.getAuthorByIdUseCase(req.params.id, authorRepository);
    res.json(author);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getAllAuthors = async (req, res) => {
  try {
    const authors = await UseCases.getAllAuthorsUseCase(authorRepository);
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAuthor = async (req, res) => {
  try {
    const author = await UseCases.createAuthorUseCase(req.body, authorRepository);
    res.status(201).json(author);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateAuthor = async(req, res) => {
  try{
    const author = await UseCases.updateAuthorUseCase(req.body, authorRepository);
    res.status(200).json(author);
  } catch (error){
    res.status(500).json({error: error.message});
  }
}

export const deleteAuthor = async (req, res) => {
  try {
    await UseCases.deleteAuthorUseCase(req.params.id, authorRepository);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};