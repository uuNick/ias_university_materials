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

export const getFacultyReportOnYearUseCase = async (params, repository) => {
  const startYear = parseInt(params.startYear) || 2020;
  const endYear = parseInt(params.endYear) || 2026;

  if (startYear < 2010 || endYear > 2026) {
    throw new Error('Диапазон дат должен быть в пределах 2010-2026 гг.');
  }
  if (startYear > endYear) {
    throw new Error('Год начала не может быть больше года окончания');
  }

  const reportData = await repository.getMaterialsReportOnYear(startYear, endYear);

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
  const startYear = parseInt(params.startYear) || 2020;
  const endYear = parseInt(params.endYear) || 2026;

  const rawData = await repository.getMaterialsReportOnYearWithDepartments(startYear, endYear);

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
