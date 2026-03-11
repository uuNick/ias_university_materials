import { NotFoundError, BadRequestError, ConflictError } from "../errors/CommonErrors.js";


export const getAuthorByIdUseCase = async (id, repository) => {
  if (!id) {
    throw new BadRequestError('ID автора обязателен');
  }

  const author = await repository.findById(id);
  
  if (!author) {
    throw new NotFoundError(`Автор с ID ${id} не найден`);
  }
  
  return author;
};

export const getAllAuthorsUseCase = async (repository) => {
  return await repository.getAll();
};


export const createAuthorUseCase = async (data, repository) => {
  if (!data.fullName) {
    throw new BadRequestError('ФИО автора обязательно для заполнения');
  }

  const existingAuthor = await repository.findByFullName(data.fullName);

  if (existingAuthor) {
    throw new ConflictError(`Автор с ФИО "${data.fullName}" уже существует`);
  }
  
  return await repository.create(data);
};


export const updateAuthorUseCase = async (id, data, repository) => {
  if (!id) {
    throw new BadRequestError('ID автора обязателен для обновления');
  }

  const author = await repository.findById(id);
  if (!author) {
    throw new NotFoundError(`Автор с ID ${id} не найден`);
  }

  return await repository.update(id, data);
};


export const deleteAuthorUseCase = async (id, repository) => {
  if (!id) {
    throw new BadRequestError('ID автора обязателен для удаления');
  }

  const author = await repository.findById(id);
  if (!author) {
    throw new NotFoundError(`Автор с ID ${id} не найден`);
  }

  return await repository.delete(id);
};


export const getTopAuthorsUseCase = async (repository, limit) => {
  const authors = await repository.getAuthorsCountStats(limit);
  
  if (!authors || authors.length === 0) {
    throw new NotFoundError('Данные для формирования статистики авторов отсутствуют');
  }
  
  return authors;
};

