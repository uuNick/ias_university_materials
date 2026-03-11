import { NotFoundError, BadRequestError, ConflictError } from "../errors/CommonErrors.js";

export const createDepartmentUseCase = async (data, departmentRepository, facultyRepository) => {
  if (!data.faculty_id) {
    throw new BadRequestError('Для создания кафедры необходимо указать ID факультета');
  }
  if (!data.name) {
    throw new BadRequestError('Название кафедры обязательно');
  }
  if (!data.url) {
    throw new BadRequestError('URL-адрес кафедры обязателен');
  }

  const faculty = await facultyRepository.findById(data.faculty_id);
  
  if (!faculty) {
    throw new NotFoundError(`Невозможно создать кафедру: факультет с ID ${data.facultyId} не существует`);
  }

  const existingDepartmentByName = await departmentRepository.findByName(data.name);

  if (existingDepartmentByName){
    throw new ConflictError(`Кафедра с именем "${data.name}" уже существует`);
  }

  const existingDepartmentByUrl = await departmentRepository.findByUrl(data.url);

  if (existingDepartmentByUrl){
    throw new ConflictError(`Кафедра с URL-адресом "${data.url}" уже существует`);
  }
  
  return await departmentRepository.create(data);
};

export const getDepartmentByIdUseCase = async (id, repository) => {
  if (!id) {
    throw new BadRequestError('ID кафедры обязателен');
  }

  const department = await repository.findById(id);
  
  if (!department) {
    throw new NotFoundError(`Кафедра с ID ${id} не найдена`);
  }
  
  return department;
};

export const getDepartmentByFacultyUseCase = async (facultyId, repository) => {
  if (!facultyId) {
    throw new BadRequestError('ID факультета обязателен');
  }

  const departments = await repository.findByFaculty(facultyId);
  
  if (!departments || departments.length === 0) {
    throw new NotFoundError('Кафедры для данного факультета не найдены');
  }
  
  return departments;
};

export const getAllDepartmentUseCase = async (repository) => {
  const departments = await repository.getAll();
  
  if (!departments || departments.length === 0) {
    throw new NotFoundError('Список кафедр пуст');
  }
  
  return departments;
};

export const updateDepartmentUseCase = async (id, data, repository) => {
  if (!id) {
    throw new BadRequestError('ID кафедры обязателен для обновления');
  }

  const currentDept = await repository.findById(id);
  if (!currentDept) {
    throw new NotFoundError(`Кафедра с ID ${id} не найдена`);
  }

  if (data.name && data.name !== currentDept.name) {
    const existingByName = await repository.findByName(data.name);
    if (existingByName) {
      throw new ConflictError(`Имя "${data.name}" уже занято другой кафедрой`);
    }
  }

  if (data.url && data.url !== currentDept.url) {
    const existingByUrl = await repository.findByUrl(data.url);
    if (existingByUrl) {
      throw new ConflictError(`URL "${data.url}" уже используется другой кафедрой`);
    }
  }

  return await repository.update(id, data);
};

export const deleteDepartmentUseCase = async (id, repository) => {
  if (!id) {
    throw new BadRequestError('ID кафедры обязателен для удаления');
  }

  const department = await repository.findById(id);
  
  if (!department) {
    throw new NotFoundError(`Кафедра с ID ${id} не найдена`);
  }

  return await repository.delete(id);
};

