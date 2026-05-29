import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Container, Box, Typography, Paper, Button,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow,
    CircularProgress, Alert, Snackbar, TextField, TablePagination, InputAdornment,
    IconButton
} from '@mui/material';
import DownloadIcon from '@mui/icons-material/Download';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

import * as yup from 'yup';

import AdminTableRow from '../components/Tables/AdminTableRow';

import userService from '../services/userService';
import facultyService from '../services/facultyService';
import departmentService from '../services/departmentService';
import adminService from '../services/adminService';

import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const userValidationSchema = yup.object().shape({
    fullName: yup.string()
        .trim()
        .required('ФИО обязательно для заполнения')
        .min(10, 'ФИО должно содержать не менее 10 символов'),
    login: yup.string()
        .trim()
        .required('Логин обязателен')
        .min(3, 'Логин должен быть не менее 3 символов'),
    email: yup.string()
        .trim()
        .notRequired()
        .transform((value) => (value === "" ? null : value))
        .nullable()
        .email('Некорректный формат Email'),
});

const AdminPage = () => {
    const navigate = useNavigate();

    const [roles, setRoles] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [departments, setDepartments] = useState([]);

    // Состояния для пользователей и пагинации
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [tableLoading, setTableLoading] = useState(false); // Лоадер чисто для перезагрузки таблицы
    const [error, setError] = useState('');
    const [validationErrors, setValidationErrors] = useState({});
    const [editingRowId, setEditingRowId] = useState(null);

    // Параметры серверной пагинации и поиска
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0); // MUI использует пагинацию с 0, а сервер с 1
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [totalItems, setTotalItems] = useState(0);

    const [parserLoading, setParserLoading] = useState(false);
    const [backupLoading, setBackupLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    // Функция загрузки пользователей (обернута в useCallback, чтобы не пересоздаваться)
    const loadUsers = useCallback(async (searchQuery, currentPage, limit) => {
        try {
            setTableLoading(true);
            // Прибавляем 1, так как на сервере страницы начинаются с 1
            const serverPage = currentPage + 1;
            const response = await userService.getAllUsers(searchQuery, serverPage, limit);

            // Внимание: сервер теперь возвращает { data: [...], pagination: {...} }
            setUsers(response.data || []);
            setTotalItems(response.pagination?.totalItems || 0);
        } catch (err) {
            console.error('Ошибка при загрузке пользователей:', err);
            setError('Не удалось обновить список пользователей');
        } finally {
            setTableLoading(false);
            setLoading(false);
        }
    }, []);

    // Первоначальная загрузка справочников и первой страницы
    useEffect(() => {
        const initDashboard = async () => {
            try {
                const [rolesData, facultiesData, deptsData] = await Promise.all([
                    userService.getAllRoles(),
                    facultyService.getAllFaculties(),
                    departmentService.getAllDepartments()
                ]);
                setRoles(rolesData);
                setFaculties(facultiesData);
                setDepartments(deptsData);

                // Загружаем первую порцию пользователей
                await loadUsers(search, page, rowsPerPage);
            } catch (err) {
                setError('Ошибка при загрузке данных справочников с сервера');
                console.error(err);
                setLoading(false);
            }
        };
        initDashboard();
    }, [loadUsers]);

    // Срабатывает при изменении страницы в UI
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
        loadUsers(search, newPage, rowsPerPage);
    };

    // Срабатывает при изменении количества строк на страницу
    const handleChangeRowsPerPage = (event) => {
        const newRowsPerPage = parseInt(event.target.value, 10);
        setRowsPerPage(newRowsPerPage);
        setPage(0); // Сбрасываем на первую страницу
        loadUsers(search, 0, newRowsPerPage);
    };

    // Срабатывает при вводе текста в поиск
    const handleSearchChange = (event) => {
        const value = event.target.value;
        setSearch(value);
        setPage(0); // При поиске всегда возвращаемся на 1 страницу
        loadUsers(value, 0, rowsPerPage);
    };
    const handleClearSearch = () => {
        setSearch('');
        setPage(0); // Сбрасываем на первую страницу
        loadUsers('', 0, rowsPerPage); // Загружаем чистый список пользователей
    };

    const handleBackupDownload = async () => {
        try {
            setBackupLoading(true);
            const blobData = await adminService.downloadDatabaseBackup();
            const url = window.URL.createObjectURL(new Blob([blobData]));
            const link = document.createElement('a');
            link.href = url;
            const dateStr = new Date().toISOString().split('T')[0];
            const generatedFileName = `university_library_db_backup_${dateStr}.sql`;
            link.setAttribute('download', generatedFileName);
            document.body.appendChild(link);
            link.click();
            link.parentNode.removeChild(link);
            window.URL.revokeObjectURL(url);

            setSnackbar({ open: true, message: 'Резервная копия успешно скачана', severity: 'success' });
        } catch (err) {
            console.error(err);
            setSnackbar({ open: true, message: 'Ошибка резервного копирования.', severity: 'error' });
        } finally {
            setBackupLoading(false);
        }
    };

    const handleStartParser = async () => {
        try {
            setParserLoading(true);
            const result = await adminService.runLibraryParser();
            setSnackbar({ open: true, message: result.message || 'Парсер запущен', severity: 'success' });
        } catch (err) {
            setSnackbar({ open: true, message: 'Не удалось запустить парсер', severity: 'error' });
        } finally {
            setParserLoading(false);
        }
    };

    const handleEditToggle = async (rowId) => {
        if (editingRowId === rowId) {
            const userToValidate = users.find(u => u.id === rowId);
            try {
                setValidationErrors({});
                await userValidationSchema.validate(userToValidate, { abortEarly: false });

                const updatePayload = {
                    full_name: userToValidate.fullName,
                    login: userToValidate.login,
                    email: userToValidate.email || null,
                    role_id: Number(userToValidate.roleId),
                    faculty_id: userToValidate.facultyId ? Number(userToValidate.facultyId) : null,
                    department_id: userToValidate.departmentId ? Number(userToValidate.departmentId) : null
                };

                await userService.updateUser(rowId, updatePayload);

                setEditingRowId(null);
                setSnackbar({ open: true, message: 'Данные пользователя успешно сохранены', severity: 'success' });

                // Перезагружаем текущую страницу, чтобы подтянуть чистые данные
                loadUsers(search, page, rowsPerPage);
            } catch (err) {
                if (err instanceof yup.ValidationError) {
                    const errors = {};
                    err.inner.forEach(e => { errors[e.path] = e.message; });
                    setValidationErrors(errors);
                } else if (err.response && err.response.status === 409) {
                    const serverMessage = err.response.data?.message || 'Конфликт данных';
                    const newErrors = {};
                    if (serverMessage.toLowerCase().includes('логин')) newErrors.login = serverMessage;
                    if (serverMessage.toLowerCase().includes('почт')) newErrors.email = serverMessage;
                    setValidationErrors(newErrors);
                    setSnackbar({ open: true, message: serverMessage, severity: 'error' });
                }
            }
        } else {
            setValidationErrors({});
            setEditingRowId(rowId);
        }
    };

    const handleCancelEdit = () => {
        setEditingRowId(null);
        setValidationErrors({});
        // Просто перечитываем страницу с сервера, отменяя локальные изменения в инпутах
        loadUsers(search, page, rowsPerPage);
    };

    const handleCellChange = (rowId, field, value) => {
        setUsers(prev => prev.map(u => {
            if (u.id === rowId) {
                let updated = { ...u, [field]: value };
                if (field === 'roleId') {
                    const roleObj = roles.find(r => r.id === value);
                    updated.roleName = roleObj ? roleObj.name : '';
                    if (value !== 4 && value !== 5) {
                        updated.facultyId = null; updated.departmentId = null;
                    }
                }
                return updated;
            }
            return u;
        }));
    };

    const handleDeleteUser = async (rowId, roleName) => {
        if (roleName === 'Администратор' && users.filter(u => u.roleName === 'Администратор').length <= 1 && page === 0) {
            alert('Нельзя удалить последнего Администратора.');
            return;
        }
        if (window.confirm('Вы действительно хотите удалить этого пользователя?')) {
            try {
                // ТДО: await userService.deleteUser(rowId);
                setSnackbar({ open: true, message: 'Пользователь успешно удален', severity: 'success' });
                loadUsers(search, page, rowsPerPage);
            } catch (err) {
                setSnackbar({ open: true, message: 'Ошибка при удалении', severity: 'error' });
            }
        }
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <>
            <Header />
            <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
                {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

                <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: '12px', position: 'relative' }}>
                    {/* Лоадер поверх таблицы во время быстрого переключения страниц или поиска */}
                    {tableLoading && (
                        <Box sx={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', bgcolor: 'rgba(255,255,255,0.6)', zIndex: 2, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                            <CircularProgress />
                        </Box>
                    )}

                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2} borderBottom="2px solid #e0e0e0" pb={2} flexWrap="wrap" gap={2}>
                        <Typography variant="h5" sx={{ color: '#0056b3', fontWeight: 'bold' }}>
                            Управление пользователями
                        </Typography>

                        {/* ПОЛЕ ПОИСКА */}
                        <TextField
                            size="small"
                            variant="outlined"
                            placeholder="Поиск по ФИО, логину, email..."
                            value={search}
                            onChange={handleSearchChange}
                            sx={{ width: '350px', bgcolor: '#fff' }}
                            InputProps={{
                                // Лупа слева
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <SearchIcon color="action" />
                                    </InputAdornment>
                                ),
                                // Крестик справа (появляется только если search не пустой)
                                endAdornment: search && (
                                    <InputAdornment position="end">
                                        <IconButton
                                            aria-label="очистить поиск"
                                            onClick={handleClearSearch}
                                            edge="end"
                                            size="small"
                                            sx={{ color: 'text.secondary' }}
                                        >
                                            <ClearIcon fontSize="small" />
                                        </IconButton>
                                    </InputAdornment>
                                )
                            }}
                        />

                        <Button
                            variant="contained"
                            onClick={() => navigate('/registration')}
                            sx={{ bgcolor: '#0056b3', textTransform: 'none', fontWeight: 'bold', '&:hover': { bgcolor: '#004494' } }}
                        >
                            Добавить пользователя
                        </Button>
                    </Box>

                    <TableContainer>
                        <Table size="small">
                            <TableHead sx={{ bgcolor: '#f8f9fa' }}>
                                <TableRow>
                                    <TableCell width="50px" />
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>№</TableCell>
                                    <TableCell align="left" sx={{ fontWeight: 'bold' }}>ФИО пользователя</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Логин</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Роль</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Редактировать</TableCell>
                                    <TableCell align="center" sx={{ fontWeight: 'bold' }}>Удалить</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {users.length > 0 ? (
                                    users.map((user, index) => (
                                        <AdminTableRow
                                            key={user.id}
                                            // Вычисляем сквозной номер строки с учетом текущей страницы
                                            row={{ ...user, index: page * rowsPerPage + index + 1 }}
                                            isEditing={editingRowId === user.id}
                                            validationErrors={validationErrors}
                                            onEditToggle={handleEditToggle}
                                            onCancelEdit={handleCancelEdit}
                                            onDelete={handleDeleteUser}
                                            onCellChange={handleCellChange}
                                            roles={roles}
                                            faculties={faculties}
                                            departments={departments}
                                        />
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan={7} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                                            Пользователи не найдены
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </TableContainer>

                    {/* БЛОК УПРАВЛЕНИЯ ПАГИНАЦИЕЙ */}
                    <TablePagination
                        component="div"
                        count={totalItems}
                        page={page}
                        onPageChange={handleChangePage}
                        rowsPerPage={rowsPerPage}
                        onRowsPerPageChange={handleChangeRowsPerPage}
                        rowsPerPageOptions={[5, 10, 25]}
                        labelRowsPerPage="Строк на странице:"
                        labelDisplayedRows={({ from, to, count }) => `${from}–${to} из ${count !== -1 ? count : `более чем ${to}`}`}
                    />
                </Paper>

                {/* Блоки парсера и бэкапа остаются без изменений */}
                <Paper elevation={2} sx={{ p: 3, mb: 4, borderRadius: '12px' }}>
                    <Typography variant="h6" sx={{ color: '#0056b3', fontWeight: 'bold', mb: 2 }}>Парсер материалов</Typography>
                    <Button variant="contained" onClick={handleStartParser} disabled={parserLoading} sx={{ bgcolor: '#0056b3', textTransform: 'none', fontWeight: 'bold' }}>
                        {parserLoading ? 'Выполняется...' : 'Запуск парсера'}
                    </Button>
                </Paper>

                <Paper elevation={2} sx={{ p: 3, borderRadius: '12px' }}>
                    <Typography variant="h6" sx={{ color: '#0056b3', fontWeight: 'bold', mb: 2 }}>Резервное копирование БД</Typography>
                    <Button variant="contained" onClick={handleBackupDownload} disabled={backupLoading} startIcon={backupLoading ? <CircularProgress size={20} color="inherit" /> : <DownloadIcon />} sx={{ bgcolor: '#0056b3', mb: 2, textTransform: 'none', fontWeight: 'bold', '&:hover': { bgcolor: '#004494' } }}>
                        {backupLoading ? 'Создание...' : 'Резервное копирование БД'}
                    </Button>
                </Paper>
            </Container>

            <Snackbar open={snackbar.open} autoHideDuration={5000} onClose={() => setSnackbar({ ...snackbar, open: false })} anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}>
                <Alert severity={snackbar.severity} variant="filled" sx={{ width: '100%' }}>{snackbar.message}</Alert>
            </Snackbar>
            <Footer />
        </>
    );
};

export default AdminPage;