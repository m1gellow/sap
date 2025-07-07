import { Bell } from "lucide-react";
import { NotificationSettings } from "../../../../types";
import { Checkbox } from "@radix-ui/react-checkbox";
import { Input } from "../../../../components/ui/input";

interface NotificationSettingsTabProps {
  settings: NotificationSettings;
  onChange: (field: string, value: boolean | string) => void;
}

export const NotificationSettingsTab = ({
  settings,
  onChange,
}: NotificationSettingsTabProps) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <Bell size={20} className="text-blue" />
      Настройки уведомлений
    </h2>

    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Уведомления администратора</h3>
      
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <Checkbox
            id="enableOrderNotifications"
            checked={settings.enableOrderNotifications}
            onCheckedChange={(checked) => onChange('enableOrderNotifications', checked)}
            className="h-5 w-5 border-gray-300 rounded text-blue"
          />
          <label htmlFor="enableOrderNotifications" className="text-sm text-gray-700">
            Уведомления о новых заказах
          </label>
        </div>

        <div className="flex items-center space-x-3">
          <Checkbox
            id="enableLowStockNotifications"
            checked={settings.enableLowStockNotifications}
            onCheckedChange={(checked) => onChange('enableLowStockNotifications', checked)}
            className="h-5 w-5 border-gray-300 rounded text-blue"
          />
          <label htmlFor="enableLowStockNotifications" className="text-sm text-gray-700">
            Уведомления о заканчивающихся товарах
          </label>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">Email для уведомлений</label>
          <Input
            type="email"
            value={settings.notificationEmail}
            onChange={(e) => onChange('notificationEmail', e.target.value)}
            className="w-full md:w-1/2"
            placeholder="admin@example.com"
          />
        </div>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900 mb-3">Уведомления клиентов</h3>
      
      <div className="flex items-center space-x-3">
        <Checkbox
          id="enableCustomerNotifications"
          checked={settings.enableCustomerNotifications}
          onCheckedChange={(checked) => onChange('enableCustomerNotifications', checked)}
          className="h-5 w-5 border-gray-300 rounded text-blue"
        />
        <label htmlFor="enableCustomerNotifications" className="text-sm text-gray-700">
          Отправлять уведомления клиентам о статусе заказа
        </label>
      </div>
    </div>

    <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-100">
      <h4 className="text-sm font-medium text-yellow-800 mb-2">Важная информация</h4>
      <p className="text-sm text-yellow-700">
        Для работы уведомлений необходимо настроить SMTP-сервер или интеграцию с почтовым сервисом.
        Обратитесь к разработчику для настройки отправки email.
      </p>
    </div>
  </div>
);