import PageHeader from '../components/PageHeader';

function ClassesPage() {
  return (
    <div>
      <PageHeader title="Classes" subtitle="Saari classes ki list" />
      <div className="bg-white rounded-xl shadow-sm p-6 text-gray-500">
        Classes ki table yahan aayegi (F3 mein)
      </div>
    </div>
  );
}

export default ClassesPage;