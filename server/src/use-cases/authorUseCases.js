export const getAuthorByIdUseCase = async (id, repository) => {
  const author = await repository.findById(id);
  if (!author) throw new Error('Автор не найден');
  return author;
};

export const getAllAuthorsUseCase = async (repository) => {
  return await repository.getAll();
};

export const createAuthorUseCase = async (data, repository) => {
  const existingAuthor = await repository.findByFullName(data.fullName);

  if (existingAuthor) {
    throw new Error(`ФИО "${data.login}" уже записано`);
  }
  return await repository.create(data);
};

export const updateAuthorUseCase = async (id, data, repository) => {
  const author = await repository.findById(id);
  if (!author) throw new Error('Автор не найден');
  return await repository.update(id, data);
};

export const deleteAuthorUseCase = async (id, repository) => {
  return await repository.delete(id);
};