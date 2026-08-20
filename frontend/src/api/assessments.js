import client from './client';

export const createOverweightAssessment = (patientId, data) =>
  client.post(`/patients/${patientId}/overweight-assessments`, data);

export const createGeneralAssessment = (patientId, data) =>
  client.post(`/patients/${patientId}/general-assessments`, data);
