import { useState, useEffect, useMemo } from 'react';
import { CircleUser, Mail, Phone, ShoppingCart, Truck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

import { useCart } from '../lib/context/CartContext';
import { useSettings } from '../lib/context/SettingsContext';
import { useProfile } from '../lib/context/ProfileContext';
import { useAuth } from '../lib/context/AuthContext';
import { supabase } from '../lib/supabase';

import { SectionWrapper } from '../components/ui/SectionWrapper';
import { Breadcrumbs } from '../lib/utils/BreadCrumbs';
import { Button } from '../components/ui/button';

import VisaIcon from '../assets/icons/visa.png';
import SpbIcon from '../assets/icons/spb.png';
import CashIcon from '../assets/icons/cash.png';
import PickupPointModal from '../components/checkout/CheckOutModal';
import { formatPrice } from '../lib/utils/currency';

const Input = ({ placeholder, type = 'text', value, onChange, ...props }) => (
  <input
    type={type}
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    className="w-full text-black bg-white p-[8px] font-normal text-[16px] rounded-[8px] outline-none border border-gray-300 focus:ring-2 focus:ring-blue"
    {...props}
  />
);


const Textarea = ({ placeholder, value, onChange }) => (
  <textarea
    placeholder={placeholder}
    value={value}
    onChange={onChange}
    rows={3}
    className="w-full text-black bg-white outline-none p-[8px] rounded-[4px] border border-gray-300 focus:ring-2 focus:ring-blue"
  />
);


const Select = ({ children, value, onChange, ...props }) => (
  <select
    value={value}
    onChange={onChange}
    className="w-full text-black bg-white p-[8px] font-normal text-[16px] rounded-[8px] outline-none border border-gray-300 focus:ring-2 focus:ring-blue"
    {...props}
  >
    {children}
  </select>
);


const Checkbox = ({ id, checked, onChange }) => (
  <input
    id={id}
    type="checkbox"
    checked={checked}
    onChange={onChange}
    className="h-4 w-4 rounded border-gray-300 text-blue focus:ring-blue"
  />
);


const RadioOption = ({ name, id, children, checked, onChange }) => (
  <label
    htmlFor={id}
    className={`flex w-full cursor-pointer items-center rounded-lg border px-4 py-2.5 transition-all ${
      checked ? 'border-blue bg-blue/10 ring-1 ring-blue' : 'border-gray-300'
    }`}
  >
    <input type="radio" name={name} id={id} checked={checked} onChange={onChange} className="sr-only" />
    <div className="flex w-full items-center justify-between gap-2">{children}</div>
  </label>
);



const PersonalDataPart = ({ profile }) => {
  if (!profile) return null;
  return (
    <div className="rounded-lg bg-skyblue p-5">
      <h2 className="text-xl font-bold text-gray mb-4">Личные данные</h2>
      <div className="flex flex-wrap gap-x-8 gap-y-4">
        <div className="flex items-start gap-[20px]">
          <CircleUser className="text-blue mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray">Пользователь:</h3>
            <p className="text-gray">{profile.name || 'Не указано'}</p>
          </div>
        </div>
        <div className="flex items-start gap-[20px]">
          <Phone className="text-blue mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray">Телефон:</h3>
            <p className="text-gray">{profile.phone || 'Не указан'}</p>
          </div>
        </div>
        <div className="flex items-start gap-[20px]">
          <Mail className="text-blue mt-0.5" />
          <div>
            <h3 className="font-semibold text-gray">Электронная почта:</h3>
            <p className="text-gray">{profile.email || 'Не указана'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DeliveryOptionsPart = ({ deliveryMethods, deliveryMethod, setDeliveryMethod }) => {
  const userCity = 'в Екатеринбурге'; 

  return (
    <div className="rounded-lg bg-skyblue p-5">
      <h2 className="text-xl font-bold text-gray mb-4">
        Способ получения <span>{userCity}</span>
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {deliveryMethods.map((option) => (
          <RadioOption
            key={option.id}
            name="delivery"
            id={option.id}
            checked={deliveryMethod === option.id}
            onChange={() => setDeliveryMethod(option.id)}
          >
            <span className="font-bold text-gray whitespace-nowrap">{option.name}</span>
            <span className="text-blue whitespace-nowrap">-- {option.price}₽</span>
          </RadioOption>
        ))}
      </div>
    </div>
  );
};

const MainInfoPart = ({ formState, setFormState, profile }) => {
    const {
        lastName, firstName, middleName, phone, email, city, region, address, additionalInfo, isSameAsUser
    } = formState;

    const handleCheckboxChange = (e) => {
        const checked = e.target.checked;
        setFormState(prev => ({ ...prev, isSameAsUser: checked }));

        if (checked && profile) {
            const [profLastName = '', profFirstName = '', profMiddleName = ''] = (profile.name || '').split(' ');
            setFormState(prev => ({
                ...prev,
                lastName: profLastName,
                firstName: profFirstName,
                middleName: profMiddleName,
                phone: profile.phone || '',
                email: profile.email || ''
            }));
        }
    };

    const createChangeHandler = (field) => (e) => {
      setFormState(prev => ({ ...prev, [field]: e.target.value }));
    };

    return (
        <div className="rounded-lg bg-skyblue p-5 space-y-6">
            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray">Адрес доставки</h2>
                <div className="grid grid-cols-1 gap-4">
                    <Input placeholder="Город" value={city} onChange={createChangeHandler('city')} />
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Select value={region} onChange={createChangeHandler('region')}>
                            <option value="" disabled>Область, край</option>
                            <option value="svo">Свердловская область</option>
                            <option value="msc">Московская область</option>
                            <option value="spb">Ленинградская область</option>
                        </Select>
                        <Input placeholder="Адрес (улица, дом, квартира)" value={address} onChange={createChangeHandler('address')} />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <h2 className="text-xl font-bold text-gray">Данные получателя</h2>
                <div className='flex items-center gap-2'>
                    <Checkbox id="use-profile-data" checked={isSameAsUser} onChange={handleCheckboxChange} />
                    <label htmlFor="use-profile-data" className="cursor-pointer">Совпадают с данными пользователя</label>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <Input placeholder="Фамилия" value={lastName} onChange={createChangeHandler('lastName')} disabled={isSameAsUser}/>
                    <Input placeholder="Имя" value={firstName} onChange={createChangeHandler('firstName')} disabled={isSameAsUser} />
                    <Input placeholder="Отчество" value={middleName} onChange={createChangeHandler('middleName')} disabled={isSameAsUser} />
                </div>
                <div className="space-y-4">
                    <Input type="tel" placeholder="+7" value={phone} onChange={createChangeHandler('phone')} disabled={isSameAsUser} />
                    <Input type="email" placeholder="Электронная почта" value={email} onChange={createChangeHandler('email')} disabled={isSameAsUser} />
                    <Textarea placeholder="Дополнительная информация" value={additionalInfo} onChange={createChangeHandler('additionalInfo')} />
                </div>
            </div>
        </div>
    );
};

const PaymentOptionsPart = ({ paymentMethods, paymentMethod, setPaymentMethod }) => {
    const paymentOptionsConfig = {
        sbp: { name: 'Оплата СБП', icon: <img src={SpbIcon} alt="SBP" className="h-5" /> },
        card: { name: 'Банковская карта', icon: <img src={VisaIcon} alt="Card logos" className="h-5" /> },
        cash: { name: 'Наличные', icon: <img src={CashIcon} alt="Cash" className="h-5" /> },
    };
    return (
        <div className="rounded-lg bg-skyblue p-5">
            <h2 className="text-xl font-bold text-gray mb-4">Способ оплаты</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {paymentMethods.map((option) => (
                    <RadioOption
                        key={option.id}
                        name="payment"
                        id={option.id}
                        checked={paymentMethod === option.id}
                        onChange={() => setPaymentMethod(option.id)}
                    >
                        <span className="font-medium text-gray">{paymentOptionsConfig[option.id]?.name || option.name}</span>
                        {paymentOptionsConfig[option.id]?.icon}
                    </RadioOption>
                ))}
            </div>
        </div>
    );
};

const ResultPart = ({ cartItems, totalPrice,totalPriceInMainUnit, deliveryPrice, currency, finalTotal, deliveryMethodName, onSubmit }) => {
  return (
    <div className="rounded-lg border-[2px] border-blue p-6 space-y-4">
      <h3 className="text-lg font-bold text-gray">{cartItems.length} товара</h3>
      <div className="space-y-3 text-gray">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <ShoppingCart className="h-5 w-5 text-gray" />
            <span>Цена товаров:</span>
          </div>
          <span>{totalPrice.toLocaleString()}₽</span>
        </div>
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <Truck className="h-5 w-5 text-gray" />
            <span>Доставка ({deliveryMethodName}):</span>
          </div>
          <span>{deliveryPrice > 0 ? `${deliveryPrice.toLocaleString()}₽` : 'Бесплатно'}</span>
        </div>
      </div>
      <hr className="my-4" />
      <div className="flex justify-between items-center">
        <span className="text-xl font-bold text-gray">Итого:</span>
        <span className="text-xl font-bold text-gray">{formatPrice(totalPriceInMainUnit, currency)}</span>
      </div>
      <Button onClick={onSubmit} className="w-full">Оплатить</Button>
    </div>
  );
};




const DeliveryPage = () => {
  const { clearCart, totalPrice, cartItems } = useCart();
  const { settings } = useSettings();
  const { isAuthenticated, setShowProfileModal, profile, updateProfile } = useProfile();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formState, setFormState] = useState({
      lastName: '', firstName: '', middleName: '',
      phone: '', email: '', city: '', region: '',
      address: '', additionalInfo: '', isSameAsUser: true
  });

    const totalPriceInMainUnit = totalPrice / 100;
   const currency = settings?.general?.currency || 'RUB';
  
  const [deliveryMethod, setDeliveryMethod] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('sbp');
  
  // Состояние для данных банковской карты
  const [cardNumber, setCardNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState('');
  const [cvv, setCvv] = useState('');


  useEffect(() => {
    if (!isAuthenticated) {
      setShowProfileModal(true);
    }
  }, [isAuthenticated, setShowProfileModal]);


  useEffect(() => {
    if (profile && formState.isSameAsUser) {
        const [profLastName = '', profFirstName = '', profMiddleName = ''] = (profile.name || '').split(' ');
        const profileAddress = (profile.address || '').split(', ');
        
        setFormState(prev => ({
            ...prev,
            lastName: profLastName,
            firstName: profFirstName,
            middleName: profMiddleName,
            phone: profile.phone || '',
            email: profile.email || '',
            city: profileAddress[0] || '',
            address: profileAddress.slice(1).join(', ') || ''
        }));
    }
  }, [profile, formState.isSameAsUser]);



  const deliveryMethods = useMemo(() => 
    settings?.delivery?.deliveryMethods?.filter((method) => method.enabled) || [
      { id: 'cdek', name: 'СДЭК', price: 300 },
      { id: 'pickup', name: 'Самовывоз', price: 0 },
      { id: 'yandex', name: 'Яндекс Такси', price: 400 },
    ], [settings]);

  const paymentMethods = useMemo(() => {
    const baseMethods = settings?.payment?.paymentMethods?.filter((m) => m.enabled) || [
      { id: 'sbp', name: 'СБП', enabled: true },
      { id: 'card', name: 'Банковская карта', enabled: true },
    ];

    if (formState.city.toLowerCase().trim() === 'екатеринбург') {
        const cashMethod = { id: 'cash', name: 'Наличные', enabled: true };
        if (!baseMethods.some(m => m.id === 'cash')) {
            baseMethods.push(cashMethod);
        }
    }
    return baseMethods;
  }, [settings, formState.city]);

  useEffect(() => {
    if (deliveryMethods.length > 0 && !deliveryMethod) {
      setDeliveryMethod(deliveryMethods[0].id);
    }
  }, [deliveryMethods, deliveryMethod]);
  

  useEffect(() => {
    if (!paymentMethods.some(m => m.id === paymentMethod)) {
      setPaymentMethod(paymentMethods[0]?.id || '');
    }
  }, [paymentMethods, paymentMethod]);


  const selectedDeliveryMethod = useMemo(() => 
    deliveryMethods.find((method) => method.id === deliveryMethod), 
    [deliveryMethods, deliveryMethod]
  );
  const deliveryPrice = selectedDeliveryMethod?.price || 0;
  const finalTotal = totalPrice + deliveryPrice;

  // Обработчики для полей ввода данных карты
  const handleCardNumberChange = (e) => {
    const value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = value.match(/\d{1,16}/g);
    const match = (matches && matches[0]) || '';
    const parts = [];
    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }
    setCardNumber(parts.length ? parts.join(' ') : e.target.value);
  };

  const handleExpiryDateChange = (e) => {
    const value = e.target.value.replace(/\D/g, '');
    if (value.length <= 2) {
      setExpiryDate(value);
    } else {
      setExpiryDate(`${value.slice(0, 2)}/${value.slice(2, 4)}`);
    }
  };

  const handleCvvChange = (e) => {
    setCvv(e.target.value.replace(/\D/g, ''));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      setShowProfileModal(true);
      return;
    }
    if (!deliveryMethod || !paymentMethod) {
      alert('Пожалуйста, выберите способ доставки и оплаты');
      return;
    }

    try {
      const fullAddress = `${formState.city}, ${formState.region}, ${formState.address}`;
      const fullName = `${formState.lastName} ${formState.firstName} ${formState.middleName}`.trim();

      await updateProfile({
        name: fullName,
        phone: formState.phone,
        address: fullAddress,
      });

      const newOrder = {
        user_id: user?.id,
        total_amount: finalTotal,
        status: 'Ожидает оплаты',
        customer_name: fullName,
        customer_email: formState.email,
        customer_phone: formState.phone,
        delivery_address: fullAddress,
        payment_method: paymentMethods.find((m) => m.id === paymentMethod)?.name || paymentMethod,
        notes: formState.additionalInfo
          ? `${formState.additionalInfo}. Способ доставки: ${selectedDeliveryMethod?.name} (${deliveryPrice} ₽)`
          : `Способ доставки: ${selectedDeliveryMethod?.name} (${deliveryPrice} ₽)`,
      };
      
      const { data: orderData, error: orderError } = await supabase.from('orders').insert(newOrder).select().single();
      if (orderError) throw orderError;

      const orderItems = cartItems.map((item) => ({
        order_id: orderData.id,
        product_id: item.product.id,
        quantity: item.quantity,
        price: item.product.sale_price,
      }));
      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      clearCart();
      navigate(`/order-sucess`);

    } catch (error) {
      console.error('Ошибка при создании заказа:', error);
      alert('Произошла ошибка при оформлении заказа. Пожалуйста, попробуйте снова.');
    }
  };



  if (!isAuthenticated) {
    return (
      <SectionWrapper title="Оформление заказа">
        <div className="text-center py-10">
          <h2 className="text-2xl font-bold text-gray mb-4">Требуется авторизация</h2>
          <p className="text-gray mb-6">Для оформления заказа необходимо войти в систему.</p>
          <Button onClick={() => setShowProfileModal(true)}>
            Войти или зарегистрироваться
          </Button>
        </div>
      </SectionWrapper>
    );
  }

  return (
    <div className="bg-white p-4 font-sans">
      <div className='absolute'>
          {/* <PickupPointModal isOpen={true} onClose={() => false}/> */}
      </div>
      <SectionWrapper title="Оформление заказа" className="px-4 lg:px-8">
        <Breadcrumbs />
        <div className="mx-auto flex flex-col gap-[20px]">
            <div className="lg:col-span-2 space-y-5">
                <PersonalDataPart profile={profile} />
                <DeliveryOptionsPart
                    deliveryMethods={deliveryMethods}
                    deliveryMethod={deliveryMethod}
                    setDeliveryMethod={setDeliveryMethod}
                />
                <MainInfoPart 
                    formState={formState}
                    setFormState={setFormState}
                    profile={profile}
                />
                <PaymentOptionsPart
                    paymentMethods={paymentMethods}
                    paymentMethod={paymentMethod}
                    setPaymentMethod={setPaymentMethod}
                />
                
                {/* Условный рендеринг формы для данных карты */}
                {paymentMethod === 'card' && (
                  <div className="rounded-lg bg-skyblue p-5 space-y-4">
                    <h2 className="text-xl font-bold text-gray">Данные банковской карты</h2>
                    <div className="space-y-4">
                      <Input
                        placeholder="Номер карты"
                        value={cardNumber}
                        onChange={handleCardNumberChange}
                        maxLength="19" // 16 цифр + 3 пробела
                        required={paymentMethod === 'card'}
                      />
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <Input
                          placeholder="ММ / ГГ"
                          value={expiryDate}
                          onChange={handleExpiryDateChange}
                          maxLength="5" // MM/YY
                          required={paymentMethod === 'card'}
                        />
                        <Input
                          placeholder="CVV"
                          type="password"
                          value={cvv}
                          onChange={handleCvvChange}
                          maxLength="3"
                          required={paymentMethod === 'card'}
                        />
                      </div>
                    </div>
                  </div>
                )}

            </div>
       
                <ResultPart
                totalPriceInMainUnit={totalPriceInMainUnit}
                currency={currency}
                    cartItems={cartItems}
                    totalPrice={totalPrice}
                    deliveryPrice={deliveryPrice}
                    finalTotal={finalTotal}
                    deliveryMethodName={selectedDeliveryMethod?.name || 'Не выбрана'}
                    onSubmit={handleSubmit}
                />
      
        </div>
      </SectionWrapper>
    </div>
  );
};

export default DeliveryPage;