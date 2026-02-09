export const getAuthorsUseCase = async (repository) => {
  // Фильтрация, сортировка, проверка прав доступа
  return await repository.getAll();
};