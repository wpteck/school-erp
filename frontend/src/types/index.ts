export interface SchoolClass {
  id: number;
  name: string;
  section: string;
  createdAt: string;
  updatedAt: string;
  _count?: { students: number };
}

export interface ClassInput {
  name: string;
  section: string;
}

export type Gender = 'MALE' | 'FEMALE' | 'OTHER';

export interface Student {
  id: number;
  rollNo: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth: string | null;
  phone: string | null;
  address: string | null;
  classId: number;
  schoolClass?: { name: string; section: string };
  createdAt: string;
  updatedAt: string;
}

export interface StudentInput {
  rollNo: string;
  firstName: string;
  lastName: string;
  gender: Gender;
  dateOfBirth?: string;
  phone?: string;
  address?: string;
  classId: number;
}

export interface StudentFilters {
  classId?: number;
  search?: string;
}