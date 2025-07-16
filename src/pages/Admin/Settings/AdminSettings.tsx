import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Save, Check, Loader2 } from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { TAB_ITEMS } from '../../../types/types';
import { GeneralSettingsTab } from './components/GeneralSettingsTab';
import { DeliverySettingsTab } from './components/DeliverySettingsTab';
import { PaymentSettingsTab } from './components/PaymentSettingsTab';
import { useSettings } from '../../../lib/context/SettingsContext';
import { useAdmin } from '../../../lib/context/AdminContext';
import { AdminWarningModal } from '../../../components/Admin/AdminWarningModal';

export const AdminSettings = () => {
  const { settings, isLoading, error, updateAllSettingsData } = useSettings();

  const { adminUser } = useAdmin();

  const [activeTab, setActiveTab] = useState('general');
  const [showSavedMessage, setShowSavedMessage] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [localSettings, setLocalSettings] = useState(settings);
  const [showWarningModal, setShowWarningModal] = useState(false);

  // Обновляем локальные настройки при изменении глобальных
  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  const handleSaveSettings = async () => {
    if (!localSettings) return;

    // Проверяем, является ли пользователь администратором
    if (!adminUser || adminUser.role !== 'admin') {
      setShowWarningModal(true);
      return;
    }

    setIsSaving(true);
    try {
      await updateAllSettingsData(localSettings);
      setShowSavedMessage(true);
      setTimeout(() => setShowSavedMessage(false), 3000);
    } catch (error) {
      console.error('Ошибка при сохранении настроек:', error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleGeneralChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    if (!localSettings) return;

    const { name, value } = e.target;
    setLocalSettings({
      ...localSettings,
      general: {
        ...localSettings.general,
        [name]: value,
      },
    });
  };

  const handleDeliveryMethodToggle = (methodId: string) => {
    if (!localSettings) return;

    setLocalSettings({
      ...localSettings,
      delivery: {
        ...localSettings.delivery,
        deliveryMethods: localSettings.delivery.deliveryMethods.map((method) =>
          method.id === methodId ? { ...method, enabled: !method.enabled } : method,
        ),
      },
    });
  };

  const handleDeliveryMethodPriceChange = (methodId: string, price: number) => {
    if (!localSettings) return;

    setLocalSettings({
      ...localSettings,
      delivery: {
        ...localSettings.delivery,
        deliveryMethods: localSettings.delivery.deliveryMethods.map((method) =>
          method.id === methodId ? { ...method, price } : method,
        ),
      },
    });
  };

  const handleAddDeliveryMethod = (newMethod: { id: string; name: string; price: number }) => {
    if (!localSettings) return;

    const methodWithDefaults = {
      ...newMethod,
      enabled: true,
    };

    setLocalSettings({
      ...localSettings,
      delivery: {
        ...localSettings.delivery,
        deliveryMethods: [...localSettings.delivery.deliveryMethods, methodWithDefaults],
      },
    });
  };

  const handleRemoveDeliveryMethod = (methodId: string) => {
    if (!localSettings) return;

    // Проверяем, что остается хотя бы один способ доставки
    if (localSettings.delivery.deliveryMethods.length <= 1) {
      alert('Должен остаться хотя бы один способ доставки');
      return;
    }

    if (confirm('Вы уверены, что хотите удалить этот способ доставки?')) {
      setLocalSettings({
        ...localSettings,
        delivery: {
          ...localSettings.delivery,
          deliveryMethods: localSettings.delivery.deliveryMethods.filter((method) => method.id !== methodId),
        },
      });
    }
  };

  const handlePaymentMethodToggle = (methodId: string) => {
    if (!localSettings) return;

    setLocalSettings({
      ...localSettings,
      payment: {
        ...localSettings.payment,
        paymentMethods: localSettings.payment.paymentMethods.map((method) =>
          method.id === methodId ? { ...method, enabled: !method.enabled } : method,
        ),
      },
    });
  };

  const handleAddPaymentMethod = (newMethod: { id: string; name: string }) => {
    if (!localSettings) return;

    const methodWithDefaults = {
      ...newMethod,
      enabled: true,
    };

    setLocalSettings({
      ...localSettings,
      payment: {
        ...localSettings.payment,
        paymentMethods: [...localSettings.payment.paymentMethods, methodWithDefaults],
      },
    });
  };

  const handleRemovePaymentMethod = (methodId: string) => {
    if (!localSettings) return;

    // Проверяем, что остается хотя бы один способ оплаты
    const enabledMethods = localSettings.payment.paymentMethods.filter((method) => method.enabled);
    if (enabledMethods.length <= 1 && enabledMethods.some((method) => method.id === methodId)) {
      alert('Должен остаться хотя бы один активный способ оплаты');
      return;
    }

    if (confirm('Вы уверены, что хотите удалить этот способ оплаты?')) {
      setLocalSettings({
        ...localSettings,
        payment: {
          ...localSettings.payment,
          paymentMethods: localSettings.payment.paymentMethods.filter((method) => method.id !== methodId),
        },
      });
    }
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-10 w-10 text-blue animate-spin" />
        <p className="text-gray-600">Загрузка настроек...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-red-50/80 border border-red-200 rounded-xl p-4 flex items-start gap-3">
          <div>
            <h3 className="font-medium text-red-800">Ошибка загрузки настроек</h3>
            <p className="text-sm text-red-700 mt-1">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-3 text-sm font-medium text-red-600 hover:text-red-800 transition-colors"
            >
              Попробовать снова
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!localSettings) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <p className="text-gray-600">Настройки не найдены</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-4">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Настройки магазина</h1>
          <p className="text-sm text-gray-500 mt-1">Управление параметрами вашего интернет-магазина</p>
        </div>
        <Button
          className="bg-blue hover:bg-blue-700 text-white rounded-lg flex items-center gap-2 px-4 py-2 transition-colors"
          onClick={handleSaveSettings}
          disabled={isSaving}
        >
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Сохранение...
            </>
          ) : (
            <>
              <Save size={18} />
              Сохранить изменения
            </>
          )}
        </Button>
      </div>

      <AnimatePresence>
        {showSavedMessage && (
          <motion.div
            className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded-lg flex items-center shadow-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            <Check size={18} className="mr-2 text-green-600" />
            <span className="font-medium">Настройки успешно сохранены</span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="flex border-b border-gray-200 overflow-x-auto">
          {TAB_ITEMS.map((tab) => (
            <button
              key={tab.id}
              className={`px-5 py-3 text-sm font-medium whitespace-nowrap flex items-center gap-2 transition-colors ${
                activeTab === tab.id
                  ? 'text-blue border-b-2 border-blue bg-blue-50/50'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <tab.icon size={16} className="opacity-80" />
              {tab.label}
            </button>
          ))}
        </div>

        <div className="p-6">
          {activeTab === 'general' && (
            <GeneralSettingsTab settings={localSettings.general} onChange={handleGeneralChange} />
          )}

          {activeTab === 'delivery' && (
            <DeliverySettingsTab
              settings={localSettings.delivery}
              onToggleMethod={handleDeliveryMethodToggle}
              onMethodPriceChange={handleDeliveryMethodPriceChange}
              onAddMethod={handleAddDeliveryMethod}
              onRemoveMethod={handleRemoveDeliveryMethod}
            />
          )}

          {activeTab === 'payment' && (
            <PaymentSettingsTab
              settings={localSettings.payment}
              onToggleMethod={handlePaymentMethodToggle}
              onAddMethod={handleAddPaymentMethod}
              onRemoveMethod={handleRemovePaymentMethod}
            />
          )}
        </div>
      </div>

      {/* Модальное окно предупреждения для неадминистраторов */}
      <AdminWarningModal isOpen={showWarningModal} onClose={() => setShowWarningModal(false)} />
    </div>
  );
};
