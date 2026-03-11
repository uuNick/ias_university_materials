import { NotFoundError, BadRequestError, ConflictError } from "../errors/CommonErrors.js";

export const getAllSpecialitiesUseCase = async (repository) => {
  const specialities = await repository.getAll();
  
  if (!specialities || specialities.length === 0) {
    throw new NotFoundError('Список специальностей пуст');
  }
  
  return specialities;
};

export const getSpecialityByCodeUseCase = async (code, repository) => {
  if (!code) {
    throw new BadRequestError('Код специальности обязателен');
  }
  const spec = await repository.findByCode(code);
  if (!spec){
    throw new NotFoundError(`Специальность с кодом ${code} не найдена`);
  }
  return spec;
};

export const createSpecialityUseCase = async (data, repository) => {
  if (!data.code || !data.name) throw new BadRequestError('Код и название специальности обязательны');

  const existing = await repository.findByCode(data.code);
  if (existing) throw new ConflictError(`Специальность с кодом "${data.code}" уже существует`);

  return await repository.create(data);
};

export const updateSpecialityUseCase = async (code, data, repository) => {
  if (!code) {
    throw new BadRequestError('Код специальности обязателен для обновления');
  }
  const spec = await repository.findByCode(code);
  if (!spec) throw new NotFoundError(`Специальность с кодом "${code}" не найдена`);
  
  return await repository.update(code, data);
};

export const deleteSpecialityUseCase = async (code, repository) => {
  if (!code) {
    throw new BadRequestError('Код специальности обязателен для удаления');
  }

  const spec = await repository.findByCode(code);
  
  if (!spec) {
    throw new NotFoundError(`Специальность с кодом ${id} не найдена`);
  }

  return await repository.delete(id);
};

export const getSpecialityReportByYearUseCase = async (params, repository) => {
  const currentYear = new Date().getFullYear();
  const startYear = parseInt(params.startYear) || 2020;
  const endYear = parseInt(params.endYear) || currentYear;

  if (startYear > endYear) {
    throw new BadRequestError('Год начала не может быть позже года окончания');
  }

  if (startYear < 2010 || endYear > currentYear) {
    throw new BadRequestError(`Допустимый диапазон отчетов: 2010 - ${currentYear} гг.`);
  }

  const rawData = await repository.getSpecialityReportByYear(startYear, endYear);

  if (!rawData || rawData.length === 0) {
    throw new NotFoundError('Данные по специальностям за указанный период не найдены');
  }

  const totals = {
    speciality_title: 'Итого',
    total: 0
  };
  
  for (let y = startYear; y <= endYear; y++) {
    totals[y] = 0;
  }

  const reportData = rawData.map(row => {
    for (let year = startYear; year <= endYear; year++) {
        const count = Number(row[year] || 0);
        totals[year] += count;
    }
    totals.total += Number(row.total || 0);
    return row;
  });

  return [...reportData, totals];
};