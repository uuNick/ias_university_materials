export const createDepartmentUseCase = async (data, departmentRepository, facultyRepository) => {
  const faculty = await facultyRepository.findById(data.facultyId);
  if (!faculty) throw new Error('Невозможно создать кафедру: факультет не существует');
  return await departmentRepository.create(data);
};

export const getDepartmentByIdUseCase = async (id, repository) => {
  const department = await repository.findById(id);
  if (!department) throw new Error('Кафедра не найдена');
  return department;
};

export const getDepartmentByFacultyUseCase = async (id, repository) => {
  const departments = await repository.findByFaculty(id);
  if (!departments) throw new Error('Кафедры не найдены');
  return departments;
};


export const getAllDepartmentUseCase = async (repository) => {
  const departments = await repository.getAll();
  if (!departments) throw new Error('кафедры не найдены');
  return departments;
};

export const updateDepartmentUseCase = async (id, data, repository) => {
  const department = await repository.findById(id);
  if (!department) throw new Error('Кафедра не найдена');
  return await repository.update(id, data);
};

export const deleteDepartmentUseCase = async (id, repository) => {
  return await repository.delete(id);
};