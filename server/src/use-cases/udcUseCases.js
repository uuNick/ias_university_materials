export const getAllUdcUseCase = async (repository) => {
  return await repository.getAll();
};

export const getUdcByCodeUseCase = async (code, repository) => {
  const udc = await repository.findByCode(code);
  if (!udc) throw new Error('Код УДК не найден');
  return udc;
};

export const createUdcUseCase = async (data, repository) => {
  if (!data.code) throw new Error('Код УДК обязателен');

  const existing = await repository.findByCode(data.code);
  if (existing) throw new Error(`Код УДК "${data.code}" уже существует в базе`);

  return await repository.create(data);
};

export const updateUdcUseCase = async (code, data, repository) => {
  const udc = await repository.findByCode(code);
  if (!udc) throw new Error('Код УДК не найден для обновления');
  
  return await repository.update(code, data);
};

export const deleteUdcUseCase = async (code, repository) => {
  return await repository.delete(code);
};