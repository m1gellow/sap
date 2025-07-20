import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { useProfile } from '../../lib/context/ProfileContext';
import { X, User, Phone, MapPin, Mail, Loader2 } from 'lucide-react';

// Using the same Input component style as DeliveryPage for consistency
const Input = ({ placeholder, type = 'text', value, onChange, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full text-black bg-white p-[8px] font-normal text-[16px] rounded-[8px] outline-none border border-gray-300 focus:ring-2 focus:ring-blue"
    {...props}
  />
);

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileModal: React.FC<ProfileModalProps> = ({ isOpen, onClose }) => {
  const { profile, updateProfile, logout, isLoading } = useProfile();
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
  });

  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || '',
        email: profile.email || '',
        phone: profile.phone || '',
        address: profile.address || '',
      });
      // Reset edit mode when modal is re-opened or profile changes
      setEditMode(false);
    }
  }, [profile, isOpen]);

  // Early return if no profile to prevent errors
  if (!profile) return null;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    await updateProfile({
      name: formData.name,
      phone: formData.phone,
      address: formData.address,
    });
    setEditMode(false);
  };

  const handleLogout = () => {
    logout();
    onClose();
  };

  const handleCancel = () => {
    // Revert changes back to original profile data
    if (profile) {
        setFormData({
            name: profile.name || '',
            email: profile.email || '',
            phone: profile.phone || '',
            address: profile.address || '',
        });
    }
    setEditMode(false);
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-xl shadow-2xl max-w-md w-full overflow-hidden"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 200 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
                <h2 className="text-xl font-bold text-gray">Профиль</h2>
                <Button onClick={onClose} variant="ghost" size="icon" className="text-gray-500 hover:bg-gray-100 rounded-full">
                    <X className="h-5 w-5" />
                </Button>
            </div>

            {/* Profile Content */}
            <div className="p-6 space-y-6">
                {/* Avatar and Name Section */}
                <div className="flex items-center gap-4">
                    <div className="w-24 h-24 rounded-full border-2 border-gray-200 bg-gray-100 flex items-center justify-center overflow-hidden shrink-0">
                        {profile.avatar ? (
                            <img src={profile.avatar} alt={profile.name || 'avatar'} className="w-full h-full object-cover" />
                        ) : (
                            <User className="h-12 w-12 text-gray-400" />
                        )}
                    </div>
                    <div className="w-full">
                        {editMode ? (
                            <Input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                placeholder="Ваше имя"
                            />
                        ) : (
                            <h3 className="text-2xl font-bold text-gray-800">{profile.name || 'Пользователь'}</h3>
                        )}
                    </div>
                </div>

                {/* Details Section */}
                <div className="space-y-4">
                    <div className="flex items-center gap-4 text-gray">
                        <Mail className="h-5 w-5 text-blue shrink-0" />
                        <span className="truncate">{profile.email}</span>
                    </div>
                    <div className="flex items-center gap-4 text-gray">
                        <Phone className="h-5 w-5 text-blue shrink-0" />
                        {editMode ? (
                            <Input
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                placeholder="Номер телефона"
                            />
                        ) : (
                            <span>{profile.phone || 'Не указан'}</span>
                        )}
                    </div>
                     <div className="flex items-start gap-4 text-gray">
                        <MapPin className="h-5 w-5 text-blue shrink-0 mt-2" />
                        {editMode ? (
                            <Input
                                name="address"
                                value={formData.address}
                                onChange={handleInputChange}
                                placeholder="Адрес доставки"
                            />
                        ) : (
                            <span className="break-words">{profile.address || 'Не указан'}</span>
                        )}
                    </div>
                </div>
                
                {/* Action Buttons */}
                <div className="pt-2 flex gap-3">
                    {editMode ? (
                        <>
                            <Button
                                className="flex-1"
                                onClick={handleSave}
                                disabled={isLoading}
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Сохранение...
                                    </>
                                ) : (
                                    'Сохранить'
                                )}
                            </Button>
                            <Button
                                className="flex-1"
                                variant="outline"
                                onClick={handleCancel}
                                disabled={isLoading}
                            >
                                Отмена
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                className="flex-1"
                                onClick={() => setEditMode(true)}
                            >
                                Редактировать
                            </Button>
                            <Button
                                className="flex-1"
                                variant="outline"
                                onClick={handleLogout}
                            >
                                Выйти
                            </Button>
                        </>
                    )}
                </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};