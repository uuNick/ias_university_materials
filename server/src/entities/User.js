export class User {
  constructor({ user_id, full_name, login, role_id, faculty_id, department_id }) {
    this.id = user_id;
    this.fullName = full_name;
    this.login = login;
    this.roleId = role_id;
    this.facultyId = faculty_id;
    this.departmentId = department_id;
  }

  isAdmin() {
    return this.roleId === 1; // 1 - Admin
  }
}