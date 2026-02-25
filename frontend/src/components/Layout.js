import React, { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  LayoutDashboard, 
  Settings, 
  PlusCircle, 
  Target, 
  BookOpen, 
  Users,
  Menu,
  X,
  LogOut,
  User
} from 'lucide-react';

const Layout = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navigation = [
    { name: 'Início', href: '/', icon: LayoutDashboard },
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Configurações', href: '/configuracoes', icon: Settings },
    { name: 'Lançamentos', href: '/lancamentos', icon: PlusCircle },
    { name: 'Metas', href: '/metas', icon: Target },
    { name: 'Ebook', href: '/ebook', icon: BookOpen },
    { name: 'Exemplos', href: '/exemplos', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-amber-50">
      {/* Mobile sidebar backdrop */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 h-full w-64 bg-white shadow-xl z-50 transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl font-bold text-gray-800 font-serif">O Hábito da Economia</h1>
                <p className="text-xs text-amber-600 font-semibold">e Gestão Financeira</p>
              </div>
              <button 
                className="lg:hidden"
                onClick={() => setSidebarOpen(false)}
              >
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.href;
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={`
                    flex items-center gap-3 px-4 py-3 rounded-lg transition-all
                    ${isActive 
                      ? 'bg-gradient-to-r from-amber-500 to-yellow-500 text-white shadow-md' 
                      : 'text-gray-700 hover:bg-amber-50 hover:text-amber-700'
                    }
                  `}
                >
                  <Icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Footer */}
          <div className="p-4 border-t border-gray-200">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-4 rounded-lg">
              <p className="text-xs text-gray-600 italic">
                "Os planos bem elaborados levam à fartura"<br />
                <span className="font-semibold">- Provérbios 21:5</span>
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="lg:ml-64">
        {/* Mobile header */}
        <header className="lg:hidden bg-white shadow-sm p-4 sticky top-0 z-30">
          <div className="flex items-center justify-between">
            <button onClick={() => setSidebarOpen(true)}>
              <Menu className="w-6 h-6" />
            </button>
            <h2 className="text-lg font-bold text-gray-800">Hábito da Economia</h2>
            <div className="w-6" />
          </div>
        </header>

        {/* Page content */}
        <main className="p-4 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default Layout;