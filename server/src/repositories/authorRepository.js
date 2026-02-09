import prisma from './prisma-client.js';
import { Author } from '../entities/Author.js';

export const authorRepository = {
  async getAll() {
    const rawAuthors = await prisma.authors.findMany();
    return rawAuthors.map(m => new Author(m));
  },
  
  async getById(id) {
    const raw = await prisma.authors.findUnique({ where: { id: Number(id) } });
    return raw ? new Author(raw) : null;
  }
};