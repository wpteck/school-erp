import { useState } from 'react';
import type { FormEvent } from 'react';
import { getErrorMessage } from '../api/client';
import type { ClassInput } from '../types';

interface ClassFormProps {
  initialValues?: ClassInput;
  onSubmit: (values: ClassInput) => Promise<void>;
  onCancel: () => void;
}

function ClassForm({ initialValues, onSubmit, onCancel }: ClassFormProps) {
  const [name, setName] = useState(initialValues?.name ?? '');
  const [section, setSection] = useState(initialValues?.section ?? '');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (!name.trim() || !section.trim()) {
      setError('Class aur Section dono zaroori hain');
      return;
    }

    setSubmitting(true);
    setError('');
    try {
      await onSubmit({ name: name.trim(), section: section.trim() });
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Class</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="maslan: 5"
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Section</label>
        <input
          value={section}
          onChange={(e) => setSection(e.target.value)}
          placeholder="maslan: A"
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
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

export default ClassForm;