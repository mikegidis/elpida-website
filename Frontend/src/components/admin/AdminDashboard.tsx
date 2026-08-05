import React, { useState } from 'react';
import {
  Boxes,
  Gauge,
  LayoutGrid,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
} from 'lucide-react';
import { AdminUser } from '../../api/adminAuth';
import { AdminCategoriesPage } from './AdminCategoriesPage';

type AdminDashboardProps = {
  admin: AdminUser;
  onLogout: () => void;
};

const menuItems = [
  { label: 'Dashboard', icon: Gauge },
  { label: 'Categories', icon: LayoutGrid },
  { label: 'Products', icon: Package },
  { label: 'Orders', icon: ShoppingBag },
  { label: 'Settings', icon: Settings },
];

type AdminPage = typeof menuItems[number]['label'];

export function AdminDashboard({ admin, onLogout }: AdminDashboardProps) {
  const [activePage, setActivePage] = useState<AdminPage>('Dashboard');

  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#2D1424]">
      <aside className="fixed inset-y-0 left-0 hidden w-64 border-r border-[#E4DAD2] bg-white lg:block">
        <div className="flex h-16 items-center gap-3 border-b border-[#E4DAD2] px-5">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#2D1424] text-white">
            <Boxes size={19} />
          </div>
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide">Elpida</p>
            <p className="text-xs text-[#7C6B73]">Admin Dashboard</p>
          </div>
        </div>

        <nav className="flex h-[calc(100vh-4rem)] flex-col justify-between p-4">
          <div className="space-y-1">
            {menuItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = activePage === item.label;

              return (
                <button
                  key={item.label}
                  type="button"
                  onClick={() => setActivePage(item.label)}
                  className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium transition ${
                    isActive
                      ? 'bg-[#2D1424] text-white'
                      : 'text-[#5F4E58] hover:bg-[#F1EAE4] hover:text-[#2D1424]'
                  }`}
                >
                  <Icon size={18} />
                  {item.label}
                </button>
              );
            })}
          </div>

          <button
            type="button"
            onClick={onLogout}
            className="flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm font-medium text-[#8D2F3F] transition hover:bg-[#F7E7E9]"
          >
            <LogOut size={18} />
            Logout
          </button>
        </nav>
      </aside>

      <div className="lg:pl-64">
        <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-[#E4DAD2] bg-white px-4 sm:px-6">
          <div>
            <h1 className="text-lg font-semibold">{activePage}</h1>
            <p className="text-xs text-[#7C6B73]">Admin dashboard</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-medium">{admin.username}</p>
              <p className="text-xs capitalize text-[#7C6B73]">{admin.role}</p>
            </div>
            <button
              type="button"
              onClick={onLogout}
              className="rounded-md border border-[#D8CCC4] px-3 py-2 text-sm font-medium transition hover:bg-[#F1EAE4] lg:hidden"
            >
              Logout
            </button>
          </div>
        </header>

        <main className="p-4 sm:p-6">
          {activePage === 'Categories' ? (
            <AdminCategoriesPage />
          ) : (
            <>
              <div className="mb-4 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {['Categories', 'Products', 'Orders', 'Settings'].map((label) => (
                  <section key={label} className="rounded-lg border border-[#E4DAD2] bg-white p-4">
                    <p className="text-sm font-medium text-[#7C6B73]">{label}</p>
                    <p className="mt-2 text-2xl font-semibold">--</p>
                  </section>
                ))}
              </div>

              <section className="rounded-lg border border-[#E4DAD2] bg-white p-5">
                <h2 className="text-base font-semibold">Main Content Area</h2>
                <p className="mt-2 text-sm text-[#6E5E67]">
                  CRUD screens will be added here later. This dashboard currently provides the protected admin shell only.
                </p>
              </section>
            </>
          )}
        </main>
      </div>
    </div>
  );
}
