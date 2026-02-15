export const getAllKeywordsUseCase = async (repository) => {
  return await repository.getAll();
};

export const getKeywordByIdUseCase = async (id, repository) => {
  const keyword = await repository.findById(id);
  if (!keyword) throw new Error('Ключевое слово не найдено');
  return keyword;
};

export const createKeywordUseCase = async (data, repository) => {
  if (!data.word) throw new Error('Слово не может быть пустым');

  const existing = await repository.findByWord(data.word);
  if (existing) throw new Error(`Ключевое слово "${data.word}" уже существует`);

  return await repository.create(data);
};

export const updateKeywordUseCase = async (id, data, repository) => {
  const keyword = await repository.findById(id);
  if (!keyword) throw new Error('Ключевое слово не найдено');
  
  return await repository.update(id, data);
};

export const deleteKeywordUseCase = async (id, repository) => {
  return await repository.delete(id);
};