import React, { useState, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Textarea } from '../components/ui/textarea';
import { CheckIcon, ChevronDownIcon } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../lib/context/CartContext';
import { useSettings } from '../lib/context/SettingsContext';
import { useProfile } from '../lib/context/ProfileContext';
import { useAuth } from '../lib/context/AuthContext';
import { supabase } from '../lib/supabase';
import { icons } from '../assets/icons';

const DeliveryPage = () => {
  const { clearCart, totalPrice, cartItems } = useCart();
  const { settings } = useSettings();
  const { isAuthenticated, setShowProfileModal, profile, updateProfile } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();

  // State for form inputs
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [region, setRegion] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [address, setAddress] = useState('');
  const [additionalInfo, setAdditionalInfo] = useState('');

  // State for delivery method
  const [deliveryMethod, setDeliveryMethod] = useState('');

  // State for payment method
  const [paymentMethod, setPaymentMethod] = useState('card');

  // State for card payment
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');

  // Проверяем аутентификацию при загрузке страницы
  useEffect(() => {
    if (!isAuthenticated) {
      setShowProfileModal(true);
    }
  }, [isAuthenticated, setShowProfileModal]);

  // Заполняем форму данными из профиля пользователя
  useEffect(() => {
    if (profile) {
      setEmail(profile.email || '');
      setName(profile.name || '');
      setPhone(profile.phone || '');
      
      // Парсим адрес если он есть
      if (profile.address) {
        const addressParts = profile.address.split(', ');
        if (addressParts.length >= 2) {
          setCity(addressParts[0] || '');
          setAddress(addressParts.slice(1).join(', ') || '');
        } else {
          setAddress(profile.address);
        }
      }
    }
  }, [profile]);

  // Получаем настройки доставки и оплаты
  const deliveryMethods = settings?.delivery?.deliveryMethods?.filter(method => method.enabled) || [
    { id: 'cdek', name: 'СДЭК', enabled: true, price: 300 },
    { id: 'russian_post', name: 'Почта России', enabled: true, price: 250 },
    { id: 'yandex_taxi', name: 'Яндекс Такси', enabled: true, price: 400 },
  ];

  // Получаем базовые способы оплаты
  const basePaymentMethods = settings?.payment?.paymentMethods?.filter(method => method.enabled) || [
    { id: 'card', name: 'Банковская карта', enabled: true },
    { id: 'sbp', name: 'СБП', enabled: true },
  ];

  // Фильтруем способы оплаты в зависимости от выбранного города
  const paymentMethods = React.useMemo(() => {
    // Базовые способы оплаты доступны всегда
    const methods = [...basePaymentMethods];
    
    // Добавляем оплату наличными только для Екатеринбурга
    if (city.toLowerCase() === 'екатеринбург') {
      const cashMethod = settings?.payment?.paymentMethods?.find(m => m.id === 'cash');
      if (cashMethod) {
        methods.push(cashMethod);
      } else {
        methods.push({ id: 'cash', name: 'Наличными при получении', enabled: true });
      }
    }
    
    return methods;
  }, [city, basePaymentMethods, settings?.payment?.paymentMethods]);

  // Сбрасываем способ оплаты, если он больше не доступен
  useEffect(() => {
    if (paymentMethod === 'cash' && !paymentMethods.some(m => m.id === 'cash')) {
      setPaymentMethod('card');
    }
  }, [paymentMethods, paymentMethod]);

  // Устанавливаем первый доступный способ доставки по умолчанию
  useEffect(() => {
    if (deliveryMethods.length > 0 && !deliveryMethod) {
      setDeliveryMethod(deliveryMethods[0].id);
    }
  }, [deliveryMethods, deliveryMethod]);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Проверяем аутентификацию перед отправкой
    if (!isAuthenticated) {
      setShowProfileModal(true);
      return;
    }
    
    if (!deliveryMethod) {
      alert('Пожалуйста, выберите способ доставки');
      return;
    }
    
    try {
      // Находим выбранный способ доставки
      const selectedDeliveryMethod = deliveryMethods.find(method => method.id === deliveryMethod);
      const deliveryPrice = selectedDeliveryMethod?.price || 0;
      const finalTotal = totalPrice + deliveryPrice;

      // Обновляем профиль пользователя с новыми данными
      await updateProfile({
        name,
        phone,
        address: `${city}, ${region}, ${address}, ${zipCode}`,
      });

      // 1. Создаем объект заказа с данными из формы
      const newOrder = {
        user_id: user.id, // Используем ID авторизованного пользователя
        total_amount: finalTotal, // Включаем стоимость доставки
        status: "Ожидает оплаты",
        customer_name: name,
        customer_email: email,
        customer_phone: phone,
        delivery_address: `${city}, ${region}, ${address}, ${zipCode}`,
        payment_method: paymentMethods.find(method => method.id === paymentMethod)?.name || paymentMethod,
        notes: additionalInfo ? `${additionalInfo}. Способ доставки: ${selectedDeliveryMethod?.name} (${deliveryPrice} ₽)` : `Способ доставки: ${selectedDeliveryMethod?.name} (${deliveryPrice} ₽)`
      };

      // 2. Вставляем заказ в таблицу orders
      const { data: orderData, error: orderError } = await supabase
        .from('orders')
        .insert(newOrder)
        .select()
        .single();

      if (orderError) throw orderError;

      // 3. Создаем записи о товарах заказа
      const orderItems = cartItems.map(item => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.priceValue
      }));

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems);

      if (itemsError) throw itemsError;

      clearCart();

      // 4. Перенаправляем на страницу подтверждения
      navigate(`/order-sucess`);

    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте снова.');
    }
  };

  // Format card number with spaces
  const formatCardNumber = (value) => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  // Handle card number input
  const handleCardNumberChange = (e) => {
    const value = e.target.value;
    setCardNumber(formatCardNumber(value));
  };

  // Format expiry date
  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      setExpiryDate(value);
    } else {
      setExpiryDate(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    }
  };

  // Рассчитываем стоимость доставки
  const selectedDeliveryMethod = deliveryMethods.find(method => method.id === deliveryMethod);
  const deliveryPrice = selectedDeliveryMethod?.price || 0;
  const finalTotal = totalPrice + deliveryPrice;

  // Если пользователь не авторизован, показываем сообщение
  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-md mx-auto text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Требуется авторизация</h2>
          <p className="text-gray-600 mb-6">
            Для оформления заказа необходимо войти в систему или зарегистрироваться.
          </p>
          <Button 
            onClick={() => setShowProfileModal(true)}
            className="bg-blue text-white px-6 py-3 rounded-lg"
          >
            Войти или зарегистрироваться
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-6">
      {/* Хлебные крошки */}
      <div className="text-sm text-gray-500 mb-6">
        <Link to="/" className="hover:text-blue">
          Главная
        </Link>
        <span className="mx-2">›</span>
        <Link to="/cart" className="hover:text-blue">
          Корзина
        </Link>
        <span className="mx-2">›</span>
        <span className="text-gray-700">Доставка</span>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Левая колонка - информация о доставке */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Способ доставки</h2>

          <div className="flex flex-wrap gap-4 mb-8">
            {deliveryMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                className={`py-3 px-6 rounded-lg border ${
                  deliveryMethod === method.id ? 'border-blue-4 bg-blue-50' : 'border-gray-200'
                } flex flex-col items-center justify-center transition-colors min-w-[140px]`}
                onClick={() => setDeliveryMethod(method.id)}
              >
                <span className="font-medium">{method.name}</span>
                <span className="text-sm text-gray-500 mt-1">{method.price} ₽</span>
                {deliveryMethod === method.id && <CheckIcon className="mt-2 h-4 w-4 text-blue" />}
              </button>
            ))}
          </div>

          <h2 className="text-xl font-semibold text-gray-800 mb-6">Адрес доставки</h2>

          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                type="email"
                placeholder="E-mail"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="rounded-lg"
                disabled
              />

              <Input
                type="tel"
                placeholder="+7 999 456 89 84"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>

            <Input
              placeholder="ФИО"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="rounded-lg"
            />

            <Input
              placeholder="Город"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
              className="rounded-lg"
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="relative">
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  required
                  className="w-full h-10 px-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-4 appearance-none"
                >
                  <option value="" disabled>
                    Область, край
                  </option>
                  <option value="moscow">Москва</option>
                  <option value="spb">Санкт-Петербург</option>
                  <option value="ekb">Свердловская область</option>
                </select>
                <ChevronDownIcon className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              </div>

              <Input
                placeholder="Индекс"
                value={zipCode}
                onChange={(e) => setZipCode(e.target.value)}
                required
                className="rounded-lg"
              />
            </div>

            <Input
              placeholder="Адрес"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
              className="rounded-lg"
            />

            <Textarea
              placeholder="Дополнительная информация"
              value={additionalInfo}
              onChange={(e) => setAdditionalInfo(e.target.value)}
              className="min-h-[100px] rounded-lg"
            />
          </div>
        </div>

        {/* Правая колонка - способ оплаты */}
        <div>
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Способ оплаты</h2>

          <div className="flex flex-wrap gap-4 mb-8">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                className={`py-3 px-6 rounded-lg border ${
                  paymentMethod === method.id ? 'border-blue bg-blue-50' : 'border-gray-200'
                } flex items-center justify-center transition-colors`}
                onClick={() => setPaymentMethod(method.id)}
              >
                {method.id === 'card' && (
                  <div className="flex items-center">
                    <img src={icons.visa} alt="Visa" className="h-8" />
                    <img src={icons.mastercard} alt="Mastercard" className="h-8 ml-2" />
                  </div>
                )}
                {method.id === 'sbp' && (
                  <img src={icons.spb} alt="СБП" className="h-8" />
                )}
                {method.id === 'cash' && (
                  <span className="font-medium">{method.name}</span>
                )}
                {paymentMethod === method.id && <CheckIcon className="ml-2 h-4 w-4 text-blue" />}
              </button>
            ))}
          </div>

          {city.toLowerCase() !== 'екатеринбург' && paymentMethod === 'cash' && (
            <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-md text-sm">
              Оплата наличными доступна только для Екатеринбурга
            </div>
          )}

          {city.toLowerCase() === 'екатеринбург' && (
            <div className="mb-4 p-3 bg-green-100 text-green-800 rounded-md text-sm">
              Для Екатеринбурга доступна оплата наличными при получении
            </div>
          )}

          {paymentMethod === 'card' && (
            <div className="mb-8">
              <p className="text-sm text-gray-600 mb-4">Введите данные карты</p>

              <div className="space-y-4">
                <Input
                  placeholder="Номер карты"
                  value={cardNumber}
                  onChange={handleCardNumberChange}
                  maxLength={19}
                  required={paymentMethod === 'card'}
                  className="rounded-lg"
                />

                <div className="grid grid-cols-2 gap-4">
                  <Input
                    placeholder="MM / ГГ"
                    value={expiryDate}
                    onChange={handleExpiryDateChange}
                    maxLength={5}
                    required={paymentMethod === 'card'}
                    className="rounded-lg"
                  />

                  <Input
                    placeholder="CVC"
                    value={cvv}
                    onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                    maxLength={3}
                    type="password"
                    required={paymentMethod === 'card'}
                    className="rounded-lg"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Итоги заказа */}
          <div className="bg-white rounded-lg p-6 shadow-sm mb-8 border border-gray-200">
            <h3 className="font-semibold text-gray-800 mb-4">Итог</h3>

            <div className="flex justify-between mb-2">
              <span className="text-gray-600">Товары</span>
              <span className="font-medium">{totalPrice.toLocaleString()} ₽</span>
            </div>

            <div className="flex justify-between mb-2">
              <span className="text-gray-600">
                Доставка ({selectedDeliveryMethod?.name})
              </span>
              <span className="font-medium">
                {deliveryPrice.toLocaleString()} ₽
              </span>
            </div>

            <div className="flex justify-between pt-2 mt-2 border-t border-gray-100">
              <span className="font-semibold">Итого</span>
              <span className="font-bold text-lg">{finalTotal.toLocaleString()} ₽</span>
            </div>
          </div>

          <Button type="submit" className="w-full bg-gray-800 text-white rounded-full py-4 font-medium">
            {paymentMethod === 'cash' ? 'ОФОРМИТЬ ЗАКАЗ' : 'ОПЛАТИТЬ'} {finalTotal.toLocaleString()} ₽
          </Button>

          <p className="text-xs text-center text-gray-500 mt-3">
            Я согласен с <span className="text-blue underline cursor-pointer">условиями покупки</span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default DeliveryPage;