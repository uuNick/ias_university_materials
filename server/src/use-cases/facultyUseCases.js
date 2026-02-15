export const createFacultyUseCase = async (data, repository) => {
  if (!data.name || !data.url) throw new Error('Имя и URL обязательны');
  return await repository.create(data);
};

export const getFacultyByIdUseCase = async (id, repository) => {
  const faculty = await repository.findById(id);
  if (!faculty) throw new Error('Факультет не найден');
  return faculty;
};

export const getAllFacultyUseCase = async (repository) => {
  const faculties = await repository.getAll();
  if (!faculties) throw new Error('Факультеты не найдены');
  return faculties;
};

export const updateFacultyUseCase = async (id, data, repository) => {
  const faculty = await repository.findById(id);
  if (!faculty) throw new Error('Факультет не найден');
  return await repository.update(id, data);
};

export const deleteFacultyUseCase = async (id, repository) => {
  return await repository.delete(id);
};