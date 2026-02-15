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
  }
};