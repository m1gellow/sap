
import { useProfile } from '../../lib/context/ProfileContext';
import { UserRound } from 'lucide-react';

export const ProfileActions = () => {
    const { isAuthenticated, setShowProfileModal } = useProfile();

    return (
        <button
            onClick={() => setShowProfileModal(true)}
            className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
            title={isAuthenticated ? 'Профиль пользователя' : 'Войти в аккаунт'}
        >
            <UserRound className="text-text-primary" size={24} />
        </button>
    );
}