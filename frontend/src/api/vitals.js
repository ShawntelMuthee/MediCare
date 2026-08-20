import client from './client';

export const createVitals = (patientId, data) =>
  client.post(`/patients/${patientId}/vitals`, data);

export const getVitalsByPatientId = (patientId) =>
  client.get(`/patients/${patientId}/vitals`);
