import { Server } from "lucide-react";
import { CURRENCY_OPTIONS, GeneralSettings } from "../../../../types";
import { Input } from "../../../../components/ui/input";


interface GeneralSettingsTabProps {
  settings: GeneralSettings;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
}

export const GeneralSettingsTab = ({ settings, onChange }: GeneralSettingsTabProps) => (
  <div className="space-y-6">
    <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center gap-2">
      <Server size={20} className="text-blue" />
      Общие настройки
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {[
        { id: 'siteName', label: 'Название сайта', type: 'text' },
        { id: 'siteDescription', label: 'Описание сайта', type: 'text' },
        { id: 'contactEmail', label: 'Контактный email', type: 'email' },
        { id: 'contactPhone', label: 'Контактный телефон', type: 'text' },
      ].map((field) => (
        <div key={field.id} className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">{field.label}</label>
          <Input
            type={field.type}
            name={field.id}
            value={settings[field.id as keyof GeneralSettings]}
            onChange={onChange}
            className="w-full"
          />
        </div>
      ))}

      <div className="md:col-span-2 space-y-2">
        <label className="block text-sm font-medium text-gray-700">Адрес</label>
        <Input
          type="text"
          name="address"
          value={settings.address}
          onChange={onChange}
        />
      </div>

      <div className="space-y-2">
        <label className="block text-sm font-medium text-gray-700">Валюта</label>
        <select
          name="currency"
          value={settings.currency}
          onChange={onChange}
          className="w-full h-10 pl-3 pr-10 rounded-md border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
        >
          {CURRENCY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  </div>
);