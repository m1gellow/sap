import { CreditCard, Plus, Trash2 } from "lucide-react";
import { PaymentSettings } from "../../../../types";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { useState } from "react";

interface PaymentSettingsTabProps {
  settings: PaymentSettings;
  onToggleMethod: (methodId: string) => void;
  onAddMethod: (method: { id: string; name: string }) => void;
  onRemoveMethod: (methodId: string) => void;
}

export const PaymentSettingsTab = ({
  settings,
  onToggleMethod,
  onAddMethod,
  onRemoveMethod,
}: PaymentSettingsTabProps) => {
  const [newMethodName, setNewMethodName] = useState('');

  const handleAddNewMethod = () => {
    if (!newMethodName.trim()) {
      alert('Пожалуйста, введите название способа оплаты');
      return;
    }

    const id = newMethodName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    
    // Проверяем, что такого ID еще нет
    if (settings.paymentMethods.some(method => method.id === id)) {
      alert('Способ оплаты с таким названием уже существует');
      return;
    }

    onAddMethod({
      id,
      name: newMethodName.trim(),
    });

    setNewMethodName('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <CreditCard size={20} className="text-blue" />
        Настройки оплаты
      </h2>

      <div className="p-4 bg-blue-50 rounded-lg border border-blue-100 mb-6">
        <h4 className="text-sm font-medium text-blue mb-2">Информация</h4>
        <p className="text-sm text-blue">
          Управляйте доступными способами оплаты для ваших клиентов. 
          Отключенные способы оплаты не будут отображаться при оформлении заказа.
        </p>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-3">Способы оплаты</h3>

      <div className="space-y-3">
        {settings.paymentMethods.map((method) => (
          <div
            key={method.id}
            className={`p-4 rounded-lg border ${
              method.enabled ? 'border-blue-100 bg-blue-50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`payment-method-${method.id}`}
                  checked={method.enabled}
                  onCheckedChange={() => onToggleMethod(method.id)}
                  className="h-5 w-5 border-gray-300 rounded text-blue"
                />
                <label htmlFor={`payment-method-${method.id}`} className="text-sm font-medium text-gray-700">
                  {method.name}
                </label>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onRemoveMethod(method.id)}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                <Trash2 size={16} />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {/* Форма добавления нового способа оплаты */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Добавить новый способ оплаты</h4>
        <div className="flex items-center space-x-3">
          <Input
            placeholder="Название способа оплаты"
            value={newMethodName}
            onChange={(e) => setNewMethodName(e.target.value)}
            className="flex-1"
          />
          <Button
            onClick={handleAddNewMethod}
            className="bg-blue text-white"
          >
            <Plus size={16} className="mr-2 " />
            Добавить
          </Button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="text-sm font-medium text-blue mb-2">Информация о способах оплаты</h4>
        <ul className="text-sm text-blue space-y-1">
          <li>• Банковская карта - онлайн оплата через защищенный шлюз</li>
          <li>• СБП - быстрые платежи через мобильное приложение банка</li>
          <li>• Наличными при получении - оплата курьеру или в пункте выдачи</li>
          <li>• Отключенные способы оплаты не отображаются клиентам</li>
          <li>• Должен остаться хотя бы один активный способ оплаты</li>
        </ul>
      </div>
    </div>
  );
};