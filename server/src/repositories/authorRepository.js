import prisma from './prisma-client.js';
import { Author } from '../entities/Author.js';

export const authorRepository = {
  async getAll() {
    const rawAuthors = await prisma.authors.findMany();
    return rawAuthors.map(m => new Author(m));
  },
  
  async findById(id) {
    const raw = await prisma.authors.findUnique({ where: { id: Number(id) } });
    return raw ? new Author(raw) : null;
  },

  async findByFullName(fullName) {
    const raw = await prisma.authors.findUnique({ 
      where: { name: fullName } 
    });
    return raw ? new Author(raw) : null;
  },

  async create(data) {
    const raw = await prisma.authors.create({
      data: {
        id: data.id, // Если ID не автоинкрементный
        name: data.name
      }
    });
    return new Author(raw);
  },

  async update(id, data) {
    const raw = await prisma.authors.update({
      where: { id: Number(id) },
      data: { name: data.name }
    });
    return new Author(raw);
  },

  async delete(id) {
    await prisma.authors.delete({
      where: { id: Number(id) }
    });
    return true;
  }

  // async countMaterials(authorId) {
  //   const result = await prisma.authors.findUnique({
  //     where: { id: Number(authorId) },
  //     include: {
  //       _count: {
  //         select: { materials: true } // "materials" — имя поля связи в вашей prisma schema
  //       }
  //     }
  //   });

  //   return result ? result._count.materials : 0;
  // }

  
};