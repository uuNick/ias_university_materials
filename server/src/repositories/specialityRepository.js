import prisma from '../repositories/prisma-client.js';
import { Speciality } from '../entities/Speciality.js';

export const specialityRepository = {
  async getAll() {
    const list = await prisma.specialties.findMany();
    return list.map(s => new Speciality(s));
  },

  async findByCode(code) {
    const data = await prisma.specialties.findUnique({
      where: { spec_code: code }
    });
    return data ? new Speciality(data) : null;
  },

  async create(data) {
    const raw = await prisma.specialties.create({
      data: { 
        spec_code: data.code, 
        spec_name: data.name 
      }
    });
    return new Speciality(raw);
  },

  async update(code, data) {
    const raw = await prisma.specialties.update({
      where: { spec_code: code },
      data: { spec_name: data.name }
    });
    return new Speciality(raw);
  },

  async delete(code) {
    await prisma.specialties.delete({
      where: { spec_code: code }
    });
    return true;
  },

  async getSpecialityReportByYear(startYear, endYear) {
    let yearColumns = '';
    for (let year = startYear; year <= endYear; year++) {
      yearColumns += `SUM(CASE WHEN m.issued_year = ${year} THEN 1 ELSE 0 END) as "${year}", `;
    }

    const query = `
      SELECT 
        s.spec_code || ' ' || s.spec_name as speciality_title,
        ${yearColumns}
        COUNT(m.id) as total
      FROM specialties s
      LEFT JOIN material_specialties ms ON s.spec_code = ms.spec_code
      LEFT JOIN materials m ON ms.material_id = m.id
      GROUP BY s.spec_code, s.spec_name
      ORDER BY s.spec_code ASC
    `;

    return await prisma.$queryRawUnsafe(query);
  }
};