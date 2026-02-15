import prisma from '../repositories/prisma-client.js';
import { User } from '../entities/User.js';

export const userRepository = {
  async findById(id) {
    const raw = await prisma.users.findUnique({ where: { user_id: Number(id) } });
    return raw ? new User(raw) : null;
  },

  async getAll() {
    const list = await prisma.users.findMany();
    return list.map(u => new User(u));
  },

  async findByLogin(login) {
    const raw = await prisma.users.findUnique({ 
      where: { login: login } 
    });
    return raw ? new User(raw) : null;
  },

  async create(userData) {
    const raw = await prisma.users.create({ data: userData });
    return new User(raw);
  },

  async update(id, userData) {
    const raw = await prisma.users.update({
      where: { user_id: Number(id) },
      data: userData
    });
    return new User(raw);
  },

  async delete(id) {
    await prisma.users.delete({ where: { user_id: Number(id) } });
    return true;
  }
};