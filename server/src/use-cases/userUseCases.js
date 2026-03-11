import { NotFoundError, BadRequestError, ConflictError } from "../errors/CommonErrors.js";

export const getUserByIdUseCase = async (id, repository) => {
  if (!id) {
    throw new BadRequestError('ID пользователя обязателен');
  }
  const user = await repository.findById(id);
  if (!user) {
    throw new NotFoundError(`Пользователь с ID ${id} не найден`);
  }
  return user;
};

export const getAllUserUseCase = async (repository) => {
  const users = await repository.getAll();

  if (!users || users.length === 0) {
    throw new NotFoundError('Список пользователей пуст');
  }

  return users;
}

export const createUserUseCase = async (data, repository) => {
  if (!data.login) {
    throw new BadRequestError('Логин пользователя обязателен');
  }
  // if (!data.email) {
  //   throw new BadRequestError('Адрес электронной почты пользователя обязателен');
  // }
  if (!data.full_name) {
    throw new BadRequestError('ФИО пользователя обязательно');
  }

  const existingUserByLogin = await repository.findByLogin(data.login);

  if (existingUserByLogin) {
    throw new ConflictError(`Логин пользователя "${data.login}" уже занят`);
  }

  // const existingUserByEmail = await repository.findByEmail(data.email);

  // if (existingUserByEmail) {
  //   throw new ConflictError(`Адрес электронной почты "${data.email}" уже занят`);
  // }

  return await repository.create(data);
};

export const updateUserUseCase = async (id, data, repository) => {
  if (!id) {
    throw new BadRequestError('ID пользователя обязателен для обновления');
  }

  const currentUser = await repository.findById(id);
  if (!currentUser) {
    throw new NotFoundError(`Пользователь с ID ${id} не найден`);
  }

  if (data.login && data.login !== currentUser.login) {
    const existingByLogin = await repository.findByLogin(data.login);
    if (existingByLogin) {
      throw new ConflictError(`Логин "${data.name}" уже занят другим пользователем`);
    }
  }

  // if (data.email && data.email !== currentUser.email) {
  //   const existingByEmail = await repository.findByEmail(data.email);
  //   if (existingByEmail) {
  //     throw new ConflictError(`Адрес электронной почты "${data.url}" уже занят`);
  //   }
  // }
  
  return await repository.update(id, data);
};

export const deleteUserUseCase = async (id, repository) => {
  if (!id) {
    throw new BadRequestError('ID пользователя обязателен для удаления');
  }
  const user = await repository.findById(id);
  if (!user) {
    throw new NotFoundError(`Пользователь с ID ${id} не найден`);
  }
  return await repository.delete(id);
};
