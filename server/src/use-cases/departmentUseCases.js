import { NotFoundError, BadRequestError, ConflictError } from "../errors/CommonErrors.js";
import {generateDepartmentDisciplinesExcelReport} from '../services/excelService.js'

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

  if (existingDepartmentByName) {
    throw new ConflictError(`Кафедра с именем "${data.name}" уже существует`);
  }

  const existingDepartmentByUrl = await departmentRepository.findByUrl(data.url);

  if (existingDepartmentByUrl) {
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

export const getDepartmentDisciplinesUseCase = async (departmentName, startYear, endYear, repository) => {
  if (!departmentName) {
    throw new BadRequestError('Название кафедры обязательно для формирования отчета');
  }

  const parsedStartYear = startYear ? parseInt(startYear, 10) : null;
  const parsedEndYear = endYear ? parseInt(endYear, 10) : null;

  if (parsedStartYear && parsedEndYear && parsedStartYear > parsedEndYear) {
    throw new BadRequestError('Начальный год не может быть больше конечного года');
  }

  const departmentData = await repository.getDepartmentDisciplinesReportData(departmentName, parsedStartYear, parsedEndYear);

  if (!departmentData) {
    throw new NotFoundError(`Кафедра "${departmentName}" не найдена`);
  }

  const allMaterials = departmentData.materials.map(material => {
    const authorsString = material.material_authors
      ? material.material_authors.map(ma => ma.authors.name).join('; ')
      : 'Автор не указан';

    return {
      id: material.id,
      title: material.title,
      alternativeTitle: material.alternative_title || '',
      authors: authorsString,
      issuedYear: material.issued_year || 'Н/Д',
      pages: material.pages || null,
      uri: material.uri,
      fileLink: material.file_link,
      citation: material.citation
    };
  });

  const rawRows = departmentData.department_disciplines.map(dd => {
    const discipline = dd.disciplines;

    // const matchingMaterials = allMaterials.filter(m =>
    //   m.title.toLowerCase().includes(discipline.name.toLowerCase()) ||
    //   m.alternativeTitle.toLowerCase().includes(discipline.name.toLowerCase())
    // );
    const matchingMaterials = allMaterials.filter(m =>
      m.title.toLowerCase().includes(discipline.name.toLowerCase())
    );


    return {
      disciplineId: discipline.id,
      disciplineName: discipline.name,
      yearStartBound: dd.year_start,
      materials: matchingMaterials
    };
  });

  const uniqueRows = rawRows.reduce((acc, current) => {
    const existingIndex = acc.findIndex(item => item.disciplineId === current.disciplineId);

    if (existingIndex > -1) {
      if (current.yearStartBound > acc[existingIndex].yearStartBound) {
        acc[existingIndex] = current;
      }
    } else {
      acc.push(current);
    }

    return acc;
  }, []);

  uniqueRows.sort((a, b) => a.disciplineName.localeCompare(b.disciplineName));

  return {
    departmentName: departmentData.name,
    startYear: parsedStartYear,
    endYear: parsedEndYear,
    rows: uniqueRows
  };
};

export const exportDepartmentDisciplinesToExcel = async (params) => {
  const {departmentName, startYear, endYear, repository} = params
  const reportData = await getDepartmentDisciplinesUseCase(departmentName, startYear, endYear, repository);

  const fileBuffer = await generateDepartmentDisciplinesExcelReport(reportData, startYear, endYear);

  return {
    buffer: fileBuffer,
    filename: `Report_Department_Disciplines_${startYear}-${endYear}.xlsx`
  };
}
