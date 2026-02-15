export const getAllTypesUseCase = async (repository) => {
  return await repository.getAll();
};

export const getTypeByIdUseCase = async (id, repository) => {
  const type = await repository.findById(id);
  if (!type) throw new Error('Тип материала не найден');
  return type;
};

export const createTypeUseCase = async (data, repository) => {
  if (!data.name) throw new Error('Название типа обязательно');
  
  const existing = await repository.findByName(data.name);
  if (existing) throw new Error(`Тип "${data.name}" уже существует`);

  return await repository.create(data);
};

export const updateTypeUseCase = async (id, data, repository) => {
  const type = await repository.findById(id);
  if (!type) throw new Error('Тип не найден');
  
  return await repository.update(id, data);
};

export const deleteTypeUseCase = async (id, repository) => {
  return await repository.delete(id);
};