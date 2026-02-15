export const getUserByIdUseCase = async (id, repository) => {
  const user = await repository.findById(id);
  if (!user) throw new Error('Пользователь не найден');
  return user;
};

export const getAllUserUseCase = async (repository) => {
    return await repository.getAll();
}

export const createUserUseCase = async (data, repository) => {
  const existingUser = await repository.findByLogin(data.login);

  if (existingUser) {
    throw new Error(`Логин "${data.login}" уже занят`);
  }

  return await repository.create(data);
};

export const updateUserUseCase = async (id, data, repository) => {
  return await repository.update(id, data);
};

export const deleteUserUseCase = async (id, repository) => {
  return await repository.delete(id);
};
