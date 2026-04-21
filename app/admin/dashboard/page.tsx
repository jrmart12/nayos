'use client';
import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

interface OrderItem {
  name: string;
  price: number;
  quantity: number;
  cutWeight?: string;
}

interface Order {
  id: string;
  created_at: string;
  customer_name: string;
  customer_phone: string;
  customer_address: string | null;
  delivery_method: 'delivery' | 'pickup';
  payment_method: string;
  subtotal: number;
  delivery_price: number;
  total: number;
  items: OrderItem[];
  notes: string | null;
  transfer_image_url: string | null;
}

const PAYMENT_LABELS: Record<string, string> = {
  transfer: 'Transferencia',
  bac_compra_click: 'Tarjeta',
};

const PAYMENT_COLORS: Record<string, string> = {
  transfer: '#f97316',
  bac_compra_click: '#3b82f6',
};

const DELIVERY_COLORS: Record<string, string> = {
  delivery: '#8b5cf6',
  pickup: '#f59e0b',
};

function formatLps(amount: number) {
  return `L. ${amount.toFixed(2)}`;
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('es-HN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatDateTime(iso: string) {
  return new Date(iso).toLocaleString('es-HN', {
    day: '2-digit',
    month: 'short',
    hour: '2-digit',
    minute: '2-digit',
  });
}

function getCurrentMonth() {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
}

function getMonthOptions() {
  const options: { value: string; label: string }[] = [];
  const now = new Date();
  for (let i = 0; i < 12; i++) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const value = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
    const label = d.toLocaleDateString('es-HN', { month: 'long', year: 'numeric' });
    options.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
  }
  return options;
}

export default function DashboardPage() {
  const router = useRouter();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [month, setMonth] = useState(getCurrentMonth);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const monthOptions = getMonthOptions();

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/orders?month=${month}`);
      if (res.status === 401) {
        router.push('/admin');
        return;
      }
      const data = await res.json();
      setOrders(data.orders || []);
    } catch (err) {
      console.error('Error fetching orders:', err);
    } finally {
      setLoading(false);
    }
  }, [month, router]);

  useEffect(() => {
    fetchOrders();
  }, [fetchOrders]);

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin');
  };

  // --- Computed Stats ---
  const totalRevenue = orders.reduce((sum, o) => sum + o.total, 0);
  const today = new Date().toDateString();
  const todayOrders = orders.filter(o => new Date(o.created_at).toDateString() === today);
  const todayRevenue = todayOrders.reduce((sum, o) => sum + o.total, 0);

  const thisWeekStart = new Date();
  thisWeekStart.setDate(thisWeekStart.getDate() - 7);
  const weekOrders = orders.filter(o => new Date(o.created_at) >= thisWeekStart);
  const weekRevenue = weekOrders.reduce((sum, o) => sum + o.total, 0);

  // Sales by day chart data (last 14 days if range >= 14, else all)
  const salesByDay: Record<string, number> = {};
  orders.forEach(o => {
    const day = new Date(o.created_at).toLocaleDateString('es-HN', { day: '2-digit', month: 'short' });
    salesByDay[day] = (salesByDay[day] || 0) + o.total;
  });
  const salesChartData = Object.entries(salesByDay)
    .map(([date, total]) => ({ date, total }))
    .reverse();

  // Payment method breakdown
  const paymentBreakdown: Record<string, number> = {};
  orders.forEach(o => {
    const key = o.payment_method || 'unknown';
    paymentBreakdown[key] = (paymentBreakdown[key] || 0) + 1;
  });
  const paymentChartData = Object.entries(paymentBreakdown).map(([method, count]) => ({
    name: PAYMENT_LABELS[method] || method,
    value: count,
    color: PAYMENT_COLORS[method] || '#6b7280',
  }));

  // Delivery method breakdown
  const deliveryBreakdown: Record<string, { count: number; revenue: number }> = {};
  orders.forEach(o => {
    const key = o.delivery_method;
    if (!deliveryBreakdown[key]) deliveryBreakdown[key] = { count: 0, revenue: 0 };
    deliveryBreakdown[key].count += 1;
    deliveryBreakdown[key].revenue += o.total;
  });
  const deliveryChartData = Object.entries(deliveryBreakdown).map(([method, data]) => ({
    name: method === 'delivery' ? 'A Domicilio' : 'Pickup',
    Pedidos: data.count,
    Ingresos: Math.round(data.revenue),
    color: DELIVERY_COLORS[method] || '#6b7280',
  }));

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Sidebar */}
      <div className="flex h-screen overflow-hidden">
        <aside className="hidden md:flex flex-col w-60 bg-gray-900 border-r border-gray-800 shrink-0">
          <div className="flex items-center gap-3 px-6 py-6 border-b border-gray-800">
            <div className="w-9 h-9 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg shadow-orange-500/30">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
                <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
              </svg>
            </div>
            <div>
              <p className="font-black text-white text-sm">Nayo's</p>
              <p className="text-xs text-gray-400">Dashboard</p>
            </div>
          </div>

          <nav className="p-4 space-y-1 flex-1">
            <a className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-orange-500/10 text-orange-400 font-semibold text-sm">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path d="M18.375 2.25c-1.035 0-1.875.84-1.875 1.875v15.75c0 1.035.84 1.875 1.875 1.875h.75c1.035 0 1.875-.84 1.875-1.875V4.125c0-1.036-.84-1.875-1.875-1.875h-.75ZM9.75 8.625c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-.75a1.875 1.875 0 0 1-1.875-1.875V8.625ZM3 13.125c0-1.036.84-1.875 1.875-1.875h.75c1.036 0 1.875.84 1.875 1.875v6.75c0 1.035-.84 1.875-1.875 1.875h-.75A1.875 1.875 0 0 1 3 19.875v-6.75Z" />
              </svg>
              Resumen
            </a>
          </nav>

          <div className="p-4 border-t border-gray-800">
            <button
              onClick={handleLogout}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-400 hover:text-white hover:bg-gray-800 transition-colors text-sm w-full"
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                <path fillRule="evenodd" d="M7.5 3.75A1.5 1.5 0 0 0 6 5.25v13.5a1.5 1.5 0 0 0 1.5 1.5h6a1.5 1.5 0 0 0 1.5-1.5V15a.75.75 0 0 1 1.5 0v3.75a3 3 0 0 1-3 3h-6a3 3 0 0 1-3-3V5.25a3 3 0 0 1 3-3h6a3 3 0 0 1 3 3V9A.75.75 0 0 1 15 9V5.25a1.5 1.5 0 0 0-1.5-1.5h-6Zm10.72 4.72a.75.75 0 0 1 1.06 0l3 3a.75.75 0 0 1 0 1.06l-3 3a.75.75 0 1 1-1.06-1.06l1.72-1.72H9a.75.75 0 0 1 0-1.5h10.94l-1.72-1.72a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
              </svg>
              Cerrar sesión
            </button>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto">
          {/* Top Bar */}
          <header className="sticky top-0 z-10 bg-gray-950/80 backdrop-blur border-b border-gray-800 px-6 py-4 flex items-center justify-between">
            <h1 className="text-lg font-black text-white">Resumen de Ventas</h1>
            <div className="flex items-center gap-3">
              <select
                value={month}
                onChange={(e) => setMonth(e.target.value)}
                className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 focus:outline-none focus:border-orange-500 capitalize"
              >
                {monthOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
              <button
                onClick={fetchOrders}
                className="bg-gray-800 hover:bg-gray-700 border border-gray-700 text-white text-sm rounded-lg px-3 py-1.5 transition-colors"
              >
                Actualizar
              </button>
              {/* Mobile logout */}
              <button
                onClick={handleLogout}
                className="md:hidden bg-gray-800 border border-gray-700 text-gray-400 text-sm rounded-lg px-3 py-1.5"
              >
                Salir
              </button>
            </div>
          </header>

          <div className="p-6 space-y-6">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="flex flex-col items-center gap-3">
                  <svg className="animate-spin h-8 w-8 text-orange-500" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
                  </svg>
                  <p className="text-gray-400 text-sm">Cargando datos...</p>
                </div>
              </div>
            ) : (
              <>
                {/* KPI Cards */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatCard
                    label="Total Pedidos"
                    value={orders.length.toString()}
                    sub={monthOptions.find(o => o.value === month)?.label || month}
                    icon="📦"
                    color="orange"
                  />
                  <StatCard
                    label="Ingresos Totales"
                    value={formatLps(totalRevenue)}
                    sub={monthOptions.find(o => o.value === month)?.label || month}
                    icon="💰"
                    color="green"
                  />
                  <StatCard
                    label="Esta Semana"
                    value={formatLps(weekRevenue)}
                    sub={`${weekOrders.length} pedidos`}
                    icon="📅"
                    color="blue"
                  />
                  <StatCard
                    label="Hoy"
                    value={formatLps(todayRevenue)}
                    sub={`${todayOrders.length} pedidos`}
                    icon="⚡"
                    color="purple"
                  />
                </div>

                {/* Charts Row */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Sales Area Chart */}
                  <div className="lg:col-span-2 bg-gray-900 rounded-2xl border border-gray-800 p-5">
                    <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">
                      Ventas por Día
                    </h2>
                    {salesChartData.length === 0 ? (
                      <div className="flex items-center justify-center h-48 text-gray-500 text-sm">
                        Sin datos para este período
                      </div>
                    ) : (
                      <ResponsiveContainer width="100%" height={220}>
                        <AreaChart data={salesChartData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                          <defs>
                            <linearGradient id="salesGradient" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="5%" stopColor="#f97316" stopOpacity={0.3} />
                              <stop offset="95%" stopColor="#f97316" stopOpacity={0} />
                            </linearGradient>
                          </defs>
                          <CartesianGrid strokeDasharray="3 3" stroke="#1f2937" />
                          <XAxis dataKey="date" tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} />
                          <YAxis tick={{ fill: '#6b7280', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={(v) => `L.${v}`} />
                          <Tooltip
                            contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                            formatter={(value) => [formatLps(Number(value)), 'Ventas']}
                          />
                          <Area type="monotone" dataKey="total" stroke="#f97316" strokeWidth={2} fill="url(#salesGradient)" dot={{ fill: '#f97316', r: 3 }} />
                        </AreaChart>
                      </ResponsiveContainer>
                    )}
                  </div>

                  {/* Payment Method Pie */}
                  <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                    <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">
                      Método de Pago
                    </h2>
                    {paymentChartData.length === 0 ? (
                      <div className="flex items-center justify-center h-48 text-gray-500 text-sm">Sin datos</div>
                    ) : (
                      <>
                        <ResponsiveContainer width="100%" height={160}>
                          <PieChart>
                            <Pie
                              data={paymentChartData}
                              cx="50%"
                              cy="50%"
                              innerRadius={45}
                              outerRadius={70}
                              dataKey="value"
                              strokeWidth={0}
                            >
                              {paymentChartData.map((entry, index) => (
                                <Cell key={index} fill={entry.color} />
                              ))}
                            </Pie>
                            <Tooltip
                              contentStyle={{ backgroundColor: '#111827', border: '1px solid #374151', borderRadius: '8px', color: '#fff' }}
                              formatter={(value, name) => [value, name]}
                            />
                          </PieChart>
                        </ResponsiveContainer>
                        <div className="mt-3 space-y-2">
                          {paymentChartData.map((item) => (
                            <div key={item.name} className="flex items-center justify-between text-sm">
                              <div className="flex items-center gap-2">
                                <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                                <span className="text-gray-300">{item.name}</span>
                              </div>
                              <span className="font-bold text-white">{item.value}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Delivery Bar Chart */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800 p-5">
                  <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider mb-4">
                    Envío vs Pickup
                  </h2>
                  {deliveryChartData.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-gray-500 text-sm">Sin datos</div>
                  ) : (
                    <div className="grid grid-cols-2 gap-4">
                      {deliveryChartData.map((item) => (
                        <div key={item.name} className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                          <div className="flex items-center gap-2 mb-2">
                            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: item.color }} />
                            <span className="text-gray-300 text-sm font-semibold">{item.name}</span>
                          </div>
                          <p className="text-2xl font-black text-white">{item.Pedidos}</p>
                          <p className="text-xs text-gray-400 mt-1">pedidos</p>
                          <p className="text-orange-400 font-bold text-sm mt-2">{formatLps(item.Ingresos)}</p>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Orders Table */}
                <div className="bg-gray-900 rounded-2xl border border-gray-800">
                  <div className="flex items-center justify-between px-5 py-4 border-b border-gray-800">
                    <h2 className="text-sm font-bold text-gray-300 uppercase tracking-wider">
                      Pedidos Recientes
                    </h2>
                    <span className="text-xs text-gray-500">{orders.length} pedidos</span>
                  </div>

                  {orders.length === 0 ? (
                    <div className="flex items-center justify-center h-32 text-gray-500 text-sm">
                      No hay pedidos en este período
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b border-gray-800">
                            <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Fecha</th>
                            <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Cliente</th>
                            <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Entrega</th>
                            <th className="text-left px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider hidden md:table-cell">Pago</th>
                            <th className="text-right px-5 py-3 text-xs font-bold text-gray-400 uppercase tracking-wider">Total</th>
                            <th className="px-5 py-3"></th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-800">
                          {orders.map((order) => (
                            <tr key={order.id} onClick={() => setSelectedOrder(order)} className="hover:bg-gray-800/40 transition-colors cursor-pointer">
                              <td className="px-5 py-4 text-gray-300 whitespace-nowrap">
                                {formatDateTime(order.created_at)}
                              </td>
                              <td className="px-5 py-4">
                                <p className="text-white font-semibold">{order.customer_name}</p>
                                <p className="text-gray-400 text-xs">{order.customer_phone}</p>
                              </td>
                              <td className="px-5 py-4 hidden md:table-cell">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold ${
                                  order.delivery_method === 'delivery'
                                    ? 'bg-purple-500/15 text-purple-400'
                                    : 'bg-amber-500/15 text-amber-400'
                                }`}>
                                  {order.delivery_method === 'delivery' ? 'Domicilio' : 'Pickup'}
                                </span>
                              </td>
                              <td className="px-5 py-4 hidden md:table-cell">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold`}
                                  style={{
                                    backgroundColor: `${PAYMENT_COLORS[order.payment_method] || '#6b7280'}20`,
                                    color: PAYMENT_COLORS[order.payment_method] || '#9ca3af',
                                  }}
                                >
                                  {PAYMENT_LABELS[order.payment_method] || order.payment_method}
                                </span>
                              </td>
                              <td className="px-5 py-4 text-right font-bold text-orange-400 whitespace-nowrap">
                                <div className="flex items-center justify-end gap-2">
                                  {order.transfer_image_url && (
                                    <span title="Tiene comprobante" className="text-green-400">
                                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                        <path fillRule="evenodd" d="M1.5 6a2.25 2.25 0 0 1 2.25-2.25h16.5A2.25 2.25 0 0 1 22.5 6v12a2.25 2.25 0 0 1-2.25 2.25H3.75A2.25 2.25 0 0 1 1.5 18V6ZM3 16.06V18c0 .414.336.75.75.75h16.5A.75.75 0 0 0 21 18v-1.94l-2.69-2.689a1.5 1.5 0 0 0-2.12 0l-.88.879.97.97a.75.75 0 1 1-1.06 1.06l-5.16-5.159a1.5 1.5 0 0 0-2.12 0L3 16.061Zm10.125-7.81a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Z" clipRule="evenodd" />
                                      </svg>
                                    </span>
                                  )}
                                  {formatLps(order.total)}
                                </div>
                              </td>
                              <td className="px-5 py-4">
                                <button
                                  onClick={() => setSelectedOrder(order)}
                                  className="text-gray-400 hover:text-white transition-colors"
                                  title="Ver detalle"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                                    <path d="M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6Z" />
                                    <path fillRule="evenodd" d="M1.323 11.447C2.811 6.976 7.028 3.75 12.001 3.75c4.97 0 9.185 3.223 10.675 7.69.12.362.12.752 0 1.113-1.487 4.471-5.705 7.697-10.677 7.697-4.97 0-9.186-3.223-10.675-7.69a1.762 1.762 0 0 1 0-1.113ZM17.25 12a5.25 5.25 0 1 1-10.5 0 5.25 5.25 0 0 1 10.5 0Z" clipRule="evenodd" />
                                  </svg>
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>
        </main>
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedOrder(null)}
        >
          <div
            className="bg-gray-900 rounded-2xl border border-gray-800 w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-5 border-b border-gray-800">
              <h3 className="font-black text-white">Detalle del Pedido</h3>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                  <path fillRule="evenodd" d="M5.47 5.47a.75.75 0 0 1 1.06 0L12 10.94l5.47-5.47a.75.75 0 1 1 1.06 1.06L13.06 12l5.47 5.47a.75.75 0 1 1-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 0 1-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                </svg>
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Date */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Fecha y Hora</p>
                <p className="text-white font-semibold">{formatDate(selectedOrder.created_at)}</p>
              </div>

              {/* Customer */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700">
                <p className="text-xs text-orange-400 font-bold uppercase tracking-wider mb-2">Cliente</p>
                <p className="text-white font-bold">{selectedOrder.customer_name}</p>
                <p className="text-gray-300 text-sm">{selectedOrder.customer_phone}</p>
                {selectedOrder.customer_address && (
                  <p className="text-gray-400 text-sm mt-1">📍 {selectedOrder.customer_address}</p>
                )}
                {selectedOrder.notes && (
                  <p className="text-gray-400 text-sm mt-1 italic">📝 {selectedOrder.notes}</p>
                )}
              </div>

              {/* Order Info */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Entrega</p>
                  <p className="text-white font-bold">
                    {selectedOrder.delivery_method === 'delivery' ? '🚗 A Domicilio' : '🏠 Pickup'}
                  </p>
                </div>
                <div className="bg-gray-800/50 rounded-xl p-3 border border-gray-700">
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Pago</p>
                  <p className="text-white font-bold">
                    {selectedOrder.payment_method === 'transfer' && '🏦 Transferencia'}
                    {selectedOrder.payment_method === 'bac_compra_click' && '💳 Tarjeta'}
                    {!['transfer', 'bac_compra_click'].includes(selectedOrder.payment_method) && selectedOrder.payment_method}
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Productos</p>
                <div className="space-y-2">
                  {(selectedOrder.items || []).map((item: OrderItem, i: number) => (
                    <div key={i} className="flex items-start justify-between bg-gray-800/50 rounded-lg p-3 border border-gray-700">
                      <div className="flex-1">
                        <p className="text-white font-semibold text-sm">{item.name}</p>
                        {item.cutWeight && <p className="text-gray-400 text-xs">{item.cutWeight}</p>}
                        <p className="text-gray-400 text-xs">x{item.quantity}</p>
                      </div>
                      <p className="text-orange-400 font-bold text-sm whitespace-nowrap ml-3">
                        {formatLps(item.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="bg-gray-800/50 rounded-xl p-4 border border-gray-700 space-y-2">
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Subtotal</span>
                  <span>{formatLps(selectedOrder.subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm text-gray-300">
                  <span>Envío</span>
                  <span>{formatLps(selectedOrder.delivery_price)}</span>
                </div>
                <div className="flex justify-between font-black text-white border-t border-gray-700 pt-2">
                  <span>Total</span>
                  <span className="text-orange-400">{formatLps(selectedOrder.total)}</span>
                </div>
              </div>

              {/* Transfer receipt */}
              {selectedOrder.transfer_image_url && (
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Comprobante de Transferencia</p>
                  <a
                    href={selectedOrder.transfer_image_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group relative rounded-xl overflow-hidden border border-gray-700 hover:border-orange-500 transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={selectedOrder.transfer_image_url}
                      alt="Comprobante de transferencia"
                      className="w-full max-h-72 object-contain bg-gray-800"
                    />
                    <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                      <span className="text-white text-sm font-bold bg-orange-500 px-3 py-1.5 rounded-lg">
                        Ver en tamaño completo
                      </span>
                    </div>
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  color,
}: {
  label: string;
  value: string;
  sub: string;
  icon: string;
  color: 'orange' | 'green' | 'blue' | 'purple';
}) {
  const colorMap = {
    orange: 'bg-orange-500/10 border-orange-500/20 text-orange-400',
    green: 'bg-green-500/10 border-green-500/20 text-green-400',
    blue: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
    purple: 'bg-purple-500/10 border-purple-500/20 text-purple-400',
  };

  return (
    <div className={`rounded-2xl border p-5 ${colorMap[color]}`}>
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs font-bold uppercase tracking-wider opacity-70">{label}</span>
        <span className="text-xl">{icon}</span>
      </div>
      <p className="text-2xl font-black text-white leading-none">{value}</p>
      <p className="text-xs opacity-60 mt-1">{sub}</p>
    </div>
  );
}
