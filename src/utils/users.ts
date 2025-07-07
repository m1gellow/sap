import { User } from "../types";

export const filterUsers = (users: User[], searchTerm: string, roleFilter: string, statusFilter: string) => {
  let filtered = [...users];

  if (searchTerm) {
    filtered = filtered.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()),
    );
  }

  if (roleFilter !== 'all') {
    filtered = filtered.filter((user) => user.role === roleFilter);
  }

  if (statusFilter !== 'all') {
    filtered = filtered.filter((user) => user.status === statusFilter);
  }

  return filtered;
};

export const formatDate = (dateString?: string) => {
  if (!dateString) return 'Никогда';
  
  const date = new Date(dateString);
  return date.toLocaleString('ru-RU', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const getRoleBadgeClass = (role: string) => {
  switch (role) {
    case 'admin': return 'bg-purple-100 text-purple-800';
    case 'manager': return 'bg-blue text-blue';
    case 'customer': return 'bg-green-100 text-green-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};

export const getStatusBadgeClass = (status: string) => {
  switch (status) {
    case 'active': return 'bg-green-100 text-green-800';
    case 'inactive': return 'bg-gray-100 text-gray-800';
    default: return 'bg-gray-100 text-gray-800';
  }
};