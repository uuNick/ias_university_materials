import prisma from '../repositories/prisma-client.js';
import { Department } from '../entities/Department.js';

export const departmentRepository = {
  async getAll() {
    const data = await prisma.departments.findMany();
    return data.map(d => new Department(d));
  },
  async findByFaculty(facultyId) {
    const data = await prisma.departments.findMany({ where: { faculty_id: Number(facultyId) } });
    return data.map(d => new Department(d));
  },
  async findById(id) {
    const data = await prisma.departments.findUnique({ where: { id: Number(id) } });
    return data ? new Department(data) : null;
  },
  async create(data) {
    const raw = await prisma.departments.create({ 
      data: { id: data.id, name: data.name, url: data.url, faculty_id: Number(data.facultyId) } 
    });
    return new Department(raw);
  },
  async update(id, data) {
    const raw = await prisma.departments.update({ where: { id: Number(id) }, data });
    return new Faculty(raw);
  },
  async delete(id) {
    return await prisma.departments.delete({ where: { id: Number(id) } });
  }
};