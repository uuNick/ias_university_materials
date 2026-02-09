import { getAuthorsUseCase } from '../use-cases/getAuthors.js';
import { authorRepository } from '../repositories/authorRepository.js';

const getAuthors = async (req, res) => {
  try {
    const authors = await getAuthorsUseCase(authorRepository);
    res.json(authors);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
    getAuthors
};