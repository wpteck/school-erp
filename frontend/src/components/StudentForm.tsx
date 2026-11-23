import { useState } from 'react';
import type { ChangeEvent, FormEvent } from 'react';
import { getErrorMessage } from '../api/client';
import type { Gender, SchoolClass, Student, StudentInput } from '../types';

interface StudentFormProps {
  initialValues?: Student;
  classes: SchoolClass[];
  onSubmit: (values: StudentInput) => Promise<void>;
  onCancel: () => void;
}

interface FormState {
  rollNo: string;
  firstName: string;
  lastName: string;
  gender: Gender | '';
  dateOfBirth: string;
  phone: string;
  address: string;
  classId: string;
}

function toFormState(s?: Student): FormState {
  return {
    rollNo: s?.rollNo ?? '',
    firstName: s?.firstName ?? '',
    lastName: s?.lastName ?? '',
    gender: s?.gender ?? '',
    dateOfBirth: s?.dateOfBirth ? s.dateOfBirth.slice(0, 10) : '',
    phone: s?.phone ?? '',
    address: s?.address ?? '',
    classId: s ? String(s.classId) : '',
  };
}

const inputClass =
  'w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500';
const labelClass = 'block text-sm font-medium text-gray-700 mb-1';

function StudentForm({ initialValues, classes, onSubmit, onCancel }: StudentFormProps) {
  const [form, setForm] = useState<FormState>(toFormState(initialValues));
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  function handleChange(
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>,
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (
      !form.rollNo.trim() ||
      !form.firstName.trim() ||
      !form.lastName.trim() ||
      !form.gender ||
      !form.classId
    ) {
      setError('Roll No, Naam, Gender aur Class zaroori hain');
      return;
    }

    const payload: StudentInput = {
      rollNo: form.rollNo.trim(),
      firstName: form.firstName.trim(),
      lastName: form.lastName.trim(),
      gender: form.gender,
      dateOfBirth: form.dateOfBirth || undefined,
      phone: form.phone.trim() || undefined,
      address: form.address.trim() || undefined,
      classId: Number(form.classId),
    };

    setSubmitting(true);
    setError('');
    try {
      await onSubmit(payload);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className={labelClass}>Roll No *</label>
          <input name="rollNo" value={form.rollNo} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Class *</label>
          <select name="classId" value={form.classId} onChange={handleChange} className={inputClass}>
            <option value="">-- Chunein --</option>
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}-{c.section}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className={labelClass}>First Name *</label>
          <input name="firstName" value={form.firstName} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Last Name *</label>
          <input name="lastName" value={form.lastName} onChange={handleChange} className={inputClass} />
        </div>
        <div>
          <label className={labelClass}>Gender *</label>
          <select name="gender" value={form.gender} onChange={handleChange} className={inputClass}>
            <option value="">-- Chunein --</option>
            <option value="MALE">Male</option>
            <option value="FEMALE">Female</option>
            <option value="OTHER">Other</option>
          </select>
        </div>
        <div>
          <label className={labelClass}>Date of Birth</label>
          <input
            type="date"
            name="dateOfBirth"
            value={form.dateOfBirth}
            onChange={handleChange}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Phone</label>
        <input name="phone" value={form.phone} onChange={handleChange} className={inputClass} />
      </div>

      <div>
        <label className={labelClass}>Address</label>
        <textarea
          name="address"
          value={form.address}
          onChange={handleChange}
          rows={2}
          className={inputClass}
        />
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 p-2 rounded">❌ {error}</p>}

      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 rounded-lg border hover:bg-gray-50">
          Cancel
        </button>
        <button
          type="submit"
          disabled={submitting}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {submitting ? 'Saving...' : 'Save'}
        </button>
      </div>
    </form>
  );
}

export default StudentForm;