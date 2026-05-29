import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
    TableHead,
    Paper,
    Link,
    IconButton,
    Tooltip,
    Typography,
    Box
} from '@mui/material';
import {
    Launch as LaunchIcon,
    GetApp as DownloadIcon,
    MenuBook as BookIcon,
    WarningAmber as WarningIcon
} from '@mui/icons-material';

const DepartmentDisciplinesTable = ({ data }) => {
    const report = data?.data || data;
    const rows = report?.rows || [];

    if (!report || rows.length === 0) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <WarningIcon color="warning" sx={{ fontSize: '3rem', mb: 1 }} />
                <Typography color="textSecondary" variant="h6">
                    Дисциплины, закрепленные за кафедрой, не найдены или отсутствуют в выбранном периоде
                </Typography>
            </Box>
        );
    }

    return (
        <TableContainer component={Paper} variant="outlined">
            <Table sx={{ minWidth: 700 }} aria-label="department disciplines report table">
                <TableHead sx={{ backgroundColor: '#f0f4f8' }}>
                    <TableRow>
                        <TableCell sx={{ fontWeight: 'bold', width: '25%' }}>Дисциплина</TableCell>
                        <TableCell sx={{ fontWeight: 'bold', width: '45%' }}>Библиография</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', width: '120px' }}>Год начала подготовки</TableCell>
                        <TableCell align="center" sx={{ fontWeight: 'bold', width: '140px' }}>Ссылки</TableCell>
                    </TableRow>
                </TableHead>
                <TableBody>
                    {rows.map((rowGroup, index) => {
                        const hasMaterials = rowGroup.materials && rowGroup.materials.length > 0;
                        const totalRowsForDiscipline = hasMaterials ? rowGroup.materials.length : 1;

                        return (
                            <React.Fragment key={`discipline-${rowGroup.disciplineId}-${index}`}>
                                <TableRow hover>
                                    <TableCell
                                        rowSpan={totalRowsForDiscipline}
                                        sx={{
                                            fontWeight: 'bold',
                                            verticalAlign: 'top',
                                            backgroundColor: '#fafafa',
                                            borderRight: '1px solid rgba(224, 224, 224, 1)'
                                        }}
                                    >
                                        {rowGroup.disciplineName}
                                    </TableCell>

                                    {hasMaterials ? (
                                        <>
                                            <TableCell sx={{ verticalAlign: 'top' }}>
                                                <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                                    <BookIcon color="action" sx={{ mt: 0.3, fontSize: '1.1rem' }} />
                                                    <Box>
                                                        <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
                                                            {rowGroup.materials[0].title}
                                                        </Typography>
                                                        <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontWeight: 500 }}>
                                                            {rowGroup.materials[0].citation}
                                                        </Typography>
                                                    </Box>
                                                </Box>
                                            </TableCell>
                                            <TableCell align="center" sx={{ verticalAlign: 'top' }}>
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {rowGroup.yearStartBound}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center" sx={{ verticalAlign: 'top' }}>
                                                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                                    {rowGroup.materials[0].uri && (
                                                        <Tooltip title="Открыть в электронной библиотеке">
                                                            <IconButton
                                                                component={Link}
                                                                href={rowGroup.materials[0].uri}
                                                                target="_blank"
                                                                rel="noopener"
                                                                size="small"
                                                                color="primary"
                                                            >
                                                                <LaunchIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                    {rowGroup.materials[0].fileLink && (
                                                        <Tooltip title="Скачать PDF">
                                                            <IconButton
                                                                component={Link}
                                                                href={rowGroup.materials[0].fileLink}
                                                                target="_blank"
                                                                rel="noopener"
                                                                size="small"
                                                                color="error"
                                                            >
                                                                <DownloadIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    )}
                                                </Box>
                                            </TableCell>
                                        </>
                                    ) : (
                                        <>
                                            <TableCell sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
                                                Методические материалы по данной дисциплине не найдены
                                            </TableCell>
                                            <TableCell align="center">
                                                <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                    {rowGroup.yearStartBound}
                                                </Typography>
                                            </TableCell>
                                            <TableCell align="center">—</TableCell>
                                        </>
                                    )}
                                </TableRow>

                                {hasMaterials && rowGroup.materials.slice(1).map((material, mIndex) => (
                                    <TableRow key={`material-${material.id}-${mIndex}`} hover>
                                        <TableCell sx={{ verticalAlign: 'top' }}>
                                            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 1.5 }}>
                                                <BookIcon color="action" sx={{ mt: 0.3, fontSize: '1.1rem' }} />
                                                <Box>
                                                    <Typography variant="body2" sx={{ fontWeight: 600, lineHeight: 1.4 }}>
                                                        {material.title}
                                                    </Typography>
                                                    <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontWeight: 500 }}>
                                                        {material.citation}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </TableCell>
                                        <TableCell align="center" sx={{ verticalAlign: 'top' }}>
                                            <Typography variant="body2" sx={{ fontWeight: 'bold' }}>
                                                {rowGroup.yearStartBound}
                                            </Typography>
                                        </TableCell>
                                        <TableCell align="center" sx={{ verticalAlign: 'top' }}>
                                            <Box sx={{ display: 'flex', justifyContent: 'center', gap: 0.5 }}>
                                                {material.uri && (
                                                    <Tooltip title="Открыть в электронной библиотеке">
                                                        <IconButton
                                                            component={Link}
                                                            href={material.uri}
                                                            target="_blank"
                                                            rel="noopener"
                                                            size="small"
                                                            color="primary"
                                                        >
                                                            <LaunchIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                                {material.fileLink && (
                                                    <Tooltip title="Скачать PDF">
                                                        <IconButton
                                                            component={Link}
                                                            href={material.fileLink}
                                                            target="_blank"
                                                            rel="noopener"
                                                            size="small"
                                                            color="error"
                                                        >
                                                            <DownloadIcon fontSize="small" />
                                                        </IconButton>
                                                    </Tooltip>
                                                )}
                                            </Box>
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

export default DepartmentDisciplinesTable;