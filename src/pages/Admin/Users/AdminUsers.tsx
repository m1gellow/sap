import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Search, Plus, Edit, Trash2, Lock, Eye, EyeOff, X, Check, User, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { Input } from '../../../components/ui/input';
import { getAdminUsers, updateAdminUser, deactivateAdminUser } from '../../../lib/api/admin';
import { useAuth } from '../../../lib/context/AuthContext';

export const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<any>(null);
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isLoading, setIsLoading] = useState(true);
  const [isOperationLoading, setIsOperationLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const { signUp } = useAuth();

  // Загрузка пользователей
  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { users, error } = await getAdminUsers();

        if (error) {
          throw error;
        }

        setUsers(users);
      } catch (err) {
        console.error('Ошибка при загрузке пользователей:', err);
        setError('Не удалось загрузить пользователей. Пожалуйста, попробуйте позже.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search, role and status
  useEffect(() => {
    let filtered = [...users];

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (user) =>
          user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    // Filter by role
    if (roleFilter !== 'all') {
      filtered = filtered.filter((user) => user.role === roleFilter);
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(filtered);
  }, [searchTerm, roleFilter, statusFilter, users]);

  // Handle creating a new user
  const handleCreateUser = () => {
    setSelectedUser({
      id: null,
      name: '',
      email: '',
      role: 'customer',
      status: 'active',
      password: '',
      confirmPassword: '',
    });
    setIsUserModalOpen(true);
  };

  // Handle editing a user
  const handleEditUser = async (user) => {
    try {
      setSelectedUser({
        ...user,
        password: '',
        confirmPassword: '',
      });
      setIsUserModalOpen(true);
    } catch (error) {
      console.error('Ошибка при подготовке данных пользователя:', error);
      setError('Не удалось загрузить данные пользователя для редактирования');
    }
  };

  // Handle deleting a user (soft delete)
  const handleDeleteUser = (user) => {
    setSelectedUser(user);
    setIsDeleteModalOpen(true);
  };

  // Confirm user deletion (deactivation)
  const confirmDeleteUser = async () => {
    if (!selectedUser) return;

    setIsOperationLoading(true);
    setError(null);

    try {
      const { success, error } = await deactivateAdminUser(selectedUser.id);

      if (!success || error) {
        throw error || new Error('Не удалось деактивировать пользователя');
      }

      // Обновляем локальное состояние
      setUsers(users.map(user => 
        user.id === selectedUser.id 
          ? { ...user, status: 'inactive', role: 'customer' }
          : user
      ));

      setIsDeleteModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Ошибка при деактивации пользователя:', error);
      setError('Не удалось деактивировать пользователя. Попробуйте еще раз.');
    } finally {
      setIsOperationLoading(false);
    }
  };

  // Save user data
  const handleSaveUser = async (userData) => {
    setIsOperationLoading(true);
    setError(null);

    try {
      if (userData.id) {
        // Обновление существующего пользователя
        const { success, error } = await updateAdminUser(userData.id, {
          name: userData.name,
          email: userData.email,
          role: userData.role,
          status: userData.status,
        });

        if (!success || error) {
          throw error || new Error('Не удалось обновить пользователя');
        }

        // Обновляем локальное состояние
        setUsers(users.map(user => 
          user.id === userData.id 
            ? { ...user, ...userData }
            : user
        ));
      } else {
        // Создание нового пользователя
        const { error } = await signUp(userData.email, userData.password, {
          name: userData.name,
          role: userData.role,
          status: userData.status,
        });

        if (error) {
          throw error;
        }

        // Перезагружаем список пользователей
        const { users: updatedUsers, error: fetchError } = await getAdminUsers();
        if (!fetchError) {
          setUsers(updatedUsers);
        }
      }

      setIsUserModalOpen(false);
      setSelectedUser(null);
    } catch (error) {
      console.error('Ошибка при сохранении пользователя:', error);
      setError('Не удалось сохранить пользователя. Пожалуйста, попробуйте позже.');
    } finally {
      setIsOperationLoading(false);
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Get role badge class
  const getRoleBadgeClass = (role) => {
    switch (role) {
      case 'admin':
        return 'bg-purple-100 text-purple-800';
      case 'manager':
        return 'bg-blue text-gray-500';
      case 'customer':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get role label
  const getRoleLabel = (role) => {
    switch (role) {
      case 'admin':
        return 'Администратор';
      case 'manager':
        return 'Менеджер';
      case 'customer':
        return 'Клиент';
      default:
        return role;
    }
  };

  // Get status badge class
  const getStatusBadgeClass = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800';
      case 'inactive':
        return 'bg-gray-100 text-gray-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  // Get status label
  const getStatusLabel = (status) => {
    switch (status) {
      case 'active':
        return 'Активен';
      case 'inactive':
        return 'Неактивен';
      default:
        return status;
    }
  };

  if (isLoading && users.length === 0) {
    return (
      <div className="flex justify-center items-center h-64">
        <Loader2 className="h-8 w-8 text-blue animate-spin" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-600 p-4 rounded-md">
        <p>{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-2 text-sm underline hover:no-underline"
        >
          Обновить страницу
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center space-y-4 sm:space-y-0">
        <h1 className="text-2xl font-bold text-gray-800">Пользователи</h1>
        <Button
          className="bg-skyblue  text-blue rounded-full flex items-center gap-2"
          onClick={handleCreateUser}
          disabled={isOperationLoading}
        >
          <Plus size={16} />
          Добавить пользователя
        </Button>
      </div>

      {/* Фильтры и поиск */}
      <div className="bg-white rounded-lg shadow-sm p-4 border border-gray-100">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-1">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <Input
              placeholder="Поиск пользователей..."
              className="pl-10 w-full rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <div className="relative">
              <select
                className="w-full h-10 pl-3 pr-10 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-4"
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
              >
                <option value="all">Все роли</option>
                <option value="admin">Администраторы</option>
                <option value="manager">Менеджеры</option>
                <option value="customer">Клиенты</option>
              </select>
            </div>

            <div className="relative">
              <select
                className="w-full h-10 pl-3 pr-10 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-4"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option value="all">Все статусы</option>
                <option value="active">Активные</option>
                <option value="inactive">Неактивные</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Таблица пользователей */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Пользователь
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Email
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Роль
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Статус
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Последний вход
              </th>
              <th
                scope="col"
                className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                Действия
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-10 text-center text-gray-500">
                  Пользователи не найдены. Измените критерии поиска или добавьте нового пользователя.
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <motion.tr
                  key={user.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-500">
                        <User size={20} />
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{user.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getRoleBadgeClass(user.role)}`}
                    >
                      {getRoleLabel(user.role)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 inline-flex text-xs leading-5 font-medium rounded-full ${getStatusBadgeClass(user.status)}`}
                    >
                      {getStatusLabel(user.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatDate(user.lastLogin)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex justify-end space-x-2">
                      <button
                        className="p-1 text-blue hover:text-blue transition-colors rounded-full "
                        onClick={() => handleEditUser(user)}
                        title="Редактировать пользователя"
                        disabled={isOperationLoading}
                      >
                        <Edit size={16} />
                      </button>
                      <button
                        className="p-1 text-red-500 hover:text-red-700 transition-colors rounded-full hover:bg-red-50"
                        onClick={() => handleDeleteUser(user)}
                        title="Деактивировать пользователя"
                        disabled={isOperationLoading}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Модальное окно создания/редактирования пользователя */}
      {isUserModalOpen && selectedUser && (
        <UserFormModal
          user={selectedUser}
          onClose={() => setIsUserModalOpen(false)}
          onSave={handleSaveUser}
          isLoading={isOperationLoading}
        />
      )}

      {/* Модальное окно подтверждения удаления */}
      {isDeleteModalOpen && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div
            className="bg-white rounded-lg max-w-md w-full p-6"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Подтвердите деактивацию</h3>
            <p className="text-gray-600 mb-4">
              Вы уверены, что хотите деактивировать пользователя "{selectedUser.name}"? 
              Пользователь будет переведен в статус "неактивен" и роль "клиент".
            </p>
            <p className="text-sm text-amber-600 mb-4">
              Примечание: Полное удаление пользователя из системы аутентификации возможно только через серверные функции.
            </p>
            <div className="flex justify-end space-x-3">
              <Button
                variant="outline"
                onClick={() => setIsDeleteModalOpen(false)}
                className="border-gray-300 text-gray-700"
                disabled={isOperationLoading}
              >
                Отмена
              </Button>
              <Button
                className="bg-red-500 hover:bg-red-600 text-white flex items-center space-x-2"
                onClick={confirmDeleteUser}
                disabled={isOperationLoading}
              >
                {isOperationLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    <span>Деактивация...</span>
                  </>
                ) : (
                  <span>Деактивировать</span>
                )}
              </Button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

// Компонент модального окна для формы пользователя
interface UserFormModalProps {
  user: any;
  onClose: () => void;
  onSave: (userData: any) => void;
  isLoading: boolean;
}

const UserFormModal: React.FC<UserFormModalProps> = ({ user, onClose, onSave, isLoading }) => {
  const [formData, setFormData] = useState(user);
  const [errors, setErrors] = useState<any>({});
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });

    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: undefined,
      });
    }
  };

  const validateForm = () => {
    const newErrors: any = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Имя обязательно';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email обязателен';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный email';
    }

    // Validate password only for new users or if password field is not empty
    if (!formData.id || formData.password) {
      if (!formData.id && !formData.password) {
        newErrors.password = 'Пароль обязателен для нового пользователя';
      } else if (formData.password && formData.password.length < 6) {
        newErrors.password = 'Пароль должен быть не менее 6 символов';
      }

      if (formData.password !== formData.confirmPassword) {
        newErrors.confirmPassword = 'Пароли не совпадают';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Remove confirm password field before saving
      const { confirmPassword, ...userData } = formData;
      onSave(userData);
    }
  };

  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <motion.div
        className="bg-white rounded-lg max-w-md w-full"
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">
            {user.id ? 'Редактирование пользователя' : 'Создание пользователя'}
          </h2>
          <button className="p-1 rounded-full hover:bg-gray-100 text-gray-500" onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Имя</label>
            <Input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className={errors.name ? 'border-red-300' : ''}
            />
            {errors.name && <p className="mt-1 text-xs text-red-500">{errors.name}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <Input
              type="text"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={errors.email ? 'border-red-300' : ''}
            />
            {errors.email && <p className="mt-1 text-xs text-red-500">{errors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Роль</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full h-10 pl-3 pr-10 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-4"
            >
              <option value="customer">Клиент</option>
              <option value="manager">Менеджер</option>
              <option value="admin">Администратор</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Статус</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full h-10 pl-3 pr-10 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-4"
            >
              <option value="active">Активен</option>
              <option value="inactive">Неактивен</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {user.id ? 'Пароль (оставьте пустым, чтобы не менять)' : 'Пароль'}
            </label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className={`pr-10 ${errors.password ? 'border-red-300' : ''}`}
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
                onClick={toggleShowPassword}
              >
                {showPassword ? (
                  <EyeOff size={16} className="text-gray-400" />
                ) : (
                  <Eye size={16} className="text-gray-400" />
                )}
              </button>
            </div>
            {errors.password && <p className="mt-1 text-xs text-red-500">{errors.password}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Подтверждение пароля</label>
            <div className="relative">
              <Input
                type={showPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? 'border-red-300' : ''}
              />
            </div>
            {errors.confirmPassword && <p className="mt-1 text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="border-gray-300 text-gray-700"
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button type="submit" className="bg-blue text-skyblue gap-1" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Сохранение...
                </>
              ) : (
                <>
                  <Check size={16} />
                  Сохранить
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};