import PageHeader from '../components/PageHeader';
import StatCard from '../components/StatCard';

function DashboardPage() {
  return (
    <div>
      <PageHeader title="Dashboard" subtitle="School ka khulasa (summary)" />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard title="Total Classes" value={0} icon="🏛️" color="bg-blue-100" />
        <StatCard title="Total Students" value={0} icon="🎓" color="bg-green-100" />
        <StatCard title="Total Teachers" value={0} icon="👩‍🏫" color="bg-purple-100" />
      </div>
    </div>
  );
}

export default DashboardPage;