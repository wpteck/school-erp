import { Routes, Route } from 'react-router';
import MainLayout from './layouts/MainLayout';
import DashboardPage from './pages/DashboardPage';
import ClassesPage from './pages/ClassesPage';
import StudentsPage from './pages/StudentsPage';
import NotFoundPage from './pages/NotFoundPage';

function App() {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="classes" element={<ClassesPage />} />
        <Route path="students" element={<StudentsPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;