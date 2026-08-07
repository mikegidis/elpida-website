import React, { useEffect, useState } from 'react';
import {
  Boxes,
  Gauge,
  LayoutGrid,
  LogOut,
  Package,
  Settings,
  ShoppingBag,
  Layers,
  AlertTriangle,
  Clock,
  CheckCircle2,
  TrendingUp,
  Mail,
} from 'lucide-react';
import { AdminUser } from '../../api/adminAuth';
import { AdminCategoriesPage } from './AdminCategoriesPage';
import { AdminProductsPage } from './AdminProductsPage';
import { AdminVariantsPage } from './AdminVariantsPage';
import { AdminOrdersPage } from './AdminOrdersPage';
import { AdminMessagesPage } from './AdminMessagesPage';
import { ApiCategory, fetchCategories } from '../../api/categories';
import { AdminProduct, fetchAdminProducts } from '../../api/products';
import { AdminVariant, fetchAdminVariants } from '../../api/variants';
import { AdminOrder, fetchAdminOrders } from '../../api/orders';

type AdminDashboardProps = {
  admin: AdminUser;
  onLogout: () => void;
};

const menuItems = [
  { label: 'Dashboard', icon: Gauge },
  { label: 'Categories', icon: LayoutGrid },
  { label: 'Products', icon: Package },
  { label: 'Variants', icon: Layers },
  { label: 'Orders', icon: ShoppingBag },
  { label: 'Messages', icon: Mail },
  { label: 'Settings', icon: Settings },
];

type AdminPage = typeof menuItems[number]['label'];

export function AdminDashboard({ admin, onLogout }: AdminDashboardProps) {
  const [activePage, setActivePage] = useState<AdminPage>('Dashboard');

  // Dashboard Data State
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [categories, setCategories] = useState<ApiCategory[]>([]);
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [variants, setVariants] = useState<AdminVariant[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [catData, prodData, varData, orderData] = await Promise.all([
        fetchCategories(),
        fetchAdminProducts(),
        fetchAdminVariants(),
        fetchAdminOrders(),
      ]);
      setCategories(catData);
      setProducts(prodData);
      setVariants(varData);
      setOrders(orderData);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activePage === 'Dashboard') {
      loadDashboardData();
    }
  }, [activePage]);

  // Compute stats
  const totalCategories = categories.length;
  const totalProducts = products.length;
  const totalVariants = variants.length;
  const totalOrders = orders.length;

  const pendingOrders = orders.filter((o) => o.status === 'pending').length;

  const todayStr = new Date().toDateString();
  const ordersToday = orders.filter(
    (o) => new Date(o.created_at).toDateString() === todayStr
  ).length;

  const recentOrders = orders.slice(0, 5);
  const lowStockVariants = variants.filter((v) => v.stock_quantity < 5);

  return (
    <div className="min-h-screen bg-[#F7F3EE] text-[#2D1424]">
      {/* Sidebar */}
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
            {menuItems.map((item) => {
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

      {/* Main Panel */}
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
          ) : activePage === 'Products' ? (
            <AdminProductsPage />
          ) : activePage === 'Variants' ? (
            <AdminVariantsPage />
          ) : activePage === 'Orders' ? (
            <AdminOrdersPage />
          ) : activePage === 'Messages' ? (
            <AdminMessagesPage />
          ) : activePage === 'Settings' ? (
            <section className="rounded-lg border border-[#E4DAD2] bg-white p-5">
              <h2 className="text-base font-semibold">Settings</h2>
              <p className="mt-2 text-sm text-[#6E5E67]">
                Settings and configuration controls will go here.
              </p>
            </section>
          ) : (
            // ActivePage is Dashboard
            <>
              {error && (
                <div className="mb-6 rounded-lg border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                  <p className="font-semibold">Error loading dashboard data</p>
                  <p className="mt-1">{error}</p>
                  <button
                    type="button"
                    onClick={loadDashboardData}
                    className="mt-2 text-xs font-semibold text-red-800 underline hover:text-red-950"
                  >
                    Retry loading
                  </button>
                </div>
              )}

              {/* Cards grid */}
              <div className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
                {[
                  { label: 'Total Categories', value: totalCategories, icon: LayoutGrid, color: 'text-blue-600 bg-blue-50' },
                  { label: 'Total Products', value: totalProducts, icon: Package, color: 'text-indigo-600 bg-indigo-50' },
                  { label: 'Total Variants', value: totalVariants, icon: Layers, color: 'text-purple-600 bg-purple-50' },
                  { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-emerald-600 bg-emerald-50' },
                  { label: 'Pending Orders', value: pendingOrders, icon: Clock, color: 'text-amber-600 bg-amber-50' },
                  { label: 'Orders Today', value: ordersToday, icon: TrendingUp, color: 'text-rose-600 bg-rose-50' },
                ].map((card) => {
                  const Icon = card.icon;
                  return (
                    <section key={card.label} className="flex items-center justify-between rounded-lg border border-[#E4DAD2] bg-white p-4 shadow-sm">
                      <div>
                        <p className="text-xs font-medium text-[#7C6B73]">{card.label}</p>
                        <p className="mt-1 text-2xl font-semibold">
                          {loading ? (
                            <span className="inline-block h-6 w-12 animate-pulse rounded bg-gray-200"></span>
                          ) : (
                            card.value
                          )}
                        </p>
                      </div>
                      <div className={`rounded-md p-2 ${card.color}`}>
                        <Icon size={20} />
                      </div>
                    </section>
                  );
                })}
              </div>

              {/* Double Column content */}
              <div className="grid gap-6 lg:grid-cols-2">
                {/* Recent Orders */}
                <section className="rounded-lg border border-[#E4DAD2] bg-white p-5 shadow-sm">
                  <h2 className="mb-4 text-base font-semibold text-[#2D1424]">Recent Orders</h2>
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 w-full animate-pulse rounded bg-gray-100"></div>
                      ))}
                    </div>
                  ) : recentOrders.length === 0 ? (
                    <div className="py-8 text-center text-sm text-[#7C6B73]">
                      No orders found.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-[#E4DAD2] text-xs font-semibold uppercase text-[#7C6B73]">
                            <th className="pb-2">Customer</th>
                            <th className="pb-2">Date</th>
                            <th className="pb-2">Status</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1EAE4]">
                          {recentOrders.map((order) => (
                            <tr key={order.id} className="text-[#2D1424]">
                              <td className="py-3 font-medium">{order.customer_name}</td>
                              <td className="py-3 text-[#7C6B73]">
                                {new Date(order.created_at).toLocaleDateString(undefined, {
                                  month: 'short',
                                  day: 'numeric',
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </td>
                              <td className="py-3">
                                <span
                                  className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-xs font-medium ${
                                    order.status === 'pending'
                                      ? 'bg-amber-50 text-amber-700'
                                      : order.status === 'delivered'
                                      ? 'bg-emerald-50 text-emerald-700'
                                      : 'bg-[#F1EAE4] text-[#5F4E58]'
                                  }`}
                                >
                                  {order.status}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>

                {/* Low Stock Alerts */}
                <section className="rounded-lg border border-[#E4DAD2] bg-white p-5 shadow-sm">
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-base font-semibold text-[#2D1424]">Low Stock Alert</h2>
                    {lowStockVariants.length > 0 && !loading && (
                      <span className="inline-flex items-center gap-1 rounded-full bg-rose-50 px-2.5 py-0.5 text-xs font-semibold text-rose-700">
                        <AlertTriangle size={12} />
                        {lowStockVariants.length} item(s)
                      </span>
                    )}
                  </div>
                  {loading ? (
                    <div className="space-y-3">
                      {[1, 2, 3].map((i) => (
                        <div key={i} className="h-10 w-full animate-pulse rounded bg-gray-100"></div>
                      ))}
                    </div>
                  ) : lowStockVariants.length === 0 ? (
                    <div className="py-8 text-center text-sm text-emerald-700">
                      <div className="mb-2 flex justify-center text-emerald-500">
                        <CheckCircle2 size={32} />
                      </div>
                      All inventory is sufficiently stocked.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full text-left text-sm">
                        <thead>
                          <tr className="border-b border-[#E4DAD2] text-xs font-semibold uppercase text-[#7C6B73]">
                            <th className="pb-2">Product</th>
                            <th className="pb-2">Variant</th>
                            <th className="pb-2">Stock</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-[#F1EAE4]">
                          {lowStockVariants.map((variant) => (
                            <tr key={variant.id} className="text-[#2D1424]">
                              <td className="py-3 font-medium">
                                {variant.product_name || 'Unknown Product'}
                              </td>
                              <td className="py-3 text-[#7C6B73]">{variant.variant_name}</td>
                              <td className="py-3 font-semibold text-rose-700">
                                {variant.stock_quantity} Left
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </section>
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

