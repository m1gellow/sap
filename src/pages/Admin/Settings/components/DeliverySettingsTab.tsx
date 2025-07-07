import { Truck, Plus, Trash2 } from "lucide-react";
import { DeliverySettings } from "../../../../types";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Input } from "../../../../components/ui/input";
import { Button } from "../../../../components/ui/button";
import { useState } from "react";

interface DeliverySettingsTabProps {
  settings: DeliverySettings;
  onToggleMethod: (methodId: string) => void;
  onMethodPriceChange: (methodId: string, price: number) => void;
  onAddMethod: (method: { id: string; name: string; price: number }) => void;
  onRemoveMethod: (methodId: string) => void;
}

export const DeliverySettingsTab = ({
  settings,
  onToggleMethod,
  onMethodPriceChange,
  onAddMethod,
  onRemoveMethod,
}: DeliverySettingsTabProps) => {
  const [newMethodName, setNewMethodName] = useState('');
  const [newMethodPrice, setNewMethodPrice] = useState('');

  const handleAddNewMethod = () => {
    if (!newMethodName.trim() || !newMethodPrice.trim()) {
      alert('Пожалуйста, заполните название и цену способа доставки');
      return;
    }

    const price = parseFloat(newMethodPrice);
    if (isNaN(price) || price < 0) {
      alert('Пожалуйста, введите корректную цену');
      return;
    }

    const id = newMethodName.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '');
    
    // Проверяем, что такого ID еще нет
    if (settings.deliveryMethods.some(method => method.id === id)) {
      alert('Способ доставки с таким названием уже существует');
      return;
    }

    onAddMethod({
      id,
      name: newMethodName.trim(),
      price,
    });

    setNewMethodName('');
    setNewMethodPrice('');
  };

  return (
    <div className="space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
        <Truck size={20} className="text-blue" />
        Настройки доставки
      </h2>

      <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-100 mb-6">
        <h4 className="text-sm font-medium text-yellow-800 mb-2">Важно!</h4>
        <p className="text-sm text-yellow-700">
          Стоимость доставки автоматически добавляется к общей сумме заказа при оформлении. 
          Убедитесь, что цены указаны корректно.
        </p>
      </div>

      <h3 className="text-lg font-medium text-gray-900 mb-3">Способы доставки</h3>

      <div className="space-y-3">
        {settings.deliveryMethods.map((method) => (
          <div
            key={method.id}
            className={`p-4 rounded-lg border ${
              method.enabled ? 'border-blue-100 bg-blue-50' : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`method-${method.id}`}
                  checked={method.enabled}
                  onCheckedChange={() => onToggleMethod(method.id)}
                  className="h-5 w-5 border-gray-300 rounded text-blue"
                />
                <label htmlFor={`method-${method.id}`} className="text-sm font-medium text-gray-700">
                  {method.name}
                </label>
              </div>
              <div className="flex items-center space-x-3">
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={method.price}
                    onChange={(e) => onMethodPriceChange(method.id, parseInt(e.target.value) || 0)}
                    className="w-24 text-right"
                    disabled={!method.enabled}
                    min="0"
                  />
                  <span className="text-sm text-gray-500">₽</span>
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
          </div>
        ))}
      </div>

      {/* Форма добавления нового способа доставки */}
      <div className="border-t border-gray-200 pt-6">
        <h4 className="text-md font-medium text-gray-900 mb-3">Добавить новый способ доставки</h4>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2">
            <Input
              placeholder="Название способа доставки"
              value={newMethodName}
              onChange={(e) => setNewMethodName(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="flex items-center space-x-2">
            <Input
              type="number"
              placeholder="Цена"
              value={newMethodPrice}
              onChange={(e) => setNewMethodPrice(e.target.value)}
              className="w-full"
              min="0"
            />
            <span className="text-sm text-gray-500">₽</span>
          </div>
        </div>
        <Button
          onClick={handleAddNewMethod}
          className="mt-3   text-white"
        >
          <Plus size={16} className="mr-2" />
          Добавить способ доставки
        </Button>
      </div>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
        <h4 className="text-sm font-medium text-blue mb-2">Информация о доставке</h4>
        <ul className="text-sm text-blue space-y-1">
          <li>• Стоимость доставки автоматически добавляется к сумме заказа</li>
          <li>• Клиенты видят итоговую стоимость с доставкой при оформлении</li>
          <li>• Отключенные способы доставки не отображаются клиентам</li>
          <li>• Цены указываются в рублях</li>
        </ul>
      </div>
    </div>
  );
};