import { NotFoundError, BadRequestError, ConflictError } from "../errors/CommonErrors.js";

export const createFacultyUseCase = async (data, repository) => {
  if (!data.name || !data.url) throw new BadRequestError('Для создания факультета необходимо указать имя и URL');
  
  const existingFacultyByName = await repository.findByName(data.name);

  if (existingFacultyByName){
    throw new ConflictError(`Факультет с именем "${data.name}" уже существует`);
  }

  const existingFacultyByUrl = await repository.findByName(data.url);

  if (existingFacultyByUrl){
    throw new ConflictError(`Факультет с URL-адресом "${data.url}" уже существует`);
  }
  
  return await repository.create(data);
};

export const getFacultyByIdUseCase = async (id, repository) => {
  if (!id) {
    throw new BadRequestError('ID факультета обязателен');
  }

  const faculty = await repository.findById(id);

  if (!faculty) throw new NotFoundError(`Факультет с ID ${id} не найден`);
  
  return faculty;
};

export const getAllFacultyUseCase = async (repository) => {
  const faculties = await repository.getAll();
  if (!faculties || faculties.length === 0) throw new NotFoundError('Список факультетов пуст');
  return faculties;
};

export const updateFacultyUseCase = async (id, data, repository) => {
  if (!id) {
    throw new BadRequestError('ID факультета обязателен для обновления');
  }

  const currentFaculty = await repository.findById(id);
  if (!currentFaculty) {
    throw new NotFoundError(`Факультет с ID ${id} не найден`);
  }

  if (data.name && data.name !== currentFaculty.name) {
    const existingByName = await repository.findByName(data.name);
    if (existingByName) {
      throw new ConflictError(`Имя "${data.name}" уже занято другим факультетом`);
    }
  }

  if (data.url && data.url !== currentFaculty.url) {
    const existingByUrl = await repository.findByUrl(data.url);
    if (existingByUrl) {
      throw new ConflictError(`URL "${data.url}" уже используется другим факультетом`);
    }
  }

  return await repository.update(id, data);
};

export const deleteFacultyUseCase = async (id, repository) => {
  if (!id) {
    throw new BadRequestError('ID факультета обязателен для удаления');
  }

  const faculty = await repository.findById(id);

  if (!faculty) {
    throw new NotFoundError(`Факультет с ID ${id} не найден`);
  }
  
  return await repository.delete(id);
};

export const getFacultyReportOnYearUseCase = async (params, repository) => {
  const currentYear = new Date().getFullYear();
  const startYear = parseInt(params.startYear) || 2020;
  const endYear = parseInt(params.endYear) || currentYear;

  if (startYear < 2010 || endYear > currentYear) {
    throw new BadRequestError(`Диапазон дат должен быть в пределах 2010-${currentYear} гг.`);
  }
  
  if (startYear > endYear) {
    throw new BadRequestError('Год начала не может быть больше года окончания');
  }

  const reportData = await repository.getMaterialsReportOnYear(startYear, endYear);

  if (!reportData || reportData.length === 0) {
    throw new NotFoundError('Данные для отчета по факультетам за указанный период не найдены');
  }

  const totals = reportData.reduce((acc, row) => {
    Object.keys(row).forEach(key => {
      if (key !== 'faculty_name') {
        acc[key] = (acc[key] || 0) + Number(row[key]);
      }
    });
    return acc;
  }, { faculty_name: 'Итого' });

  return [...reportData, totals];
};

export const getFacultyReportOnYearWithDepartmentsUseCase = async (params, repository) => {
  const currentYear = new Date().getFullYear();
  const startYear = parseInt(params.startYear) || 2020;
  const endYear = parseInt(params.endYear) || currentYear;

  if (startYear > endYear) {
    throw new BadRequestError('Год начала не может быть больше года окончания');
  }

  const rawData = await repository.getMaterialsReportOnYearWithDepartments(startYear, endYear);

  if (!rawData || rawData.length === 0) {
    throw new NotFoundError('Данные для отчета по факультетам в разрезе кафедр не найдены');
  }

  const grouped = rawData.reduce((acc, row) => {
    const facultyName = row.faculty_name;

    if (!acc[facultyName]) {
      acc[facultyName] = {
        name: facultyName,
        departments: [],
        totals: { total: 0 } 
      };
      for (let y = startYear; y <= endYear; y++) acc[facultyName].totals[y] = 0;
    }

    acc[facultyName].departments.push(row);
    
    for (let year = startYear; year <= endYear; year++) {
        acc[facultyName].totals[year] += Number(row[year] || 0);
    }
    acc[facultyName].totals.total += Number(row.total || 0);

    return acc;
  }, {});

  return Object.values(grouped);
};
