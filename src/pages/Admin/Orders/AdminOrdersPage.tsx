import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';
import { OrdersFilters } from './components/OrdersFilters';
import { OrdersTable } from './components/OrdersTable';
import { ViewOrderModal } from './modals/ViewOrderModal';
import { StatusChangeModal } from './modals/StatusChangeModal';
import { sortOrders } from './utils/formatters';
import { getAdminOrders, updateOrderStatus } from '../../../lib/api/admin';
import { Order } from '../../../lib/types';

export const AdminOrdersPage: React.FC = () => {
  // Состояние данных и пагинации
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Состояние фильтрации и сортировки
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('all');
  const [filteredOrders, setFilteredOrders] = useState<Order[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState({ field: 'date', direction: 'desc' });

  // Состояние модальных окон
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isEditStatusModalOpen, setIsEditStatusModalOpen] = useState(false);

  const ordersPerPage = 10;

  // Загрузка заказов из базы данных
  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { orders, error } = await getAdminOrders();

        if (error) {
          throw error;
        }

        setOrders(orders);
      } catch (err) {
        console.error('Ошибка при загрузке заказов:', err);
        setError('Не удалось загрузить заказы. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  // Filter orders based on search, status and date
  useEffect(() => {
    let filtered = [...orders];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (order) =>
          order.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.phone.includes(searchTerm),
      );
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((order) => order.status === statusFilter);
    }

    // Filter by date
    if (dateFilter !== 'all') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      const yesterday = new Date(today);
      yesterday.setDate(yesterday.getDate() - 1);

      const lastWeek = new Date(today);
      lastWeek.setDate(lastWeek.getDate() - 7);

      const lastMonth = new Date(today);
      lastMonth.setMonth(lastMonth.getMonth() - 1);

      filtered = filtered.filter((order) => {
        const orderDate = new Date(order.date);

        switch (dateFilter) {
          case 'today':
            return orderDate >= today;
          case 'yesterday':
            return orderDate >= yesterday && orderDate < today;
          case 'last7days':
            return orderDate >= lastWeek;
          case 'last30days':
            return orderDate >= lastMonth;
          default:
            return true;
        }
      });
    }

    // Sort orders
    filtered = sortOrders(filtered, sortBy.field, sortBy.direction as 'asc' | 'desc');

    setFilteredOrders(filtered);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, dateFilter, orders, sortBy]);

  // Get current orders for pagination
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);

  // View order details
  const handleViewOrder = (order: Order) => {
    setSelectedOrder(order);
    setIsViewModalOpen(true);
  };

  // Edit order status
  const handleEditStatus = (order: Order) => {
    setSelectedOrder(order);
    setIsEditStatusModalOpen(true);
  };

  // Save updated order status
  const saveOrderStatus = async (newStatus: string) => {
    if (!selectedOrder) return;

    setIsLoading(true);

    try {
      const { success } = await updateOrderStatus(selectedOrder.id, newStatus);

      if (success) {
        // Обновляем локальный список заказов
        setOrders(orders.map((order) => (order.id === selectedOrder.id ? { ...order, status: newStatus } : order)));

        setIsEditStatusModalOpen(false);
      } else {
        setError('Не удалось обновить статус заказа.');
      }
    } catch (err) {
      console.error('Ошибка при обновлении статуса:', err);
      setError('Ошибка при обновлении статуса заказа.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSortChange = (field: string) => {
    setSortBy((prev) => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-800">Заказы</h1>

      <OrdersFilters
        searchTerm={searchTerm}
        statusFilter={statusFilter}
        dateFilter={dateFilter}
        onSearchChange={setSearchTerm}
        onStatusChange={setStatusFilter}
        onDateChange={setDateFilter}
      />

      {isLoading ? (
        <div className="flex justify-center py-12">
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
            <Loader2 className="animate-spin h-8 w-8 text-blue" />
          </motion.div>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
          <p>{error}</p>
        </div>
      ) : (
        <OrdersTable
          orders={currentOrders}
          currentPage={currentPage}
          totalPages={totalPages}
          sortBy={sortBy}
          onViewOrder={handleViewOrder}
          onEditStatus={handleEditStatus}
          onSortChange={handleSortChange}
          onPageChange={handlePageChange}
        />
      )}

      {selectedOrder && (
        <>
          <ViewOrderModal
            order={selectedOrder}
            isOpen={isViewModalOpen}
            onClose={() => setIsViewModalOpen(false)}
            onEditStatus={() => {
              setIsViewModalOpen(false);
              setIsEditStatusModalOpen(true);
            }}
          />

          <StatusChangeModal
            order={selectedOrder}
            isOpen={isEditStatusModalOpen}
            onClose={() => setIsEditStatusModalOpen(false)}
            onSave={saveOrderStatus}
          />
        </>
      )}
    </div>
  );
};
