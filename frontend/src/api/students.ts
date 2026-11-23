import api from './client';
import type { Student, StudentFilters, StudentInput } from '../types';

export async function getStudents(filters: StudentFilters = {}): Promise<Student[]> {
  const res = await api.get<Student[]>('/students', { params: filters });
  return res.data;
}

export async function createStudent(data: StudentInput): Promise<Student> {
  const res = await api.post<Student>('/students', data);
  return res.data;
}

export async function updateStudent(id: number, data: StudentInput): Promise<Student> {
  const res = await api.patch<Student>(`/students/${id}`, data);
  return res.data;
}

export async function deleteStudent(id: number): Promise<void> {
  await api.delete(`/students/${id}`);
}