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
  async getDepartmentIdsByFaculty(facultyId) {
    const departments = await prisma.departments.findMany({
      where: { faculty_id: facultyId },
      select: { id: true }
    });
    return departments.map(d => d.id);
  },
  async findById(id) {
    const data = await prisma.departments.findUnique({ where: { id: Number(id) } });
    return data ? new Department(data) : null;
  },
  async findByName(name) {
    const raw = await prisma.departments.findUnique({
      where: { name: name }
    });
    return raw ? new Department(raw) : null
  },
  async findByUrl(url) {
    const raw = await prisma.departments.findUnique({
      where: { url: url }
    });
    return raw ? new Department(raw) : null
  },
  async create(data) {
    const raw = await prisma.departments.create({
      data: { name: data.name, url: data.url, faculty_id: Number(data.facultyId) }
    });
    return new Department(raw);
  },
  async update(id, data) {
    const raw = await prisma.departments.update({ where: { id: Number(id) }, data });
    return new Department(raw);
  },
  async delete(id) {
    return await prisma.departments.delete({ where: { id: Number(id) } });
  },
  async getDepartmentDisciplinesReportData(departmentName, startYear, endYear) {
    return await prisma.departments.findUnique({
      where: { name: departmentName },
      include: {
        department_disciplines: {
          where: {
            year_start: {
              ...(startYear && { gte: startYear }),
              ...(endYear && { lte: endYear }),
            }
          },
          include: {
            disciplines: true
          }
        },
        materials: {
          where: {
            issued_year: {
              ...(startYear && { gte: startYear }),
              ...(endYear && { lte: endYear }),
            }
          },
          include: {
            material_authors: {
              include: {
                authors: true
              }
            },
            material_specialties: true // Убрать?
          }
        }
      }
    });
  }

};

