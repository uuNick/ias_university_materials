import { authorRepository } from '../repositories/authorRepository.js';
import * as AuthorCases from '../use-cases/authorUseCases.js';

export const getAuthorById = async (req, res) => {
  try {
    const author = await AuthorCases.getAuthorByIdUseCase(req.params.id, authorRepository);
    res.json(author);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const getAllAuthors = async (req, res) => {
  try {
    const authors = await AuthorCases.getAllAuthorsUseCase(authorRepository);
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createAuthor = async (req, res) => {
  try {
    const author = await AuthorCases.createAuthorUseCase(req.body, authorRepository);
    res.status(201).json(author);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateAuthor = async(req, res) => {
  try{
    const author = await AuthorCases.updateAuthorUseCase(req.body, authorRepository);
    res.status(200).json(author);
  } catch (error){
    res.status(500).json({error: error.message});
  }
}

export const deleteAuthor = async (req, res) => {
  try {
    await AuthorCases.deleteAuthorUseCase(req.params.id, authorRepository);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getTopAuthors = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 25;
    const stats = await AuthorCases.getTopAuthorsUseCase(authorRepository, limit);
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};