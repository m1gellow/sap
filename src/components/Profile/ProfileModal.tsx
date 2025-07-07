import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { useProfile } from '../../lib/context/ProfileContext';
import { XIcon, UserIcon, PhoneIcon, MapPinIcon, MailIcon, Loader2 } from 'lucide-react';

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
    }
  }, [profile]);

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

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="bg-white rounded-lg shadow-xl max-w-md w-full overflow-hidden"
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            transition={{ type: 'spring', damping: 25 }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Шапка профиля */}
            <div className="relative h-32 bg-gradient-to-r from-blue to-indigo-500">
              <Button
                className="absolute right-2 top-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-2"
                onClick={onClose}
                variant="ghost"
                size="icon"
              >
                <XIcon className="h-5 w-5 text-blue" />
              </Button>

              <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
                <div className="w-32 h-32 rounded-full border-4 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                  {profile.avatar ? (
                    <img src={profile.avatar} alt={profile.name} className="w-full h-full object-cover" />
                  ) : (
                    <UserIcon className="h-16 w-16 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Информация профиля */}
            <div className="pt-20 pb-6 px-6">
              <h2 className="text-2xl font-semibold text-center text-gray-1">
                {editMode ? (
                  <Input
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="text-center font-semibold"
                  />
                ) : (
                  profile.name || 'Пользователь'
                )}
              </h2>

              <div className="mt-6 space-y-4">
                <div className="flex items-center">
                  <MailIcon className="h-5 w-5 text-blue mr-3" />
                  <span>{profile.email}</span>
                </div>

                <div className="flex items-center">
                  <PhoneIcon className="h-5 w-5 text-blue mr-3" />
                  {editMode ? (
                    <Input
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Введите номер телефона"
                    />
                  ) : (
                    <span>{profile.phone || 'Не указан'}</span>
                  )}
                </div>

                <div className="flex items-center">
                  <MapPinIcon className="h-5 w-5 text-blue mr-3" />
                  {editMode ? (
                    <Input
                      name="address"
                      value={formData.address}
                      onChange={handleInputChange}
                      placeholder="Введите адрес"
                    />
                  ) : (
                    <span>{profile.address || 'Не указан'}</span>
                  )}
                </div>
              </div>

              <div className="mt-8 flex space-x-3">
                {editMode ? (
                  <>
                    <Button
                      className="flex-1 bg-blue hover:bg-blue text-skyblue rounded-[53px] flex items-center justify-center"
                      onClick={handleSave}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4  animate-spin" />
                          Сохранение...
                        </>
                      ) : (
                        'Сохранить'
                      )}
                    </Button>
                    <Button
                      className="flex-1 border border-gray-300 text-gray-700 rounded-[53px]"
                      variant="outline"
                      onClick={() => setEditMode(false)}
                      disabled={isLoading}
                    >
                      Отмена
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      className="flex-1 bg-blue hover:bg-blue text-white rounded-[53px]"
                      onClick={() => setEditMode(true)}
                    >
                      Редактировать
                    </Button>
                    <Button
                      className="flex-1 border border-gray-300 text-gray-700 rounded-[53px]"
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