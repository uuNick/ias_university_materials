import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container, Typography, Paper, Box,
    Button, Divider, CircularProgress
} from '@mui/material';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import Header from '../components/Header/Header';
import Footer from '../components/Footer/Footer';
import MaterialCard from '../components/MaterialCard/MaterialCard';
import materialService from '../services/materialService';

const InfoItem = ({ label, value }) => (
    <Box sx={{
        p: 2,
        bgcolor: '#f8f9fa',
        borderRadius: 2,
        borderLeft: '4px solid #0056b3',
        height: '100%'
    }}>
        <Typography variant="caption" sx={{ fontWeight: 'bold', color: 'text.secondary', display: 'block', mb: 0.5 }}>
            {label}
        </Typography>
        <Typography variant="body2" sx={{ color: 'text.primary', lineHeight: 1.6 }}>
            {value || '—'}
        </Typography>
    </Box>
);

const MaterialDetailPage = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [material, setMaterial] = useState(null);
    const [similarMaterials, setSimilarMaterials] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDetail = async () => {
            setLoading(true);
            let currentMaterial = null;

            // 1. Сначала загружаем основной материал и проверяем права доступа
            try {
                currentMaterial = await materialService.getFullMaterialInfo(id);
                setMaterial(currentMaterial);
            } catch (error) {
                console.error("Ошибка при получении материала:", error);
                if (error.response) {
                    if (error.response.status === 403) {
                        navigate('/403', { replace: true });
                        return;
                    }
                    if (error.response.status === 404) {
                        navigate('/404', { replace: true });
                        return;
                    }
                }

                // Если произошла сетевая или неопознанная ошибка
                setLoading(false);
                return;
            }

            // 2. Если материал успешно загружен и доступ разрешен, ищем похожие
            if (currentMaterial) {
                try {
                    const similarInfo = await materialService.searchMaterials(currentMaterial.title);

                    if (Array.isArray(similarInfo) && similarInfo.length > 0) {
                        const idsOrder = similarInfo
                            .map(item => item.material_id)
                            .filter(mId => mId !== Number(id));

                        const paginationData = await materialService.getMaterialsWithPag({
                            materialIds: idsOrder.join(','),
                            limit: 10
                        });

                        const similarityMap = new Map(
                            similarInfo.map(item => [item.material_id, item.similarity])
                        );

                        const sortedSimilarityMaterials = paginationData.items
                            .map(item => ({
                                ...item,
                                similarity: similarityMap.get(item.id) || 0
                            }))
                            .sort((a, b) => b.similarity - a.similarity);

                        setSimilarMaterials(sortedSimilarityMaterials);
                    }
                } catch (error) {
                    console.error("Ошибка загрузки похожих:", error);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchDetail();
        window.scrollTo(0, 0);
    }, [id, navigate]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!material) return <Typography align="center">Материал не найден</Typography>;

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh', bgcolor: '#f4f6f8' }}>
            <Header />
            <Container maxWidth="lg" sx={{ py: 4, flex: 1 }}>
                <Paper elevation={0} sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, border: '1px solid #e0e0e0' }}>
                    <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold', color: '#0056b3' }}>
                        {material.title}
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Box sx={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: 2,
                        mt: 3
                    }}>
                        {[
                            { label: "Альтернативное название", value: material.alternativeTitle || "—" },
                            { label: "Авторы", value: material.authors?.map(a => a.name).join(', ') },
                            { label: "Год издания", value: material.year },
                            { label: "Дата размещения в ЭБ", value: new Date(material.availableDate).toLocaleDateString() },
                            { label: "Библиография", value: material.citation },
                            { label: "Количество страниц", value: material.pages },
                            { label: "Язык", value: material.language },
                            { label: "Издатель", value: material.publisher },
                            { label: "Ключевые слова", value: material.keywords?.map(k => k.word).join(', ') },
                            { label: "Специальности", value: material.specialities?.map(s => `${s.spec_code} ${s.spec_name}`).join(', ') },
                            { label: "УДК", value: material.materialUdcCodes?.map(u => u.code).join(', ') },
                            { label: "Тип", value: material.types?.map(t => t.type_name).join(', ') }
                        ].map((item, index) => (
                            <Box
                                key={index}
                                sx={{
                                    flex: {
                                        xs: '1 1 100%',
                                        sm: '1 1 calc(50% - 16px)',
                                        md: '1 1 calc(33.333% - 16px)'
                                    },
                                    minHeight: '100px'
                                }}
                            >
                                <InfoItem label={item.label} value={item.value} />
                            </Box>
                        ))}
                    </Box>
                    <Box sx={{ mt: 4, display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                        <Button
                            variant="contained"
                            startIcon={<OpenInNewIcon />}
                            href={material.uri}
                            target="_blank"
                            sx={{ bgcolor: '#0056b3', textTransform: 'none', px: 3, py: 1.2, borderRadius: 2 }}
                        >
                            В электронную библиотеку
                        </Button>
                        <Button
                            variant="outlined"
                            startIcon={<PictureAsPdfIcon />}
                            href={material.fileLink}
                            target="_blank"
                            sx={{ textTransform: 'none', px: 3, py: 1.2, borderRadius: 2 }}
                        >
                            Открыть PDF
                        </Button>
                    </Box>
                </Paper>

                {/* Похожие материалы */}
                {similarMaterials.length > 0 && (
                    <Box sx={{ mt: 6 }}>
                        <Typography variant="h5" sx={{ mb: 3, fontWeight: 'bold', color: '#0056b3' }}>
                            Похожие материалы
                        </Typography>
                        <Box sx={{
                            display: 'flex',
                            flexWrap: 'wrap',
                            gap: 3,
                            justifyContent: { xs: 'center', md: 'space-between' }
                        }}>
                            {similarMaterials.map(item => (
                                <Box
                                    key={item.id}
                                    sx={{
                                        flex: {
                                            xs: '1 1 100%',
                                            sm: '1 1 calc(50% - 24px)',
                                            lg: '1 1 calc(33.333% - 24px)',
                                            xl: '1 1 calc(33.333% - 24px)'
                                        },
                                        minWidth: { lg: '350px' },
                                        maxWidth: { lg: '400px' }
                                    }}
                                >
                                    <MaterialCard material={item} />
                                </Box>
                            ))}
                        </Box>
                    </Box>
                )}
            </Container>
            <Footer />
        </Box>
    );
};

export default MaterialDetailPage;