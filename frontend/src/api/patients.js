import client from './client';

export const createPatient = (data) => client.post('/patients', data);

export const getAllPatients = () => client.get('/patients');

export const getPatientById = (id) => client.get(`/patients/${id}`);

export const getPatientReport = () => client.get('/patients/report');
