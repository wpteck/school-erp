import { NavLink } from 'react-router';

const menuItems = [
  { to: '/', label: 'Dashboard', icon: '📊' },
  { to: '/classes', label: 'Classes', icon: '🏛️' },
  { to: '/students', label: 'Students', icon: '🎓' },
];

function Sidebar() {
  return (
    <aside className="w-64 bg-slate-800 text-white min-h-screen p-4">
      <h2 className="text-xl font-bold mb-8 px-3">🏫 School ERP</h2>

      <nav className="flex flex-col gap-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.to === '/'}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                isActive ? 'bg-blue-600 text-white' : 'text-slate-300 hover:bg-slate-700'
              }`
            }
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export default Sidebar;