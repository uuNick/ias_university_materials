export class Material {
  constructor({ 
    id, title, alternative_title, abstract_text, 
    language_code, publisher, citation, uri, available_date, issued_year,
    document_uri, department_id,
    authors = [], keywords = [], types = [], specialities = [], material_udcCodes = []
  }) {
    this.id = id;
    this.title = title;
    this.alternativeTitle = alternative_title;
    this.abstract = abstract_text;
    this.language = language_code || 'ru';
    this.publisher = publisher;
    this.citation = citation;
    this.uri = uri;
    this.availableDate = available_date;
    this.documentUri = document_uri;
    this.departmentId = department_id;
    this.year = issued_year;
    
    // Вложенные сущности
    this.authors = authors; 
    this.keywords = keywords;
    this.types = types;
    this.specialities = specialities;
    this.materialUdcCodes = material_udcCodes;
  }
}