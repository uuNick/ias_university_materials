import { createDatabaseBackup } from '../utils/backupService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import fs from 'fs';
import axios from 'axios';

export const downloadBackup = asyncHandler(async (req, res) => {
    
    const { filePath, fileName } = await createDatabaseBackup();
    res.download(filePath, fileName, (err) => {
        if (err) {
            console.error('Ошибка при отправке файла бэкапа:', err);
            if (!res.headersSent) {
                res.status(500).json({ message: 'Ошибка при отправке файла' });
            }
        }
        fs.unlink(filePath, (unlinkErr) => {
            if (unlinkErr) console.error('Не удалось удалить временный бэкап:', unlinkErr);
        });
    });
});

export const runParser = asyncHandler(async (req, res) => {
    const PARSER_SERVER_URL = process.env.PARSER_SERVER_URL;

    try {
        const parserResponse = await axios.post(`${PARSER_SERVER_URL}/api/parser/start`);
        res.status(200).json(parserResponse.data);
    } catch (error) {
        console.error('Ошибка на стороне сервера парсера: ', error.message);
        res.status(502).json({
            message: 'Парсер-сервер вернул ошибку или недоступен'
        });
    }
});