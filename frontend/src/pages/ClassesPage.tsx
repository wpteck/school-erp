import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import ClassForm from '../components/ClassForm';
import Spinner from '../components/Spinner';
import { createClass, deleteClass, getClasses, updateClass } from '../api/classes';
import { getErrorMessage } from '../api/client';
import type { ClassInput, SchoolClass } from '../types';

function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<SchoolClass | null>(null);

  useEffect(() => {
    getClasses()
      .then((data) => setClasses(data))
      .catch(() => setError('Classes load nahi ho sakin. Kya backend chal raha hai?'))
      .finally(() => setLoading(false));
  }, []);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(cls: SchoolClass) {
    setEditing(cls);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  async function handleSave(values: ClassInput) {
    if (editing) {
      const updated = await updateClass(editing.id, values);
      setClasses((prev) => prev.map((c) => (c.id === updated.id ? { ...c, ...updated } : c)));
      toast.success('Class update ho gayi');
    } else {
      const created = await createClass(values);
      setClasses((prev) => [...prev, created]);
      toast.success('Nayi class ban gayi');
    }
    closeForm();
  }

  async function handleDelete(cls: SchoolClass) {
    const ok = window.confirm(`Class ${cls.name}-${cls.section} delete karni hai?`);
    if (!ok) return;

    try {
      await deleteClass(cls.id);
      setClasses((prev) => prev.filter((c) => c.id !== cls.id));
      toast.success('Class delete ho gayi');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  return (
    <div>
      <PageHeader
        title="Classes"
        subtitle="Saari classes ki list"
        action={
          <button
            onClick={openAdd}
            className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
          >
            + Nayi Class
          </button>
        }
      />

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {loading && <Spinner />}

        {error && <p className="p-6 text-red-600">❌ {error}</p>}

        {!loading && !error && classes.length === 0 && (
          <p className="p-6 text-gray-500">Abhi koi class nahi hai.</p>
        )}

        {!loading && !error && classes.length > 0 && (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Class</th>
                <th className="px-6 py-3">Section</th>
                <th className="px-6 py-3">Students</th>
                <th className="px-6 py-3">Created</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((cls, index) => (
                <tr key={cls.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3 text-gray-500">{index + 1}</td>
                  <td className="px-6 py-3 font-medium">{cls.name}</td>
                  <td className="px-6 py-3">{cls.section}</td>
                  <td className="px-6 py-3">{cls._count?.students ?? 0}</td>
                  <td className="px-6 py-3 text-gray-500">
                    {new Date(cls.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(cls)} className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(cls)} className="text-red-600 hover:underline">
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {formOpen && (
        <Modal title={editing ? 'Class Edit Karein' : 'Nayi Class'} onClose={closeForm}>
          <ClassForm
            initialValues={editing ?? undefined}
            onSubmit={handleSave}
            onCancel={closeForm}
          />
        </Modal>
      )}
    </div>
  );
}

export default ClassesPage;