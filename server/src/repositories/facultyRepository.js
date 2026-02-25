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
  },
  async getMaterialsReportOnYear(startYear, endYear) {
    let yearColumns = '';
    for (let year = startYear; year <= endYear; year++) {
      yearColumns += `SUM(CASE WHEN m.issued_year = ${year} THEN 1 ELSE 0 END) as "${year}", `;
    }

    const query = `
      SELECT 
        f.name as faculty_name,
        ${yearColumns}
        COUNT(m.id) as total
      FROM faculties f
      LEFT JOIN departments d ON f.id = d.faculty_id
      LEFT JOIN materials m ON d.id = m.department_id
      GROUP BY f.name
      ORDER BY total DESC
    `;

    return await prisma.$queryRawUnsafe(query);
  }
};