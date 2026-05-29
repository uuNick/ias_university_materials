import prisma from '../repositories/prisma-client.js';
import { Speciality } from '../entities/Speciality.js';

export const specialityRepository = {
  async getAll() {
    return await prisma.specialties.findMany();
  },

  async findWithMaterials() {
    return await prisma.specialties.findMany({
      where: {
        material_specialties: {
          some: {}
        }
      },
      select: {
        spec_code: true,
        spec_name: true
      },
      orderBy: {
        spec_code: 'asc'
      }
    });
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
  },

  async getMaterialsBySpecialty(specCode, startYear = null, endYear = null) {
    const materialsWhere = {
      material_specialties: {
        some: {
          spec_code: specCode
        }
      }
    };

    if (startYear || endYear) {
      materialsWhere.issued_year = {};
      if (startYear) materialsWhere.issued_year.gte = startYear;
      if (endYear) materialsWhere.issued_year.lte = endYear;
    }

    const [specialty, materials] = await Promise.all([
      prisma.specialties.findUnique({
        where: { spec_code: specCode },
        select: { spec_code: true, spec_name: true }
      }),
      prisma.materials.findMany({
        where: materialsWhere,
        include: {
          material_authors: {
            include: {
              authors: true
            }
          }
        }
      })
    ]);

    if (!specialty) return null;

    return {
      spec_code: specialty.spec_code,
      spec_name: specialty.spec_name,
      material_specialties: materials.map(material => ({
        materials: material
      }))
    };
  },
  
  async getSpecialityDisciplinesWithMaterials({ specCode, startYear, endYear, departmentId, facultyDepartmentsIds }) {

    const disciplineWhere = {
      discipline_specialties: {
        some: { spec_code: specCode }
      }
    };

    if (departmentId) {
      disciplineWhere.department_disciplines = { some: { department_id: departmentId } };
    } else if (facultyDepartmentsIds && facultyDepartmentsIds.length > 0) {
      disciplineWhere.department_disciplines = { some: { department_id: { in: facultyDepartmentsIds } } };
    }

    const materialsWhere = {
      material_specialties: {
        some: { spec_code: specCode }
      }
    };

    if (startYear || endYear) {
      materialsWhere.issued_year = {};
      if (startYear) materialsWhere.issued_year.gte = startYear;
      if (endYear) materialsWhere.issued_year.lte = endYear;
    }

    const [disciplines, materials] = await Promise.all([
      prisma.disciplines.findMany({
        where: disciplineWhere,
        select: { id: true, name: true },
        orderBy: { name: 'asc' }
      }),
      prisma.materials.findMany({
        where: materialsWhere,
        select: {
          id: true,
          title: true,
          alternative_title: true,
          issued_year: true,
          uri: true,
          file_link: true,
          material_authors: {
            select: {
              authors: { select: { name: true } }
            }
          }
        }
      })
    ]);

    return { disciplines, materials };
  },
}