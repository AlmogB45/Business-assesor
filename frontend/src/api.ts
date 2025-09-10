import axios from 'axios';
import { BusinessInput, MatchResponse, ReportResponse } from './types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const matchRequirements = async (input: BusinessInput): Promise<MatchResponse> => {
  const response = await api.post<MatchResponse>('/api/match', input);
  return response.data;
};

export const generateReport = async (input: BusinessInput): Promise<ReportResponse> => {
  const response = await api.post<ReportResponse>('/api/report', input);
  return response.data;
};


