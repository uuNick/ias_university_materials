import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Link,
    Typography,
    Box
} from '@mui/material';

const SpecialtyDisciplinesWithMaterialsTable = ({ data }) => {
    if (!data || !data.rows || data.rows.length === 0) {
        return (
            <Typography variant="body1" sx={{ p: 2, textAlign: 'center', color: 'text.secondary' }}>
                Нет данных для отображения
            </Typography>
        );
    }

    return (
        <TableContainer component={Paper} sx={{ width: '100%', my: 3, boxShadow: 2 }}>
            <Table aria-label="таблица дисциплин и материалов" sx={{ minWidth: 650 }}>
                <TableHead>
                    <TableRow sx={{ backgroundColor: 'grey.100' }}>
                        <TableCell
                            sx={{ fontWeight: 'bold', border: '1px solid', borderColor: 'divider', width: '30%' }}
                        >
                            Наименование предмета
                        </TableCell>
                        <TableCell
                            sx={{ fontWeight: 'bold', border: '1px solid', borderColor: 'divider' }}
                        >
                            Методические рекомендации
                        </TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {data.rows.map((row) => {
                        const hasMaterials = row.materials && row.materials.length > 0;
                        const rowSpanCount = hasMaterials ? row.materials.length : 1;

                        return (
                            <React.Fragment key={row.disciplineId}>
                                {/* Первая строка для текущей дисциплины */}
                                <TableRow hover>
                                    {/* Ячейка названия дисциплины с объединением строк */}
                                    <TableCell
                                        rowSpan={rowSpanCount}
                                        sx={{
                                            verticalAlign: 'top',
                                            border: '1px solid',
                                            borderColor: 'divider',
                                            backgroundColor: 'grey.50',
                                            fontWeight: 500
                                        }}
                                    >
                                        {row.disciplineName}
                                    </TableCell>

                                    {/* Контент первого материала */}
                                    <TableCell sx={{ verticalAlign: 'top', border: '1px solid', borderColor: 'divider' }}>
                                        {hasMaterials ? (
                                            <MaterialItem material={row.materials[0]} />
                                        ) : (
                                            <Typography variant="body2" sx={{ color: 'text.disabled', fontStyle: 'italic' }}>
                                                —
                                            </Typography>
                                        )}
                                    </TableCell>
                                </TableRow>

                                {/* Последующие строки для остальных материалов этой же дисциплины */}
                                {hasMaterials &&
                                    row.materials.slice(1).map((material) => (
                                        <TableRow key={material.materialId} hover>
                                            <TableCell sx={{ verticalAlign: 'top', border: '1px solid', borderColor: 'divider' }}>
                                                <MaterialItem material={material} />
                                            </TableCell>
                                        </TableRow>
                                    ))}
                            </React.Fragment>
                        );
                    })}
                </TableBody>
            </Table>
        </TableContainer>
    );
};

// Вспомогательный компонент для отображения карточки материала внутри ячейки
const MaterialItem = ({ material }) => {
    const { title, alternativeTitle, authors, issuedYear, uri, fileLink } = material;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
            {/* Название материала со ссылкой на репозиторий */}
            <Box sx={{
                fontWeight: 'bold',
                fontSize: '1.05rem',
                color: 'primary.main',
            }}>
                {title}
            </Box>

            {/* Авторы и Университет */}
            <Typography variant="body2" sx={{ color: 'text.primary' }}>
                <Box component="span" sx={{ fontStyle: 'italic' }}>
                    {authors}
                </Box>
            </Typography>

            {/* Описание / Альтернативное название */}
            <Typography variant="body2" sx={{ color: 'text.secondary', lineHeight: 1.4, mt: 0.5 }}>
                {alternativeTitle}, {issuedYear}
            </Typography>
            <Box sx={{ mt: 0.5 }}>
                <Link
                    href={uri}
                    target="_blank"
                    rel="noopener noreferrer"
                    underline="hover"
                    sx={{ fontSize: '0.85rem', color: 'info.main' }}
                >
                    {uri}
                </Link>
            </Box>

            {/* Ссылка на скачивание файла (если есть) */}
            {fileLink && (
                <Box sx={{ mt: 0.5 }}>
                    <Link
                        href={fileLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        underline="hover"
                        sx={{ fontSize: '0.85rem', color: 'info.main' }}
                    >
                        Открыть документ (PDF)
                    </Link>
                </Box>
            )}
        </Box>
    );
};

export default SpecialtyDisciplinesWithMaterialsTable;