import api from './client';
import type { ClassInput, SchoolClass } from '../types';

export async function getClasses(): Promise<SchoolClass[]> {
  const res = await api.get<SchoolClass[]>('/classes');
  return res.data;
}

export async function createClass(data: ClassInput): Promise<SchoolClass> {
  const res = await api.post<SchoolClass>('/classes', data);
  return res.data;
}

export async function updateClass(id: number, data: ClassInput): Promise<SchoolClass> {
  const res = await api.patch<SchoolClass>(`/classes/${id}`, data);
  return res.data;
}

export async function deleteClass(id: number): Promise<void> {
  await api.delete(`/classes/${id}`);
}