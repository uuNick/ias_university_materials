import { keywordRepository } from '../repositories/keywordRepository.js';
import * as KeywordCases from '../use-cases/keywordUseCases.js';

export const getAllKeywords = async (req, res) => {
  try {
    const keywords = await KeywordCases.getAllKeywordsUseCase(keywordRepository);
    res.json(keywords);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getKeywordById = async (req, res) => {
  try {
    const keyword = await KeywordCases.getKeywordByIdUseCase(req.params.id, keywordRepository);
    res.json(keyword);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
};

export const createKeyword = async (req, res) => {
  try {
    const newKeyword = await KeywordCases.createKeywordUseCase(req.body, keywordRepository);
    res.status(201).json(newKeyword);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateKeyword = async (req, res) => {
  try {
    const updated = await KeywordCases.updateKeywordUseCase(req.params.id, req.body, keywordRepository);
    res.json(updated);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteKeyword = async (req, res) => {
  try {
    await KeywordCases.deleteKeywordUseCase(req.params.id, keywordRepository);
    res.status(204).send();
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};