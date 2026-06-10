import { createDatabaseBackup } from '../utils/backupService.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import socketServerInstance from '../websocket/socketServer.js';
import fs from 'fs';
import axios from 'axios';

let parserLogsCache = [];

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

export const handleParserWebhookLog = async (req, res, next) => {
  try {
    const { level, message, timestamp } = req.body;

    const logEntry = {
      level: level || 'INFO',
      message: message,
      timestamp: timestamp || new Date().toISOString()
    };

    parserLogsCache.push(logEntry);
    if (parserLogsCache.length > 500) {
      parserLogsCache.shift();
    }

    socketServerInstance.emitParserLog(logEntry);

    return res.status(200).json({ status: 'success' });
  } catch (error) {
    next(error);
  }
};

export const getInitialLogs = (req, res) => {
  return res.status(200).json(parserLogsCache);
};