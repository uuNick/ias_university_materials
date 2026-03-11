import { authorRepository } from '../repositories/authorRepository.js';
import * as AuthorCases from '../use-cases/authorUseCases.js';
import { asyncHandler } from '../middleware/asyncHandler.js';


export const getAuthorById = asyncHandler (async(req, res) => {
  const author = await AuthorCases.getAuthorByIdUseCase(req.params.id, authorRepository);
  res.json(author);
});

export const getAllAuthors = asyncHandler (async(req, res) => {
  const authors = await AuthorCases.getAllAuthorsUseCase(authorRepository);
  res.json(authors);
});

export const createAuthor = asyncHandler (async(req, res) => {
    const author = await AuthorCases.createAuthorUseCase(req.body, authorRepository);
    res.status(201).json(author);
});

export const updateAuthor = asyncHandler (async(req, res) => {
  const author = await AuthorCases.updateAuthorUseCase(req.params.id, req.body, authorRepository);
  res.status(200).json(author);
});

export const deleteAuthor = asyncHandler (async(req, res) => {
    await AuthorCases.deleteAuthorUseCase(req.params.id, authorRepository);
    res.status(204).send();
});

export const getTopAuthors = asyncHandler (async(req, res) => {
    const limit = parseInt(req.query.limit) || 25;
    const stats = await AuthorCases.getTopAuthorsUseCase(authorRepository, limit);
    res.json(stats);
});