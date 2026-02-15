export const getAllSpecialitiesUseCase = async (repository) => {
  return await repository.getAll();
};

export const getSpecialityByCodeUseCase = async (code, repository) => {
  const spec = await repository.findByCode(code);
  if (!spec) throw new Error('Специальность не найдена');
  return spec;
};

export const createSpecialityUseCase = async (data, repository) => {
  if (!data.code || !data.name) throw new Error('Код и название специальности обязательны');

  const existing = await repository.findByCode(data.code);
  if (existing) throw new Error(`Специальность с кодом "${data.code}" уже существует`);

  return await repository.create(data);
};

export const updateSpecialityUseCase = async (code, data, repository) => {
  const spec = await repository.findByCode(code);
  if (!spec) throw new Error('Специальность не найдена');
  
  return await repository.update(code, data);
};

export const deleteSpecialityUseCase = async (code, repository) => {
  return await repository.delete(code);
};