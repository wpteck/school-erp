import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import Modal from '../components/Modal';
import StudentForm from '../components/StudentForm';
import { getClasses } from '../api/classes';
import { createStudent, deleteStudent, getStudents, updateStudent } from '../api/students';
import { getErrorMessage } from '../api/client';
import type { SchoolClass, Student, StudentInput } from '../types';
import toast from 'react-hot-toast';
import Spinner from '../components/Spinner';

function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [classFilter, setClassFilter] = useState('');
  const [search, setSearch] = useState('');
  const [reloadKey, setReloadKey] = useState(0);

  const [formOpen, setFormOpen] = useState(false);
  const [editing, setEditing] = useState<Student | null>(null);


  // 1) Classes sirf ek baar (dropdown ke liye)
  useEffect(() => {
    getClasses()
      .then((data) => setClasses(data))
      .catch(() => toast.error('Classes load nahi ho sakin'));
  }, []);

  // 2) Students: jab filter, search ya reloadKey badle
  useEffect(() => {
    const timer = setTimeout(
      () => {
        setLoading(true);
        setError('');
        getStudents({
          classId: classFilter ? Number(classFilter) : undefined,
          search: search.trim() || undefined,
        })
          .then((data) => setStudents(data))
          .catch(() => setError('Students load nahi ho sake. Kya backend chal raha hai?'))
          .finally(() => setLoading(false));
      },
      search ? 400 : 0,
    );

    return () => clearTimeout(timer);
  }, [classFilter, search, reloadKey]);

  function openAdd() {
    setEditing(null);
    setFormOpen(true);
  }

  function openEdit(student: Student) {
    setEditing(student);
    setFormOpen(true);
  }

  function closeForm() {
    setFormOpen(false);
    setEditing(null);
  }

  async function handleSave(values: StudentInput) {
    if (editing) {
      await updateStudent(editing.id, values);
      toast.success('Student update ho gaya');
    } else {
      await createStudent(values);
      toast.success('Naya student add ho gaya');
    }
    closeForm();
    setReloadKey((k) => k + 1);
  }

  async function handleDelete(student: Student) {
    const ok = window.confirm(`${student.firstName} ${student.lastName} ko delete karna hai?`);
    if (!ok) return;

    try {
      await deleteStudent(student.id);
      setStudents((prev) => prev.filter((s) => s.id !== student.id));
      toast.success('Student delete ho gaya');
    } catch (err) {
      toast.error(getErrorMessage(err));
    }
  }

  function clearFilters() {
    setClassFilter('');
    setSearch('');
  }

  const hasFilters = classFilter !== '' || search !== '';

  return (
    <div>
      <PageHeader
        title="Students"
        subtitle="Saare students ki list"
        action={
          <button onClick={openAdd} className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700">
            + Naya Student
          </button>
        }
      />

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-4 mb-4 flex flex-wrap gap-3 items-center">
        <select
          value={classFilter}
          onChange={(e) => setClassFilter(e.target.value)}
          className="border rounded-lg px-3 py-2"
        >
          <option value="">Sab classes</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}-{c.section}
            </option>
          ))}
        </select>

        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="🔍 Naam ya roll no..."
          className="border rounded-lg px-3 py-2 flex-1 min-w-[200px]"
        />

        {hasFilters && (
          <button onClick={clearFilters} className="px-3 py-2 text-gray-600 hover:underline">
            Clear
          </button>
        )}
      </div>

    

      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                {loading && <Spinner />}

        {error && <p className="p-6 text-red-600">❌ {error}</p>}

        {!loading && !error && students.length === 0 && (
          <p className="p-6 text-gray-500">
            {hasFilters ? 'Is filter se koi student nahi mila.' : 'Abhi koi student nahi hai.'}
          </p>
        )}

        {!loading && !error && students.length > 0 && (
          <table className="w-full text-left">
            <thead className="bg-gray-50 text-gray-600 text-sm">
              <tr>
                <th className="px-6 py-3">Roll No</th>
                <th className="px-6 py-3">Naam</th>
                <th className="px-6 py-3">Class</th>
                <th className="px-6 py-3">Gender</th>
                <th className="px-6 py-3">Phone</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {students.map((s) => (
                <tr key={s.id} className="border-t hover:bg-gray-50">
                  <td className="px-6 py-3 font-mono">{s.rollNo}</td>
                  <td className="px-6 py-3 font-medium">
                    {s.firstName} {s.lastName}
                  </td>
                  <td className="px-6 py-3">
                    {s.schoolClass ? `${s.schoolClass.name}-${s.schoolClass.section}` : '-'}
                  </td>
                  <td className="px-6 py-3">{s.gender}</td>
                  <td className="px-6 py-3 text-gray-500">{s.phone ?? '-'}</td>
                  <td className="px-6 py-3 text-right space-x-3">
                    <button onClick={() => openEdit(s)} className="text-blue-600 hover:underline">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(s)} className="text-red-600 hover:underline">
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
        <Modal title={editing ? 'Student Edit Karein' : 'Naya Student'} onClose={closeForm}>
          <StudentForm
            initialValues={editing ?? undefined}
            classes={classes}
            onSubmit={handleSave}
            onCancel={closeForm}
          />
        </Modal>
      )}
    </div>
  );
}

export default StudentsPage;