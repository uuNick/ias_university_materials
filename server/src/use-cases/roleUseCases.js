export const getAllRolesUseCase = async (repository) => {
  return await repository.getAll();
};

export const getRoleByIdUseCase = async (id, repository) => {
  const role = await repository.findById(id);
  if (!role) throw new Error('Роль не найдена');
  return role;
};

export const createRoleUseCase = async (data, repository) => {
  if (!data.name) throw new Error('Название роли обязательно');

  const existing = await repository.findByName(data.name);
  if (existing) throw new Error(`Роль "${data.name}" уже существует`);

  return await repository.create(data);
};

export const updateRoleUseCase = async (id, data, repository) => {
  const role = await repository.findById(id);
  if (!role) throw new Error('Роль не найдена');
  
  return await repository.update(id, data);
};

export const deleteRoleUseCase = async (id, repository) => {
  // TO DO: нельзя удалить роль, если она назначена пользователям
  return await repository.delete(id);
};