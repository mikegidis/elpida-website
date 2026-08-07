import React, { useState, useEffect, useMemo } from 'react';
import { fetchAdminOrders, fetchAdminOrder, updateOrderStatus, AdminOrder, OrderStatus } from '../../api/orders';
import { Search, Loader2, FileText, CheckCircle, PackageSearch } from 'lucide-react';

export function AdminOrdersPage() {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const [success, setSuccess] = useState('');

  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<AdminOrder | null>(null);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [updatingStatus, setUpdatingStatus] = useState(false);

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await fetchAdminOrders();
      setOrders(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load orders');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetails = async (id: number) => {
    setSelectedOrderId(id);
    try {
      setDetailsLoading(true);
      const data = await fetchAdminOrder(id);
      setSelectedOrderDetails(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load order details');
      setSelectedOrderId(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleUpdateStatus = async (status: OrderStatus) => {
    if (!selectedOrderDetails) return;
    try {
      setUpdatingStatus(true);
      await updateOrderStatus(selectedOrderDetails.id, status);
      
      // Update local state in details
      setSelectedOrderDetails({ ...selectedOrderDetails, status });
      
      // Update main list silently
      setOrders((prev) => 
        prev.map((o) => (o.id === selectedOrderDetails.id ? { ...o, status } : o))
      );
      
      setSuccess(`Order status updated to ${status}`);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update order status');
    } finally {
      setUpdatingStatus(false);
    }
  };

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesSearch =
        order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        order.phone.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [orders, searchQuery, statusFilter]);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-[#2D1424]" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-md bg-red-50 p-4">
        <h3 className="text-sm font-medium text-red-800">Error</h3>
        <div className="mt-2 text-sm text-red-700">
          <p>{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-xl font-semibold text-[#2D1424]">Manage Orders</h2>
      </div>

      {success && (
        <div className="rounded-md bg-green-50 p-4 text-sm text-green-700">
          {success}
        </div>
      )}

      {/* Filters & Search */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder="Search by customer name or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full rounded-md border border-[#E4DAD2] py-2 pl-10 pr-4 text-sm focus:border-[#2D1424] focus:outline-none focus:ring-1 focus:ring-[#2D1424]"
          />
        </div>
        
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
          className="rounded-md border border-[#E4DAD2] bg-white px-3 py-2 text-sm focus:border-[#2D1424] focus:outline-none focus:ring-1 focus:ring-[#2D1424] sm:w-48"
        >
          <option value="all">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="preparing">Preparing</option>
          <option value="ready">Ready</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Table */}
      <div className="overflow-hidden rounded-lg border border-[#E4DAD2] bg-white shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] text-left text-sm">
            <thead className="bg-[#F7F3EE]">
              <tr>
                <th className="px-4 py-3 font-medium text-[#2D1424]">Order ID</th>
                <th className="px-4 py-3 font-medium text-[#2D1424]">Customer</th>
                <th className="px-4 py-3 font-medium text-[#2D1424]">Contact</th>
                <th className="px-4 py-3 font-medium text-[#2D1424]">Items</th>
                <th className="px-4 py-3 font-medium text-[#2D1424]">Date</th>
                <th className="px-4 py-3 font-medium text-[#2D1424]">Status</th>
                <th className="px-4 py-3 font-medium text-[#2D1424]">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E4DAD2]">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    <PackageSearch className="mx-auto mb-2 h-8 w-8 text-gray-400" />
                    No orders found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((order) => (
                  <tr key={order.id} className="transition hover:bg-gray-50">
                    <td className="whitespace-nowrap px-4 py-3 font-medium">#{order.id}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#6E5E67]">{order.customer_name}</td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#6E5E67]">
                      {order.phone}
                      {order.email && <span className="block text-xs text-gray-400">{order.email}</span>}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#6E5E67]">{order.items_count} items</td>
                    <td className="whitespace-nowrap px-4 py-3 text-[#6E5E67]">
                      {new Date(order.created_at).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <span
                        className={`inline-flex rounded-full px-2 text-xs font-semibold uppercase tracking-wide
                          ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'preparing' ? 'bg-purple-100 text-purple-800' :
                            order.status === 'ready' ? 'bg-indigo-100 text-indigo-800' :
                            order.status === 'delivered' ? 'bg-green-100 text-green-800' :
                            'bg-red-100 text-red-800'
                          }
                        `}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-3">
                      <button
                        onClick={() => handleOpenDetails(order.id)}
                        className="rounded p-1 text-gray-500 hover:bg-[#F7F3EE] hover:text-[#2D1424] flex items-center gap-1"
                        title="View Details"
                      >
                        <FileText size={18} />
                        <span className="text-xs font-medium">View</span>
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Details Modal */}
      {selectedOrderId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="w-full max-w-2xl rounded-lg bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
            
            {detailsLoading || !selectedOrderDetails ? (
              <div className="flex h-32 items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-[#2D1424]" />
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-start justify-between border-b border-[#E4DAD2] pb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-[#2D1424]">Order #{selectedOrderDetails.id}</h3>
                    <p className="text-sm text-gray-500">Placed on {new Date(selectedOrderDetails.created_at).toLocaleString()}</p>
                  </div>
                  <button
                    onClick={() => setSelectedOrderId(null)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    ✕
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Customer Details</h4>
                    <p className="text-sm"><strong>Name:</strong> {selectedOrderDetails.customer_name}</p>
                    <p className="text-sm"><strong>Phone:</strong> {selectedOrderDetails.phone}</p>
                    {selectedOrderDetails.email && <p className="text-sm"><strong>Email:</strong> {selectedOrderDetails.email}</p>}
                    {selectedOrderDetails.notes && (
                      <div className="mt-2 bg-yellow-50 p-3 rounded text-sm text-yellow-800 border border-yellow-100">
                        <strong>Notes:</strong> {selectedOrderDetails.notes}
                      </div>
                    )}
                  </div>

                  <div className="space-y-2 bg-gray-50 p-4 rounded-lg border border-gray-100">
                    <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500 mb-3">Order Status</h4>
                    
                    <div className="flex items-center gap-3">
                      <select
                        value={selectedOrderDetails.status}
                        onChange={(e) => handleUpdateStatus(e.target.value as OrderStatus)}
                        disabled={updatingStatus}
                        className="flex-1 rounded-md border border-[#E4DAD2] px-3 py-2 text-sm focus:border-[#2D1424] focus:outline-none focus:ring-1 focus:ring-[#2D1424]"
                      >
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="preparing">Preparing</option>
                        <option value="ready">Ready</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      
                      {updatingStatus && <Loader2 className="h-5 w-5 animate-spin text-[#2D1424]" />}
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="text-sm font-semibold uppercase tracking-wide text-gray-500">Ordered Items</h4>
                  <div className="border border-[#E4DAD2] rounded-md overflow-hidden">
                    <table className="w-full text-left text-sm">
                      <thead className="bg-[#F7F3EE]">
                        <tr>
                          <th className="px-4 py-2 font-medium">Product</th>
                          <th className="px-4 py-2 font-medium">Variant</th>
                          <th className="px-4 py-2 font-medium">Price</th>
                          <th className="px-4 py-2 font-medium">Qty</th>
                          <th className="px-4 py-2 font-medium text-right">Total</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#E4DAD2]">
                        {selectedOrderDetails.items?.map((item) => (
                          <tr key={item.id}>
                            <td className="px-4 py-3">{item.product_name}</td>
                            <td className="px-4 py-3 text-gray-500">{item.variant_name}</td>
                            <td className="px-4 py-3">${item.price_at_order.toFixed(2)}</td>
                            <td className="px-4 py-3 font-medium">{item.quantity}</td>
                            <td className="px-4 py-3 text-right font-medium">${(item.price_at_order * item.quantity).toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50">
                          <td colSpan={4} className="px-4 py-3 text-right font-semibold">Order Total:</td>
                          <td className="px-4 py-3 text-right font-bold text-[#2D1424]">
                            ${selectedOrderDetails.items?.reduce((sum, item) => sum + (item.price_at_order * item.quantity), 0).toFixed(2)}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
            
            <div className="mt-6 flex justify-end pt-4 border-t border-gray-100">
              <button
                onClick={() => setSelectedOrderId(null)}
                className="rounded-md bg-gray-100 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-200"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
