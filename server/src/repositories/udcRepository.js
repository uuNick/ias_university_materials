import prisma from '../repositories/prisma-client.js';
import { UdcCode } from '../entities/UdcCode.js';

export const udcRepository = {
  async getAll() {
    const list = await prisma.udc_codes.findMany();
    return list.map(item => new UdcCode(item));
  },

  async findByCode(code) {
    const data = await prisma.udc_codes.findUnique({
      where: { code: code }
    });
    return data ? new UdcCode(data) : null;
  },

  async create(data) {
    const raw = await prisma.udc_codes.create({
      data: { 
        code: data.code, 
        title: data.title 
      }
    });
    return new UdcCode(raw);
  },

  async update(code, data) {
    const raw = await prisma.udc_codes.update({
      where: { code: code },
      data: { title: data.title }
    });
    return new UdcCode(raw);
  },

  async delete(code) {
    await prisma.udc_codes.delete({
      where: { code: code }
    });
    return true;
  }
};