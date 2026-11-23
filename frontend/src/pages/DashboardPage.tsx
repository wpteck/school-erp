import { useEffect, useState } from 'react';
import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';
import { getClasses } from '../api/classes';
import { getStudents } from '../api/students';

function DashboardPage() {
  const [stats, setStats] = useState({ classes: 0, students: 0 });
  const [error, setError] = useState('');

  useEffect(() => {
    Promise.all([getClasses(), getStudents()])
      .then(([classes, students]) =>
        setStats({ classes: classes.length, students: students.length }),
      )
      .catch(() => setError('Dashboard ka data load nahi ho saka'));
  }, []);

  return (
    <div>
      <PageHeader title="Dashboard" subtitle="School ka khulasa (summary)" />

      {error && <p className="mb-4 text-red-600">❌ {error}</p>}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Classes" value={stats.classes} icon="🏛️" color="bg-blue-100" />
        <StatCard title="Total Students" value={stats.students} icon="🎓" color="bg-green-100" />
        <StatCard title="Total Teachers" value={0} icon="👩‍🏫" color="bg-purple-100" />
      </div>
    </div>
  );
}

export default DashboardPage;