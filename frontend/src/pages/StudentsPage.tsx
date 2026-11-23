import PageHeader from '../components/PageHeader';

function StudentsPage() {
  return (
    <div>
      <PageHeader title="Students" subtitle="Saare students ki list" />
      <div className="bg-white rounded-xl shadow-sm p-6 text-gray-500">
        Students ki table yahan aayegi (F5 mein)
      </div>
    </div>
  );
}

export default StudentsPage;