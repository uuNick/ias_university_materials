import prisma from '../repositories/prisma-client.js';
import { Faculty } from '../entities/Faculty.js';

export const facultyRepository = {
  async getAll() {
    const data = await prisma.faculties.findMany();
    return data.map(f => new Faculty(f));
  },
  async findById(id) {
    const data = await prisma.faculties.findUnique({ where: { id: Number(id) } });
    return data ? new Faculty(data) : null;
  },
  async create(data) {
    const raw = await prisma.faculties.create({ data: {id: data.id, name: data.name, url: data.url } });
    return new Faculty(raw);
  },
  async update(id, data) {
    const raw = await prisma.faculties.update({ where: { id: Number(id) }, data });
    return new Faculty(raw);
  },
  async delete(id) {
    return await prisma.faculties.delete({ where: { id: Number(id) } });
  }
};