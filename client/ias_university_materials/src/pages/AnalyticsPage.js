import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Paper, FormControl, InputLabel, Select, MenuItem, Button, Stack, CircularProgress } from '@mui/material';
import ImageIcon from '@mui/icons-material/Image';
import reportService from '../services/reportService';
import LineChart from '../components/Charts/LineChart';
import PieChart from '../components/Charts/PieChart';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';

const AnalyticsPage = () => {
    const [vizType, setVizType] = useState('dynamics');
    const [startYear, setStartYear] = useState(2020);
    const [endYear, setEndYear] = useState(2025);
    const [rawData, setRawData] = useState([]);
    const [loading, setLoading] = useState(false);

    const availableYears = useMemo(() =>
        Array.from({ length: 7 }, (_, i) => 2020 + i), []
    );

    const fetchAnalyticsData = async () => {
        setLoading(true);
        try {
            const data = await reportService.getMaterialsByFaculty(startYear, endYear);
            setRawData(data.filter(item => item.faculty_name !== "Итого"));
        } catch (error) {
            console.error("Ошибка загрузки аналитики:", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, [startYear, endYear]);

    const labels = useMemo(() => {
        const range = [];
        for (let y = startYear; y <= endYear; y++) range.push(y.toString());
        return range;
    }, [startYear, endYear]);

    const lineChartData = {
        labels: labels,
        datasets: rawData.map((faculty, index) => ({
            label: faculty.faculty_name,
            data: labels.map(year => faculty[year] || 0),
            borderColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
            backgroundColor: `hsl(${(index * 60) % 360}, 70%, 50%)`,
            tension: 0.3,
        }))
    };

    const pieChartData = {
        labels: rawData.map(f => f.faculty_name),
        datasets: [{
            data: rawData.map(f => f.total),
            backgroundColor: rawData.map((_, i) => `hsl(${(i * 60) % 360}, 60%, 60%)`),
        }]
    };

    const handleExportImage = () => {
        const canvas = document.querySelector('canvas');
        if (canvas) {
            const link = document.createElement('a');
            link.download = `chart_${vizType}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        }
    };

    return (
        <>
            <Header />
            <Box sx={{ p: 4, maxWidth: '1200px', margin: '0 auto' }}>
                <Typography variant="h4" sx={{ mb: 3, fontWeight: 'bold', color: '#0056b3' }}>
                    Аналитика
                </Typography>

                <Paper variant="outlined" sx={{ p: 3, mb: 3 }}>
                    <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
                        <FormControl sx={{ minWidth: 250 }}>
                            <InputLabel>Визуализация</InputLabel>
                            <Select value={vizType} label="Визуализация" onChange={(e) => setVizType(e.target.value)}>
                                <MenuItem value="dynamics">Динамика по годам</MenuItem>
                                <MenuItem value="faculties">Распределение по факультетам</MenuItem>
                            </Select>
                        </FormControl>

                        <Stack direction="row" spacing={1}>
                            <FormControl sx={{ minWidth: 100 }}>
                                <InputLabel>С</InputLabel>
                                <Select value={startYear} label="С" onChange={(e) => setStartYear(e.target.value)}>
                                    {availableYears.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                                </Select>
                            </FormControl>
                            <FormControl sx={{ minWidth: 100 }}>
                                <InputLabel>По</InputLabel>
                                <Select value={endYear} label="По" onChange={(e) => setEndYear(e.target.value)}>
                                    {availableYears.map(y => <MenuItem key={y} value={y}>{y}</MenuItem>)}
                                </Select>
                            </FormControl>
                        </Stack>

                        <Box sx={{ flexGrow: 1 }} />
                        <Button variant="contained" startIcon={<ImageIcon />} onClick={handleExportImage}>PNG</Button>
                    </Stack>
                </Paper>

                <Paper variant="outlined" sx={{ p: 4, minHeight: '500px', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                    {loading ? (
                        <CircularProgress />
                    ) : (
                        vizType === 'dynamics' ? (
                            <LineChart chartData={lineChartData} />
                        ) : (
                            <PieChart chartData={pieChartData} />
                        )
                    )}
                </Paper>
            </Box>
            <Footer />
        </>
    );
};

export default AnalyticsPage;